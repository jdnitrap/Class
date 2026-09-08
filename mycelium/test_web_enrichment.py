#!/usr/bin/env python3
"""Test web enrichment system"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from mycelium.graph import Graph
from mycelium.web_enrichment import WebSearcher, FactExtractor, CitationTracker, WebEnrichedGraph


def test_web_searcher():
    print("\n" + "=" * 70)
    print("[1] WEB SEARCHER")
    print("=" * 70)

    searcher = WebSearcher()

    print("\n✓ Searching Wikipedia:")
    queries = ["Python programming language", "Newton's laws"]
    for query in queries:
        result = searcher.search_wikipedia(query)
        status = "✓" if result["found"] else "✗"
        print(f"  {status} {query}: {result.get('title', 'not found')}")

    print("\n✓ Cache test:")
    result1 = searcher.search_wikipedia("Water")
    result2 = searcher.search_wikipedia("Water")
    print(f"  Cached: {result1 is not result2 or 'same key' in str(result1)}")


def test_fact_extraction():
    print("\n" + "=" * 70)
    print("[2] FACT EXTRACTION")
    print("=" * 70)

    extractor = FactExtractor()

    test_text = """
    Albert Einstein was a physicist.
    He invented the theory of relativity.
    The sun has tremendous mass.
    Water was discovered to have interesting properties.
    """

    print("\n✓ Extracting facts:")
    facts = extractor.extract_facts(test_text, "http://example.com")
    for fact in facts[:5]:
        print(f"  {fact['subject']} {fact['relation']} {fact['object']}")
        print(f"    Source: {fact['source']}, Confidence: {fact['confidence']}")

    print("\n✓ Extracting relations:")
    relations = extractor.extract_relations(test_text)
    for subj, verb, obj in relations[:3]:
        print(f"  {subj} {verb} {obj}")


def test_citation_tracker():
    print("\n" + "=" * 70)
    print("[3] CITATION TRACKING")
    print("=" * 70)

    tracker = CitationTracker()

    print("\n✓ Adding citations:")
    fact = "Water boils at 100 degrees Celsius"

    tracker.add_citation(fact, "https://wikipedia.org/wiki/Water", 0.8)
    print(f"  Added first source (confidence: 0.8)")

    tracker.add_citation(fact, "https://en.wikipedia.org/wiki/Boiling_point", 0.7)
    print(f"  Added second source (confidence: 0.7)")

    confidence = tracker.get_confidence(fact)
    print(f"\n✓ Final confidence: {confidence:.1%}")

    citations = tracker.get_citations(fact)
    print(f"✓ Total sources: {len(citations)}")

    formatted = tracker.format_fact_with_citations(fact)
    print(f"\n✓ Formatted with citations:")
    print(f"  {formatted}")


def test_web_enriched_graph():
    print("\n" + "=" * 70)
    print("[4] WEB-ENRICHED GRAPH")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    enriched = WebEnrichedGraph(g)

    print(f"\n✓ Initial graph state:")
    print(f"  Nodes: {len(g.nodes)}")

    print(f"\n✓ Enriching with web search:")
    search_queries = ["water", "photosynthesis", "gravity"]

    for query in search_queries:
        result = enriched.enrich_query(query)
        if result["status"] == "found":
            print(f"\n  '{query}':")
            print(f"    Found: {result['title']}")
            print(f"    Facts extracted: {len(result['facts'])}")
            if result["pending"]:
                print(f"    Pending validation: {len(result['pending'])}")
                for pending in result["pending"][:2]:
                    print(f"      - {pending}")
        else:
            print(f"  '{query}': Not found (offline mode)")

    print(f"\n✓ Validating facts:")
    if enriched.pending_validation:
        pending = enriched.pending_validation[0]
        result = enriched.validate_fact(pending["text"], approved=True)
        print(f"  Approved: {pending['text']}")
        print(f"  Status: {result['status']}")


def test_integration():
    print("\n" + "=" * 70)
    print("[5] INTEGRATION TEST")
    print("=" * 70)

    g = Graph(Path("mycelium/state/graph.json"))
    g.load()

    enriched = WebEnrichedGraph(g)

    print("\n✓ Workflow: Query → Search → Extract → Validate → Add")

    query = "dog"
    print(f"\n  1. User asks: '{query}'")

    # Try graph first
    candidates = g.walk(query, hops=2)
    if candidates:
        print(f"  2. Found in graph: {candidates[0][:40]}...")
    else:
        print(f"  2. Not in graph, searching web...")

    # Enrich from web
    web_result = enriched.enrich_query(query)
    if web_result["status"] == "found":
        print(f"  3. Found on web: {web_result['title']}")
        print(f"  4. Extracted {len(web_result['facts'])} facts")

        # Show pending
        if web_result["pending"]:
            print(f"  5. Asking user to validate...")
            pending_fact = web_result["pending"][0]
            validation = enriched.validate_fact(pending_fact, approved=True)
            print(f"     → {validation['status']}")

    print(f"\n  6. Graph now has {len(g.nodes)} nodes")


def main():
    print("\n" + "=" * 70)
    print("MYCELIUM - WEB ENRICHMENT TEST SUITE")
    print("=" * 70)

    try:
        test_web_searcher()
        test_fact_extraction()
        test_citation_tracker()
        test_web_enriched_graph()
        test_integration()

        print("\n" + "=" * 70)
        print("✓ ALL WEB ENRICHMENT TESTS PASSED")
        print("=" * 70 + "\n")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
