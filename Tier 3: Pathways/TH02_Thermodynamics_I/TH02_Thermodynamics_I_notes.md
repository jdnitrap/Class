# TH02_Thermodynamics_I - Comprehensive Study Notes

## Note ID: 9
### FIRST LAW OF THERMODYNAMICS - ENERGY CONSERVATION:

FUNDAMENTAL PRINCIPLE:
"Energy cannot be created or destroyed, only converted from one form to another."

MATHEMATICAL STATEMENT (For Closed System):
Q - W = ΔU_system
or
E_in - E_out = ΔE_system

Where:
• Q = Heat transfer to system [Btu, J]
• W = Work done by system [Btu, J]
• ΔU = Change in internal energy [Btu, J]

UNIVERSAL PRINCIPLE:
This law applies to ALL energy transformations:
• Chemical combustion → thermal energy
• Thermal energy → mechanical work
• Mechanical work → electrical energy
• Electrical energy → light, heat, motion

POWER PLANT APPLICATION (Open System Energy Balance):

Thermal-to-Electrical Conversion Process:
1. Fuel Input: Chemical energy from coal/gas/oil/nuclear
2. Boiler: Chemical energy → Heat transfer to steam
3. Steam Generation: Heat absorbed raises steam temperature and pressure
4. Turbine: High-pressure steam expands → Mechanical work extracted
5. Generator: Mechanical work → Electrical power output
6. Condenser: Low-pressure steam → Heat rejected to cooling water/atmosphere
7. Pump: Mechanical work returns condensate to boiler

ENERGY BALANCE FOR POWER CYCLE:
Total Energy In (Fuel/Heat) = Electrical Energy Out + Heat Rejected + Losses

Efficiency = Electrical Power Output / Total Thermal Energy Input × 100%

Typical Plant Efficiency: 33-40% (coal), 45-55% (gas), 60-90% (nuclear)

FORMS OF ENERGY IN POWER SYSTEMS:

STORED ENERGY (Energy a substance HAS - state-dependent):
Properties of matter that depend only on current state, not on how the substance reached that state.

POTENTIAL ENERGY (PE):
Energy due to position in gravitational field
Formula: PE = m × z × g / gc
Where:
  • m = mass
  • z = height above reference point
  • g = gravitational acceleration (32.174 ft/s² or 9.81 m/s²)
  • gc = conversion factor (32.174 lbm·ft/(lbf·s²) in English system)

Example: Water elevated in tower stores PE relative to ground level.

KINETIC ENERGY (KE):
Energy due to motion/velocity
Formula: KE = m × V² / (2 × gc)
Where:
  • m = mass
  • V = velocity
  • gc = conversion factor

Example: Rotating pump impeller, flowing steam, moving piston.

INTERNAL ENERGY (U):
Sum of all microscopic forms of energy within a substance:
• Molecular motion (kinetic at molecular level) - increases with temperature
• Molecular vibration - increases with temperature
• Electron orbital motion
• Nuclear binding energy (constant for most processes)

Specific Internal Energy (u):
• u = U / m (energy per unit mass)
• Units: Btu/lbm, J/kg
• Changes with temperature and pressure
• Steam tables provide direct values
• Example: Saturated steam at 100 psia has u = 1187.8 Btu/lbm

Why Internal Energy Matters:
Internal energy must change for any temperature change to occur, and represents the energy available from the substance.

FLOW ENERGY (PV WORK):
Energy required to push a fluid into or out of a control volume
Formula: PV = P × V (specific: Pv = P × v)
Where:
  • P = pressure
  • V = volume (specific: v = volume per unit mass)

Physical Meaning: Work done against pressure to inject fluid into system.

Example: Pump must do 100 psi work just to push water into a 100 psi line (plus kinetic/potential changes).

ENTHALPY (H) - MOST IMPORTANT FOR FLOWING SYSTEMS:
Definition: H = U + PV
Combined measure of internal energy and flow work energy.

Specific Enthalpy (h):
h = u + Pv
Units: Btu/lbm, kJ/kg
This is the enthalpy found in steam tables.

Physical Meaning:
Enthalpy represents the TOTAL energy content of a flowing fluid, including:
• Internal energy (energy stored in substance)
• Flow work energy (energy to push fluid into/out of system)

WHY ENTHALPY IS CRITICAL FOR POWER SYSTEMS:

Turbine Work Calculation:
W_turbine = m × (h_inlet - h_outlet)
Example: Steam enters turbine at h₁ = 1400 Btu/lbm, exits at h₂ = 1200 Btu/lbm
Specific work = 1400 - 1200 = 200 Btu/lbm
For 100 lbm/s flow: Power = 100 × 200 = 20,000 Btu/s = 28.3 MW

Pump Work Calculation:
W_pump = m × (h_outlet - h_inlet)
Example: Liquid water inlet h₁ = 50 Btu/lbm, outlet h₂ = 60 Btu/lbm
Specific work = 60 - 50 = 10 Btu/lbm

Condenser Heat Rejection:
Q_rejected = m × (h_steam_inlet - h_liquid_outlet)
Example: 100 lbm/s steam at h₁ = 1200 Btu/lbm, exits as liquid at h₂ = 50 Btu/lbm
Heat rejected = 100 × (1200 - 50) = 115,000 Btu/s = 163 MW

Boiler Heat Addition:
Q_added = m × (h_outlet - h_inlet)
Example: Liquid water inlet h₁ = 100 Btu/lbm, steam outlet h₂ = 1400 Btu/lbm
Heat added = m × (1400 - 100) = m × 1300 Btu/lbm per unit mass

Advantages of Using Enthalpy:
• Simplifies energy balance for flowing systems
• Eliminates need to calculate Pv work separately
• Steam tables provide direct values - no calculations needed
• Applies to all open systems (turbines, pumps, heat exchangers)

---

## Note ID: 10
### ENERGY FORMS AND THEIR SIGNIFICANCE:

REVIEW OF STORED ENERGY TYPES:

1. POTENTIAL ENERGY:
   Calculated: PE = m × z × g / gc
   Significance: Important for elevation changes in piping, but usually small compared to enthalpy changes
   Example: Water elevated 100 ft = 100 ft × 1 lbm/lbf = 100 lbm·ft/lbf per lbm (small)
   vs. Steam enthalpy change in turbine = 200+ Btu/lbm (much larger)

2. KINETIC ENERGY:
   Calculated: KE = m × V² / (2 × gc)
   Significance: Often negligible in power plants but important in jet flows, nozzles
   Example: Water at 10 ft/s = (10²)/(2×32.174) = 1.55 Btu/lbm
   vs. Enthalpy change = hundreds of Btu/lbm
   Exception: High-velocity flow in nozzles or diffusers requires kinetic energy consideration

3. INTERNAL ENERGY:
   Not usually calculated directly; its change is represented by enthalpy change
   Temperature change = Internal energy change for substance
   Used in closed system analysis (piston-cylinder)

4. FLOW ENERGY (Pv):
   Always considered through enthalpy calculation
   Implicitly included in "h" values from steam tables

TRANSIENT ENERGY (Energy IN TRANSIT - Process-dependent):
Not properties of matter, but energy crossing system boundaries during process.

HEAT (Q):
Definition: Energy transfer due to temperature difference.
Characteristics:
• Transfers spontaneously from hot to cold (no work required)
• Does NOT flow through perfect insulation
• Path-dependent (same initial/final states can have different Q depending on process)
• Units: Btu, kJ, calories
• Sign convention: Q > 0 = heat added to system, Q < 0 = heat removed

Physical Process:
• Random molecular motion of hotter substance → Random molecular motion of cooler substance
• Molecular collisions transfer kinetic energy across boundary

Power Plant Example:
• Boiler: Q_in = heat from combustion to steam
• Condenser: Q_out = heat from steam to cooling water

WORK (W):
Definition: Energy transfer due to organized force acting through distance.
Formula: W = F × d
Characteristics:
• Organized transfer (vs random molecular collision in heat)
• Path-dependent (same states can have different W depending on process)
• Units: Btu, kJ, ft-lbf, J
• Sign convention: W > 0 = work done BY system, W < 0 = work done ON system

TWO MAJOR TYPES OF WORK:

1. MECHANICAL WORK:
   W_mech = F × Δx
   Solid object moved by force
   Examples:
   • Piston moving in cylinder
   • Shaft rotating in turbine
   • Pump impeller pushing fluid

2. FLOW WORK (PV WORK):
   W_flow = P × V
   Energy to push/pull fluid against pressure
   Already included in enthalpy calculation (h = u + Pv)
   Do NOT calculate separately for flowing systems

TURBINE WORK:
Process: High-pressure steam expands through turbine
Work = ṁ × (h_inlet - h_outlet)
Energy Conversion: Internal energy of steam → Mechanical work → Electrical energy
Example: Turbine with 100 psia inlet, 1 psia outlet, 500 lbm/s flow
  From steam tables: h_inlet = 1279 Btu/lbm, h_outlet = 1105 Btu/lbm
  Specific work = 1279 - 1105 = 174 Btu/lbm
  Total work = 500 lbm/s × 174 Btu/lbm = 87,000 Btu/s = 123 MW

PUMP WORK:
Process: Pump adds pressure to fluid
Work = ṁ × (h_outlet - h_inlet)
Energy Conversion: Mechanical work from motor → Fluid pressure increase
Note: For incompressible liquids, Wp ≈ v × ΔP (specific volume × pressure change)
Example: Pump takes water at 50 psia, delivers at 2050 psia
  Pressure increase = 2000 psi
  Water specific volume v ≈ 0.01613 ft³/lbm
  Pump work = 0.01613 × 2000 / gc = 1.0 Btu/lbm (liquid water)

SIGN CONVENTIONS:
Turbine: W = h_in - h_out (positive for work output)
Pump: W = h_out - h_in (positive for work input)

POWER (P or PWR):
Definition: Rate of energy transfer
Formula: Power = Energy / Time
Units:
• Btu/s (common in power engineering)
• Watts = J/s (SI standard)
• Horsepower (hp) - historical
• 1 hp = 0.7457 kW = 2545 Btu/h = 745.7 W

Power Conversions (Memorize):
• 1 Btu/s = 1.415 hp
• 1 hp = 0.707 Btu/s
• 1 kW = 3412 Btu/h
• 1 MW = 3.412 MMBtu/h

TURBINE POWER CALCULATION:
Power_turbine = ṁ × w_turbine = ṁ × (h_in - h_out)
Example: 100 lbm/s steam, work = 200 Btu/lbm
Power = 100 × 200 = 20,000 Btu/s = 28.3 MW

PUMP POWER CALCULATION:
Power_pump = ṁ × w_pump = ṁ × (h_out - h_in)
Note: Actual power > theoretical because pumps have efficiency < 100%
Actual Power = Theoretical Power / Pump Efficiency
Example: Theoretical = 1000 Btu/s, Pump efficiency = 80%
Actual motor power = 1000 / 0.80 = 1250 Btu/s

GENERATOR POWER OUTPUT:
Generator Power = Turbine Power × Generator Efficiency
Typical turbine efficiency: 85-90%
Typical generator efficiency: 95-99%
Combined: 80-90% of shaft power becomes electrical power

---

## Note ID: 11
### ENERGY TRANSFER MECHANISMS IN POWER CYCLES:

HEAT TRANSFER (Q):
Fundamental Mechanism: Random molecular motion transfer across temperature gradient

Three Modes of Heat Transfer:

1. CONDUCTION:
   Heat transfer through solid material
   Formula: Q = k × A × ΔT / L
   Where:
   • k = thermal conductivity of material
   • A = contact area
   • ΔT = temperature difference
   • L = thickness
   Example: Heat through boiler tube wall from hot gas to cooler water inside

2. CONVECTION:
   Heat transfer from surface to moving fluid (or vice versa)
   Formula: Q = h × A × ΔT
   Where:
   • h = convection coefficient (depends on fluid, velocity, geometry)
   • A = surface area
   • ΔT = temperature difference
   Example: Steam giving up heat to cooling water in condenser

3. RADIATION:
   Heat transfer via electromagnetic waves
   Formula: Q = σ × A × T⁴
   Where:
   • σ = Stefan-Boltzmann constant
   • A = surface area
   • T = absolute temperature
   Example: Heat loss from hot pipes to environment without direct contact
   Note: Only significant at very high temperatures; often negligible in power plants

HEAT TRANSFER CALCULATIONS IN POWER CYCLES:

Boiler Heat Transfer:
Q_boiler = ṁ × (h_out - h_in) = heat input to steam from fuel

Condenser Heat Transfer:
Q_condenser = ṁ × (h_in - h_out) = heat rejected from steam to cooling water

Heat Exchanger (General):
Q = ṁ_hot × (h_hot,in - h_hot,out) = ṁ_cold × (h_cold,out - h_cold,in)
Heat leaving hot stream = Heat entering cold stream

WORK IN THERMODYNAMIC CYCLES:

Turbine Work:
W_turbine = ṁ × (h_in - h_out) = mechanical work extracted from expanding steam
This work drives the generator

Pump Work:
W_pump = ṁ × (h_out - h_in) = mechanical work required to increase fluid pressure
Must be provided by electric motor

Compressor Work:
W_compressor = ṁ × (h_out - h_in) = mechanical work required to increase gas pressure
Must be provided by turbine or motor

Net Work for Cycle:
W_net = W_turbine - W_pump - W_compressor
This net work is converted to electricity

POWER CALCULATIONS FOR ACTUAL EQUIPMENT:

Turbine Mechanical Power:
P_shaft = ṁ × w × η_turbine
Where η_turbine = isentropic efficiency (85-90%)

Generator Electrical Power:
P_electrical = P_shaft × η_generator
Where η_generator = electrical efficiency (95-99%)

Overall Plant Efficiency:
η_overall = P_electrical / Q_boiler = (W_turbine - W_pump) / Q_boiler × η_generator × η_transformer
Typical: 33-40% coal, 45-55% gas, 33% nuclear

ENERGY CONSERVATION CHECK:
For any process: Q_in - Q_out - W_out + W_in = ΔE_system
Sum of all energy transfers must equal change in system energy.

---

