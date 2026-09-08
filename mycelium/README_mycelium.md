# Mycelium v1

Walk-the-graph memory. Not a transformer.

```bash
cd /path/to/this/folder
python3 -m mycelium
```

On first run it loads `common_words.txt` into the word book and trains `train_seed.txt` into `state/graph.json`.

## Flow
question → match nodes → walk strong edges → speak facts  
no trail → Wikipedia search → candidates → yes/no

## Commands
ask, yes, no, add, link a | b, train, word add, word load, words, show, save, quit
