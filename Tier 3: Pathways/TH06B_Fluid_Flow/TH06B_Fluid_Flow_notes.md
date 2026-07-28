# TH06B_Fluid_Flow - Comprehensive Study Notes

---
id: 24
section: Note
objective: null
---
The mass of fluid passing a reference point per unit time. Formula: ṁ = ρ × V̇ = ρ × v × A. Units: lbm/hr. Where ρ = density (lbm/ft³), v = average velocity (ft/hr), A = cross-sectional area (ft²)

---
id: 25
section: Note
objective: null
---
The volume of fluid passing a reference point per unit time. Formula: Q = V̇ = v × A. Common units: gallons per minute (gpm) or cubic feet per minute (cfm). Related to mass flow rate by: ṁ = ρ × Q

---
id: 26
section: Note
objective: null
---
Flow condition where the mass flow rate into and out of a system or component are equal. Mathematically: ṁ₁ = ṁ₂. This ensures the same quantity of fluid flows past any reference points along a pipe in a given time.

---
id: 27
section: Note
objective: null
---
A measure of a fluid's ability to resist flow. Water at 68°F = 1.0 centipoise (reference standard). For liquids: viscosity DECREASES with increasing temperature. For gases: viscosity INCREASES with increasing temperature. Higher viscosity requires more energy for flow.

---
id: 28
section: Note
objective: null
---
The ratio of a fluid's density compared to water at 60°F. Water has SG = 1.0. Fluids with SG < 1 float in water. Fluids with SG > 1 sink in water. As SG increases, more energy required for flow.

---
id: 29
section: Note
objective: null
---
The mass per unit volume of a substance. For water: approximately 62.4 lbm/ft³ at standard conditions (atmospheric pressure, ~53°F). Density changes with both temperature and pressure. Specific volume (v) is the reciprocal of density.

---
id: 30
section: Note
objective: null
---
Flow regime where fluid layers move smoothly over adjacent layers with minimal mixing. Occurs when Reynolds number NRe < 2,000. Velocity profile is PARABOLIC - zero at walls, maximum at center. Average velocity = half the centerline velocity.

---
id: 31
section: Note
objective: null
---
Flow regime characterized by cross-currents that disturb and mix fluid layers. Occurs when Reynolds number NRe > 3,500. Velocity profile is FLATTENED at centerline. Average velocity is close to centerline velocity. Requires more energy than laminar flow.

---
id: 32
section: Note
objective: null
---
Flow regime between laminar and turbulent. Occurs when Reynolds number is between 2,000 and 3,500. Flow is unstable and alternates between laminar and turbulent characteristics.

---
id: 33
section: Note
objective: null
---
Dimensionless number determining flow type. Formula: NRe = (ρ × v × d) / μ. Where ρ = density, v = velocity, d = pipe diameter, μ = dynamic viscosity. Determines whether flow is laminar, transitional, or turbulent.

---
id: 34
section: Note
objective: null
---
Flow where the fluid is completely in either liquid state OR gaseous state, not a mixture. Most fluid systems are designed for single-phase flow. Easier to analyze and predict than two-phase flow.

---
id: 35
section: Note
objective: null
---
Flow condition where fluid is a mixture of liquid AND vapor phases (e.g., water and steam mixture). Creates much greater resistance to flow than single-phase. Head loss can increase by factor of 100+ as quality increases from 0% to 100%.

---
id: 36
section: Note
objective: null
---
The potential energy component of Bernoulli's equation. Represented by variable 'z' = height above reference point (in feet). Energy of fluid due to its elevation in gravitational field. Same regardless of path to reach that elevation.

---
id: 37
section: Note
objective: null
---
The kinetic energy component of Bernoulli's equation. Formula: v²/(2gc). The height to which flowing fluid would rise in a column if ALL kinetic energy converted to potential energy. Units: feet of head.

---
id: 38
section: Note
objective: null
---
The pressure-volume energy component of Bernoulli's equation. Represented by Pv. Height (in feet) of a fluid column whose weight equals the pressure of the fluid. Accounts for static pressure energy.

---
id: 39
section: Note
objective: null
---
Sum of elevation head (z), velocity head (v²/2gc), and pressure head (Pv). Bernoulli's equation states that total head is constant in ideal flow (no friction, no heat transfer, no work done on/by fluid).

---
id: 40
section: Note
objective: null
---
The conversion of fluid pressure and velocity to heat energy through friction. Represents energy lost from fluid flow perspective, but increases internal energy (temperature). Expressed in feet of head. Denoted as Hf in modified Bernoulli's equation.

---
id: 41
section: Note
objective: null
---
Dimensionless proportionality constant in Darcy's equation accounting for pipe surface roughness. Depends on Reynolds number (laminar vs turbulent) and degree of pipe roughness. Higher friction factor → higher head loss.

---
id: 42
section: Note
objective: null
---
Phenomenon where fluid vapor bubbles form when local pressure drops below saturation pressure. Occurs at pump suction with inadequate NPSH. Causes serious damage to pump impellers. Common cause: insufficient system pressure at pump inlet or excessive heat.

---
id: 43
section: Note
objective: null
---
Phenomenon in compressible flow (steam) where velocity reaches Mach 1 in pipe restriction. Pressure wave forms that opposes applied pressure, limiting mass flow even if downstream pressure decreases. For gases: occurs when Pout/Pin ≈ 0.5

---
id: 44
section: Note
objective: null
---
Pressure fluctuations/surges in piping system when flow is suddenly changed (e.g., rapid valve closure or pump start/stop). Creates sonic wave that travels through system. Can cause pressure spikes up to 20× normal system pressure. Results in pipe damage, component displacement, and potential personnel injury.

---
id: 45
section: Note
objective: null
---
Head (energy) added to fluid by pump. Represented as Hp in modified Bernoulli's equation. Pump does work on fluid (Wp) to overcome friction losses and increase system pressure. Work done by pump: Wp = ṁ × Hp × gc/g

---
id: 46
section: Note
objective: null
---
ṁ = ρ × V̇ = ρ × v × A = (v × A) / v. Where: ṁ = mass flow rate (lbm/hr), ρ = density (lbm/ft³), V̇ = volumetric flow rate (ft³/hr), v = average velocity (ft/hr), A = cross-sectional area (ft²), v = specific volume (ft³/lbm)

---
id: 47
section: Note
objective: null
---
Q = V̇ = v × A. Where: Q = volumetric flow rate (ft³/hr), v = average velocity (ft/hr), A = cross-sectional area (ft²). Related to mass flow by: ṁ = ρ × Q or ṁ = Q / v

---
id: 48
section: Note
objective: null
---
v₁ × A₁ = v₂ × A₂. For incompressible fluids flowing through pipe of varying diameter: when diameter increases, velocity decreases proportionally. When diameter decreases, velocity increases proportionally. Mass flow rate ṁ remains constant.

---
id: 49
section: Note
objective: null
---
NRe = (ρ × v × d) / μ = (v × d) / ν. Where: NRe = Reynolds number (dimensionless), ρ = density (lbm/ft³), v = average velocity (ft/sec), d = pipe diameter (ft), μ = dynamic viscosity (lbm/ft-sec), ν = kinematic viscosity (ft²/sec)

---
id: 50
section: Note
objective: null
---
z₁ + v₁²/(2gc) + Pv₁ = z₂ + v₂²/(2gc) + Pv₂. Total head is constant (no friction, no work). Where: z = elevation head (ft), v²/(2gc) = velocity head (ft), Pv = pressure head (ft)

---
id: 51
section: Note
objective: null
---
z₁ + v₁²/(2gc) + Pv₁ + Hp = z₂ + v₂²/(2gc) + Pv₂ + Hf. Includes pump head (Hp) added and friction head (Hf) lost. Accounts for real-world friction and pump work. gc = gravitational constant (32.2 ft-lbm/lbf-sec²)

---
id: 52
section: Note
objective: null
---
F ∝ √ΔP. For subcooled liquid leaks: flow is proportional to square root of pressure drop. If pressure doubles (2×), flow increases by √2 ≈ 1.41×. At very high velocities or with compressible fluids: F ∝ ΔP

---
id: 53
section: Note
objective: null
---
Hf = f × (L/d) × (v²/(2gc)). Where: Hf = head loss (ft), f = friction factor, L = pipe length (ft), d = pipe diameter (ft), v = average velocity (ft/sec), gc = 32.2 ft-lbm/lbf-sec². Head loss ↑ with ↑L, ↑f, ↑v²; ↓ with ↑d

---
id: 54
section: Note
objective: null
---
Hf = ΔP / (ρ/gc). For level pipe with constant diameter: pressure drop equals head loss. ΔP = Hf × ρ / gc × g. For incompressible fluids (liquids): simplified to ΔP = Hf × ρ / gc

---
id: 55
section: Note
objective: null
---
ΔP = ρ × c × Δv. Where: ΔP = pressure change from water hammer (psi), ρ = fluid density, c = speed of sound in fluid (ft/sec), Δv = change in velocity. Peak pressure depends on velocity change and fluid density, NOT pipe length.

---
id: 56
section: Note
objective: null
---
Tpp = 2L / c. Where: Tpp = duration of pressure pulse (sec), L = straight pipe length (ft), c = speed of sound in fluid (ft/sec). Longer pipes = longer duration of pressure spike.

---
id: 57
section: Note
objective: null
---
Higher viscosity = more energy required for flow. For liquids: viscosity decreases with temperature (easier flow when hot). For gases: viscosity increases with temperature. Important for startup: cold oil in motor bearings can cause high viscosity and bearing damage if started too cold. Minimum bearing temperatures required before pump start.

---
id: 58
section: Note
objective: null
---
For liquids with increasing temperature: viscosity DECREASES, specific gravity DECREASES, density DECREASES. Net effect: less energy required for flow. BUT: as heat added to closed system, pressure INCREASES (confined volume). Risk: heat exchanger rupture if isolated before cooling.

---
id: 59
section: Note
objective: null
---
Laminar flow (NRe < 2,000): smooth, layered, less turbulence, lower head loss for given velocity. Turbulent flow (NRe > 3,500): chaotic, cross-currents, higher head loss. Velocity profile determines friction. Transitional (2,000-3,500): unstable, alternates between types.

---
id: 60
section: Note
objective: null
---
Throttle valve position: closing valve increases L/d ratio → head loss increases. Opening valve decreases L/d → head loss decreases. Pump speed variation: since Hf ∝ v², speed change causes exponential Hf change. Series vs parallel piping: series → Hf increases, parallel → Hf decreases

---
id: 61
section: Note
objective: null
---
Head loss is EXPONENTIAL with velocity: Hf ∝ v². If velocity doubles (2×), head loss increases by (2)² = 4× (quadruples). If velocity triples (3×), head loss increases by (3)² = 9×. Small velocity increases cause large head loss increases.

---
id: 62
section: Note
objective: null
---
In steam generator tube bundle region: water/steam mixture flows simultaneously. Two-phase friction much greater than single-phase. Can cause sudden pressure loss changes → water hammer. Formation/collapse of vapor bubbles cause pressure fluctuations. Flow oscillations difficult to control.

---
id: 63
section: Note
objective: null
---
1. Ensure systems are water-solid (completely filled) before starting pumps. 2. Open high-point casing vents to remove gases. 3. Keep fill systems for low-pressure cooling systems. 4. Remove air from system before startup. 5. Keep vents open until solid stream of fluid comes out.

---
id: 64
section: Note
objective: null
---
1. Initiate flow SLOWLY when starting pumps. 2. Close valves SLOWLY when stopping flow (NOT rapidly). 3. Prevent hot steam flow into cool water systems. 4. Prevent cold water introduction into hot steam systems. 5. Ensure steam traps functional to remove condensate. 6. Install drains at pipe low points to prevent water pockets.

---
id: 65
section: Note
objective: null
---
1. Avoid long horizontal pipes connecting steam-filled tanks with water sources (vulnerable to backflow). 2. Systems with large elevation differences need keep-fill capability. 3. Install drains on low points to prevent water accumulation and steam pocket collapse. 4. Valve materials and design reduce slam effects. 5. Maintenance programs critical for valve performance.

---
id: 66
section: Note
objective: null
---
As closed system heats up: temperature approaches saturation point. Lowest pressure is at pump suction. When saturation reached at suction: water flashes to steam = cavitation. Cavitation damages pump impeller. Risk increases with higher system temperature. Solution: maintain adequate system pressure or limit operating temperature margins.

---
id: 67
section: Note
objective: null
---
Before draining: stop pumps and tag power sources. DO NOT start any pump in a drained system. Pump damage risk from: cavitation (no cooling liquid), gas binding (air in case), metal-to-metal friction. Always ensure system properly filled and vented before startup. High-point vents must be open until solid fluid stream appears.

---
id: 68
section: Note
objective: null
---
Know where pressure and flow indications are located. Verify parameters change as expected based on: operating curves, fluid flow fundamentals, system characteristics. Question unexpected indications or out-of-ordinary conditions. Don't allow system changes that erode margins to conservative operation. Understand how component operation affects system before acting. Predict effects, then verify actual results.
