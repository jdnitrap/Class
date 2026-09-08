#!/usr/bin/env python3
"""Mycelium v0 — word list + walk + search-on-miss.

Commands:
  ask <text>          walk; if no trail, search and park candidates
  yes                 thicken last walk, or keep last search candidates
  no                  nick last walk, or drop candidates
  add <text>          add a confirmed node
  word add <w> <pos>  put one tile in the word list
  word load [file]    bulk-import a word list (default common_words.txt)
  train [file]        wear trails from one sentence per line
  words               show word-list size
  link a | b          edge from a to b
  show                print graph
  save / load
  quit
"""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

GRAPH_PATH = Path("graph.json")
DICT_PATH = Path("dictionary.json")
WORDFILE_PATH = Path("common_words.txt")
HERE = Path(__file__).resolve().parent
UA = "MyceliumV0/0.2 (local research; contact: local-user)"

FUNCTION = {
    "a": "det", "an": "det", "the": "det", "this": "det", "that": "det",
    "is": "verb", "are": "verb", "was": "verb", "were": "verb", "be": "verb",
    "been": "verb", "being": "verb", "have": "verb", "has": "verb", "had": "verb",
    "do": "verb", "does": "verb", "did": "verb",
    "and": "conj", "or": "conj", "but": "conj",
    "of": "prep", "in": "prep", "on": "prep", "to": "prep", "for": "prep",
    "with": "prep", "from": "prep", "at": "prep", "by": "prep",
    "not": "adv", "very": "adv", "also": "adv",
}


def guess_pos(word: str) -> str:
    if word in FUNCTION:
        return FUNCTION[word]
    if word.endswith("ly"):
        return "adv"
    if word.endswith(("ing", "ed", "ize", "ise")):
        return "verb"
    if word.endswith(("ous", "ful", "less", "ish", "ive")):
        return "adj"
    return "noun"

STARTER_WORDS = {
    "a": "det", "an": "det", "the": "det",
    "is": "verb", "are": "verb", "was": "verb", "be": "verb",
    "and": "conj", "or": "conj",
    "of": "prep", "in": "prep", "on": "prep", "to": "prep", "for": "prep",
    "small": "adj", "loved": "adj", "big": "adj", "hot": "adj",
    "dog": "noun", "cat": "noun", "cake": "noun", "recipe": "noun",
    "flour": "noun", "oven": "noun", "story": "noun",
    "ran": "verb", "run": "verb", "bake": "verb", "search": "verb",
}


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


class WordList:
    def __init__(self) -> None:
        self.words: dict[str, str] = {}

    def load(self) -> None:
        if DICT_PATH.exists():
            self.words = json.loads(DICT_PATH.read_text())
        else:
            self.words = dict(STARTER_WORDS)
            self.save()
        if len(self.words) < 200:
            self.import_file(self._find_wordfile())

    def save(self) -> None:
        DICT_PATH.write_text(json.dumps(self.words, indent=2, sort_keys=True))

    def add(self, word: str, pos: str = "noun") -> None:
        w = tokenize(word)
        if not w:
            raise ValueError("empty word")
        self.words[w[0]] = pos.lower()

    def unknown(self, text: str) -> list[str]:
        return [t for t in tokenize(text) if t not in self.words]

    def _find_wordfile(self) -> Path | None:
        for p in (WORDFILE_PATH, HERE / "common_words.txt", Path(__file__).with_name("common_words.txt")):
            if p.exists():
                return p
        return None

    def import_file(self, path: Path | None) -> int:
        if path is None or not path.exists():
            return 0
        added = 0
        for line in path.read_text(errors="ignore").splitlines():
            w = tokenize(line)
            if not w:
                continue
            token = w[0]
            if token in self.words:
                continue
            if not token.isalpha() or len(token) > 24:
                continue
            self.words[token] = guess_pos(token)
            added += 1
        if added:
            self.save()
        return added


class Graph:
    def __init__(self) -> None:
        self.nodes: dict[str, dict] = {}
        self.edges: dict[str, dict[str, float]] = defaultdict(dict)
        self.last_walk: list[str] = []
        self.candidates: list[dict] = []
        self.last_query = ""

    def add_node(self, text: str, kind: str = "fact", energy: float = 1.0) -> str:
        nid = " ".join(tokenize(text))
        if not nid:
            raise ValueError("empty node")
        if nid not in self.nodes:
            self.nodes[nid] = {
                "id": nid,
                "text": text.strip(),
                "energy": energy,
                "kind": kind,
            }
        return nid

    def link(self, src: str, dst: str, strength: float = 1.0) -> None:
        a, b = self.add_node(src), self.add_node(dst)
        if a == b:
            return
        cur = self.edges[a].get(b, 0.0)
        self.edges[a][b] = min(8.0, cur + strength)

    def match(self, text: str) -> list[str]:
        toks = set(tokenize(text))
        hits = []
        for nid, node in self.nodes.items():
            if node.get("kind") == "candidate":
                continue
            ntoks = set(tokenize(node["text"]))
            if toks & ntoks:
                hits.append(nid)
        return hits

    def walk(self, text: str, hops: int = 4) -> list[str]:
        self.last_query = text
        seeds = self.match(text)
        if not seeds:
            self.last_walk = []
            return []

        visited: list[str] = []
        seen: set[str] = set()
        frontier = list(seeds)

        while frontier and len(visited) < hops + len(seeds):
            nid = frontier.pop(0)
            if nid in seen:
                continue
            seen.add(nid)
            visited.append(nid)
            neigh = sorted(
                self.edges.get(nid, {}).items(),
                key=lambda kv: kv[1],
                reverse=True,
            )
            for nxt, w in neigh:
                if nxt not in seen and w > 0.15:
                    if self.nodes.get(nxt, {}).get("kind") == "candidate":
                        continue
                    frontier.append(nxt)
                    break

        self.last_walk = visited
        return visited

    def speak(self, trail: list[str]) -> str:
        if not trail:
            return ""
        return " → ".join(self.nodes[n]["text"] for n in trail)

    def reinforce(self, good: bool) -> None:
        trail = self.last_walk
        if len(trail) < 2:
            return
        delta = 0.35 if good else -0.25
        for a, b in zip(trail, trail[1:]):
            cur = self.edges[a].get(b, 0.4)
            self.edges[a][b] = max(0.05, min(8.0, cur + delta))

    def keep_candidates(self) -> list[str]:
        kept = []
        for c in self.candidates:
            nid = self.add_node(c["text"], kind="fact", energy=0.8)
            for seed in tokenize(self.last_query)[:4]:
                if seed:
                    self.link(seed, nid, 0.6)
            kept.append(nid)
        self.candidates = []
        return kept

    def drop_candidates(self) -> None:
        self.candidates = []

    def train_line(self, line: str) -> None:
        """One confirmed sentence: store it, chain content words, thicken that path."""
        line = line.strip()
        if not line or line.startswith("#"):
            return
        toks = tokenize(line)
        if not toks:
            return
        self.add_node(line, kind="fact", energy=1.2)
        content = [t for t in toks if t not in FUNCTION]
        if len(content) < 2:
            content = toks
        for a, b in zip(content, content[1:]):
            self.link(a, b, 0.45)
        for t in content:
            self.link(t, line, 0.25)
        self.last_walk = content
        self.reinforce(True)

    def train_file(self, path: Path) -> int:
        n = 0
        for raw in path.read_text(errors="ignore").splitlines():
            if raw.strip() and not raw.strip().startswith("#"):
                self.train_line(raw)
                n += 1
        return n

    def to_dict(self) -> dict:
        return {
            "nodes": self.nodes,
            "edges": {s: dict(d) for s, d in self.edges.items()},
        }

    def from_dict(self, data: dict) -> None:
        self.nodes = data.get("nodes", {})
        self.edges = defaultdict(dict)
        for s, d in data.get("edges", {}).items():
            self.edges[s] = {k: float(v) for k, v in d.items()}

    def save(self, path: Path = GRAPH_PATH) -> None:
        path.write_text(json.dumps(self.to_dict(), indent=2))

    def load(self, path: Path = GRAPH_PATH) -> bool:
        if not path.exists():
            return False
        self.from_dict(json.loads(path.read_text()))
        return True


def wiki_search(query: str, limit: int = 3) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "srprop": "snippet",
            "format": "json",
        }
    )
    url = "https://en.wikipedia.org/w/api.php?" + params
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=8) as resp:
        data = json.loads(resp.read().decode())
    hits = data.get("query", {}).get("search", [])
    out = []
    tag = re.compile(r"<[^>]+>")
    for h in hits:
        title = h.get("title", "")
        snip = tag.sub("", h.get("snippet", "")).replace("&quot;", '"')
        snip = re.sub(r"\s+", " ", snip).strip()
        text = f"{title}: {snip}" if snip else title
        out.append({"title": title, "text": text[:240]})
    return out


def seed(g: Graph) -> None:
    if g.nodes:
        return
    for w in ("dog", "small", "loved", "ran", "cake", "recipe", "flour", "oven"):
        g.add_node(w)
    g.link("small", "dog", 1.2)
    g.link("dog", "loved", 1.0)
    g.link("dog", "ran", 0.8)
    g.link("cake", "recipe", 1.2)
    g.link("recipe", "flour", 1.0)
    g.link("flour", "oven", 0.7)


def main() -> None:
    words = WordList()
    words.load()
    g = Graph()
    if not g.load():
        seed(g)
        g.save()
        print("new graph.json + dictionary.json")
    else:
        print(f"loaded {len(g.nodes)} nodes, {len(words.words)} word tiles")

    print("ask / yes / no / add / word add / words / link a | b / save / quit")
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
            elif cmd == "train":
                path = Path(rest) if rest else HERE / "train_seed.txt"
                if not path.exists():
                    path = Path("train_seed.txt")
                if not path.exists():
                    print("no train file:", path)
                    continue
                n = g.train_file(path)
                g.save()
                print(f"trained {n} lines, {len(g.nodes)} nodes")
            elif cmd == "ask" or cmd not in {
                "yes", "no", "add", "word", "words", "link", "show",
                "save", "load", "train",
            }:
                q = rest if cmd == "ask" else line
                unknown = words.unknown(q)
                if unknown:
                    print("unknown tiles:", ", ".join(unknown))
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
                    print(f"  candidate {i}: {c['text']}")
                print("yes = keep as facts, no = drop")
            elif cmd == "yes":
                if g.candidates:
                    kept = g.keep_candidates()
                    print("kept:", ", ".join(kept) if kept else "(none)")
                    g.save()
                else:
                    g.reinforce(True)
                    print("thickened last trail")
                words.save()
            elif cmd == "no":
                if g.candidates:
                    g.drop_candidates()
                    print("dropped candidates")
                else:
                    g.reinforce(False)
                    print("nicked last trail")
            elif cmd == "add":
                unk = words.unknown(rest)
                if unk:
                    print("unknown tiles (not blocked):", ", ".join(unk))
                print("node:", g.add_node(rest))
            elif cmd == "word":
                parts = rest.split()
                if parts and parts[0].lower() == "load":
                    raw = parts[1] if len(parts) > 1 else ""
                    path = Path(raw) if raw else words._find_wordfile()
                    n = words.import_file(path)
                    print(f"imported {n} new tiles, book is {len(words.words)}")
                elif len(parts) >= 2 and parts[0].lower() == "add":
                    pos = parts[2] if len(parts) > 2 else "noun"
                    words.add(parts[1], pos)
                    words.save()
                    print("word:", parts[1], pos)
                else:
                    print("use: word add tesla noun   or   word load")
            elif cmd == "words":
                print(len(words.words), "tiles —", ", ".join(sorted(words.words)[:20]), "...")
            elif cmd == "link":
                if "|" not in rest:
                    print("use: link small | dog")
                    continue
                a, b = rest.split("|", 1)
                g.link(a.strip(), b.strip())
                print("linked")
            elif cmd == "show":
                print(json.dumps(g.to_dict(), indent=2))
            elif cmd == "save":
                g.save()
                words.save()
                print("saved graph.json and dictionary.json")
            elif cmd == "load":
                print("graph", "ok" if g.load() else "missing")
                words.load()
        except ValueError as e:
            print("error:", e)


if __name__ == "__main__":
    main()
