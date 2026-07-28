#!/usr/bin/env python3
"""
One-time migration: converts existing Tier 3 content files from the old
ad-hoc regex-parsed markdown convention to YAML-frontmatter-per-entry.

Old format (notes):
  ## Note ID: 69
  ### **SECTION 1.0 - INTRODUCTION**
  body text...
  ---

New format (notes):
  ---
  id: 69
  section: "SECTION 1.0 - INTRODUCTION"
  objective: null
  ---
  body text...

Old format (flashcards):
  ## Flashcard ID: 186
  ### Question: What is...?
  answer text...
  ---

New format (flashcards):
  ---
  id: 186
  ---
  ### Question
  What is...?

  ### Answer
  answer text...

Old format (questions):
  ## Question ID: 1
  ### Question: What is...?
  **Options:**
  - a) ...
  **Correct:** b
  **Explanation:** ...
  ---

New format (questions):
  ---
  id: 1
  correct: b
  options:
    a: "..."
    b: "..."
    c: "..."
    d: "..."
  ---
  ### Question
  What is...?

  ### Explanation
  ...

Run once from repo root: python3 scripts/migrate_to_yaml.py
Idempotent-ish: skips a file if it already starts with '---' (already migrated).
"""

import re
import sys
from pathlib import Path
import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
TIER3 = REPO_ROOT / "Tier 3: Pathways"


def already_migrated(text):
    return text.lstrip().startswith("---")


def yaml_dump_frontmatter(data):
    return yaml.safe_dump(data, default_flow_style=False, sort_keys=False, allow_unicode=True).strip()


# ---- Notes ------------------------------------------------------------

NOTE_PATTERN = re.compile(r'^##\s+(?:Note\s+)?ID:\s*(\d+(?:\.\d+)?)', re.MULTILINE | re.IGNORECASE)


def migrate_notes_file(path):
    text = path.read_text(encoding="utf-8")
    if already_migrated(text):
        return False
    title_line = text.split("\n", 1)[0]
    blocks = NOTE_PATTERN.split(text)
    out = [title_line, ""]
    for i in range(1, len(blocks), 2):
        nid = blocks[i].strip()
        content = blocks[i + 1] if i + 1 < len(blocks) else ""
        heading_match = re.match(r'^\s*###\s+(.+?)\n', content)
        section = heading_match.group(1).strip().strip('*').strip() if heading_match else None
        body = re.sub(r'^\s*###\s+.+?\n', '', content, count=1)
        body = re.split(r'\n---\s*\n?$', body)[0].strip()
        objective_match = re.search(r'\*\*(OBJECTIVE\s+\d+):\s*(.+?)\*\*', body)
        objective = objective_match.group(2).strip() if objective_match else None

        frontmatter = {"id": int(nid) if float(nid) == int(nid) else float(nid),
                        "section": section, "objective": objective}
        out.append("---")
        out.append(yaml_dump_frontmatter(frontmatter))
        out.append("---")
        out.append(body)
        out.append("")
    path.write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")
    return True


# ---- Flashcards ---------------------------------------------------------

CARD_PATTERN = re.compile(r'^##\s+(?:Flashcard\s+)?ID:\s*(\d+)', re.MULTILINE | re.IGNORECASE)


def migrate_flashcards_file(path):
    text = path.read_text(encoding="utf-8")
    if already_migrated(text):
        return False
    title_line = text.split("\n", 1)[0]
    blocks = CARD_PATTERN.split(text)
    out = [title_line, ""]
    for i in range(1, len(blocks), 2):
        cid = blocks[i].strip()
        content = blocks[i + 1] if i + 1 < len(blocks) else ""
        fm = re.search(r'^\s*###\s+Question:\s*(.+?)(?:\n|$)', content, re.MULTILINE)
        front = fm.group(1).strip() if fm else ""
        # BUGFIX vs. old loader.js: the old app took everything after the
        # first newline (which was still ON the "### Question:" line), so
        # the rendered "back" of every card included a duplicated
        # "### Question: ...\n\n...\n\n---" instead of just the answer.
        # Strip from the END of the matched Question line instead.
        back = content[fm.end():] if fm else content
        back = re.split(r'^##\s+', back, flags=re.MULTILINE)[0]
        back = re.split(r'\n---\s*\n?$', back)[0].strip()
        back = back.rstrip()
        if back.endswith("---"):
            back = back[:-3].rstrip()

        out.append("---")
        out.append(yaml_dump_frontmatter({"id": int(cid)}))
        out.append("---")
        out.append("### Question")
        out.append(front)
        out.append("")
        out.append("### Answer")
        out.append(back)
        out.append("")
    path.write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")
    return True


# ---- Questions -----------------------------------------------------------

Q_PATTERN = re.compile(r'^##\s+(?:Question\s+)?ID:\s*(\d+)', re.MULTILINE | re.IGNORECASE)


def migrate_questions_file(path):
    text = path.read_text(encoding="utf-8")
    if already_migrated(text):
        return False
    title_line = text.split("\n", 1)[0]
    blocks = Q_PATTERN.split(text)
    out = [title_line, ""]
    for i in range(1, len(blocks), 2):
        qid = blocks[i].strip()
        content = blocks[i + 1] if i + 1 < len(blocks) else ""
        qm = re.search(r'^\s*###\s+Question:\s*(.+?)(?:\n|$)', content, re.MULTILINE)
        qtext = qm.group(1).strip() if qm else ""
        opt_matches = re.findall(r'^-\s+([a-d])\)\s+(.+?)$', content, re.MULTILINE)
        options = {letter: text_.strip() for letter, text_ in opt_matches}
        correct_matches = re.findall(r'\*\*Correct:\*\*\s+([a-d])', content)
        correct = correct_matches[0] if correct_matches else None
        expl_match = re.search(r'\*\*Explanation:\*\*\s+(.+?)(?=\n\n---|\s*$)', content, re.DOTALL)
        explanation = expl_match.group(1).strip() if expl_match else ""

        frontmatter = {"id": int(qid), "correct": correct, "options": options}
        out.append("---")
        out.append(yaml_dump_frontmatter(frontmatter))
        out.append("---")
        out.append("### Question")
        out.append(qtext)
        out.append("")
        out.append("### Explanation")
        out.append(explanation)
        out.append("")
    path.write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")
    return True


def main():
    converted = {"notes": 0, "flashcards": 0, "questions": 0, "skipped": 0}
    for folder in sorted(TIER3.iterdir()):
        if not folder.is_dir():
            continue
        for path in sorted(folder.glob("*.md")):
            name = path.name.lower()
            try:
                if name.endswith("_notes.md"):
                    changed = migrate_notes_file(path)
                    converted["notes"] += 1 if changed else 0
                elif name.endswith("_flashcards.md"):
                    changed = migrate_flashcards_file(path)
                    converted["flashcards"] += 1 if changed else 0
                elif name.endswith("_questions.md"):
                    changed = migrate_questions_file(path)
                    converted["questions"] += 1 if changed else 0
                else:
                    continue
                if not changed:
                    converted["skipped"] += 1
            except Exception as e:
                print(f"FAILED converting {path}: {e}", file=sys.stderr)
                raise
    print(f"Migration complete: {converted}")


if __name__ == "__main__":
    main()
