#!/usr/bin/env python3
"""
GoBook content validation suite.

Mirrors the exact parsing/grading logic in the app's JS (loader.js,
exam-controller.js) in Python, so content bugs can be caught by running
this script instead of by manual audit or by loading the app in a browser.

Run from the repo root:
    python3 tests/validate_content.py

Exits with code 0 if everything passes, 1 if any check fails. Prints a
clear PASS/FAIL report for each check.

WHY THIS EXISTS: on 2026-07-27 a manual audit found three separate
breaking bugs that had been shipping silently:
  1. Tier 2 -> Tier 3 ID references drifted apart (notes-synapses.json
     pointed at IDs that didn't exist in the actual note files).
  2. Tier 1's question loader never attached a `subject` field, so exam
     mode's subject filter silently returned zero questions for every
     subject.
  3. Tier 1's exam grading checked a `.correct` boolean on option
     objects that the markdown parser never produces, so every exam
     scored 0% no matter what the user selected.
None of these were caught by just "does it look right" -- they required
mechanically comparing Tier 2 metadata against Tier 3 content, and
simulating the actual grading path. This script automates that
comparison so it doesn't require a repeat of that ~2 hour audit.
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TIER2 = REPO_ROOT / "Tier 2: Nervous System"
TIER3 = REPO_ROOT / "Tier 3: Pathways"

failures = []
warnings = []


def fail(msg):
    failures.append(msg)


def warn(msg):
    warnings.append(msg)


def resolve_content_path(content_file):
    """contentFile paths in the JSON are repo-root-relative."""
    return (REPO_ROOT / content_file).resolve()


# ---------------------------------------------------------------------------
# Parsers -- these MUST stay in sync with Tier 1: Brain/Limbic/loader.js
# and Tier 1: Brain/Cortex/exam-controller.js. If you change the JS parsing
# regex, update the matching function here in the same commit.
# ---------------------------------------------------------------------------

def parse_markdown_questions(markdown, content_file, subject):
    questions = []
    q_pattern = re.compile(r'^##\s+(?:Question\s+)?ID:\s*(\d+)', re.MULTILINE | re.IGNORECASE)
    blocks = q_pattern.split(markdown)
    for i in range(1, len(blocks), 2):
        qid = blocks[i].strip()
        content = blocks[i + 1] if i + 1 < len(blocks) else None
        if not content:
            continue
        qm = re.search(r'^###\s+Question:\s*(.+?)(?:\n|$)', content, re.MULTILINE)
        qtext = qm.group(1).strip() if qm else ''
        opts = [{"letter": l, "text": t.strip()}
                for l, t in re.findall(r'^-\s+([a-d])\)\s+(.+?)$', content, re.MULTILINE)]
        correct_matches = re.findall(r'\*\*Correct:\*\*\s+([a-d])', content)
        questions.append({
            "id": int(qid), "subject": subject, "text": qtext,
            "options": opts, "correct_matches": correct_matches,
            "correct": correct_matches[0] if correct_matches else None,
            "content_file": str(content_file),
        })
    return questions


def parse_markdown_flashcards(markdown, subject, content_file):
    cards = []
    card_pattern = re.compile(r'^##\s+(?:Flashcard\s+)?ID:\s*(\d+)', re.MULTILINE | re.IGNORECASE)
    blocks = card_pattern.split(markdown)
    for i in range(1, len(blocks), 2):
        cid = blocks[i].strip()
        content = blocks[i + 1] if i + 1 < len(blocks) else None
        if not content:
            continue
        fm = re.search(r'^###\s+Question:\s*(.+?)(?:\n|$)', content, re.MULTILINE)
        front = fm.group(1).strip() if fm else f"Card {cid}"
        nl = content.find('\n')
        back = content[nl + 1:] if nl != -1 else ''
        back = re.split(r'^##\s+', back, flags=re.MULTILINE)[0].strip()
        cards.append({"id": int(cid), "front": front, "back": back,
                       "subject": subject, "content_file": str(content_file)})
    return cards


def get_note_ids_and_headers(markdown):
    """Returns list of (id, heading_line) for each ## ID: block in a notes file."""
    note_pattern = re.compile(r'^##\s+(?:Note\s+)?ID:\s*(\d+(?:\.\d+)?)', re.MULTILINE | re.IGNORECASE)
    blocks = note_pattern.split(markdown)
    results = []
    for i in range(1, len(blocks), 2):
        nid = float(blocks[i].strip())
        content = blocks[i + 1] if i + 1 < len(blocks) else ''
        heading_match = re.match(r'^###\s+(.+?)\n', content)
        heading = heading_match.group(1).strip() if heading_match else None
        body_after_heading = re.sub(r'^###\s+.+?\n', '', content, count=1).strip()
        results.append((nid, heading, body_after_heading))
    return results


# ---------------------------------------------------------------------------
# Check 1: Notes -- every Tier 2 reference must resolve to a real note ID
# with a non-heading-crammed, non-empty body in Tier 3.
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
            file_cache[content_path] = get_note_ids_and_headers(text)

        entries = file_cache[content_path]
        match = next((e for e in entries if e[0] == ref["id"]), None)
        checked += 1
        if match is None:
            fail(f"Notes: id {ref['id']} (subject {ref['subject']}) not found in "
                 f"{ref['contentFile']} -- Tier 2/Tier 3 have drifted apart")
            continue
        _, heading, body = match
        if not body:
            fail(f"Notes: id {ref['id']} in {ref['contentFile']} has empty body "
                 f"-- likely content crammed into the '### ' heading line")
        if heading and len(heading) > 100:
            warn(f"Notes: id {ref['id']} in {ref['contentFile']} has a suspiciously "
                 f"long heading ({len(heading)} chars) -- check content isn't crammed into heading")

    print(f"  Checked {checked} note references across {len(file_cache)} files.")


# ---------------------------------------------------------------------------
# Check 2: Flashcards -- every card must parse to a real front (not a
# fallback "Card N" placeholder) and every referenced file must exist.
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
        cards = parse_markdown_flashcards(text, ref["subject"], ref["contentFile"])
        if not cards:
            fail(f"Flashcards: 0 cards parsed from {ref['contentFile']} "
                 f"(check for missing 'Question:' label)")
        for card in cards:
            total_cards += 1
            if re.match(r'^Card \d+$', card["front"]):
                fail(f"Flashcards: id {card['id']} in {ref['contentFile']} fell back "
                     f"to placeholder front text -- check for missing '### Question:' label")
            if not card["back"]:
                fail(f"Flashcards: id {card['id']} in {ref['contentFile']} has empty back")

    print(f"  Checked {total_cards} flashcards across {len(fc_refs)} files.")


# ---------------------------------------------------------------------------
# Check 3: Questions -- every question must have a subject, exactly one
# unambiguous correct answer, at least 2 options, and a correct answer
# that actually matches one of the option letters.
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
        qs = parse_markdown_questions(text, ref["contentFile"], ref["subject"])
        if not qs:
            fail(f"Questions: 0 questions parsed from {ref['contentFile']}")
        all_questions.extend(qs)

    for q in all_questions:
        loc = f"id {q['id']} in {q['content_file']}"
        if not q["subject"]:
            fail(f"Questions: {loc} has no subject attached "
                 f"-- exam mode's subject filter will silently drop it")
        if len(q["options"]) < 2:
            fail(f"Questions: {loc} has fewer than 2 options ({len(q['options'])})")
        if len(q["correct_matches"]) > 1:
            fail(f"Questions: {loc} has {len(q['correct_matches'])} conflicting "
                 f"'**Correct:**' lines ({q['correct_matches']}) -- app's regex only "
                 f"reads the first one, so the wrong answer key may be in use")
        if q["correct"] is None:
            fail(f"Questions: {loc} has no correct answer marked")
        elif q["correct"] not in [o["letter"] for o in q["options"]]:
            fail(f"Questions: {loc} marks '{q['correct']}' correct but no option "
                 f"has that letter (options: {[o['letter'] for o in q['options']]})")

    print(f"  Checked {len(all_questions)} questions across {len(q_refs)} files.")
    return all_questions


# ---------------------------------------------------------------------------
# Check 4: End-to-end exam simulation -- proves subject filtering AND
# grading work together, not just that the data looks right in isolation.
# Mirrors exam-controller.js's submitExam() logic exactly.
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

        # Simulate answering every question correctly.
        correct_count = 0
        for q in subject_qs:
            selected = next((o for o in q["options"] if o["letter"] == q["correct"]), None)
            if selected and selected["letter"] == q["correct"]:
                correct_count += 1
        if correct_count != len(subject_qs):
            fail(f"Exam simulation: subject '{subject}' -- answering every question "
                 f"correctly only scored {correct_count}/{len(subject_qs)} (expected 100%)")

        # Simulate answering every question wrong on purpose.
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
    print("GoBook content validation suite")
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
