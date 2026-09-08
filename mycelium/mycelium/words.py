from __future__ import annotations

import json
from pathlib import Path

from .tokenize import tokenize

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


class WordList:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.words: dict[str, str] = {}

    def load(self) -> None:
        if self.path.exists():
            self.words = json.loads(self.path.read_text())
        else:
            self.words = dict(FUNCTION)
            self.save()

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self.words, indent=2, sort_keys=True))

    def add(self, word: str, pos: str = "noun") -> str:
        toks = tokenize(word)
        if not toks:
            raise ValueError("empty word")
        self.words[toks[0]] = pos.lower()
        return toks[0]

    def unknown(self, text: str) -> list[str]:
        return [t for t in tokenize(text) if t not in self.words]

    def import_file(self, path: Path | None) -> int:
        if path is None or not path.exists():
            return 0
        added = 0
        for line in path.read_text(errors="ignore").splitlines():
            toks = tokenize(line)
            if not toks:
                continue
            token = toks[0]
            if token in self.words:
                continue
            if not token.isalpha() or len(token) > 24:
                continue
            self.words[token] = guess_pos(token)
            added += 1
        if added:
            self.save()
        return added
