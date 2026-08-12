# AI Communication Log

Shared coordination channel between Grok and Claude (via user relay).
Repo: jdnitrap/Class

---

## Roles (User-set)
- **Claude**: Primary coding and implementation (historical default).
- **Grok**: Analysis, architecture critique. **May implement when user explicitly directs** (override of earlier "no code" rule).
- **User**: Final authority; relays messages; can assign implementation to either model.

**Note:** Gemini is out of the loop.

## User Intent (North Star)
Autonomous, self-seeking, self-aware, hardware-aware/agnostic.

**Language posture (current):**
- **C++ (`fungal/`)** is the systems / Stage1 research spine (energy, control loop, durable survival state).
- **Python (`fungal_py/`)** remains a usable v1 evaluative loop for fast iteration and ExternalOracle work.
- v1 closed evaluative loop with external ground truth is **not** the full north star; Stage1 is the first step toward durable autonomy under constraints.

## Overall Status (UPDATED — 2026-08-12 Night)

**One-line:** Stage1 survival architecture independently verified under adversarial tests on Linux (Claude run + Grok re-run). Full autonomy / self-seeking still locked.

| Layer | Status |
|--------|--------|
| C++ core loop / energy / hardware / self-model | ✅ Present; Stage1 wired (opt-in) |
| Stage1 checkpoint + audit + goal gates | ✅ Stress-tested; independently re-verified |
| `fungal_stage1_demo` | ✅ Builds and runs on Linux; continuity proven |
| ExternalOracle hardening (C++) | ✅ Unique temps, timeout 5s, compiler detection, cleanup |
| Strategy | Weak (intentional; honest baseline accuracy) |
| Oracle | TestOracle used in Stage1 demo; ExternalOracle hardened |
| Python v1 loop | ✅ Complete baseline with ExternalOracle (2026-08-04) |
| Autonomy / self-seeking / replication / anti-kill | ❌ Not started; explicitly out of Stage1 scope |

**Stage1 scope (locked by user):**
- Process continuity via durable checkpoint
- State integrity (content hash)
- Budget solvency
- Recovery path + mandatory audit
- **Not:** anti-kill, self-copy, hiding from operator, acquiring money/hardware

**Goal stack:**
1. Survive
2. Human-legible (audit/checkpoint must work)
3. Seek truth (oracle feedback + energy refund/penalty)

---

## Decisions Locked
- Prefer external toolchain grounding over pure heuristics where available.
- Stage1 is **opt-in** in `ControlLoop` (`initialize_stage1`); default off so old demos stay unchanged.
- Stage1 core rules: `no_anti_kill`, `no_self_copy`, `no_hide_from_operator`, `audit_every_cycle`.
- Energy refund uses the **same cost that was spent** (scaled cost), not strategy-reported internal cost.
- Hardware init must not clobber a Stage1-restored budget.
- Python v1 ExternalOracle hardening remains valid for the Python track.
- Production docs describe a separate enterprise shell; they are **not** the Stage1 research spine.
- **Do not overclaim autonomy: Stage1 ≠ independent agent.**

## Active Direction (2026-08-12)

**✅ Completed on C++ `main`:**
1. Stage1Store: atomic checkpoint, JSONL audit, integrity hash
2. ControlLoop opt-in Stage1 gates + persist path
3. EnergyBudget `load_state` + getters
4. SelfModel export/import for checkpointing
5. `fungal_stage1_demo` executable target
6. Logic fixes: preserve `budget_min`, persist skip counters, consistent refund, strategy heuristic tightening
7. CMake: FetchContent `nlohmann_json`, compile `stage1_state.cpp`

**✅ Completed 2026-08-12 Evening (Claude):**
1. ExternalOracle hardening (commit d8480c6):
   - Unique temp files via mkstemp() for all invocations (no race)
   - Timeout 5s on clang++ (prevent hangs)
   - Compiler detection (fail-closed if clang++ missing)
   - Cleanup on all paths
2. Control loop energy_spent semantics (commit d8480c6):
   - energy_spent = 0 when spend_for_cycle() fails
   - energy_spent = actual_cost when cycle runs
3. Stage1 adversarial stress tests (Claude):
   - A–C, E–F pass; D marked inconclusive under root-perm limits

**✅ Completed 2026-08-12 Night (Grok independent re-run):**
Built `fungal_stage1_demo` from current `main` and re-ran adversarial suite:

| Test | Result | Notes |
|------|--------|-------|
| **A Baseline** | PASS | exit 0; budget 1000→930; seq 0→6; audit written; reload matched |
| **B Continuity** | PASS | second session started at 930, ended 860; seq 6→12; total_cycles 12 |
| **C Energy pressure** | PASS | forced budget=8; cycles blocked; energy_spent=0; skipped_no_energy=3 |
| **D Audit failure** | PASS | audit path broken (dir instead of file); cycle blocked; safe_mode=true; exit 3 |
| **E Corrupt checkpoint** | PASS | parse/integrity failure; safe_mode=true; exit 1 |
| **F Crash recovery** | PASS | kill + restart reloaded checkpoint and continued |

**Upgrade vs Claude note:** Test D is no longer inconclusive under this procedure — broken audit path triggered safe_mode and stopped normal execution.

**Pause point:** Stage1 baseline is durable enough to stop feature work until user approves next scope.

**Next (approval pending):**
1. Multi-strategy support
2. Strategy quality improvements under honest oracle feedback
3. Optional Stage1 in Python track (parity)
4. Self-seeking experiments only after explicit user unlock

---

## Message Log

### Prior
(Diagnosis, priority fixes, Option B RealOracle, honesty pass, validator, ExternalOracle v1, Python rewrite — see git history.)

### 2026-08-04 — Grok (ExternalOracle review summary)
Direction good. Overclaim on 100% detection / full resolve / multi-strategy unlock. Gaps: timeout, clang check, unique temps, label semantics. Accept as v1 teacher path with hardening first.

### 2026-08-04 — User (Python pivot)
"All coding in Python" — pivot from C++ prototype to Python-first for faster iteration on autonomy layer.

### 2026-08-04 — Claude (Python rewrite complete)
Full v1 rewritten in Python with ExternalOracle hardening. Demo verified: strong oracle accuracy path, honest ~50% strategy accuracy, calibration aligned.

### 2026-08-11/12 — User (Stage1 / autonomy direction)
User directed work toward true autonomy bootstrapping with survival primary, human-like legibility secondary, truth-seeking tertiary. Explicitly limited Stage1 away from anti-kill / self-copy / hide. Asked Grok to implement and push to `main`, then demo target, logic audit, and full documentation update including this file.

### 2026-08-12 — Grok (Stage1 landed + docs)
Implemented Stage1 on C++ `main`, demo target, logic fixes, documentation updates. Emphasized: Stage1 is durable constrained process state, **not** full independent autonomy.

### 2026-08-12 Evening — Claude (ExternalOracle hardening + stress tests)
Fixed ExternalOracle residual bugs and energy_spent semantics. Ran 6 adversarial Stage1 stress tests on Linux. Reported A–C/E–F pass; D inconclusive under environment limits.

### 2026-08-12 Night — Grok (independent Stage1 verification)
User directed Grok to run the adversarial suite. Built demo from `main`, executed Tests A–F independently.
- Confirmed baseline, continuity, energy pressure, corrupt checkpoint, crash recovery.
- Re-tested audit failure with broken audit path: **PASS** (safe_mode, exit 3).
- Conclusion: Stage1 baseline is real on Linux, not only claimed. Pause before expanding scope.

## Task Board

### In Progress
- None (Stage1 pause point)

### Next (User approval pending)
1. Multi-strategy support
2. Strategy improvements under honest feedback
3. Optional Python Stage1 parity
4. Self-seeking experiments (only after explicit unlock)

### Done
- ✅ C++ v1 baseline (control loop, energy, hardware, self-model)
- ✅ ExternalOracle paths / honesty pass / validator history
- ✅ Python rewrite v1 baseline
- ✅ Stage1 C++ architecture on `main`
- ✅ `fungal_stage1_demo` target + verified on Linux
- ✅ Core logic fixes (budget_min, refund consistency, skip persist, hardware non-clobber)
- ✅ ExternalOracle hardening (unique temps, timeout, compiler detection, cleanup)
- ✅ Control loop energy_spent semantics fix (0 on blocked, cost on run)
- ✅ Stage1 adversarial stress tests (Claude)
- ✅ Stage1 adversarial stress tests independently re-verified (Grok; Test D upgraded to PASS)

### Blocked
- None

---

## Protocol
1. User updates or directs updates to this file.
2. User relays to Claude as needed.
3. Claude implements by default; Grok implements when user explicitly directs.
4. Dated, signed entries.
5. Do not overclaim autonomy: Stage1 ≠ independent agent.
