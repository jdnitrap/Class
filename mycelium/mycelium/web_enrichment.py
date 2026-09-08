"""Web enrichment - expand graph with web sources while maintaining interpretability"""

from __future__ import annotations

import re
import urllib.request
import urllib.error
from urllib.parse import quote
from collections import defaultdict


class WebSearcher:
    """Search web and extract structured facts"""

    def __init__(self):
        self.cache = {}
        self.sources_found = defaultdict(list)

    def search_wikipedia(self, query: str) -> dict:
        """Search Wikipedia for a topic"""
        # Clean query
        clean_query = query.lower().strip()

        if clean_query in self.cache:
            return self.cache[clean_query]

        try:
            # Build Wikipedia search URL
            search_url = f"https://en.wikipedia.org/wiki/{quote(clean_query.replace(' ', '_'))}"

            # Fetch page
            headers = {"User-Agent": "Mozilla/5.0"}
            req = urllib.request.Request(search_url, headers=headers)
            response = urllib.request.urlopen(req, timeout=5)
            html = response.read().decode("utf-8")

            # Extract title and summary
            title_match = re.search(r"<h1[^>]*>.*?<span[^>]*>([^<]+)</span>", html)
            title = title_match.group(1) if title_match else clean_query

            # Extract first paragraph (rough extraction)
            para_match = re.search(r"<p>(.*?)</p>", html)
            summary = ""
            if para_match:
                text = para_match.group(1)
                # Remove HTML tags
                text = re.sub(r"<[^>]+>", "", text)
                # Remove citations
                text = re.sub(r"\[\d+\]", "", text)
                summary = text[:200].strip()

            result = {
                "title": title,
                "summary": summary,
                "url": search_url,
                "found": True,
            }

            self.cache[clean_query] = result
            return result

        except (urllib.error.URLError, urllib.error.HTTPError, Exception):
            result = {"title": query, "summary": "", "url": "", "found": False}
            self.cache[clean_query] = result
            return result

    def search_wikidata(self, query: str) -> dict:
        """Query Wikidata for structured facts (via SPARQL simulation)"""
        # Simplified Wikidata-like response
        # In production, would use actual Wikidata SPARQL endpoint

        known_facts = {
            "mount everest": {
                "height": "29,032 feet",
                "location": "Himalayas",
                "discovered": "1856",
            },
            "tesla": {
                "invented": "alternating current",
                "born": "1856",
                "nationality": "Serbian",
            },
            "water": {
                "boiling_point": "100 Celsius",
                "freezing_point": "0 Celsius",
                "formula": "H2O",
            },
            "photosynthesis": {
                "produces": "oxygen",
                "requires": "sunlight",
                "process": "in plants",
            },
        }

        query_lower = query.lower().strip()
        if query_lower in known_facts:
            return {"found": True, "facts": known_facts[query_lower]}

        return {"found": False, "facts": {}}


class FactExtractor:
    """Extract facts and relations from web content"""

    def __init__(self):
        self.extraction_patterns = [
            (r"([A-Z][a-z\s]+) is (?:a |an |the )?(.+?)(?:\.|,)", "is"),
            (r"([A-Z][a-z\s]+) (?:invented|created|discovered) ([A-Z][a-z\s]+)", "invented"),
            (r"([A-Z][a-z\s]+) (?:has|have) ([A-Z][a-z\s]+)", "has"),
            (r"([A-Z][a-z\s]+) (?:weighs|measures) ([0-9,]+)", "measures"),
            (r"([A-Z][a-z\s]+) was born in ([0-9]{4})", "born"),
        ]

    def extract_facts(self, text: str, source_url: str = "") -> list[dict]:
        """Extract facts from text using patterns"""
        facts = []

        for pattern, relation_type in self.extraction_patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                subject = match.group(1).strip()
                obj = match.group(2).strip()

                fact = {
                    "subject": subject,
                    "relation": relation_type,
                    "object": obj,
                    "source": source_url,
                    "confidence": 0.7,  # Pattern-based, moderate confidence
                }
                facts.append(fact)

        return facts

    def extract_relations(self, text: str) -> list[tuple[str, str, str]]:
        """Extract subject-verb-object relations"""
        relations = []

        # Basic pattern
        pattern = r"([A-Z][a-z\s]+?)\s+(is|was|has|does|invented|created|makes)\s+([A-Z][a-z\s]+)"
        matches = re.finditer(pattern, text)

        for match in matches:
            subject = match.group(1).strip()
            verb = match.group(2).strip()
            obj = match.group(3).strip()
            relations.append((subject, verb, obj))

        return relations


class CitationTracker:
    """Track sources and citations for facts"""

    def __init__(self):
        self.citations = {}  # fact_text -> [sources]
        self.fact_confidence = {}  # fact_text -> confidence score

    def add_citation(self, fact_text: str, source_url: str, confidence: float = 0.7) -> None:
        """Add source citation for a fact"""
        if fact_text not in self.citations:
            self.citations[fact_text] = []
            self.fact_confidence[fact_text] = confidence

        self.citations[fact_text].append(source_url)
        # Increase confidence with multiple sources
        self.fact_confidence[fact_text] = min(0.99, self.fact_confidence[fact_text] + 0.1)

    def get_citations(self, fact_text: str) -> list[str]:
        """Get all sources for a fact"""
        return self.citations.get(fact_text, [])

    def get_confidence(self, fact_text: str) -> float:
        """Get confidence score for a fact (0.0 to 1.0)"""
        return self.fact_confidence.get(fact_text, 0.5)

    def format_fact_with_citations(self, fact_text: str) -> str:
        """Format fact with source attribution"""
        citations = self.get_citations(fact_text)
        confidence = self.get_confidence(fact_text)

        if not citations:
            return fact_text

        source_str = ", ".join([f"[{url.split('/')[-1]}]" for url in citations])
        return f"{fact_text} {source_str} (confidence: {confidence:.1%})"


class WebEnrichedGraph:
    """Graph that can fetch and integrate web sources"""

    def __init__(self, graph):
        self.graph = graph
        self.searcher = WebSearcher()
        self.extractor = FactExtractor()
        self.citations = CitationTracker()
        self.pending_validation = []  # Facts awaiting user approval

    def enrich_query(self, query: str, auto_add: bool = False) -> dict:
        """Search web for query and extract facts"""
        # Search
        result = self.searcher.search_wikipedia(query)

        if not result["found"]:
            return {"status": "not_found", "query": query}

        # Extract facts from summary
        facts = self.extractor.extract_facts(result["summary"], result["url"])

        # Format findings
        findings = {
            "status": "found",
            "query": query,
            "title": result["title"],
            "summary": result["summary"],
            "url": result["url"],
            "facts": facts,
            "pending": [],
        }

        # Track for validation
        for fact in facts:
            fact_text = f"{fact['subject']} {fact['relation']} {fact['object']}"
            self.citations.add_citation(fact_text, result["url"], fact["confidence"])
            self.pending_validation.append(
                {
                    "text": fact_text,
                    "subject": fact["subject"],
                    "object": fact["object"],
                    "source": result["url"],
                }
            )
            findings["pending"].append(fact_text)

        return findings

    def validate_fact(self, fact_text: str, approved: bool) -> dict:
        """User validates a web-sourced fact"""
        if approved:
            # Add to graph
            parts = fact_text.split(" is " if " is " in fact_text else " ")
            if len(parts) >= 2:
                subject = parts[0]
                obj = " ".join(parts[1:])

                self.graph.add_node(subject, "fact")
                self.graph.add_node(obj, "fact")
                self.graph.link(subject, obj)

                # Mark with source
                if subject in self.graph.nodes:
                    if "sources" not in self.graph.nodes[subject]:
                        self.graph.nodes[subject]["sources"] = []
                    sources = self.citations.get_citations(fact_text)
                    self.graph.nodes[subject]["sources"].extend(sources)

            self.graph.save()
            return {"status": "added", "fact": fact_text}
        else:
            return {"status": "rejected", "fact": fact_text}

    def get_sourced_response(self, node_id: str) -> str:
        """Get response with source attribution"""
        if node_id not in self.graph.nodes:
            return ""

        node = self.graph.nodes[node_id]
        text = node["text"]

        sources = node.get("sources", [])
        if sources:
            source_str = ", ".join([f"[{s.split('/')[-1]}]" for s in sources])
            return f"{text} {source_str}"

        return text
