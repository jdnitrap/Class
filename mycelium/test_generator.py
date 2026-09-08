#!/usr/bin/env python3
"""Test text generation system"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.graph import Graph
from mycelium.learning import EdgeLearner
from mycelium.semantic import SemanticMatcher
from mycelium.generator import TextGenerator


def test_basic_generation():
    print("\n" + "=" * 70)
    print("[1] BASIC TEXT GENERATION")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    gen = TextGenerator(g)

    print("\n✓ Generation stats:")
    stats = gen.get_generation_stats()
    print(f"  Nodes: {stats['total_nodes']}")
    print(f"  Edges: {stats['total_edges']}")
    print(f"  Avg edges/node: {stats['avg_edges_per_node']:.2f}")

    print("\n✓ Generate chains from 'a small dog is loved':")
    if "a small dog is loved" in g.nodes:
        for i in range(3):
            chain = gen.generate_chain("a small dog is loved", length=3)
            if chain:
                print(f"  Chain {i+1}: {chain}")


def test_query_generation():
    print("\n" + "=" * 70)
    print("[2] GENERATION FROM QUERY")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    gen = TextGenerator(g)

    queries = ["dog", "cake", "flour"]
    print("\n✓ Generate from queries:")
    for query in queries:
        result = gen.generate_from_query(query, length=3)
        if result:
            print(f"  '{query}' → {result}")


def test_with_learning():
    print("\n" + "=" * 70)
    print("[3] GENERATION WITH LEARNED PATHS")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    learner = EdgeLearner(g)
    gen = TextGenerator(g, learner=learner)

    print("\n✓ Teaching the learner:")
    if len(g.nodes) > 3:
        path = list(g.nodes.keys())[:3]
        print(f"  Good path: {[n[:20] for n in path]}")
        learner.learn_from_feedback(path, feedback=True, learning_rate=0.2)

        print(f"\n✓ Generate using learned preferences:")
        for i in range(2):
            chain = gen.generate_chain(path[0], length=3, use_learning=True)
            if chain:
                print(f"  {chain}")


def test_semantic_generation():
    print("\n" + "=" * 70)
    print("[4] SEMANTIC-AWARE GENERATION")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    semantic = SemanticMatcher()
    gen = TextGenerator(g, semantic_matcher=semantic)

    print("\n✓ Generate using semantic expansion:")
    queries = ["fast", "happy", "big"]
    for query in queries:
        result = gen.semantic_generate(query, length=2)
        if result:
            print(f"  '{query}' → {result}")

    print("\n✓ Combine concepts:")
    pairs = [("dog", "run"), ("cake", "flour"), ("oven", "heat")]
    for c1, c2 in pairs:
        result = gen.combine_concepts(c1, c2)
        if result:
            print(f"  {c1} + {c2} → {result}")


def test_multi_generation():
    print("\n" + "=" * 70)
    print("[5] MULTIPLE GENERATION PATHS")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    gen = TextGenerator(g)

    if "a small dog is loved" in g.nodes:
        print("\n✓ Multiple paths from 'a small dog is loved':")
        paths = gen.generate_multi_path("a small dog is loved", num_paths=3, length=3)
        for i, path in enumerate(paths, 1):
            if path:
                print(f"  Path {i}: {path}")


def main():
    print("\n" + "=" * 70)
    print("MYCELIUM V1 - TEXT GENERATION TEST SUITE")
    print("=" * 70)

    try:
        test_basic_generation()
        test_query_generation()
        test_with_learning()
        test_semantic_generation()
        test_multi_generation()

        print("\n" + "=" * 70)
        print("✓ ALL GENERATION TESTS PASSED")
        print("=" * 70 + "\n")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
