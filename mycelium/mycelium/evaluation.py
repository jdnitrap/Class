"""Evaluation metrics and benchmarking"""

from __future__ import annotations

from collections import defaultdict
from pathlib import Path
import json


class Evaluator:
    """Measure system performance and improvement"""

    def __init__(self, graph, learner=None, generator=None):
        self.graph = graph
        self.learner = learner
        self.generator = generator
        self.metrics = defaultdict(list)

    def evaluate_response_quality(self, query: str, response: str, feedback: bool) -> dict:
        """Evaluate a single response"""
        response_words = set(response.lower().split())
        query_words = set(query.lower().split())

        overlap = len(response_words & query_words)
        response_length = len(response_words)

        return {
            "query": query,
            "response_length": response_length,
            "query_overlap": overlap,
            "feedback": feedback,
            "score": overlap / max(1, response_length),
        }

    def evaluate_diversity(self, generations: list[str]) -> float:
        """Measure diversity of generated responses (0.0 to 1.0)"""
        if len(generations) < 2:
            return 0.0

        unique_words = set()
        for gen in generations:
            unique_words.update(gen.lower().split())

        total_words = sum(len(g.split()) for g in generations)
        return len(unique_words) / max(1, total_words)

    def evaluate_path_quality(self, path: list[str]) -> dict:
        """Evaluate quality of a path through graph"""
        if not path or not self.learner:
            return {"path_length": len(path), "avg_edge_quality": 0.0}

        qualities = []
        for i in range(len(path) - 1):
            quality = self.learner.get_edge_quality(path[i], path[i + 1])
            qualities.append(quality)

        avg_quality = sum(qualities) / max(1, len(qualities))

        return {
            "path_length": len(path),
            "avg_edge_quality": avg_quality,
            "min_quality": min(qualities) if qualities else 0.0,
            "max_quality": max(qualities) if qualities else 0.0,
        }

    def evaluate_coverage(self) -> dict:
        """Measure graph coverage and connectivity"""
        if not self.graph.nodes:
            return {
                "node_count": 0,
                "edge_count": 0,
                "coverage": 0.0,
                "avg_connections": 0.0,
            }

        edge_count = sum(len(edges) for edges in self.graph.edges.values())
        connected_nodes = len([n for n in self.graph.nodes if n in self.graph.edges])

        coverage = connected_nodes / max(1, len(self.graph.nodes))
        avg_connections = edge_count / max(1, len(self.graph.nodes))

        return {
            "node_count": len(self.graph.nodes),
            "edge_count": edge_count,
            "connected_nodes": connected_nodes,
            "coverage": coverage,
            "avg_connections": avg_connections,
        }

    def evaluate_learning_progress(self) -> dict:
        """Measure how much the system has learned"""
        if not self.learner:
            return {"edges_tested": 0, "avg_quality": 0.0, "improvement_potential": 0.0}

        edges_tested = len(self.learner.traversal_count)
        if edges_tested == 0:
            return {"edges_tested": 0, "avg_quality": 0.0, "improvement_potential": 0.0}

        avg_quality = sum(
            self.learner.get_edge_quality(s, d) for s, d in self.learner.traversal_count.keys()
        ) / max(1, edges_tested)

        # Potential is based on edges with poor quality
        problem_edges = self.learner.get_problem_edges(limit=100)
        improvement_potential = (
            sum(1 - q for _, q in problem_edges) / max(1, len(problem_edges))
            if problem_edges
            else 0.0
        )

        return {
            "edges_tested": edges_tested,
            "avg_quality": avg_quality,
            "improvement_potential": improvement_potential,
        }

    def get_system_health(self) -> dict:
        """Overall system health assessment"""
        coverage = self.evaluate_coverage()
        learning = self.evaluate_learning_progress()

        return {
            "graph_health": coverage,
            "learning_progress": learning,
            "timestamp": Path("mycelium/state/graph.json").stat().st_mtime
            if Path("mycelium/state/graph.json").exists()
            else 0,
        }

    def benchmark_query(self, query: str, iterations: int = 3) -> dict:
        """Benchmark query performance"""
        if not self.graph.nodes:
            return {"query": query, "avg_results": 0, "avg_confidence": 0.0}

        results_count = []
        for _ in range(iterations):
            candidates = self.graph.walk(query, hops=4)
            results_count.append(len(candidates))

        return {
            "query": query,
            "iterations": iterations,
            "avg_results": sum(results_count) / max(1, len(results_count)),
            "min_results": min(results_count) if results_count else 0,
            "max_results": max(results_count) if results_count else 0,
        }

    def save_metrics(self, filepath: Path) -> None:
        """Save metrics to file for tracking"""
        data = dict(self.metrics)
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)

    def load_metrics(self, filepath: Path) -> None:
        """Load previous metrics"""
        if filepath.exists():
            with open(filepath, "r") as f:
                self.metrics = defaultdict(list, json.load(f))
