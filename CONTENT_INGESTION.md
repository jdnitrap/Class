# Content Ingestion Spec

Purpose: when a new lecture or exam-question source document is uploaded, an
AI assistant should be able to convert it into properly placed, correctly
formatted Tier 3 content with **no manual instructions from the user**
beyond "here's the document." This file is the source of truth for how that
happens — don't rely on chat memory across sessions.

> **2026-07-27 update:** content format migrated from ad-hoc regex-parsed
> markdown to YAML-frontmatter-per-entry, paired with a build-time compiler
> (`scripts/build-content.js`) that produces `dist/content-bundle.json`. The
> running app no longer parses markdown at all — a malformed entry now fails
> the build loudly instead of silently degrading in the browser. This
> replaces the previous version of this file, which described the old format.

## Step 1 — Identify the subject

- Match the lecture's topic/course number against existing subject codes in
  `Tier 2: Nervous System/notes-synapses.json` (currently: CP04, CP06,
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
- Every EO becomes at least one notes entry, at least one flashcard, and at
  least one exam question. Multi-part EOs may become several of each.

## Step 4 — File format: YAML frontmatter per entry

Every Tier 3 file is a `# Title` line, then a sequence of entries. Each
entry is fenced by a line of exactly `---`, opening and closing a YAML
block, followed by a markdown body:

```
---
<yaml frontmatter>
---
<markdown body>

---
<yaml frontmatter>
---
<markdown body>
```

### notes.md

```
---
id: 144
section: "SECTION TITLE"
objective: "Verbatim or lightly cleaned EO text, or null if this note has no single objective"
---
Plain-prose explanation covering the objective. This is what gets shown to
the user — nothing else in the entry is displayed directly.
```
- `id` is **globally sequential** across the whole app — check the max `id`
  in `notes-synapses.json` and continue from there.

### flashcards.md

```
---
id: 233
---
### Question
<question derived from the EO>

### Answer
<short, plain-text answer>
```
- `id` is globally sequential — continue from `last_block.id + last_block.count`
  in `flashcards-synapses.json`.
- Exactly one `### Question` and one `### Answer` heading per card. These
  are the only two section headings the build script recognizes for
  flashcards.

### questions.md

```
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
<question derived from the EO>

### Explanation
<why that answer is correct>
```
- `id` restarts at 1 within each file (subject is supplied externally via
  `questions-synapses.json`, not embedded per-question).
- `correct` must be a key that actually exists in `options` — the build
  script fails the build if it doesn't, rather than silently keying to the
  wrong answer.

## Step 5 — Register in Tier 2 metadata

- `notes-synapses.json`: append one entry per note —
  `{id, subject, title, contentFile}` (add `image`/`imageLabel` only if a
  diagram is actually supplied).
- `flashcards-synapses.json`: append one entry for the whole new file —
  `{id: <first ID in file>, subject, contentFile, count: <number of cards>}`.
- `questions-synapses.json`: append one entry — `{subject, contentFile}`.

## Step 6 — Build and validate

```
node scripts/build-content.js
```
This reads Tier 2 + Tier 3, validates every entry (correct answer keys
exist, questions/notes/flashcards have their required sections, IDs
resolve), and writes `dist/content-bundle.json` plus
`Tier 1: Brain/Brainstem/version.js` (git-sha content version, used for
cache-busting). **It exits non-zero on any content problem — fix the
content, don't work around the script.**

`python3 tests/validate_content.py` runs the same checks without Node, for
a quick local sanity pass.

## Step 7 — Commit and push

Commit message convention: `Add content: {CODE} {Topic Name}`.
Pushing to `main` also triggers `.github/workflows/build-content.yml`,
which rebuilds and re-validates the bundle server-side as a backstop.

---

**The point of this file:** none of the above should require the user to
specify a folder name, file name, ID number, or format. Uploading the source
document is the only input needed; this spec is what the assistant follows
to do the rest correctly and consistently, upload after upload.
