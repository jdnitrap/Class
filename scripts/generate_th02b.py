#!/usr/bin/env python3
"""One-off generator for TH02B_Basic_Energy_Concepts content, built from
the uploaded official lecture (BNT-TH02Br05b). Follows
CONTENT_INGESTION.md's Step 4 YAML frontmatter format directly."""

import yaml
from pathlib import Path

ROOT = Path("Tier 3: Pathways/TH02B_Basic_Energy_Concepts")
ROOT.mkdir(parents=True, exist_ok=True)

NOTE_START_ID = 202

notes = [
("1.0 INTRODUCTION", None,
 "Thermodynamics is the branch of science dealing with energy and the transformation of energy from one form to another. This lesson covers basic energy concepts and terminology vital to understanding thermodynamic topics: the different forms and classifications of energy, the First Law of Thermodynamics (thermodynamics' fundamental principle), how energy converts between forms, the relationships between energy/work/power, and the General Energy Equation -- a fundamental tool for thermodynamic analysis of systems and processes."),
("2.0 ENERGY AND THE FIRST LAW OF THERMODYNAMICS", "Objective 1A, Objective 2",
 "Energy is the capacity to produce an effect -- in thermodynamics, specifically the capacity to perform work or produce heat ('thermodynamics' derives from Greek for 'heat' and 'motion'). The First Law of Thermodynamics is the rule of conservation of energy: energy can neither be created nor destroyed, only transformed from one kind to another, and the sum of energies entering a process/system must equal the sum of energies stored in or leaving it. This governs all key thermodynamic processes in a power plant: heat transfer from the reactor core to reactor coolant, heat transfer from reactor coolant to steam in the steam generator, work done by the turbine, heat transfer/cooling of steam in the condenser, and work done by pumps to sustain flow between plant components. Energy is classified into two categories: stored energy (energy contained by a mass because of its properties/physical condition) and transient energy (energy associated with the change of one or more stored energy forms into other stored energy forms)."),
("STORED VS. TRANSIENT ENERGY FORMS (OVERVIEW)", "Objective 3A",
 "For thermodynamic analysis, there are four forms of stored energy: Potential Energy, Kinetic Energy, Internal Energy, and Flow Energy. There are two forms of transient energy: Heat and Work."),
("2.1.1 POTENTIAL ENERGY (PE)", "Objective 3B",
 "Potential energy is the energy a substance possesses due to its position (differential height) relative to a reference point, depending on mass (m) and elevation (z): PE = mz(g/gc), where g is acceleration due to gravity (32.2 ft/sec^2) and gc is the gravitational constant (32.2 ft-lbm/lbf-sec^2). Since g numerically equals gc in most practical calculations, PE in ft-lbf is numerically equal to mass (lbm) times height (ft) above a reference level. To express PE in BTUs, Joule's constant (J = 778 ft-lbf/BTU) is applied. The potential energy of even a sizable mass at a modest elevation (e.g. one lbm at 50 ft) turns out to be quite small in BTU terms."),
("2.1.2 KINETIC ENERGY (KE)", "Objective 3C",
 "Kinetic energy is the energy a substance possesses due to its motion: KE = mv^2/(2*gc), where m is mass (lbm), v is velocity (ft/sec), and gc is the gravitational constant. As with potential energy, Joule's constant converts KE to BTUs. Even considerable velocity (e.g. 100 ft/sec, about 68.2 mph) for one lbm of mass produces only a small kinetic energy value in BTU terms."),
("2.1.3 INTERNAL ENERGY (U)", "Objective 3D",
 "Potential and kinetic energy are macroscopic forms of energy (observable properties of a quantity of matter). Internal energy comprises the microscopic forms of energy a substance possesses due to rotation, vibration, translation, and interactions among its molecules -- these individual forms can't be evaluated directly, but techniques exist to evaluate the change in their sum. Internal energy (U) is measured in BTU. Specific internal energy (u) is internal energy per unit mass (u = U/m), measured in BTU/lbm."),
("2.1.4 FLOW ENERGY (PV)", "Objective 3E",
 "Flow energy is the energy a fluid possesses due to its pressure and volume -- a fluid under pressure has the capacity to do work if permitted to expand. Flow energy (also called P-energy or flow work) is measured in ft-lbf. Specific flow energy (Pv) is flow energy per unit mass, equal to pressure times specific volume."),
("2.1.5 LAW OF CONSERVATION OF MECHANICAL ENERGY", "Objective 4",
 "For a frictionless system, the sum of potential energy and kinetic energy is constant -- mechanical energy is conserved. Example: a stationary object at height h1 has potential energy but no kinetic energy (v=0); as it falls freely, potential energy decreases while kinetic energy increases by the same amount, so their sum stays constant throughout the fall. At the moment it hits the ground, all its energy is kinetic and potential energy is zero (h=0)."),
("2.2.1 HEAT (Q)", "Objective 1B",
 "Heat is energy in transition due to a temperature difference, either between two bodies/substances or between two locations within a substance -- heat flows from hotter to colder, and there's no heat flow without a temperature difference. Heat is measured in BTUs: the energy needed to raise 1 lbm of water by 1F at standard temperature and pressure (STP). Specific heat capacity (cp) indicates a substance's ability to transfer heat -- the energy needed to raise 1 lbm of the substance by 1F (BTU/lbm-F). Water's specific heat capacity is 1.0 BTU/lbm-F at STP, and increases as water temperature increases."),
("2.2.2 WORK (W)", "Objective 1C",
 "Work is transient energy associated with moving a mass some distance -- the product of the force needed to move the mass and the distance moved (W = F x d, in ft-lbf; SI units are Newton-meters, or joules). Work is transient because energy is changing from one stored form to another as work is done (e.g. a released, frictionless plunger in a compressed-air cylinder: internal energy stored in the air becomes potential energy in the risen plunger mass -- mechanical work is simply the physical manifestation of this energy transfer). Thermodynamics is concerned with two types of work: mechanical work and flow work."),
("3.1 MECHANICAL WORK", None,
 "Mechanical work is the movement of a substance to accomplish a purpose -- the basis behind most engineering systems (e.g. a turbine, where thermal energy of steam converts to mechanical work turning the turbine). Calculated using W = F x d."),
("3.2 FLOW WORK", None,
 "Flow work is the work required to maintain a continuous, steady flow of fluid -- the energy converted to move a volume of fluid through a distance across a boundary in a pipe. Since force = pressure x area (F = PA) and volume = area x length (V = AL), flow work simplifies to WFlow = PV (pressure times volume, in ft-lbf; convertible to BTU via Joule's constant). Flow work is sometimes called flow energy -- same meaning. Mechanical work involves moving solid objects a distance (force x distance); flow work involves a flowing fluid (pressure applied x volume moved)."),
("3.3 POWER", "Objective 1D",
 "Power is the rate of doing work -- work done per unit of time. Measured in horsepower (American Engineering System) or watts (SI). An engine rated at 50 horsepower can provide 27,500 ft-lbf of work per second. Relationship summary: energy is the ability to do work; work measures the amount of energy converted to perform a task; power measures the amount of work done per unit of time."),
("4.1 ENTHALPY (H)", "Objective 5A",
 "Enthalpy is a measure of the energy content of a fluid due to its temperature, pressure, and volume -- the sum of its internal energy (U) and its PV (flow) energy: H = U + PV. Specific enthalpy (h), in BTU/lbm, is the sum of specific internal energy (u) and specific flow energy (Pv): h = u + Pv."),
("4.2 ENTROPY (S)", "Objective 5B",
 "Entropy is a measure of the unavailable energy contained in a fluid at a specific temperature, pressure, and volume -- it expresses the amount of disorder in a system. Specific entropy (s), in BTU/lbm-R, is the unavailable energy per unit mass at a specific temperature and pressure. Entropy is a difficult concept, most important when considering the Second Law of Thermodynamics and work processes in a thermodynamic cycle."),
("5.0 THE GENERAL ENERGY EQUATION", "Objective 6",
 "The First Law means energy entering a process/system must equal energy leaving -- no energy is created or destroyed. The energy contained by a system can be any combination of potential, kinetic, internal, and PV energies (the total stored energy of the system), which can only change via heat transferred into/out of the system or work done on/by the system. This 'energy balance' -- stored energy entering (KE, PE, U, PV) plus transient energy added (Qin, Win) balanced against stored energy leaving (KE, PE, U, PV) plus transient energy removed (Qout, Wout) -- is the General Energy Equation. Since enthalpy = U + PV, the equation can be rewritten in terms of enthalpy. For a closed system with no change in potential or kinetic energy, the General Energy Equation simplifies to: change in enthalpy (h) = heat transferred to the system (q) - work done by the system (w). Sign convention: q is positive if heat is added to the system, negative if removed; w is positive if work is done BY the system, negative if work is done ON the system. For a steady-flow system, the equation can also be written in terms of rate of energy transfer (Btu/hr) -- the rate of work done by the system is the system's power output, and the rate of heat transfer plus mass flow rate are commonly measured quantities."),
]

flashcards = [
("What is the First Law of Thermodynamics?", "Conservation of energy -- energy can neither be created nor destroyed, only transformed between forms; energy entering a system must equal energy stored in or leaving it."),
("What are the two general categories of energy in thermodynamics?", "Stored energy (energy contained by a mass due to its properties) and transient energy (energy associated with changing one stored energy form into another)."),
("Name the four forms of stored energy.", "Potential energy, kinetic energy, internal energy, and flow energy."),
("Name the two forms of transient energy.", "Heat and work."),
("What does potential energy depend on?", "Mass and elevation (height) relative to a reference point."),
("What does kinetic energy depend on?", "Mass and velocity."),
("What is internal energy?", "The sum of all microscopic energy forms in a fluid, due to rotation, vibration, translation, and molecular interactions."),
("What is specific internal energy?", "Internal energy per unit mass (u = U/m), in BTU/lbm."),
("What is flow energy?", "The energy a fluid possesses due to its pressure and volume -- also called P-energy or flow work."),
("State the Law of Conservation of Mechanical Energy.", "For a frictionless system, the sum of potential and kinetic energy is constant."),
("What is heat?", "Energy in transition due to a temperature difference; it flows from hotter to colder, with no flow if there's no temperature difference."),
("What is specific heat capacity?", "The energy needed to raise 1 lbm of a substance's temperature by 1F, in BTU/lbm-F."),
("What is water's specific heat capacity at STP?", "1.0 BTU/lbm-F."),
("What is work, and how is it calculated?", "Transient energy from moving a mass some distance; W = F x d (force times distance)."),
("What is the difference between mechanical work and flow work?", "Mechanical work moves a solid object a distance (force x distance); flow work moves a flowing fluid (pressure x volume)."),
("What is the equation for flow work?", "WFlow = PV (pressure times volume)."),
("What is power?", "The rate of doing work -- work done per unit of time, measured in horsepower or watts."),
("How much work per second can a 50-horsepower engine provide?", "27,500 ft-lbf per second."),
("What is enthalpy?", "A measure of a fluid's energy content due to temperature, pressure, and volume -- the sum of internal energy (U) and PV energy: H = U + PV."),
("What is specific enthalpy?", "h = u + Pv (specific internal energy plus specific flow energy), in BTU/lbm."),
("What is entropy?", "A measure of the unavailable energy in a fluid at a given state, expressing the amount of disorder in a system."),
("What is the General Energy Equation for a closed system with no PE/KE change?", "Change in enthalpy (h) = heat transferred to the system (q) - work done by the system (w)."),
("In the General Energy Equation's sign convention, when is q positive?", "When heat is added to the system (negative if heat is removed)."),
("In the General Energy Equation's sign convention, when is w positive?", "When work is done BY the system (negative if work is done ON the system)."),
("What conversion factor is used to express mechanical energy (ft-lbf) in BTUs?", "Joule's constant, J = 778 ft-lbf/BTU."),
("For a steady-flow system, what does the rate-form of the General Energy Equation's work term represent?", "The power output of the system."),
]

questions = [
("What does the First Law of Thermodynamics state?",
 {"a": "Energy always increases over time", "b": "Energy can neither be created nor destroyed, only transformed between forms", "c": "Heat always flows from cold to hot", "d": "Work and heat are unrelated quantities"},
 "b", "The First Law of Thermodynamics is the rule of conservation of energy: energy can't be created or destroyed, only transformed, and energy in must equal energy stored plus energy out."),
("Which of the following is a form of STORED energy?",
 {"a": "Heat", "b": "Work", "c": "Internal energy", "d": "Power"},
 "c", "The four forms of stored energy are potential, kinetic, internal, and flow energy. Heat and work are transient energy forms."),
("Which of the following is a form of TRANSIENT energy?",
 {"a": "Potential energy", "b": "Kinetic energy", "c": "Flow energy", "d": "Work"},
 "d", "The two forms of transient energy are heat and work; potential, kinetic, internal, and flow energy are stored energy forms."),
("Potential energy depends on which two factors?",
 {"a": "Temperature and pressure", "b": "Mass and elevation (height)", "c": "Velocity and time", "d": "Pressure and volume"},
 "b", "Potential energy depends on the amount of mass and its elevation (height) relative to a reference point."),
("Kinetic energy depends on which two factors?",
 {"a": "Mass and velocity", "b": "Pressure and volume", "c": "Temperature and mass", "d": "Height and pressure"},
 "a", "Kinetic energy depends on mass and velocity."),
("What is internal energy?",
 {"a": "Energy due to a substance's elevation", "b": "The sum of microscopic energy forms due to molecular rotation, vibration, translation, and interaction", "c": "Energy due to fluid pressure and volume alone", "d": "The rate of doing work"},
 "b", "Internal energy is the sum of all microscopic forms of energy in a substance, arising from molecular rotation, vibration, translation, and interactions."),
("What is flow energy also commonly called?",
 {"a": "Kinetic energy", "b": "P-energy or flow work", "c": "Latent heat", "d": "Entropy"},
 "b", "Flow energy is frequently referred to as P-energy or flow work."),
("The Law of Conservation of Mechanical Energy applies under what condition?", 
 {"a": "Only when heat is added", "b": "For a system with no friction", "c": "Only above the critical point", "d": "Only for gases, not liquids"},
 "b", "For a system with no friction, the sum of potential and kinetic energy is constant -- mechanical energy is conserved."),
("What is heat, thermodynamically speaking?",
 {"a": "Energy in transition due to a temperature difference", "b": "A form of stored energy", "c": "The same thing as work", "d": "A measure of disorder"},
 "a", "Heat is energy in transition due to a difference in temperature; it flows from hotter to colder regions."),
("What is water's specific heat capacity at standard temperature and pressure?",
 {"a": "0.5 BTU/lbm-F", "b": "1.0 BTU/lbm-F", "c": "2.0 BTU/lbm-F", "d": "778 BTU/lbm-F"},
 "b", "Water's specific heat capacity is 1.0 BTU/lbm-F at STP, and increases as temperature increases."),
("How is work calculated?",
 {"a": "W = m x v", "b": "W = F x d (force times distance)", "c": "W = P x T", "d": "W = U + PV"},
 "b", "Work equals the force applied times the distance through which it acts (W = F x d)."),
("What is the key difference between mechanical work and flow work?",
 {"a": "Mechanical work moves solids (force x distance); flow work moves fluids (pressure x volume)", "b": "They are exactly the same thing", "c": "Flow work only applies to gases", "d": "Mechanical work has no units"},
 "a", "Mechanical work is associated with moving solid objects (force x distance); flow work is associated with a flowing fluid (pressure x volume moved)."),
("What is the equation for flow work?",
 {"a": "WFlow = F x d", "b": "WFlow = PV", "c": "WFlow = m x v^2", "d": "WFlow = U - PV"},
 "b", "Flow work simplifies to WFlow = PV (pressure times volume), since force = pressure x area and volume = area x length."),
("What is power?",
 {"a": "The total energy in a system", "b": "The rate of doing work (work done per unit time)", "c": "The same thing as enthalpy", "d": "A form of stored energy"},
 "b", "Power is the rate of doing work -- the work done per unit of time, measured in horsepower or watts."),
("An engine is rated at 50 horsepower. How much work can it provide per second?",
 {"a": "50 ft-lbf", "b": "778 ft-lbf", "c": "27,500 ft-lbf", "d": "1.0 ft-lbf"},
 "c", "A 50-horsepower engine can provide 27,500 ft-lbf of work per second."),
("What is enthalpy?",
 {"a": "A measure of disorder in a system", "b": "The sum of a fluid's internal energy and PV energy (H = U + PV)", "c": "The rate of heat transfer", "d": "A form of transient energy"},
 "b", "Enthalpy (H) is a measure of a fluid's energy content due to temperature, pressure, and volume, equal to internal energy plus PV energy: H = U + PV."),
("What is the equation for specific enthalpy?",
 {"a": "h = u + Pv", "b": "h = u - Pv", "c": "h = m x v", "d": "h = Q/W"},
 "a", "Specific enthalpy equals specific internal energy plus specific flow energy: h = u + Pv."),
("What is entropy a measure of?",
 {"a": "Total system mass", "b": "The unavailable energy (disorder) in a fluid at a specific state", "c": "The rate of work done", "d": "The specific heat capacity of water"},
 "b", "Entropy measures the unavailable energy contained in a fluid at a specific temperature, pressure, and volume -- expressing the system's disorder."),
("For a closed system with no change in potential or kinetic energy, the General Energy Equation reduces to:",
 {"a": "Change in enthalpy = heat transferred to the system minus work done by the system", "b": "Change in entropy = mass flow rate", "c": "Power = force times distance", "d": "Enthalpy = kinetic energy plus potential energy"},
 "a", "For a closed system with no PE/KE change: change in enthalpy (h) = heat transferred to the system (q) - work done by the system (w)."),
("In the General Energy Equation's sign convention, what does a positive value of q mean?",
 {"a": "Heat is removed from the system", "b": "Heat is added to the system", "c": "Work is done on the system", "d": "The system is at equilibrium"},
 "b", "A positive q means heat is added to the system; a negative q means heat is removed."),
("In the General Energy Equation's sign convention, what does a positive value of w mean?",
 {"a": "Work is done ON the system", "b": "Work is done BY the system", "c": "No work occurs", "d": "Heat is being added"},
 "b", "A positive w means work is done BY the system; a negative w means work is done ON the system."),
("What does Joule's constant (J = 778 ft-lbf/BTU) allow you to do?",
 {"a": "Convert between temperature scales", "b": "Convert mechanical energy (ft-lbf) into BTUs", "c": "Calculate entropy directly", "d": "Determine steam quality"},
 "b", "Joule's constant converts mechanical energy units (ft-lbf) into thermal energy units (BTU), since 1 BTU = 778 ft-lbf."),
("In the rate-form of the General Energy Equation for a steady-flow system, what does the rate of work done by the system represent?",
 {"a": "The system's power output", "b": "The system's total stored energy", "c": "The system's specific heat capacity", "d": "The system's entropy"},
 "a", "The rate of work done by the system, in this form of the equation, is the system's power output."),
]

def yd(data):
    return yaml.safe_dump(data, default_flow_style=False, sort_keys=False, allow_unicode=True).strip()

lines = ["# TH02B_Basic_Energy_Concepts - Comprehensive Study Notes", ""]
nid = NOTE_START_ID
for section, objective, body in notes:
    fm = {"id": nid, "section": section, "objective": objective}
    lines += ["---", yd(fm), "---", body, ""]
    nid += 1
(ROOT / "TH02B_Basic_Energy_Concepts_notes.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
notes_count = nid - NOTE_START_ID

FLASHCARD_START_ID = 328
lines = ["# TH02B_Basic_Energy_Concepts - Quick Reference Flashcards", ""]
fcid = FLASHCARD_START_ID
for q, a in flashcards:
    lines += ["---", yd({"id": fcid}), "---", "### Question", q, "", "### Answer", a, ""]
    fcid += 1
(ROOT / "TH02B_Basic_Energy_Concepts_flashcards.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
flashcards_count = fcid - FLASHCARD_START_ID

lines = ["# TH02B_Basic_Energy_Concepts - Exam Questions", ""]
for i, (q, opts, correct, expl) in enumerate(questions, start=1):
    fm = {"id": i, "correct": correct, "options": opts}
    lines += ["---", yd(fm), "---", "### Question", q, "", "### Explanation", expl, ""]
(ROOT / "TH02B_Basic_Energy_Concepts_questions.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

print(f"Notes: {notes_count}, Flashcards: {flashcards_count}, Questions: {len(questions)}")
