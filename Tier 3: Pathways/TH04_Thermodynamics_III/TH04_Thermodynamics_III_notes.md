# TH04_Thermodynamics_III - Comprehensive Study Notes

---
id: 15
section: 'THERMODYNAMIC PROCESSES - FUNDAMENTAL TYPES:'
objective: null
---
Definition: A thermodynamic process is a change in the state of a system as it goes from an initial condition to a final condition.

Processes are characterized by what remains constant or what constraints are applied.

ADIABATIC PROCESS:
Definition: Process with NO heat transfer between system and surroundings (Q = 0).
Mechanism:
• System perfectly insulated by adiabatic boundary
• No thermal pathway for heat flow
• All energy change must be through work

Mathematical Form (First Law):
Q - W = ΔU
0 - W = ΔU
W = -ΔU (or ΔU = -W)

Meaning:
Work done BY system equals decrease in internal energy
Work done ON system equals increase in internal energy

Why Adiabatic Appears in Power Systems:
• Turbine expansion: Very fast process, insufficient time for heat transfer
• Pump/compressor: Usually operated adiabatic (no cooling/heating during operation)
• Thermal insulation: System with good insulation approximates adiabatic
• Pressure vessel: Isolated system behaves adiabatic

Example - Adiabatic Expansion in Turbine:
• Steam enters at 1400 psia, 1000°F (h₁ = 1509.2 Btu/lbm)
• Expands adiabatically to 1 psia
• No heat added during expansion (Q = 0)
• Work extracted = change in internal energy
• Exit quality would be ~85% (theoretical isentropic)

ISOBARIC PROCESS:
Definition: Process at CONSTANT PRESSURE (P = constant).
Mechanism:
• System boundary free to move (piston can move up/down)
• Pressure inside equals outside pressure (no net force)
• Allows expansion (increased volume) or contraction (decreased volume)
• Temperature and volume may change, but pressure constant

Mathematical Form (First Law):
Q - W = ΔU
For isobaric process, all energy change from heat: Q = ΔH (Enthalpy change)

Why: Work W = P × ΔV is included in enthalpy definition, so:
Q = ΔU + P × ΔV = ΔH

Practical Importance for Open Systems:
Energy balance simplifies: Q = m × Δh
Don't need to separate work and internal energy - all in enthalpy

Common Power System Processes:
1. BOILER: Isobaric heat addition
   • Constant pressure in boiler (same inlet and outlet pressure)
   • Heat added raises enthalpy
   • Q_boiler = ṁ × (h_out - h_in)
   • Example: P = 100 psia throughout, steam generated from liquid to superheated

2. CONDENSER: Isobaric heat rejection
   • Constant pressure in condenser (same inlet and outlet pressure)
   • Heat removed lowers enthalpy
   • Q_condenser = ṁ × (h_in - h_out)
   • Example: P = 1 psia throughout, steam condensed from vapor to liquid

3. PIPING: Isobaric expansion
   • Steam flowing through pipe at approximately constant pressure
   • Friction may cause slight pressure drop, but small
   • Heating or cooling changes enthalpy

Example - Isobaric Heating in Boiler:
• Inlet: Liquid water at 100 psia, 300°F (h₁ = 276.0 Btu/lbm)
• Outlet: Superheated steam at 100 psia, 400°F (h₂ = 1227.5 Btu/lbm)
• Heat per lbm: Q = 1227.5 - 276.0 = 951.5 Btu/lbm
• For 100 lbm/s: Total heat = 95,150 Btu/s = 134.9 MW

ISENTROPIC PROCESS (REVERSIBLE ADIABATIC):
Definition: Process with CONSTANT ENTROPY (S = constant) AND NO HEAT TRANSFER (Q = 0).
Alternative Name: Reversible adiabatic process

Mechanism:
• Adiabatic: No heat transfer (Q = 0)
• Reversible: No friction, perfectly efficient conversion
• Together: System can return to initial state by reversing the process

Characteristics:
• Theoretical ideal - never achieved in practice
• All irreversibilities removed (friction, turbulence, noise)
• Entropy constant: dS = 0
• Used as benchmark for comparing real processes

Mathematical Form:
For isentropic: S₁ = S₂
From steam tables: s₁ = s₂ (specific entropy same at both states)

Real vs. Ideal Turbine:
IDEAL (Isentropic):
• No friction inside turbine
• All steam energy converted to work
• Exit entropy = inlet entropy
• Ideal work = ṁ × (h₁ - h₂s)

REAL (Actual):
• Friction from blade interactions, steam leakage, turbulence
• Some energy lost as heat (friction heating) and noise
• Exit entropy > inlet entropy (entropy increases due to irreversibilities)
• Actual work < ideal work
• Turbine efficiency: η = Actual work / Ideal work = (h₁-h₂) / (h₁-h₂s)

Practical Example - Turbine Expansion:
Ideal isentropic expansion:
• Inlet: 1000 psia, 1000°F, h₁ = 1509.2 Btu/lbm, s₁ = 1.6305 Btu/(lbm·°R)
• Exit pressure: 1 psia
• Find state where P = 1 psia AND s = 1.6305 Btu/(lbm·°R)
• At 1 psia: s₂s = 1.6305 corresponds to quality x ≈ 0.847 (84.7% vapor)
• h₂s ≈ 1070 Btu/lbm (from steam tables, interpolating with quality)
• Ideal work: W_s = 1509.2 - 1070 = 439.2 Btu/lbm

Real expansion with 85% isentropic efficiency:
• Actual work: W_actual = 0.85 × 439.2 = 373.3 Btu/lbm
• Actual exit enthalpy: h₂ = 1509.2 - 373.3 = 1135.9 Btu/lbm
• Actual exit quality x ≈ 0.915 (91.5% vapor, more moisture than ideal)
• This shows real turbines exit wetter than ideal (blade erosion risk)

ISENTHALPIC PROCESS (THROTTLING):
Definition: Process at CONSTANT ENTHALPY (H = constant) - specifically h₁ = h₂.
Alternative Name: Throttling process

Mechanism:
• No work done by system (W = 0)
• No heat transfer (Q = 0) approximately (valve insulated)
• First law: Q - W = ΔH → 0 - 0 = ΔH → ΔH = 0
• Pressure drops due to flow restriction/friction

Physical Process:
Fluid flows through restriction (partially-open valve, orifice, metering device)
• Upstream pressure P₁ > Downstream pressure P₂
• Fluid does flow work entering (uses energy)
• Fluid receives flow work exiting (gains energy)
• These balance out → net enthalpy constant

Characteristics:
• Entropy increases: S₂ > S₁ (irreversible process)
• Temperature may decrease (if wet steam) or increase (if gas)
• No work is performed
• Commonly occurs in real systems with restrictions

Applications in Power Plants:
1. PRESSURE REDUCING VALVE (PRV): Reduces steam pressure for auxiliary systems
   • Inlet: High pressure steam
   • Outlet: Lower pressure, approximately same enthalpy
   • h_inlet = h_outlet (approximately)
   • Quality increases (becomes drier) or superheat increases

2. ORIFICE: Flow measurement restriction
   • Creates pressure drop across opening
   • Enthalpy conserved through restriction
   • Pressure difference indicates flow rate

3. THROTTLE VALVE: Emergency flow control
   • Operator partially closes valve for flow reduction
   • Process is isenthalpic
   • Pressure drops, quality increases

4. NORMAL VALVE OPERATION: Partial opening creates throttling
   • Steam pressure reduced as it passes through restriction
   • Enthalpy approximately constant
   • Entropy increases (energy dissipation as turbulence/noise)

FINDING DOWNSTREAM STATE AFTER THROTTLING:

Given:
• Inlet state (P₁, T₁) - find h₁ from steam tables
• Outlet pressure P₂
• Constant enthalpy: h₂ = h₁

Required: Find outlet state (P₂, h₁) with h₁ known

Procedure:
1. Look up h₁ at inlet conditions
2. At outlet pressure P₂, go to saturation table
   • Get hf and hg (sat liquid and sat vapor enthalpy @ P₂)
3. Compare h₁ to hf and hg:

Case 1: h₁ < hf @ P₂
→ Outlet is subcooled liquid (compressed liquid)
→ Find T where h = h₁ in compressed liquid table @ P₂

Case 2: hf < h₁ < hg @ P₂
→ Outlet is wet vapor (two-phase mixture)
→ Calculate quality: x = (h₁ - hf) / hfg
→ This quality represents moisture content

Case 3: h₁ > hg @ P₂
→ Outlet is superheated vapor
→ Go to superheated table @ P₂
→ Find T where h = h₁

Example - Throttling Valve:
Inlet: 500 psia, 400°F superheated steam
From superheated table at 500 psia, 400°F:
h₁ = 1204.4 Btu/lbm
Exit through valve to P₂ = 50 psia

Find outlet state with h₂ = h₁ = 1204.4 Btu/lbm at 50 psia:

Look at 50 psia saturation line:
hf = 298.6 Btu/lbm
hfg = 888.6 Btu/lbm
hg = 1187.2 Btu/lbm

Since hf < 1204.4 > hg?
Actually hg = 1187.2 < h = 1204.4
→ Outlet is superheated at 50 psia

Going to 50 psia superheated table, finding h ≈ 1204.4:
≈ 300°F, h = 1204.5 Btu/lbm (interpolating)

So throttling from (500 psia, 400°F) → (50 psia, ~300°F)
• Temperature dropped 100°F (throttling cooling effect)
• But entropy increased (irreversible process)

ISOTHERMAL PROCESS:
Definition: Process at CONSTANT TEMPERATURE (T = constant).
Mechanism:
• System maintained at constant temperature through heat transfer
• System in continuous thermal equilibrium with surroundings
• Can have pressure and volume changes

Mathematical Form (for ideal gas):
PV = nRT
At constant T: PV = constant
P₁V₁ = P₂V₂

For real substances like steam:
Temperature alone doesn't determine state
Need another property (P, or v, or h, or s)

Characteristics:
• Usually slow process (allows thermal equilibrium)
• Heat transfer required
• Work can be done on or by system

Practical Power System Example:
Steam flowing through a long, heated pipe at constant temperature:
• Pipe maintained at constant T by external heating
• Pressure may drop slightly due to friction
• Temperature remains constant by heat input

Note: NOT very common in power systems
(Systems usually operate either adiabatic or isobaric, not isothermal)

OTHER IMPORTANT PROCESS TYPES:

ISOCHORIC (Constant Volume) Process:
• Volume constant: V = constant (rigid container, piston locked)
• Pressure and temperature change
• W = P × ΔV = 0 (no work because no volume change)
• First law: Q = ΔU (all heat changes internal energy)
• Application: Sealed gas cylinder, rigid pressure vessel

POLYTROPIC PROCESS:
• Generalized process: PVⁿ = constant
• n = 1: isothermal
• n = γ: isentropic
• 1 < n < γ: typical real gas process with partial heat transfer/work
• n = 0: isobaric
• n = ∞: isochoric
• Used to approximate real turbine/compressor processes

REVERSIBLE vs. IRREVERSIBLE PROCESSES:

REVERSIBLE (IDEAL):
Definition: Process that can return to initial state without leaving traces on surroundings.
Characteristics:
• Requires frictionless operation
• Infinitesimal steps (quasi-static process)
• No turbulence, no noise, no heat loss to surroundings
• All mechanical energy perfectly converted
• Entropy remains constant or exactly balanced
• Pressure uniform everywhere
• Temperature uniform everywhere

Real World Status: Theoretical ideal only - never achieved exactly
Closest approximations:
• Perfectly insulated adiabatic processes (no friction)
• Very slow processes with large surface area (minimal gradients)
• High-quality industrial equipment designed for efficiency

IRREVERSIBLE (ACTUAL/REAL):
Definition: Process that cannot return to initial state without external work and leaving traces.
Characteristics:
• Friction always present
• Pressure gradients necessary for flow
• Temperature gradients necessary for heat transfer
• Turbulence and eddies form
• Heat lost to environment
• Energy degraded to lower-quality forms
• Entropy always increases (ΔS > 0)
• Noise, vibration, wear

Power System Examples:
• Turbine with friction, blade losses
• Pump with impeller friction, bearing losses
• Valve throttling (pressure drop with turbulence)
• Piping friction losses
• Heat exchanger with finite temperature difference

MEASURING IRREVERSIBILITY:
Isentropic Efficiency for Turbines:
η_turbine = (Actual work output) / (Isentropic ideal work)
η_turbine = (h₁ - h₂_actual) / (h₁ - h₂_isentropic)
Typical: 80-90% (means 10-20% lost to friction)

Isentropic Efficiency for Pumps/Compressors:
η_pump = (Isentropic ideal work) / (Actual work input)
η_pump = (h₂_isentropic - h₁) / (h₂_actual - h₁)
Typical: 75-85% (means 15-25% wasted as heat in pump)

Note: Opposite convention for pumps vs turbines!

---
id: 16
section: 'STEADY-FLOW PROCESS AND ENERGY BALANCE:'
objective: null
---
STEADY-FLOW SYSTEM DEFINITION:
A system where mass and energy flow through at constant rates, with properties constant with time (but may vary spatially).

THREE REQUIRED CONDITIONS:

CONDITION 1: CONSTANT MASS FLOW RATE
Definition: Mass entering system per unit time = Mass leaving system per unit time.

Mathematical Form:
ṁ_in = ṁ_out (continuity equation)

Physical Meaning:
• No accumulation of mass inside system
• If more mass enters than leaves → system fills up
• If less mass enters than leaves → system empties
• At steady state: Must be perfectly balanced

Application in Power Plants:
• Boiler: Steam generated (leaves) = feedwater entering + fuel reacting
  Actually: ṁ_steam = ṁ_feedwater (approximately, fuel mass absorbed into steam)
• Turbine: Steam entering = steam leaving (ṁ_inlet = ṁ_outlet)
• Pump: Water entering = water leaving (ṁ_inlet = ṁ_outlet)

CONDITION 2: CONSTANT WORKING-FLUID PROPERTIES
Definition: Properties at each location constant with time (do not fluctuate).

Properties: P, T, h, s, v, u, etc.
Spatial variation: OK - different from inlet to outlet
Time variation: NOT OK - must be constant if taking steady-state values

Why This Matters:
• Allows use of time-independent equations
• Energy balance can use average properties instead of integrating over time
• Measurements don't need to change with time

Violation Example - Not Steady:
• Turbine startup: Properties changing with time (not reaching steady state yet)
• Load change: Operator suddenly changes flow → properties changing
• Emergency shutdown: System transient (not steady)

CONDITION 3: CONSTANT RATES OF HEAT AND WORK
Definition: Heat transfer rate (Q̇) and work rate (Ẇ) constant with time.

Mathematical Form:
Q̇ = constant with time
Ẇ = constant with time

Physical Meaning:
• Heat transfer into/out of system doesn't fluctuate
• Work production/requirement doesn't fluctuate
• Rates can vary spatially (different Q̇ at different points)
• But must be constant at each location

Examples:
• Steady heat addition: Boiler furnace provides constant MW heat
• Steady work extraction: Turbine produces constant MW power
• Steady cooling: Condenser removes constant MW heat

STEADY-FLOW ENERGY BALANCE (SFEE):

For open system with mass flowing in and out:

General Form:
(Heat in) + (Mass × enthalpy in) = (Mass × enthalpy out) + (Work out)

Mathematical Form:
Q̇ + ṁ × h_in = ṁ × h_out + Ẇ

Where:
• Q̇ = heat transfer rate [Btu/s, kW]
• ṁ = mass flow rate [lbm/s, kg/s]
• h_in = specific enthalpy at inlet [Btu/lbm, J/kg]
• h_out = specific enthalpy at outlet [Btu/lbm, J/kg]
• Ẇ = work rate (positive if done BY system) [Btu/s, kW]

Rearranging:
Q̇ = ṁ × (h_out - h_in) + Ẇ

Or solving for work:
Ẇ = ṁ × (h_in - h_out) + Q̇

SIGNS AND CONVENTIONS:

Heat Q̇:
• Positive if added to system (from furnace)
• Negative if removed from system (to condenser)

Work Ẇ:
• Positive if done BY system (turbine expanding)
• Negative if done ON system (pump compressing, negative work ON)

Enthalpy terms:
• Always use: h_out - h_in
• If h increases: Enthalpy added (fluid heated or pressurized)
• If h decreases: Enthalpy removed (fluid cooled or depressurized)

SINGLE-INLET, SINGLE-OUTLET EQUIPMENT (Most Common):

Device has one inlet pipe and one outlet pipe

ENERGY BALANCE BECOMES:
Q̇ + ṁ × h_in = ṁ × h_out + Ẇ

Can divide by ṁ to get per-unit-mass form:
q + h_in = h_out + w

Where lowercase q and w are specific heat and work per lbm

BOILER:
Energy Balance:
Q̇_fuel = ṁ × (h_out - h_in)
Heat from combustion = Mass flow × Enthalpy change

No work done: Ẇ = 0
All combustion energy becomes enthalpy increase in steam

Example:
• Inlet: 100 lbm/s liquid at 100 psia, 300°F (h₁ = 276.0 Btu/lbm)
• Outlet: 100 lbm/s steam at 100 psia, 400°F (h₂ = 1227.5 Btu/lbm)
• Energy balance: Q̇ = 100 lbm/s × (1227.5 - 276.0) Btu/lbm = 95,150 Btu/s = 27 MW

TURBINE:
Energy Balance (with negligible Q̇):
ṁ × h_in = ṁ × h_out + Ẇ
Ẇ = ṁ × (h_in - h_out)

Work extracted = Mass flow × Enthalpy drop

Example:
• Inlet: 500 lbm/s steam at 1000 psia, 1000°F (h₁ = 1509 Btu/lbm)
• Outlet: 500 lbm/s steam at 1 psia (h₂ = 1105 Btu/lbm)
• Work: Ẇ = 500 × (1509 - 1105) = 202,000 Btu/s = 286 MW

PUMP:
Energy Balance (with negligible Q̇):
ṁ × h_in + Ẇ_motor = ṁ × h_out
Ẇ_motor = ṁ × (h_out - h_in)

Work input = Mass flow × Enthalpy rise

For incompressible liquid (water):
Δh ≈ v × ΔP = (0.0161 ft³/lbm) × ΔP (in lbf/ft²)

Example:
• Inlet: 100 lbm/s liquid at 50 psia, 100°F
• Outlet: 100 lbm/s liquid at 2050 psia, 100°F
• h change ≈ 0.0161 × (2050-50) × 144 / 778 ≈ 0.48 Btu/lbm
• Actual mechanical power = 100 × 0.48 / 0.80 efficiency = 60 Btu/s = 0.085 MW

CONDENSER:
Energy Balance:
ṁ × h_in + Q̇_rejected = ṁ × h_out
Q̇_rejected = ṁ × (h_out - h_in) (usually negative, heat removed)

OR:
Q̇_rejected = ṁ × (h_in - h_out) (expressed as heat removed)

Example:
• Inlet: 500 lbm/s wet steam at 1 psia, x = 0.90 (h = 1105 Btu/lbm)
• Outlet: 500 lbm/s liquid at 1 psia, 90°F (h = 58 Btu/lbm)
• Heat rejected: Q̇ = 500 × (1105 - 58) = 523,500 Btu/s = 744 MW

MECHANICAL EQUIVALENT OF HEAT:

Definition: Conversion factor between thermal energy and mechanical energy units.

Historical Background:
James Joule (1840s) experimentally demonstrated mechanical energy could be converted to heat:
• Paddle wheel rotating in water
• Mechanical work input → Heat output (water warmed)
• Established equivalent between mechanical and thermal units

Conversion Factor (English System):
1 Btu = 778.16 foot-pounds-force (ft·lbf)

Conversion Factor (SI System):
1 Joule = 1 Newton·meter = 1 N·m (no separate factor needed - unified system)

Practical Use:
Converting between power units:
• 1 Btu/s = 1 Btu/s × 1 = 1 Btu/s
• 1 hp = 0.707 Btu/s (because 1 hp = 550 ft·lbf/s = 550/778 Btu/s)
• 1 kW = 0.948 Btu/s

Power Plant Efficiency Checks:
• Turbine mechanical power: MW (power input from steam)
• Generator power output: MWe (electrical power produced)
• Generator efficiency: η_gen = MWe / MW ≈ 97%

---
id: 17
section: 'HEAT EXCHANGER EQUIPMENT ANALYSIS:'
objective: null
---
HEAT EXCHANGER DEFINITION:
Device that transfers heat between two flowing streams without mass mixing.

Both streams remain separate (not mixed)
Heat flows from hot stream to cold stream through separating wall (tubes, plates)

STEADY-FLOW ENERGY BALANCE FOR HEAT EXCHANGER:
Since no work is done (Ẇ = 0):

For HOT stream:
Q̇ = ṁ_hot × (h_out - h_in) = ṁ_hot × (h_in - h_out) [negative, heat rejected]

For COLD stream:
Q̇ = ṁ_cold × (h_out - h_in) [positive, heat absorbed]

Energy Balance (Conservation):
Heat lost by hot stream = Heat gained by cold stream
ṁ_hot × (h_hot,in - h_hot,out) = ṁ_cold × (h_cold,out - h_cold,in)

Or per unit mass:
q = h_out - h_in (heat transfer per lbm of substance)

TYPES OF HEAT EXCHANGERS:

1. STEAM GENERATOR (BOILER):
Purpose: Convert liquid water to steam using heat from combustion
Hot side: Combustion gases (~3000°F) from furnace
Cold side: Feedwater/steam in tubes
Direction: Heat flows from gases through tube wall to water/steam

STEADY-FLOW ENERGY BALANCE FOR BOILER:
Q̇_combustion = ṁ_steam × (h_out - h_in)

Where:
• Q̇_combustion = heat released from fuel burning
• h_in = enthalpy of feedwater (liquid)
• h_out = enthalpy of generated steam (saturated or superheated)

Process Type: ISOBARIC (constant pressure throughout boiler)
• Inlet pressure ≈ Outlet pressure (same economizer/evaporator pressure)
• Pressure drop minimal compared to pressure magnitude

Typical Boiler Duty:
Inlet: Subcooled liquid at 2050 psia, 300°F (h = 276 Btu/lbm)
Outlet: Superheated steam at 2000 psia, 1000°F (h = 1509 Btu/lbm)
Enthalpy rise: Δh = 1509 - 276 = 1233 Btu/lbm
For 500 lbm/s: Heat required = 500 × 1233 = 616,500 Btu/s = 875 MW

2. STEAM CONDENSER:
Purpose: Convert low-pressure steam to liquid water for return to boiler
Hot side: Exhaust steam from turbine (saturated, low pressure)
Cold side: Cooling water (from cooling tower or ocean)
Direction: Heat flows from steam through tube wall to cooling water

STEADY-FLOW ENERGY BALANCE FOR CONDENSER:
Q̇_steam = ṁ_steam × (h_in - h_out)

Where:
• h_in = enthalpy of inlet steam (usually wet, x < 1)
• h_out = enthalpy of outlet liquid (subcooled, few degrees below saturation)

Process Type: ISOBARIC (constant pressure throughout condenser)
• Inlet pressure ≈ Outlet pressure (all saturated at ~1 psia)
• Slight pressure drop from friction

Typical Condenser Duty:
Inlet: Wet steam at 1 psia, x = 0.90 (h = 1105 Btu/lbm)
Outlet: Subcooled liquid at 1.05 psia, 90°F (h = 58 Btu/lbm)
Enthalpy drop: Δh = 1105 - 58 = 1047 Btu/lbm (huge!)
For 500 lbm/s: Heat rejected = 500 × 1047 = 523,500 Btu/s = 744 MW

CRITICAL IMPORTANCE OF CONDENSER VACUUM:
Lower pressure in condenser:
• Larger enthalpy drop in steam
• More work extracted from steam in turbine
• Better thermodynamic cycle efficiency
• Turbine exhaust pressure maintained very low (minimize backpressure)

Ideal: P_condenser → 0 (maximum Δh)
Reality: P_condenser ≈ 1 psia (0.07 bar) - limited by cooling water availability

If vacuum lost (pressure rises to 5 psia):
• Plant efficiency drops significantly
• Same steam mass, less work extractable
• Turbine backpressure increases
• Emergency condition requiring corrective action

CONDENSATE SUBCOOLING:
After steam completely condenses (x=0), additional cooling below saturation occurs

Reasons for Subcooling:
1. Cooling tower water temperature lower than saturation temperature
2. Condensate must travel through pipes to pump (cooling along the way)
3. Some subcooling necessary to prevent pump cavitation

Typical: 10-20°F subcooling below saturation temperature
• Balances between efficiency and cavitation prevention
• Excessive subcooling (>30°F) wastes heat and increases corrosion

Cavitation Prevention:
Pump inlet requires subcooled liquid to maintain pressure above vapor pressure
NPSH (Net Positive Suction Head) requirement depends on pump design
Minimum subcooling typically 2-5°F depending on pump and conditions

---
id: 18
section: 'NOZZLES AND DIFFUSERS:'
objective: null
---
NOZZLE DEFINITION:
Shaped passage (convergent or divergent) that converts pressure/enthalpy to velocity/kinetic energy.

Characteristics:
• No work done: Ẇ = 0 (no rotating parts, no shaft)
• No heat transfer: Q̇ = 0 (adiabatic, usually insulated)
• Only enthalpy and kinetic energy exchange

STEADY-FLOW ENERGY BALANCE FOR NOZZLE:
Q - W = Δ(h + v²/2gc + gz)
0 - 0 = Δ(h + v²/2gc)

Rearranging:
v₂² - v₁² = 2gc × (h₁ - h₂)

Or solving for exit velocity:
v₂ = √[2gc(h₁ - h₂) + v₁²]

For high-speed nozzles, v₁ ≈ 0 at inlet:
v₂ = √[2gc(h₁ - h₂)]

Where gc = conversion factor = 32.174 lbm·ft/(lbf·s²)

CONVERGENT NOZZLE:
Geometry: Cross-sectional area DECREASES from inlet to outlet (throat)

Flow Characteristics:
• Velocity increases: v_inlet < v_outlet
• Pressure decreases: P_inlet > P_outlet
• Temperature decreases: T_inlet > T_outlet
• Density increases: ρ_inlet < ρ_outlet

Energy Conversion:
Thermal energy (enthalpy) → Kinetic energy of bulk flow

Physical Process:
High-pressure fluid enters slowly
Converging walls accelerate flow
Pressure/enthalpy converted to motion
Exit: High-velocity, low-pressure jet

Continuity Equation:
ṁ = ρ × A × V = constant
ρ₁ × A₁ × v₁ = ρ₂ × A₂ × v₂
If A decreases and ρ increases: velocity must increase to maintain mass flow

Maximum Exit Velocity (Sonic Flow):
In convergent nozzle, maximum velocity achievable is sonic (speed of sound)
At speed of sound: Mach = 1.0
Convergent nozzle can only reach sonic speed at throat (cannot go supersonic with convergent alone)

Applications:
• Turbine nozzles (high-velocity steam jets)
• Steam ejectors (creating vacuum)
• Jet flow measurement
• Rocket nozzles (with divergent section for supersonic)

CONVERGENT-DIVERGENT NOZZLE (Laval Nozzle):
Geometry: Convergent section followed by divergent section
• Convergent: Accelerates flow to sonic speed at throat
• Divergent: Further accelerates to supersonic beyond throat

Enables:
Velocities beyond sonic speed possible
Exit velocity much higher than convergent nozzle alone
Requires pressure drop across nozzle for supersonic flow

Applications:
• High-performance turbines (steam jets)
• Rocket engines (exhaust acceleration)
• Research applications

DIVERGENT NOZZLE (Diffuser):
Geometry: Cross-sectional area INCREASES from inlet to outlet

Flow Characteristics:
• Velocity decreases: v_inlet > v_outlet
• Pressure increases: P_inlet < P_outlet
• Temperature increases: T_inlet < T_outlet
• Density decreases: ρ_inlet > ρ_outlet

Energy Conversion:
Kinetic energy (velocity) → Thermal energy (enthalpy)

Physical Process:
High-velocity inlet flow enters
Diverging walls slow the flow
Kinetic energy converted to pressure
Exit: Low-velocity, high-pressure discharge

Continuity Equation (Same as convergent):
ṁ = ρ × A × V = constant
If A increases and v decreases: density must decrease to maintain mass flow

Applications:
• Diffuser after turbine/compressor exhaust (pressure recovery)
• Exhaust ductwork (slowing and re-pressurizing flow)
• Hydraulic system return lines
• Measurement devices requiring pressure recovery

NOZZLE/DIFFUSER DESIGN CONSIDERATIONS:

Pressure Recovery:
Ideally, all velocity converted back to pressure in diffuser
Reality: Friction losses reduce recovery to 70-90%

Energy Loss Mechanisms:
• Friction with walls
• Turbulence formation
• Separation (flow "peeling off" inner wall)
• Heat transfer (if not perfectly adiabatic)

Efficiency Definition:
Nozzle efficiency: Actual exit kinetic energy / Theoretical (ideal) kinetic energy
Diffuser efficiency: Actual pressure recovery / Theoretical (ideal) pressure recovery

CONTINUITY EQUATION (MASS CONSERVATION):
For steady flow, mass flow rate constant throughout:
ṁ = ρ × A × v = constant

At different points:
ρ₁ × A₁ × v₁ = ρ₂ × A₂ × v₂

Practical Implication in Nozzles:
• Convergent nozzle: Area shrinks, velocity grows, pressure drops
• Divergent nozzle: Area expands, velocity drops, pressure grows
• Continuity satisfied by combined effects

Example - Steam Nozzle:
Inlet: 100 psia, 400°F, v = 4.43 ft³/lbm, low velocity (say 10 ft/s)
Converging to throat, exit pressure = 50 psia
At exit: v₁ = 4.43 ft³/lbm at 100 psia, v₂ = ? ft³/lbm at 50 psia

Energy equation:
v₂² = v₁² + 2gc(h₁ - h₂)
v₂² = 10² + 2×32.174×[(h₁@100psia,400°F) - (h₂@50psia)]
h₁ ≈ 1227.5 Btu/lbm, h₂ ≈ 1174 Btu/lbm
v₂² = 100 + 2×32.174×(1227.5-1174) ≈ 100 + 3411 ≈ 3511
v₂ ≈ 59.3 ft/s (huge velocity!)

Continuity check:
Mass flow ∝ (ρ×A×v)
Area must decrease by factor of (v₂/v₁)×(ρ₁/ρ₂) ≈ (59/10)×(1/0.9) ≈ 6.5×
This explains convergent nozzle shape

APPLICATIONS IN POWER PLANT EQUIPMENT:

Turbine Design:
Multiple nozzle stages accelerate steam in fixed blades
Each stage directs high-velocity jet at moving blade row
Blades decelerate jet, extracting work

Main Condenser:
Steam flows through turbine nozzles
Final jet directed at condenser tubes
Heat rejection cools steam, revaporization prevents (complete condensation)

Plant Operating Conditions Affect Nozzles:
Higher inlet pressure → Higher exit velocity → More work possible
Lower outlet pressure → Larger enthalpy drop → Higher exit velocity
Better vacuum → Lower outlet pressure → Maximum performance

---
id: 19
section: 'TURBINES AND PUMPS - WORK DEVICES:'
objective: null
---
TURBINE OVERVIEW:

Function: Extract mechanical work from expanding fluid
Input: High-pressure, high-temperature fluid (steam, gas)
Output: Mechanical work + Lower-pressure, lower-temperature fluid
Energy Source: Pressure and temperature difference between inlet and outlet

TURBINE WORK CALCULATION:

Steady-flow energy balance (with negligible Q̇):
ṁ × h_in = ṁ × h_out + Ẇ_turbine

Rearranging:
Ẇ_turbine = ṁ × (h_in - h_out)

Per unit mass (specific work):
w_turbine = h_in - h_out

This is enthalpy DROP through turbine (positive value for work output)

Units:
• Specific work: Btu/lbm, J/kg
• Power: Btu/s, kW, MW
• Power conversion: 1 MW = 3412 Btu/h

TYPICAL TURBINE OPERATION:

Stage 1 (High-Pressure Turbine):
Inlet: 1800 psia, 1000°F, h₁ = 1509 Btu/lbm
Intermediate: 500 psia (reheater inlet), h = 1380 Btu/lbm
Work: 1509 - 1380 = 129 Btu/lbm

Reheater (Between Turbine Stages):
Inlet: 500 psia, saturated or wet
Reheated to: 500 psia, 1000°F
Exit: h ≈ 1512 Btu/lbm
Heat added: 1512 - 1380 = 132 Btu/lbm

Stage 2 (Low-Pressure Turbine):
Inlet: 500 psia, 1000°F (reheated), h = 1512 Btu/lbm
Outlet: 1 psia, x ≈ 0.90 (wet), h = 1105 Btu/lbm
Work: 1512 - 1105 = 407 Btu/lbm

Total work per lbm:
w_total = 129 + 407 = 536 Btu/lbm

For 500 lbm/s:
Power = 500 × 536 = 268,000 Btu/s ≈ 380 MW

TWO-STEP CONVERSION IN TURBINE:

Step 1 - STATIONARY NOZZLE STAGE (Fixed Blades):
• Converging nozzle accelerates steam
• Pressure drops significantly
• Temperature drops as enthalpy converts to kinetic energy
• High-velocity jet emerges from nozzle

Energy conversion: Pressure/enthalpy → Kinetic energy

Step 2 - MOVING BLADE STAGE (Rotor):
• High-velocity steam jet hits rotating blades
• Blades deflect flow path (often 180° turn)
• Blade motion in jet direction extracts kinetic energy
• Fluid exits blades at lower velocity than inlet

Energy conversion: Kinetic energy → Mechanical rotation of turbine shaft

Multiple Stages:
Real turbine has many alternating nozzle/blade stages
Each stage extracts portion of enthalpy
Cumulative effect: Large total work extraction

TURBINE EFFICIENCY:

Isentropic (Ideal) Turbine Expansion:
Constant entropy: s_inlet = s_outlet = s₂s
No friction, perfect expansion
All enthalpy converted to work

From steam tables (finding state where s = constant):
Ideal work: W_s = h_in - h₂s

Real Turbine (Actual) Expansion:
Friction from blade interaction, steam leakage, turbulence
Entropy increases: s_outlet > s_inlet (irreversible)
Some enthalpy converted to heat (turbulence/noise) instead of work

Actual work: W_actual = h_in - h₂_actual

TURBINE ISENTROPIC EFFICIENCY:
Definition: Ratio of actual work to ideal (isentropic) work

η_turbine = W_actual / W_ideal = (h_in - h₂_actual) / (h_in - h₂s)

Interpretation:
• η = 90% means: For every 100 Btu of ideal work, get 90 Btu of actual work
• Other 10 Btu dissipated as heat in turbulence
• Typical turbine efficiency: 85-90%
• Modern high-performance turbines: 90-92%

Effect on Exit Condition:
Real turbine exits WETTER than ideal
h₂_actual > h₂s (enthalpy higher because didn't expand as far)
Quality x_actual > x_ideal

This matters because:
High moisture content at exit → Blade erosion risk
Low-quality steam (x < 95%) not recommended for turbine inlet
Steam quality at exit → blade damage prevention strategy

PUMP OVERVIEW:

Function: Add mechanical work to fluid to increase pressure
Input: Low-pressure fluid + Mechanical work (from motor)
Output: High-pressure fluid
Energy sink: Pressure rise needed to overcome system resistance

PUMP WORK CALCULATION:

Steady-flow energy balance (with negligible Q̇):
ṁ × h_in + Ẇ_motor = ṁ × h_out

Rearranging:
Ẇ_motor = ṁ × (h_out - h_in)

Per unit mass (specific work):
w_pump = h_out - h_in

This is enthalpy RISE through pump (positive value for work input)

For Incompressible Liquid (Water):
Δh ≈ Δ(Pv) ≈ v × ΔP
v = specific volume ≈ 0.0161 ft³/lbm for water

w_pump ≈ (0.0161 ft³/lbm) × (P_out - P_in) × (1 lbf/in²)

Conversion to Btu/lbm:
w_pump[Btu/lbm] = ΔP[psi] × 0.01604 ft³/lbm × 1 lbf/in² / (778 ft·lbf/Btu)
= ΔP × 0.01604 / 778 = ΔP × 2.06 × 10⁻⁵ Btu/(lbm·psi)

Simpler formula:
w_pump = v × ΔP / 778 [Btu/lbm] where v in ft³/lbm and ΔP in psf

Example - Boiler Feedwater Pump:
Inlet: 100 psia, 300°F liquid
Outlet: 2050 psia, 300°F liquid
ΔP = 2050 - 100 = 1950 psi

Theoretical work:
w = 0.0161 × 1950 / 778 = 0.0403 Btu/lbm

Mechanical power (100% efficient):
P = 1000 lbm/s × 0.0403 Btu/lbm = 40.3 Btu/s = 57 kW

With 80% pump efficiency:
Motor power = 40.3 / 0.80 = 50.4 Btu/s = 71.5 kW

Note: Small power compared to turbine! Pump uses ~1% of turbine power

PUMP EFFICIENCY:

Isentropic (Ideal) Pump Compression:
Constant entropy: s_inlet = s_outlet = s₂s
No friction, perfect compression
Minimum work required: W_s = h₂s - h_in

Real Pump (Actual) Compression:
Friction from impeller, bearing, internal leakage
Entropy increases: s_outlet > s_inlet (irreversible)
More work needed than ideal

Actual work: W_actual = h₂_actual - h_in

PUMP ISENTROPIC EFFICIENCY:
Definition: Ratio of ideal work to actual work
(Note: OPPOSITE of turbine definition!)

η_pump = W_ideal / W_actual = (h₂s - h_in) / (h₂_actual - h_in)

Interpretation:
• η = 80% means: Need 125% of ideal work for actual compression
• 20% wasted as heat in pump friction
• Typical pump efficiency: 75-85%
• Excellent pumps: 85-90%

Why Lower than Turbines:
• Impeller friction more significant than turbine blade friction
• Internal leakage around impeller
• Discharge losses
• Bearing friction

Effect on Motor Requirement:
Motor must provide actual work, not ideal work
Oversized motor needed to account for inefficiency
Heat generated = (Actual work - Ideal work) dissipated as heat in fluid

TURBINE-PUMP POWER ACCOUNTING:

Net Work for Cycle:
W_net = W_turbine - W_pump - W_other_losses

Importance:
Pump work typically 1-3% of turbine work
But adds significantly to motor/generator sizing
Higher pump efficiency reduces motor load

Example 600 MW Plant:
Turbine power: ~620 MW (accounting for cooling losses)
Pump power: ~10 MW (2% of turbine)
Generator power: 600 MW (with ~1.6% loss in generator)
Generator efficiency: 600 / 620 = 96.8%

Pump Motor Sizing:
Theoretical pump work: 10 MW
With 80% efficiency: Motor = 10 / 0.80 = 12.5 MW motor required

THROTTLING VALVE (THROTTLE):

Definition: Partial restriction of flow that reduces pressure without doing useful work.

Physical Process:
Fluid flows through partially-open valve or restriction
Upstream pressure P₁ > Downstream pressure P₂
Turbulence and friction dissipate energy
Energy wasted as heat and noise

Thermodynamic Property:
Process is ISENTHALPIC: h_outlet = h_inlet
No work, no heat → First law: Δh = 0

Applications in Power Plants:
1. PRESSURE REDUCING VALVE (PRV): Auxiliary steam systems
   • Steam at 2000 psia → PRV → 100 psia for building heat
   • h before = h after (approximately)
   • Quality increases (becomes drier) or superheat increases

2. CONTROL VALVE: Flow regulation
   • Operator adjusts opening for flow control
   • Each degree of opening → more throttling loss
   • Process is isenthalpic through valve

3. METERING ORIFICE: Flow measurement restriction
   • Fixed orifice creates pressure drop
   • Pressure difference proportional to flow rate
   • Isenthalpic process through restriction

FINDING DOWNSTREAM STATE AFTER THROTTLING:

Given: h₂ = h₁ (isenthalpic), outlet pressure P₂

Step 1: Look up h₁ at inlet state (P₁, T₁)
Step 2: At outlet pressure P₂, find saturation properties (hf, hg)
Step 3: Compare h₁ to saturation values:

If h₁ < hf @ P₂:
  → Outlet is compressed liquid (liquid below saturation)
  → Rare (requires inlet to be compressed liquid too)

If hf < h₁ < hg @ P₂:
  → Outlet is wet vapor
  → Quality: x = (h₁ - hf) / hfg
  → Moisture content of outlet

If h₁ > hg @ P₂:
  → Outlet is superheated vapor
  → Find temperature in superheated table @ P₂ where h = h₁

Example - Pressure Reducing Valve (PRV):
Inlet: 600 psia, 450°F steam
h₁ = 1284.8 Btu/lbm (from superheated table at 600 psia, 450°F)

Outlet: 100 psia, h₂ = h₁ = 1284.8 Btu/lbm

At 100 psia (saturation):
hf = 298.6 Btu/lbm
hg = 1187.2 Btu/lbm

Since 1284.8 > 1187.2:
→ Outlet is SUPERHEATED at 100 psia

Find T where h = 1284.8 at 100 psia:
From superheated table at 100 psia: h ≈ 1284.8 at T ≈ 410°F

Result: Throttling from (600 psia, 450°F) → (100 psia, 410°F)
Temperature only dropped 40°F (steam became less superheated but still superheated)

Second Example - Low-Pressure Throttling:
Inlet: 200 psia, saturated liquid, x = 0
h₁ = hf @ 200 psia = 371.6 Btu/lbm

Outlet: 1 psia, h₂ = h₁ = 371.6 Btu/lbm

At 1 psia (saturation):
hf = 69.7 Btu/lbm
hg = 1105.0 Btu/lbm

Since 69.7 < 371.6 < 1105.0:
→ Outlet is WET VAPOR

Quality: x = (371.6 - 69.7) / (1105.0 - 69.7) = 301.9 / 1035.3 = 0.291

Result: Throttling from (200 psia, saturated liquid) → (1 psia, 29.1% vapor, 70.9% liquid)
Large quality change due to large pressure drop

Implication: Throttling from high pressure liquid to low pressure produces significant moisture/quality change!
