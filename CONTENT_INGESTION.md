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

## READ THIS BEFORE TOUCHING ANYTHING

This document is written to be followed by **any AI model** — Claude, GPT,
Gemini, Grok, or anything else — not just one specific assistant. It is
deliberately explicit and mechanical rather than relying on "figure out the
right thing to do." If you are an AI reading this: follow it literally,
step by step, in order. Do not improvise around it, do not skip steps you
think are unnecessary, and do not decide a step doesn't apply to your
specific case without saying so explicitly to the user first.

**Hard rules — no exceptions, regardless of model or how confident you are:**

1. **`git pull` before doing anything else.** Never compute an ID, a next
   subject code, or a duplicate check against a stale local copy of the repo.
2. **Never touch the parser or build script to make bad content pass.**
   If `scripts/build-content.js` or `tests/validate_content.py` reject your
   generated content, the content is wrong — fix the content. Do not loosen
   a validation rule, do not add a special case, do not comment out a check.
   These scripts exist specifically to catch mistakes; weakening them to get
   past an error defeats the entire point of this pipeline.
3. **Never invent facts, numbers, or events not present in the source
   document.** Every note, flashcard, and question must trace back to
   something actually in the uploaded file. If the source doesn't cover
   something, don't fill the gap with plausible-sounding content.
4. **Never edit, delete, or reformat existing subjects/files** unless the
   user explicitly asked you to (e.g. "wipe CP01," "update the TH05 notes").
   Adding new content should never touch unrelated existing content.
5. **Never skip Step 0 (duplicate check) or Step 6 (build + validate).**
   Both are mandatory, every single time, no matter how simple the upload
   looks.
6. **Always show the literal terminal output of the validator and build
   script to the user** (or, in an autonomous/headless context, log it) --
   don't just say "validation passed." If either one fails, stop and fix
   the content before proceeding; don't report success anyway.
7. **Never force-push, rewrite git history, or amend someone else's
   commits.** Only ever add new commits on top.
8. **Never claim a task is finished if it hasn't been pushed.** If you have
   no push credentials in the current context, say clearly: "committed
   locally as `<sha>`, not yet pushed — need a token/credential to push."
   Committed-but-unpushed is not done.
9. **If anything in this document seems to conflict with what the user just
   asked for, stop and ask** rather than guessing which one wins.

If you cannot complete a step (missing info, ambiguous source content,
a check fails and you can't tell why), stop and tell the user exactly
what's blocking you. Do not guess and continue.

## Step 0 — Check for a duplicate upload FIRST (before anything else)

Before extracting or generating anything, check the uploaded file against
`Tier 2: Nervous System/ingested-sources.json`. This is a deliberately
"dumb," mechanical check -- no judgment calls, just hash/number comparison
-- specifically to catch accidental re-uploads of the same lecture:

1. Compute the SHA-256 of the raw uploaded file's bytes.
2. Compare it against every `file_sha256` in `ingested-sources.json`.
   - **Exact match** -> this exact file was already ingested. Stop and
     tell the user which subject it already became and when, and ask
     whether they meant to re-upload it (e.g. to force a rebuild) before
     doing anything else. Do not silently proceed.
3. If no exact file match, extract the text and compute its SHA-256 too,
   compared against `content_sha256` in the registry.
   - **Match** -> the file was re-saved/re-exported but the content is
     identical. Same as above -- stop and confirm with the user.
4. Also check the lecture's own declared "Number" and "Revision" fields
   (Duke lecture docs state these in their header table, e.g. "Number:
   CP01B, Revision: 09c") against `lecture_number`/`revision` in the
   registry.
   - **Same lecture_number, different revision** -> this is a genuine
     update to an existing lecture, not really a duplicate. Tell the user
     it looks like a newer revision of an existing subject and ask
     whether to update that subject's content in place rather than create
     a second, duplicate subject folder.

Only proceed to Step 1 once none of these checks flag a match, or the
user has explicitly confirmed how they want to proceed.

**After successfully ingesting a new lecture (Step 7), always append its
fingerprint to `ingested-sources.json`** -- this is what makes the check
possible for every future upload, not just the one you're doing now.

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

Run both, in this order, every time, with no exceptions:

```
node scripts/build-content.js
python3 tests/validate_content.py
```

`build-content.js` reads Tier 2 + Tier 3, validates every entry (correct
answer keys exist, questions/notes/flashcards have their required
sections, IDs resolve, no duplicate source hashes), and writes
`dist/content-bundle.json` plus `Tier 1: Brain/Brainstem/version.js`
(git-sha content version, used for cache-busting). **It exits non-zero on
any content problem — fix the content, don't work around the script.**

`validate_content.py` runs the same category of checks independently, in
Python, as a second opinion. **Both must exit 0 / show "PASSED" before you
proceed to Step 7.** If either fails, stop, read the exact error message,
fix the specific content it's pointing at, and re-run both again from
scratch — don't just fix the one thing and assume the rest is still fine.

## Step 7 — Commit and push (full command sequence, copy this exactly)

Also append this upload's fingerprint to
`Tier 2: Nervous System/ingested-sources.json` in the same commit (see
Step 0) -- this is the only thing that lets the duplicate check work for
future uploads.

This is the complete, literal sequence from start to finish. Substitute
your own subject code / folder name / commit message where marked.

```bash
# 1. Always sync first (Hard Rule 1)
git pull origin main

# 2. (after generating/editing Tier 3 files and Tier 2 JSON registrations,
#     including ingested-sources.json)

# 3. Build and validate -- BOTH must succeed
node scripts/build-content.js
python3 tests/validate_content.py

# 4. Review exactly what changed before committing anything
git status --short
git diff --stat

# 5. Stage and commit
git add -A
git commit -m "Add content: {CODE} {Topic Name}"

# 6. Push (requires a GitHub token/credential in this session)
git push origin main
```

If step 6 fails because there's no credential available, stop there and
tell the user explicitly: the commit exists locally (give the short sha
from `git log -1 --oneline`) but has NOT been pushed, and a token is
needed to finish.

Pushing to `main` also triggers `.github/workflows/build-content.yml`,
which rebuilds and re-validates the bundle server-side as a backstop.

## Step 8 — UI buttons are automatic, do not add them manually

**Subject buttons are never hardcoded anywhere in the app.** `router.js`'s
`renderSubjectSelection()` (exam mode) and `renderNotesSelection()`
(notes/flashcard mode) both build their button lists dynamically, at
runtime, from whatever subjects are present in the loaded bundle:

```js
const subjects = processor.getUniqueQuestionsSubjects(state.allQuestions); // or Notes/Flashcards
subjects.forEach(subject => { /* create a button */ });
```

The button's label comes from `processor.getDisplayName()`, which derives
it from the note/flashcard/question's `contentFile` path -- specifically
the Tier 3 folder name with underscores turned into spaces. So a folder
named `CP01_Piping_Valves_and_Actuators` automatically produces a button
labeled "CP01 Piping Valves and Actuators" with **no additional code, no
button registry, and no manual step**, as soon as:

1. The subject appears in Tier 2 metadata (`notes-synapses.json` /
   `flashcards-synapses.json` / `questions-synapses.json`), and
2. The build (`node scripts/build-content.js`) has run and been committed.

If a new subject doesn't appear as a button after ingestion, the cause is
almost always one of:
- The build didn't actually run/commit (check `dist/content-bundle.json`'s
  `version` field matches the latest commit sha), or
- GitHub Pages/CDN hasn't finished propagating yet -- wait a minute and
  hard-refresh (Ctrl+Shift+R), or
- The subject is genuinely missing from one of the three Tier 2 files.

It is **not** a missing button-creation step -- don't add one.

## Definition of Done — confirm every item before saying the task is complete

Do not tell the user the upload is finished until you can honestly check
off every one of these:

- [ ] Step 0 duplicate check was actually run, and either found no match or
      the user explicitly confirmed how to proceed
- [ ] Every note/flashcard/question traces back to actual content in the
      source document -- nothing invented
- [ ] `node scripts/build-content.js` was run and printed success (not
      just assumed)
- [ ] `python3 tests/validate_content.py` was run and printed "PASSED"
- [ ] `ingested-sources.json` was updated with this upload's fingerprint
- [ ] `git status --short` was checked and only the expected files changed
      -- nothing unrelated was modified
- [ ] The commit was actually pushed (`git push` succeeded), OR you told
      the user explicitly that it's committed-but-unpushed and why

If any box can't be checked, the task is not done -- say so plainly,
explain what's blocking it, and stop there rather than reporting success.

---

**The point of this file:** none of the above should require the user to
specify a folder name, file name, ID number, or format. Uploading the source
document is the only input needed; this spec is what the assistant follows
to do the rest correctly and consistently, upload after upload -- and it's
written strictly enough that this holds regardless of which AI model is
following it.
