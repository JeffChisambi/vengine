import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Droplets, ChevronRight, CheckCircle2, RotateCcw,
  AlertTriangle, Lightbulb, Calculator,
} from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell from "@/components/lab/ExperimentShell";
import ScaleSVG from "@/components/lab/ScaleSVG";
import BeakerSVG from "@/components/lab/BeakerSVG";
import {
  DensityBottleSVG,
  AnalyticalBalanceSVG,
  HydrometerSVG,
  LiquidColumnsSVG,
  RelativeDensityIntroSVG,
} from "@/components/relative-density/RelativeDensityVisuals";

/* ─── Experiment data ─────────────────────────────────────── */
const STEPS = [
  { id: 0, label: "Intro" },
  { id: 1, label: "Materials" },
  { id: 2, label: "Select Liquid" },
  { id: 3, label: "Weigh Bottle" },
  { id: 4, label: "Add Water" },
  { id: 5, label: "Add Liquid" },
  { id: 6, label: "Calculate RD" },
  { id: 7, label: "Hydrometer" },
  { id: 8, label: "Conclusion" },
];
const TOTAL_STEPS = STEPS.length;

const THEME = {
  iconBg:    "bg-cyan-500/10",
  iconColor: "text-cyan-600",
  done:      "bg-cyan-500",
  current:   "bg-cyan-500",
  label:     "text-cyan-600",
  dot:       "hsl(192,91%,36%)",
  button:    "bg-cyan-600 hover:bg-cyan-700 text-white border-0",
};

/* ─── Liquids ─────────────────────────────────────────────── */
const LIQUIDS = [
  {
    id: "kerosene",
    name: "Kerosene",
    rd: 0.800,
    color: "#fef3c7",
    border: "#f59e0b",
    accentText: "text-amber-700",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
    tag: "Petroleum distillate",
    fact: "Used in lamps and jet fuel. Floats on water because its RD < 1.",
  },
  {
    id: "cooking-oil",
    name: "Cooking Oil",
    rd: 0.910,
    color: "#fef9c3",
    border: "#eab308",
    accentText: "text-yellow-700",
    accentBg: "bg-yellow-500/10",
    accentBorder: "border-yellow-500/30",
    tag: "Vegetable triglycerides",
    fact: "A mixture of fatty acid esters. Slightly less dense than water, so it floats on water.",
  },
  {
    id: "salt-water",
    name: "Salt Water",
    rd: 1.025,
    color: "#dbeafe",
    border: "#3b82f6",
    accentText: "text-blue-700",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
    tag: "NaCl solution",
    fact: "Average sea water RD is about 1.025. Dissolved salt ions add mass without proportional volume increase.",
  },
  {
    id: "glycerine",
    name: "Glycerine",
    rd: 1.261,
    color: "#dcfce7",
    border: "#22c55e",
    accentText: "text-green-700",
    accentBg: "bg-green-500/10",
    accentBorder: "border-green-500/30",
    tag: "Polyol / Glycerol",
    fact: "A thick, sweet-tasting polyol. Its high density makes it sink below all other common lab liquids.",
  },
  {
    id: "ethanol",
    name: "Ethanol",
    rd: 0.789,
    color: "#f5f3ff",
    border: "#8b5cf6",
    accentText: "text-violet-700",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/30",
    tag: "Alcohol (C₂H₅OH)",
    fact: "The lightest liquid in this experiment. Its molecules pack less efficiently than water, giving it a lower density.",
  },
];

/* ─── Density bottle constants ────────────────────────────── */
const M_EMPTY  = 22.4;   // g — empty density bottle
const M_WATER  = 47.4;   // g — bottle + water
const WATER_MASS = M_WATER - M_EMPTY;   // 25.0 g

/* ─── Materials ───────────────────────────────────────────── */
const MATERIALS = [
  {
    id: "bottle",
    name: "Density Bottle (25 mL)",
    material: "Borosilicate glass",
    reason: "Also called a pyknometer. Its precisely known volume (25 mL) lets us weigh an exactly equal volume of any liquid for comparison. Borosilicate glass is chemically inert and doesn't absorb liquids.",
    tag: "Glassware",
    tagColor: "text-cyan-700 bg-cyan-500/10 border-cyan-500/20",
    Component: () => <DensityBottleSVG />,
  },
  {
    id: "balance",
    name: "Analytical Balance",
    material: "Precision load-cell, plastic/metal casing",
    reason: "Measures to 0.01 g accuracy. A wind shield prevents air currents from affecting readings — essential when differences between masses are small (< 5 g for some liquids).",
    tag: "Measuring",
    tagColor: "text-indigo-700 bg-indigo-500/10 border-indigo-500/20",
    Component: () => <AnalyticalBalanceSVG mass={22.4} bottleOn />,
  },
  {
    id: "liquids",
    name: "Test Liquids",
    material: "Various — see liquid selection",
    reason: "We need a range of liquids with RD both above and below 1.0 (water) to verify the formula works across the full range and to compare properties.",
    tag: "Reagents",
    tagColor: "text-emerald-700 bg-emerald-500/10 border-emerald-500/20",
    Component: () => <LiquidColumnsSVG />,
  },
  {
    id: "distilled",
    name: "Distilled Water",
    material: "H₂O — deionised",
    reason: "Used as the reference liquid. Its density is exactly 1.000 g/mL at 4°C (and ≈ 0.998 g/mL at room temperature). Using tap water would introduce error due to dissolved minerals.",
    tag: "Reference",
    tagColor: "text-blue-700 bg-blue-500/10 border-blue-500/20",
    Component: () => <BeakerSVG waterLevel={0.55} />,
  },
  {
    id: "pipette",
    name: "Dropper / Pipette",
    material: "Glass or plastic",
    reason: "Used to fill the density bottle to exactly the same volume each time by adding or removing liquid until it overflows through the stopper's capillary hole — ensuring a consistent 25 mL.",
    tag: "Glassware",
    tagColor: "text-teal-700 bg-teal-500/10 border-teal-500/20",
    Component: () => (
      <svg viewBox="0 0 180 300" className="w-full max-h-[260px]"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.09))" }}>
        <defs>
          <linearGradient id="pipGlass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f0f9ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Bulb */}
        <ellipse cx="90" cy="80" rx="38" ry="48" fill="#fee2e2" stroke="#fca5a5" strokeWidth="2" />
        {/* Stem */}
        <rect x="83" y="120" width="14" height="130" rx="5" fill="url(#pipGlass)" stroke="#94a3b8" strokeWidth="2" />
        <line x1="86" y1="130" x2="86" y2="245" stroke="#fff" strokeWidth="2" opacity="0.2" />
        {/* Tip */}
        <path d="M 83 250 L 87 270 L 93 270 L 97 250" fill="url(#pipGlass)" stroke="#94a3b8" strokeWidth="1.8" />
        {/* Liquid in stem */}
        <rect x="84.5" y="200" width="11" height="70" rx="3" fill="#bae6fd" opacity="0.7" />
        <text x="90" y="292" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="#475569" fontFamily="var(--font-heading)">Pipette / Dropper</text>
      </svg>
    ),
  },
  {
    id: "thermometer",
    name: "Thermometer",
    material: "Glass / digital probe",
    reason: "Temperature affects liquid density. Recording the temperature (aim for 20–25 °C) lets you apply a correction factor if needed and allows comparison with published RD tables.",
    tag: "Measuring",
    tagColor: "text-red-700 bg-red-500/10 border-red-500/20",
    Component: () => (
      <svg viewBox="0 0 140 320" className="w-full max-h-[280px]"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.09))" }}>
        {/* Bulb */}
        <circle cx="70" cy="262" r="22" fill="#fca5a5" stroke="#f87171" strokeWidth="2" />
        <circle cx="63" cy="256" r="7" fill="#fff" opacity="0.25" />
        {/* Stem */}
        <rect x="62" y="50" width="16" height="215" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <rect x="64.5" y="52" width="5" height="213" rx="3" fill="#fff" opacity="0.2" />
        {/* Mercury column */}
        <motion.rect x="66" y="120" width="8" height="142" rx="4" fill="#fca5a5"
          animate={{ height: [138, 145, 138] }} transition={{ duration: 3, repeat: Infinity }} />
        {/* Scale marks */}
        {[0.2, 0.4, 0.6, 0.8].map((f, i) => {
          const my = 50 + f * 210;
          return (
            <g key={i}>
              <line x1="78" y1={my} x2="88" y2={my} stroke="#64748b" strokeWidth="1" />
              <text x="92" y={my + 4} fontSize="9" fill="#64748b">{((1 - f) * 100).toFixed(0)}°C</text>
            </g>
          );
        })}
        <text x="70" y="303" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="#475569" fontFamily="var(--font-heading)">Thermometer</text>
      </svg>
    ),
  },
];

/* ─── Icon ────────────────────────────────────────────────── */
function RDIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 20 L4 8 Q4 4 8 4 L16 4 Q20 4 20 8 L20 20" />
      <line x1="4" y1="20" x2="20" y2="20" />
      <line x1="4" y1="14" x2="20" y2="14" strokeDasharray="2 2" />
      <line x1="4" y1="9"  x2="20" y2="9"  strokeDasharray="2 2" />
      <path d="M10 20 L10 14" strokeWidth="3" />
    </svg>
  );
}

/* ─── Weighing step sub-component ─────────────────────────── */
function WeighingStep({ phase, mass, label, bottleOn, liquidId, onRecord, recorded }) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-cyan-500/20 bg-gradient-to-br from-card to-cyan-500/5 p-4 flex items-center justify-center"
        style={{ minHeight: 260 }}>
        <div className="w-full max-w-[220px] mx-auto">
          <AnalyticalBalanceSVG mass={mass} bottleOn={bottleOn} liquidId={liquidId} />
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <motion.p className="text-2xl font-extrabold text-green-400"
          key={mass}
          initial={{ opacity: 0.4, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}>
          {bottleOn ? `${mass.toFixed(1)} g` : "0.00 g"}
        </motion.p>
      </div>
      <Button onClick={onRecord} disabled={recorded}
        className={`w-full gap-2 border-0 ${recorded ? "bg-green-600 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"}`}>
        {recorded ? <><CheckCircle2 className="w-4 h-4" /> Recorded ✓</> : "Record This Reading"}
      </Button>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function RelativeDensityExperiment() {
  const [materialIdx, setMaterialIdx]   = useState(0);
  const [selectedLiq, setSelectedLiq]   = useState(null);
  const [m1Recorded, setM1Recorded]     = useState(false);
  const [m2Recorded, setM2Recorded]     = useState(false);
  const [m3Recorded, setM3Recorded]     = useState(false);
  const [formulaStage, setFormulaStage] = useState(0);
  const [revealedQs, setRevealedQs]     = useState([]);
  const [showHydro, setShowHydro]       = useState(false);

  const resetAll = useCallback(() => {
    setMaterialIdx(0);
    setSelectedLiq(null);
    setM1Recorded(false); setM2Recorded(false); setM3Recorded(false);
    setFormulaStage(0);   setRevealedQs([]);    setShowHydro(false);
  }, []);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(TOTAL_STEPS, resetAll);

  const liq = LIQUIDS.find(l => l.id === selectedLiq);
  const m3  = liq ? +(M_EMPTY + liq.rd * WATER_MASS).toFixed(1) : 0;
  const calcRD = liq ? +((m3 - M_EMPTY) / WATER_MASS).toFixed(3) : 0;

  const canAdvance = (() => {
    if (step === 2) return !!selectedLiq;
    if (step === 3) return m1Recorded;
    if (step === 4) return m2Recorded;
    if (step === 5) return m3Recorded;
    if (step === 6) return formulaStage >= 3;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  return (
    <ExperimentShell
      title="Relative Density of Liquids"
      subject="Physics · Fluid Statics"
      icon={RDIcon}
      theme={THEME}
      stages={STEPS}
      step={step}
      dir={dir}
      onGoTo={goTo}
      onNext={next}
      onBack={back}
      onReset={reset}
      canAdvance={canAdvance}
      maxWidth="max-w-5xl"
      progressVariant="middle"
    >
      <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

        {/* ══ STEP 0: INTRO ══════════════════════════════════════════ */}
        {step === 0 && (
          <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.55 }}>
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <RDIcon className="w-10 h-10 text-cyan-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-semibold mb-3">
                Physics · Fluid Statics
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                Relative Density of Liquids
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                <strong className="text-foreground">Relative density</strong> (also called specific gravity)
                compares the density of a liquid to the density of water at the same temperature.
                Because it is a ratio, it has <em>no unit</em>. A value above 1.0 means the liquid is
                denser than water; below 1.0 means it is lighter. You will measure it precisely
                using a <strong className="text-foreground">density bottle</strong>.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-6 items-center w-full justify-center">
              <div className="w-full max-w-[200px]" style={{ height: 260 }}>
                <RelativeDensityIntroSVG />
              </div>
              <div className="space-y-3 text-left max-w-xs">
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                  <p className="text-3xl font-extrabold font-heading text-cyan-600 mb-1">RD = ρ<sub>liquid</sub> / ρ<sub>water</sub></p>
                  <p className="text-xs text-muted-foreground">dimensionless — no unit</p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                  <p className="text-xs font-bold text-foreground mb-1.5">Using a density bottle:</p>
                  <p className="text-sm font-mono text-cyan-700 font-bold text-center">
                    RD = (m₃ − m₁) / (m₂ − m₁)
                  </p>
                  <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                    <p>m₁ = mass of empty bottle</p>
                    <p>m₂ = mass of bottle + water</p>
                    <p>m₃ = mass of bottle + liquid</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
              {[
                { label: "Reference liquid", value: "Water",    sub: "ρ = 1.000 g/mL at 4°C" },
                { label: "Method",           value: "Pyknometer", sub: "density bottle, 25 mL" },
                { label: "Precision",        value: "±0.002",  sub: "with analytical balance" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <p className="text-base font-extrabold font-heading text-cyan-600">{s.value}</p>
                  <p className="text-[11px] font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Press <strong>Next</strong> to meet your equipment.</p>
          </div>
        )}

        {/* ══ STEP 1: MATERIALS ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex flex-col gap-5 w-full">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-2">
                Step 1 — Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Meet Your Equipment</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
                Select each item to learn what it is made of and why it was chosen for this experiment.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {MATERIALS.map((m, i) => (
                <button key={m.id} onClick={() => setMaterialIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    materialIdx === i
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-cyan-300"
                  }`}>
                  {m.name.split(" ")[0]}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={materialIdx}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="rounded-3xl border-2 border-cyan-500/20 bg-gradient-to-br from-card to-cyan-500/5 p-6 flex items-center justify-center"
                  style={{ minHeight: 260 }}>
                  <div className="w-full max-w-[160px] mx-auto">
                    {React.createElement(MATERIALS[materialIdx].Component)}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mb-2 ${MATERIALS[materialIdx].tagColor}`}>
                      {MATERIALS[materialIdx].tag}
                    </span>
                    <h3 className="text-xl font-extrabold font-heading">{MATERIALS[materialIdx].name}</h3>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-0.5 shrink-0">Material</span>
                    <span className="text-sm text-foreground font-semibold">{MATERIALS[materialIdx].material}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                    <p className="text-xs font-bold text-cyan-700 mb-1.5">Why this item?</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{MATERIALS[materialIdx].reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setMaterialIdx(i => Math.max(0, i - 1))}
                      disabled={materialIdx === 0}
                      className="px-3 py-2 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">
                      ← Prev
                    </button>
                    <span className="text-xs text-muted-foreground flex-1 text-center">{materialIdx + 1} / {MATERIALS.length}</span>
                    <button onClick={() => setMaterialIdx(i => Math.min(MATERIALS.length - 1, i + 1))}
                      disabled={materialIdx === MATERIALS.length - 1}
                      className="px-3 py-2 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">
                      Next →
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ══ STEP 2: SELECT LIQUID ══════════════════════════════════ */}
        {step === 2 && (
          <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-2">
                Step 2 — Choose a Liquid
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Select Your Test Liquid</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pick one liquid to investigate. You'll measure its relative density using the density bottle method.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LIQUIDS.map(l => (
                <motion.button key={l.id} onClick={() => setSelectedLiq(l.id)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedLiq === l.id
                      ? `${l.accentBg} ${l.accentBorder} shadow-md`
                      : "border-border bg-card hover:border-cyan-300"
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-extrabold font-heading ${selectedLiq === l.id ? l.accentText : "text-foreground"}`}>
                      {l.name}
                    </span>
                    {selectedLiq === l.id && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white`}
                        style={{ background: l.border }}>
                        ✓
                      </motion.span>
                    )}
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border mb-2 ${l.accentBg} ${l.accentText} ${l.accentBorder}`}>
                    {l.tag}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{l.fact}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: l.border }} />
                    <span className="text-xs text-muted-foreground">Expected RD: <strong className={l.accentText}>—</strong></span>
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedLiq && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/25 text-center">
                <p className="text-sm font-bold text-cyan-700">
                  ✓ Selected: <span style={{ color: liq.border }}>{liq.name}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fill the density bottle with {liq.name.toLowerCase()} and begin weighing.
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ══ STEP 3: WEIGH EMPTY BOTTLE ═════════════════════════════ */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <WeighingStep
              phase={3} mass={M_EMPTY} label="Mass of empty density bottle (m₁)"
              bottleOn liquidId={null}
              onRecord={() => setM1Recorded(true)} recorded={m1Recorded} />
            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700">
                Step 3 — First Weighing
              </span>
              <h2 className="text-2xl font-extrabold font-heading">Weigh the Empty Bottle</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before adding any liquid, place the clean, <strong className="text-foreground">dry density bottle</strong> (with
                its stopper) on the analytical balance. Close the wind-shield door and wait for the reading to stabilise.
              </p>
              <div className="p-3 rounded-xl bg-slate-800 font-mono text-center border border-slate-600">
                <p className="text-xs text-slate-400 mb-1">m₁ (empty bottle)</p>
                <p className="text-2xl font-extrabold text-green-400">{M_EMPTY.toFixed(1)} g</p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  "Zero (tare) the balance before placing the bottle.",
                  "Ensure the bottle and stopper are completely dry.",
                  "Close the wind-shield to prevent air-current errors.",
                  "Record to the nearest 0.1 g.",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-xs text-muted-foreground">{t}</p>
                  </div>
                ))}
              </div>
              {m1Recorded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                  <p className="text-sm font-bold text-green-700">✓ m₁ = {M_EMPTY.toFixed(1)} g — recorded!</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 4: WEIGH BOTTLE + WATER ═══════════════════════════ */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <WeighingStep
              phase={4} mass={M_WATER} label="Mass of bottle + distilled water (m₂)"
              bottleOn liquidId="water"
              onRecord={() => setM2Recorded(true)} recorded={m2Recorded} />
            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700">
                Step 4 — Fill with Water
              </span>
              <h2 className="text-2xl font-extrabold font-heading">Fill with Distilled Water</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fill the density bottle completely with <strong className="text-foreground">distilled water</strong>.
                Insert the stopper slowly — excess water will be expelled through the capillary hole,
                ensuring exactly 25 mL is inside. Dry the outside with tissue, then weigh.
              </p>
              <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                <p className="text-xs font-bold text-blue-700">Derived values from this weighing:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2 border border-blue-100 text-center">
                    <p className="text-[9px] text-muted-foreground">m₂</p>
                    <p className="text-sm font-extrabold font-heading text-blue-600">{M_WATER.toFixed(1)} g</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 border border-blue-100 text-center">
                    <p className="text-[9px] text-muted-foreground">mass of water (m₂−m₁)</p>
                    <p className="text-sm font-extrabold font-heading text-blue-600">{WATER_MASS.toFixed(1)} g</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  This water mass (= {WATER_MASS.toFixed(1)} g) is the <strong className="text-foreground">denominator</strong> in our RD formula — the
                  reference mass for exactly 25 mL.
                </p>
              </div>
              {m2Recorded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                  <p className="text-sm font-bold text-green-700">✓ m₂ = {M_WATER.toFixed(1)} g — recorded!</p>
                </motion.div>
              )}
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">Use <em>distilled</em> water only. Tap water contains dissolved minerals that increase its density above 1.000 g/mL, which would introduce a systematic error into all subsequent RD values.</p>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 5: WEIGH BOTTLE + LIQUID ══════════════════════════ */}
        {step === 5 && liq && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <WeighingStep
              phase={5} mass={m3} label={`Mass of bottle + ${liq.name} (m₃)`}
              bottleOn liquidId={liq.id}
              onRecord={() => setM3Recorded(true)} recorded={m3Recorded} />
            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: liq.color, color: liq.border, border: `1px solid ${liq.border}55` }}>
                Step 5 — Fill with {liq.name}
              </span>
              <h2 className="text-2xl font-extrabold font-heading">Fill with {liq.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rinse the bottle twice with a few drops of <strong className="text-foreground">{liq.name.toLowerCase()}</strong> (discard the rinse).
                Fill completely, insert stopper to expel excess, wipe dry, and weigh.
              </p>
              <div className="p-3 rounded-2xl border space-y-2" style={{ background: liq.color + "55", borderColor: liq.border + "44" }}>
                <p className="text-xs font-bold" style={{ color: liq.border }}>Live readings so far:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "m₁ (empty)", value: `${M_EMPTY.toFixed(1)} g`, ok: true },
                    { label: "m₂ (+water)", value: `${M_WATER.toFixed(1)} g`, ok: true },
                    { label: `m₃ (+${liq.name.split(" ")[0]})`, value: m3Recorded ? `${m3.toFixed(1)} g` : "—", ok: m3Recorded },
                  ].map(({ label, value, ok }) => (
                    <div key={label} className="bg-white rounded-lg p-2 border border-white text-center">
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                      <p className={`text-sm font-extrabold font-heading ${ok ? "text-foreground" : "text-muted-foreground"}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              {m3Recorded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                  <p className="text-sm font-bold text-green-700">✓ m₃ = {m3.toFixed(1)} g — all three masses recorded!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Ready to apply the formula →</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 6: CALCULATE ══════════════════════════════════════ */}
        {step === 6 && liq && (
          <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-2">
                Step 6 — Calculation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Calculate the Relative Density</h2>
              <p className="text-sm text-muted-foreground mt-1">Follow each substitution step to work out the answer.</p>
            </div>

            {/* Recorded data table */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recorded data
              </div>
              <div className="divide-y divide-border">
                {[
                  { sym: "m₁", desc: "Empty density bottle",            val: `${M_EMPTY.toFixed(1)} g` },
                  { sym: "m₂", desc: "Bottle + distilled water",        val: `${M_WATER.toFixed(1)} g` },
                  { sym: "m₃", desc: `Bottle + ${liq.name}`,            val: `${m3.toFixed(1)} g`      },
                ].map(row => (
                  <div key={row.sym} className="flex items-center px-4 py-2.5 gap-3">
                    <span className="font-mono text-sm font-bold text-cyan-700 w-8">{row.sym}</span>
                    <span className="text-sm text-muted-foreground flex-1">{row.desc}</span>
                    <span className="font-mono text-sm font-bold text-foreground">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-step derivation */}
            <div className="space-y-3">
              {[
                {
                  label: "Step 1 — Write the formula",
                  content: <p className="font-mono text-sm text-center text-cyan-700 font-bold py-1">RD = (m₃ − m₁) / (m₂ − m₁)</p>,
                },
                {
                  label: "Step 2 — Substitute your values",
                  content: <p className="font-mono text-sm text-center text-foreground font-bold py-1">
                    RD = ({m3.toFixed(1)} − {M_EMPTY.toFixed(1)}) / ({M_WATER.toFixed(1)} − {M_EMPTY.toFixed(1)})
                  </p>,
                },
                {
                  label: "Step 3 — Evaluate the brackets",
                  content: <p className="font-mono text-sm text-center text-foreground font-bold py-1">
                    RD = {(m3 - M_EMPTY).toFixed(1)} / {WATER_MASS.toFixed(1)}
                  </p>,
                },
                {
                  label: "Step 4 — Final result",
                  content: (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-2">
                      <p className="text-4xl font-extrabold font-heading text-cyan-600">RD = {calcRD.toFixed(3)}</p>
                      <p className="text-xs text-muted-foreground mt-1">(no unit — it is a ratio)</p>
                      <p className="text-sm font-semibold mt-2" style={{ color: liq.border }}>
                        {calcRD < 1
                          ? `${liq.name} is lighter than water ✓`
                          : `${liq.name} is heavier than water ✓`}
                      </p>
                    </motion.div>
                  ),
                },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    formulaStage > i ? "border-green-400/40 bg-green-500/5"
                      : formulaStage === i ? "border-cyan-400 bg-cyan-500/5"
                      : "border-border bg-card opacity-50"
                  }`}>
                  <button
                    onClick={() => formulaStage === i && setFormulaStage(s => s + 1)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      formulaStage > i ? "bg-green-500 text-white"
                        : formulaStage === i ? "bg-cyan-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {formulaStage > i ? "✓" : i + 1}
                    </span>
                    <span className={`text-sm font-semibold ${formulaStage >= i ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                    {formulaStage === i && (
                      <span className="ml-auto text-xs text-cyan-600 font-semibold">tap to reveal →</span>
                    )}
                  </button>
                  <AnimatePresence>
                    {formulaStage > i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="px-4 pb-3 border-t border-border/40">
                        {item.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {formulaStage >= 4 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                <p className="text-xs text-muted-foreground mb-1">Accuracy check</p>
                <p className="text-sm font-semibold text-foreground">
                  Expected RD for {liq.name}: <span className="font-extrabold text-cyan-700">{liq.rd.toFixed(3)}</span>
                  &nbsp;|&nbsp;Your result: <span className="font-extrabold text-green-600">{calcRD.toFixed(3)}</span>
                  &nbsp;|&nbsp;Error: <span className="font-extrabold text-amber-600">{(Math.abs(calcRD - liq.rd) * 100).toFixed(1)}%</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  (In a real experiment small errors come from temperature variation and incomplete drying)
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ══ STEP 7: HYDROMETER ═════════════════════════════════════ */}
        {step === 7 && liq && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-cyan-500/20 bg-gradient-to-br from-card to-cyan-500/5 p-4 flex items-center justify-center"
              style={{ minHeight: 320 }}>
              <div className="w-full max-w-[260px] mx-auto">
                <HydrometerSVG liquid={liq.id} rd={liq.rd} />
              </div>
            </motion.div>

            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700">
                Step 7 — Verification
              </span>
              <h2 className="text-2xl font-extrabold font-heading">Verify with a Hydrometer</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A hydrometer is a floating instrument that reads RD directly. It sinks deeper in
                <strong className="text-foreground"> less dense</strong> liquids and floats higher in
                <strong className="text-foreground"> denser</strong> ones.
                The scale is read at the <span className="text-red-600 font-semibold">red dashed line</span> — the liquid surface.
              </p>

              <div className="p-4 rounded-2xl border-2 space-y-3"
                style={{ background: liq.color + "55", borderColor: liq.border + "55" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: liq.border }}>
                  Hydrometer reading in {liq.name}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 text-center border border-white">
                    <p className="text-[9px] text-muted-foreground">Hydrometer reads</p>
                    <p className="text-2xl font-extrabold font-heading" style={{ color: liq.border }}>{liq.rd.toFixed(3)}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-white">
                    <p className="text-[9px] text-muted-foreground">Density bottle gave</p>
                    <p className="text-2xl font-extrabold font-heading text-cyan-600">{calcRD.toFixed(3)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Both methods agree. The hydrometer is quicker but less accurate (reads to ±0.01 vs ±0.002 for the density bottle).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
                <p className="text-xs font-bold text-foreground">Principle (Archimedes):</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The hydrometer floats because the upthrust equals its weight.
                  Upthrust = ρ<sub>liquid</sub> × V<sub>submerged</sub> × g = m<sub>hydro</sub> × g.
                  So V<sub>sub</sub> ∝ 1/ρ — denser liquid → less volume submerged → floats higher.
                </p>
              </div>

              {/* Compare all liquids */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">All liquids compared</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <LiquidColumnsSVG selectedId={liq.id} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 8: CONCLUSION ═════════════════════════════════════ */}
        {step === 8 && liq && (
          <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-xs font-semibold mb-3 border border-cyan-500/20">
                🏁 Conclusion
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">What Did We Find?</h2>
            </motion.div>

            {/* Results summary */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calculator className="w-3.5 h-3.5" /> Experimental Results
              </div>
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr className="text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left font-semibold">Liquid</th>
                    <th className="px-4 py-2 text-center font-semibold">m₃ (g)</th>
                    <th className="px-4 py-2 text-center font-semibold">RD measured</th>
                    <th className="px-4 py-2 text-center font-semibold">Expected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-card">
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">Water (ref.)</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs">{M_WATER.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold text-blue-600">1.000</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs text-muted-foreground">1.000</td>
                  </tr>
                  <tr className="bg-card/50" style={{ background: liq.color + "33" }}>
                    <td className="px-4 py-2.5 text-xs font-semibold" style={{ color: liq.border }}>{liq.name}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs">{m3.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-center font-mono font-bold text-cyan-600">{calcRD.toFixed(3)}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-xs text-muted-foreground">{liq.rd.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Key findings */}
            <div className="space-y-2.5">
              {[
                {
                  title: "Relative density is a ratio — no unit",
                  desc: `RD = ρ_liquid / ρ_water. You measured ${liq.name}'s RD as ${calcRD.toFixed(3)}, meaning it is ${(calcRD * 100).toFixed(1)}% as dense as water.`,
                  col: "text-cyan-700", bg: "bg-cyan-500/8", b: "border-cyan-500/20",
                },
                {
                  title: `${liq.name} ${calcRD < 1 ? "floats on" : "sinks below"} water`,
                  desc: `Because RD ${calcRD < 1 ? "< 1, the liquid is less dense and will form a layer above water" : "> 1, the liquid is denser and will sink beneath water"} when both are placed in the same container.`,
                  col: calcRD < 1 ? "text-amber-700" : "text-blue-700",
                  bg: calcRD < 1 ? "bg-amber-500/8" : "bg-blue-500/8",
                  b:  calcRD < 1 ? "border-amber-500/20" : "border-blue-500/20",
                },
                {
                  title: "The density bottle method is highly precise",
                  desc: `Using an analytical balance (±0.01 g) on a 25 mL sample gives RD accurate to ±0.002. The hydrometer is faster but reads only to ±0.01.`,
                  col: "text-green-700", bg: "bg-green-500/8", b: "border-green-500/20",
                },
                {
                  title: "Temperature matters — specify your temperature",
                  desc: "Water's density peaks at 4°C (1.000 g/mL) and decreases above and below. Always record the temperature and compare to published tables at that temperature.",
                  col: "text-red-700", bg: "bg-red-500/8", b: "border-red-500/20",
                },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className={`flex gap-3 p-3 rounded-xl border ${f.b} ${f.bg}`}>
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${f.col}`} />
                  <div>
                    <p className={`text-sm font-semibold font-heading ${f.col} mb-0.5`}>{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Deeper questions */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Deeper Questions</p>
              <div className="space-y-2">
                {[
                  {
                    q: "Why can ships made of steel (RD ≈ 7.8) float on water?",
                    a: "A ship's hull is a large, hollow structure. The average density of the steel-plus-enclosed-air system is much less than 1.0. By Archimedes' principle, an object floats if its average density ≤ that of the fluid. The hull displaces a volume of water whose weight equals the ship's total weight.",
                    c: "text-cyan-700", bg: "bg-cyan-500/5", b: "border-cyan-500/20",
                  },
                  {
                    q: "Why is it easier to float in the Dead Sea (RD ≈ 1.24) than in fresh water?",
                    a: "The higher density of the saltier water means greater upthrust for the same submerged volume. Your body (average RD ≈ 0.97) displaces enough Dead Sea water at a much shallower submersion depth, so you ride noticeably higher.",
                    c: "text-blue-700", bg: "bg-blue-500/5", b: "border-blue-500/20",
                  },
                  {
                    q: "How do brewers and winemakers use relative density?",
                    a: "A hydrometer is used before and after fermentation. Initial sugar-rich wort has RD ≈ 1.06. As yeast converts sugar to alcohol (RD 0.79), the liquid becomes less dense. The difference in readings allows calculation of original gravity and alcohol by volume (ABV).",
                    c: "text-green-700", bg: "bg-green-500/5", b: "border-green-500/20",
                  },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className={`rounded-xl border overflow-hidden ${item.b}`}>
                    <button onClick={() => toggleQ(i)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 ${item.bg}`}>
                      <span className={`text-sm font-semibold ${item.c}`}>{item.q}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${item.c} transition-transform ${revealedQs.includes(i) ? "rotate-90" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {revealedQs.includes(i) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <p className="px-4 py-3 text-xs text-muted-foreground leading-relaxed border-t border-border/40">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-world applications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "⚓", title: "Ship design",     desc: "Naval architects calculate the loaded ship's average RD to ensure it stays well below its Plimsoll line." },
                { icon: "🍺", title: "Brewing",         desc: "Hydrometers measure fermentation progress by tracking the drop in wort density as sugar converts to alcohol." },
                { icon: "🔬", title: "Clinical urine analysis", desc: "Urine RD (1.003–1.030) indicates hydration status and kidney function in medical diagnostics." },
                { icon: "🛢️", title: "Petroleum grading", desc: "Crude oil and refined products are graded by API gravity (derived from RD) to determine market price." },
              ].map((app, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.07 }}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card">
                  <span className="text-2xl leading-none mt-0.5">{app.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{app.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{app.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
