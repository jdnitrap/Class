"""Performance optimization for Mycelium v1 - indexing, caching, pruning"""

from __future__ import annotations

import time
from collections import defaultdict
from pathlib import Path

from .graph import Graph


class PerformanceOptimizer:
    """Optimize graph performance through indexing and pruning"""

    def __init__(self, graph: Graph):
        self.graph = graph
        self.word_index: dict[str, list[str]] = defaultdict(list)
        self.concept_cache: dict[str, list[str]] = {}
        self.last_index_time = 0.0

    def build_index(self) -> None:
        """Build inverted index of words to nodes for faster lookup"""
        self.word_index.clear()
        for nid, node in self.graph.nodes.items():
            text = node["text"].lower()
            words = text.split()
            for word in words:
                self.word_index[word].append(nid)
        self.last_index_time = time.time()

    def indexed_match(self, text: str, limit: int = 10) -> list[str]:
        """Fast matching using word index instead of full scan"""
        words = text.lower().split()
        candidates = set()

        for word in words:
            if word in self.word_index:
                candidates.update(self.word_index[word])

        # Score by number of matching words
        scores = []
        for nid in candidates:
            matches = sum(1 for w in words if w in self.graph.nodes[nid]["text"].lower())
            scores.append((nid, matches))

        return [nid for nid, _ in sorted(scores, key=lambda x: x[1], reverse=True)[:limit]]

    def prune_weak_edges(self, threshold: float = 0.2) -> int:
        """Remove edges below strength threshold to reduce memory"""
        pruned = 0
        for src in list(self.graph.edges.keys()):
            weak = [tgt for tgt, strength in self.graph.edges[src].items() if strength <= threshold]
            for tgt in weak:
                del self.graph.edges[src][tgt]
                pruned += 1
        return pruned

    def prune_low_energy_nodes(self, threshold: float = 0.5, min_connections: int = 1) -> int:
        """Remove isolated or low-energy nodes"""
        pruned = 0
        to_remove = []

        for nid, node in self.graph.nodes.items():
            energy = node.get("energy", 1.0)
            connections = len(self.graph.edges.get(nid, {}))

            if energy < threshold and connections <= min_connections:
                to_remove.append(nid)

        for nid in to_remove:
            del self.graph.nodes[nid]
            if nid in self.graph.edges:
                del self.graph.edges[nid]
            # Remove incoming edges
            for src in self.graph.edges:
                if nid in self.graph.edges[src]:
                    del self.graph.edges[src][nid]
            pruned += 1

        return pruned

    def get_stats(self) -> dict:
        """Get performance and size statistics"""
        edge_count = sum(len(e) for e in self.graph.edges.values())
        avg_edges = edge_count / max(1, len(self.graph.nodes))
        avg_strength = (
            sum(s for edges in self.graph.edges.values() for s in edges.values())
            / max(1, edge_count)
        )

        return {
            "nodes": len(self.graph.nodes),
            "edges": edge_count,
            "avg_edges_per_node": avg_edges,
            "avg_edge_strength": avg_strength,
            "indexed": bool(self.word_index),
            "index_size": len(self.word_index),
        }

    def optimize_all(self, prune_edges: bool = True, prune_nodes: bool = False) -> dict:
        """Run all optimizations"""
        results = {}

        # Build index
        self.build_index()
        results["index_built"] = True

        # Prune
        if prune_edges:
            results["edges_pruned"] = self.prune_weak_edges(threshold=0.15)

        if prune_nodes:
            results["nodes_pruned"] = self.prune_low_energy_nodes(threshold=0.5)

        # Save optimized graph
        self.graph.save()
        results["saved"] = True

        return results
