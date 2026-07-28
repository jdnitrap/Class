#!/usr/bin/env python3
"""One-off generator for TH03B_Steam_Properties content, built from the
uploaded official lecture (BNT-TH03Br05b). Follows CONTENT_INGESTION.md's
Step 4 YAML frontmatter format directly."""

import yaml
from pathlib import Path

ROOT = Path("Tier 3: Pathways/TH03B_Steam_Properties")
ROOT.mkdir(parents=True, exist_ok=True)

NOTE_START_ID = 179

# ---------------------------------------------------------------------
# NOTES: (section, objective, body)
# ---------------------------------------------------------------------
notes = [
("1.0 INTRODUCTION", None,
 "Water is the principal working fluid for electric generating stations using steam turbines, and like other matter it exists in solid, liquid, and gaseous phases. This lesson concentrates on water in the form of steam, since steam is the favored working fluid in power generation and heat removal because of its high specific heat capacity and high critical temperature -- meaning a large amount of thermal energy can be stored and transported in a relatively small mass of steam."),
("2.1/2.2 STATES AND PHASES", "Objective 1",
 "A substance's properties include pressure, temperature, specific volume, specific enthalpy, and specific entropy. When two or more properties are fixed, the state of the substance is established; when a property changes, a 'change of state' has occurred, and every state is unique (every property has one and only one value at that state). The state of a substance is defined by two independent, intensive properties (intensive properties include specific enthalpy, specific entropy, specific volume, and mass density; independent properties don't depend on other properties -- specific volume and mass density are NOT independent of each other). Phase describes the molecular structure of a substance: solid, liquid, vapor, gas, or plasma. A phase change reflects a change in molecular/atomic spacing: melting (solid to liquid), solidification (liquid to solid), vaporization (liquid to gas/vapor), condensation (vapor to liquid), and sublimation (solid directly to gas, no liquid phase). A thermodynamic process occurs whenever a working substance changes state -- a phase change may or may not accompany it (e.g., water boiling in a steam generator changes both state and phase, but a pump increasing water pressure changes state only, not phase)."),
("3.1/3.2 MOLES AND IDEAL GASES", None,
 "A mole is defined using Avogadro's Number -- the number of carbon atoms in 12 grams of carbon-12, experimentally determined to be 6.023 x 10^23 atoms. One mole of any substance is that amount having Avogadro's Number of atoms/molecules. The atomic mass unit (amu) is 1/12 the mass of a carbon-12 atom (1 amu = 1.6604 x 10^-24 grams); one mole of an element equals its atomic mass number in grams. An ideal gas is one that perfectly obeys the gas laws, with properties constant throughout its mass and molecular movement unaffected by chemical reactions or external forces. At low pressures, all real gases behave approximately like an ideal gas -- monatomic gases most closely, with accuracy decreasing for diatomic and polyatomic gases (though the Ideal Gas Law remains useful with experimentally derived corrections)."),
("3.3 CHARLES' LAW", "Objective 2",
 "Charles' Law: at low pressures, the volume of a gas at constant pressure is directly proportional to the temperature of the gas. Demonstrated with a piston/cylinder assembly free to move against constant external pressure -- adding heat increases gas temperature, which increases volume and pushes the piston outward until internal and external pressure re-equalize. The law is valid only for absolute temperature measurements, and its proportionality constant differs for each gas."),
("3.4 BOYLE'S LAW", "Objective 3",
 "Boyle's Law: at low pressures, the volume of a gas at constant temperature is inversely proportional to the absolute pressure of the gas. Demonstrated by a piston/cylinder assembly with no heater (so temperature stays constant) -- physically moving the piston to a new position and measuring the resulting volume and pressure shows this inverse relationship. Valid only for absolute pressure measurements, with a constant that differs for each gas."),
("3.5/3.6 COMBINED GAS LAW AND IDEAL GAS LAW", "Objective 4",
 "Charles' Law and Boyle's Law are valid for ideal gases (and real gases in the pressure range where they behave ideally). Combining them: for a given mass of any gas, the product of absolute pressure and volume divided by absolute temperature is a constant -- the Combined Gas Law (PV/T = constant). The Ideal Gas Law extends this using the number of moles (n), making use of the fact that the molar volume of a gas at standard temperature and pressure (STP) is 22.4 liters: PV = nRT, where R (the ideal gas constant) is the same for all gases under near-ideal conditions. The value/units of R depend on the units used for P, V, and T."),
("IDEAL GAS LAW APPLICATION", "Objective 5",
 "The Ideal Gas Law can be applied to practical problems, such as determining what temperature a compressor must restart at to maintain receiver pressure, given that receiver volume is constant (so PV/T = constant reduces to P/T = constant between two states)."),
("WHY STEAM TABLES INSTEAD OF THE IDEAL GAS LAW", "Objective 6",
 "The characteristic equation of state for a vapor is considerably more complicated than for an ideal gas, so the Ideal Gas Law should NOT be used to determine steam properties. Properties of steam have been extensively measured over most ranges of interest, and Steam Tables were developed to contain this experimentally derived information -- giving the properties of steam at a given state point, usually fixed by the easily measured properties of temperature and pressure. Steam tables are extremely useful to power plant personnel for solving thermodynamic process and cycle problems."),
("4.1 P-T DIAGRAM", "Objectives 7B, 7M",
 "A Pressure-Temperature (P-T) diagram graphically depicts the phase behavior of a pure substance -- a two-dimensional projection of the three-dimensional relationship between pressure, temperature, and specific volume. Three regions correspond to solid, liquid, and gas phases, divided by three phase curves: the sublimation line (solid/gas equilibrium), fusion line (liquid/solid equilibrium -- for water, uniquely, this line curves LEFT, so water's melting point DECREASES at higher pressure, unlike most substances), and vaporization line (liquid/gas equilibrium, terminating at the Critical Point). The latent heat of fusion is the enthalpy change when a substance changes from solid to liquid at constant temperature/pressure (144.5 Btu/lbm for ice at 1 atm, 32F). The latent heat of vaporization is the enthalpy change per lbm when changing from liquid to gas at constant temperature/pressure. The Critical Point is the highest temperature (critical temperature) and pressure (critical pressure) at which liquid and gas can exist in equilibrium as distinguishable phases -- for water, 3,208.2 psia and 705.47F; above it, latent heat of vaporization is zero since steam and water are indistinguishable, and the substance cannot exist as a liquid no matter the pressure. Above/right of the critical point is called a fluid region rather than gas or liquid. The Triple Point is where all three phase lines meet, so solid, liquid, and gas can all coexist in equilibrium -- for water, 32.02F and 0.089 psia."),
("4.2 P-v DIAGRAM AND THE VAPOR DOME", "Objectives 7M, 7N",
 "A P-v (Pressure-specific volume) diagram adds the third dimension (specific volume) that a P-T diagram can't show. On a P-v diagram, the Triple Point becomes a Triple Point Line. The saturated liquid line plots all state points at saturation temperature/pressure for the liquid, bounded by the Triple Point line and Critical Point; the saturated vapor line is the equivalent for vapor, also bounded by the Critical Point. The area between the saturated liquid and saturated vapor lines is the vapor dome (wet vapor region) -- the set of state points where a substance can exist in equilibrium as both liquid and gas. The position of a state point within the vapor dome is determined by the relative amount of vapor to liquid present."),
("QUALITY, MOISTURE CONTENT, AND VOID FRACTION", "Objectives 7J, 7K, 7L",
 "Moisture content (M) describes the amount of liquid present in a wet vapor mixture; steam quality (X) describes the amount of vapor present. As water content decreases, steam quality increases; X = 1 - M. A quality of 100% (moisture content 0%) is dry steam. Void fraction is the volumetric measurement of vapor in the mixture -- the volume of vapor divided by total volume. Power plant designers place great importance on steam quality: blading damage occurs on most high-pressure turbines when steam quality is not kept above ~99%. Within the vapor dome, pressure and temperature are NOT independent properties (fixing one fixes the other) -- unlike in the superheated vapor or subcooled liquid regions. Because of this, moisture content or quality must be used as an additional property to determine the actual state within the vapor dome, but both lose meaning entirely outside the vapor dome."),
("4.3 T-h DIAGRAM: FIVE STATES OF WATER (SUBCOOLED TO SATURATED LIQUID)", "Objectives 7A, 7C",
 "Water in a fluid phase can exist in five different states/forms. A subcooled (or compressed) liquid is a liquid existing at a temperature below saturation for its pressure, or at a pressure above saturation for its temperature (the terms subcooled and compressed are interchangeable). Adding heat to a subcooled liquid causes a sensible heat addition (heat resulting in a temperature increase you can sense) until it reaches its boiling point, becoming a saturated liquid -- a liquid at its boiling point, 'saturated' with heat such that any additional heat causes evaporation. For every pressure there's a corresponding saturation temperature at which water evaporates, and vice versa (e.g., water boils at 212F at 14.7 psia, but at 202F at 12 psia, and 102F at 1 psia)."),
("T-h DIAGRAM: LATENT HEAT AND SATURATED VAPOR TO SUPERHEATED VAPOR", "Objectives 7B, 7D, 7F, 7G, 7H, 7I",
 "Adding heat to a saturated liquid does NOT increase its temperature -- instead its enthalpy increases as a phase change (vaporization) begins. This is latent heat: heat that increases fluid energy without changing temperature. The heat needed to fully convert saturated liquid to saturated vapor is the latent heat of vaporization; removing that same amount of heat (condensation) is the latent heat of condensation. A saturated vapor is steam at its boiling temperature with no liquid present (sometimes called 'dry' steam). Continued heat addition beyond this point causes a sensible heat addition again, raising the vapor's temperature above its boiling point -- this is a superheated vapor. Subcooling describes how far below its boiling temperature a liquid's current temperature is (e.g., water at 112F at atmospheric pressure is subcooled by 100F, since it boils at 212F) -- 'degrees of subcooling' and 'subcooling margin' are used interchangeably. Degrees of superheat describes how far above its boiling temperature a vapor's current temperature is (e.g., steam at 250F at atmospheric pressure has 38 degrees of superheat, since it boils at 212F). Specific heat (Cp), or heat capacity, is the heat required to raise one lbm of a substance by one degree Fahrenheit (BTU/lbm-F)."),
("4.4 T-s DIAGRAM", "Objective 7E",
 "While a P-v diagram is useful for analyzing non-flow processes (with the area under the curve representing work done), a Temperature-Entropy (T-s) diagram must be used for analyzing thermodynamic processes and cycles -- it's the most frequently used diagram for energy transfer cycles, with the area under the T-s curve representing heat transferred into or out of the system. During a phase change, the mixture of liquid and vapor at the boiling temperature is a wet vapor; as long as some liquid remains, the latent heat of vaporization absorbs any additional heat and no temperature rise occurs."),
("5.0 WATER PROPERTY TABLES OVERVIEW", "Objectives 8, 9",
 "Since water is used in so many applications, its properties at different temperature-pressure conditions have been extensively researched and documented as 'Steam Tables.' Two forms are widely used in the US: Keenan, Keyes, Hill, and Moore's 'Thermodynamic Properties of Water,' and the ASME Steam Tables. Steam tables consist of two sets: (1) saturated steam tables (divided into a temperature-indexed part and a pressure-indexed part) and (2) superheated steam tables. Both are tabulations of pressure, temperature, specific volume, specific enthalpy, and specific entropy."),
("5.1 SATURATED STEAM: TEMPERATURE TABLE", None,
 "Table 1 (Properties of Saturated Water and Steam, Temperature) uses temperature (F) as the entry key, ranging from 32F (the triple point) to 705.1028F (the critical temperature). For each temperature, four data sets are given: saturation pressure, specific volume (v), specific enthalpy (h), and specific entropy (s) -- with v/h/s each given twice, once for the saturated liquid state (subscript L) and once for saturated vapor (subscript V). For a wet mixture, total specific volume = (M)(vL) + (X)(vV), which (since M = 1-X) can also be written v = vL + X(vV - vL). The same substitution pattern (using hL/hV or sL/sV) applies to find enthalpy or entropy of a mixture. If quality/moisture isn't known directly, it can be found by working backward from a known enthalpy, entropy, or volume value at the given saturation pressure/temperature."),
("5.2 SATURATED STEAM: PRESSURE TABLE", None,
 "Table 2 (Properties of Saturated Water and Steam, Pressure) uses pressure (psia) as the entry key, ranging from 0.1 psia to the critical pressure of 3200.11 psia. For each pressure, the same four data sets are given (boiling point/saturation temperature, specific volume, specific enthalpy, specific entropy), presented and calculated the same way as Table 1."),
("5.3 SUPERHEATED STEAM TABLES", None,
 "Table 3 (superheated steam) uses absolute pressure as the entry, with saturation temperature listed in parentheses under the pressure; specific volume, enthalpy, and entropy are read directly for the given temperature. Degrees of superheat is calculated by subtracting the saturation temperature (Tsat) from the actual temperature. Under certain conditions a vapor can become supersaturated: when a slightly superheated or saturated vapor undergoes an extremely rapid pressure decrease and expansion (as across a turbine nozzle), the state point moves into the wet vapor dome faster than the phase change can occur, so the vapor exists briefly in a superheated-looking condition even though condensation 'should' be occurring."),
("5.4 CALCULATING HEAT CAPACITY FROM STEAM TABLES", None,
 "The heat capacity (specific heat) of a fluid can be approximated using Steam Tables by taking two nearby temperature/enthalpy data points, dividing the change in enthalpy by the change in temperature between them. This method only provides an approximation of a liquid's heat capacity, not an exact value."),
("5.5 COMPRESSED/SUBCOOLED LIQUID TABLES", None,
 "The amount a liquid is subcooled can be determined from Saturated Steam Tables, but certain subcooled-liquid properties must be read from separate Compressed (Subcooled) Liquid Tables, consulted when exact values are needed. Subcooling matters most where inadequate cooling at a pump's suction can cause headloss to flash some liquid into vapor (cavitation), eroding/pitting internal pump components -- in severe cases, enough vaporization can 'vapor lock' the pump, causing insufficient cooling of its components and possible seizure from differential expansion of dissimilar metals in the rotor and casing."),
("6.0 THE MOLLIER DIAGRAM", "Objective 7O",
 "The Mollier diagram is an Enthalpy-Entropy (h-s) plot for steam, useful for quickly determining water properties and evaluating thermodynamic processes. Constant enthalpy lines are horizontal, constant entropy lines are vertical, and a saturation line separates saturated liquid (left) from saturated vapor (right) -- points below the saturation line are wet vapor, points above are superheated vapor. Constant pressure lines (isobars) run diagonally upper-right to lower-left, and are also constant temperature lines within the wet vapor region (since heat transfer there is purely latent). Constant temperature lines (isotherms) start at the saturation curve and move up/right. The Mollier diagram's main advantage is quickly finding steam properties from two of three known values (quality, pressure, temperature) without consulting multiple steam tables; its main disadvantage is that reading precise values (especially by interpolation between isotherms/isobars) is difficult and often inaccurate -- steam tables should be used when accuracy matters."),
("7.0 OPERATING EXPERIENCE: FORT CALHOUN RCP CAVITATION (#172086)", None,
 "On April 2, 1998, at Fort Calhoun Unit 1, operators depressurized the primary system during a planned cooldown using an inappropriate pressure indication method. A recently (and incorrectly) revised shutdown procedure directed the crew to determine pressurizer pressure using pressurizer STEAM SPACE temperature and steam tables, when it should have said WATER SPACE temperature -- the word had been miscorrected two weeks earlier and the error wasn't caught during procedure review. This made the crew believe RCS pressure was over 100 psi higher than it actually was. Reactor coolant pump RC-3A cavitated as a result. The crew received vibration alarms but didn't immediately respond, partly due to being occupied with an unrelated loss-of-condenser-vacuum issue, and partly due to confusion between conflicting procedure guidance (NPSH margin vs. shutdown cooling entry conditions). About 25 minutes passed before an operator was dispatched to investigate the vibration alarm; shaft vibration had risen from 12 mils to 19 mils and back to 12 mils over about an hour. No damage to the pump resulted, but the event was noteworthy because inadequate technical review of a procedure change (by the typing reviewer, qualified reviewer, and responsible department head) directly caused an inappropriately conducted cooldown, with real potential for RCP damage."),
("8.0 SUMMARY", None,
 "Operators may be called on to perform Reactor Coolant System manipulations that result in plant cooldown. Strict adherence to Operator Fundamentals could have prevented the Fort Calhoun cavitation event -- a solid understanding of steam properties (like the water-space vs. steam-space pressurizer temperature distinction) helps operators recognize errors in operating procedures before they cause equipment damage."),
]

# ---------------------------------------------------------------------
# FLASHCARDS: (question, answer)
# ---------------------------------------------------------------------
flashcards = [
("What defines the state of a substance?", "Two independent, intensive properties (e.g. specific enthalpy and specific entropy)."),
("What's the difference between state and phase?", "State is defined by properties (pressure, temperature, etc.); phase describes molecular structure (solid, liquid, gas)."),
("What is sublimation?", "A direct change from solid phase to gas phase, with no liquid phase present."),
("What is Avogadro's Number?", "6.023 x 10^23 -- the number of carbon atoms in 12 grams of carbon-12; one mole of any substance has this many atoms/molecules."),
("State Charles' Law.", "At low pressures, the volume of a gas at constant pressure is directly proportional to its absolute temperature."),
("State Boyle's Law.", "At low pressures, the volume of a gas at constant temperature is inversely proportional to its absolute pressure."),
("What is the Ideal Gas Law equation?", "PV = nRT, where R is the ideal gas constant."),
("Why shouldn't the Ideal Gas Law be used for steam properties?", "The equation of state for a vapor is much more complicated than for an ideal gas; steam tables (based on extensive experimental measurement) should be used instead."),
("What are the three phase lines on a P-T diagram?", "Sublimation line (solid-gas), fusion line (liquid-solid), and vaporization line (liquid-gas)."),
("What's unusual about water's fusion line compared to most substances?", "It curves LEFT, so water's melting point DECREASES at higher pressure (most substances' fusion lines curve right)."),
("What is the Critical Point?", "The highest temperature and pressure at which liquid and gas can exist in equilibrium as distinguishable phases; above it, latent heat of vaporization is zero."),
("What are water's critical temperature and pressure?", "705.47F and 3,208.2 psia."),
("What is the Triple Point?", "The single point where solid, liquid, and gas can all exist together in equilibrium; for water, 32.02F and 0.089 psia."),
("What is the vapor dome on a P-v diagram?", "The region bounded by the saturated liquid and saturated vapor lines, where liquid and vapor coexist in equilibrium."),
("What's the difference between steam quality and moisture content?", "Quality (X) is the fraction of vapor present; moisture content (M) is the fraction of liquid present. X = 1 - M."),
("What does 100% steam quality mean?", "Dry steam -- 0% moisture content, no liquid present."),
("Why do power plant designers care about steam quality entering a turbine?", "Blading damage occurs on most high-pressure turbines when steam quality drops below about 99%."),
("Within the vapor dome, are pressure and temperature independent properties?", "No -- fixing one fixes the other; quality or moisture content is needed as an additional property to determine the actual state."),
("What is a subcooled (compressed) liquid?", "A liquid below its saturation temperature for its pressure, or above its saturation pressure for its temperature."),
("What is a saturated liquid?", "A liquid at its boiling point -- any further heat addition causes evaporation rather than a temperature rise."),
("What is latent heat?", "Heat that increases a fluid's enthalpy without changing its temperature, associated with a phase change."),
("What is the latent heat of vaporization?", "The heat required to convert saturated liquid completely to saturated vapor at constant temperature and pressure."),
("What is a superheated vapor?", "Steam above its boiling (saturation) temperature for its pressure."),
("How do you calculate degrees of superheat?", "Actual temperature minus the saturation temperature (Tsat) for that pressure."),
("Water at atmospheric pressure is at 112F. How many degrees is it subcooled?", "100F (212F boiling point - 112F actual = 100F of subcooling)."),
("What diagram should be used to analyze thermodynamic cycles, and why?", "The T-s (Temperature-Entropy) diagram -- the area under the curve represents heat transferred into or out of the system."),
("What are the two main sets of tables in the Steam Tables?", "Saturated steam tables (temperature-indexed and pressure-indexed) and superheated steam tables."),
("How is the specific volume of a wet steam mixture calculated?", "v = vL + X(vV - vL), where X is the quality and vL/vV are the saturated liquid/vapor specific volumes."),
("What is supersaturation?", "When a vapor undergoes an extremely rapid pressure drop (e.g. across a turbine nozzle) faster than condensation can occur, so it briefly behaves like superheated steam even inside the wet vapor region."),
("What's the difference between the Saturated Steam Tables and Compressed Liquid Tables?", "Saturated tables give properties at the boiling point for a given temperature/pressure; Compressed Liquid Tables give exact subcooled-liquid properties away from saturation."),
("What can happen if a pump doesn't get adequately subcooled liquid at its suction?", "Cavitation -- liquid flashes to vapor at the low-pressure suction, eroding/pitting internal components, and in severe cases can vapor-lock the pump."),
("What kind of plot is a Mollier diagram?", "An Enthalpy-Entropy (h-s) plot for steam."),
("What's the main advantage of a Mollier diagram?", "Quickly finding steam properties from two of three known values (quality, pressure, temperature) without consulting multiple steam tables."),
("What's the main disadvantage of a Mollier diagram?", "It's difficult to read values accurately, especially by interpolating between isotherms/isobars -- steam tables should be used when accuracy matters."),
("What caused reactor coolant pump RC-3A to cavitate at Fort Calhoun in 1998?", "An incorrectly revised procedure directed operators to use pressurizer steam-space (instead of water-space) temperature to determine pressure, making them believe pressure was over 100 psi higher than actual."),
("What was the root cause of the Fort Calhoun RCP cavitation event?", "Inadequate technical review of a procedure revision that changed 'water' to 'steam' space temperature without being caught."),
]

# ---------------------------------------------------------------------
# QUESTIONS: (question, options dict, correct letter, explanation)
# ---------------------------------------------------------------------
questions = [
("What defines the state of a substance?",
 {"a": "Any single property", "b": "Two independent, intensive properties", "c": "Its phase alone", "d": "Its molecular structure only"},
 "b", "The state of a substance is defined by two independent, intensive properties (e.g. specific enthalpy and specific entropy)."),
("Which of the following is a direct change from solid to gas with no liquid phase?", 
 {"a": "Vaporization", "b": "Condensation", "c": "Sublimation", "d": "Solidification"},
 "c", "Sublimation is a direct change from a solid phase to a gas phase with no liquid phase present."),
("Avogadro's Number is best described as:", 
 {"a": "The atomic mass of carbon-12", "b": "The number of carbon atoms in 12 grams of carbon-12", "c": "The molar volume of a gas at STP", "d": "The ideal gas constant"},
 "b", "Avogadro's Number (6.023 x 10^23) is the number of carbon atoms in 12 grams of carbon-12; one mole of any substance has this many atoms/molecules."),
("Charles' Law states that at low pressure, the volume of a gas at constant pressure is:", 
 {"a": "Inversely proportional to absolute temperature", "b": "Directly proportional to absolute temperature", "c": "Independent of temperature", "d": "Proportional to the square of temperature"},
 "b", "Charles' Law: at constant pressure, gas volume is directly proportional to absolute temperature."),
("Boyle's Law states that at low pressure, the volume of a gas at constant temperature is:", 
 {"a": "Directly proportional to absolute pressure", "b": "Inversely proportional to absolute pressure", "c": "Independent of pressure", "d": "Proportional to the square of pressure"},
 "b", "Boyle's Law: at constant temperature, gas volume is inversely proportional to absolute pressure."),
("Why should the Ideal Gas Law NOT be used to determine steam properties?", 
 {"a": "Steam tables are cheaper to produce", "b": "The equation of state for a vapor is much more complicated than for an ideal gas", "c": "Steam is not a real substance", "d": "The Ideal Gas Law only works for liquids"},
 "b", "The characteristic equation of state for a vapor is considerably more complicated than for an ideal gas, so steam tables (built from extensive experimental measurement) are used instead."),
("What are the three phase lines on a P-T diagram?", 
 {"a": "Isobar, isotherm, and isochor", "b": "Sublimation, fusion, and vaporization lines", "c": "Saturated liquid, saturated vapor, and critical lines", "d": "Quality, moisture, and void fraction lines"},
 "b", "A P-T diagram's three phase lines are the sublimation (solid-gas), fusion (liquid-solid), and vaporization (liquid-gas) lines."),
("What is unusual about water's fusion line compared to most substances?", 
 {"a": "It doesn't exist for water", "b": "It curves left, so water's melting point decreases at higher pressure", "c": "It only applies above the critical point", "d": "It is identical to the vaporization line"},
 "b", "Unlike most substances (whose fusion lines curve right), water's fusion line curves left, so its melting point decreases as pressure increases."),
("What happens to the latent heat of vaporization at the Critical Point?", 
 {"a": "It becomes infinite", "b": "It becomes zero, since liquid and vapor are indistinguishable", "c": "It doubles", "d": "It is unaffected"},
 "b", "At the Critical Point, latent heat of vaporization is zero since steam and water are perceived as one and the same."),
("What are water's critical temperature and pressure?", 
 {"a": "212F and 14.7 psia", "b": "32F and 0.089 psia", "c": "705.47F and 3,208.2 psia", "d": "100F and 1 psia"},
 "c", "Water's Critical Point occurs at 705.47F and 3,208.2 psia."),
("What is the Triple Point of water?", 
 {"a": "705.47F and 3,208.2 psia", "b": "32.02F and 0.089 psia", "c": "212F and 14.7 psia", "d": "0F and 0 psia"},
 "b", "Water's Triple Point (where solid, liquid, and gas coexist in equilibrium) is at 32.02F and 0.089 psia."),
("What region on a P-v diagram is called the 'vapor dome'?", 
 {"a": "The area above the critical point", "b": "The area bounded by the saturated liquid and saturated vapor lines", "c": "The area below the triple point line", "d": "The area to the right of the vaporization line only"},
 "b", "The vapor dome (wet vapor region) is the area bounded by the saturated liquid and saturated vapor lines, where a substance can exist in equilibrium as both liquid and gas."),
("Steam quality (X) and moisture content (M) are related by:", 
 {"a": "X = M", "b": "X = 1 - M", "c": "X = M^2", "d": "X and M are unrelated"},
 "b", "Quality is the fraction of vapor present and moisture content is the fraction of liquid present, so X = 1 - M."),
("Below what steam quality can blading damage occur on most high-pressure turbines?", 
 {"a": "50%", "b": "75%", "c": "90%", "d": "99%"},
 "d", "Blading damage occurs on most high-pressure turbines when steam quality is not kept above roughly 99%."),
("Within the vapor dome, are pressure and temperature independent properties of each other?", 
 {"a": "Yes, always independent", "b": "No -- fixing one fixes the other", "c": "Only above the critical point", "d": "Only for superheated vapor"},
 "b", "Inside the vapor dome, pressure and temperature are NOT independent -- affixing one also affixes the other, unlike in the superheated vapor or subcooled liquid regions."),
("What is a subcooled (compressed) liquid?", 
 {"a": "A liquid at its boiling point", "b": "A liquid below saturation temperature for its pressure (or above saturation pressure for its temperature)", "c": "A liquid above its critical temperature", "d": "A liquid with 100% quality"},
 "b", "A subcooled/compressed liquid exists at a temperature below saturation for its pressure, or a pressure above saturation for its temperature."),
("What happens to a saturated liquid's temperature as heat is added during vaporization?", 
 {"a": "It rises steadily", "b": "It stays constant -- the added heat goes into the phase change (latent heat) instead", "c": "It drops", "d": "It rises then falls"},
 "b", "Adding heat to a saturated liquid does not increase its temperature; the energy (latent heat) instead goes into changing phase from liquid to vapor."),
("What is a superheated vapor?", 
 {"a": "Steam below its boiling temperature", "b": "Steam at exactly its boiling temperature", "c": "Steam above its boiling (saturation) temperature", "d": "A liquid above its critical pressure"},
 "c", "A superheated vapor is steam that has been heated above its boiling (saturation) temperature for its pressure."),
("Water at atmospheric pressure (boiling point 212F) is at 112F. What is its degree of subcooling?", 
 {"a": "12F", "b": "100F", "c": "212F", "d": "324F"},
 "b", "Degrees of subcooling = boiling temperature - actual temperature = 212F - 112F = 100F."),
("Which diagram is most frequently used to analyze thermodynamic energy transfer cycles?", 
 {"a": "P-T diagram", "b": "P-v diagram", "c": "T-s diagram", "d": "Mollier (h-s) diagram only"},
 "c", "The Temperature-Entropy (T-s) diagram is the most frequently used for analyzing thermodynamic processes and cycles, since the area under the curve represents heat transferred."),
("What are the two main categories of tables in the Steam Tables?", 
 {"a": "Saturated steam tables and superheated steam tables", "b": "P-T tables and P-v tables", "c": "Mollier tables and Carnot tables", "d": "Fusion tables and sublimation tables"},
 "a", "Steam tables consist of saturated steam tables (temperature-indexed and pressure-indexed) and superheated steam tables."),
("For a wet steam mixture, specific volume is calculated as:", 
 {"a": "v = vL - X(vV - vL)", "b": "v = vL + X(vV - vL)", "c": "v = X * vV only", "d": "v = vV / vL"},
 "b", "Total specific volume of a wet mixture = vL + X(vV - vL), where X is the quality."),
("What is supersaturation?", 
 {"a": "A vapor becoming superheated slowly over time", "b": "A vapor undergoing such a rapid pressure drop that it briefly behaves like superheated steam even within the wet vapor region", "c": "A liquid becoming oversaturated with dissolved gas", "d": "The point where quality exceeds 100%"},
 "b", "Supersaturation occurs when a rapid pressure decrease and expansion (e.g. across a turbine nozzle) moves the state point into the wet vapor dome faster than the phase change can actually occur."),
("What can happen if liquid at a pump's suction isn't sufficiently subcooled?", 
 {"a": "The pump runs more efficiently", "b": "Cavitation -- liquid flashes to vapor, eroding internal components and potentially vapor-locking the pump", "c": "The liquid becomes superheated", "d": "Nothing -- subcooling only matters for turbines"},
 "b", "Inadequate subcooling at a pump suction can let headloss flash liquid into vapor (cavitation), eroding/pitting components and, in severe cases, vapor-locking the pump."),
("What kind of plot is the Mollier diagram?", 
 {"a": "Pressure-Temperature (P-T)", "b": "Pressure-specific volume (P-v)", "c": "Enthalpy-Entropy (h-s)", "d": "Temperature-Entropy (T-s)"},
 "c", "The Mollier diagram is an Enthalpy-Entropy (h-s) plot for steam."),
("What is the main disadvantage of the Mollier diagram compared to steam tables?", 
 {"a": "It cannot show superheated states", "b": "Reading precise values (especially via interpolation) is difficult and often inaccurate", "c": "It only works for water, not other substances", "d": "It requires knowing three properties instead of two"},
 "b", "The Mollier diagram's main disadvantage is that obtaining accurate values, especially via interpolation between isotherms/isobars, is difficult -- steam tables should be consulted when accuracy is needed."),
("In the Fort Calhoun RCP cavitation event, what was the immediate cause of the crew misjudging RCS pressure?", 
 {"a": "A failed pressure transmitter", "b": "A procedure error directing use of pressurizer steam-space (instead of water-space) temperature", "c": "A control rod malfunction", "d": "An operator ignoring all instrumentation"},
 "b", "A recently and incorrectly revised procedure directed operators to determine pressurizer pressure using steam-space temperature instead of water-space temperature, causing them to believe pressure was over 100 psi higher than it actually was."),
("What was identified as a root cause of the Fort Calhoun cavitation event?", 
 {"a": "Equipment age", "b": "Inadequate technical review of a procedure revision that changed 'water' to 'steam' space temperature", "c": "A failure of the reactor protection system", "d": "Excessive reactor power"},
 "b", "The root cause was that the typing reviewer, qualified reviewer, and responsible department head all performed a less-than-adequate technical review of the procedure change."),
("What is void fraction?", 
 {"a": "The same thing as quality", "b": "The volumetric measurement of vapor in a mixture (vapor volume / total volume)", "c": "The mass fraction of liquid in a mixture", "d": "A measure of pressure loss"},
 "b", "Void fraction is the volumetric measurement of vapor in the mixture, found by dividing the volume of vapor by the total volume."),
]

def yd(data):
    return yaml.safe_dump(data, default_flow_style=False, sort_keys=False, allow_unicode=True).strip()

# ---- write notes.md ----
lines = ["# TH03B_Steam_Properties - Comprehensive Study Notes", ""]
nid = NOTE_START_ID
for section, objective, body in notes:
    fm = {"id": nid, "section": section, "objective": objective}
    lines += ["---", yd(fm), "---", body, ""]
    nid += 1
(ROOT / "TH03B_Steam_Properties_notes.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
notes_count = nid - NOTE_START_ID

# ---- write flashcards.md ----
FLASHCARD_START_ID = 292
lines = ["# TH03B_Steam_Properties - Quick Reference Flashcards", ""]
fcid = FLASHCARD_START_ID
for q, a in flashcards:
    lines += ["---", yd({"id": fcid}), "---", "### Question", q, "", "### Answer", a, ""]
    fcid += 1
(ROOT / "TH03B_Steam_Properties_flashcards.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
flashcards_count = fcid - FLASHCARD_START_ID

# ---- write questions.md ----
lines = ["# TH03B_Steam_Properties - Exam Questions", ""]
for i, (q, opts, correct, expl) in enumerate(questions, start=1):
    fm = {"id": i, "correct": correct, "options": opts}
    lines += ["---", yd(fm), "---", "### Question", q, "", "### Explanation", expl, ""]
(ROOT / "TH03B_Steam_Properties_questions.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

print(f"Notes: {notes_count}, Flashcards: {flashcards_count}, Questions: {len(questions)}")
