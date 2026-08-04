# Fungal System Architecture

## Overview

The Fungal System is a bio-inspired distributed reasoning network built with modular C++ architecture. It analyzes code structures to form claims about program properties and refines those claims through a 12-phase reasoning cycle.

## Three-Layer Design

### Layer 1: Knowledge Builder (Code Analysis)
Analyzes real code and builds foundational claims about program properties.

**Components:**
- **Tokenizer** (`src/layer1/tokenizer.cpp`): Parses code into tokens (keywords, identifiers, operators)
- **Analyzer** (`src/layer1/analyzer.cpp`): Measures code properties (nesting depth, branches, functions)
- **Dictionary** (`src/layer1/dictionary.cpp`): Maintains concept definitions and prerequisites
- **Verifier** (`src/layer1/verifier.cpp`): Tests hypotheses against code measurements
- **Builder** (`src/layer1/builder.cpp`): Generates learning templates from recognized concepts

**Output:** Foundational claims about code structure

### Layer 2: Reasoning Network (Distributed Inference)
Executes 12-phase cycle to refine claims through node consensus and energy dynamics.

**Core Modules:**
- **Nodes** (`src/layer2/core/node.cpp`): Individual reasoning units with energy and trust
- **Substrate** (`src/layer2/core/substrate.cpp`): Environmental conditions (toxins, nutrients)
- **Energy** (`src/layer2/core/energy.cpp`): Energy transfer between nodes
- **Voting** (`src/layer2/voting/voting.cpp`): Consensus mechanisms

**The 12 Phases:**
1. **Claim Decay** - Reduce confidence over time
2. **Energy Transfer** - Distribute energy between nodes
3. **Quarantine** - Isolate nodes with trust violations
4. **Removal** - Delete quarantined nodes after timeout
5. **Environmental Shocks** - Handle toxin/nutrient events
6. **Asymmetric Trust** - Directional trust relationships
7. **Specialization** - Nodes develop domain expertise
8. **Substrate Learning** - Optimize environmental parameters
9. **Claim Refinement** - Update claims based on node consensus
10. **Multi-Network Learning** - Transfer insights between networks
11. **Measurement Uncertainty** - Reduce confidence under noisy conditions
12. **Hardware Constraints** - Enforce resource limits

### Bridge: Layer Integration
Connects Layer 1 and Layer 2, importing foundational claims and exporting verified results.

**Operations:**
- Import foundational claims as initial network claims
- Create nodes for each imported claim
- Export verified claims after reasoning cycles
- Provide measurement feedback to refine claims

## Data Flow

```
Code → [Layer 1] → Foundational Claims
                           ↓
                      [Bridge Import]
                           ↓
Network Claims ← [Layer 2: 12 Phase Cycle] → Verified Claims
                           ↓
                      [Bridge Export]
```

## Critical Interfaces (Cannot Break)

```cpp
// Phase execution contract
class Phase {
    virtual void execute(FungalNetwork& network) = 0;
};

// All data types
struct FungalNetwork { /* nodes, claims, substrate */ };
struct Claim { /* id, statement, confidence, verification */ };
struct Node { /* id, claim_id, energy, specialization */ };
```

## Modularity Principles

- **30 Files Total**: Each file is 200-300 lines (max 400)
- **Clear Responsibility**: Each file has one primary purpose
- **No Circular Dependencies**: Imports form a DAG
- **Self-Contained Tests**: Each module can be tested independently
- **C++ Only**: No JSON/serialization bridges between layers

## Build Structure

```
fungal/
├── include/
│   ├── types.hpp (all data structures)
│   ├── interfaces.hpp (all base classes)
│   └── fungal_system.hpp (main API)
├── src/
│   ├── layer1/ (5 components + orchestrator)
│   ├── layer2/
│   │   ├── core/ (3 modules: node, substrate, energy)
│   │   ├── phases/ (12 phase implementations)
│   │   └── voting/ (consensus logic)
│   ├── bridge/ (2 modules: integration, feedback)
│   └── main.cpp (demo application)
├── tests/
│   ├── unit/ (per-module tests)
│   ├── integration/ (layer interactions)
│   └── system/ (stress tests)
└── scripts/ (pre-commit checks)
```

## Performance Characteristics

- **Unit Tests**: <100ms total
- **Integration Tests**: <500ms total
- **System Tests**: <3s total
- **Single Cycle**: ~1-5ms depending on network size
- **Memory**: O(nodes + claims), scales to 1000s of nodes

## Safeguards

1. **Automated Tests** - Every push runs full test suite
2. **Code Review** - Human approval before merge
3. **Documentation** - Architecture clearly documented
4. **Templates** - New phases use proven templates
5. **Pre-commit Checks** - Verify compile, tests, size, interfaces, debug code
