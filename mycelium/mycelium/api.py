"""Experimental REST API for Mycelium v1"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .graph import Graph
from .words import WordList


class MyceliumAPI:
    """Simple API interface for Mycelium graph operations"""

    def __init__(self, graph_path: Path, dict_path: Path):
        self.graph = Graph(graph_path)
        self.words = WordList(dict_path)
        self.graph.load()
        self.words.load()

    def query(self, text: str, hops: int = 6) -> dict[str, Any]:
        """Walk the graph and return results as JSON"""
        results = self.graph.walk(text, hops=hops)
        response = self.graph.speak(results)
        return {
            "query": text,
            "answer": response,
            "confidence": len(results) / max(1, len(self.graph.nodes)),
            "nodes_traversed": len(results),
            "total_nodes": len(self.graph.nodes),
        }

    def add_fact(self, text: str) -> dict[str, Any]:
        """Add a new fact to the graph"""
        try:
            node_id = self.graph.add_node(text, kind="fact")
            self.graph.save()
            return {
                "success": True,
                "fact": text,
                "node_id": node_id,
                "total_nodes": len(self.graph.nodes),
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_stats(self) -> dict[str, Any]:
        """Get graph statistics"""
        return {
            "nodes": len(self.graph.nodes),
            "edges": sum(len(e) for e in self.graph.edges.values()),
            "words": len(self.words.words),
            "avg_connections": (
                sum(len(e) for e in self.graph.edges.values()) / max(1, len(self.graph.nodes))
            ),
        }

    def export_graph(self) -> dict[str, Any]:
        """Export full graph as JSON"""
        return {
            "nodes": self.graph.nodes,
            "edges": {k: dict(v) for k, v in self.graph.edges.items()},
            "stats": self.get_stats(),
        }
