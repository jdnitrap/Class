# Rules for AI Agents Working on This Repo

This file exists because more than one AI may end up working on this repo
over time (Claude, Grok, or anything else). It's a set of hard rules, not
suggestions -- if you're an AI reading this before making changes, follow
them exactly.

**This is an honor-system safeguard, not a mechanically enforced one.**
There is no branch protection blocking direct pushes to `main` -- the
owner decided that added too much friction for the size of this project.
That means these rules only work if you actually read and follow them.
Take that seriously: the only thing standing between a careless change and
`main` is you doing the right thing here.

## Hard rules

1. **Don't push straight to `main` without running the validator first.**
   There's no branch protection stopping you technically, which is exactly
   why this matters more, not less.
2. **Never force-push, anywhere.** If history needs fixing, ask the user.
3. **Always run the validator before committing content changes:**
   `python3 tests/validate_content.py` and/or `node scripts/build-content.js`.
   If either fails, fix the content -- don't edit the validator to make
   the failure go away, and don't skip it "just this once."
4. **Never delete a Tier 3 subject folder or its Tier 2 metadata entries**
   without the user explicitly confirming in the current conversation
   that they want that specific subject removed. "Clean up unused
   content" is not sufficient justification on its own.
5. **Never modify `.github/workflows/` or repository settings** without
   explicit user confirmation -- these are part of the safety net itself,
   not ordinary content.
6. **Follow `CONTENT_INGESTION.md` exactly** for anything related to
   adding new lecture content (folder/file naming, YAML frontmatter
   format, ID sequencing, the Step 0 duplicate check). Don't improvise a
   different format.
7. **If something is ambiguous or destructive, ask first.** This user has
   consistently preferred being asked before large or irreversible
   changes over an AI guessing and moving fast.

## Why this exists

The user asked for a "dummy-proof safeguard" specifically so that a less
careful AI session (their words: "so that AI does not screw up anything on
the whole repo") can't damage the project even by accident. They chose the
honor-system version over GitHub-enforced branch protection to keep things
simple -- which means this file carries real weight. Read it, follow it.
