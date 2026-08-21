import { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, FlaskConical, Flame, Wind, Zap, Gauge, Droplets, CheckCircle, XCircle, Blend, Settings2, BarChart3, Trophy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { simulator } from 'virtual:content';

const site = 'https://homegasifier.com';
const url = `${site}/simulator`;
const title = 'Gasifier Syngas Simulator — Home Gasifier';
const description =
  'Estimate syngas composition, heating value, and cold gas efficiency for your gasifier setup. Enter your fuel type, moisture content, and operating conditions.';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TarResult {
  tarYieldGPerNm3: number;
  tarYieldGPerKgFuel: number;
  tarClass: 'low' | 'medium' | 'high' | 'very_high';
  engineSafe: boolean;
  cleaningRequired: string;
  dominantTarCompounds: string[];
}

interface EngineMatchResult {
  displacementCc: number;
  rpm: number;
  syngasFlowNm3h: number;
  fuelFeedRateKgH: number;
  shaftPowerKw: number;
  deratingPct: number;
  gasolinePowerKw: number;
  matchQuality: 'excellent' | 'good' | 'marginal' | 'poor';
  matchAssessment: string;
  recommendedFeedRangeKgH: [number, number];
}

interface SimResult {
  co: number; h2: number; co2: number; ch4: number; n2: number;
  lhv: number;
  coldGasEfficiency: number;
  specificGasYield: number;
  enginePowerKw: number;
  tar: TarResult;
  engineMatch?: EngineMatchResult;
  warnings: string[];
  notes: string[];
}

interface CompareRow {
  fuelSpecies: string;
  fuelLabel: string;
  co: number;
  h2: number;
  lhv: number;
  coldGasEfficiency: number;
  specificGasYield: number;
  enginePowerKw: number;
  tarGPerNm3: number;
  tarClass: TarResult['tarClass'];
  engineSafe: boolean;
  rank: number;
}

interface CompareResult {
  rows: CompareRow[];
  bestFuel: string;
  summary: string;
}

type GasifierType = 'downdraft' | 'updraft' | 'fema';
type FuelSpecies  = 'hardwood' | 'softwood' | 'woodchips' | 'charcoal' | 'corn_cobs';

// ─── Sub-components ───────────────────────────────────────────────────────────

function GasBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-xs font-mono text-right text-muted-foreground shrink-0">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="w-12 text-right text-sm font-semibold tabular-nums">{value.toFixed(1)}%</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const [gasifierType, setGasifierType] = useState<GasifierType>('downdraft');
  const [fuelSpecies, setFuelSpecies]   = useState<FuelSpecies>('hardwood');
  const [blendEnabled, setBlendEnabled] = useState(false);
  const [fuelSpecies2, setFuelSpecies2] = useState<FuelSpecies>('charcoal');
  const [blendRatio, setBlendRatio]     = useState(70);
  const [moisture, setMoisture]         = useState(15);
  const [fuelSize, setFuelSize]         = useState(50);
  const [er, setEr]                     = useState(0.30);
  // Engine matching
  const [engineEnabled, setEngineEnabled]   = useState(false);
  const [enginePresetId, setEnginePresetId] = useState('kubota_d902');
  const [engineCc, setEngineCc]             = useState(898);
  const [engineRpm, setEngineRpm]           = useState(3000);
  const [engineCustom, setEngineCustom]     = useState(false);
  // Results
  const [result, setResult]           = useState<SimResult | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  // Compare
  const [compareResult, setCompareResult]   = useState<CompareResult | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError]     = useState<string | null>(null);

  function applyPreset(presetId: string) {
    const preset = simulator.enginePresets.find(p => p.id === presetId);
    if (!preset) return;
    setEnginePresetId(presetId);
    if (presetId === 'custom') {
      setEngineCustom(true);
    } else {
      setEngineCustom(false);
      setEngineCc(preset.cc);
      setEngineRpm(preset.rpm);
    }
  }

  async function runSimulation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gasifierType,
          fuelSpecies,
          moistureContent: moisture,
          fuelSizeMm: fuelSize,
          equivalenceRatio: er,
          blendEnabled,
          fuelSpecies2: blendEnabled ? fuelSpecies2 : undefined,
          blendRatio:   blendEnabled ? blendRatio   : undefined,
          engineDisplacementCc: engineEnabled ? engineCc  : undefined,
          engineRpm:            engineEnabled ? engineRpm : undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `Server error ${res.status}`);
      }
      setResult(await res.json() as SimResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function runCompare() {
    setCompareLoading(true);
    setCompareError(null);
    try {
      const res = await fetch('/api/simulator/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gasifierType,
          moistureContent: moisture,
          fuelSizeMm: fuelSize,
          equivalenceRatio: er,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `Server error ${res.status}`);
      }
      setCompareResult(await res.json() as CompareResult);
    } catch (e) {
      setCompareError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setCompareLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${site}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${site}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          name: title,
          url,
          description,
          isPartOf: { '@id': `${site}/#website` },
          about: { '@id': `${site}/#organization` },
        })}</script>
      </Helmet>

      <main>
        {/* ── Hero ── */}
        <section className="bg-gradient-to-b from-muted/60 to-background pt-28 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{simulator.hero.badge}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{simulator.hero.title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{simulator.hero.description}</p>
          </div>
        </section>

        {/* ── Main layout ── */}
        <section className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Inputs panel */}
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-lg font-semibold">{simulator.inputs.heading}</h2>

            {/* Gasifier type */}
            <div>
              <label className="block text-sm font-medium mb-2">{simulator.inputs.gasifierTypeLabel}</label>
              <div className="grid grid-cols-1 gap-2">
                {simulator.gasifierTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setGasifierType(t.id as GasifierType)}
                    className={`text-left px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      gasifierType === t.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel type */}
            <div>
              <label className="block text-sm font-medium mb-2">{simulator.inputs.fuelTypeLabel}</label>
              <div className="grid grid-cols-1 gap-2">
                {simulator.fuelTypes.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFuelSpecies(f.id as FuelSpecies)}
                    className={`text-left px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      fuelSpecies === f.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Blend toggle */}
            <div className="border border-border rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Blend className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{simulator.inputs.blendToggleLabel}</span>
                </div>
                <Switch
                  checked={blendEnabled}
                  onCheckedChange={setBlendEnabled}
                  aria-label="Toggle fuel blending"
                />
              </div>
              <p className="text-xs text-muted-foreground -mt-2">{simulator.inputs.blendToggleHelp}</p>

              {blendEnabled && (
                <div className="flex flex-col gap-4 pt-1 border-t border-border">
                  {/* Second fuel selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">{simulator.inputs.secondFuelLabel}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {simulator.fuelTypes
                        .filter((f) => f.id !== fuelSpecies)
                        .map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFuelSpecies2(f.id as FuelSpecies)}
                            className={`text-left px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                              fuelSpecies2 === f.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                            }`}
                          >
                            <span>{f.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Blend ratio slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">{simulator.inputs.blendRatioLabel}</label>
                      <span className="text-sm font-semibold text-primary tabular-nums">{blendRatio}%</span>
                    </div>
                    <Slider
                      min={10} max={90} step={5}
                      value={[blendRatio]}
                      onValueChange={([v]) => setBlendRatio(v)}
                      className="w-full"
                    />
                    {/* Visual blend bar */}
                    <div className="mt-2 rounded-full overflow-hidden h-3 flex">
                      <div
                        className="bg-primary transition-all duration-300"
                        style={{ width: `${blendRatio}%` }}
                      />
                      <div
                        className="bg-secondary transition-all duration-300"
                        style={{ width: `${100 - blendRatio}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{simulator.fuelTypes.find(f => f.id === fuelSpecies)?.label ?? fuelSpecies} ({blendRatio}%)</span>
                      <span>{simulator.fuelTypes.find(f => f.id === fuelSpecies2)?.label ?? fuelSpecies2} ({100 - blendRatio}%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">{simulator.inputs.blendRatioHelp}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Moisture */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{simulator.inputs.moistureLabel}</label>
                <span className="text-sm font-semibold text-primary tabular-nums">{moisture}% wb</span>
              </div>
              <Slider
                min={0} max={40} step={1}
                value={[moisture]}
                onValueChange={([v]) => setMoisture(v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{simulator.inputs.moistureDryLabel}</span>
                <span className="text-amber-500 font-medium">{simulator.inputs.moistureLimitLabel}</span>
                <span>{simulator.inputs.moistureMaxLabel}</span>
              </div>
            </div>

            {/* Fuel size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{simulator.inputs.fuelSizeLabel}</label>
                <span className="text-sm font-semibold text-primary tabular-nums">{fuelSize} mm</span>
              </div>
              <Slider
                min={5} max={150} step={5}
                value={[fuelSize]}
                onValueChange={([v]) => setFuelSize(v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 mm</span>
                <span>150 mm</span>
              </div>
            </div>

            {/* Equivalence ratio */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{simulator.inputs.erLabel}</label>
                <span className="text-sm font-semibold text-primary tabular-nums">{er.toFixed(2)}</span>
              </div>
              <Slider
                min={0.20} max={0.45} step={0.01}
                value={[er]}
                onValueChange={([v]) => setEr(v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{simulator.inputs.erRichLabel}</span>
                <span>{simulator.inputs.erTypicalLabel}</span>
                <span>{simulator.inputs.erLeanLabel}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{simulator.inputs.erHelp}</p>
            </div>

            {/* Engine matching toggle */}
            <div className="border border-border rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{simulator.inputs.engineToggleLabel}</span>
                </div>
                <Switch
                  checked={engineEnabled}
                  onCheckedChange={setEngineEnabled}
                  aria-label="Toggle engine matching"
                />
              </div>
              <p className="text-xs text-muted-foreground -mt-2">{simulator.inputs.engineToggleHelp}</p>

              {engineEnabled && (
                <div className="flex flex-col gap-4 pt-1 border-t border-border">
                  {/* Preset selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Engine preset</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {simulator.enginePresets.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => applyPreset(p.id)}
                          className={`text-left px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                            enginePresetId === p.id
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom inputs */}
                  {engineCustom && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">{simulator.inputs.engineDisplacementLabel}</label>
                          <span className="text-sm font-semibold text-primary tabular-nums">{engineCc} cc</span>
                        </div>
                        <Slider
                          min={50} max={8000} step={50}
                          value={[engineCc]}
                          onValueChange={([v]) => setEngineCc(v)}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>50 cc</span>
                          <span>8000 cc</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{simulator.inputs.engineDisplacementHelp}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">{simulator.inputs.engineRpmLabel}</label>
                          <span className="text-sm font-semibold text-primary tabular-nums">{engineRpm} RPM</span>
                        </div>
                        <Slider
                          min={500} max={6000} step={100}
                          value={[engineRpm]}
                          onValueChange={([v]) => setEngineRpm(v)}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>500 RPM</span>
                          <span>6000 RPM</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show selected engine summary when preset chosen */}
                  {!engineCustom && (
                    <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{engineCc} cc</span>
                      <span> at </span>
                      <span className="font-medium text-foreground">{engineRpm} RPM</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={runSimulation}
              disabled={loading}
              className="w-full mt-2"
              size="lg"
            >
              {loading ? simulator.inputs.runningButton : simulator.inputs.runButton}
            </Button>
          </div>

          {/* Results panel */}
          <div className="flex flex-col gap-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex gap-3 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {!result && !error && (
              <div className="bg-muted/40 border border-border rounded-2xl p-8 text-center text-muted-foreground">
                <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
                <p className="text-sm">
                  <span>{simulator.results.emptyHeading} </span>
                  <strong>{simulator.results.emptyHighlight}</strong>
                  <span> {simulator.results.emptyTail}</span>
                </p>
              </div>
            )}

            {result && (
              <>
                {/* Syngas composition */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>{simulator.results.compositionHeading}</span>
                  </h2>
                  <div className="flex flex-col gap-3">
                    <GasBar label="CO"  value={result.co}  color="bg-primary" />
                    <GasBar label="H₂"  value={result.h2}  color="bg-blue-500" />
                    <GasBar label="CO₂" value={result.co2} color="bg-muted-foreground" />
                    <GasBar label="CH₄" value={result.ch4} color="bg-green-500" />
                    <GasBar label="N₂"  value={result.n2}  color="bg-secondary/70" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{simulator.results.compositionNote}</p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {/* LHV */}
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{simulator.results.lhvLabel}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-primary tabular-nums">{result.lhv.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">{simulator.results.lhvUnit}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{simulator.results.lhvSub}</span>
                  </div>
                  {/* Cold gas efficiency */}
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Gauge className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{simulator.results.cgeLabel}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-primary tabular-nums">{result.coldGasEfficiency.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">{simulator.results.cgeUnit}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{simulator.results.cgeSub}</span>
                  </div>
                  {/* Specific gas yield */}
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Wind className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{simulator.results.yieldLabel}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-primary tabular-nums">{result.specificGasYield.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">{simulator.results.yieldUnit}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{simulator.results.yieldSub}</span>
                  </div>
                  {/* Engine power */}
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{simulator.results.powerLabel}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-primary tabular-nums">{result.enginePowerKw.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">{simulator.results.powerUnit}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{simulator.results.powerSub}</span>
                  </div>
                </div>

                {/* Tar prediction panel */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span>Tar prediction</span>
                  </h2>

                  {/* Yield + engine-safe row */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/40 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-1">Tar yield</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold tabular-nums text-foreground">{result.tar.tarYieldGPerNm3.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">g/Nm³</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{result.tar.tarYieldGPerKgFuel.toFixed(1)} g/kg fuel</p>
                    </div>
                    <div className={`rounded-xl p-3 flex flex-col justify-between ${result.tar.engineSafe ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
                      <p className="text-xs text-muted-foreground mb-1">Engine safety</p>
                      <div className="flex items-center gap-1.5">
                        {result.tar.engineSafe
                          ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true" />
                          : <XCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                        }
                        <span className={`text-sm font-semibold ${result.tar.engineSafe ? 'text-green-400' : 'text-amber-400'}`}>
                          {result.tar.engineSafe ? 'Engine safe' : 'Cleaning needed'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Threshold: 0.1 g/Nm³</p>
                    </div>
                  </div>

                  {/* Tar class badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-muted-foreground">Tar class:</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      result.tar.tarClass === 'low'       ? 'bg-green-500/20 text-green-400' :
                      result.tar.tarClass === 'medium'    ? 'bg-yellow-500/20 text-yellow-400' :
                      result.tar.tarClass === 'high'      ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-red-500/20 text-red-400'
                    }`}>
                      {result.tar.tarClass === 'low'      ? 'Low' :
                       result.tar.tarClass === 'medium'   ? 'Medium' :
                       result.tar.tarClass === 'high'     ? 'High' :
                                                            'Very High'}
                    </span>
                  </div>

                  {/* Dominant compounds */}
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1.5">Dominant tar compounds at this temperature:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tar.dominantTarCompounds.map((compound, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          {compound}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cleaning recommendation */}
                  <div className="bg-muted/40 rounded-xl p-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Cleaning recommendation</p>
                    <p>{result.tar.cleaningRequired}</p>
                  </div>
                </div>

                {/* Engine match panel — only when engine params were sent */}
                {result.engineMatch && (() => {
                  const em = result.engineMatch!;
                  const qualityColor =
                    em.matchQuality === 'excellent' ? 'text-green-400' :
                    em.matchQuality === 'good'      ? 'text-primary' :
                    em.matchQuality === 'marginal'  ? 'text-yellow-400' :
                                                      'text-red-400';
                  const qualityBg =
                    em.matchQuality === 'excellent' ? 'bg-green-500/10 border-green-500/30' :
                    em.matchQuality === 'good'      ? 'bg-primary/10 border-primary/30' :
                    em.matchQuality === 'marginal'  ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                      'bg-red-500/10 border-red-500/30';
                  return (
                    <div className="bg-card border border-border rounded-2xl p-5">
                      <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-primary" aria-hidden="true" />
                        <span>Engine matching — {em.displacementCc} cc @ {em.rpm} RPM</span>
                      </h2>

                      {/* Match quality badge */}
                      <div className={`rounded-xl border p-3 mb-4 ${qualityBg}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-bold capitalize ${qualityColor}`}>
                            {em.matchQuality === 'excellent' ? 'Excellent match' :
                             em.matchQuality === 'good'      ? 'Good match' :
                             em.matchQuality === 'marginal'  ? 'Marginal match' :
                                                               'Poor match'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{em.matchAssessment}</p>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Shaft power (syngas)</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold tabular-nums text-foreground">{em.shaftPowerKw.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">kW</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">vs {em.gasolinePowerKw.toFixed(1)} kW on gasoline</p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Derating</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold tabular-nums text-foreground">{em.deratingPct}</span>
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">power reduction vs gasoline</p>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Syngas demand</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold tabular-nums text-foreground">{em.syngasFlowNm3h.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">Nm³/h</span>
                          </div>
                        </div>
                        <div className="bg-muted/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground mb-1">Fuel feed rate</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold tabular-nums text-foreground">{em.fuelFeedRateKgH.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">kg/h</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">range: {em.recommendedFeedRangeKgH[0]}–{em.recommendedFeedRangeKgH[1]} kg/h</p>
                        </div>
                      </div>

                      {/* Derating bar */}
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Syngas power</span>
                          <span>Gasoline power</span>
                        </div>
                        <div className="bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(5, 100 - em.deratingPct)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(100 - em.deratingPct)}% of rated gasoline power retained on producer gas
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {result.warnings.map((w, i) => (
                      <div key={i} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex gap-2.5 text-sm text-amber-200">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" aria-hidden="true" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {result.notes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {result.notes.map((n, i) => (
                      <div key={i} className="bg-muted/50 border border-border rounded-xl p-3 flex gap-2.5 text-xs text-muted-foreground">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{n}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── Multi-fuel comparison ── */}
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span>{simulator.compare.heading}</span>
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{simulator.compare.subheading}</p>
              </div>
              <Button
                onClick={runCompare}
                disabled={compareLoading}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                {compareLoading ? simulator.compare.runningButton : simulator.compare.runButton}
              </Button>
            </div>

            {compareError && (
              <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex gap-2.5 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{compareError}</span>
              </div>
            )}

            {compareResult && (
              <div className="mt-5 flex flex-col gap-4">
                {/* Summary */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm">
                  <p className="font-medium text-primary mb-0.5">{simulator.compare.summaryHeading}</p>
                  <p className="text-muted-foreground">{compareResult.summary}</p>
                </div>

                {/* Comparison table — scrollable on mobile */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground w-6">{simulator.compare.rankLabel}</th>
                        <th className="text-left py-2 pr-3 text-xs font-medium text-muted-foreground">{simulator.compare.fuelLabel}</th>
                        <th className="text-right py-2 pr-3 text-xs font-medium text-muted-foreground">{simulator.compare.lhvLabel}</th>
                        <th className="text-right py-2 pr-3 text-xs font-medium text-muted-foreground">{simulator.compare.cgeLabel}</th>
                        <th className="text-right py-2 pr-3 text-xs font-medium text-muted-foreground">{simulator.compare.tarLabel}</th>
                        <th className="text-right py-2 pr-3 text-xs font-medium text-muted-foreground">{simulator.compare.powerLabel}</th>
                        <th className="text-center py-2 text-xs font-medium text-muted-foreground">{simulator.compare.engineSafeLabel}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareResult.rows.map((row) => (
                        <tr
                          key={row.fuelSpecies}
                          className={`border-b border-border/50 transition-colors ${row.rank === 1 ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                        >
                          <td className="py-2.5 pr-3">
                            {row.rank === 1
                              ? <Trophy className="w-4 h-4 text-primary" aria-label="Best" />
                              : <span className="text-xs text-muted-foreground tabular-nums">{row.rank}</span>
                            }
                          </td>
                          <td className="py-2.5 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{row.fuelLabel}</span>
                              {row.rank === 1 && (
                                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium">{simulator.compare.bestBadge}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums font-semibold">{row.lhv.toFixed(2)}</td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">{row.coldGasEfficiency.toFixed(0)}%</td>
                          <td className="py-2.5 pr-3 text-right">
                            <span className={`tabular-nums font-medium ${
                              row.tarClass === 'low'      ? 'text-green-400' :
                              row.tarClass === 'medium'   ? 'text-yellow-400' :
                              row.tarClass === 'high'     ? 'text-orange-400' :
                                                            'text-red-400'
                            }`}>{row.tarGPerNm3.toFixed(2)}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-right tabular-nums">{row.enginePowerKw.toFixed(1)}</td>
                          <td className="py-2.5 text-center">
                            {row.engineSafe
                              ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" aria-label="Engine safe" />
                              : <XCircle    className="w-4 h-4 text-muted-foreground mx-auto" aria-label="Cleaning needed" />
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">Ranked by composite score: LHV (50%) + cold gas efficiency (30%) + tar safety (20%). All fuels run at the same gasifier type, moisture, fuel size, and ER as your current inputs.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Methodology caveat ── */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <div className="bg-muted/40 border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{simulator.methodology.heading}</span>
            </h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <span>{simulator.methodology.body1.split(simulator.methodology.body1Bold)[0]}</span>
                <strong className="text-foreground">{simulator.methodology.body1Bold}</strong>
                <span>{simulator.methodology.body1.split(simulator.methodology.body1Bold)[1]}</span>
              </p>
              <p>
                <span>{simulator.methodology.body2} </span>
                <strong className="text-foreground">{simulator.methodology.body2Bold}</strong>
                <span> {simulator.methodology.body2Tail}</span>
              </p>
              <p>{simulator.methodology.body3}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
