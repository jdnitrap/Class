"""Markov chains for learning edge sequence probabilities"""

from __future__ import annotations

from collections import defaultdict
import math


class MarkovGraphChains:
    """Learn transition probabilities between graph nodes"""

    def __init__(self, graph):
        self.graph = graph

        # Transition counts: source -> target -> count
        self.transitions: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))

        # N-gram counts for longer sequences
        self.bigrams: dict[tuple[str, str], int] = defaultdict(int)
        self.trigrams: dict[tuple[str, str, str], int] = defaultdict(int)

        self.total_transitions = 0

    def observe_path(self, path: list[str]) -> None:
        """Record observations from a path"""
        if len(path) < 2:
            return

        # Record transitions
        for i in range(len(path) - 1):
            src = path[i]
            dst = path[i + 1]
            self.transitions[src][dst] += 1
            self.total_transitions += 1

        # Record bigrams (2-grams)
        for i in range(len(path) - 1):
            bigram = (path[i], path[i + 1])
            self.bigrams[bigram] += 1

        # Record trigrams (3-grams)
        for i in range(len(path) - 2):
            trigram = (path[i], path[i + 1], path[i + 2])
            self.trigrams[trigram] += 1

    def get_transition_probability(self, src: str, dst: str) -> float:
        """Get probability of transitioning from src to dst"""
        if src not in self.transitions:
            return 0.0

        dst_count = self.transitions[src].get(dst, 0)
        src_total = sum(self.transitions[src].values())

        if src_total == 0:
            return 0.0

        return dst_count / src_total

    def get_most_likely_next(self, src: str, limit: int = 5) -> list[tuple[str, float]]:
        """Get most likely next nodes after src"""
        if src not in self.transitions:
            return []

        transitions = self.transitions[src]
        total = sum(transitions.values())

        probabilities = [(dst, count / total) for dst, count in transitions.items()]
        return sorted(probabilities, key=lambda x: x[1], reverse=True)[:limit]

    def get_sequence_probability(self, path: list[str]) -> float:
        """Calculate probability of a sequence"""
        if len(path) < 2:
            return 1.0

        prob = 1.0
        for i in range(len(path) - 1):
            src = path[i]
            dst = path[i + 1]
            trans_prob = self.get_transition_probability(src, dst)
            if trans_prob == 0:
                return 0.0
            prob *= trans_prob

        return prob

    def get_bigram_probability(self, src: str, dst: str) -> float:
        """Get probability of a bigram"""
        bigram = (src, dst)
        if bigram not in self.bigrams:
            return 0.0

        total_bigrams = sum(self.bigrams.values())
        if total_bigrams == 0:
            return 0.0

        return self.bigrams[bigram] / total_bigrams

    def get_trigram_probability(self, n1: str, n2: str, n3: str) -> float:
        """Get probability of a trigram"""
        trigram = (n1, n2, n3)
        if trigram not in self.trigrams:
            return 0.0

        total_trigrams = sum(self.trigrams.values())
        if total_trigrams == 0:
            return 0.0

        return self.trigrams[trigram] / total_trigrams

    def predict_next_nodes(self, path: list[str], limit: int = 3) -> list[tuple[str, float]]:
        """Predict next nodes based on sequence"""
        if not path:
            return []

        last = path[-1]
        most_likely = self.get_most_likely_next(last, limit=limit)

        # If we have 2+ nodes, consider trigrams
        if len(path) >= 2:
            trigram_based = []
            for dst, _ in most_likely:
                trigram_prob = self.get_trigram_probability(path[-2], last, dst)
                if trigram_prob > 0:
                    trigram_based.append((dst, trigram_prob))

            if trigram_based:
                most_likely = sorted(trigram_based, key=lambda x: x[1], reverse=True)[:limit]

        return most_likely

    def get_entropy(self, src: str) -> float:
        """Calculate entropy of transitions from src (measure of uncertainty)"""
        if src not in self.transitions:
            return 0.0

        total = sum(self.transitions[src].values())
        if total == 0:
            return 0.0

        entropy = 0.0
        for count in self.transitions[src].values():
            prob = count / total
            if prob > 0:
                entropy -= prob * math.log2(prob)

        return entropy

    def get_common_sequences(self, length: int = 2, limit: int = 10) -> list[tuple]:
        """Get most common sequences of given length"""
        if length == 2:
            sequences = self.bigrams
        elif length == 3:
            sequences = self.trigrams
        else:
            return []

        sorted_seqs = sorted(sequences.items(), key=lambda x: x[1], reverse=True)
        return [(seq, count) for seq, count in sorted_seqs[:limit]]

    def get_stats(self) -> dict:
        """Get statistics about learned transitions"""
        if not self.transitions:
            return {
                "total_transitions": 0,
                "unique_sources": 0,
                "unique_sequences": 0,
            }

        unique_sources = len(self.transitions)
        total_edges = sum(len(dests) for dests in self.transitions.values())

        return {
            "total_transitions": self.total_transitions,
            "unique_sources": unique_sources,
            "unique_targets": total_edges,
            "bigrams": len(self.bigrams),
            "trigrams": len(self.trigrams),
            "avg_entropy": (
                sum(self.get_entropy(src) for src in self.transitions) / unique_sources
                if unique_sources > 0
                else 0
            ),
        }
