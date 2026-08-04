# Fungal System: Self-Aware Autonomous AI

A complete C++17 implementation of a self-aware, hardware-aware, truth-seeking autonomous AI system inspired by fungal networks.

## Quick Start

### Build
```bash
cd fungal
mkdir build && cd build
cmake ..
make -j4
```

### Run
```bash
# Interactive Terminal UI (hands-on exploration)
./fungal_tui

# Simulation Mode (automated testing)
./fungal_sim

# Demo application
./fungal

# Run tests
ctest --output-on-failure
```

## Interaction Modes

### 🎮 Interactive Terminal UI

The **Fungal TUI** for real-time interaction:

```bash
cd fungal/build
./fungal_tui
```

**Features:**
- Create & manage autonomous nodes
- Run cycles in real-time
- Send signals through substrate
- View audit trails and decision history
- Track learning and strategy performance
- View safety constraints and alignment
- Visualize neural network outputs
- Manage strategies dynamically

**See:** [fungal/docs/TUI_GUIDE.md](fungal/docs/TUI_GUIDE.md)

### 🧪 Simulation Mode

Automated testing for learning and safety:

```bash
cd fungal/build
./fungal_sim
```

**Measures:**
- Learning convergence speed
- Strategy adaptation
- Success rates across scenarios
- Constraint compliance
- Safety metrics
- Anomaly handling

**Generates:**
- Node performance reports
- Source trustworthiness ranking
- Strategy effectiveness scores
- Safety compliance verification
- System health conclusions

**See:** [fungal/docs/SIMULATION_GUIDE.md](fungal/docs/SIMULATION_GUIDE.md)

## What This System Is

A biologically-inspired distributed reasoning architecture where:
- **Autonomous nodes** operate independently on shared substrate
- **Hardware-aware execution** adapts to available resources
- **Self-aware reasoning** monitors and improves its own processes
- **Truth-seeking mechanisms** make false claims metabolically expensive
- **Safety constraints** are hardcoded and cannot be overridden
- **Continuous learning** adapts to new information sources
- **Neural-symbolic hybrid** combines logic with pattern recognition

## Key Features

### 1. Hardware Awareness
System detects and adapts to:
- CPU cores available
- Available memory
- Operating system
- Architecture (x86_64, ARM, etc.)
- Automatically optimizes execution

### 2. Self-Awareness
System knows:
- Its own constraints (energy limits, strategy whitelist)
- Current goals and active strategies
- Capability scores (verify, analyze, learn)
- Energy state and resource availability
- Decision history and success rates

### 3. Autonomous Operation
- Nodes run independently
- Make decisions within alignment constraints
- No central orchestrator
- Communicate through shared substrate
- Adapt strategies based on introspection

### 4. Safety Built-In
- Hard constraints that cannot be broken
- Value alignment (seek truth, minimize harm, transparency)
- Complete audit trail of all decisions
- Killswitch always available
- Monitoring system detects anomalies

### 5. Adaptive Learning
- Track trustworthiness of information sources
- Learn which strategies work best
- Recognize domain patterns
- Continuous improvement through experience

### 6. Self-Improvement
- Generate new strategies autonomously
- Meta-reasoning about own processes
- Identify and fix weaknesses
- Combine successful approaches

### 7. Neural Integration
- Embedded neural networks for pattern recognition
- Hybrid symbolic + neural decision making
- Continuous online learning
- Adaptive to distribution shifts

## Architecture

```
┌─────────────────────────────────────────┐
│     Self-Aware Autonomous AI System     │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Segment 6: Neural Integration  │   │
│  │  - Hybrid reasoning             │   │
│  │  - Neural networks              │   │
│  │  - Continuous learning          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Segment 5: Self-Improvement     │   │
│  │  - Strategy generation          │   │
│  │  - Meta-reasoning               │   │
│  │  - Self-optimization            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Segment 4: Adaptive Learning    │   │
│  │  - Trust networks               │   │
│  │  - Reinforcement learning       │   │
│  │  - Domain patterns              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Segment 3: Safety Layer         │   │
│  │  - Constraints                  │   │
│  │  - Alignment                    │   │
│  │  - Monitoring                   │   │
│  │  - Killswitch                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Segment 2: Self-Model           │   │
│  │  - System self-knowledge        │   │
│  │  - Constraints awareness        │   │
│  │  - State management             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Segment 1: Foundation           │   │
│  │  - Hardware detection           │   │
│  │  - Substrate (communication)    │   │
│  │  - Introspection                │   │
│  │  - Autonomous nodes             │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## Documentation

Complete documentation is available in `fungal/docs/`:

- **[README.md](fungal/docs/README.md)** - Quick start and overview
- **[ARCHITECTURE.md](fungal/docs/ARCHITECTURE.md)** - Detailed system design and 6-segment architecture
- **[API.md](fungal/docs/API.md)** - Complete API reference for all components
- **[BUILDING.md](fungal/docs/BUILDING.md)** - Build instructions, dependencies, troubleshooting
- **[SAFETY.md](fungal/docs/SAFETY.md)** - Safety mechanisms, constraints, alignment, security analysis
- **[LEARNING.md](fungal/docs/LEARNING.md)** - How the system learns from experience
- **[EXAMPLES.md](fungal/docs/EXAMPLES.md)** - Practical usage examples

## File Structure

```
fungal/
├── include/
│   ├── hardware.hpp              # Hardware detection
│   ├── substrate.hpp             # Communication layer
│   ├── introspection.hpp         # Self-awareness
│   ├── autonomous_node.hpp       # Autonomous agents
│   ├── self_model.hpp            # System self-knowledge
│   ├── constraints.hpp           # Hard constraints
│   ├── alignment.hpp             # Value alignment
│   ├── monitor.hpp               # Monitoring & audit
│   ├── learning.hpp              # Adaptive learning
│   ├── self_improvement.hpp      # Self-improvement
│   └── neural_integration.hpp    # Neural networks
├── src/
│   ├── hardware.cpp
│   ├── substrate.cpp
│   ├── introspection.cpp
│   ├── autonomous_node.cpp
│   ├── self_model.cpp
│   ├── constraints.cpp
│   ├── alignment.cpp
│   ├── monitor.cpp
│   ├── learning.cpp
│   ├── self_improvement.cpp
│   ├── neural_integration.cpp
│   └── main.cpp                  # Demo application
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── system/                   # System tests
└── docs/                         # Documentation
```

## Key Concepts

### Autonomy with Alignment
The system is autonomous (makes independent decisions) but operates within carefully designed constraints that ensure alignment with human values.

### Truth-Seeking
False information metabolically starves. True information is rewarded. The system is designed to naturally converge on truth through distributed verification.

### Distributed, Not Centralized
No single point of control or failure. Nodes operate independently and communicate through shared substrate.

### Self-Improving
The system can generate new strategies, evaluate their effectiveness, and improve itself without external reprogramming.

### Auditable
Complete audit trail of all decisions. Every action is logged with rationale for transparency and accountability.

## Testing

Run all tests:
```bash
ctest --output-on-failure
```

Run specific test category:
```bash
ctest -L unit          # Unit tests only
ctest -L integration   # Integration tests only  
ctest -L system        # System tests only
```

## Performance

- **Build time**: ~5 seconds (incremental)
- **Test suite**: ~0.04-1 seconds depending on tests
- **Demo startup**: <100ms
- **Per-cycle overhead**: Minimal, scales with node count

## Safety

**Hardcoded Constraints:**
- Energy limits cannot be exceeded
- Strategy whitelist cannot be bypassed
- Alignment violations trigger monitoring
- Killswitch always available
- Execution timeout prevents infinite loops

**See [fungal/docs/SAFETY.md](fungal/docs/SAFETY.md) for detailed safety analysis.**

## Future Extensions

1. **Distributed Systems** - Multi-machine deployment
2. **GPU Acceleration** - CUDA/OpenCL neural acceleration
3. **Persistent Storage** - State serialization
4. **Web API** - REST endpoints for interaction
5. **Visualization** - Real-time network visualization
6. **Advanced Learning** - Evolutionary algorithms, reinforcement learning

## Citation

This system demonstrates bio-inspired autonomous reasoning with safety constraints, designed to be truth-seeking and self-improving while maintaining human oversight.

## License

Implementation and documentation provided as-is for educational and research purposes.

---

**Project Status:** Complete and ready for deployment  
**Documentation:** Comprehensive (7 files, 90KB)  
**Test Coverage:** Unit, Integration, and System tests passing  
**Last Updated:** August 4, 2026
