"""Better NLP: entity recognition, normalization, relation extraction"""

from __future__ import annotations

import re
from collections import defaultdict


class EntityRecognizer:
    """Extract entities and entity types from text"""

    # Common entity patterns
    ENTITY_PATTERNS = {
        "person": r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b",
        "action": r"\b(?:is|was|has|have|does|did|invented|created|made|discovered)\b",
        "object": r"\b(?:dog|cat|cake|oven|flour|light|bulb|current)\b",
        "quality": r"\b(?:fast|slow|happy|sad|big|small|hot|cold|smart|stupid)\b",
    }

    def __init__(self):
        self.entity_cache = {}

    def recognize_entities(self, text: str) -> dict[str, list[str]]:
        """Extract entities by type from text"""
        text_lower = text.lower()
        entities = defaultdict(list)

        # Extract entities
        for entity_type, pattern in self.ENTITY_PATTERNS.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            entities[entity_type].extend(matches)

        # Remove duplicates
        for entity_type in entities:
            entities[entity_type] = list(set(entities[entity_type]))

        return dict(entities)

    def extract_relations(self, text: str) -> list[tuple[str, str, str]]:
        """Extract subject-verb-object relations from text"""
        # Simple pattern: [subject] [verb] [object]
        pattern = r"(\w+)\s+(is|was|has|does|invented|created|makes|runs|loves)\s+(\w+)"
        matches = re.findall(pattern, text, re.IGNORECASE)
        return [(m[0], m[1], m[2]) for m in matches]

    def normalize_text(self, text: str) -> str:
        """Normalize text for consistent processing"""
        # Lowercase
        text = text.lower()
        # Remove extra spaces
        text = re.sub(r"\s+", " ", text)
        # Remove punctuation except essential ones
        text = re.sub(r"[^\w\s\-\.]", "", text)
        return text.strip()


class RelationExtractor:
    """Extract and organize relations from text"""

    def __init__(self):
        self.relations = defaultdict(list)
        self.relation_index = defaultdict(set)

    def extract_from_text(self, text: str, recognizer: EntityRecognizer = None) -> list[dict]:
        """Extract relations from text"""
        if recognizer is None:
            recognizer = EntityRecognizer()

        relations = []
        pattern = r"(\w+)\s+(is|was|has|does|invented|created|makes|runs|loves|bakes|uses|goes)\s+([\w\s]+?)(?:\.|$|,)"

        for match in re.finditer(pattern, text, re.IGNORECASE):
            subject = match.group(1)
            relation = match.group(2)
            obj = match.group(3).strip()

            relations.append({"subject": subject, "relation": relation, "object": obj})
            self.relation_index[subject].add(obj)

        return relations

    def get_relations_for_entity(self, entity: str) -> list[str]:
        """Get all known relations for an entity"""
        return list(self.relation_index.get(entity, []))

    def add_relation(self, subject: str, relation: str, obj: str) -> None:
        """Add a new relation"""
        self.relations[(subject, relation)].append(obj)
        self.relation_index[subject].add(obj)


class TextNormalizer:
    """Normalize and standardize text for consistent processing"""

    STOP_WORDS = {
        "the",
        "a",
        "an",
        "and",
        "or",
        "but",
        "is",
        "are",
        "was",
        "were",
        "be",
        "to",
        "of",
        "in",
        "on",
        "at",
        "by",
        "with",
        "from",
    }

    @staticmethod
    def remove_stop_words(text: str) -> str:
        """Remove common stop words"""
        words = text.lower().split()
        filtered = [w for w in words if w not in TextNormalizer.STOP_WORDS]
        return " ".join(filtered)

    @staticmethod
    def stemming_simple(word: str) -> str:
        """Simple stemming (remove common suffixes)"""
        suffixes = ["ing", "ed", "s", "es", "er", "est"]
        word_lower = word.lower()
        for suffix in suffixes:
            if word_lower.endswith(suffix):
                return word_lower[: -len(suffix)]
        return word_lower

    @staticmethod
    def extract_key_phrases(text: str, min_length: int = 2) -> list[str]:
        """Extract key phrases (multi-word terms)"""
        words = text.lower().split()
        phrases = []

        for i in range(len(words) - min_length + 1):
            phrase = " ".join(words[i : i + min_length])
            if not any(stop in phrase for stop in TextNormalizer.STOP_WORDS):
                phrases.append(phrase)

        return list(set(phrases))

    @staticmethod
    def canonicalize(text: str) -> str:
        """Convert text to canonical form for comparison"""
        # Normalize whitespace
        text = re.sub(r"\s+", " ", text).strip()
        # Lowercase
        text = text.lower()
        # Sort words for comparison (word order independent)
        words = sorted(text.split())
        return " ".join(words)


class SemanticNormalizer:
    """Normalize semantic meanings"""

    EXPANSIONS = {
        "likes": ["loves", "enjoys", "prefers"],
        "fast": ["quick", "rapid", "swift", "speed"],
        "slow": ["sluggish", "crawl", "drag"],
        "big": ["large", "huge", "giant", "massive"],
        "small": ["tiny", "little", "minor", "compact"],
    }

    @staticmethod
    def get_semantic_variants(word: str) -> set[str]:
        """Get all semantic variants of a word"""
        word_lower = word.lower()
        variants = {word_lower}

        if word_lower in SemanticNormalizer.EXPANSIONS:
            variants.update(SemanticNormalizer.EXPANSIONS[word_lower])

        for key, values in SemanticNormalizer.EXPANSIONS.items():
            if word_lower in values:
                variants.add(key)
                variants.update(values)

        return variants
