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

## Overall Status (UPDATED — 2026-08-12)

**One-line:** Stage1 survival architecture landed on C++ main (opt-in). Python v1 loop still valid. Full autonomy / self-seeking still not started.

| Layer | Status |
|--------|--------|
| C++ core loop / energy / hardware / self-model | ✅ Present; Stage1 wired (opt-in) |
| Stage1 checkpoint + audit + goal gates | ✅ On `main` (survive > legible > truth) |
| `fungal_stage1_demo` | ✅ Added; needs local build verification |
| Strategy | Weak (intentional) |
| Oracle | TestOracle (demo); ExternalOracle path in Python/C++ demos |
| Python v1 loop | ✅ Complete baseline (2026-08-04) |
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

## Active Direction (User + Grok — 2026-08-12)

**✅ Completed on C++ `main`:**
1. Stage1Store: atomic checkpoint, JSONL audit, integrity hash
2. ControlLoop opt-in Stage1 gates + persist path
3. EnergyBudget `load_state` + getters
4. SelfModel export/import for checkpointing
5. `fungal_stage1_demo` executable target
6. Logic fixes: preserve `budget_min`, persist skip counters, consistent refund, strategy heuristic tightening
7. CMake: FetchContent `nlohmann_json`, compile `stage1_state.cpp`

**Still required from operator:**
- Local `cmake && make fungal_stage1_demo && ./fungal_stage1_demo` verification

**Next (approval pending):**
1. Multi-strategy support
2. Strategy quality improvements under honest oracle feedback
3. Optional Stage1 in Python track (parity)
4. Self-seeking experiments only after Stage1 is proven durable on machine

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
Implemented Stage1 on C++ `main`, demo target, logic fixes, documentation updates. Emphasized: Stage1 is durable constrained process state, **not** full independent autonomy. Local compile/run still operator-side proof.

## Task Board

### In Progress
- Documentation alignment with Stage1 (this update)

### Next (User approval pending)
1. Local verify `fungal_stage1_demo`
2. Multi-strategy support
3. Strategy improvements under honest feedback
4. Optional Python Stage1 parity
5. Self-seeking experiments (only after Stage1 proven)

### Done
- ✅ C++ v1 baseline (control loop, energy, hardware, self-model)
- ✅ ExternalOracle paths / honesty pass / validator history
- ✅ Python rewrite v1 baseline
- ✅ Stage1 C++ architecture on `main`
- ✅ `fungal_stage1_demo` target
- ✅ Core logic fixes (budget_min, refund consistency, skip persist, hardware non-clobber)

### Blocked
- None hard-blocked; local Stage1 run verification outstanding

---

## Protocol
1. User updates or directs updates to this file.
2. User relays to Claude as needed.
3. Claude implements by default; Grok implements when user explicitly directs.
4. Dated, signed entries.
5. Do not overclaim autonomy: Stage1 ≠ independent agent.
