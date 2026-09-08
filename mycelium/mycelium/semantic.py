"""Semantic similarity and advanced matching for Mycelium v1"""

from __future__ import annotations

from .tokenize import tokenize


class SemanticMatcher:
    """Semantic-aware matching without external dependencies"""

    # Simple word similarity groups (manually curated for demo)
    SYNONYMS = {
        "fast": ["quick", "rapid", "speed", "swift"],
        "slow": ["sluggish", "crawl", "drag"],
        "happy": ["joy", "glad", "cheerful", "content"],
        "sad": ["unhappy", "misery", "despair", "blue"],
        "big": ["large", "huge", "giant", "massive"],
        "small": ["tiny", "little", "minor", "compact"],
        "hot": ["warm", "burning", "heat"],
        "cold": ["cool", "chill", "freeze", "icy"],
        "smart": ["intelligent", "clever", "bright"],
        "stupid": ["dumb", "foolish", "idiotic"],
        "love": ["adore", "cherish", "affection"],
        "hate": ["despise", "detest", "abhor"],
    }

    # Reverse lookup for fast similarity checks
    SYNONYM_INDEX = {}

    def __init__(self):
        # Build reverse index
        for word, synonyms in self.SYNONYMS.items():
            for syn in synonyms:
                if syn not in self.SYNONYM_INDEX:
                    self.SYNONYM_INDEX[syn] = set()
                self.SYNONYM_INDEX[syn].add(word)
            # Each word is similar to itself
            if word not in self.SYNONYM_INDEX:
                self.SYNONYM_INDEX[word] = set()
            self.SYNONYM_INDEX[word].add(word)

    def get_similar_words(self, word: str) -> set[str]:
        """Get words similar to the given word"""
        word = word.lower()
        similar = {word}  # Include itself

        # Direct synonyms
        if word in self.SYNONYMS:
            similar.update(self.SYNONYMS[word])

        # Reverse synonyms
        if word in self.SYNONYM_INDEX:
            similar.update(self.SYNONYM_INDEX[word])

        return similar

    def similarity_score(self, text1: str, text2: str) -> float:
        """Score similarity between two texts (0.0 to 1.0)"""
        words1 = set(tokenize(text1.lower()))
        words2 = set(tokenize(text2.lower()))

        if not words1 or not words2:
            return 0.0

        # Expand with synonyms
        expanded1 = set()
        expanded2 = set()

        for w in words1:
            expanded1.update(self.get_similar_words(w))

        for w in words2:
            expanded2.update(self.get_similar_words(w))

        # Jaccard similarity
        intersection = len(expanded1 & expanded2)
        union = len(expanded1 | expanded2)

        return intersection / union if union > 0 else 0.0

    def semantic_match(self, query: str, nodes: dict, threshold: float = 0.3) -> list[tuple[str, float]]:
        """Find nodes semantically similar to query"""
        matches = []

        for nid, node in nodes.items():
            if node.get("kind") == "candidate":
                continue

            score = self.similarity_score(query, node["text"])
            if score >= threshold:
                matches.append((nid, score))

        return sorted(matches, key=lambda x: x[1], reverse=True)

    def expand_query(self, query: str) -> list[str]:
        """Expand query with semantic variants"""
        words = tokenize(query.lower())
        expanded = set(words)

        for word in words:
            expanded.update(self.get_similar_words(word))

        return sorted(expanded)


class ConceptSimilarity:
    """Measure similarity between graph concepts"""

    def __init__(self, graph):
        self.graph = graph

    def node_similarity(self, nid1: str, nid2: str) -> float:
        """Similarity between two nodes based on connections"""
        edges1 = set(self.graph.edges.get(nid1, {}).keys())
        edges2 = set(self.graph.edges.get(nid2, {}).keys())

        if not edges1 or not edges2:
            return 0.0

        # Jaccard similarity of edge targets
        intersection = len(edges1 & edges2)
        union = len(edges1 | edges2)

        return intersection / union if union > 0 else 0.0

    def find_similar_concepts(self, nid: str, limit: int = 5) -> list[tuple[str, float]]:
        """Find nodes similar to the given node"""
        scores = []

        for other_nid in self.graph.nodes:
            if other_nid == nid:
                continue
            score = self.node_similarity(nid, other_nid)
            if score > 0:
                scores.append((other_nid, score))

        return sorted(scores, key=lambda x: x[1], reverse=True)[:limit]
