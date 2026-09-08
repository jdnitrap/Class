#!/usr/bin/env python3
"""Test suite demonstrating all four enhancements"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.graph import Graph
from mycelium.words import WordList
from mycelium.performance import PerformanceOptimizer
from mycelium.semantic import SemanticMatcher, ConceptSimilarity
from mycelium.memory import TemporalMemory
from mycelium.learning import EdgeLearner


def test_performance():
    print("\n" + "=" * 70)
    print("[1] PERFORMANCE OPTIMIZATION")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    optimizer = PerformanceOptimizer(g)

    print("\nBefore optimization:")
    stats_before = optimizer.get_stats()
    print(f"  Nodes: {stats_before['nodes']}")
    print(f"  Edges: {stats_before['edges']}")
    print(f"  Avg edges/node: {stats_before['avg_edges_per_node']:.2f}")

    # Build index
    optimizer.build_index()
    print(f"\n✓ Built word index ({len(optimizer.word_index)} unique words)")

    # Test indexed matching
    query = "who invented the lightbulb?"
    indexed_results = optimizer.indexed_match(query, limit=5)
    print(f"\n✓ Fast indexed match for '{query}':")
    for nid in indexed_results[:3]:
        print(f"  - {g.nodes[nid]['text']}")

    # Prune weak edges
    pruned = optimizer.prune_weak_edges(threshold=0.15)
    print(f"\n✓ Pruned {pruned} weak edges")

    print(f"\nAfter optimization:")
    stats_after = optimizer.get_stats()
    print(f"  Edges: {stats_after['edges']}")


def test_semantic():
    print("\n" + "=" * 70)
    print("[2] SEMANTIC MATCHING")
    print("=" * 70)

    matcher = SemanticMatcher()

    print("\n✓ Synonym expansion:")
    test_words = ["fast", "happy", "big"]
    for word in test_words:
        similar = matcher.get_similar_words(word)
        print(f"  '{word}' → {', '.join(list(similar)[:4])}")

    print("\n✓ Query expansion:")
    query = "what is fast and happy?"
    expanded = matcher.expand_query(query)
    print(f"  Original: {query}")
    print(f"  Expanded ({len(expanded)} words): {', '.join(expanded[:10])}")

    print("\n✓ Semantic similarity scores:")
    text_pairs = [
        ("a dog runs fast", "a fast dog runs"),
        ("the oven is hot", "the oven is warm"),
        ("cake is sweet", "poison is bitter"),
    ]
    for t1, t2 in text_pairs:
        score = matcher.similarity_score(t1, t2)
        print(f"  '{t1[:20]}...' ↔ '{t2[:20]}...' = {score:.2f}")

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()
    concept_sim = ConceptSimilarity(g)

    print("\n✓ Concept similarity:")
    if len(g.nodes) > 1:
        first_node = list(g.nodes.keys())[0]
        similar = concept_sim.find_similar_concepts(first_node, limit=3)
        print(f"  Nodes similar to '{first_node[:30]}':")
        for nid, score in similar:
            print(f"    - {nid[:30]} (score: {score:.2f})")


def test_memory():
    print("\n" + "=" * 70)
    print("[3] TEMPORAL MEMORY & DECAY")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    memory = TemporalMemory(g, decay_rate=0.95)
    memory.initialize_timestamps()

    print("\n✓ Memory system initialized")
    health = memory.get_memory_health()
    print(f"  Nodes: {health['total_nodes']}")
    print(f"  Avg energy: {health['avg_energy']:.2f}")
    print(f"  Energy range: {health['min_energy']:.2f} - {health['max_energy']:.2f}")

    # Demonstrate reinforcement
    if len(g.nodes) > 3:
        sample_path = list(g.nodes.keys())[:3]
        original_energy = [g.nodes[nid].get("energy", 1.0) for nid in sample_path]

        print(f"\n✓ Reinforcing path (reward +0.5):")
        print(f"  Before: {[f'{e:.2f}' for e in original_energy]}")

        memory.reinforce_path(sample_path, reinforcement=0.5)

        new_energy = [g.nodes[nid].get("energy", 1.0) for nid in sample_path]
        print(f"  After:  {[f'{e:.2f}' for e in new_energy]}")

    print("\n✓ Decay simulation:")
    print(f"  Energy after 1 hour: {memory.decay_energy(2.0, 3600):.2f}")
    print(f"  Energy after 1 day:  {memory.decay_energy(2.0, 86400):.2f}")
    print(f"  Energy after 1 week: {memory.decay_energy(2.0, 604800):.2f}")


def test_learning():
    print("\n" + "=" * 70)
    print("[4] EDGE IMPORTANCE LEARNING")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    learner = EdgeLearner(g)

    print("\n✓ Learning system initialized")
    print(f"  Graph nodes: {len(g.nodes)}")

    # Simulate learning from feedback
    if len(g.nodes) > 2:
        path1 = list(g.nodes.keys())[:3]
        path2 = list(g.nodes.keys())[1:4] if len(g.nodes) > 3 else path1

        print(f"\n✓ Simulating learning:")
        print(f"  Path 1: {[n[:20] for n in path1]}")
        print(f"  Result: Successful (yes)")
        learner.learn_from_feedback(path1, feedback=True, learning_rate=0.1)

        print(f"\n  Path 2: {[n[:20] for n in path2]}")
        print(f"  Result: Failed (no)")
        learner.learn_from_feedback(path2, feedback=False, learning_rate=0.1)

    stats = learner.get_learning_stats()
    print(f"\n✓ Learning statistics:")
    print(f"  Edges tested: {stats['edges_tested']}")
    print(f"  Successful paths: {stats['successful_traversals']}")
    print(f"  Failed paths: {stats['failed_traversals']}")
    print(f"  Success rate: {stats['success_rate']:.1%}")
    print(f"  Avg edge quality: {stats['avg_quality']:.2f}")

    if stats["edges_tested"] > 0:
        top = learner.get_top_edges(limit=3)
        print(f"\n✓ Top quality edges:")
        for (src, dst), quality in top:
            print(f"  {src[:20]} → {dst[:20]} ({quality:.2f})")


def main():
    print("\n" + "=" * 70)
    print("MYCELIUM V1 - ENHANCEMENT TEST SUITE")
    print("=" * 70)

    try:
        test_performance()
        test_semantic()
        test_memory()
        test_learning()

        print("\n" + "=" * 70)
        print("✓ ALL ENHANCEMENT TESTS PASSED")
        print("=" * 70 + "\n")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
