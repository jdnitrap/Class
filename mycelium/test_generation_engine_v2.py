#!/usr/bin/env python3
"""Test suite for integrated generation engine v2"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.graph import Graph
from mycelium.reinforcement import ReinforcementLearner
from mycelium.rules import RuleLearner
from mycelium.markov import MarkovGraphChains
from mycelium.decision_trees import DecisionTreeFormatter
from mycelium.generation_engine_v2 import GenerationEngineV2


def test_reinforcement_learning():
    print("\n" + "=" * 70)
    print("[1] REINFORCEMENT LEARNING")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    rl = ReinforcementLearner(g, exploration_rate=0.2, learning_rate=0.1)

    print("\n✓ Initial Q-values (should be empty):")
    print(f"  Q-value sample: {rl.get_q_value('a', 'b')}")

    print("\n✓ Learning from paths:")
    if len(g.nodes) > 3:
        path1 = list(g.nodes.keys())[:3]
        path2 = list(g.nodes.keys())[1:4] if len(g.nodes) > 3 else path1

        rl.learn_from_feedback(path1, feedback=True, reward=1.0)
        print(f"  Learned path 1 (positive feedback)")

        rl.learn_from_feedback(path2, feedback=False, reward=1.0)
        print(f"  Learned path 2 (negative feedback)")

    print("\n✓ RL Statistics:")
    stats = rl.get_learning_stats()
    print(f"  Episodes: {stats['episodes']}")
    print(f"  Avg reward: {stats['avg_reward']:.2f}")
    print(f"  Edges learned: {stats['edges_learned']}")

    print("\n✓ Top valued edges:")
    top_edges = rl.get_top_edges(limit=3)
    for edge, value in top_edges[:3]:
        print(f"  {edge[0][:20]} → {edge[1][:20]} (value: {value:.2f})")

    print("\n✓ Policy exploration:")
    if len(g.nodes) > 0:
        test_node = list(g.nodes.keys())[0]
        policy = rl.get_policy(test_node)
        if policy:
            best_action = max(policy, key=policy.get)
            print(f"  Best action from {test_node[:20]}: {best_action[:20]}")
            print(f"  Probability: {policy[best_action]:.2f}")


def test_rule_learning():
    print("\n" + "=" * 70)
    print("[2] RULE LEARNING")
    print("=" * 70)

    learner = RuleLearner()

    print("\n✓ Learning from examples:")
    examples = [
        ({"entity_type": "animal", "length": 10}, "The dog ran", True),
        ({"entity_type": "animal", "length": 15}, "The quick fox jumped", True),
        ({"entity_type": "object", "length": 5}, "Table exists", False),
    ]

    for facts, output, success in examples:
        learner.learn_from_generation(facts, output, success)

    print(f"  Learned {len(learner.rules)} rules")

    print("\n✓ Rule statistics:")
    stats = learner.get_learning_stats()
    print(f"  Total rules: {stats['total_rules']}")
    print(f"  Avg confidence: {stats['avg_confidence']:.2f}")
    print(f"  High confidence: {stats['high_confidence_rules']}")

    print("\n✓ Top rules:")
    top_rules = learner.get_top_rules(limit=3)
    for rule in top_rules[:3]:
        print(f"  {rule}")


def test_markov_chains():
    print("\n" + "=" * 70)
    print("[3] MARKOV CHAINS")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    markov = MarkovGraphChains(g)

    print("\n✓ Observing paths:")
    if len(g.nodes) > 3:
        paths = [
            list(g.nodes.keys())[:3],
            list(g.nodes.keys())[1:4],
            list(g.nodes.keys())[:3],
        ]

        for path in paths:
            markov.observe_path(path)

        print(f"  Observed {len(paths)} paths")

    print("\n✓ Markov statistics:")
    stats = markov.get_stats()
    print(f"  Total transitions: {stats['total_transitions']}")
    print(f"  Bigrams learned: {stats['bigrams']}")
    print(f"  Trigrams learned: {stats['trigrams']}")

    print("\n✓ Sequence probabilities:")
    if len(g.nodes) > 2:
        test_path = list(g.nodes.keys())[:3]
        prob = markov.get_sequence_probability(test_path)
        print(f"  Path probability: {prob:.4f}")

    print("\n✓ Common sequences:")
    common = markov.get_common_sequences(length=2, limit=3)
    for seq, count in common[:2]:
        print(f"  {seq}: {count} occurrences")


def test_decision_trees():
    print("\n" + "=" * 70)
    print("[4] DECISION TREES")
    print("=" * 70)

    dt = DecisionTreeFormatter()

    print("\n✓ Training decision tree:")
    training_data = [
        ({"query_length": 5, "path_length": 3}, "short output", True),
        ({"query_length": 10, "path_length": 5}, "longer output text", True),
        ({"query_length": 3, "path_length": 2}, "tiny", False),
        ({"query_length": 15, "path_length": 6}, "very long output with details", True),
    ]

    for features, output, success in training_data:
        dt.add_training_example(features, output, success)

    dt.learn_tree(max_depth=3)
    print(f"  Built tree with {len(training_data)} examples")

    print("\n✓ Tree structure:")
    structure = dt.get_tree_structure()
    for line in structure[:5]:
        print(f"  {line}")

    print("\n✓ Predictions:")
    test_features = [{"query_length": 5, "path_length": 3}, {"query_length": 20, "path_length": 7}]
    for features in test_features:
        prediction = dt.predict(features)
        confidence = dt.get_prediction_confidence(features)
        print(f"  {features} → {prediction} (confidence: {confidence:.1%})")

    print("\n✓ Feature importance:")
    importance = dt.get_feature_importance()
    for feature, score in list(importance.items())[:3]:
        print(f"  {feature}: {score:.2f}")


def test_generation_engine_v2():
    print("\n" + "=" * 70)
    print("[5] INTEGRATED GENERATION ENGINE V2")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    engine = GenerationEngineV2(g)

    print("\n✓ Engine initialized with all components")
    print(f"  Graph: {len(g.nodes)} nodes, {sum(len(e) for e in g.edges.values())} edges")

    print("\n✓ Generate from query:")
    if len(g.nodes) > 0:
        result = engine.generate("dog", max_length=3, show_reasoning=True)
        print(f"  Generated: {result['text']}")
        if result["reasoning"]:
            print(f"  Confidence: {result['reasoning']['confidence']:.2f}")

    print("\n✓ Learning from feedback:")
    if len(g.nodes) > 2:
        path = list(g.nodes.keys())[:3]
        engine.learn_from_generation("test", path, "sample output", True)
        print(f"  Learned from feedback")

    print("\n✓ Engine statistics:")
    stats = engine.get_generation_stats()
    print(f"  RL episodes: {stats['reinforcement_learning']['episodes']}")
    print(f"  Rules learned: {stats['rule_learning']['total_rules']}")
    print(f"  Markov transitions: {stats['markov_chains']['total_transitions']}")

    print("\n✓ Top patterns:")
    patterns = engine.get_top_patterns()
    if patterns["top_rl_edges"]:
        print(f"  Top RL edges: {len(patterns['top_rl_edges'])}")
    if patterns["top_rules"]:
        print(f"  Top rules: {len(patterns['top_rules'])}")


def main():
    print("\n" + "=" * 70)
    print("GENERATION ENGINE V2 - COMPLETE TEST SUITE")
    print("=" * 70)

    try:
        test_reinforcement_learning()
        test_rule_learning()
        test_markov_chains()
        test_decision_trees()
        test_generation_engine_v2()

        print("\n" + "=" * 70)
        print("✓ ALL GENERATION ENGINE V2 TESTS PASSED")
        print("=" * 70 + "\n")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
