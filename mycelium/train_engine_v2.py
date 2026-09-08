#!/usr/bin/env python3
"""Train generation engine v2 on the expanded knowledge graph"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.graph import Graph
from mycelium.generation_engine_v2 import GenerationEngineV2


def train_on_queries(engine: GenerationEngineV2, queries: list, epochs: int = 3):
    """Train engine on sample queries with simulated feedback"""
    print(f"\n📚 Training on {len(queries)} queries for {epochs} epochs...")

    for epoch in range(epochs):
        print(f"\n🔄 Epoch {epoch + 1}/{epochs}")
        correct = 0

        for i, query in enumerate(queries):
            # Generate
            result = engine.generate(query, max_length=4, show_reasoning=False)

            # Simulate feedback (longer outputs = positive, short = negative)
            output_length = len(result["text"].split())
            feedback = output_length > 2

            if feedback:
                correct += 1

            # Extract path from reasoning would be ideal, but for training use simulated
            reasoning = result.get("reasoning", {})
            if reasoning and "path" in reasoning:
                path = reasoning["path"]
            else:
                # Fallback: use graph walk
                path = engine.graph.walk(query, hops=3)

            if path:
                engine.learn_from_generation(query, path, result["text"], feedback)

            # Progress
            if (i + 1) % 5 == 0:
                print(
                    f"  Processed {i + 1}/{len(queries)} "
                    f"(accuracy: {correct}/{i + 1} = {correct/(i+1)*100:.0f}%)"
                )

    print(f"\n✓ Training complete")


def evaluate_engine(engine: GenerationEngineV2, test_queries: list) -> dict:
    """Evaluate engine on test queries"""
    print(f"\n📊 Evaluating on {len(test_queries)} test queries...")

    total_confidence = 0
    outputs = []

    for query in test_queries:
        result = engine.generate(query, max_length=4, show_reasoning=True)
        reasoning = result.get("reasoning")
        if isinstance(reasoning, dict):
            confidence = reasoning.get("confidence", 0)
        else:
            confidence = 0
        total_confidence += confidence

        outputs.append(
            {
                "query": query,
                "output": result["text"],
                "confidence": confidence,
            }
        )

    avg_confidence = total_confidence / len(test_queries)

    return {
        "avg_confidence": avg_confidence,
        "outputs": outputs,
    }


def main():
    print("\n" + "=" * 70)
    print("TRAINING GENERATION ENGINE V2")
    print("=" * 70)

    # Load graph
    print("\n📖 Loading graph...")
    g = Graph(Path("mycelium/state/graph.json"))
    g.load()
    print(f"✓ Loaded {len(g.nodes)} nodes, {sum(len(e) for e in g.edges.values())} edges")

    # Initialize engine
    print("\n🏗️  Initializing generation engine v2...")
    engine = GenerationEngineV2(g)
    print("✓ Engine ready")

    # Training queries
    training_queries = [
        "dog",
        "water",
        "plants",
        "sky",
        "heat",
        "movement",
        "animals",
        "light",
        "food",
        "learning",
        "love",
        "growth",
    ]

    # Train
    train_on_queries(engine, training_queries, epochs=3)

    # Evaluate
    test_queries = ["dog", "water", "sky", "growth", "learning"]
    evaluation = evaluate_engine(engine, test_queries)

    print(f"\n📈 Results:")
    print(f"  Average confidence: {evaluation['avg_confidence']:.2f}")

    print(f"\n✨ Sample outputs:")
    for output in evaluation["outputs"][:3]:
        print(f"\n  Query: '{output['query']}'")
        print(f"  Generated: '{output['output']}'")
        print(f"  Confidence: {output['confidence']:.2f}")

    # Stats
    print(f"\n📊 Learning Statistics:")
    stats = engine.get_generation_stats()

    print(f"\n  Reinforcement Learning:")
    rl_stats = stats["reinforcement_learning"]
    print(f"    Episodes: {rl_stats['episodes']}")
    print(f"    Avg reward: {rl_stats['avg_reward']:.2f}")
    print(f"    Edges learned: {rl_stats['edges_learned']}")

    print(f"\n  Rule Learning:")
    rule_stats = stats["rule_learning"]
    print(f"    Total rules: {rule_stats['total_rules']}")
    print(f"    Avg confidence: {rule_stats['avg_confidence']:.2f}")
    print(f"    High confidence: {rule_stats['high_confidence_rules']}")

    print(f"\n  Markov Chains:")
    markov_stats = stats["markov_chains"]
    print(f"    Transitions: {markov_stats['total_transitions']}")
    print(f"    Bigrams: {markov_stats['bigrams']}")
    print(f"    Trigrams: {markov_stats['trigrams']}")
    print(f"    Avg entropy: {markov_stats['avg_entropy']:.2f}")

    print(f"\n  Decision Trees:")
    dt_stats = stats["decision_tree"]
    print(f"    Training examples: {dt_stats['training_examples']}")
    features = dt_stats.get("feature_importance", {})
    if features:
        top_feature = max(features, key=features.get)
        print(f"    Top feature: {top_feature} ({features[top_feature]:.2f})")

    # Top patterns
    print(f"\n🏆 Top Learned Patterns:")
    patterns = engine.get_top_patterns()

    if patterns["top_rl_edges"]:
        print(f"\n  Best RL edges:")
        for edge, value in patterns["top_rl_edges"][:3]:
            print(f"    {edge[0][:20]} → {edge[1][:20]} (value: {value:.2f})")

    if patterns["top_rules"]:
        print(f"\n  Best rules:")
        for rule, conf in patterns["top_rules"][:3]:
            print(f"    {rule} (confidence: {conf:.2f})")

    if patterns["common_sequences"]:
        print(f"\n  Common sequences:")
        for seq, count in patterns["common_sequences"][:3]:
            if len(seq) == 2:
                print(f"    {seq[0][:15]} → {seq[1][:15]} ({count}x)")

    print("\n" + "=" * 70)
    print("✓ TRAINING COMPLETE")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
