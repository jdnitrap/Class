"""Integrated generation engine using RL, rules, Markov chains, and decision trees"""

from __future__ import annotations

from pathlib import Path
from .reinforcement import ReinforcementLearner
from .rules import RuleLearner
from .markov import MarkovGraphChains
from .decision_trees import DecisionTreeFormatter


class GenerationEngineV2:
    """Next-generation text generation using multiple learned models"""

    def __init__(self, graph):
        self.graph = graph

        # Initialize all learning components
        self.rl = ReinforcementLearner(graph, exploration_rate=0.15, learning_rate=0.2)
        self.rules = RuleLearner()
        self.markov = MarkovGraphChains(graph)
        self.formatter = DecisionTreeFormatter()

    def generate(self, query: str, max_length: int = 5, show_reasoning: bool = True) -> dict:
        """Generate text using all learned components"""
        # Start with walk to find initial node
        candidates = self.graph.walk(query, hops=2)
        if not candidates:
            return {"text": "", "reasoning": "No candidates found"}

        start_node = candidates[0]

        # Generate path using RL
        path = self._generate_path_with_rl(start_node, max_length)

        # Check if rules apply
        applicable_rules = self.rules.get_applicable_rules({"path_length": len(path)})

        # Get formatting from decision tree
        features = {
            "path_length": len(path),
            "first_node_length": len(start_node),
            "num_applicable_rules": len(applicable_rules),
        }
        format_type = self.formatter.predict(features)

        # Combine into output
        text = self._path_to_text(path)

        reasoning = {
            "start_node": start_node,
            "path": path,
            "path_probability": self.markov.get_sequence_probability(path),
            "rl_path_quality": self._evaluate_path(path),
            "applicable_rules": len(applicable_rules),
            "format": format_type,
            "confidence": self._compute_confidence(path, applicable_rules),
        }

        return {
            "text": text,
            "reasoning": reasoning if show_reasoning else None,
        }

    def _generate_path_with_rl(self, start: str, max_length: int) -> list[str]:
        """Generate path using RL policy"""
        path = [start]
        current = start

        for _ in range(max_length - 1):
            if current not in self.graph.edges or not self.graph.edges[current]:
                break

            # Get next node using RL policy
            policy = self.rl.get_policy(current)
            if not policy:
                break

            # Pick action with highest probability
            next_node = max(policy, key=policy.get)
            path.append(next_node)

            # Check Markov prediction
            predicted = self.markov.predict_next_nodes(path)
            if predicted and predicted[0][1] > 0.7:
                current = predicted[0][0]  # Use Markov suggestion
            else:
                current = next_node

        return path

    def _path_to_text(self, path: list[str]) -> str:
        """Convert path to readable text"""
        if not path:
            return ""

        # Extract key words and combine
        words = []
        for i, node in enumerate(path):
            tokens = node.split()
            if tokens:
                words.append(tokens[0])

        if len(words) == 1:
            return path[0]

        # Build sentence with templates
        templates = [
            "{} {}",
            "{} loves {}",
            "{} then {}",
            "{} and {}",
        ]

        template = templates[len(words) % len(templates)]
        try:
            return template.format(*words[: len(template.split())])
        except:
            return " ".join(words)

    def _evaluate_path(self, path: list[str]) -> float:
        """Evaluate path quality using RL"""
        if len(path) < 2:
            return 0.5

        quality = 0.0
        for i in range(len(path) - 1):
            src = path[i]
            dst = path[i + 1]
            edge_value = self.rl.get_edge_value(src, dst)
            quality += edge_value

        return quality / (len(path) - 1)

    def _compute_confidence(self, path: list[str], rules: list) -> float:
        """Compute overall generation confidence"""
        # RL component
        rl_confidence = max(0.0, self._evaluate_path(path))

        # Markov component
        markov_prob = self.markov.get_sequence_probability(path)

        # Rules component
        rule_confidence = sum(r.confidence for r in rules) / max(1, len(rules)) if rules else 0.5

        # Average with weighting
        overall = (rl_confidence * 0.4 + markov_prob * 0.3 + rule_confidence * 0.3)
        return min(1.0, overall)

    def learn_from_generation(
        self, query: str, path: list[str], output: str, feedback: bool
    ) -> None:
        """Learn from user feedback on generation"""
        if not path:
            return

        # RL learning
        self.rl.learn_from_feedback(path, feedback, reward=1.0)

        # Rule learning
        features = {"query_length": len(query), "path_length": len(path)}
        self.rules.learn_from_generation(features, output, feedback)

        # Markov learning
        self.markov.observe_path(path)

        # Decision tree training
        features_for_tree = {
            "query_length": len(query),
            "path_length": len(path),
            "output_length": len(output),
        }
        self.formatter.add_training_example(features_for_tree, output, feedback)

        # Rebuild tree if enough data
        if len(self.formatter.training_data) % 10 == 0:
            self.formatter.learn_tree()

    def get_generation_stats(self) -> dict:
        """Get statistics about all learning components"""
        return {
            "reinforcement_learning": self.rl.get_learning_stats(),
            "rule_learning": self.rules.get_learning_stats(),
            "markov_chains": self.markov.get_stats(),
            "decision_tree": {
                "training_examples": len(self.formatter.training_data),
                "feature_importance": self.formatter.get_feature_importance(),
            },
        }

    def get_top_patterns(self) -> dict:
        """Get top learned patterns across all components"""
        return {
            "top_rl_edges": self.rl.get_top_edges(limit=5),
            "top_rules": [(str(r), r.confidence) for r in self.rules.get_top_rules(limit=5)],
            "common_sequences": self.markov.get_common_sequences(length=2, limit=5),
        }

    def export_models(self) -> dict:
        """Export all learned models"""
        return {
            "rl_policy": self.rl.export_policy(),
            "rules": self.rules.export_rules(),
            "decision_tree": self.formatter.export_tree(),
        }
