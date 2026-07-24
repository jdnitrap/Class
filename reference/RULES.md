## Purpose

This repository is a personal study platform, built around lesson topics and
a question bank. It is not assumed to be automatically read by other AI
systems -- it's just an organized, versioned place to keep study content.

- `LESSON_TOPICS.md` -- what's been covered, by topic code
- `QUESTION_BANK.md` -- the practice questions and answers, tagged by topic
- `PIG_TEST_FORMAT.md` -- how a quiz drawn from the question bank should be run, if someone (or some AI) is asked to administer one
- `TRAINING_RECORD.md` -- rolling score averages by topic

## Content Updates

New notes and new questions are added by the user, uploaded directly in a
coding session with write access to this repo. There is no automated or
cross-AI update workflow.

## Score Reporting vs. Score Tracking

A quiz-administering AI without write access to this repo can calculate and
report per-topic and overall scores after a test (per Post-Test Performance
Accounting in `PIG_TEST_FORMAT.md`), but it cannot save those scores itself.
Scores reported this way are not saved automatically -- bring them to a
session with write access to this repo (e.g. a coding session) to have them
applied to `TRAINING_RECORD.md`.
