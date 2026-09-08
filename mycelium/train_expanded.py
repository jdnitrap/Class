#!/usr/bin/env python3
"""Train on expanded dataset and measure improvement"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.graph import Graph
from mycelium.performance import PerformanceOptimizer
from mycelium.evaluation import Evaluator
from mycelium.learning import EdgeLearner


def train_on_file(graph, filename: str):
    """Train graph on sentences from file"""
    with open(filename, "r") as f:
        lines = f.readlines()

    for line in lines:
        line = line.strip()
        if line:
            graph.add_node(line, "fact")

    # Create some links between related concepts
    nodes = list(graph.nodes.keys())
    for i, node in enumerate(nodes):
        # Link to next node (creates chains)
        if i + 1 < len(nodes):
            graph.link(nodes[i], nodes[i + 1])

    graph.save()


def main():
    print("\n" + "=" * 70)
    print("TRAINING ON EXPANDED DATASET")
    print("=" * 70)

    graph_path = Path("mycelium/state/graph.json")
    g = Graph(graph_path)
    g.load()

    print(f"\n📊 Before expansion:")
    print(f"  Nodes: {len(g.nodes)}")
    print(f"  Edges: {sum(len(e) for e in g.edges.values())}")

    # Train on expanded data
    print(f"\n📖 Training on expanded_training.txt...")
    train_on_file(g, "mycelium/expanded_training.txt")

    print(f"\n📊 After training:")
    print(f"  Nodes: {len(g.nodes)}")
    print(f"  Edges: {sum(len(e) for e in g.edges.values())}")

    # Optimize
    print(f"\n⚡ Optimizing...")
    optimizer = PerformanceOptimizer(g)
    optimizer.build_index()
    pruned = optimizer.prune_weak_edges(threshold=0.15)
    print(f"  Pruned {pruned} weak edges")
    print(f"  Built word index: {len(optimizer.word_index)} unique words")

    # Evaluate
    print(f"\n📈 System evaluation:")
    learner = EdgeLearner(g)
    evaluator = Evaluator(g, learner=learner)

    coverage = evaluator.evaluate_coverage()
    print(f"  Graph coverage: {coverage['coverage']:.1%}")
    print(f"  Avg connections: {coverage['avg_connections']:.2f}")

    # Test queries
    print(f"\n🔍 Testing queries on expanded graph:")
    test_queries = [
        "what is a dog",
        "how does water cycle",
        "what is gravity",
        "why do we need air",
        "how do plants grow",
    ]

    for query in test_queries:
        results = g.walk(query, hops=4)
        if results:
            print(f"  '{query}' → {results[0][:40]}...")
        else:
            print(f"  '{query}' → (no results)")

    print("\n" + "=" * 70)
    print("✓ EXPANSION COMPLETE")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
