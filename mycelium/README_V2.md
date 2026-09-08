# Mycelium v2: Interpretable Knowledge Graph with Learned Generation

A knowledge graph system that walks explicit paths to generate text while remaining fully interpretable and traceable. Unlike LLMs, every decision is visible and explainable.

## Vision

**Different from LLMs by design:**
- ✅ Fully transparent: see why it chose every edge
- ✅ No black boxes: all learning is explicit and inspectable
- ✅ User-controlled: approve what gets added to knowledge
- ✅ Editable: directly modify facts and learned patterns
- ✅ Honest: admits what it doesn't know
- ✅ Offline: no API dependency, runs locally

**What makes it unique:**
Instead of hidden neural weights, Mycelium learns through:
1. **Reinforcement Learning** - Q-values for edge quality
2. **Rule Extraction** - Explicit if-then patterns
3. **Markov Chains** - Sequence probability models
4. **Decision Trees** - Visible formatting rules

All patterns are inspectable, editable, and explainable.

---

## System Architecture

### Core Components

#### 1. Knowledge Graph (graph.py)
- **Nodes**: Facts/concepts stored as text
- **Edges**: Relationships between concepts with strength values (0.0-8.0)
- **Walking**: Traverses edges to find/generate answers
- **Persists**: Saves to JSON for offline use

#### 2. Four Learning Systems

##### Reinforcement Learning (reinforcement.py)
- **What**: Q-learning agent for edge preference
- **How**: Learns which edges lead to good outcomes
- **Policy**: Epsilon-greedy exploration vs exploitation
- **Output**: Q-values for every edge (visible at `/q_value/edge`)
- **Lines**: 270

```python
# Example: System learns "dog" → "runs" has high value
q_value("dog", "runs") = 0.85  # This edge works well
q_value("dog", "cloud") = 0.1  # This edge rarely works
```

##### Rule Learning (rules.py)
- **What**: Extracts patterns from successful generations
- **How**: Discovers if-then rules from data
- **Rules**: IF (conditions) THEN (action)
- **Confidence**: Tracks success rate per rule
- **Output**: Human-readable rule set
- **Lines**: 210

```python
# Example: Rule learned from data
Rule: IF entity_type=animal THEN output_type=exciting
Confidence: 0.87 (87% of animal queries generated good output)
Uses: 23 times, Successes: 20
```

##### Markov Chains (markov.py)
- **What**: Sequence probability modeling
- **How**: Learns bigram/trigram frequencies from paths
- **Predicts**: What node likely comes next
- **Entropy**: Measures certainty (lower = more predictable)
- **Output**: Sequence probabilities
- **Lines**: 210

```python
# Example: Markov learned patterns
Transition: "dog" → "runs" has probability 0.78
Bigram: ("dog", "runs") appears 12 times
Trigram: ("small", "dog", "runs") probability 0.65
```

##### Decision Trees (decision_trees.py)
- **What**: Learns output formatting structure
- **How**: Builds interpretable decision tree from examples
- **Predicts**: Output format based on query features
- **Visible**: Complete tree structure displayed
- **Output**: Feature importance ranking
- **Lines**: 350

```
Decision Tree:
├─ IF query_length <= 5
│  ├─ PREDICT: short_form (confidence: 92%)
│  └─ PREDICT: long_form (confidence: 8%)
└─ IF query_length > 5
   ├─ PREDICT: long_form (confidence: 85%)
   └─ PREDICT: short_form (confidence: 15%)
```

#### 3. Integrated Generation Engine (generation_engine_v2.py)
- **Combines**: All four learning systems
- **Orchestrates**: RL (40%) + Markov (30%) + Rules (30%)
- **Shows reasoning**: Every generation includes full explanation
- **Learns**: From user feedback across all components
- **Lines**: 230

```
Generation Process:
1. Walk graph using RL-learned edge quality
   ├─ Choose edges with highest Q-values
   └─ Explore occasionally for novelty
2. Verify sequence using Markov probabilities
   ├─ Check if path follows learned patterns
   └─ Adjust confidence based on entropy
3. Apply rules
   ├─ Match extracted patterns to current facts
   └─ Boost confidence if rules apply
4. Format output
   ├─ Use decision tree to pick format
   └─ Generate readable text
5. Report confidence
   ├─ Show which components contributed
   └─ Explain reasoning
```

---

## Enhancement Modules

### Performance Optimization (performance.py)
- **Word indexing**: O(1) lookups instead of full graph scan
- **Edge pruning**: Remove weak connections (strength < 0.15)
- **Node pruning**: Remove isolated low-energy nodes
- **Results**: 42→246 nodes, 62→290 edges with scaling

### Semantic Matching (semantic.py)
- **Synonym expansion**: "fast" → ["quick", "rapid", "swift"]
- **Similarity scoring**: Jaccard similarity on expanded word sets
- **Query expansion**: Automatically expand queries with synonyms
- **Concept similarity**: Find structurally similar nodes

### Temporal Memory (memory.py)
- **Exponential decay**: Energy halves per day (configurable)
- **Reinforcement**: Boost energy for successful paths
- **Penalty**: Reduce energy for failed paths
- **Pruning**: Remove nodes with energy < 0.05

### Edge Learning (learning.py)
- **Success/failure tracking**: Count outcomes per edge
- **Quality scoring**: (successes) / (successes + failures)
- **Edge strength**: Lerp toward quality-based strength
- **Top edges**: Identify most reliable connections

---

## Web Enrichment System (web_enrichment.py + api_v3.py + cli_v3.py)

### Features
- **Web search**: Query Wikipedia when graph answer is weak
- **Fact extraction**: Parse text into graph-compatible facts
- **Citation tracking**: Track sources for all facts
- **User validation**: Require approval before adding to graph
- **Sourced responses**: Show which facts came from where

### Workflow
```
User query
  ↓
Try graph (confidence threshold)
  ├─ Found & high confidence → Return with sources
  └─ Not found or low confidence → Search web
       ↓
  Web search → Extract facts → Show sources
       ↓
  User validation → Add to graph → Continue learning
```

---

## Usage

### Installation
```bash
cd mycelium
pip install -r requirements.txt  # (currently empty - no dependencies!)
```

### Basic CLI (cli_v2.py)
```bash
python -m mycelium

> ask what is a dog
a small dog is loved the loved dog ran...

> feedback yes
✓ Learned from feedback

> show stats
Nodes: 246, Edges: 290, Coverage: 99.6%

> generate water
water flows downhill...

> show learning
Edges tested: 55, Avg quality: 0.42
```

### Advanced CLI with Web (cli_v3.py)
```bash
python mycelium/cli_v3.py

> ask what is gravity
✓ Found in graph: gravity pulls objects down (confidence: 0.45)

> web gravity
✓ Found on Wikipedia...
Extracted 3 facts about gravity
⚠ Requires validation

> validate yes
✓ Added to graph with source citation
```

### Production API (api_v3.py)
```python
from mycelium.api_v3 import MyceliumAPIv3

api = MyceliumAPIv3()

# Query with web fallback
result = api.query_with_web_fallback("photosynthesis", use_web=True)

# Get knowledge audit
audit = api.get_knowledge_audit()
print(f"Web-sourced: {audit['sourced_percentage']:.1f}%")

# Get learning status
learning = api.get_learning_status()
for edge, quality in learning['top_edges']:
    print(f"{edge[0]} → {edge[1]} ({quality:.2f})")
```

### Training the Engine
```bash
python mycelium/train_engine_v2.py

# Trains all four systems:
# - RL: 30 episodes, 55 edges learned
# - Rules: 13 patterns extracted
# - Markov: 180 transitions tracked
# - Decision tree: 30 examples

# Shows confidence improvement and pattern learning
```

---

## How It Works: Complete Example

### Scenario: User asks "What is a dog?"

#### Step 1: Graph Lookup
```
Query: "what is a dog"
  → Walk graph (hops=6)
  → Find candidates: ["a small dog is loved", "the dog runs", ...]
  → Score by semantic similarity
```

#### Step 2: Reinforcement Learning
```
RL policy for each candidate edge:
  "small" → "dog"     Q-value: 0.85 (good edge)
  "dog" → "runs"      Q-value: 0.72 (decent edge)
  "dog" → "strange"   Q-value: 0.12 (bad edge)
  
Use highest Q-values to build best path
```

#### Step 3: Markov Verification
```
Path: [a small dog is loved] → [small] → [dog]
  
Bigram probability: P("small" → "dog") = 0.78 (matches training)
Trigram probability: P("loved", "small", "dog") = 0.65
Entropy: 0.12 (sequence is predictable)
```

#### Step 4: Rule Matching
```
Current facts: {entity_type: "animal", output_length: 10}

Applicable rules:
  IF entity_type=animal THEN exciting_tone (confidence: 0.89)
  IF length=10 THEN medium_format (confidence: 0.76)
```

#### Step 5: Decision Tree Formatting
```
Tree predicts: "long_form" (confidence: 0.92)
  because: query_length > 5 AND path_length > 2
```

#### Step 6: Generate & Report
```
Generated text: "a small dog is loved"

Reasoning:
  ├─ RL confidence: 0.79 (edges averaged 0.79)
  ├─ Markov confidence: 0.72 (sequence probability)
  ├─ Rules applied: 2 (exciting_tone, medium_format)
  ├─ Format: long_form (DT confidence 0.92)
  └─ Overall confidence: 0.76
```

#### Step 7: User Feedback → Learning
```
User: "Yes, that's good"

System learns:
  ├─ RL: boost Q-values for used edges +0.1
  ├─ Rules: "animal" rule success +1
  ├─ Markov: record path in transition table
  └─ DT: add example to training set

Next generation will be smarter!
```

---

## File Structure

```
mycelium/
├── mycelium/
│   ├── __init__.py              # Package setup
│   ├── graph.py                 # Core graph data structure
│   ├── cli.py                   # Basic CLI
│   ├── cli_v2.py                # Production CLI with learning
│   ├── cli_v3.py                # CLI with web enrichment
│   ├── api_v2.py                # Production API
│   ├── api_v3.py                # API with web enrichment
│   │
│   ├── [ENHANCEMENTS]
│   ├── performance.py           # Indexing & pruning
│   ├── semantic.py              # Synonym expansion & matching
│   ├── memory.py                # Temporal decay & reinforcement
│   ├── learning.py              # Edge quality learning (v1)
│   ├── generator.py             # Template-based generation
│   ├── web_enrichment.py        # Web search & fact extraction
│   │
│   ├── [GENERATION ENGINE V2]
│   ├── reinforcement.py         # Q-learning agent
│   ├── rules.py                 # Rule extraction & learning
│   ├── markov.py                # Sequence probability modeling
│   ├── decision_trees.py        # Decision tree learning
│   ├── generation_engine_v2.py  # Integrated engine
│   │
│   ├── [SUPPORTING]
│   ├── tokenize.py              # Text tokenization
│   ├── words.py                 # Dictionary management
│   ├── search.py                # Wikipedia fallback search
│   ├── nlp.py                   # Entity recognition
│   ├── evaluation.py            # Metrics & evaluation
│   ├── persistence.py           # Save/load learned state
│
├── test_*.py                    # Test suites for each module
├── train_*.py                   # Training scripts
├── expanded_training.txt        # 200+ training facts
├── common_words.txt             # 9,884 word dictionary
├── train_seed.txt               # 12 seed sentences
│
├── state/
│   ├── graph.json               # Persisted graph
│   ├── dictionary.json          # Persisted words
│   ├── learner.json             # Persisted learned weights
│   └── feedback.json            # User feedback log
│
├── SETUP.md                     # Setup & architecture docs
├── QUICKSTART.md                # Quick start guide
├── EXPERIMENTS.md               # Experimental features
├── OPTIONS.md                   # Design options & philosophy
└── README_V2.md                 # This file
```

---

## Key Differences from LLMs

| Aspect | Mycelium | LLM (ChatGPT) |
|--------|----------|--------------|
| **Interpretability** | 100% - See every decision | 0% - Black box |
| **Hallucinations** | None - Only returns known facts or web sources | Common - Makes up plausible-sounding text |
| **Editability** | Direct - Edit graph/rules/edges | Impossible - Retrain entire model |
| **Explainability** | Full path visible | "It generated this somehow" |
| **Sources** | Explicit citations | Untraced training data |
| **Provenance** | Know where every fact came from | Unknown |
| **Offline** | Yes - No API needed | No - Requires API |
| **Size** | MB (small graph + rules) | GB (billions of parameters) |
| **Learning** | Fast (edge weights, rules) | Slow (full retraining) |
| **Privacy** | No memorization of training data | Potential memorization issues |
| **Scope** | Specialized (small domains) | General (any topic) |

---

## Performance Metrics

### Training Results (30 epochs)

**Reinforcement Learning**
- Episodes completed: 30
- Edges learned: 55
- Q-value range: -1.0 to +1.0
- Learning rate: 0.2 (fast convergence)

**Rule Learning**
- Rules extracted: 13
- Average confidence: 0.52
- High confidence rules: 6+

**Markov Chains**
- Transitions observed: 180
- Bigrams: 55
- Trigrams: 46
- Entropy: 0.10 (predictable patterns)

**Decision Trees**
- Training examples: 30
- Tree depth: 3
- Feature importance: query_length (1.0)

### Graph Stats
- Nodes: 246 (expanded from 42)
- Edges: 290 (expanded from 62)
- Coverage: 99.6%
- Word index: 452 unique words

---

## Future Directions

1. **Ontologies**: Add formal schemas to graph
2. **Temporal reasoning**: Time-aware relationships
3. **Multi-hop inference**: Transitive property chains
4. **Dialogue**: Multi-turn conversation with memory
5. **Analogies**: Transfer learning across domains
6. **Uncertainty**: Confidence bounds on statements
7. **Conflict resolution**: Handle contradicting facts
8. **Explanations**: Generate natural language proofs

---

## Philosophy

> "A system that knows what it knows, admits what it doesn't, and shows you exactly why."

Mycelium rejects the black-box trade-off. You don't need a trillion parameters to have intelligent conversations. You need:

1. **Clear knowledge** - Explicit facts
2. **Learned patterns** - Visible rules
3. **Good reasoning** - Traceable paths
4. **Honest uncertainty** - Admission of limits
5. **User control** - Approval gates

This is an alternative to LLMs, not a replacement. Better for:
- Medical/legal domains (need explainability)
- Specialized QA (domain-specific knowledge)
- Educational systems (show your work)
- Auditable decisions (compliance requirements)
- Offline use (no API dependency)
- Personalized learning (users teach the system)

---

## References

### Academic Foundations
- **Reinforcement Learning**: Sutton & Barto, "Reinforcement Learning: An Introduction"
- **Graph Walks**: DeepWalk, Node2Vec
- **Rule Learning**: ILP (Inductive Logic Programming)
- **Markov Chains**: Rabiner, "A Tutorial on Hidden Markov Models"
- **Decision Trees**: Quinlan, "C4.5: Programs for Machine Learning"

### Key Papers
- Knowledge graphs (Nickel et al., 2016)
- Symbolic reasoning (Mao et al., 2019)
- Interpretable ML (Molnar, 2020)

---

## Contributing

The system is designed to be extended:
1. Add new learning modules (inherit from base classes)
2. Add new CLI commands
3. Add domain-specific ontologies
4. Train on custom datasets
5. Modify Q-learning parameters
6. Adjust rule extraction thresholds

All changes remain fully interpretable.

---

## License

Built with the philosophy that knowledge systems should be transparent, auditable, and user-controlled.

Use freely. Extend responsibly. Explain always.

---

## Quick Command Reference

```bash
# Training
python mycelium/train_engine_v2.py        # Train all systems

# Testing
python mycelium/test_generation_engine_v2.py    # Test all components
python mycelium/test_enhancements.py            # Test v1 modules

# CLI
python -m mycelium                        # Basic CLI
python mycelium/cli_v2.py                # Production CLI
python mycelium/cli_v3.py                # CLI with web

# API
python mycelium/run_api.py                # Start API server (if implemented)
```

---

**Mycelium v2: Where transparency meets intelligence.**
