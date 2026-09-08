from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

from .tokenize import tokenize
from .words import FUNCTION


class Graph:
    def __init__(self, path: Path) -> None:
        self.path = path
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
        hits.sort(key=lambda n: self.nodes[n].get("energy", 0), reverse=True)
        return hits

    def walk(self, text: str, hops: int = 6) -> list[str]:
        self.last_query = text
        seeds = self.match(text)
        if not seeds:
            self.last_walk = []
            return []

        visited: list[str] = []
        seen: set[str] = set()
        frontier = list(seeds[:6])

        while frontier and len(visited) < hops + 4:
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
                if nxt in seen or w <= 0.15:
                    continue
                if self.nodes.get(nxt, {}).get("kind") == "candidate":
                    continue
                frontier.append(nxt)
                break

        self.last_walk = visited
        return visited

    def speak(self, trail: list[str]) -> str:
        if not trail:
            return ""
        facts = [
            self.nodes[n]["text"]
            for n in trail
            if self.nodes[n].get("kind") == "fact" and " " in self.nodes[n]["text"]
        ]
        if facts:
            seen: set[str] = set()
            out = []
            for f in facts:
                if f not in seen:
                    seen.add(f)
                    out.append(f)
            return " ".join(out[:4])
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
                self.link(seed, nid, 0.6)
            kept.append(nid)
        self.candidates = []
        return kept

    def drop_candidates(self) -> None:
        self.candidates = []

    def train_line(self, line: str) -> None:
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

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self.to_dict(), indent=2))

    def load(self) -> bool:
        if not self.path.exists():
            return False
        self.from_dict(json.loads(self.path.read_text()))
        return True
