from __future__ import annotations

from pathlib import Path

from .graph import Graph
from .search import wiki_search
from .words import WordList

ROOT = Path(__file__).resolve().parent.parent
STATE = ROOT / "state"
GRAPH_PATH = STATE / "graph.json"
DICT_PATH = STATE / "dictionary.json"
WORDS_PATH = ROOT / "common_words.txt"
SEED_PATH = ROOT / "train_seed.txt"


def boot() -> tuple[Graph, WordList]:
    STATE.mkdir(parents=True, exist_ok=True)
    words = WordList(DICT_PATH)
    words.load()
    if len(words.words) < 200:
        n = words.import_file(WORDS_PATH)
        if n:
            print(f"loaded {n} tiles from common_words.txt")
    g = Graph(GRAPH_PATH)
    if not g.load():
        if SEED_PATH.exists():
            n = g.train_file(SEED_PATH)
            g.save()
            print(f"new graph from {n} seed lines")
        else:
            g.save()
            print("empty graph")
    else:
        print(f"{len(g.nodes)} nodes, {len(words.words)} tiles")
    return g, words


HELP = """ask <text>          walk; search on miss
yes / no            keep candidates or train last walk
add <text>          confirmed fact
link a | b          edge
word add w pos
word load [file]
train [file]
show / words / save / quit"""


def loop() -> None:
    g, words = boot()
    print(HELP)
    while True:
        try:
            line = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            g.save()
            words.save()
            break
        if not line:
            continue
        cmd, _, rest = line.partition(" ")
        cmd = cmd.lower()
        try:
            if cmd in {"quit", "exit", "q"}:
                g.save()
                words.save()
                break
            if cmd == "help":
                print(HELP)
                continue
            if cmd == "train":
                path = Path(rest) if rest else SEED_PATH
                print(f"trained {g.train_file(path)} lines, {len(g.nodes)} nodes")
                g.save()
                continue
            if cmd == "yes":
                if g.candidates:
                    print("kept:", ", ".join(g.keep_candidates()) or "(none)")
                    g.save()
                else:
                    g.reinforce(True)
                    print("thickened")
                continue
            if cmd == "no":
                if g.candidates:
                    g.drop_candidates()
                    print("dropped")
                else:
                    g.reinforce(False)
                    print("nicked")
                continue
            if cmd == "add":
                print("node:", g.add_node(rest))
                continue
            if cmd == "word":
                parts = rest.split()
                if parts and parts[0].lower() == "load":
                    path = Path(parts[1]) if len(parts) > 1 else WORDS_PATH
                    print("imported", words.import_file(path), "now", len(words.words))
                elif len(parts) >= 2 and parts[0].lower() == "add":
                    pos = parts[2] if len(parts) > 2 else "noun"
                    print("word:", words.add(parts[1], pos), pos)
                    words.save()
                else:
                    print("word add tesla noun  |  word load")
                continue
            if cmd == "words":
                print(len(words.words), "tiles")
                continue
            if cmd == "link":
                if "|" not in rest:
                    print("link small | dog")
                    continue
                a, b = rest.split("|", 1)
                g.link(a.strip(), b.strip())
                print("linked")
                continue
            if cmd == "show":
                import json
                print(json.dumps(g.to_dict(), indent=2)[:4000])
                continue
            if cmd == "save":
                g.save()
                words.save()
                print("saved", GRAPH_PATH)
                continue
            q = rest if cmd == "ask" else line
            unk = words.unknown(q)
            if unk:
                print("unknown tiles:", ", ".join(unk[:12]))
            trail = g.walk(q)
            spoken = g.speak(trail)
            if spoken:
                print(spoken)
                continue
            print("miss — searching")
            try:
                g.candidates = wiki_search(q)
            except Exception as e:
                print("search failed:", e)
                g.candidates = []
                continue
            if not g.candidates:
                print("search empty")
                continue
            for i, c in enumerate(g.candidates, 1):
                print(f"  {i}. {c['text']}")
            print("yes = keep as facts, no = drop")
        except ValueError as e:
            print("error:", e)


def main() -> None:
    loop()
