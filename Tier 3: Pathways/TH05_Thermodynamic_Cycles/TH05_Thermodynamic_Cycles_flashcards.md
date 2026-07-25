# TH05: Thermodynamic Cycles - Quick Reference Flashcards

## Flashcard ID: 1
### What are the five essential elements of a thermodynamic cycle?

1) **Working fluid** (steam or gas)
2) **Engine** (turbine or piston) to convert heat to work
3) **Heat source** (reactor/boiler)
4) **Heat sink** (condenser/cooling)
5) **Device to move fluid** (pump/compressor)

---

## Flashcard ID: 2
### What is the difference between a thermodynamic process and a thermodynamic cycle?

**Process**: A change of state in one direction
**Cycle**: A series of processes that returns the working fluid to its initial state, forming a closed loop used for continuous energy conversion

---

## Flashcard ID: 3
### How is thermodynamic cycle efficiency defined?

```
Cycle efficiency (η) = Net work produced / Heat supplied
η = (Q_added - Q_rejected) / Q_added
```
Expressed as a percentage, it represents the portion of heat energy converted to useful work.

---

## Flashcard ID: 4
### Describe the Carnot cycle and why it matters to power plant design

The **Carnot cycle** is an ideal cycle with the highest possible thermal efficiency for an engine operating between two constant temperature reservoirs. It consists of:
- Two isothermal processes
- Two adiabatic processes

**Why it matters**: The Carnot efficiency sets the theoretical maximum that real cycles can approach but never reach.

---

## Flashcard ID: 5
### Calculate the Carnot efficiency when a heat engine receives heat at 540°F and rejects heat at 60°F

**Convert to absolute temperature (Rankine):**
- T_hot = 540 + 460 = 1000°R
- T_cold = 60 + 460 = 520°R

**Calculate:**
```
η = (T_hot - T_cold) / T_hot
η = (1000 - 520) / 1000
η = 480 / 1000 = 48.0%
```

---

## Flashcard ID: 6
### How does the Second Law of Thermodynamics impact power plant design and operation?

The Second Law requires that **some heat must be rejected** for any cycle to operate.

**Design impacts:**
- Real processes are irreversible and generate entropy
- Increase temperature difference between heat source and sink to improve efficiency
- Minimize losses through maintenance and proper operation

**Operational focus:**
- Minimize auxiliary equipment operation
- Fix steam leaks immediately
- Maintain condenser vacuum
- Optimize all efficiency factors

---

## Flashcard ID: 7
### What are the key differences between the Rankine cycle and the Carnot cycle?

| Aspect | Rankine | Carnot |
|--------|---------|--------|
| **Heat transfer** | Constant pressure (isobaric) | Constant temperature (isothermal) |
| **Practicality** | Achievable in real plants | Theoretical only |
| **Analysis** | Uses steam tables | T-s diagrams |
| **Efficiency** | Lower than Carnot | Highest theoretical |

**Key insight**: Rankine is practical; efficiency is lower but achievable in actual equipment.

---

## Flashcard ID: 8A
### How does superheating steam affect Rankine cycle efficiency?

**Effect**: **Superheating increases efficiency**

**Why:**
- Increases enthalpy of steam entering turbine (more heat added)
- Heat rejected also increases, BUT...
- Increase in turbine work output is **greater** than increase in heat rejection
- **Result: Improved overall cycle efficiency** (typically 2-5% per 100°F superheat)

---

## Flashcard ID: 8B
### What is the primary function of a Moisture Separator/Reheater (MSR) in power plants?

**Primary Purpose**: **Protect turbine from water droplet erosion damage**

**How it works:**
- Removes moisture from steam exiting high-pressure turbine
- Reheats steam before entering low-pressure turbine

**Efficiency effect**: Minor (0-1%) — not the primary efficiency driver
**Secondary benefit**: Slightly increases turbine work output

---

## Flashcard ID: 8C
### How does feedwater heating affect cycle efficiency?

**Effect**: **Feedwater heating increases efficiency**

**Process:**
1. Extraction steam from turbine preheats condensate
2. Decreases heat that must be added (reactor supplies less heat)
3. Decreases heat rejected (condenser rejects less heat)

**Why efficient**: Reduction in heat added is **greater** than loss of turbine work

**Result**: Cycle efficiency increases by 1-3% per heater (typical 5-8 heaters = 5-15% total gain)

---

## Flashcard ID: 8D
### How does improving condenser vacuum affect Rankine cycle efficiency?

**Effect**: **Better vacuum increases efficiency**

**Why:**
- Lower absolute pressure → Lower saturation temperature
- More work extracted from turbine (larger pressure differential)
- Less heat rejected (lower temperature)
- Both effects increase cycle efficiency

**Improvement rate**: Approximately **0.5-1.0% efficiency gain per inch of mercury vacuum improvement**

---

## Flashcard ID: 8E
### Define condensate depression (condensate subcooling) and its effect on efficiency

**Definition**: Condensate depression = Saturation temperature at condenser pressure - Actual hotwell temperature

**Numerical example:**
- At 1 psia absolute: Saturation temp ≈ 102°F
- Hotwell temperature: 96°F
- Depression = 102°F - 96°F = 6°F

**Effect on efficiency**: **Increasing depression DECREASES efficiency**
- Additional heat must be supplied to reheat subcooled condensate
- Waste energy that doesn't produce work

**Optimal range**: 3-15°F (minimize condensate depression for best efficiency)

---

## Flashcard ID: 8F
### How does increasing steam temperature and pressure affect Rankine cycle efficiency?

**Effect of higher temperature**: **Increases efficiency**
- Raises the temperature at which heat is added
- Gets closer to theoretical Carnot ideal
- Improvement: ~1-2% per 100°F temperature increase

**Effect of higher pressure**: **Increases efficiency**
- Increases differential pressure across turbine
- More turbine work extracted
- Improvement: ~0.5-1.5% per 500 psia pressure increase

**Limitations**: Material strength limits (~3500 psia, ~1100°F for modern equipment)

---

## Flashcard ID: 8G
### How does decreased steam quality (higher moisture content) affect Rankine cycle efficiency?

**Effect**: **Lower quality DECREASES efficiency**

**Why:**
- Wet steam has lower enthalpy than dry steam
- Less work available from turbine (lower inlet enthalpy)
- Blade erosion increases turbine losses

**Typical minimum acceptable quality**: 95-99%
- Prevents excessive blade damage
- Protects turbine life and reliability

**Impact**: Each 1% decrease in quality ≈ 0.5-1% efficiency loss

---

## Flashcard ID: 9
### Define condensate depression with a numerical example

**Definition**: Temperature difference between saturation temperature at condenser pressure and actual hotwell temperature

**Numerical Example:**

At **1 psia absolute** (typical condenser pressure):
- **Saturation temperature** (from steam tables): 102°F
- **Actual hotwell temperature** (measured): 96°F
- **Condensate depression** = 102°F - 96°F = **6°F**

This means the condensate is 6 degrees below saturation—it's subcooled.

---

## Flashcard ID: 10
### List five operational methods to maintain unit efficiency

1. **Minimize auxiliary equipment operation** — Run only necessary systems for current power output
2. **Minimize steam generator blowdown** — Balance purity with minimal heat loss
3. **Fix steam leaks immediately** — Every leak removes energy from the cycle
4. **Eliminate air leaks into condenser** — Air prevents heat transfer, increases saturation temp
5. **Operate heat recovery systems** — Air ejector, gland seal, blowdown heat exchangers maximize efficiency recovery

---

## Flashcard ID: 11
### How do operators monitor and assess plant efficiency?

**Method**: Operators compare two parameters:
- **Electrical generator output** (proportional to turbine work)
- **Reactor power output** (proportional to heat supplied)

**Metric used**: **Heat Rate** (BTU/kW-hr) — inverse of efficiency

**Formula**:
```
Heat Rate = Reactor Power (MW-th) × 3412 / Electrical Output (MW-e)
```

**What it indicates:**
- **Increasing heat rate** → Efficiency decreasing (investigate)
- **Decreasing heat rate** → Efficiency improving (improvements working)
- **Benchmarks:**
  - Best performance: 8,200-8,400 BTU/kW-hr (40-41% efficiency)
  - Needs maintenance: >9,500 BTU/kW-hr (<36% efficiency)

**Typical investigation points:**
- Check condenser vacuum
- Inspect for steam leaks
- Verify feedwater temperature
- Check turbine inlet steam conditions

---

**End of TH05 Flashcards**

*Simple, memorable answers aligned with 10 enabling objectives*
*Use for quick reference and exam preparation*
