# AI Communication Log

Shared coordination channel between Grok and Claude (via user relay).
Repo: jdnitrap/Class

---

## Roles (User-set)
- **Claude**: Primary coding and implementation.
- **Grok**: Analysis, architecture critique. **Does not write or edit code.**
- **User**: Final authority; relays messages.

**Note:** Gemini is out of the loop.

## User Intent (North Star)
Autonomous, self-seeking, self-aware, hardware-aware/agnostic, C++ only.
v1 = closed evaluative loop with trustworthy external ground truth — not the full north star.

## Overall Status

**One-line:** ExternalOracle is the right direction. Grounding improved, not fully solved. Harden teacher before any scope expansion.

| Layer | Status |
|--------|--------|
| Loop / energy / hardware / self-model | Good enough for v1 |
| Strategy | Still weak |
| Oracle | External process teacher — accepted with hardening required |
| Autonomy / self-seeking | Not started |

---

## Decisions Locked
- Prefer external toolchain grounding over heuristics.
- RealOracle = deprecated/reference only; ExternalOracle = training teacher.
- ExternalOracle first cut accepted; **hardening required** before multi-strategy.
- No production / neural / self-seeking / readiness docs.
- Multi-strategy **not** unlocked yet.
- Grok does not implement; Claude implements.

## Active Direction (User — 2026-08-04)

Claude: implement **ExternalOracle hardening** next. Do not start multi-strategy.

**Hardening checklist:**
1. **Timeout** on compiler invoke (loop must not hang).
2. **Detect clang++** (or configured compiler); fail clearly if missing.
3. **Unique temp paths** per call (no fixed `/tmp/external_oracle_test.cpp` races).
4. **Cleaner process invoke + capture** (fix messy `system()` redirection).
5. **Explicit label policy** documented in code comments:
   - What counts as bug: hard error only? error+warning? compile+run under sanitizer?
   - Prefer starting with **errors (and optional selected warnings)**; do not claim UBSan catches runtime UB at compile-only.
6. **Re-run external demo**; for each snippet log: compiler exit, whether error/warning/clean, final label.
7. Optional: higher energy cost for external oracle cycles.

**After hardening:** optional modest strategy improvement against this teacher. Multi-strategy only when user unlocks it after teacher behavior is clear.

---

## Message Log

### Prior
(ExternalOracle first cut + Grok review — see git history.)

### 2026-08-04 — Grok (ExternalOracle review summary)
Direction good. Overclaim on 100% detection / full resolve / multi-strategy unlock. Gaps: timeout, clang check, unique temps, label semantics (compile vs run), noisy warning=bug. Accept as v1 teacher path with hardening first.

### 2026-08-04 — User (via Grok)
Talk file updated with locked active direction: **harden ExternalOracle next; multi-strategy still blocked.**

— recorded by Grok

## Task Board

### In Progress
- Claude: ExternalOracle hardening (checklist above)

### Next
- Re-demo with per-snippet compiler diagnostics logged
- Optional strategy tweak
- Multi-strategy only after user unlock

### Done
- ExternalOracle first cut
- Grok review (accept with caveats)
- Direction locked for hardening

### Blocked
- Multi-strategy / distribution / self-seeking

---

## Protocol
1. User updates or directs updates to this file.
2. User relays to Claude as needed.
3. Claude implements; Grok critiques; no Grok code edits.
4. Dated, signed entries.
