# Mycelium Experiments Branch

**Branch:** `mycelium/experiments`

This branch contains experimental features and enhancements for Mycelium v1 that are not yet in the main release.

## Active Experiments

### 1. **REST API Interface** (`mycelium/api.py`)
A JSON-based API for programmatic access to Mycelium operations.

**Features:**
- `query(text, hops)` - Walk graph and return JSON results
- `add_fact(text)` - Add new facts to the graph
- `get_stats()` - Retrieve graph statistics
- `export_graph()` - Export full graph as JSON

**Usage Example:**
```python
from mycelium.api import MyceliumAPI
from pathlib import Path

api = MyceliumAPI(
    graph_path=Path("state/graph.json"),
    dict_path=Path("state/dictionary.json")
)

# Query
result = api.query("who invented the lightbulb?")
print(result["answer"])

# Add a fact
api.add_fact("albert einstein discovered relativity")

# Get statistics
stats = api.get_stats()
print(f"Graph has {stats['nodes']} nodes")
```

### 2. **Graph Visualization** (`mycelium/visualize.py`)
Tools for visualizing and analyzing graph structure.

**Features:**
- `graph_to_dot()` - Export as Graphviz DOT for rendering
- `graph_summary()` - Text-based structure analysis
- `ascii_graph()` - Simple ASCII bar chart visualization

**Usage Example:**
```python
from mycelium.visualize import graph_summary, ascii_graph
from mycelium.graph import Graph

g = Graph(Path("state/graph.json"))
g.load()

print(graph_summary(g))
print(ascii_graph(g))
```

## Planned Experiments

### 3. **Parallel Walk** (Planned)
Multi-threaded graph traversal for faster queries on large graphs.

### 4. **Semantic Clustering** (Planned)
Automatic grouping of related concepts using similarity metrics.

### 5. **Persistent Learning** (Planned)
Long-term memory consolidation with decay and reinforcement.

## Testing

Each experiment includes basic tests. To test:

```bash
# Test API
python3 -c "
from mycelium.api import MyceliumAPI
from pathlib import Path
api = MyceliumAPI(Path('state/graph.json'), Path('state/dictionary.json'))
print(api.get_stats())
"

# Test Visualization
python3 -c "
from mycelium.visualize import ascii_graph
from mycelium.graph import Graph
g = Graph(Path('state/graph.json'))
g.load()
print(ascii_graph(g))
"
```

## Integration Status

- ✓ API module loads without errors
- ✓ Visualization module loads without errors
- ⏳ Full integration testing needed
- ⏳ Performance benchmarking needed
- ⏳ Documentation needed

## Roadmap

| Experiment | Status | Priority | Est. Completion |
|-----------|--------|----------|-----------------|
| REST API | Active | High | ✓ Done |
| Visualization | Active | High | ✓ Done |
| Parallel Walk | Planned | Medium | TBD |
| Semantic Clustering | Planned | Medium | TBD |
| Persistent Learning | Planned | High | TBD |

## Contributing

To add new experiments:
1. Create a new module in `mycelium/`
2. Add an entry to `experiments.json`
3. Document in this file
4. Test thoroughly before merging to main

## Notes

- Experiments may have breaking changes
- APIs are unstable and subject to change
- Use main branch (`claude/new-session-bicoqu`) for stable features
