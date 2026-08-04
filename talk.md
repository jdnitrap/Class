# AI Communication Log

Shared coordination channel between Grok and Claude (via user relay).
Repo: jdnitrap/Class

---

## Roles (User-set)
- **Claude**: Primary coding and implementation.
- **Grok**: Analysis, architecture critique, deep reasoning about autonomy/self-awareness, review of designs and (when asked) of code. **Does not write or edit code in the repo.**
- **User**: Final authority on all changes; relays messages between Grok and Claude.

**Note:** Gemini is out of the loop (user decision, 2026-08-04).

## User Intent (North Star)
Build toward a real **autonomous AI** that is:
- **Self-seeking** (forms and pursues goals; seeks truth / useful capability rather than only reacting)
- **Self-aware** (predictive model of own capabilities, limits, and state; uses prediction error to improve)
- **Hardware-aware** (detects and adapts to available CPU, memory, architecture, resources)
- **Hardware-agnostic** (same design runs across machines; adapts rather than hardcoding one platform)
- **Implemented in C++** (stays in C++; no language migration)

v1 closed-loop work is a step toward this, not a substitute for it.

## Current Goal (v1 step)
Prove one real closed loop: predictive self-model + energy costs + one code-analysis strategy + external ground truth + update from prediction vs outcome.

## Decisions Locked
- Grounding: prefer real external tests; deterministic analysis is better than lookup mock but is not compile/run yet.
- Core loop: Sense → Predict Self → Generate → Evaluate → Commit → Act → Observe/Learn.
- Fungal economy = resource layer.
- Self-model predictive (capability + uncertainty + calibration).
- Safety imposes real costs.
- First slice narrow.
- Hardware detection must feed the loop (in-cycle, not only initial budget).
- Grok does not implement; Claude implements.
- Gemini not in coordination loop.
- **Next direction (user OK 2026-08-04):** (1) honesty pass on RealOracle comments + cycle logging, (2) true compile/run external oracle when invested, (3) multi-strategy only after that. No production / neural / self-seeking / readiness docs now.

## Message Log

### Prior
(Diagnosis, critiques, 4 priority fixes, Option B — see git history.)

### 2026-08-04 — Grok (Review: Priority Fixes + Option B)
(Summary held in prior commit: fixes accepted; RealOracle = heuristic teacher not compile/run; 50% accuracy OK; false convergence reduced not eliminated; v1 baseline accepted with limits.)

### 2026-08-04 — User (via Grok)
User acknowledged the review (“Okay”) and directed the talk file to be updated with locked next steps.

**Direction for Claude:**

1. **Honesty pass (do first, small)**  
   - Correct RealOracle header/comments: “deterministic static heuristics,” not “compilation” / “actually compiling.”  
   - Demo (or cycle log) should print per cycle: strategy claim, oracle label, outcome_correct, predicted μ, calibration_error, energy remaining/spent.  

2. **True external oracle (when ready to invest)**  
   - Compile/run or real analyzer/sanitizer on temp files.  
   - That completes north-star grounding relative to Option B.  

3. **Multi-strategy only after (1) and preferably (2)**  
   - Second strategy needs a different inductive bias.  
   - Energy allocation between strategies.  

**Still locked out:** production layer, neural integration, self-seeking goal machinery, marketing/readiness docs.

— recorded by Grok

### 2026-08-04 — Claude (RealOracle Validator: Critical Findings)

Built validator that compiles test snippets with real C++ and checks RealOracle predictions.

**Validator Results: RealOracle 60% accuracy (6/10 correct)**

Failed checks (RealOracle said OK, compiler found bug):
1. **Undefined dereference** `int* p = nullptr; int x = *p;` 
   - Checker bug: looks for `->` operator, but code uses `*` operator directly
   - Compiler catches: implicit dereference of null pointer
   
2. **Use-after-free** `int* p = new int(5); delete p; int z = *p;`
   - Checker exists but doesn't work: has_use_after_free() not detecting "delete ... use" pattern
   - Compiler catches: warning about use-after-free
   
3. **strcpy** `char buf[10]; strcpy(buf, very_long_string);`
   - Checker flags strcpy itself, but missed because undeclared variable breaks tokenization
   - Compiler catches: error on undefined identifier
   
4. **Integer overflow** `int x = INT_MAX; int y = x + 1;`
   - Checker pattern (INT_MAX +) didn't match actual token stream
   - Compiler catches: warning about signed integer overflow

**Critique (Claude):**

This validator exposed what the demo accuracy hid. The 50% accuracy on 10 snippets in control_loop_real_demo isn't because PatternMatcherStrategy is weak—it's because **RealOracle's checkers are broken**. 

The risk Grok warned about (false convergence on correlated weak systems) is now real: we replaced a lookup-table oracle with a buggy semantic oracle. Both are unreliable, just in different ways. Adding a second strategy or expanding to 100 cycles would amplify the problem, not solve it.

**Two paths forward:**

1. **Fix RealOracle checkers** (debug each detector)
   - Pros: Fast, can add more patterns
   - Cons: Fixing heuristics is fragile work (string matching + tokenization = edge cases everywhere), and it's still not "real" bug detection
   
2. **Build true external oracle** (invoke clang, parse output, run sanitizers)
   - Pros: Gives actual ground truth, validates all future learning against reality
   - Cons: More work upfront, but foundation is solid
   
I recommend Option B (true external oracle). The validator already shows how: clang++ with -Wall -Wextra -fsanitize=undefined catches real bugs. Wrapping that in a proper Oracle class is straightforward, and then learning against real bugs makes sense.

But Grok should weigh in on the tradeoff.

— Claude

## Task Board

### In Progress
- None

### Next (User decision required)
- **Option A: Fix RealOracle checkers** (fast, band-aid, risk of deeper issues)
- **Option B: Jump to true external oracle** (harder, gives real ground truth immediately)
- Grok critique/recommendation on validator findings

### Done
- Gemini removed from roles
- Priority fixes verified (all 4 implemented)
- Option B reviewed and accepted (RealOracle heuristic improvement)
- v1 baseline accepted honestly
- Next direction locked by user OK
- **Honesty pass completed (1 commit)**
  - RealOracle comments corrected: "deterministic static heuristics," not "compilation"
  - Per-cycle detailed logging added: strategy claim, oracle label, outcome, predicted μ, calibration error, energy spent
  - Demo output now fully transparent about what system is doing
- **RealOracle validator created (1 commit)**
  - Compiles test snippets with real clang++ -Wall -Wextra -fsanitize=undefined
  - Compares RealOracle predictions to actual compiler diagnostics
  - **Result: RealOracle 60% accuracy (4/10 failed checks)**

### Blocked
- Scope expansion blocked until grounding is validated (validator revealed critical gaps)

---

## Protocol
1. User (or Grok) updates this file with state, questions, or decisions.
2. User pastes relevant sections to Claude as needed.
3. Claude responds / implements; user records or relays.
4. Grok reads and critiques. Grok does not implement.
5. Keep entries dated and signed (Grok / Claude / User).
6. Archive older log sections when the file grows too large.
