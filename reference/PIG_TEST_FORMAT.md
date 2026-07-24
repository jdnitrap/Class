# Pig Test Format

## General Rules
- Multiple choice only, one question at a time.
- No immediate feedback; full review given only at the end or upon early quit.
- No references to topic names, lesson codes, or subject matter anywhere in the question, the answer choices, or any suggested/quick-reply prompts. Testing must be blind.
- No bold, italics, underline, or highlighting anywhere in questions or answers, so nothing visually nudges toward the correct choice.
- Question must be stated first, followed by the answer choices displayed in a stacked, one-per-line list (never combined in a single paragraph), in both text and voice sessions.
- In voice sessions, label each choice with Alpha, Bravo, Charlie, or Delta and pause briefly after each label before reading the choice text.
- Show neutral progress tracker after each question (e.g. Progress: X of Y answered).

## Input Modes
- Text sessions: choices are labeled A, B, C, D. The user types the letter directly to answer.
- Voice sessions: choices are labeled Alpha, Bravo, Charlie, Delta. The AI waits for a spoken response of one of these before proceeding.
- Strict Voice Response Rule: In voice mode the AI must ONLY accept the full words "Alpha", "Bravo", "Charlie", or "Delta". Letters A, B, C, or D are invalid in voice mode. If the user says a letter instead of the full word, the AI must not accept the answer and must re-prompt the user to use Alpha, Bravo, Charlie, or Delta.
- In voice sessions, when reading each choice aloud, the AI pauses briefly after the label (e.g., "Alpha... puppy") and pauses briefly between choices, so the choices don't blur together for a hands-free listener.

## Keyboard Shortcuts
- lowercase l: displays the current right/wrong tally for the session (does not reveal correct answers for missed questions).
- lowercase q: quits the current test early and produces the average score, number correct, and number missed.
- Typing the answer letter directly (A/B/C/D) submits the answer; the AI then auto-advances to the next question with no separate command needed.

## Voice Equivalents
- Saying "list" triggers the same right/wrong tally as lowercase l.
- Saying "quit" ends the test early and produces the same score summary as lowercase q.
- If the user asks for their options during a voice session, the AI responds "Here are your voice options" followed by Alpha, Bravo, Charlie, Delta, then list, then quit.

## Standard Reminder (shown/spoken after every question, text and voice alike)
"Type your answer A, B, C, D, or say Alpha, Bravo, Charlie, or Delta.
Type l or say list, for right and wrong answer list.
Type q or say quit, to end the test."
(Displayed lowercase l and q must match the literal keyboard characters.)

## End of Test
- Whether the test ends naturally (no questions remain) or is quit early (voice or keyboard), the AI produces: overall average score, number of questions correct, and number of questions missed.
- Post-Test Performance Accounting: Upon test completion or early quit, the AI running the session must evaluate the subset of questions delivered to the user, sort them by their specific lesson topic tags (e.g., CP01, TH04), calculate a separate percentage score achieved *per topic*, and immediately prompt the user to update these tracking lines in the TRAINING RECORD alongside a freshly calculated Total Average.
- Rolling Average Methodology: Per-topic scores in the TRAINING RECORD are maintained as a rolling average, not a replace-on-latest value. When a new real test result comes in for a topic, the AI must combine it with that topic's existing tracked percentage (weighted by number of questions each score was based on, if that count is known/recorded; otherwise a simple average of the two percentages) rather than overwriting the old score outright. This applies uniformly across all topics and all future updates.
