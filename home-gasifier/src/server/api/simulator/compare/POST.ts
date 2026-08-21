import type { Request, Response } from 'express';
import { solve, FUELS, type FuelSpecies, type SimulatorOutput } from '../POST.js';

/**
 * Multi-fuel comparison endpoint.
 *
 * Accepts the same gasifier/operating parameters as the main simulator,
 * but runs the solver for every fuel species (or a specified subset) and
 * returns a ranked comparison table.
 *
 * POST /api/simulator/compare
 * Body: {
 *   gasifierType, moistureContent, fuelSizeMm, equivalenceRatio,
 *   fuels?: FuelSpecies[]   // optional subset; defaults to all 5
 * }
 */

export interface FuelComparisonRow {
  fuelSpecies: FuelSpecies;
  fuelLabel: string;
  co: number;
  h2: number;
  lhv: number;
  coldGasEfficiency: number;
  specificGasYield: number;
  enginePowerKw: number;
  tarGPerNm3: number;
  tarClass: SimulatorOutput['tar']['tarClass'];
  engineSafe: boolean;
  rank: number; // 1 = best overall by LHV × CGE score
}

export interface CompareOutput {
  rows: FuelComparisonRow[];
  bestFuel: FuelSpecies;
  summary: string;
}

const FUEL_LABELS: Record<FuelSpecies, string> = {
  hardwood:  'Hardwood',
  softwood:  'Softwood',
  woodchips: 'Wood Chips',
  charcoal:  'Charcoal',
  corn_cobs: 'Corn Cobs',
};

export default async function handler(req: Request, res: Response) {
  try {
    const {
      gasifierType,
      moistureContent,
      fuelSizeMm,
      equivalenceRatio,
      fuels,
    } = req.body as {
      gasifierType: 'downdraft' | 'updraft' | 'fema';
      moistureContent: number;
      fuelSizeMm: number;
      equivalenceRatio: number;
      fuels?: FuelSpecies[];
    };

    // Validation
    if (!['downdraft', 'updraft', 'fema'].includes(gasifierType)) {
      return res.status(400).json({ error: 'Invalid gasifierType' });
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

    const allFuels = Object.keys(FUELS) as FuelSpecies[];
    const targetFuels: FuelSpecies[] = (fuels && fuels.length > 0)
      ? fuels.filter(f => allFuels.includes(f))
      : allFuels;

    if (targetFuels.length < 2) {
      return res.status(400).json({ error: 'At least 2 valid fuel species required for comparison' });
    }

    // Run solver for each fuel
    const results = targetFuels.map(fuelSpecies => ({
      fuelSpecies,
      result: solve({
        gasifierType,
        fuelSpecies,
        moistureContent: Number(moistureContent),
        fuelSizeMm: Number(fuelSizeMm),
        equivalenceRatio: Number(equivalenceRatio),
      }),
    }));

    // Score each fuel: composite = LHV (weight 0.5) + CGE (weight 0.3) + tar safety (weight 0.2)
    // Normalise each metric to 0–1 across the set
    const lhvValues  = results.map(r => r.result.lhv);
    const cgeValues  = results.map(r => r.result.coldGasEfficiency);
    const tarValues  = results.map(r => r.result.tar.tarYieldGPerNm3);

    const lhvMax  = Math.max(...lhvValues);
    const lhvMin  = Math.min(...lhvValues);
    const cgeMax  = Math.max(...cgeValues);
    const cgeMin  = Math.min(...cgeValues);
    const tarMax  = Math.max(...tarValues);
    const tarMin  = Math.min(...tarValues);

    const norm = (v: number, min: number, max: number) =>
      max === min ? 1 : (v - min) / (max - min);

    const scored = results.map(({ fuelSpecies, result }) => {
      const lhvScore = norm(result.lhv, lhvMin, lhvMax);
      const cgeScore = norm(result.coldGasEfficiency, cgeMin, cgeMax);
      // Lower tar = better → invert
      const tarScore = 1 - norm(result.tar.tarYieldGPerNm3, tarMin, tarMax);
      const composite = lhvScore * 0.5 + cgeScore * 0.3 + tarScore * 0.2;
      return { fuelSpecies, result, composite };
    });

    // Sort by composite score descending
    scored.sort((a, b) => b.composite - a.composite);

    const rows: FuelComparisonRow[] = scored.map(({ fuelSpecies, result }, idx) => ({
      fuelSpecies,
      fuelLabel: FUEL_LABELS[fuelSpecies],
      co:   result.co,
      h2:   result.h2,
      lhv:  result.lhv,
      coldGasEfficiency: result.coldGasEfficiency,
      specificGasYield:  result.specificGasYield,
      enginePowerKw:     result.enginePowerKw,
      tarGPerNm3:        result.tar.tarYieldGPerNm3,
      tarClass:          result.tar.tarClass,
      engineSafe:        result.tar.engineSafe,
      rank: idx + 1,
    }));

    const best = rows[0];
    const worst = rows[rows.length - 1];
    const lhvDiff = Math.round((best.lhv - worst.lhv) * 100) / 100;
    const summary = `${best.fuelLabel} produces the best syngas for a ${gasifierType} gasifier at these conditions — ${best.lhv.toFixed(2)} MJ/Nm³ LHV and ${best.coldGasEfficiency.toFixed(0)}% cold gas efficiency. ${lhvDiff > 0.3 ? `That's ${lhvDiff.toFixed(2)} MJ/Nm³ more than ${worst.fuelLabel}, the lowest-ranked option.` : 'Differences between fuels are modest at these conditions.'}`;

    const output: CompareOutput = {
      rows,
      bestFuel: best.fuelSpecies,
      summary,
    };

    res.json(output);
  } catch (err) {
    console.error('simulator.compare.error', err);
    res.status(500).json({ error: 'Comparison failed', message: String(err) });
  }
}
