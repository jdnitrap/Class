# Content Ingestion Spec

Purpose: when a new lecture or exam-question source document is uploaded, an AI
assistant should be able to convert it into properly placed, correctly formatted
Tier 3 content with **no manual instructions from the user** beyond "here's the
document." This file is the source of truth for how that happens — don't rely
on chat memory across sessions.

## Step 1 — Identify the subject

- Match the lecture's topic/course number against existing subject codes in
  `Tier 2: Nervous System/notes-synapses.json` (currently: CP01, CP04, CP06,
  TH01, TH02, TH03, TH04, TH05, TH06B, TH07B).
- If it clearly extends an existing subject, use that code.
- If it's a new topic, pick the next unused number under the matching prefix
  (CP = plant components/systems, TH = thermodynamics), name the folder
  `{CODE}_{Topic_Name}` (underscores, no spaces, title case), e.g. `CP07_Valves`.
- Do not ask the user to name or number it — infer from content and existing
  patterns.

## Step 2 — Folder and file naming

```
Tier 3: Pathways/{CODE}_{Topic_Name}/
  {CODE}_{Topic_Name}_notes.md
  {CODE}_{Topic_Name}_flashcards.md
  {CODE}_{Topic_Name}_questions.md
```

## Step 3 — Extract structure from the source doc

- Identify each Enabling Objective (EO) and any sub-objectives.
- Every EO becomes at least one notes block, at least one flashcard, and at
  least one exam question. Multi-part EOs may become several of each.

## Step 4 — Generate notes.md

```
# {CODE}_{Topic_Name} - Comprehensive Study Notes

## Note ID: {next global ID}
### **SECTION HEADER**

**OBJECTIVE N: <verbatim or lightly cleaned EO text>**
<Plain-prose explanation covering the objective. No content on the heading line.>

---
```
- Note IDs are **globally sequential** across the whole app — check the max
  `id` in `notes-synapses.json` and continue from there. (Current max: 143.)
- Never put body content on the `###` heading line itself — that's the #1
  historical cause of empty notes.

## Step 5 — Generate flashcards.md

```
# {CODE}_{Topic_Name} - Quick Reference Flashcards

## Flashcard ID: {next global ID}
### Question: <question derived from the EO>

<Short, plain-text answer. One or two sentences, no headers, no bullets.>

---
```
- Flashcard IDs are also globally sequential — take the last block's
  `id + count` from `flashcards-synapses.json`. (Next available: 233.)
- Exactly one `### Question:` label per card. Never use `FRONT:`/`BACK:` or any
  other label — the parser only recognizes `### Question:`.

## Step 6 — Generate questions.md

```
# {CODE}_{Topic_Name} - Exam Questions

## Question ID: {n}
### Question: <question derived from the EO>

**Options:**
- a) <option>
- b) <option>
- c) <option>
- d) <option>

**Correct:** <single letter>
**Explanation:** <why that answer is correct>

---
```
- Question IDs restart at 1 within each file (subject is supplied externally
  via `questions-synapses.json`, not embedded per-question).
- Exactly **one** `**Correct:**` line per question. A duplicate line is the
  #2 historical cause of silently-wrong answer keys.

## Step 7 — Register in Tier 2 metadata

- `notes-synapses.json`: append one entry per note block —
  `{id, subject, title, contentFile}` (add `image`/`imageLabel` only if a
  diagram is actually supplied).
- `flashcards-synapses.json`: append one entry for the whole new file —
  `{id: <first ID in file>, subject, contentFile, count: <number of cards>}`.
- `questions-synapses.json`: append one entry — `{subject, contentFile}`.

## Step 8 — Validate before committing

Run `python3 tests/validate_content.py` from repo root. It must exit 0.
Do not commit or push if it reports any errors — fix the content instead.

## Step 9 — Commit and push

Commit message convention: `Add content: {CODE} {Topic Name}`.

---

**The point of this file:** none of the above should require the user to
specify a folder name, file name, ID number, or format. Uploading the source
document is the only input needed; this spec is what the assistant follows to
do the rest correctly and consistently, upload after upload.
