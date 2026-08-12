# Fungal System: Self-Aware Autonomous AI

A C++17 research system for self-aware, hardware-aware, truth-seeking autonomous behavior inspired by fungal networks.

**Current research spine:** the **core control loop + Stage1 survival state** (energy scarcity, self-model, oracle feedback, durable checkpoint/audit).

> Stage1 is durable constrained process state. It is **not** full independent autonomy.

## Quick Start

### Build
```bash
cd fungal
mkdir build && cd build
cmake ..
make -j4
```

Requires **CMake 3.14+** (FetchContent pulls `nlohmann/json` for Stage1 checkpointing).

### Run
```bash
# Stage1 survival demo (checkpoint + audit)
./fungal_stage1_demo

# Core control-loop demo (no Stage1 by default)
./fungal_loop_demo

# Interactive Terminal UI
./fungal_tui

# Simulation Mode
./fungal_sim

# Demo application
./fungal

# Tests (if GTest available)
ctest --output-on-failure
```

## Stage1 (new)

Stage1 adds opt-in durable survival behavior to `ControlLoop`:

| Goal priority | Meaning |
|---|---|
| 1 Survive | budget solvency, recovery path, process continuity via checkpoint |
| 2 Human-legible | mandatory audit JSONL + integrity-hashed checkpoint |
| 3 Seek truth | oracle-grounded claim evaluation; energy refund/penalty |

**Not in Stage1:** anti-kill, self-copy, hiding from operator, acquiring resources.

Runtime files:
```text
state/checkpoint.json
state/audit.jsonl
```

Full write-up: [fungal/docs/STAGE1.md](fungal/docs/STAGE1.md)

Coordination log: [talk.md](talk.md)

## Interaction Modes

### Stage1 Demo
```bash
./fungal_stage1_demo
```
Enables Stage1, runs cycles, writes checkpoint/audit, reloads state in a second loop instance.

### Interactive Terminal UI
```bash
./fungal_tui
```
See [fungal/docs/TUI_GUIDE.md](fungal/docs/TUI_GUIDE.md)

### Simulation Mode
```bash
./fungal_sim
```
See [fungal/docs/SIMULATION_GUIDE.md](fungal/docs/SIMULATION_GUIDE.md)

## What This System Is

A biologically-inspired architecture exploring:
- **Energy-scarce control loops** with honest feedback from oracles
- **Self-models** that track accuracy and calibration separately
- **Durable Stage1 state** for continuity and auditability
- **Layer1** local analysis and **Layer2** multi-node claim/energy/trust dynamics
- **Foundation/safety/learning** segments (present; partially parallel to Stage1 spine)
- Optional **production shell** modules (separate build path)

## Architecture (simplified)

```text
Entry points (demos / tui / sim / stage1_demo)
        │
        ▼
Core loop: EnergyBudget + SelfModel + Strategy + Oracle
        │  optional Stage1Store (checkpoint/audit/gates)
        ▼
Layer1 (tokenize/analyze/verify) ── Bridge ── Layer2 (nodes/phases/voting)
        │
Foundation / Safety / Learning segments (parallel track)
        │
Production shell (optional ops layer)
```

Details: [fungal/docs/ARCHITECTURE.md](fungal/docs/ARCHITECTURE.md)

## Documentation

### Start here
- **[talk.md](talk.md)** — coordination status / decisions
- **[STAGE1.md](fungal/docs/STAGE1.md)** — survival architecture
- **[ARCHITECTURE.md](fungal/docs/ARCHITECTURE.md)** — system design
- **[BUILDING.md](fungal/docs/BUILDING.md)** — build & Stage1 demo
- **[SAFETY.md](fungal/docs/SAFETY.md)** — constraints and Stage1 gates

### Core docs
- [fungal/docs/README.md](fungal/docs/README.md)
- [API.md](fungal/docs/API.md)
- [LEARNING.md](fungal/docs/LEARNING.md)
- [EXAMPLES.md](fungal/docs/EXAMPLES.md)
- [TUI_GUIDE.md](fungal/docs/TUI_GUIDE.md)
- [SIMULATION_GUIDE.md](fungal/docs/SIMULATION_GUIDE.md)

### Production shell docs
- [PRODUCTION_DEPLOYMENT.md](fungal/docs/PRODUCTION_DEPLOYMENT.md)
- [PRODUCTION_API.md](fungal/docs/PRODUCTION_API.md)
- [PRODUCTION_CONFIGURATION.md](fungal/docs/PRODUCTION_CONFIGURATION.md)
- [PRODUCTION_MONITORING.md](fungal/docs/PRODUCTION_MONITORING.md)
- [PRODUCTION_SECURITY.md](fungal/docs/PRODUCTION_SECURITY.md)

## File Structure (abbrev)

```text
Class/
├── README.md
├── talk.md
├── fungal/                 # C++ system
│   ├── include/core/       # control loop, stage1, energy, self-model
│   ├── src/core/           # implementations + demos
│   ├── src/layer1/         # knowledge builder
│   ├── src/layer2/         # claim/energy network
│   ├── include/production/ # optional enterprise shell
│   └── docs/
└── fungal_py/              # Python v1 evaluative loop
```

## Key Concepts

### Scarcity
Actions cost energy. Failures cost more than successes refund. Exhausted budget stops work.

### Legibility
Stage1 refuses to act if it cannot write audit/checkpoint state.

### Truth-seeking
Claims are checked against an oracle. Learning updates are outcome-grounded.

### Autonomy with limits
Stage1 improves continuity under operator-visible constraints. It does not attempt to resist shutdown or hide.

## Python track

`fungal_py/` holds the Python v1 control loop with ExternalOracle hardening for fast iteration. It remains valid; Stage1 durability work is currently C++-first.

## Project status (honest)

| Area | Status |
|---|---|
| Core loop (C++) | Present |
| Stage1 survival path | On `main`, opt-in |
| Stage1 local run proof | Operator verifies with `fungal_stage1_demo` |
| Layer1 / Layer2 | Present scaffolding |
| Full segment fusion into Stage1 | Not complete |
| Production shell | Present as separate path |
| Full autonomy / self-seeking | Not started |

**Last Updated:** August 12, 2026
