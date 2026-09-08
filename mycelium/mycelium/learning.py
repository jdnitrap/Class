"""Edge importance learning for Mycelium v1 - learn from patterns"""

from __future__ import annotations

from collections import defaultdict


class EdgeLearner:
    """Learn which edges matter most from query patterns and feedback"""

    def __init__(self, graph):
        self.graph = graph
        self.edge_success_count: dict[tuple[str, str], int] = defaultdict(int)
        self.edge_failure_count: dict[tuple[str, str], int] = defaultdict(int)
        self.traversal_count: dict[tuple[str, str], int] = defaultdict(int)

    def record_successful_traversal(self, path: list[str]) -> None:
        """Record that edges in this path led to a good answer"""
        for i in range(len(path) - 1):
            edge = (path[i], path[i + 1])
            self.traversal_count[edge] += 1
            self.edge_success_count[edge] += 1

    def record_failed_traversal(self, path: list[str]) -> None:
        """Record that edges in this path led to a bad answer"""
        for i in range(len(path) - 1):
            edge = (path[i], path[i + 1])
            self.traversal_count[edge] += 1
            self.edge_failure_count[edge] += 1

    def get_edge_quality(self, src: str, dst: str) -> float:
        """
        Calculate edge quality based on success/failure ratio.

        Returns: Score from 0.0 to 1.0
        """
        edge = (src, dst)
        successes = self.edge_success_count[edge]
        failures = self.edge_failure_count[edge]
        total = successes + failures

        if total == 0:
            return 0.5  # Neutral for untested edges

        return successes / total

    def update_edge_strength(self, src: str, dst: str, learning_rate: float = 0.1) -> float:
        """
        Update edge strength based on learned quality.

        Args:
            src: Source node
            dst: Destination node
            learning_rate: How much to adjust (0.0-1.0)

        Returns:
            New edge strength
        """
        if src not in self.graph.edges or dst not in self.graph.edges[src]:
            return 0.0

        quality = self.get_edge_quality(src, dst)
        current_strength = self.graph.edges[src][dst]

        # Lerp towards quality-based strength
        target_strength = 1.0 + (quality * 7.0)  # 1.0 to 8.0 range
        new_strength = current_strength + (target_strength - current_strength) * learning_rate

        self.graph.edges[src][dst] = new_strength
        return new_strength

    def learn_from_feedback(self, path: list[str], feedback: bool, learning_rate: float = 0.1) -> None:
        """
        Learn from user feedback (yes/no).

        Args:
            path: Nodes traversed
            feedback: True for successful, False for failed
            learning_rate: Learning rate (0.0-1.0)
        """
        if feedback:
            self.record_successful_traversal(path)
        else:
            self.record_failed_traversal(path)

        # Update edge strengths
        for i in range(len(path) - 1):
            self.update_edge_strength(path[i], path[i + 1], learning_rate)

    def apply_all_learning(self, learning_rate: float = 0.1) -> dict:
        """Apply learned edge weights to entire graph"""
        updated = 0

        for (src, dst), quality in self.edge_success_count.items():
            if src in self.graph.edges and dst in self.graph.edges[src]:
                self.update_edge_strength(src, dst, learning_rate)
                updated += 1

        return {
            "edges_updated": updated,
            "total_edges_tested": len(self.traversal_count),
            "avg_quality": (
                sum(self.get_edge_quality(s, d) for s, d in self.traversal_count.keys())
                / max(1, len(self.traversal_count))
            ),
        }

    def get_learning_stats(self) -> dict:
        """Get statistics about what the system has learned"""
        if not self.traversal_count:
            return {
                "edges_tested": 0,
                "successful_traversals": 0,
                "failed_traversals": 0,
                "success_rate": 0.0,
            }

        total_success = sum(self.edge_success_count.values())
        total_failure = sum(self.edge_failure_count.values())
        total = total_success + total_failure

        return {
            "edges_tested": len(self.traversal_count),
            "successful_traversals": total_success,
            "failed_traversals": total_failure,
            "success_rate": total_success / max(1, total),
            "avg_quality": (
                sum(self.get_edge_quality(s, d) for s, d in self.traversal_count.keys())
                / max(1, len(self.traversal_count))
            ),
        }

    def get_top_edges(self, limit: int = 10) -> list[tuple[tuple[str, str], float]]:
        """Get highest quality edges"""
        edges = []
        for edge in self.traversal_count:
            quality = self.get_edge_quality(edge[0], edge[1])
            edges.append((edge, quality))

        return sorted(edges, key=lambda x: x[1], reverse=True)[:limit]

    def get_problem_edges(self, limit: int = 10) -> list[tuple[tuple[str, str], float]]:
        """Get lowest quality edges that are frequently used"""
        edges = []
        for edge in self.traversal_count:
            if self.traversal_count[edge] > 2:  # Only edges tried multiple times
                quality = self.get_edge_quality(edge[0], edge[1])
                edges.append((edge, quality))

        return sorted(edges, key=lambda x: x[1])[:limit]
