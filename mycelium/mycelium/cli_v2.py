"""Production CLI with learning, evaluation, and feedback"""

from __future__ import annotations

from pathlib import Path
from .api_v2 import MyceliumAPI


HELP = """
Mycelium v2 - Knowledge Graph with Learning & Feedback

Commands:
  ask <query>         Query the system
  feedback yes/no     Provide feedback on last response
  show stats          Show system statistics
  show learning       Show learning progress
  show coverage       Show graph coverage
  generate <query>    Generate from query
  add <fact>          Add new fact to graph
  train <file>        Train on new data
  optimize            Optimize graph performance
  quit                Exit

Examples:
  > ask what is a dog
  > feedback yes
  > show stats
  > generate water
  > add the earth orbits the sun
  > train facts.txt
"""


def main():
    """Run production CLI"""
    api = MyceliumAPI()

    print("\n" + "=" * 70)
    print("MYCELIUM V2 - KNOWLEDGE GRAPH WITH LEARNING")
    print("=" * 70)
    print(HELP)

    last_response = None
    last_path = None

    while True:
        try:
            user_input = input("\n> ").strip()

            if not user_input:
                continue

            # Parse command
            parts = user_input.split(maxsplit=1)
            command = parts[0].lower()
            args = parts[1] if len(parts) > 1 else ""

            # Query
            if command == "ask":
                if not args:
                    print("Usage: ask <query>")
                    continue

                result = api.query(args, hops=4, use_generation=True)
                last_response = result["response"]
                last_path = result["path"]

                print(f"\n✓ Response (confidence: {result['confidence']:.2f}):")
                print(f"  {result['response']}")

                if result["generated"]:
                    print(f"\n✓ Generated variant:")
                    print(f"  {result['generated']}")

                if result["alternatives"]:
                    print(f"\n  Alternative answers:")
                    for alt in result["alternatives"][:2]:
                        print(f"    - {alt}")

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

            # Stats
            elif command == "show":
                if not args:
                    print("Usage: show [stats|learning|coverage]")
                    continue

                subcommand = args.lower()

                if subcommand == "stats":
                    stats = api.get_stats()
                    print(f"\n✓ System Statistics:")
                    print(f"  Nodes: {stats['graph']['node_count']}")
                    print(f"  Edges: {stats['graph']['edge_count']}")
                    print(f"  Coverage: {stats['graph']['coverage']:.1%}")
                    print(f"  Feedback collected: {stats['feedback']['total_feedback']}")
                    print(f"  Success rate: {stats['feedback']['success_rate']:.1%}")

                elif subcommand == "learning":
                    learning = api.get_learning_status()
                    print(f"\n✓ Learning Progress:")
                    print(f"  Edges tested: {learning['stats']['edges_tested']}")
                    print(f"  Success rate: {learning['stats']['success_rate']:.1%}")
                    print(f"  Avg quality: {learning['stats']['avg_quality']:.2f}")

                    if learning["top_edges"]:
                        print(f"\n  Top performing edges:")
                        for edge_data in learning["top_edges"][:3]:
                            edge, quality = edge_data["edge"], edge_data["quality"]
                            print(f"    {edge[0][:20]} → {edge[1][:20]} ({quality:.2f})")

                elif subcommand == "coverage":
                    coverage = api.evaluator.evaluate_coverage()
                    print(f"\n✓ Graph Coverage:")
                    print(f"  Connected nodes: {coverage['connected_nodes']}/{coverage['node_count']}")
                    print(f"  Coverage: {coverage['coverage']:.1%}")
                    print(f"  Avg connections: {coverage['avg_connections']:.2f}")

            # Generate
            elif command == "generate":
                if not args:
                    print("Usage: generate <query>")
                    continue

                result = api.generator.semantic_generate(args, length=3)
                if result:
                    print(f"\n✓ Generated text:")
                    print(f"  {result}")
                else:
                    print("✗ Could not generate")

            # Add fact
            elif command == "add":
                if not args:
                    print("Usage: add <fact>")
                    continue

                result = api.add_fact(args)
                print(f"✓ Added fact (relations: {result['relations']})")

            # Train
            elif command == "train":
                if not args:
                    print("Usage: train <file>")
                    continue

                file_path = Path(args)
                if not file_path.exists():
                    print(f"✗ File not found: {args}")
                    continue

                from .graph import Graph

                with open(file_path, "r") as f:
                    lines = f.readlines()

                for line in lines:
                    line = line.strip()
                    if line:
                        api.graph.add_node(line, "fact")

                api.graph.save()
                print(f"✓ Trained on {len(lines)} lines")
                print(f"  Graph now has {len(api.graph.nodes)} nodes")

            # Optimize
            elif command == "optimize":
                result = api.optimize()
                print(f"✓ Optimized")
                print(f"  Edges pruned: {result.get('edges_pruned', 0)}")

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
