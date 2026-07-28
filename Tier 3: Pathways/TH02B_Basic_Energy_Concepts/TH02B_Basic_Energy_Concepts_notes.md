# TH02B_Basic_Energy_Concepts - Comprehensive Study Notes

---
id: 202
section: 1.0 INTRODUCTION
objective: null
---
Thermodynamics is the branch of science dealing with energy and the transformation of energy from one form to another. This lesson covers basic energy concepts and terminology vital to understanding thermodynamic topics: the different forms and classifications of energy, the First Law of Thermodynamics (thermodynamics' fundamental principle), how energy converts between forms, the relationships between energy/work/power, and the General Energy Equation -- a fundamental tool for thermodynamic analysis of systems and processes.

---
id: 203
section: 2.0 ENERGY AND THE FIRST LAW OF THERMODYNAMICS
objective: Objective 1A, Objective 2
---
Energy is the capacity to produce an effect -- in thermodynamics, specifically the capacity to perform work or produce heat ('thermodynamics' derives from Greek for 'heat' and 'motion'). The First Law of Thermodynamics is the rule of conservation of energy: energy can neither be created nor destroyed, only transformed from one kind to another, and the sum of energies entering a process/system must equal the sum of energies stored in or leaving it. This governs all key thermodynamic processes in a power plant: heat transfer from the reactor core to reactor coolant, heat transfer from reactor coolant to steam in the steam generator, work done by the turbine, heat transfer/cooling of steam in the condenser, and work done by pumps to sustain flow between plant components. Energy is classified into two categories: stored energy (energy contained by a mass because of its properties/physical condition) and transient energy (energy associated with the change of one or more stored energy forms into other stored energy forms).

---
id: 204
section: STORED VS. TRANSIENT ENERGY FORMS (OVERVIEW)
objective: Objective 3A
---
For thermodynamic analysis, there are four forms of stored energy: Potential Energy, Kinetic Energy, Internal Energy, and Flow Energy. There are two forms of transient energy: Heat and Work.

---
id: 205
section: 2.1.1 POTENTIAL ENERGY (PE)
objective: Objective 3B
---
Potential energy is the energy a substance possesses due to its position (differential height) relative to a reference point, depending on mass (m) and elevation (z): PE = mz(g/gc), where g is acceleration due to gravity (32.2 ft/sec^2) and gc is the gravitational constant (32.2 ft-lbm/lbf-sec^2). Since g numerically equals gc in most practical calculations, PE in ft-lbf is numerically equal to mass (lbm) times height (ft) above a reference level. To express PE in BTUs, Joule's constant (J = 778 ft-lbf/BTU) is applied. The potential energy of even a sizable mass at a modest elevation (e.g. one lbm at 50 ft) turns out to be quite small in BTU terms.

---
id: 206
section: 2.1.2 KINETIC ENERGY (KE)
objective: Objective 3C
---
Kinetic energy is the energy a substance possesses due to its motion: KE = mv^2/(2*gc), where m is mass (lbm), v is velocity (ft/sec), and gc is the gravitational constant. As with potential energy, Joule's constant converts KE to BTUs. Even considerable velocity (e.g. 100 ft/sec, about 68.2 mph) for one lbm of mass produces only a small kinetic energy value in BTU terms.

---
id: 207
section: 2.1.3 INTERNAL ENERGY (U)
objective: Objective 3D
---
Potential and kinetic energy are macroscopic forms of energy (observable properties of a quantity of matter). Internal energy comprises the microscopic forms of energy a substance possesses due to rotation, vibration, translation, and interactions among its molecules -- these individual forms can't be evaluated directly, but techniques exist to evaluate the change in their sum. Internal energy (U) is measured in BTU. Specific internal energy (u) is internal energy per unit mass (u = U/m), measured in BTU/lbm.

---
id: 208
section: 2.1.4 FLOW ENERGY (PV)
objective: Objective 3E
---
Flow energy is the energy a fluid possesses due to its pressure and volume -- a fluid under pressure has the capacity to do work if permitted to expand. Flow energy (also called P-energy or flow work) is measured in ft-lbf. Specific flow energy (Pv) is flow energy per unit mass, equal to pressure times specific volume.

---
id: 209
section: 2.1.5 LAW OF CONSERVATION OF MECHANICAL ENERGY
objective: Objective 4
---
For a frictionless system, the sum of potential energy and kinetic energy is constant -- mechanical energy is conserved. Example: a stationary object at height h1 has potential energy but no kinetic energy (v=0); as it falls freely, potential energy decreases while kinetic energy increases by the same amount, so their sum stays constant throughout the fall. At the moment it hits the ground, all its energy is kinetic and potential energy is zero (h=0).

---
id: 210
section: 2.2.1 HEAT (Q)
objective: Objective 1B
---
Heat is energy in transition due to a temperature difference, either between two bodies/substances or between two locations within a substance -- heat flows from hotter to colder, and there's no heat flow without a temperature difference. Heat is measured in BTUs: the energy needed to raise 1 lbm of water by 1F at standard temperature and pressure (STP). Specific heat capacity (cp) indicates a substance's ability to transfer heat -- the energy needed to raise 1 lbm of the substance by 1F (BTU/lbm-F). Water's specific heat capacity is 1.0 BTU/lbm-F at STP, and increases as water temperature increases.

---
id: 211
section: 2.2.2 WORK (W)
objective: Objective 1C
---
Work is transient energy associated with moving a mass some distance -- the product of the force needed to move the mass and the distance moved (W = F x d, in ft-lbf; SI units are Newton-meters, or joules). Work is transient because energy is changing from one stored form to another as work is done (e.g. a released, frictionless plunger in a compressed-air cylinder: internal energy stored in the air becomes potential energy in the risen plunger mass -- mechanical work is simply the physical manifestation of this energy transfer). Thermodynamics is concerned with two types of work: mechanical work and flow work.

---
id: 212
section: 3.1 MECHANICAL WORK
objective: null
---
Mechanical work is the movement of a substance to accomplish a purpose -- the basis behind most engineering systems (e.g. a turbine, where thermal energy of steam converts to mechanical work turning the turbine). Calculated using W = F x d.

---
id: 213
section: 3.2 FLOW WORK
objective: null
---
Flow work is the work required to maintain a continuous, steady flow of fluid -- the energy converted to move a volume of fluid through a distance across a boundary in a pipe. Since force = pressure x area (F = PA) and volume = area x length (V = AL), flow work simplifies to WFlow = PV (pressure times volume, in ft-lbf; convertible to BTU via Joule's constant). Flow work is sometimes called flow energy -- same meaning. Mechanical work involves moving solid objects a distance (force x distance); flow work involves a flowing fluid (pressure applied x volume moved).

---
id: 214
section: 3.3 POWER
objective: Objective 1D
---
Power is the rate of doing work -- work done per unit of time. Measured in horsepower (American Engineering System) or watts (SI). An engine rated at 50 horsepower can provide 27,500 ft-lbf of work per second. Relationship summary: energy is the ability to do work; work measures the amount of energy converted to perform a task; power measures the amount of work done per unit of time.

---
id: 215
section: 4.1 ENTHALPY (H)
objective: Objective 5A
---
Enthalpy is a measure of the energy content of a fluid due to its temperature, pressure, and volume -- the sum of its internal energy (U) and its PV (flow) energy: H = U + PV. Specific enthalpy (h), in BTU/lbm, is the sum of specific internal energy (u) and specific flow energy (Pv): h = u + Pv.

---
id: 216
section: 4.2 ENTROPY (S)
objective: Objective 5B
---
Entropy is a measure of the unavailable energy contained in a fluid at a specific temperature, pressure, and volume -- it expresses the amount of disorder in a system. Specific entropy (s), in BTU/lbm-R, is the unavailable energy per unit mass at a specific temperature and pressure. Entropy is a difficult concept, most important when considering the Second Law of Thermodynamics and work processes in a thermodynamic cycle.

---
id: 217
section: 5.0 THE GENERAL ENERGY EQUATION
objective: Objective 6
---
The First Law means energy entering a process/system must equal energy leaving -- no energy is created or destroyed. The energy contained by a system can be any combination of potential, kinetic, internal, and PV energies (the total stored energy of the system), which can only change via heat transferred into/out of the system or work done on/by the system. This 'energy balance' -- stored energy entering (KE, PE, U, PV) plus transient energy added (Qin, Win) balanced against stored energy leaving (KE, PE, U, PV) plus transient energy removed (Qout, Wout) -- is the General Energy Equation. Since enthalpy = U + PV, the equation can be rewritten in terms of enthalpy. For a closed system with no change in potential or kinetic energy, the General Energy Equation simplifies to: change in enthalpy (h) = heat transferred to the system (q) - work done by the system (w). Sign convention: q is positive if heat is added to the system, negative if removed; w is positive if work is done BY the system, negative if work is done ON the system. For a steady-flow system, the equation can also be written in terms of rate of energy transfer (Btu/hr) -- the rate of work done by the system is the system's power output, and the rate of heat transfer plus mass flow rate are commonly measured quantities.
