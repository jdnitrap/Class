"""Production CLI v3 with web enrichment and source attribution"""

from __future__ import annotations

from pathlib import Path
from .api_v3 import MyceliumAPIv3


HELP = """
Mycelium v3 - Knowledge Graph with Web Enrichment

Commands:
  ask <query>         Query graph (falls back to web if needed)
  web <query>         Search web and show results
  validate <yes|no>   Approve/reject pending web facts
  feedback <yes|no>   Rate last graph response
  show audit          Show sourced vs trained knowledge
  show pending        Show facts awaiting validation
  add <fact>          Add fact to graph manually
  train <file>        Train on file
  show stats          System statistics
  show learning       Learning progress
  quit                Exit

Examples:
  > ask what is photosynthesis
  > web gravity
  > validate yes
  > show audit
  > show pending
"""


def format_web_result(result: dict) -> None:
    """Format and display web search result"""
    print(f"\n✓ Found on web: {result['title']}")
    print(f"  URL: {result['url']}")
    if result.get("summary"):
        print(f"  Summary: {result['summary'][:150]}...")

    if result.get("facts"):
        print(f"\n  Extracted facts ({len(result['facts'])}):")
        for i, fact in enumerate(result["facts"][:3], 1):
            print(
                f"    {i}. {fact['subject']} {fact['relation']} {fact['object']}"
            )
            print(f"       Confidence: {fact['confidence']:.0%}")


def main():
    """Run production CLI v3"""
    api = MyceliumAPIv3()

    print("\n" + "=" * 70)
    print("MYCELIUM V3 - KNOWLEDGE GRAPH WITH WEB ENRICHMENT")
    print("=" * 70)
    print(HELP)

    last_response = None
    last_path = None
    pending_index = 0

    while True:
        try:
            user_input = input("\n> ").strip()

            if not user_input:
                continue

            # Parse command
            parts = user_input.split(maxsplit=1)
            command = parts[0].lower()
            args = parts[1] if len(parts) > 1 else ""

            # Ask - with web fallback
            if command == "ask":
                if not args:
                    print("Usage: ask <query>")
                    continue

                result = api.query_with_web_fallback(args, use_web=True)
                last_path = result.get("path")

                if result["source"] == "graph":
                    print(f"\n✓ From graph (confidence: {result['confidence']:.2f}):")
                    print(f"  {result['response']}")

                    if result["generated"]:
                        print(f"\n  Generated variant:")
                        print(f"    {result['generated']}")

                elif result["source"] == "web":
                    format_web_result(result)

                    if result.get("pending_validation"):
                        print(f"\n  ⚠ Requires validation. Use 'validate yes' to add to graph")
                        pending_index = 0

            # Web search
            elif command == "web":
                if not args:
                    print("Usage: web <query>")
                    continue

                result = api.enriched_graph.enrich_query(args)

                if result["status"] == "found":
                    format_web_result(result)

                    if result["pending"]:
                        print(f"\n  ⚠ {len(result['pending'])} facts need validation")
                        pending_index = 0
                else:
                    print(f"✗ No web results for '{args}'")

            # Validate pending facts
            elif command == "validate":
                if not args.lower() in ["yes", "no"]:
                    print("Usage: validate yes/no")
                    continue

                if not api.enriched_graph.pending_validation:
                    print("No pending facts to validate")
                    continue

                approved = args.lower() == "yes"
                pending = api.enriched_graph.pending_validation[pending_index]
                result = api.validate_and_add_web_fact(pending["text"], approved)

                if approved:
                    print(f"✓ Added to graph: {pending['text']}")
                else:
                    print(f"✓ Rejected: {pending['text']}")

                pending_index += 1
                if pending_index >= len(api.enriched_graph.pending_validation):
                    print("\n✓ All facts validated!")
                    pending_index = 0

            # Feedback
            elif command == "feedback":
                if not args.lower() in ["yes", "no"]:
                    print("Usage: feedback yes/no")
                    continue

                if not last_path:
                    print("No response to provide feedback on")
                    continue

                feedback_val = args.lower() == "yes"
                result = api.feedback(user_input, last_path, feedback_val)
                print(f"✓ Feedback recorded: {feedback_val}")

            # Show audit
            elif command == "show":
                if not args:
                    print("Usage: show [audit|pending|stats|learning]")
                    continue

                subcommand = args.lower()

                if subcommand == "audit":
                    audit = api.get_knowledge_audit()
                    print(f"\n✓ Knowledge Audit:")
                    print(f"  Total nodes: {audit['total_nodes']}")
                    print(f"  From web sources: {audit['sourced_from_web']}")
                    print(f"  From training: {audit['from_training']}")
                    print(f"  Web-sourced: {audit['sourced_percentage']:.1f}%")

                    if audit["pending_web_facts"]:
                        print(f"  Awaiting validation: {audit['pending_web_facts']}")

                elif subcommand == "pending":
                    pending = api.enriched_graph.pending_validation
                    if not pending:
                        print("No pending facts")
                    else:
                        print(f"\n✓ Pending validation ({len(pending)}):")
                        for i, fact in enumerate(pending[:5], 1):
                            print(f"  {i}. {fact['text']}")
                            print(f"     Source: {fact['source']}")

                elif subcommand == "stats":
                    stats = api.get_stats()
                    print(f"\n✓ System Statistics:")
                    print(f"  Nodes: {stats['graph']['node_count']}")
                    print(f"  Edges: {stats['graph']['edge_count']}")
                    print(f"  Coverage: {stats['graph']['coverage']:.1%}")
                    print(f"  Feedback collected: {stats['feedback']['total_feedback']}")

                elif subcommand == "learning":
                    learning = api.get_learning_status()
                    print(f"\n✓ Learning Progress:")
                    print(f"  Edges tested: {learning['stats']['edges_tested']}")
                    print(f"  Success rate: {learning['stats']['success_rate']:.1%}")

            # Add fact
            elif command == "add":
                if not args:
                    print("Usage: add <fact>")
                    continue

                result = api.add_fact(args)
                print(f"✓ Added fact")

            # Train
            elif command == "train":
                if not args:
                    print("Usage: train <file>")
                    continue

                file_path = Path(args)
                if not file_path.exists():
                    print(f"✗ File not found: {args}")
                    continue

                with open(file_path, "r") as f:
                    lines = f.readlines()

                for line in lines:
                    line = line.strip()
                    if line:
                        api.graph.add_node(line, "fact")

                api.graph.save()
                print(f"✓ Trained on {len(lines)} lines")

            # Help
            elif command == "help":
                print(HELP)

            # Quit
            elif command == "quit":
                print("\nGoodbye!")
                break

            else:
                print(f"Unknown command: {command}")
                print("Type 'help' for commands")

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"✗ Error: {e}")


if __name__ == "__main__":
    main()
