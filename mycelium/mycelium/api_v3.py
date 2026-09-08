"""API v3 - With web enrichment and source attribution"""

from __future__ import annotations

from pathlib import Path

from .api_v2 import MyceliumAPI
from .web_enrichment import WebEnrichedGraph


class MyceliumAPIv3(MyceliumAPI):
    """Extended API with web search and source attribution"""

    def __init__(self, graph_path: Path = Path("mycelium/state/graph.json")):
        super().__init__(graph_path)
        self.enriched_graph = WebEnrichedGraph(self.graph)

    def query_with_web_fallback(
        self, text: str, hops: int = 6, use_web: bool = True
    ) -> dict:
        """Query with web fallback if graph match is weak"""
        # Try graph first
        result = self.query(text, hops=hops, use_generation=True)

        # If confidence is low and web is enabled, search web
        if use_web and result["confidence"] < 0.4:
            web_result = self.enriched_graph.enrich_query(text)

            if web_result["status"] == "found":
                return {
                    "query": text,
                    "source": "web",
                    "title": web_result["title"],
                    "summary": web_result["summary"],
                    "url": web_result["url"],
                    "facts": web_result["facts"],
                    "pending_validation": web_result["pending"],
                    "confidence": 0.6,  # Web results are moderate confidence
                    "requires_validation": True,
                }

        # Return graph result
        result["source"] = "graph"
        result["requires_validation"] = False
        return result

    def validate_and_add_web_fact(self, fact_text: str, approved: bool) -> dict:
        """Validate web-found fact and optionally add to graph"""
        return self.enriched_graph.validate_fact(fact_text, approved)

    def get_sourced_answer(self, node_id: str) -> dict:
        """Get answer with full source attribution"""
        if node_id not in self.graph.nodes:
            return {"status": "not_found"}

        node = self.graph.nodes[node_id]
        text = node["text"]
        sources = node.get("sources", [])

        return {
            "status": "ok",
            "text": text,
            "sources": sources,
            "sourced_text": (
                f"{text} [Sources: {', '.join(sources)}]" if sources else text
            ),
            "is_web_sourced": len(sources) > 0,
        }

    def get_enrichment_status(self) -> dict:
        """Get status of web enrichment system"""
        return {
            "pending_validation": len(self.enriched_graph.pending_validation),
            "tracked_citations": len(self.enriched_graph.citations.citations),
            "sources_found": dict(self.enriched_graph.searcher.sources_found),
        }

    def batch_validate(self, approvals: dict) -> dict:
        """Validate multiple facts at once"""
        results = {"added": 0, "rejected": 0}

        for fact_text, approved in approvals.items():
            result = self.validate_and_add_web_fact(fact_text, approved)
            if result["status"] == "added":
                results["added"] += 1
            else:
                results["rejected"] += 1

        return results

    def get_knowledge_audit(self) -> dict:
        """Audit knowledge graph - show sourced vs trained facts"""
        sourced = 0
        trained = 0

        for nid, node in self.graph.nodes.items():
            if "sources" in node and node["sources"]:
                sourced += 1
            else:
                trained += 1

        return {
            "total_nodes": len(self.graph.nodes),
            "sourced_from_web": sourced,
            "from_training": trained,
            "sourced_percentage": sourced / max(1, len(self.graph.nodes)) * 100,
            "pending_web_facts": len(self.enriched_graph.pending_validation),
        }
