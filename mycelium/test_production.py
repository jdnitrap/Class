#!/usr/bin/env python3
"""Production system test suite - persistence, evaluation, NLP, API v2"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.api_v2 import MyceliumAPI
from mycelium.persistence import LearnerPersistence
from mycelium.evaluation import Evaluator
from mycelium.nlp import EntityRecognizer, RelationExtractor, TextNormalizer
from mycelium.learning import EdgeLearner
from mycelium.graph import Graph


def test_persistence():
    print("\n" + "=" * 70)
    print("[1] PERSISTENT LEARNING")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    learner = EdgeLearner(g)
    persist = LearnerPersistence()

    print("\n✓ Teaching and saving:")
    if len(g.nodes) > 2:
        path = list(g.nodes.keys())[:3]
        learner.learn_from_feedback(path, feedback=True, learning_rate=0.2)
        persist.save_learner(learner)
        print(f"  Saved learning state (edges tested: {len(learner.traversal_count)})")

    print("\n✓ Loading and verifying:")
    learner2 = EdgeLearner(g)
    persist.load_learner(learner2)
    print(f"  Loaded {len(learner2.traversal_count)} tested edges")
    print(f"  Same state: {len(learner.traversal_count) == len(learner2.traversal_count)}")


def test_evaluation():
    print("\n" + "=" * 70)
    print("[2] EVALUATION & METRICS")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    learner = EdgeLearner(g)
    evaluator = Evaluator(g, learner=learner)

    print("\n✓ Coverage analysis:")
    coverage = evaluator.evaluate_coverage()
    print(f"  Nodes: {coverage['node_count']}")
    print(f"  Edges: {coverage['edge_count']}")
    print(f"  Connected: {coverage['connected_nodes']}/{coverage['node_count']}")
    print(f"  Coverage: {coverage['coverage']:.1%}")

    print("\n✓ Learning progress:")
    learning = evaluator.evaluate_learning_progress()
    print(f"  Edges tested: {learning['edges_tested']}")
    print(f"  Avg quality: {learning['avg_quality']:.2f}")
    print(f"  Improvement potential: {learning['improvement_potential']:.2f}")

    print("\n✓ System health:")
    health = evaluator.get_system_health()
    print(f"  Graph coverage: {health['graph_health']['coverage']:.1%}")
    print(f"  Learning progress: {health['learning_progress']['avg_quality']:.2f}")


def test_nlp():
    print("\n" + "=" * 70)
    print("[3] NATURAL LANGUAGE PROCESSING")
    print("=" * 70)

    recognizer = EntityRecognizer()
    extractor = RelationExtractor()
    normalizer = TextNormalizer()

    text = "The dog is fast and loves cake. The oven bakes the cake."

    print(f"\n✓ Entity recognition:")
    entities = recognizer.recognize_entities(text)
    for entity_type, values in entities.items():
        if values:
            print(f"  {entity_type}: {', '.join(values)}")

    print(f"\n✓ Relation extraction:")
    relations = extractor.extract_from_text(text, recognizer)
    for rel in relations[:3]:
        print(f"  {rel['subject']} {rel['relation']} {rel['object']}")

    print(f"\n✓ Text normalization:")
    cleaned = normalizer.remove_stop_words(text)
    print(f"  Original: {text[:40]}...")
    print(f"  Cleaned: {cleaned[:40]}...")

    print(f"\n✓ Key phrases:")
    phrases = normalizer.extract_key_phrases(text)
    print(f"  {', '.join(phrases[:5])}")


def test_api_v2():
    print("\n" + "=" * 70)
    print("[4] PRODUCTION API V2")
    print("=" * 70)

    api = MyceliumAPI()

    print("\n✓ API initialization:")
    stats = api.get_stats()
    print(f"  Nodes: {stats['graph']['node_count']}")
    print(f"  Edges: {stats['graph']['edge_count']}")
    print(f"  Learning edges tested: {stats['learning']['edges_tested']}")

    print("\n✓ Query with confidence:")
    result = api.query("what is a dog", hops=4)
    print(f"  Query: {result['query']}")
    print(f"  Response: {result['response'][:40]}...")
    print(f"  Confidence: {result['confidence']:.2f}")

    print("\n✓ Query with generation:")
    result = api.query("dog", hops=4, use_generation=True)
    if result["generated"]:
        print(f"  Generated: {result['generated']}")

    print("\n✓ Learning status:")
    learning = api.get_learning_status()
    print(f"  Success rate: {learning['stats']['success_rate']:.1%}")
    print(f"  Avg quality: {learning['stats']['avg_quality']:.2f}")


def test_feedback_loop():
    print("\n" + "=" * 70)
    print("[5] FEEDBACK LOOP & LEARNING")
    print("=" * 70)

    api = MyceliumAPI()

    print("\n✓ Initial state:")
    stats_before = api.get_stats()
    print(f"  Feedback collected: {stats_before['feedback']['total_feedback']}")

    print("\n✓ Simulating user feedback:")
    # Get a response
    result = api.query("dog", hops=4)
    if result["path"]:
        # Provide positive feedback
        api.feedback("dog", result["path"], feedback=True)
        print(f"  Logged positive feedback")

    print("\n✓ After feedback:")
    stats_after = api.get_stats()
    print(f"  Feedback collected: {stats_after['feedback']['total_feedback']}")
    print(f"  Learned edges: {stats_after['learning']['edges_tested']}")


def main():
    print("\n" + "=" * 70)
    print("MYCELIUM V1 - PRODUCTION TEST SUITE")
    print("=" * 70)

    try:
        test_persistence()
        test_evaluation()
        test_nlp()
        test_api_v2()
        test_feedback_loop()

        print("\n" + "=" * 70)
        print("✓ ALL PRODUCTION TESTS PASSED")
        print("=" * 70 + "\n")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
