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

### Core System Documentation
- **[README.md](fungal/docs/README.md)** - Quick start and overview
- **[ARCHITECTURE.md](fungal/docs/ARCHITECTURE.md)** - Detailed system design and 6-segment architecture
- **[API.md](fungal/docs/API.md)** - Complete API reference for all components
- **[BUILDING.md](fungal/docs/BUILDING.md)** - Build instructions, dependencies, troubleshooting
- **[SAFETY.md](fungal/docs/SAFETY.md)** - Safety mechanisms, constraints, alignment, security analysis
- **[LEARNING.md](fungal/docs/LEARNING.md)** - How the system learns from experience
- **[EXAMPLES.md](fungal/docs/EXAMPLES.md)** - Practical usage examples

### Production Deployment Documentation
- **[PRODUCTION_DEPLOYMENT.md](fungal/docs/PRODUCTION_DEPLOYMENT.md)** - Complete deployment guide with installation, configuration, cluster setup, management tools
- **[PRODUCTION_API.md](fungal/docs/PRODUCTION_API.md)** - Full REST API reference with authentication, all endpoints, examples
- **[PRODUCTION_CONFIGURATION.md](fungal/docs/PRODUCTION_CONFIGURATION.md)** - Configuration reference with all options, examples for dev/staging/production
- **[PRODUCTION_MONITORING.md](fungal/docs/PRODUCTION_MONITORING.md)** - Monitoring, metrics, health checks, Prometheus integration, alerting
- **[PRODUCTION_SECURITY.md](fungal/docs/PRODUCTION_SECURITY.md)** - Security configuration, authentication methods, encryption, audit logging, incident response

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
│   ├── neural_integration.hpp    # Neural networks
│   └── production/               # Production modules (12 components)
│       ├── config_manager.hpp    # Configuration management
│       ├── logger.hpp            # Structured logging
│       ├── persistence.hpp       # State persistence
│       ├── api_server.hpp        # REST API server
│       ├── metrics.hpp           # Metrics collection
│       ├── health_check.hpp      # Health monitoring
│       ├── thread_pool.hpp       # Thread pool executor
│       ├── security.hpp          # Auth & encryption
│       ├── database.hpp          # Database persistence
│       ├── cluster_manager.hpp   # Clustering support
│       ├── backup_manager.hpp    # Backup/recovery
│       └── all_production.hpp    # Production coordinator
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
│   ├── main.cpp                  # Demo application
│   ├── tui_app.cpp               # Terminal UI
│   ├── simulation_mode.cpp       # Test simulation
│   └── production/               # Production executables & implementations
│       ├── main_server.cpp       # Production server
│       ├── main_cli.cpp          # CLI management tool
│       ├── main_dashboard.cpp    # Web dashboard
│       └── [12 module implementations]
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── system/                   # System tests
├── config.yaml.example           # Production configuration template
├── CMakeLists.txt                # Research/demo build
├── CMakeLists.txt.production     # Production build configuration
└── docs/                         # Documentation (12 files, 350KB)
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

## Production Deployment

The system includes **complete enterprise-grade production infrastructure**:

### 12 Production Modules
- **ConfigManager** - YAML/JSON configuration with environment overrides
- **Logger** - Structured logging with spdlog integration
- **Persistence** - State snapshots and recovery
- **APIServer** - REST API with request routing
- **Metrics** - Performance metrics with Prometheus export
- **HealthCheck** - System health monitoring and alerts
- **ThreadPool** - Concurrent task execution
- **Security** - Token/certificate authentication, encryption, audit logging
- **Database** - SQL query execution, transactions, migrations
- **ClusterManager** - Distributed deployment with consensus
- **BackupManager** - Automated backup/restore with verification
- **ProductionSystem** - Master coordinator

### 3 Executables
- **fungal-server** - Production server with graceful shutdown
- **fungal-cli** - CLI management and monitoring tool
- **fungal-dashboard** - Web dashboard backend with REST API

### Production-Ready Features
- ✅ Configuration management (development/staging/production)
- ✅ High-availability clustering with Raft consensus
- ✅ Automated backups with point-in-time recovery
- ✅ Token-based authentication and RBAC
- ✅ End-to-end encryption (TLS/AES)
- ✅ Complete audit trail and compliance logging
- ✅ Health checks and liveness probes
- ✅ Prometheus metrics and Grafana dashboards
- ✅ Multi-database support (SQLite, PostgreSQL, MySQL)
- ✅ Thread pool for concurrent operations
- ✅ Graceful shutdown and recovery

**For deployment:** See [PRODUCTION_DEPLOYMENT.md](fungal/docs/PRODUCTION_DEPLOYMENT.md)

## Future Extensions

1. **GPU Acceleration** - CUDA/OpenCL neural acceleration
2. **Advanced Learning** - Evolutionary algorithms, reinforcement learning
3. **Multi-GPU** - Distributed neural processing
4. **Kubernetes** - Native Kubernetes operator
5. **Service Mesh** - Istio integration for observability

## Citation

This system demonstrates bio-inspired autonomous reasoning with safety constraints, designed to be truth-seeking and self-improving while maintaining human oversight.

## License

Implementation and documentation provided as-is for educational and research purposes.

---

**Project Status:** Production-ready with complete enterprise infrastructure  
**Core System:** 11 architectural components + hardware awareness  
**Production Modules:** 12 enterprise components (configuration, logging, clustering, security, etc.)  
**Documentation:** Comprehensive (12 files, 350KB total)  
  - Core: Architecture, API, Building, Safety, Learning, Examples  
  - Production: Deployment, API, Configuration, Monitoring, Security  
**Test Coverage:** Unit, Integration, and System tests passing  
**Interaction:** Demo app, Terminal UI, Simulation mode, Production server, CLI tool  
**Last Updated:** August 4, 2026
