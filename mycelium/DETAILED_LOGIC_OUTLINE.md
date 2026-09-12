# Mycelium v2: Detailed Logic Flow Outline

Complete step-by-step guide to how Mycelium thinks and learns.

---

## 🎯 THE BIG PICTURE

```
You ask a question
    ↓
Mycelium walks through its knowledge
    ↓
Four learning systems score the answer
    ↓
System picks the best answer
    ↓
You say "yes" or "no"
    ↓
ALL FOUR SYSTEMS LEARN
    ↓
Next time is smarter
```

---

## 📖 COMPLETE PROCESS FLOW

### **STEP 1: YOU ASK A QUESTION**

**What you do:**
```
You type: "what is a dog?"
```

**What Mycelium does:**
- Takes your question
- Breaks it into important words: "dog"
- Looks for that word in its knowledge base
- Finds matching facts

**Simple example:**
```
Input: "what is a dog?"
Extracted: "dog"
Found nodes: 
  - "a small dog is loved"
  - "dog"
  - "the loved dog ran"
```

---

### **STEP 2: WALK THROUGH THE KNOWLEDGE GRAPH**

**What the knowledge graph looks like:**
```
Knowledge = Connected facts (nodes)

Facts in memory:
  [node 1] "a small dog"
         ↓ (connected by edge)
  [node 2] "dog is loved"
         ↓
  [node 3] "loved dog ran"
```

**What "walking" means:**
- Start at one fact
- Follow connections to next facts
- Build a chain: fact1 → fact2 → fact3 → fact4
- Keep going for 3-6 facts
- Stop when you have a good path

**Example walk:**
```
Start: "dog"
  ↓ follow connection
"the dog ran"
  ↓ follow connection
"dog runs fast"
  ↓ (stop here)

Path found: ["dog", "the dog ran", "dog runs fast"]
```

---

### **STEP 3: SCORE THE PATH WITH 4 LEARNING SYSTEMS**

This is where Mycelium gets intelligent. Four independent systems score the same path:

---

## 🧠 SYSTEM 1: REINFORCEMENT LEARNING (RL)

### What it does:
Learns which connections are good vs bad.

### How it works:

**First time:**
```
Initial Q-values (quality scores):
  "dog" → "runs" = 0.5 (neutral, don't know yet)
```

**After feedback:**
```
User says "yes, that's good!"

Mycelium updates:
  "dog" → "runs" = 0.85 (this connection is good!)
  
Math: Q ← Q + learning_rate × (reward + discount × future_Q - current_Q)
```

**Next time:**
```
When asked about "dog" again:
  Sees "dog" → "runs" has score 0.85
  Picks it (because it's high quality)
```

### What you need to know:
- **Q-value** = quality score for a connection (0.0 to 1.0)
- **High Q-value** = "this connection is good"
- **Low Q-value** = "this connection is bad"
- Updates automatically after you say yes/no

### Simple analogy:
```
Like learning: "Last time I took the highway, 
               I arrived on time (good!)"
Next time you take the highway more often.
```

---

## 📋 SYSTEM 2: RULE LEARNING

### What it does:
Discovers patterns and rules automatically.

### How it works:

**Example rule discovered:**
```
Rule: IF the input is about an animal
      THEN use exciting words like "runs", "loves", "flies"

How confident? 87% of the time this worked
               (success rate)
```

**Another example:**
```
Rule: IF the input is short (1-2 words)
      THEN generate a short answer

Confidence: 0.92 (92% of the time this is right)
```

**Learning process:**
```
Generation 1: Input "dog" → Output "dog runs fast"
              User: "yes!"
              → Create rule

Generation 2: Input "cat" → Output "cat jumps high"
              User: "yes!"
              → Rule matches again, confidence goes up

Generation 3: Input "table" → Output "table is solid"
              User: "no"
              → Rule doesn't match (not an animal), confidence stays same
```

### What you need to know:
- Rules are human-readable: "IF this THEN that"
- Confidence = how often the rule works
- Rules automatically get added/removed
- You can see every rule discovered

### Simple analogy:
```
Learning: "When people ask about animals, 
           they like exciting descriptions"
Next time: Apply that rule
```

---

## 🔗 SYSTEM 3: MARKOV CHAINS

### What it does:
Learns what words/facts usually follow each other.

### How it works:

**Simple example:**
```
Observations from training data:
  "dog" → "runs" (appears 12 times)
  "dog" → "sleeps" (appears 3 times)
  "dog" → "cloud" (appears 0 times)

Probability:
  P(runs | dog) = 12/15 = 0.80 (80% likely)
  P(sleeps | dog) = 3/15 = 0.20 (20% likely)
  P(cloud | dog) = 0/15 = 0% (never happens)
```

**Using it:**
```
When generating next word after "dog":
  "runs" has 80% probability → pick it!
```

**Entropy (predictability):**
```
If one word always follows another:
  Entropy = low (very predictable)
  Example: "peanut butter" always together
           Entropy: 0.1

If any word could follow:
  Entropy = high (unpredictable)
  Example: could be "dog runs", "dog sleeps", "dog eats"
           Entropy: 0.9
```

### What you need to know:
- Markov learns: "what usually follows what?"
- Probability = how often pattern appears
- Entropy = how predictable the sequence is
- Low entropy = good, predictable sequence

### Simple analogy:
```
Learning: "After 'dog', the word 'runs' appears 80% of the time"
Next time: Use that pattern
```

---

## 🌳 SYSTEM 4: DECISION TREES

### What it does:
Learns the best format for the answer.

### How it works:

**Decision tree structure:**
```
                Query length?
               /            \
            ≤ 5              > 5
            /                  \
      "short"            Format length?
                         /          \
                      ≤ 3            > 3
                      /                \
                  "tiny"          "long_form"
```

**Using the tree:**
```
New question: "dog" (4 characters)

Walk tree:
  Is 4 ≤ 5? YES → go left
  End at "short"
  → Generate short answer
```

**Learning from feedback:**
```
User asks "dog" (short)
System generates short answer
User: "yes, that's good!"
→ Add example to tree
→ Rebuild tree with new knowledge
```

### What you need to know:
- Decision tree learns: "for THIS type of input, use THIS format"
- Formats: "short", "medium", "long_form"
- Automatically builds from examples
- Can see the complete tree

### Simple analogy:
```
Learning: "Short questions need short answers"
Tree remembers: question_length → answer_format
```

---

## ⚖️ STEP 4: COMBINE THE 4 SCORES

### How it works:

**Each system gives a confidence score:**
```
RL says: 0.74 (edges are high quality)
Rules say: 0.68 (rules apply well)
Markov says: 0.72 (sequence is probable)
DT says: 0.85 (format is right)
```

**Weighted average:**
```
Final confidence = (0.74 × 0.40) +    (RL = 40%)
                   (0.72 × 0.30) +    (Markov = 30%)
                   (0.68 × 0.30)      (Rules = 30%)
                   
                 = 0.296 + 0.216 + 0.204
                 = 0.716
                 
Final confidence: 71.6%
```

**What confidence level means:**
```
0-40%   = Too uncertain, search web instead
40-75%  = Borderline, ask user "did this help?"
75-90%  = Pretty confident, use it
90%+    = Very confident, definitely use it
```

---

## 📤 STEP 5: RETURN ANSWER + REASONING

### What Mycelium shows you:

```
Question: "what is a dog?"
Generated text: "a small dog is loved"

Reasoning shown:
  ├─ RL confidence: 0.74 (edges averaged 0.74)
  ├─ Markov confidence: 0.72 (sequence probability)
  ├─ Rules applied: 2 (entity_type=animal, length=short)
  ├─ Format: long_form (DT confidence 0.92)
  └─ Overall: 0.72 (71% confident)
```

### What this means:
- You can see exactly why it chose this answer
- You can see which system contributed most
- You can disagree and give feedback

---

## 👤 STEP 6: YOU GIVE FEEDBACK

### What happens:

**You say "yes" (positive feedback):**
```
System learned:
  ✓ This path was good
  ✓ These edges are good
  ✓ This rule applied correctly
  ✓ This sequence is likely
```

**You say "no" (negative feedback):**
```
System learned:
  ✗ This path was bad
  ✗ These edges need lower scores
  ✗ This rule didn't apply
  ✗ This sequence is unlikely
```

**You say "maybe" (neutral feedback):**
```
System learned:
  ~ This path is okay but not great
  ~ Don't change scores much
  ~ Explore more variations
```

---

## 🎓 STEP 7: ALL 4 SYSTEMS LEARN

### This is the key difference from LLMs

**LLMs:**
```
Can't learn from feedback
Weights frozen after training
You're stuck with what you get
```

**Mycelium:**
```
Each system learns independently:

RL Learning:
  Update Q-value for each edge
  Q(src, dst) ← Q(src, dst) + α × reward
  (Happens in milliseconds)

Rule Learning:
  If rule applied: success count +1
  Recalculate confidence
  Prune if confidence < 0.5

Markov Learning:
  Record this path in transition table
  Update probability P(next | current)
  Recalculate entropy

Decision Tree Learning:
  Add example to training data
  Rebuild tree if 10+ new examples
  Update feature importance
```

---

## 📚 STEP 8: NEXT QUERY IS SMARTER

### What changed:

**Before your feedback:**
```
"dog" → Q-value unknown
Rules: no confidence
Markov: no pattern
Tree: no examples
```

**After your feedback:**
```
"dog" → Q-value increased 0.1
Rules: confidence +1 success
Markov: path recorded
Tree: example added
```

**Next time someone asks about dogs:**
```
RL picks better edges (higher Q-values)
Rules apply with higher confidence
Markov knows this sequence is likely
Tree formats answer better
→ Better answer overall!
```

---

## 🔄 THE COMPLETE CYCLE

```
┌─────────────────────────────────────────┐
│ 1. USER ASKS: "what is a dog?"          │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 2. WALK GRAPH: Find path                │
│    [dog] → [ran] → [fast]               │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 3. SCORE WITH 4 SYSTEMS                 │
│    RL: 0.74 | Rules: 0.68               │
│    Markov: 0.72 | DT: 0.85              │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 4. COMBINE: Final confidence 0.72       │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 5. RETURN: Answer + Full reasoning      │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 6. USER SAYS: "yes, that's good!"       │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 7. ALL 4 SYSTEMS UPDATE:                │
│    Q-values ↑                           │
│    Rule confidence ↑                    │
│    Markov transitions recorded          │
│    Tree examples added                  │
└──────────────┬──────────────────────────┘
               ↓
       Next query is smarter!
```

---

## 📊 DECISION POINTS (When Does It Ask You?)

### Q1: Should I ask for feedback?

```
IF confidence >= 0.75:
  → NO, use answer directly (you're sure enough)

ELIF confidence < 0.4:
  → NO, search the web instead (too unsure)

ELSE (0.4 - 0.75):
  → YES, ask "did this answer help?"
  (borderline, gather your signal)
```

### Q2: Should I use graph or web?

```
IF graph confidence >= 0.4:
  → Use graph answer (I know this)

ELSE:
  → Search Wikipedia
  → Extract facts
  → Ask user to validate
  → Add to graph if approved
```

### Q3: Should I learn automatically?

```
IF confidence >= 0.8 AND self_validation_passes:
  → YES, assume it's good and learn
  (high confidence, probably correct)

ELSE:
  → WAIT for user feedback
  (don't learn wrong things)
```

---

## 🎯 KEY CONCEPTS EXPLAINED

### Node
**What it is:** A fact or statement
```
Example nodes:
  "dog"
  "a small dog is loved"
  "dogs are loyal"
  "the dog ran fast"
```

**Why it matters:** Every node is a complete idea/fact

---

### Edge
**What it is:** A connection between two facts
```
Example edge:
  "dog" ──→ "runs"
  
This means: "runs" is related to "dog"
```

**Why it matters:** Edges have strength (Q-value)

---

### Q-Value
**What it is:** A quality score for an edge (0.0 to 1.0)
```
Q = 0.85 means: This edge is very good
Q = 0.5 means: This edge is neutral
Q = 0.1 means: This edge is bad
```

**Why it matters:** High Q-values are used first

---

### Confidence
**What it is:** System's belief in its answer (0% to 100%)
```
0%   = Complete guess
50%  = Could go either way
100% = Absolutely certain
```

**Why it matters:** You know how sure it is

---

### Path
**What it is:** A sequence of connected facts
```
Path example:
  ["dog", "the dog ran", "dog runs fast"]
  
Generated from this path:
  "dog the dog ran dog runs fast"
```

**Why it matters:** Path determines the answer

---

### Entropy
**What it is:** How predictable a sequence is
```
Entropy 0.1  = Very predictable
              Example: "peanut" → "butter" always
              
Entropy 0.9  = Very unpredictable
              Example: "dog" → could be anything
```

**Why it matters:** Low entropy = good sequence

---

### Rule
**What it is:** A pattern: IF condition THEN action
```
Example rule:
  IF input_type = animal
  THEN use_exciting_words = true
  
Confidence: 0.87 (87% of the time this works)
```

**Why it matters:** Rules boost confidence

---

### Markov Chain
**What it is:** Probability model for sequences
```
P(next | current):
  P("runs" | "dog") = 0.78
  P("sleeps" | "dog") = 0.15
  P("eats" | "dog") = 0.07
```

**Why it matters:** Predicts likely next words

---

### Decision Tree
**What it is:** A tree of decisions for format selection
```
        Input length?
       /            \
    short           long
    /                 \
"short_form"    "long_form"
```

**Why it matters:** Learns best answer format

---

## ⏱️ TIMING

### How long does each step take?

```
Step 1: Parse question       ~1ms
Step 2: Walk graph          ~10ms
Step 3: Score (4 systems)   ~5ms
Step 4: Combine scores      ~1ms
Step 5: Generate text       ~3ms
Step 6: Show reasoning      ~1ms
─────────────────────────────
TOTAL:                      ~21ms (about 1/50th of a second!)

vs LLM: 500-2000ms (25-100× slower)
```

---

## 🚀 SPEED VS ACCURACY

### Why Mycelium is fast:
```
No neural networks = no matrix multiplications
Direct path walking = simple lookups
Just 4 scoring systems = quick calculation
```

### Why accuracy improves:
```
More data = better Q-values
More feedback = better rules
More examples = better trees
Explicitly tracked = no hidden errors
```

---

## ✨ WHAT MAKES IT DIFFERENT

### vs LLMs:
```
LLM: Black box weights → hard to understand
Mycelium: Visible paths → easy to understand

LLM: Can't learn from feedback
Mycelium: Updates all 4 systems instantly

LLM: Makes up plausible answers
Mycelium: Only uses known facts or web sources

LLM: Can't edit what it knows
Mycelium: Edit facts directly
```

### vs Traditional Knowledge Graphs:
```
KG: Static facts (humans enter facts)
Mycelium: Dynamic learning (system learns patterns)

KG: Returns facts
Mycelium: Generates natural text

KG: No reasoning shown
Mycelium: Full reasoning visible
```

---

## 📋 CHECKLIST: What You Now Understand

- ✅ How questions are processed
- ✅ What graph walking means
- ✅ How RL learns edge quality
- ✅ How rules are discovered
- ✅ How Markov chains work
- ✅ How decision trees select format
- ✅ How 4 systems combine scores
- ✅ Why feedback matters
- ✅ How all 4 systems learn
- ✅ Why Mycelium is different

---

## 🎓 NEXT STEPS

If you want to understand more:

1. **FLOW_LOGIC.md** - Visual flowcharts (mermaid diagrams)
2. **README_V2.md** - Complete system documentation
3. **Run the code** - See it in action
4. **Provide feedback** - Watch it learn in real-time

---

**Mycelium v2: Where every decision is visible, every path is traceable, and every answer is explainable.**
