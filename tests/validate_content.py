#!/usr/bin/env python3
"""
GoBook content validation suite (v2 -- YAML frontmatter format).

Mirrors scripts/build-content.js exactly, in Python, so content problems can
be caught by running this script (fast, no Node needed) instead of only by
the build script or a manual audit. If you change build-content.js's parsing
or validation rules, update the matching logic here in the same commit.

Run from the repo root:
    python3 tests/validate_content.py

Exits with code 0 if everything passes, 1 if any check fails.

HISTORY:
- 2026-07-27: original ad-hoc-markdown-format version of this script found
  three shipping bugs (Tier2/3 ID drift, missing subject field, wrong
  correct-answer grading logic) and was later extended to catch a fourth
  (duplicate **Correct:** lines) and a fifth (flashcard "back" text
  including a duplicated "### Question:" line -- found and fixed during the
  YAML-frontmatter migration below).
- Same day, later: content format migrated from ad-hoc regex-parsed
  markdown to YAML-frontmatter-per-entry (Option 3 of the improvement
  backlog), paired with a build-time compiler (Option 2) that now produces
  dist/content-bundle.json. This script was rewritten to match.
"""

import json
import re
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
TIER2 = REPO_ROOT / "Tier 2: Nervous System"

failures = []
warnings = []


def fail(msg):
    failures.append(msg)


def warn(msg):
    warnings.append(msg)


def resolve_content_path(content_file):
    return (REPO_ROOT / content_file).resolve()


# ---------------------------------------------------------------------------
# Parser -- MUST stay in sync with scripts/build-content.js's parseEntries().
# ---------------------------------------------------------------------------

def parse_entries(text, file_label):
    lines = text.split("\n")
    entries = []
    i = 0
    while i < len(lines) and lines[i].strip() != "---":
        i += 1

    while i < len(lines):
        if lines[i].strip() != "---":
            i += 1
            continue
        yaml_start = i + 1
        j = yaml_start
        while j < len(lines) and lines[j].strip() != "---":
            j += 1
        if j >= len(lines):
            fail(f"{file_label}: unterminated YAML frontmatter fence starting at line {i + 1}")
            break
        yaml_text = "\n".join(lines[yaml_start:j])
        try:
            frontmatter = yaml.safe_load(yaml_text) or {}
        except yaml.YAMLError as e:
            fail(f"{file_label}: invalid YAML in frontmatter at line {yaml_start + 1}: {e}")
            i = j + 1
            continue
        body_start = j + 1
        body_end = body_start
        while body_end < len(lines) and lines[body_end].strip() != "---":
            body_end += 1
        body = "\n".join(lines[body_start:body_end]).strip()
        entries.append({"frontmatter": frontmatter, "body": body})
        i = body_end
    return entries


def extract_section(body, heading):
    m = re.search(rf'^###\s+{heading}\s*\n(.*?)(?=\n###\s+|\Z)', body, re.MULTILINE | re.DOTALL)
    return m.group(1).strip() if m else None


# ---------------------------------------------------------------------------
# Check 1: Notes
# ---------------------------------------------------------------------------

def check_notes():
    print("\n[1/4] Checking notes (Tier 2 <-> Tier 3 consistency)...")
    with open(TIER2 / "notes-synapses.json", encoding="utf-8") as f:
        notes_refs = json.load(f)["notes"]

    file_cache = {}
    checked = 0
    for ref in notes_refs:
        content_path = resolve_content_path(ref["contentFile"])
        if content_path not in file_cache:
            if not content_path.exists():
                fail(f"Notes: contentFile does not exist: {ref['contentFile']}")
                file_cache[content_path] = []
                continue
            text = content_path.read_text(encoding="utf-8")
            file_cache[content_path] = parse_entries(text, ref["contentFile"])

        entries = file_cache[content_path]
        match = next((e for e in entries if e["frontmatter"].get("id") == ref["id"]), None)
        checked += 1
        if match is None:
            fail(f"Notes: id {ref['id']} (subject {ref['subject']}) not found in "
                 f"{ref['contentFile']} -- Tier 2/Tier 3 have drifted apart")
            continue
        if not match["body"]:
            fail(f"Notes: id {ref['id']} in {ref['contentFile']} has an empty body")

    print(f"  Checked {checked} note references across {len(file_cache)} files.")


# ---------------------------------------------------------------------------
# Check 2: Flashcards
# ---------------------------------------------------------------------------

def check_flashcards():
    print("\n[2/4] Checking flashcards...")
    with open(TIER2 / "flashcards-synapses.json", encoding="utf-8") as f:
        fc_refs = json.load(f)["flashcards"]

    total_cards = 0
    for ref in fc_refs:
        content_path = resolve_content_path(ref["contentFile"])
        if not content_path.exists():
            fail(f"Flashcards: contentFile does not exist: {ref['contentFile']}")
            continue
        text = content_path.read_text(encoding="utf-8")
        entries = parse_entries(text, ref["contentFile"])
        if not entries:
            fail(f"Flashcards: 0 cards parsed from {ref['contentFile']}")
        if len(entries) != ref.get("count"):
            fail(f"Flashcards: {ref['contentFile']} has {len(entries)} cards but "
                 f"flashcards-synapses.json declares count {ref.get('count')}")
        for entry in entries:
            total_cards += 1
            cid = entry["frontmatter"].get("id")
            front = extract_section(entry["body"], "Question")
            back = extract_section(entry["body"], "Answer")
            if not front:
                fail(f"Flashcards: id {cid} in {ref['contentFile']} has no '### Question' section")
            if not back:
                fail(f"Flashcards: id {cid} in {ref['contentFile']} has no '### Answer' section (empty back)")
            elif front and back and back.strip().startswith("### Question"):
                fail(f"Flashcards: id {cid} in {ref['contentFile']} -- back text still "
                     f"contains a duplicated Question line")

    print(f"  Checked {total_cards} flashcards across {len(fc_refs)} files.")


# ---------------------------------------------------------------------------
# Check 3: Questions
# ---------------------------------------------------------------------------

def check_questions():
    print("\n[3/4] Checking questions...")
    with open(TIER2 / "questions-synapses.json", encoding="utf-8") as f:
        q_refs = json.load(f)["questions"]

    all_questions = []
    for ref in q_refs:
        content_path = resolve_content_path(ref["contentFile"])
        if not content_path.exists():
            fail(f"Questions: contentFile does not exist: {ref['contentFile']}")
            continue
        text = content_path.read_text(encoding="utf-8")
        entries = parse_entries(text, ref["contentFile"])
        if not entries:
            fail(f"Questions: 0 questions parsed from {ref['contentFile']}")
        for entry in entries:
            fm = entry["frontmatter"]
            loc = f"id {fm.get('id')} in {ref['contentFile']}"
            options = fm.get("options") or {}
            correct = fm.get("correct")
            text_ = extract_section(entry["body"], "Question")

            if not text_:
                fail(f"Questions: {loc} has no '### Question' section")
            if len(options) < 2:
                fail(f"Questions: {loc} has fewer than 2 options ({len(options)})")
            if not correct:
                fail(f"Questions: {loc} has no correct answer marked")
            elif correct not in options:
                fail(f"Questions: {loc} marks '{correct}' correct but no option has "
                     f"that letter (options: {sorted(options.keys())})")

            all_questions.append({
                "id": fm.get("id"), "subject": ref["subject"], "text": text_,
                "options": [{"letter": k, "text": v} for k, v in options.items()],
                "correct": correct, "content_file": ref["contentFile"],
            })

    print(f"  Checked {len(all_questions)} questions across {len(q_refs)} files.")
    return all_questions


# ---------------------------------------------------------------------------
# Check 4: End-to-end exam simulation
# ---------------------------------------------------------------------------

def check_exam_grading(all_questions):
    print("\n[4/4] Simulating full exam grading end-to-end...")
    subjects = sorted(set(q["subject"] for q in all_questions if q["subject"]))
    if not subjects:
        fail("Exam simulation: no subjects found at all -- cannot simulate")
        return

    for subject in subjects:
        subject_qs = [q for q in all_questions if q["subject"] == subject]
        if not subject_qs:
            fail(f"Exam simulation: subject '{subject}' filtered to 0 questions")
            continue

        correct_count = sum(
            1 for q in subject_qs
            if any(o["letter"] == q["correct"] for o in q["options"]) and q["correct"]
        )
        if correct_count != len(subject_qs):
            fail(f"Exam simulation: subject '{subject}' -- answering every question "
                 f"correctly only scored {correct_count}/{len(subject_qs)} (expected 100%)")

        wrong_count = 0
        for q in subject_qs:
            wrong_opt = next((o for o in q["options"] if o["letter"] != q["correct"]), None)
            if wrong_opt and wrong_opt["letter"] == q["correct"]:
                wrong_count += 1
        if wrong_count != 0:
            fail(f"Exam simulation: subject '{subject}' -- answering every question "
                 f"wrong on purpose still scored {wrong_count}/{len(subject_qs)} (expected 0%)")

    print(f"  Simulated full exams for {len(subjects)} subjects "
          f"(100%-correct and 0%-correct cases each).")


def main():
    print("=" * 70)
    print("GoBook content validation suite (YAML frontmatter format)")
    print("=" * 70)

    check_notes()
    check_flashcards()
    all_questions = check_questions()
    check_exam_grading(all_questions)

    print("\n" + "=" * 70)
    if warnings:
        print(f"WARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"  ⚠ {w}")
    if failures:
        print(f"\nFAILED -- {len(failures)} problem(s) found:")
        for f_ in failures:
            print(f"  ✗ {f_}")
        print("=" * 70)
        sys.exit(1)
    else:
        print("PASSED -- all checks green.")
        print("=" * 70)
        sys.exit(0)


if __name__ == "__main__":
    main()
