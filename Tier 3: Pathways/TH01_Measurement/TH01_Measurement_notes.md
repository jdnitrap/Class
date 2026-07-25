# TH01_Measurement - Comprehensive Study Notes

## Note ID: 6
### SYSTEMS OF MEASUREMENT AND UNIT CONVERSION:

TWO PRIMARY SYSTEMS:

AMERICAN ENGINEERING SYSTEM (ENGLISH ENGINEERS SYSTEM):
• Force: pounds force (lbf), Mass: pounds mass (lbm)
• Length: feet (ft), inches (in)
• Temperature: Fahrenheit (°F)
• Pressure: psi (pounds per square inch), psf (pounds per square foot)
• Energy/Work: British Thermal Units (Btu), where 1 Btu = 778.16 ft·lbf
• Power: horsepower (hp), where 1 hp = 550 ft·lbf/s
• Flow rate: gallons per minute (gpm), pounds per hour (lbm/h)
• Density: pounds per cubic foot (lbm/ft³)
• Viscosity: pounds per foot-second (lbm/ft·s) or centipoise (cp)

INTERNATIONAL SYSTEM (SI/METRIC):
• Force: Newtons (N), where 1 N = 1 kg·m/s²
• Mass: kilograms (kg)
• Length: meters (m)
• Temperature: Celsius (°C) or Kelvin (K) - required for thermodynamic calculations
• Pressure: Pascal (Pa), kilopascal (kPa), or bar (1 bar = 100 kPa = 14.5 psi)
• Energy/Work: Joules (J), where 1 J = 1 N·m
• Power: Watts (W), where 1 W = 1 J/s or 1 N·m/s
• Flow rate: cubic meters per second (m³/s), kilograms per second (kg/s)
• Density: kilograms per cubic meter (kg/m³)
• Viscosity: Pascal·seconds (Pa·s) or centipoise (cp)

ADVANTAGES OF EACH SYSTEM:
English System advantages:
  • Familiar to engineers with traditional training
  • Practical units often match real-world dimensions
  • Historical database and references available

SI Advantages:
  • Decimal-based conversions (powers of 10)
  • Used internationally in modern applications
  • Simpler calculations (no conversion factors like 778)
  • Standard in most modern research and new equipment

UNIT CONVERSION PROCESS:

Step 1: Identify given units and desired units
Step 2: Write conversion factor with given units in denominator, desired units in numerator
Step 3: Multiply original value by conversion factor
Step 4: Cancel units algebraically and solve

EXAMPLE: Convert 50 psi to kPa
→ 50 psi × (6.895 kPa/psi) = 344.75 kPa

COMMON CONVERSION FACTORS (Memorize these):
• Length: 1 ft = 0.3048 m, 1 inch = 2.54 cm
• Mass: 1 lbm = 0.4536 kg, 1 kg = 2.205 lbm
• Pressure: 1 psi = 6.895 kPa, 1 bar = 14.5 psi, 1 atm = 14.696 psia
• Energy: 1 Btu = 1055.06 J = 778.16 ft·lbf
• Power: 1 hp = 0.7457 kW, 1 W = 1 J/s
• Flow: 1 gpm = 6.309 × 10⁻⁵ m³/s, 1 gpm = 0.06309 L/s

DIMENSIONAL ANALYSIS:
Method to verify equations are dimensionally consistent:
• Each term in an equation must have same dimensions
• Example: Velocity (ft/s) = Distance (ft) / Time (s) ✓ Correct
• Use to catch errors in calculations

---

## Note ID: 7
### TEMPERATURE MEASUREMENT SCALES:

ABSOLUTE ZERO AND MOLECULAR MOTION:
Absolute zero = point where all molecular motion theoretically stops
• 0 K = -273.15°C = -459.67°R = -459.67°F
• NO temperature below absolute zero is physically possible
• All thermodynamic equations REQUIRE absolute temperature for correct results

RELATIVE TEMPERATURE SCALES (Reference Point Based):

FAHRENHEIT (°F) - American Standard:
• Freezing point of water: 32°F
• Boiling point of water (at 1 atm): 212°F
• Temperature interval: 180 degrees between freeze and boil
• Used in American Engineering System
• Familiar to US population but poor for calculations
• Formula for conversion: °F = (°C × 1.8) + 32
• Inverse formula: °C = (°F - 32) / 1.8
• Resolution: Decimal fractions of degrees possible
• Applications: Building temperature control, weather reports, cooking

CELSIUS (°C) - International Standard for Relative Scale:
• Freezing point of water: 0°C (convenient reference)
• Boiling point of water (at 1 atm): 100°C (convenient reference)
• Temperature interval: 100 degrees between freeze and boil
• Smaller degree interval than Fahrenheit = more precise
• International standard for non-thermodynamic applications
• Formula for conversion: °C = (°F - 32) / 1.8
• Applications: Scientific work, weather, building control, food storage

SCALE COMPARISON EXAMPLE:
Room temperature (68°F):
= (68 - 32) / 1.8 = 36 / 1.8 = 20°C
Both scales show same physical temperature, just different numbers

ABSOLUTE TEMPERATURE SCALES (Zero = No Molecular Motion):

RANKINE (°R) - Absolute Fahrenheit Scale:
• Corresponds directly to Fahrenheit
• Absolute zero: 0°R = -459.67°F
• Boiling point of water: 671.67°R = 212°F
• Formula: °R = °F + 459.67
• Maintains same degree interval as Fahrenheit (1°F = 1°R interval)
• Rarely used, but appears in some engineering equations
• Used when working with English Engineering System in thermodynamics

KELVIN (K) - Absolute Celsius Scale:
• Corresponds directly to Celsius
• Absolute zero: 0 K = -273.15°C
• Boiling point of water: 373.15 K = 100°C
• Formula: K = °C + 273.15 (simplified: K ≈ °C + 273)
• Maintains same degree interval as Celsius (1°C = 1 K interval)
• STANDARD for all thermodynamic calculations
• Required in ALL scientific and engineering equations
• Example: Steam table calculations MUST use Kelvin

WHY ABSOLUTE TEMPERATURE IS REQUIRED:
Thermodynamic equations use temperature ratios and relationships that only work with absolute scales:
• Ideal Gas Law: PV = nRT (T must be absolute)
• Efficiency calculations: η = 1 - (T_cold/T_hot) (requires absolute T)
• Temperature-dependent rates: k = A × e^(-Ea/RT) (requires absolute T)

COMMON ERROR: Using relative temperature in thermodynamic equations produces wrong answers
Example Error: Assuming Δ°C = ΔK
• Temperature difference: ΔT is same in both scales
• But equation T₁/T₂ requires absolute temperature (K or R)

TEMPERATURE CONVERSION QUICK REFERENCE:
32°F = 0°C = 273.15 K = 491.67°R
212°F = 100°C = 373.15 K = 671.67°R
Room temp (68°F) = 20°C = 293.15 K = 527.67°R

---

## Note ID: 8
### SYSTEMS AND SYSTEM PROPERTIES:

DEFINITION OF A THERMODYNAMIC SYSTEM:
A quantity of matter or space separated from surroundings by a boundary.
• Everything within the boundary = THE SYSTEM
• Everything outside the boundary = THE SURROUNDINGS
• The boundary separates system from surroundings (real or imaginary)

THREE SYSTEM TYPES:

ISOLATED (CLOSED) SYSTEM:
• Definition: No mass transfer across boundary, no energy transfer
• Theoretical ideal; true isolated systems do not exist in reality
• All real systems exchange something with surroundings
• Used for theoretical calculations and limiting case analysis
• Example (closest to ideal): Perfectly insulated, sealed container

CLOSED SYSTEM:
• Definition: No mass transfer across boundary; energy transfer (heat/work) may occur
• Mass inside remains constant
• Boundary allows heat and work to transfer
• MOST COMMON for thermodynamic analysis
• Real-world examples:
  - Fixed mass of gas in a cylinder (internal combustion engine)
  - Sealed reactor vessel with piping for steam/water but no inlet/outlet
  - Closed piping section between two isolation valves
  - Accumulator with fixed charge of nitrogen or gas
  - Constant pressure cooker (no mass enters/leaves)

OPEN SYSTEM (CONTROL VOLUME):
• Definition: Mass transfer across boundary (inlet and/or outlet flows); energy transfer occurs
• Mass inside changes over time as flow enters and exits
• MOST REALISTIC for practical power plant equipment
• Requires mass balance and energy balance across control volume
• Real-world examples:
  - Turbine with steam inlet and exhaust outlet
  - Compressor with air inlet and discharge outlet
  - Boiler with water inlet, steam outlet, and fuel input
  - Pump with inlet and discharge piping
  - Condenser with exhaust steam inlet and hot cooling water inlet
  - Heat exchanger with two fluid streams

SELECTION GUIDE:
Use CLOSED SYSTEM when: analyzing fixed mass of substance (single piece of equipment in isolation)
Use OPEN SYSTEM when: analyzing flow through equipment (practical equipment in power plant operation)

WORKING FLUID:
The medium (substance) within a system that stores, transfers, or absorbs energy.

Characteristics of Working Fluid:
• Must be able to absorb and reject heat
• Must be compatible with system materials
• Must have predictable properties across operating range
• Should have high specific heat (stores more energy per unit mass)
• Should have low viscosity (flows easily, reduces pumping work)

Common Working Fluids in Power Plants:
• Steam (most common) - absorbs heat in boiler, rejects in condenser
• Water (liquid form) - circulates through boilers and condensers
• Refrigerant - absorbs and rejects heat in refrigeration systems
• Gas (air, nitrogen) - used in gas turbines and auxiliary systems
• Oil - used in lubrication and some heat transfer systems

SYSTEM PROPERTIES - FUNDAMENTAL CLASSIFICATION:

INTENSIVE PROPERTIES (Independent of Mass):
These properties do NOT change with the amount of material.
• Pressure (P) - force per unit area [psi, kPa, Pa]
• Temperature (T) - measure of molecular motion [°F, °C, K, R]
• Density (ρ) - mass per unit volume [lbm/ft³, kg/m³]
• Specific volume (v) - volume per unit mass = 1/ρ [ft³/lbm, m³/kg]
• Velocity (V) - speed of fluid motion [ft/s, m/s]
• Height/Elevation (z) - vertical position [ft, m]
• Enthalpy (h) - specific heat content [Btu/lbm, J/kg]
• Entropy (s) - specific disorder/unavailable energy [Btu/(lbm·R), J/(kg·K)]
• Specific internal energy (u) - specific energy stored in substance [Btu/lbm, J/kg]

Why Intensive: These properties are same regardless of how much material you have.
Example: Water at 100°C has same temperature whether you have 1 kg or 100 kg.

EXTENSIVE PROPERTIES (Dependent on Mass):
These properties CHANGE with the amount of material.
• Volume (V) - total space occupied [ft³, m³]
• Mass (m) - total matter content [lbm, kg]
• Weight (W) - gravitational force on mass = m × g [lbf, N]
• Internal energy (U) - total energy stored = u × m [Btu, J]
• Total enthalpy (H) - total heat content = h × m [Btu, J]
• Total entropy (S) - total disorder = s × m [Btu/R, J/K]

Why Extensive: Doubling the material doubles these properties.
Example: 1 kg of water has half the volume of 2 kg of water (at same T and P).

RELATIONSHIP BETWEEN INTENSIVE AND EXTENSIVE:
Specific properties (intensive) = Total properties (extensive) / Mass

Examples:
• Specific volume (v) = Total volume (V) / Mass (m) = V/m
• Specific enthalpy (h) = Total enthalpy (H) / Mass (m) = H/m
• Specific internal energy (u) = Total internal energy (U) / Mass (m) = U/m

PRACTICAL APPLICATION:
When analyzing a steam system:
• Intensive: Steam at 400 psia and 600°F has specific properties from steam tables
• Extensive: 100 lbm of that steam has 100 times the total internal energy
• Calculation: U_total = 100 lbm × u_specific(from steam table)

IMPORTANT NOTE:
All thermodynamic equations use SPECIFIC (intensive) properties, requiring division by mass for correct results.

---

