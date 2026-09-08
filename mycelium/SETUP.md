# Mycelium v1 Setup Guide

## Overview
Mycelium v1 is a walk-the-graph memory system that learns semantic relationships and answers questions by traversing a knowledge graph.

**Requirements:** Python 3.9+  
**Dependencies:** None (uses only Python standard library)

## Quick Start

### 1. Install from Source
```bash
cd /home/user/Class/mycelium
pip install -e .
```

### 2. Run the Interactive CLI
```bash
python3 -m mycelium
```

Or directly call:
```bash
mycelium
```

## Project Structure
```
mycelium/
├── mycelium/           # Main package
│   ├── __init__.py     # Package initialization
│   ├── __main__.py     # Entry point
│   ├── cli.py          # Interactive CLI loop
│   ├── graph.py        # Graph data structure and operations
│   ├── tokenize.py     # Text tokenization utilities
│   ├── words.py        # Word list and dictionary management
│   └── search.py       # Wikipedia search fallback
├── state/              # Runtime state (generated)
│   ├── graph.json      # Learned knowledge graph
│   └── dictionary.json # Word dictionary
├── common_words.txt    # Word database (1000+ common words)
├── train_seed.txt      # Initial training data
├── requirements.txt    # Python dependencies
├── setup.py            # Package setup
└── README_mycelium.md  # Original README
```

## Commands

Once running, use these commands:

| Command | Description |
|---------|-------------|
| `ask <text>` | Ask a question; walks graph or searches Wikipedia |
| `yes` / `no` | Confirm/reject the last search result |
| `add <text>` | Add a confirmed fact to the graph |
| `link a \| b` | Create a relationship edge between a and b |
| `word add w pos` | Add a word with position tag |
| `word load [file]` | Load words from file |
| `train [file]` | Train from a file of facts |
| `show` | Display current graph state |
| `words` | Show loaded words |
| `save` | Save state to disk |
| `quit` | Exit (saves automatically) |

## Data Files

### common_words.txt
- Pre-loaded word dictionary with 1000+ common English words
- Automatically loaded on first run
- Format: one word per line

### train_seed.txt
- Initial training data for the graph
- Contains semantic relationship statements
- Example: `tesla invented alternating current`
- Loaded automatically on first run if graph is empty

### state/graph.json
- Persistent knowledge graph (regenerated each run)
- Nodes represent concepts/entities
- Edges represent relationships

### state/dictionary.json
- Word mapping and metadata
- Persisted across sessions

## Development

### Testing the Setup
```bash
# Verify Python version
python3 --version

# Test imports
python3 -c "from mycelium import __version__; print(f'Version: {__version__}')"

# Boot system and check loaded data
python3 -c "from mycelium.cli import boot; g, w = boot()"
```

### Clearing State
To reset the learned graph:
```bash
rm -rf mycelium/state/
```

On next run, the system will retrain from `train_seed.txt`.

## Architecture

**Flow:** question → match nodes → walk strong edges → speak facts  
**Fallback:** no trail → Wikipedia search → candidates → yes/no

1. **Tokenization** (tokenize.py): Break input into words
2. **Word Lookup** (words.py): Match against known words
3. **Graph Walking** (graph.py): Traverse edges based on relevance
4. **Search Fallback** (search.py): Query Wikipedia if no local match
5. **User Confirmation**: `yes`/`no` to train from results

## Notes

- The system starts with an empty graph and trains from `train_seed.txt`
- Word list comes from `common_words.txt` 
- Graph and dictionary are saved to `state/` for persistence
- No external API keys or services required
- All operations are local and offline (except Wikipedia search)

## Troubleshooting

**Issue:** "No module named 'mycelium'"
- Solution: Install with `pip install -e .` from the mycelium directory

**Issue:** Graph appears empty
- Solution: Delete `state/` and restart to retrain from seed data

**Issue:** Words not loading
- Solution: Verify `common_words.txt` exists and is readable
