# Mycelium v1 Quick Start

## Installation (One-time setup)

```bash
cd /home/user/Class/mycelium
pip install --break-system-packages .
```

## Run the Interactive CLI

### Option 1: Command-line shortcut
```bash
mycelium
```

### Option 2: Python module
```bash
python3 -m mycelium
cd /home/user/Class/mycelium && python3 -m mycelium
```

### Option 3: Direct script (from repo root)
```bash
python3 mycelium/mycelium_v0.py
```

## First Run

On the first run, Mycelium will:
1. Create the `state/` directory
2. Load 9000+ common words from `common_words.txt`
3. Train a knowledge graph from `train_seed.txt`
4. Display: `37 nodes, 9884 tiles` (or similar)

## Try These Commands

```
> ask is a dog loved?
> ask who invented alternating current?
> add my favorite color is blue
> yes
> words
> show
> quit
```

## Example Interaction

```
Mycelium v1 — walk-the-graph memory
37 nodes, 9884 tiles
ask <text>          walk; search on miss
...

> ask is a dog loved?
yes (0.8)
> yes
trained: "a dog is loved"

> ask what is loved?
dog (0.7), cat (0.6), the (0.4)
> yes
trained: "what is loved dog"
```

## Key Concepts

- **Nodes**: Concepts and entities in the knowledge graph
- **Edges**: Learned relationships between nodes
- **Tiles**: Words in the active dictionary
- **Walk**: Following edges through the graph to answer questions
- **Train**: Learning from user confirmations (yes/no)

## Files

| File | Purpose |
|------|---------|
| `common_words.txt` | Word database (loads automatically) |
| `train_seed.txt` | Initial training data |
| `state/graph.json` | Learned knowledge graph (created at runtime) |
| `state/dictionary.json` | Word mappings (created at runtime) |

## Reset Everything

To start fresh with a blank graph:
```bash
rm -rf /home/user/Class/mycelium/state/
```

Next run will retrain from `train_seed.txt`.

## Troubleshooting

**Issue:** "No module named mycelium" when running `python3 -m mycelium`
- **Fix:** Install the package: `pip install --break-system-packages .`

**Issue:** Graph is empty or not training
- **Fix:** Make sure `train_seed.txt` exists in the mycelium root directory

**Issue:** Words not loading
- **Fix:** Verify `common_words.txt` is in the mycelium root directory

See `SETUP.md` for more detailed documentation.
