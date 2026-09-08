"""Experimental graph visualization for Mycelium v1"""

from __future__ import annotations

from .graph import Graph


def graph_to_dot(graph: Graph) -> str:
    """Export graph as Graphviz DOT format for visualization"""
    lines = ["digraph Mycelium {"]
    lines.append('  rankdir=LR;')
    lines.append('  node [shape=box, style=rounded];')

    # Add nodes
    for nid, node in graph.nodes.items():
        energy = node.get("energy", 1.0)
        color = "lightblue" if energy > 2.0 else "lightyellow"
        label = node["text"][:30] + ("..." if len(node["text"]) > 30 else "")
        lines.append(f'  "{nid}" [label="{label}", color="{color}"];')

    # Add edges
    for src, targets in graph.edges.items():
        for tgt, strength in targets.items():
            if strength > 0.5:
                width = min(3.0, strength / 2.0)
                lines.append(f'  "{src}" -> "{tgt}" [penwidth={width}];')

    lines.append("}")
    return "\n".join(lines)


def graph_summary(graph: Graph) -> str:
    """Generate a text summary of graph structure"""
    output = []
    output.append("=" * 60)
    output.append("MYCELIUM GRAPH SUMMARY")
    output.append("=" * 60)
    output.append(f"\nNodes: {len(graph.nodes)}")
    output.append(f"Edges: {sum(len(e) for e in graph.edges.values())}")

    # High-energy nodes
    output.append("\nHigh-Energy Concepts:")
    nodes = [(n, graph.nodes[n].get("energy", 1.0)) for n in graph.nodes]
    for node, energy in sorted(nodes, key=lambda x: x[1], reverse=True)[:10]:
        output.append(f"  • {node:40} {energy:5.1f}")

    # Well-connected nodes
    output.append("\nMost Connected:")
    conn = [(n, len(graph.edges.get(n, {}))) for n in graph.nodes]
    for node, count in sorted(conn, key=lambda x: x[1], reverse=True)[:10]:
        output.append(f"  • {node:40} {count:3d} edges")

    return "\n".join(output)


def ascii_graph(graph: Graph, max_nodes: int = 15) -> str:
    """Simple ASCII visualization of top nodes and connections"""
    output = []
    output.append("\nASCII Graph Visualization (top nodes):\n")

    nodes = [(n, len(graph.edges.get(n, {}))) for n in graph.nodes]
    top = sorted(nodes, key=lambda x: x[1], reverse=True)[:max_nodes]

    for i, (node, conn_count) in enumerate(top, 1):
        bar = "█" * min(conn_count, 20)
        output.append(f"{i:2d}. [{bar:20s}] {node[:35]}")

    return "\n".join(output)
