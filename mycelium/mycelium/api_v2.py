"""Production API with persistent learning and evaluation"""

from __future__ import annotations

from pathlib import Path

from .graph import Graph
from .learning import EdgeLearner
from .semantic import SemanticMatcher
from .generator import TextGenerator
from .performance import PerformanceOptimizer
from .memory import TemporalMemory
from .persistence import LearnerPersistence
from .evaluation import Evaluator
from .nlp import EntityRecognizer, RelationExtractor, TextNormalizer


class MyceliumAPI:
    """Production-ready API with learning, evaluation, and persistence"""

    def __init__(self, graph_path: Path = Path("mycelium/state/graph.json")):
        self.graph = Graph(graph_path)
        self.graph.load()

        self.learner = EdgeLearner(self.graph)
        self.persistence = LearnerPersistence()
        self.persistence.load_learner(self.learner)

        self.semantic = SemanticMatcher()
        self.generator = TextGenerator(self.graph, learner=self.learner, semantic_matcher=self.semantic)
        self.evaluator = Evaluator(self.graph, learner=self.learner, generator=self.generator)
        self.optimizer = PerformanceOptimizer(self.graph)
        self.memory = TemporalMemory(self.graph)

        self.entity_recognizer = EntityRecognizer()
        self.relation_extractor = RelationExtractor()
        self.normalizer = TextNormalizer()

    def query(
        self, text: str, hops: int = 6, use_generation: bool = False, confidence_threshold: float = 0.3
    ) -> dict:
        """Query the system with optional generation and learning"""
        # Normalize input
        normalized = self.normalizer.canonicalize(text)

        # Find candidates
        candidates = self.graph.walk(normalized, hops=hops)

        # Score by semantic similarity
        scored = []
        for cand in candidates:
            score = self.semantic.similarity_score(text, self.graph.nodes[cand]["text"])
            if score >= confidence_threshold:
                scored.append((cand, score))

        scored.sort(key=lambda x: x[1], reverse=True)

        # Select best response
        if scored:
            best_node = scored[0][0]
            response = self.graph.nodes[best_node]["text"]
            confidence = scored[0][1]
        else:
            response = ""
            confidence = 0.0

        # Generate alternative if requested
        generated = ""
        if use_generation and scored:
            generated = self.generator.generate_from_query(text, length=3)

        return {
            "query": text,
            "response": response,
            "confidence": confidence,
            "generated": generated,
            "alternatives": [self.graph.nodes[n]["text"] for n, _ in scored[1:4]],
            "path": scored[0][0] if scored else "",
        }

    def feedback(self, query: str, path: str, feedback: bool) -> dict:
        """Record user feedback and update learning"""
        if path not in self.graph.nodes:
            return {"status": "error", "message": "Invalid path"}

        # Learn from feedback
        candidate_path = self.graph.walk(query, hops=2)
        if path in candidate_path:
            self.learner.learn_from_feedback(candidate_path[: candidate_path.index(path) + 1], feedback)

        response = self.graph.nodes[path]["text"]
        self.persistence.log_feedback(query, candidate_path, feedback, response)
        self.persistence.save_learner(self.learner)

        return {
            "status": "ok",
            "query": query,
            "feedback": feedback,
            "learning_updated": True,
        }

    def add_fact(self, text: str) -> dict:
        """Add new fact to knowledge graph"""
        # Extract relations
        relations = self.relation_extractor.extract_from_text(text, self.entity_recognizer)

        # Add to graph
        self.graph.add_node(text, "fact")

        added_relations = 0
        for rel in relations:
            subject = rel["subject"]
            obj = rel["object"]
            if subject in self.graph.nodes and obj in self.graph.nodes:
                self.graph.link(subject, obj)
                added_relations += 1

        self.graph.save()

        return {
            "status": "ok",
            "text": text,
            "relations": len(relations),
            "relations_added": added_relations,
        }

    def get_stats(self) -> dict:
        """Get comprehensive system statistics"""
        coverage = self.evaluator.evaluate_coverage()
        learning = self.evaluator.evaluate_learning_progress()
        feedback_stats = self.persistence.get_feedback_stats()

        return {
            "graph": coverage,
            "learning": learning,
            "feedback": feedback_stats,
            "health": self.evaluator.get_system_health(),
        }

    def export_graph(self) -> dict:
        """Export graph structure"""
        return {
            "nodes": list(self.graph.nodes.keys()),
            "edges": {src: list(dests.keys()) for src, dests in self.graph.edges.items()},
            "node_count": len(self.graph.nodes),
            "edge_count": sum(len(e) for e in self.graph.edges.values()),
        }

    def optimize(self) -> dict:
        """Optimize graph performance"""
        return self.optimizer.optimize_all(prune_edges=True, prune_nodes=False)

    def get_learning_status(self) -> dict:
        """Get detailed learning status"""
        stats = self.learner.get_learning_stats()
        top_edges = self.learner.get_top_edges(limit=5)
        problem_edges = self.learner.get_problem_edges(limit=5)

        return {
            "stats": stats,
            "top_edges": [{"edge": edge, "quality": quality} for edge, quality in top_edges],
            "problem_edges": [{"edge": edge, "quality": quality} for edge, quality in problem_edges],
        }

    def clear_learning(self) -> dict:
        """Reset all learned weights"""
        self.persistence.clear_learner()
        self.learner = EdgeLearner(self.graph)
        return {"status": "ok", "message": "Learning cleared"}
