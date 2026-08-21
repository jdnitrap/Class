import type { Request, Response } from 'express';

/**
 * Gasifier Syngas Equilibrium Solver
 *
 * Based on the two-step equilibrium model described in:
 *   - FAO Forestry Paper 72 (1986) — Wood Gas as Engine Fuel
 *   - FEMA Emergency Gasifier Plans (1989)
 *   - Turns, S.R. — An Introduction to Combustion (2nd ed.)
 *
 * The model solves the Boudouard equilibrium and water-gas shift reaction
 * iteratively to estimate dry syngas composition at the exit of the reduction
 * zone. It is a simplified equilibrium approach — real gasifiers deviate due
 * to kinetics, channeling, and tar formation. Results are indicative only.
 *
 * Reactions modelled:
 *   (1) Boudouard:        C + CO₂ ⇌ 2CO          ΔH = +172 kJ/mol
 *   (2) Water-gas:        C + H₂O ⇌ CO + H₂       ΔH = +131 kJ/mol
 *   (3) Water-gas shift:  CO + H₂O ⇌ CO₂ + H₂     ΔH = −41 kJ/mol
 *   (4) Methanation:      C + 2H₂ ⇌ CH₄           ΔH = −75 kJ/mol
 */

export type FuelSpecies = 'hardwood' | 'softwood' | 'woodchips' | 'charcoal' | 'corn_cobs';

export interface SimulatorInput {
  gasifierType: 'downdraft' | 'updraft' | 'fema';
  fuelSpecies: FuelSpecies;
  moistureContent: number;   // % wet basis, 0–40
  fuelSizeMm: number;        // average particle size mm, 5–150
  equivalenceRatio: number;  // air-to-fuel ratio / stoichiometric, 0.20–0.45
  // Fuel blending — optional second fuel
  blendEnabled?: boolean;
  fuelSpecies2?: FuelSpecies;
  blendRatio?: number;       // 0–100: % of primary fuel by mass (100 = pure primary)
  // Engine matching — optional
  engineDisplacementCc?: number;  // e.g. 500–5000
  engineRpm?: number;             // e.g. 1500 or 3000
}

export interface TarPrediction {
  /** g tar per Nm³ dry syngas — the standard engine-cleanliness metric */
  tarYieldGPerNm3: number;
  /** g tar per kg dry fuel fed */
  tarYieldGPerKgFuel: number;
  /** Qualitative class based on ECN tar classification */
  tarClass: 'low' | 'medium' | 'high' | 'very_high';
  /** true if below the ~100 mg/Nm³ threshold for unprotected engines */
  engineSafe: boolean;
  /** Plain-language cleaning recommendation */
  cleaningRequired: string;
  /** Dominant tar compound classes expected at this reduction temperature */
  dominantTarCompounds: string[];
}

export interface SimulatorOutput {
  co: number;       // % dry vol
  h2: number;
  co2: number;
  ch4: number;
  n2: number;
  lhv: number;      // Lower heating value MJ/Nm³ (dry)
  coldGasEfficiency: number; // %
  specificGasYield: number;  // Nm³ syngas per kg dry fuel
  enginePowerKw: number;     // indicative kW per kg/h fuel feed
  tar: TarPrediction;
  engineMatch?: EngineMatch; // present only when engine params supplied
  warnings: string[];
  notes: string[];
}

// ─── Fuel properties ────────────────────────────────────────────────────────

interface FuelProps {
  /** Ultimate analysis, dry ash-free basis (mass fraction) */
  C: number; H: number; O: number; N: number; S: number;
  /** Ash content, dry basis (mass fraction) */
  ash: number;
  /** Higher heating value dry basis, MJ/kg */
  hhvDry: number;
}

const FUELS: Record<FuelSpecies, FuelProps> = {
  hardwood:   { C: 0.499, H: 0.062, O: 0.422, N: 0.002, S: 0.001, ash: 0.014, hhvDry: 19.5 },
  softwood:   { C: 0.510, H: 0.063, O: 0.410, N: 0.001, S: 0.001, ash: 0.015, hhvDry: 20.1 },
  woodchips:  { C: 0.495, H: 0.061, O: 0.425, N: 0.002, S: 0.001, ash: 0.016, hhvDry: 19.2 },
  charcoal:   { C: 0.850, H: 0.025, O: 0.080, N: 0.005, S: 0.002, ash: 0.038, hhvDry: 30.5 },
  corn_cobs:  { C: 0.465, H: 0.058, O: 0.445, N: 0.007, S: 0.001, ash: 0.024, hhvDry: 18.1 },
};

/**
 * Blend two fuel property sets by mass fraction.
 * @param f1   Primary fuel properties
 * @param f2   Secondary fuel properties
 * @param r1   Mass fraction of primary fuel (0–1)
 */
function blendFuels(f1: FuelProps, f2: FuelProps, r1: number): FuelProps {
  const r2 = 1 - r1;
  return {
    C:      f1.C      * r1 + f2.C      * r2,
    H:      f1.H      * r1 + f2.H      * r2,
    O:      f1.O      * r1 + f2.O      * r2,
    N:      f1.N      * r1 + f2.N      * r2,
    S:      f1.S      * r1 + f2.S      * r2,
    ash:    f1.ash    * r1 + f2.ash    * r2,
    hhvDry: f1.hhvDry * r1 + f2.hhvDry * r2,
  };
}

// ─── Equilibrium constants (temperature-dependent) ──────────────────────────

/** Boudouard equilibrium constant Kp at temperature T (K) */
function kBoudouard(T: number): number {
  // ln(Kp) = -ΔG°/RT; fitted from JANAF tables 900–1200 K
  return Math.exp(20.92 - 20113 / T);
}

/** Water-gas shift equilibrium constant Kp at temperature T (K) */
function kWGS(T: number): number {
  // Fitted from JANAF tables
  return Math.exp(-3.798 + 4160 / T);
}

/** Methanation equilibrium constant Kp at temperature T (K) */
function kMeth(T: number): number {
  return Math.exp(-16.0 + 11800 / T);
}

// ─── Reduction zone temperature estimate ────────────────────────────────────

function reductionTemp(
  type: SimulatorInput['gasifierType'],
  er: number,
  mc: number,
): number {
  // Base temperatures from literature (K)
  const base: Record<SimulatorInput['gasifierType'], number> = {
    downdraft: 1050,
    fema:       980,
    updraft:    900,
  };
  // ER effect: higher ER → more combustion → higher T
  const erEffect = (er - 0.30) * 600;
  // Moisture penalty: each % MC above 10 costs ~5 K
  const mcPenalty = Math.max(0, mc - 10) * 5;
  return base[type] + erEffect - mcPenalty;
}

// ─── Tar prediction model ────────────────────────────────────────────────────
//
// Based on empirical data from:
//   - Milne, T.A., Evans, R.J., Abatzoglou, N. (1998) Biomass Gasifier "Tars":
//     Their Nature, Formation, and Conversion. NREL/TP-570-25357.
//   - ECN tar classification (Class 1–5) and typical yields by gasifier type.
//   - Hasler & Nussbaumer (1999) Gas cleaning for IC engine applications from
//     fixed bed biomass gasification. Biomass & Bioenergy 16(6).
//
// Tar yield is primarily a function of:
//   1. Gasifier type (updraft >> FEMA > downdraft)
//   2. Reduction zone temperature (higher T → more tar cracking)
//   3. Moisture content (more steam → more oxygenated tars at low T)
//   4. Fuel species (high-lignin fuels produce more phenolic tars)
//
// ECN tar classes relevant to engine use:
//   Class 2: Heterocyclic (pyridine, phenol) — water-soluble, problematic
//   Class 3: Light aromatics (toluene, xylene) — condense below ~150°C
//   Class 4: Light PAH (naphthalene, indene) — condense below ~100°C
//   Class 5: Heavy PAH (pyrene, fluoranthene) — condense at higher temps

/**
 * Estimate tar yield and classification.
 * @param type      Gasifier type
 * @param T         Reduction zone temperature (K)
 * @param mc        Moisture content (% wet basis)
 * @param fuelSpec  Fuel species
 * @param specificGasYield  Nm³ dry syngas per kg dry fuel
 */
function predictTar(
  type: SimulatorInput['gasifierType'],
  T: number,
  mc: number,
  fuelSpec: SimulatorInput['fuelSpecies'],
  specificGasYield: number,
): TarPrediction {
  // ── Base tar yield by gasifier type (g/Nm³) ─────────────────────────────
  // Literature ranges: updraft 30–150, FEMA 10–50, downdraft 0.5–10
  const baseYield: Record<SimulatorInput['gasifierType'], number> = {
    updraft:   80,   // midpoint of 30–150 range
    fema:      25,   // midpoint of 10–50 range
    downdraft:  3,   // midpoint of 0.5–10 range
  };

  let tarGPerNm3 = baseYield[type];

  // ── Temperature correction ───────────────────────────────────────────────
  // Tar cracking accelerates above ~800°C. Empirical fit: each 50 K above
  // 800 K (527°C) reduces tar by ~15% (Milne et al. 1998, Fig. 3-4).
  const T_ref = 1073; // 800°C in K
  if (T > T_ref) {
    const crackingFactor = Math.exp(-0.003 * (T - T_ref));
    tarGPerNm3 *= crackingFactor;
  } else {
    // Below 800°C tar yield rises steeply
    const buildupFactor = Math.exp(0.004 * (T_ref - T));
    tarGPerNm3 *= buildupFactor;
  }

  // ── Moisture correction ──────────────────────────────────────────────────
  // Steam promotes partial oxidation of tars but also increases oxygenated
  // tar species. Net effect: slight increase below 700°C, slight decrease
  // above 900°C. Simplified: +2% per % MC above 15%.
  if (mc > 15) {
    tarGPerNm3 *= 1 + 0.02 * (mc - 15);
  }

  // ── Fuel species correction ──────────────────────────────────────────────
  // High-lignin fuels (softwood, hardwood) produce more phenolic tars.
  // Charcoal has already been pyrolysed — very low tar.
  const fuelFactor: Record<SimulatorInput['fuelSpecies'], number> = {
    hardwood:  1.0,
    softwood:  1.15,  // higher lignin
    woodchips: 1.05,
    charcoal:  0.15,  // pre-pyrolysed
    corn_cobs: 0.90,  // lower lignin, more cellulose
  };
  tarGPerNm3 *= fuelFactor[fuelSpec];

  // Clamp to physically plausible range
  tarGPerNm3 = Math.max(0.05, Math.min(tarGPerNm3, 200));

  // ── Convert to g/kg fuel ─────────────────────────────────────────────────
  const tarGPerKgFuel = tarGPerNm3 * specificGasYield;

  // ── ECN-based classification ─────────────────────────────────────────────
  // Engine threshold: ~100 mg/Nm³ = 0.1 g/Nm³ for unprotected engines
  // (Hasler & Nussbaumer 1999; some sources cite 50 mg/Nm³ for sensitive engines)
  let tarClass: TarPrediction['tarClass'];
  if (tarGPerNm3 < 0.1)       tarClass = 'low';
  else if (tarGPerNm3 < 1.0)  tarClass = 'medium';
  else if (tarGPerNm3 < 10)   tarClass = 'high';
  else                         tarClass = 'very_high';

  const engineSafe = tarGPerNm3 < 0.1; // < 100 mg/Nm³

  // ── Dominant tar compounds by temperature ────────────────────────────────
  // Based on ECN classification and Milne et al. temperature-composition maps
  const T_C = T - 273; // Celsius
  let dominantTarCompounds: string[];
  if (T_C < 600) {
    dominantTarCompounds = ['Mixed oxygenates', 'Phenols', 'Cresols', 'Guaiacols'];
  } else if (T_C < 800) {
    dominantTarCompounds = ['Phenol', 'Cresol', 'Toluene', 'Naphthalene'];
  } else if (T_C < 1000) {
    dominantTarCompounds = ['Naphthalene', 'Toluene', 'Indene', 'Benzene'];
  } else {
    dominantTarCompounds = ['Naphthalene', 'Benzene', 'Pyrene (trace)', 'Fluoranthene (trace)'];
  }

  // ── Cleaning recommendation ──────────────────────────────────────────────
  let cleaningRequired: string;
  if (tarClass === 'low') {
    cleaningRequired = 'Minimal cleaning needed. A simple cyclone and coarse filter are sufficient for most engine applications.';
  } else if (tarClass === 'medium') {
    cleaningRequired = 'Moderate cleaning required. Use a cyclone separator followed by a fabric or paper filter. Monitor filter pressure drop regularly.';
  } else if (tarClass === 'high') {
    cleaningRequired = 'Substantial cleaning required. A wet scrubber or packed-bed tar scrubber is recommended before engine use. Not suitable for direct engine feed without treatment.';
  } else {
    cleaningRequired = 'Extensive cleaning essential. This tar level will foul and damage engines rapidly. A multi-stage system (cyclone + wet scrubber + coalescing filter) is required. Consider switching to a downdraft design for engine applications.';
  }

  return {
    tarYieldGPerNm3:   Math.round(tarGPerNm3 * 100) / 100,
    tarYieldGPerKgFuel: Math.round(tarGPerKgFuel * 10) / 10,
    tarClass,
    engineSafe,
    cleaningRequired,
    dominantTarCompounds,
  };
}

// ─── Engine matching model ───────────────────────────────────────────────────
//
// Based on:
//   - FAO Forestry Paper 72 (1986) — engine derating on producer gas
//   - Kaupp & Goss (1981) — Small Scale Gas Producer-Engine Systems
//   - Typical volumetric efficiency and derating factors from field experience
//
// Key concepts:
//   - Syngas has lower LHV/Nm³ than gasoline vapour → engine derated 30–50%
//   - Derating factor depends on syngas LHV and N₂ dilution
//   - Fuel consumption rate (kg/h) must match gasifier throughput capacity
//   - Displacement + RPM → theoretical air flow → syngas demand at given ER

export interface EngineMatch {
  /** Engine displacement in cc */
  displacementCc: number;
  /** Engine RPM */
  rpm: number;
  /** Theoretical syngas flow rate the engine demands (Nm³/h) */
  syngasFlowNm3h: number;
  /** Fuel feed rate required to supply that syngas (kg dry fuel/h) */
  fuelFeedRateKgH: number;
  /** Estimated shaft power output on syngas (kW) */
  shaftPowerKw: number;
  /** Derating vs rated gasoline power (%) — how much power is lost */
  deratingPct: number;
  /** Rated gasoline power estimate (kW) for this displacement/RPM */
  gasolinePowerKw: number;
  /** Qualitative match quality */
  matchQuality: 'excellent' | 'good' | 'marginal' | 'poor';
  /** Plain-language match assessment */
  matchAssessment: string;
  /** Recommended fuel feed rate range (kg/h) for this engine */
  recommendedFeedRangeKgH: [number, number];
}

/**
 * Match an engine to a gasifier operating on the given syngas.
 *
 * @param displacementCc  Engine displacement in cubic centimetres
 * @param rpm             Engine operating RPM (typically 1500 or 3000 for gensets)
 * @param lhv             Syngas LHV (MJ/Nm³ dry)
 * @param specificGasYield Nm³ dry syngas per kg dry fuel
 * @param n2Pct           N₂ fraction in dry syngas (%)
 */
function matchEngine(
  displacementCc: number,
  rpm: number,
  lhv: number,
  specificGasYield: number,
  n2Pct: number,
): EngineMatch {
  // ── Volumetric efficiency ────────────────────────────────────────────────
  // Naturally aspirated 4-stroke: ~80% volumetric efficiency
  const volEff = 0.80;
  // 4-stroke: one intake stroke per 2 revolutions
  const strokesPerRev = 0.5;
  // Theoretical intake volume (m³/s)
  const intakeM3s = (displacementCc / 1e6) * rpm * strokesPerRev * volEff / 60;

  // ── Syngas/air mixture ratio ─────────────────────────────────────────────
  // Stoichiometric syngas-to-air ratio by volume.
  // Syngas is ~35% combustible (CO+H₂) at LHV ~5–7 MJ/Nm³.
  // Stoichiometric air for syngas ≈ 1.0–1.3 Nm³ air per Nm³ syngas (varies with composition).
  // Simplified: stoich air/syngas ≈ lhv / 3.5 (empirical fit from FAO FP72 Table 4.3)
  const stoichAirPerSyngas = Math.max(0.8, lhv / 3.5);
  // Mixture fraction: syngas / (syngas + air) at stoichiometric
  const syngasFraction = 1 / (1 + stoichAirPerSyngas);
  // Syngas flow demanded by engine (Nm³/s)
  const syngasM3s = intakeM3s * syngasFraction;
  const syngasFlowNm3h = syngasM3s * 3600;

  // ── Fuel feed rate ───────────────────────────────────────────────────────
  const fuelFeedRateKgH = syngasFlowNm3h / specificGasYield;

  // ── Derating factor ──────────────────────────────────────────────────────
  // Derating = 1 - (energy_density_syngas_mixture / energy_density_gasoline_mixture)
  // Gasoline mixture energy density ≈ 3.5 MJ/Nm³ intake
  // Syngas mixture energy density = lhv * syngasFraction
  const syngasMixtureEnergy = lhv * syngasFraction; // MJ/Nm³ intake
  const gasolineMixtureEnergy = 3.5; // MJ/Nm³ intake (reference)
  const deratingFactor = syngasMixtureEnergy / gasolineMixtureEnergy;
  const deratingPct = Math.round((1 - deratingFactor) * 100);

  // ── Power estimates ──────────────────────────────────────────────────────
  // Gasoline power: BMEP ≈ 850 kPa for naturally aspirated petrol engine
  // P = BMEP * displacement * RPM / (2 * 60 * 1000) [kW]
  const bmepGasoline = 850; // kPa
  const gasolinePowerKw = (bmepGasoline * (displacementCc / 1e6) * rpm) / (2 * 60 * 1000);
  const shaftPowerKw = gasolinePowerKw * deratingFactor * 0.95; // 5% mechanical loss

  // ── Recommended feed rate range ──────────────────────────────────────────
  // Gasifiers have a turndown ratio of ~2:1 around design point
  const nominalFeed = fuelFeedRateKgH;
  const recommendedFeedRangeKgH: [number, number] = [
    Math.round(nominalFeed * 0.7 * 10) / 10,
    Math.round(nominalFeed * 1.3 * 10) / 10,
  ];

  // ── Match quality ────────────────────────────────────────────────────────
  // A well-matched engine runs at 1–5 kg/h for small gensets, 5–20 kg/h for larger.
  // N₂ dilution above 50% indicates poor syngas quality for engines.
  let matchQuality: EngineMatch['matchQuality'];
  let matchAssessment: string;

  const n2Fraction = n2Pct / 100;
  const lhvScore = lhv >= 5.0 ? 1 : lhv >= 4.0 ? 0.7 : 0.4;
  const n2Score   = n2Fraction < 0.40 ? 1 : n2Fraction < 0.50 ? 0.7 : 0.4;
  const score = lhvScore * n2Score;

  if (score >= 0.9 && deratingPct < 35) {
    matchQuality = 'excellent';
    matchAssessment = `This engine is well-matched to the syngas quality. Expect ${Math.round(shaftPowerKw)} kW shaft output — a ${deratingPct}% reduction from its ${Math.round(gasolinePowerKw)} kW gasoline rating. Fuel feed rate of ${fuelFeedRateKgH.toFixed(1)} kg/h is in the practical range.`;
  } else if (score >= 0.7 && deratingPct < 45) {
    matchQuality = 'good';
    matchAssessment = `Good match. The ${deratingPct}% derating is typical for producer gas engines. At ${fuelFeedRateKgH.toFixed(1)} kg/h fuel feed you should achieve ${Math.round(shaftPowerKw)} kW. Consider a larger gasifier throat if you need more power.`;
  } else if (score >= 0.5) {
    matchQuality = 'marginal';
    matchAssessment = `Marginal match. High N₂ dilution (${n2Pct.toFixed(0)}%) or low LHV (${lhv.toFixed(2)} MJ/Nm³) limits engine performance. Derating is ${deratingPct}%. Consider a downdraft gasifier with drier fuel to improve syngas quality.`;
  } else {
    matchQuality = 'poor';
    matchAssessment = `Poor match. The syngas LHV of ${lhv.toFixed(2)} MJ/Nm³ with ${n2Pct.toFixed(0)}% N₂ will cause severe derating (${deratingPct}%) and rough running. This combination is not recommended for engine use without significant process improvements.`;
  }

  return {
    displacementCc,
    rpm,
    syngasFlowNm3h:    Math.round(syngasFlowNm3h * 10) / 10,
    fuelFeedRateKgH:   Math.round(fuelFeedRateKgH * 10) / 10,
    shaftPowerKw:      Math.round(shaftPowerKw * 10) / 10,
    deratingPct:       Math.max(0, deratingPct),
    gasolinePowerKw:   Math.round(gasolinePowerKw * 10) / 10,
    matchQuality,
    matchAssessment,
    recommendedFeedRangeKgH,
  };
}

// ─── Core solver (exported for compare endpoint) ─────────────────────────────

export { FUELS };

export function solve(input: SimulatorInput): SimulatorOutput {
  const warnings: string[] = [];
  const notes: string[] = [];

  const { gasifierType, fuelSpecies, moistureContent, fuelSizeMm, equivalenceRatio } = input;

  // ── Fuel properties (single or blended) ─────────────────────────────────
  let fuel: FuelProps;
  if (input.blendEnabled && input.fuelSpecies2 && input.blendRatio !== undefined) {
    const r1 = Math.max(0, Math.min(100, input.blendRatio)) / 100;
    fuel = blendFuels(FUELS[fuelSpecies], FUELS[input.fuelSpecies2], r1);
    const pct1 = Math.round(r1 * 100);
    const pct2 = 100 - pct1;
    const name1 = fuelSpecies.replace('_', ' ');
    const name2 = input.fuelSpecies2.replace('_', ' ');
    notes.push(`Blended fuel: ${pct1}% ${name1} + ${pct2}% ${name2} by mass. Properties are linearly interpolated from individual fuel ultimate analyses.`);
  } else {
    fuel = FUELS[fuelSpecies];
  }

  // ── Moisture correction ──────────────────────────────────────────────────
  const mc = moistureContent / 100; // wet basis fraction
  // Dry fuel fraction of wet feed
  const dryFrac = 1 - mc;
  // Effective HHV of wet fuel (MJ/kg wet) — retained for future moisture-penalty calculations
  const _hhvWet = fuel.hhvDry * dryFrac - 2.442 * mc; // 2.442 MJ/kg latent heat of water
  void _hhvWet;

  if (moistureContent > 25) {
    warnings.push(`Moisture content of ${moistureContent}% is high. Gasification efficiency drops sharply above 25%. Dry your fuel to below 20% for reliable operation.`);
  }
  if (moistureContent > 35) {
    warnings.push(`At ${moistureContent}% moisture the gasifier may struggle to sustain combustion. Self-sustaining gasification typically requires < 30% MC.`);
  }

  // ── Fuel size warnings ───────────────────────────────────────────────────
  if (gasifierType === 'downdraft' && (fuelSizeMm < 20 || fuelSizeMm > 100)) {
    warnings.push(`Downdraft gasifiers work best with 20–100 mm fuel. At ${fuelSizeMm} mm you may see bridging or channeling.`);
  }
  if (gasifierType === 'fema' && fuelSizeMm > 80) {
    warnings.push(`FEMA design is optimised for smaller fuel (< 80 mm). Large pieces may cause bridging.`);
  }

  // ── Stoichiometric air ───────────────────────────────────────────────────
  // Stoichiometric O₂ per kg dry fuel (kg O₂/kg)
  const stoichO2 = fuel.C * (32 / 12) + fuel.H * (16 / 2) - fuel.O;
  // Actual O₂ supplied per kg dry fuel
  const actualO2 = equivalenceRatio * stoichO2;
  // Air supplied (kg/kg dry fuel), air is ~23.2% O₂ by mass
  const airKg = actualO2 / 0.232;
  // N₂ from air (kg/kg dry fuel)
  const n2FromAir = airKg * 0.768;

  // ── Molar feed per kg dry fuel ───────────────────────────────────────────
  const mC  = fuel.C / 12;          // kmol C
  const mH  = fuel.H / 2;           // kmol H₂ (as H₂)
  const mO  = fuel.O / 32;          // kmol O₂ equivalent from fuel
  const mH2O = mc / (dryFrac * 18); // kmol H₂O from moisture per kg dry fuel
  const mO2  = actualO2 / 32;       // kmol O₂ from air
  const mN2  = n2FromAir / 28;      // kmol N₂ from air

  // ── Reduction zone temperature ───────────────────────────────────────────
  const T = reductionTemp(gasifierType, equivalenceRatio, moistureContent);

  // ── Equilibrium iteration ────────────────────────────────────────────────
  // Initial guess: all C → CO, all H₂O → H₂
  let co  = mC;
  let co2 = mO2 + mO - mC / 2;
  let h2  = mH + mH2O;
  let ch4 = 0.01 * mC;
  let h2o = 0.01 * mH2O;
  let n2  = mN2;

  // Clamp negatives from initial guess
  co2 = Math.max(co2, 0.001);
  h2  = Math.max(h2,  0.001);

  const Kb  = kBoudouard(T);
  const Kw  = kWGS(T);
  const Km  = kMeth(T);

  // Iterative relaxation (50 iterations is sufficient for convergence)
  for (let i = 0; i < 50; i++) {
    const total = co + co2 + h2 + ch4 + h2o + n2;
    const P = 1.0; // atmospheric pressure (atm)

    // Boudouard: CO²/CO₂ = Kb * P  (partial pressures)
    const pCO  = (co  / total) * P;
    const pCO2 = (co2 / total) * P;
    const pH2  = (h2  / total) * P;
    const pCH4 = (ch4 / total) * P;
    const pH2O = (h2o / total) * P;

    // Boudouard residual: pCO² - Kb * pCO₂ = 0
    const boudouardErr = pCO * pCO - Kb * pCO2;
    // WGS residual: pCO₂ * pH₂ - Kw * pCO * pH₂O = 0
    const wgsErr = pCO2 * pH2 - Kw * pCO * pH2O;
    // Methanation residual: pCH₄ - Km * pCO₂ * pH₂² = 0
    const methErr = pCH4 - Km * pCO2 * pH2 * pH2;

    const step = 0.05;
    co  -= step * boudouardErr * 2;
    co2 += step * boudouardErr;
    co  -= step * wgsErr;
    h2o += step * wgsErr;
    co2 -= step * wgsErr;
    h2  += step * wgsErr;
    ch4 -= step * methErr;
    h2  += step * methErr * 2;

    // Keep all values positive
    co  = Math.max(co,  0.0001);
    co2 = Math.max(co2, 0.0001);
    h2  = Math.max(h2,  0.0001);
    ch4 = Math.max(ch4, 0.00001);
    h2o = Math.max(h2o, 0.00001);
  }

  // ── Dry syngas composition (remove H₂O) ─────────────────────────────────
  const dryTotal = co + co2 + h2 + ch4 + n2;
  const pctCO  = (co  / dryTotal) * 100;
  const pctCO2 = (co2 / dryTotal) * 100;
  const pctH2  = (h2  / dryTotal) * 100;
  const pctCH4 = (ch4 / dryTotal) * 100;
  const pctN2  = (n2  / dryTotal) * 100;

  // ── Heating value ────────────────────────────────────────────────────────
  // LHV contributions (MJ/Nm³ at STP): CO=12.63, H₂=10.79, CH₄=35.82
  const lhv = (pctCO / 100) * 12.63 + (pctH2 / 100) * 10.79 + (pctCH4 / 100) * 35.82;

  // ── Specific gas yield (Nm³ dry syngas per kg dry fuel) ──────────────────
  // Ideal gas: 1 kmol = 22.4 Nm³
  const specificGasYield = dryTotal * 22.4;

  // ── Cold gas efficiency ──────────────────────────────────────────────────
  // Energy in syngas / energy in wet fuel fed
  const syngasEnergy = specificGasYield * lhv;   // MJ per kg dry fuel
  // Clamp to physically plausible range (losses mean it can't exceed ~85%)
  const coldGasEfficiency = Math.min((syngasEnergy / fuel.hhvDry) * 100, 85);

  // ── Engine power estimate ────────────────────────────────────────────────
  // Typical dual-fuel engine: ~30% thermal efficiency, syngas LHV basis
  // Power (kW) per kg/h fuel feed
  const enginePowerKw = (syngasEnergy * 0.30 * 1000) / 3600;

  // ── Tar prediction ───────────────────────────────────────────────────────
  // Use primary fuel species for compound classification; blended HHV already
  // captured in the blended fuel properties used throughout the solver.
  const tarFuelSpec = input.blendEnabled && input.fuelSpecies2 && input.blendRatio !== undefined
    ? (input.blendRatio >= 50 ? fuelSpecies : input.fuelSpecies2)
    : fuelSpecies;
  const tar = predictTar(gasifierType, T, moistureContent, tarFuelSpec, specificGasYield);

  // ── Engine matching (optional) ───────────────────────────────────────────
  let engineMatch: EngineMatch | undefined;
  if (input.engineDisplacementCc && input.engineRpm) {
    engineMatch = matchEngine(
      input.engineDisplacementCc,
      input.engineRpm,
      lhv,
      specificGasYield,
      pctN2,
    );
  }

  // ── Tar-related warnings ─────────────────────────────────────────────────
  if (gasifierType === 'updraft') {
    warnings.push(`Updraft gasifiers produce high tar levels — estimated ${tar.tarYieldGPerNm3.toFixed(1)} g/Nm³. Extensive cleaning is required before engine use.`);
  } else if (!tar.engineSafe) {
    warnings.push(`Estimated tar yield of ${tar.tarYieldGPerNm3.toFixed(2)} g/Nm³ exceeds the ~0.1 g/Nm³ engine-safe threshold. Cleaning is required.`);
  }
  if (gasifierType === 'fema') {
    notes.push('The FEMA design is optimised for emergency vehicle use, not continuous power generation. Expect lower efficiency and higher tar than a well-tuned Imbert downdraft.');
  }
  if (coldGasEfficiency < 55) {
    warnings.push(`Cold gas efficiency of ${coldGasEfficiency.toFixed(0)}% is below the typical 60–75% range. Check moisture content and equivalence ratio.`);
  }

  notes.push('Results are based on a simplified two-reaction equilibrium model. Real gasifiers deviate due to kinetics, channeling, and tar. Treat these as indicative estimates, not design specifications.');
  notes.push(`Reduction zone temperature estimated at ${Math.round(T - 273)}°C.`);

  return {
    co:  Math.round(pctCO  * 10) / 10,
    h2:  Math.round(pctH2  * 10) / 10,
    co2: Math.round(pctCO2 * 10) / 10,
    ch4: Math.round(pctCH4 * 10) / 10,
    n2:  Math.round(pctN2  * 10) / 10,
    lhv: Math.round(lhv * 100) / 100,
    coldGasEfficiency: Math.round(coldGasEfficiency * 10) / 10,
    specificGasYield:  Math.round(specificGasYield * 100) / 100,
    enginePowerKw:     Math.round(enginePowerKw * 10) / 10,
    tar,
    engineMatch,
    warnings,
    notes,
  };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req: Request, res: Response) {
  try {
    const {
      gasifierType,
      fuelSpecies,
      moistureContent,
      fuelSizeMm,
      equivalenceRatio,
      blendEnabled,
      fuelSpecies2,
      blendRatio,
      engineDisplacementCc,
      engineRpm,
    } = req.body as SimulatorInput;

    const validFuels = ['hardwood', 'softwood', 'woodchips', 'charcoal', 'corn_cobs'];

    // Basic validation
    if (!['downdraft', 'updraft', 'fema'].includes(gasifierType)) {
      return res.status(400).json({ error: 'Invalid gasifierType' });
    }
    if (!validFuels.includes(fuelSpecies)) {
      return res.status(400).json({ error: 'Invalid fuelSpecies' });
    }
    if (moistureContent < 0 || moistureContent > 40) {
      return res.status(400).json({ error: 'moistureContent must be 0–40' });
    }
    if (fuelSizeMm < 5 || fuelSizeMm > 150) {
      return res.status(400).json({ error: 'fuelSizeMm must be 5–150' });
    }
    if (equivalenceRatio < 0.20 || equivalenceRatio > 0.45) {
      return res.status(400).json({ error: 'equivalenceRatio must be 0.20–0.45' });
    }
    // Blend validation
    if (blendEnabled) {
      if (!fuelSpecies2 || !validFuels.includes(fuelSpecies2)) {
        return res.status(400).json({ error: 'Invalid fuelSpecies2 for blend' });
      }
      if (fuelSpecies2 === fuelSpecies) {
        return res.status(400).json({ error: 'fuelSpecies2 must differ from fuelSpecies' });
      }
      if (blendRatio === undefined || blendRatio < 0 || blendRatio > 100) {
        return res.status(400).json({ error: 'blendRatio must be 0–100' });
      }
    }

    // Engine matching validation
    if (engineDisplacementCc !== undefined && (engineDisplacementCc < 50 || engineDisplacementCc > 20000)) {
      return res.status(400).json({ error: 'engineDisplacementCc must be 50–20000' });
    }
    if (engineRpm !== undefined && (engineRpm < 500 || engineRpm > 6000)) {
      return res.status(400).json({ error: 'engineRpm must be 500–6000' });
    }

    const result = solve({
      gasifierType,
      fuelSpecies,
      moistureContent: Number(moistureContent),
      fuelSizeMm: Number(fuelSizeMm),
      equivalenceRatio: Number(equivalenceRatio),
      blendEnabled: Boolean(blendEnabled),
      fuelSpecies2,
      blendRatio: blendRatio !== undefined ? Number(blendRatio) : undefined,
      engineDisplacementCc: engineDisplacementCc !== undefined ? Number(engineDisplacementCc) : undefined,
      engineRpm: engineRpm !== undefined ? Number(engineRpm) : undefined,
    });

    res.json(result);
  } catch (err) {
    console.error('simulator.error', err);
    res.status(500).json({ error: 'Solver failed', message: String(err) });
  }
}
