# TH03B_Steam_Properties - Comprehensive Study Notes

---
id: 179
section: 1.0 INTRODUCTION
objective: null
---
Water is the principal working fluid for electric generating stations using steam turbines, and like other matter it exists in solid, liquid, and gaseous phases. This lesson concentrates on water in the form of steam, since steam is the favored working fluid in power generation and heat removal because of its high specific heat capacity and high critical temperature -- meaning a large amount of thermal energy can be stored and transported in a relatively small mass of steam.

---
id: 180
section: 2.1/2.2 STATES AND PHASES
objective: Objective 1
---
A substance's properties include pressure, temperature, specific volume, specific enthalpy, and specific entropy. When two or more properties are fixed, the state of the substance is established; when a property changes, a 'change of state' has occurred, and every state is unique (every property has one and only one value at that state). The state of a substance is defined by two independent, intensive properties (intensive properties include specific enthalpy, specific entropy, specific volume, and mass density; independent properties don't depend on other properties -- specific volume and mass density are NOT independent of each other). Phase describes the molecular structure of a substance: solid, liquid, vapor, gas, or plasma. A phase change reflects a change in molecular/atomic spacing: melting (solid to liquid), solidification (liquid to solid), vaporization (liquid to gas/vapor), condensation (vapor to liquid), and sublimation (solid directly to gas, no liquid phase). A thermodynamic process occurs whenever a working substance changes state -- a phase change may or may not accompany it (e.g., water boiling in a steam generator changes both state and phase, but a pump increasing water pressure changes state only, not phase).

---
id: 181
section: 3.1/3.2 MOLES AND IDEAL GASES
objective: null
---
A mole is defined using Avogadro's Number -- the number of carbon atoms in 12 grams of carbon-12, experimentally determined to be 6.023 x 10^23 atoms. One mole of any substance is that amount having Avogadro's Number of atoms/molecules. The atomic mass unit (amu) is 1/12 the mass of a carbon-12 atom (1 amu = 1.6604 x 10^-24 grams); one mole of an element equals its atomic mass number in grams. An ideal gas is one that perfectly obeys the gas laws, with properties constant throughout its mass and molecular movement unaffected by chemical reactions or external forces. At low pressures, all real gases behave approximately like an ideal gas -- monatomic gases most closely, with accuracy decreasing for diatomic and polyatomic gases (though the Ideal Gas Law remains useful with experimentally derived corrections).

---
id: 182
section: 3.3 CHARLES' LAW
objective: Objective 2
---
Charles' Law: at low pressures, the volume of a gas at constant pressure is directly proportional to the temperature of the gas. Demonstrated with a piston/cylinder assembly free to move against constant external pressure -- adding heat increases gas temperature, which increases volume and pushes the piston outward until internal and external pressure re-equalize. The law is valid only for absolute temperature measurements, and its proportionality constant differs for each gas.

---
id: 183
section: 3.4 BOYLE'S LAW
objective: Objective 3
---
Boyle's Law: at low pressures, the volume of a gas at constant temperature is inversely proportional to the absolute pressure of the gas. Demonstrated by a piston/cylinder assembly with no heater (so temperature stays constant) -- physically moving the piston to a new position and measuring the resulting volume and pressure shows this inverse relationship. Valid only for absolute pressure measurements, with a constant that differs for each gas.

---
id: 184
section: 3.5/3.6 COMBINED GAS LAW AND IDEAL GAS LAW
objective: Objective 4
---
Charles' Law and Boyle's Law are valid for ideal gases (and real gases in the pressure range where they behave ideally). Combining them: for a given mass of any gas, the product of absolute pressure and volume divided by absolute temperature is a constant -- the Combined Gas Law (PV/T = constant). The Ideal Gas Law extends this using the number of moles (n), making use of the fact that the molar volume of a gas at standard temperature and pressure (STP) is 22.4 liters: PV = nRT, where R (the ideal gas constant) is the same for all gases under near-ideal conditions. The value/units of R depend on the units used for P, V, and T.

---
id: 185
section: IDEAL GAS LAW APPLICATION
objective: Objective 5
---
The Ideal Gas Law can be applied to practical problems, such as determining what temperature a compressor must restart at to maintain receiver pressure, given that receiver volume is constant (so PV/T = constant reduces to P/T = constant between two states).

---
id: 186
section: WHY STEAM TABLES INSTEAD OF THE IDEAL GAS LAW
objective: Objective 6
---
The characteristic equation of state for a vapor is considerably more complicated than for an ideal gas, so the Ideal Gas Law should NOT be used to determine steam properties. Properties of steam have been extensively measured over most ranges of interest, and Steam Tables were developed to contain this experimentally derived information -- giving the properties of steam at a given state point, usually fixed by the easily measured properties of temperature and pressure. Steam tables are extremely useful to power plant personnel for solving thermodynamic process and cycle problems.

---
id: 187
section: 4.1 P-T DIAGRAM
objective: Objectives 7B, 7M
---
A Pressure-Temperature (P-T) diagram graphically depicts the phase behavior of a pure substance -- a two-dimensional projection of the three-dimensional relationship between pressure, temperature, and specific volume. Three regions correspond to solid, liquid, and gas phases, divided by three phase curves: the sublimation line (solid/gas equilibrium), fusion line (liquid/solid equilibrium -- for water, uniquely, this line curves LEFT, so water's melting point DECREASES at higher pressure, unlike most substances), and vaporization line (liquid/gas equilibrium, terminating at the Critical Point). The latent heat of fusion is the enthalpy change when a substance changes from solid to liquid at constant temperature/pressure (144.5 Btu/lbm for ice at 1 atm, 32F). The latent heat of vaporization is the enthalpy change per lbm when changing from liquid to gas at constant temperature/pressure. The Critical Point is the highest temperature (critical temperature) and pressure (critical pressure) at which liquid and gas can exist in equilibrium as distinguishable phases -- for water, 3,208.2 psia and 705.47F; above it, latent heat of vaporization is zero since steam and water are indistinguishable, and the substance cannot exist as a liquid no matter the pressure. Above/right of the critical point is called a fluid region rather than gas or liquid. The Triple Point is where all three phase lines meet, so solid, liquid, and gas can all coexist in equilibrium -- for water, 32.02F and 0.089 psia.

---
id: 188
section: 4.2 P-v DIAGRAM AND THE VAPOR DOME
objective: Objectives 7M, 7N
---
A P-v (Pressure-specific volume) diagram adds the third dimension (specific volume) that a P-T diagram can't show. On a P-v diagram, the Triple Point becomes a Triple Point Line. The saturated liquid line plots all state points at saturation temperature/pressure for the liquid, bounded by the Triple Point line and Critical Point; the saturated vapor line is the equivalent for vapor, also bounded by the Critical Point. The area between the saturated liquid and saturated vapor lines is the vapor dome (wet vapor region) -- the set of state points where a substance can exist in equilibrium as both liquid and gas. The position of a state point within the vapor dome is determined by the relative amount of vapor to liquid present.

---
id: 189
section: QUALITY, MOISTURE CONTENT, AND VOID FRACTION
objective: Objectives 7J, 7K, 7L
---
Moisture content (M) describes the amount of liquid present in a wet vapor mixture; steam quality (X) describes the amount of vapor present. As water content decreases, steam quality increases; X = 1 - M. A quality of 100% (moisture content 0%) is dry steam. Void fraction is the volumetric measurement of vapor in the mixture -- the volume of vapor divided by total volume. Power plant designers place great importance on steam quality: blading damage occurs on most high-pressure turbines when steam quality is not kept above ~99%. Within the vapor dome, pressure and temperature are NOT independent properties (fixing one fixes the other) -- unlike in the superheated vapor or subcooled liquid regions. Because of this, moisture content or quality must be used as an additional property to determine the actual state within the vapor dome, but both lose meaning entirely outside the vapor dome.

---
id: 190
section: '4.3 T-h DIAGRAM: FIVE STATES OF WATER (SUBCOOLED TO SATURATED LIQUID)'
objective: Objectives 7A, 7C
---
Water in a fluid phase can exist in five different states/forms. A subcooled (or compressed) liquid is a liquid existing at a temperature below saturation for its pressure, or at a pressure above saturation for its temperature (the terms subcooled and compressed are interchangeable). Adding heat to a subcooled liquid causes a sensible heat addition (heat resulting in a temperature increase you can sense) until it reaches its boiling point, becoming a saturated liquid -- a liquid at its boiling point, 'saturated' with heat such that any additional heat causes evaporation. For every pressure there's a corresponding saturation temperature at which water evaporates, and vice versa (e.g., water boils at 212F at 14.7 psia, but at 202F at 12 psia, and 102F at 1 psia).

---
id: 191
section: 'T-h DIAGRAM: LATENT HEAT AND SATURATED VAPOR TO SUPERHEATED VAPOR'
objective: Objectives 7B, 7D, 7F, 7G, 7H, 7I
---
Adding heat to a saturated liquid does NOT increase its temperature -- instead its enthalpy increases as a phase change (vaporization) begins. This is latent heat: heat that increases fluid energy without changing temperature. The heat needed to fully convert saturated liquid to saturated vapor is the latent heat of vaporization; removing that same amount of heat (condensation) is the latent heat of condensation. A saturated vapor is steam at its boiling temperature with no liquid present (sometimes called 'dry' steam). Continued heat addition beyond this point causes a sensible heat addition again, raising the vapor's temperature above its boiling point -- this is a superheated vapor. Subcooling describes how far below its boiling temperature a liquid's current temperature is (e.g., water at 112F at atmospheric pressure is subcooled by 100F, since it boils at 212F) -- 'degrees of subcooling' and 'subcooling margin' are used interchangeably. Degrees of superheat describes how far above its boiling temperature a vapor's current temperature is (e.g., steam at 250F at atmospheric pressure has 38 degrees of superheat, since it boils at 212F). Specific heat (Cp), or heat capacity, is the heat required to raise one lbm of a substance by one degree Fahrenheit (BTU/lbm-F).

---
id: 192
section: 4.4 T-s DIAGRAM
objective: Objective 7E
---
While a P-v diagram is useful for analyzing non-flow processes (with the area under the curve representing work done), a Temperature-Entropy (T-s) diagram must be used for analyzing thermodynamic processes and cycles -- it's the most frequently used diagram for energy transfer cycles, with the area under the T-s curve representing heat transferred into or out of the system. During a phase change, the mixture of liquid and vapor at the boiling temperature is a wet vapor; as long as some liquid remains, the latent heat of vaporization absorbs any additional heat and no temperature rise occurs.

---
id: 193
section: 5.0 WATER PROPERTY TABLES OVERVIEW
objective: Objectives 8, 9
---
Since water is used in so many applications, its properties at different temperature-pressure conditions have been extensively researched and documented as 'Steam Tables.' Two forms are widely used in the US: Keenan, Keyes, Hill, and Moore's 'Thermodynamic Properties of Water,' and the ASME Steam Tables. Steam tables consist of two sets: (1) saturated steam tables (divided into a temperature-indexed part and a pressure-indexed part) and (2) superheated steam tables. Both are tabulations of pressure, temperature, specific volume, specific enthalpy, and specific entropy.

---
id: 194
section: '5.1 SATURATED STEAM: TEMPERATURE TABLE'
objective: null
---
Table 1 (Properties of Saturated Water and Steam, Temperature) uses temperature (F) as the entry key, ranging from 32F (the triple point) to 705.1028F (the critical temperature). For each temperature, four data sets are given: saturation pressure, specific volume (v), specific enthalpy (h), and specific entropy (s) -- with v/h/s each given twice, once for the saturated liquid state (subscript L) and once for saturated vapor (subscript V). For a wet mixture, total specific volume = (M)(vL) + (X)(vV), which (since M = 1-X) can also be written v = vL + X(vV - vL). The same substitution pattern (using hL/hV or sL/sV) applies to find enthalpy or entropy of a mixture. If quality/moisture isn't known directly, it can be found by working backward from a known enthalpy, entropy, or volume value at the given saturation pressure/temperature.

---
id: 195
section: '5.2 SATURATED STEAM: PRESSURE TABLE'
objective: null
---
Table 2 (Properties of Saturated Water and Steam, Pressure) uses pressure (psia) as the entry key, ranging from 0.1 psia to the critical pressure of 3200.11 psia. For each pressure, the same four data sets are given (boiling point/saturation temperature, specific volume, specific enthalpy, specific entropy), presented and calculated the same way as Table 1.

---
id: 196
section: 5.3 SUPERHEATED STEAM TABLES
objective: null
---
Table 3 (superheated steam) uses absolute pressure as the entry, with saturation temperature listed in parentheses under the pressure; specific volume, enthalpy, and entropy are read directly for the given temperature. Degrees of superheat is calculated by subtracting the saturation temperature (Tsat) from the actual temperature. Under certain conditions a vapor can become supersaturated: when a slightly superheated or saturated vapor undergoes an extremely rapid pressure decrease and expansion (as across a turbine nozzle), the state point moves into the wet vapor dome faster than the phase change can occur, so the vapor exists briefly in a superheated-looking condition even though condensation 'should' be occurring.

---
id: 197
section: 5.4 CALCULATING HEAT CAPACITY FROM STEAM TABLES
objective: null
---
The heat capacity (specific heat) of a fluid can be approximated using Steam Tables by taking two nearby temperature/enthalpy data points, dividing the change in enthalpy by the change in temperature between them. This method only provides an approximation of a liquid's heat capacity, not an exact value.

---
id: 198
section: 5.5 COMPRESSED/SUBCOOLED LIQUID TABLES
objective: null
---
The amount a liquid is subcooled can be determined from Saturated Steam Tables, but certain subcooled-liquid properties must be read from separate Compressed (Subcooled) Liquid Tables, consulted when exact values are needed. Subcooling matters most where inadequate cooling at a pump's suction can cause headloss to flash some liquid into vapor (cavitation), eroding/pitting internal pump components -- in severe cases, enough vaporization can 'vapor lock' the pump, causing insufficient cooling of its components and possible seizure from differential expansion of dissimilar metals in the rotor and casing.

---
id: 199
section: 6.0 THE MOLLIER DIAGRAM
objective: Objective 7O
---
The Mollier diagram is an Enthalpy-Entropy (h-s) plot for steam, useful for quickly determining water properties and evaluating thermodynamic processes. Constant enthalpy lines are horizontal, constant entropy lines are vertical, and a saturation line separates saturated liquid (left) from saturated vapor (right) -- points below the saturation line are wet vapor, points above are superheated vapor. Constant pressure lines (isobars) run diagonally upper-right to lower-left, and are also constant temperature lines within the wet vapor region (since heat transfer there is purely latent). Constant temperature lines (isotherms) start at the saturation curve and move up/right. The Mollier diagram's main advantage is quickly finding steam properties from two of three known values (quality, pressure, temperature) without consulting multiple steam tables; its main disadvantage is that reading precise values (especially by interpolation between isotherms/isobars) is difficult and often inaccurate -- steam tables should be used when accuracy matters.

---
id: 200
section: '7.0 OPERATING EXPERIENCE: FORT CALHOUN RCP CAVITATION (#172086)'
objective: null
---
On April 2, 1998, at Fort Calhoun Unit 1, operators depressurized the primary system during a planned cooldown using an inappropriate pressure indication method. A recently (and incorrectly) revised shutdown procedure directed the crew to determine pressurizer pressure using pressurizer STEAM SPACE temperature and steam tables, when it should have said WATER SPACE temperature -- the word had been miscorrected two weeks earlier and the error wasn't caught during procedure review. This made the crew believe RCS pressure was over 100 psi higher than it actually was. Reactor coolant pump RC-3A cavitated as a result. The crew received vibration alarms but didn't immediately respond, partly due to being occupied with an unrelated loss-of-condenser-vacuum issue, and partly due to confusion between conflicting procedure guidance (NPSH margin vs. shutdown cooling entry conditions). About 25 minutes passed before an operator was dispatched to investigate the vibration alarm; shaft vibration had risen from 12 mils to 19 mils and back to 12 mils over about an hour. No damage to the pump resulted, but the event was noteworthy because inadequate technical review of a procedure change (by the typing reviewer, qualified reviewer, and responsible department head) directly caused an inappropriately conducted cooldown, with real potential for RCP damage.

---
id: 201
section: 8.0 SUMMARY
objective: null
---
Operators may be called on to perform Reactor Coolant System manipulations that result in plant cooldown. Strict adherence to Operator Fundamentals could have prevented the Fort Calhoun cavitation event -- a solid understanding of steam properties (like the water-space vs. steam-space pressurizer temperature distinction) helps operators recognize errors in operating procedures before they cause equipment damage.
