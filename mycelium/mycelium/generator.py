"""Text generation using graph walks and learned paths"""

from __future__ import annotations

import random
from collections import defaultdict


class TextGenerator:
    """Generate new text by walking high-quality paths through the graph"""

    def __init__(self, graph, learner=None, semantic_matcher=None):
        self.graph = graph
        self.learner = learner
        self.semantic = semantic_matcher
        self.templates = [
            "{0} is {1}",
            "{0} can {1}",
            "{0} likes {1}",
            "{0} makes {1}",
            "{0} becomes {1}",
            "{0} then {1}",
            "when {0} happens {1}",
            "{0} because {1}",
        ]

    def generate_from_query(self, query: str, length: int = 3, use_learning: bool = True) -> str:
        """Generate text starting from a query"""
        # Find starting node
        candidates = self.graph.walk(query, hops=2)
        if not candidates:
            return ""

        start_node = candidates[0]
        return self.generate_chain(start_node, length=length, use_learning=use_learning)

    def generate_chain(self, start_node: str, length: int = 3, use_learning: bool = True) -> str:
        """Generate a chain of nodes following edges"""
        if start_node not in self.graph.nodes:
            return ""

        path = [start_node]
        current = start_node

        for _ in range(length - 1):
            if current not in self.graph.edges or not self.graph.edges[current]:
                break

            # Choose next node - prefer high-quality edges if learner available
            next_nodes = list(self.graph.edges[current].keys())
            if not next_nodes:
                break

            if use_learning and self.learner:
                # Weight by edge quality
                qualities = {n: self.learner.get_edge_quality(current, n) for n in next_nodes}
                total_quality = sum(qualities.values()) + 0.1
                weights = [qualities.get(n, 0.5) + 0.1 for n in next_nodes]
                current = random.choices(next_nodes, weights=weights, k=1)[0]
            else:
                current = random.choice(next_nodes)

            path.append(current)

        return self.path_to_text(path)

    def path_to_text(self, path: list[str]) -> str:
        """Convert a path of nodes into readable text"""
        if not path:
            return ""

        if len(path) == 1:
            return self.graph.nodes[path[0]]["text"]

        # Extract key words from each node
        words = []
        for nid in path:
            node_text = self.graph.nodes[nid]["text"]
            # Take first meaningful word
            tokens = node_text.split()
            if tokens:
                words.append(tokens[0])

        # Apply template
        template = random.choice(self.templates)
        try:
            result = template.format(*words[: len(words)])
            return result
        except (IndexError, KeyError):
            return " ".join(words)

    def generate_multi_path(self, start_node: str, num_paths: int = 3, length: int = 3) -> list[str]:
        """Generate multiple different chains from same start"""
        results = []
        for _ in range(num_paths):
            chain = self.generate_chain(start_node, length=length)
            if chain:
                results.append(chain)
        return results

    def semantic_generate(self, query: str, length: int = 3) -> str:
        """Generate using semantic similarity to expand concepts"""
        if not self.semantic:
            return ""

        # Expand query semantically
        expanded = self.semantic.expand_query(query)
        if not expanded:
            return ""

        # Find nodes matching expanded terms
        matching_nodes = []
        for word in expanded[:3]:
            for nid, node in self.graph.nodes.items():
                if word in node["text"].lower():
                    matching_nodes.append(nid)
                    break

        if not matching_nodes:
            return ""

        # Start from one semantic match and generate
        start = random.choice(matching_nodes)
        return self.generate_chain(start, length=length)

    def combine_concepts(self, concept1: str, concept2: str) -> str:
        """Generate by combining two semantic concepts"""
        if not self.semantic:
            return f"{concept1} {concept2}"

        # Find nodes for each concept
        nodes1 = [nid for nid, n in self.graph.nodes.items() if concept1.lower() in n["text"].lower()]
        nodes2 = [nid for nid, n in self.graph.nodes.items() if concept2.lower() in n["text"].lower()]

        if not nodes1 or not nodes2:
            return f"{concept1} and {concept2}"

        node1 = random.choice(nodes1)
        node2 = random.choice(nodes2)

        # Create combination
        text1 = self.graph.nodes[node1]["text"]
        text2 = self.graph.nodes[node2]["text"]

        templates = [
            "{0} and {1}",
            "{0} which is {1}",
            "{0} like {1}",
            "{0} but also {1}",
        ]

        template = random.choice(templates)
        try:
            return template.format(text1[:20], text2[:20])
        except:
            return f"{text1} and {text2}"

    def get_generation_stats(self) -> dict:
        """Statistics about generation capability"""
        return {
            "total_nodes": len(self.graph.nodes),
            "total_edges": sum(len(e) for e in self.graph.edges.values()),
            "avg_edges_per_node": (
                sum(len(e) for e in self.graph.edges.values()) / max(1, len(self.graph.nodes))
            ),
            "has_learner": self.learner is not None,
            "has_semantic": self.semantic is not None,
            "templates_available": len(self.templates),
        }
