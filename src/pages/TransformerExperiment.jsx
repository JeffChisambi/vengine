import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap, Play, CheckCircle2, ChevronRight, AlertTriangle,
} from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell from "@/components/lab/ExperimentShell";
import TransformerSVG from "@/components/lab/electrical/TransformerSVG";
import VoltmeterSVG from "@/components/lab/electrical/VoltmeterSVG";
import AmmeterSVG from "@/components/lab/electrical/AmmeterSVG";
import LampSVG from "@/components/lab/electrical/LampSVG";
import WiresSVG from "@/components/lab/electrical/WiresSVG";
import {
  TransformerIntroSVG,
  TransformerCircuitSVG,
  FluxDiagramSVG,
} from "@/components/transformer/TransformerCircuitSVG";

/* ─── Stage definitions ───────────────────────────────────── */
const STEPS = [
  { id: 0, label: "Intro"       },
  { id: 1, label: "Materials"   },
  { id: 2, label: "Setup"       },
  { id: 3, label: "Step-Down"   },
  { id: 4, label: "Step-Up"     },
  { id: 5, label: "Turns Ratio" },
  { id: 6, label: "Power"       },
  { id: 7, label: "Conclusion"  },
];
const TOTAL_STEPS = STEPS.length;

const THEME = {
  iconBg:    "bg-indigo-500/10",
  iconColor: "text-indigo-600",
  done:      "bg-indigo-500",
  current:   "bg-indigo-500",
  label:     "text-indigo-600",
  dot:       "hsl(239,84%,67%)",
  button:    "bg-indigo-600 hover:bg-indigo-700 text-white border-0",
};

const VP = 240;   // fixed primary voltage (V)
const RL = 480;   // secondary load resistance (Ω) — gives Is ≈ 0.5A at 240V

/* ─── Materials ───────────────────────────────────────────── */
const MATERIALS = [
  {
    id: "transformer",
    name: "Iron-Core Transformer",
    material: "Laminated silicon steel core, copper windings",
    reason: "The E-I laminated iron core concentrates magnetic flux between the two coils with minimal loss. Silicon steel has high magnetic permeability. Laminations reduce eddy-current losses.",
    tag: "Core component",
    tagColor: "text-indigo-700 bg-indigo-500/10 border-indigo-500/20",
    Component: () => <TransformerSVG type="step-down" glow />,
  },
  {
    id: "voltmeter1",
    name: "Voltmeter × 2",
    material: "Plastic case, coil-and-magnet movement",
    reason: "One voltmeter is connected across the primary coil to read Vp, another across the secondary to read Vs. Connecting in parallel means negligible current is drawn from the circuit.",
    tag: "Measuring",
    tagColor: "text-green-700 bg-green-500/10 border-green-500/20",
    Component: () => <VoltmeterSVG voltage={5.0} measuring />,
  },
  {
    id: "ammeter",
    name: "Ammeter",
    material: "Plastic case, shunt resistor",
    reason: "Measures the primary current Ip. Connected in series on the primary side. Knowing Ip alongside Vp lets us verify the power equation Pp = Vp × Ip.",
    tag: "Measuring",
    tagColor: "text-red-700 bg-red-500/10 border-red-500/20",
    Component: () => <AmmeterSVG current={0.5} measuring />,
  },
  {
    id: "lamp",
    name: "Lamp (Bulb) — Load",
    material: "Tungsten filament, glass envelope",
    reason: "Acts as the load on the secondary side. Its brightness gives an instant visual indicator of secondary voltage — brighter means more power delivered. A lamp also limits current safely.",
    tag: "Load / Indicator",
    tagColor: "text-amber-700 bg-amber-500/10 border-amber-500/20",
    Component: () => <LampSVG on glow />,
  },
  {
    id: "acsupply",
    name: "AC Power Supply (240 V)",
    material: "Mains voltage, 50 Hz sinusoidal",
    reason: "Transformers only work with alternating current. A DC source produces a constant (non-changing) magnetic flux — which generates zero induced EMF in the secondary (Faraday's law: e = −N dΦ/dt). AC keeps flux constantly changing.",
    tag: "Power source",
    tagColor: "text-violet-700 bg-violet-500/10 border-violet-500/20",
    Component: () => (
      <svg viewBox="0 0 180 300" className="w-full max-h-[260px]"
        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.09))" }}>
        <rect x="20" y="60" width="140" height="160" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <rect x="30" y="70" width="120" height="60" rx="6" fill="#0f172a" />
        {/* AC sine display */}
        <motion.path d="M 36 100 Q 55 78 75 100 Q 95 122 115 100 Q 135 78 144 100"
          fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"
          animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1, repeat: Infinity }} />
        <text x="90" y="145" textAnchor="middle" fontSize="12" fill="#4ade80" fontWeight="700" fontFamily="monospace">240 V / 50 Hz</text>
        <text x="90" y="158" textAnchor="middle" fontSize="9" fill="#64748b">AC OUTPUT</text>
        {/* Sockets */}
        <circle cx="65"  cy="190" r="12" fill="#334155" stroke="#475569" strokeWidth="1.5" />
        <circle cx="115" cy="190" r="12" fill="#334155" stroke="#475569" strokeWidth="1.5" />
        <rect x="61"  cy="186" width="8" height="8" rx="2" fill="#1e293b" />
        <rect x="111" cy="186" width="8" height="8" rx="2" fill="#1e293b" />
        <text x="65"  y="194" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="700">L</text>
        <text x="115" y="194" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="700">N</text>
        {/* On/off knob */}
        <circle cx="90" cy="222" r="10" fill="#22c55e" />
        <text x="90" y="293" textAnchor="middle" fontSize="11" fontWeight="600"
          fill="#475569" fontFamily="var(--font-heading)">AC Power Supply</text>
      </svg>
    ),
  },
  {
    id: "wires",
    name: "Connecting Wires",
    material: "Copper core, PVC insulation",
    reason: "Colour-coded wires (red = live primary, black = neutral primary, green/yellow = secondary) prevent wiring mistakes. Copper's very low resistance ensures negligible voltage drop.",
    tag: "Conductor",
    tagColor: "text-blue-700 bg-blue-500/10 border-blue-500/20",
    Component: () => <WiresSVG />,
  },
];

/* ─── Turns ratio presets ─────────────────────────────────── */
const RATIO_PRESETS = [
  { label: "4:1 (step-down)", np: 400, ns: 100 },
  { label: "2:1 (step-down)", np: 200, ns: 100 },
  { label: "1:1 (isolating)",  np: 100, ns: 100 },
  { label: "1:2 (step-up)",    np: 100, ns: 200 },
  { label: "1:4 (step-up)",    np: 100, ns: 400 },
];

/* ─── Icon ────────────────────────────────────────────────── */
function TfIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="8" height="12" rx="1" />
      <rect x="14" y="6" width="8" height="12" rx="1" />
      <path d="M10 8 L14 8 M10 12 L14 12 M10 16 L14 16" />
      <path d="M4 9 Q6 9 6 12 Q6 15 4 15" strokeWidth="1.5" />
      <path d="M20 9 Q18 9 18 12 Q18 15 20 15" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Meter card ──────────────────────────────────────────── */
function MeterCard({ label, value, unit, color, sub }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-border text-center">
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <motion.p className={`text-lg font-extrabold font-heading ${color}`}
        key={value}
        initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}>
        {value}<span className="text-xs font-normal ml-0.5">{unit}</span>
      </motion.p>
      {sub && <p className="text-[9px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function TransformerExperiment() {
  const [materialIdx, setMaterialIdx]       = useState(0);
  const [setupPhase, setSetupPhase]         = useState(0);
  const [stepDownRun, setStepDownRun]       = useState(false);
  const [stepUpRun, setStepUpRun]           = useState(false);
  const [np, setNp]                         = useState(200);
  const [ns, setNs]                         = useState(100);
  const [ratioApplied, setRatioApplied]     = useState(false);
  const [powerVerified, setPowerVerified]   = useState(false);
  const [revealedQs, setRevealedQs]         = useState([]);

  const resetAll = useCallback(() => {
    setMaterialIdx(0); setSetupPhase(0);
    setStepDownRun(false); setStepUpRun(false);
    setNp(200); setNs(100); setRatioApplied(false);
    setPowerVerified(false); setRevealedQs([]);
  }, []);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(TOTAL_STEPS, resetAll);

  /* Live calculations */
  const vs_sd = VP * (4 / 8);       // step-down:  8:4 → 120V
  const vs_su = VP * (8 / 4);       // step-up:    4:8 → 480V
  const vs_ratio = VP * (ns / np);
  const is_ratio = vs_ratio / RL;
  const ip_ratio = (vs_ratio * is_ratio) / VP;
  const pp_ratio = (VP * ip_ratio).toFixed(1);
  const ps_ratio = (vs_ratio * is_ratio).toFixed(1);

  const canAdvance = (() => {
    if (step === 2) return setupPhase >= 4;
    if (step === 3) return stepDownRun;
    if (step === 4) return stepUpRun;
    if (step === 5) return ratioApplied;
    if (step === 6) return powerVerified;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  return (
    <ExperimentShell
      title="Simple Transformer"
      subject="Physics · Electromagnetism"
      icon={TfIcon}
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
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <TfIcon className="w-10 h-10 text-indigo-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-xs font-semibold mb-3">
                Physics · Electromagnetism
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                Simple Transformer
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                A transformer uses <strong className="text-foreground">electromagnetic induction</strong> to change
                AC voltage. It cannot work with DC — it relies on a <em>changing</em> magnetic flux to induce
                an EMF in the secondary coil (Faraday's law). You will explore step-down and step-up
                configurations and verify the turns-ratio equation.
              </p>
            </motion.div>

            <div className="w-full max-w-sm mx-auto" style={{ height: 210 }}>
              <TransformerIntroSVG />
            </div>

            <div className="w-full p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Key Equation</p>
              <p className="text-center text-xl font-extrabold font-heading text-indigo-600 mb-1">
                Vs / Vp = Ns / Np = Ip / Is
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Turns ratio = voltage ratio = inverse of current ratio (ideal transformer)
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
              {[
                { label: "Works with",    value: "AC only",   sub: "DC gives no induction" },
                { label: "Core material", value: "Silicon steel", sub: "high permeability" },
                { label: "Frequency",     value: "50 Hz",     sub: "mains supply" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <p className="text-sm font-extrabold font-heading text-indigo-600">{s.value}</p>
                  <p className="text-[11px] font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="w-full">
              <FluxDiagramSVG active />
            </div>

            <p className="text-xs text-muted-foreground">Press <strong>Next</strong> to meet your equipment.</p>
          </div>
        )}

        {/* ══ STEP 1: MATERIALS ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex flex-col gap-5 w-full">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 mb-2">
                Step 1 — Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Meet Your Equipment</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
                Select each component to learn what it is made of and why it was chosen.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {MATERIALS.map((m, i) => (
                <button key={m.id} onClick={() => setMaterialIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    materialIdx === i
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-indigo-300"
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
                <div className="rounded-3xl border-2 border-indigo-500/20 bg-gradient-to-br from-card to-indigo-500/5 p-6 flex items-center justify-center"
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
                  <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                    <p className="text-xs font-bold text-indigo-700 mb-1.5">Why this component?</p>
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

        {/* ══ STEP 2: SETUP ══════════════════════════════════════════ */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-indigo-500/20 bg-gradient-to-br from-card to-indigo-500/5 p-4"
              style={{ minHeight: 280 }}>
              <TransformerCircuitSVG
                np={setupPhase >= 1 ? 8 : 1}
                ns={setupPhase >= 2 ? 4 : 1}
                vp={240} running={false} showReadings={false} />
            </motion.div>

            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700">
                Step 2 — Assembly
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Assemble the Circuit</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Follow each assembly step carefully. You will first build a
                <strong className="text-foreground"> step-down configuration</strong> (Np = 200 turns, Ns = 100 turns).
              </p>

              <div className="space-y-2">
                {[
                  { label: "Place the iron-core transformer on the bench" },
                  { label: "Connect the AC supply to the PRIMARY (Np = 200 turns) terminals" },
                  { label: "Connect voltmeter Vp across the primary coil (parallel)" },
                  { label: "Connect the lamp load to SECONDARY (Ns = 100 turns) terminals" },
                  { label: "Connect voltmeter Vs across the secondary; ammeter in series on primary" },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                      setupPhase > i ? "border-green-400 bg-green-500/8 opacity-70"
                        : setupPhase === i ? "border-indigo-400 bg-indigo-500/8"
                        : "border-border bg-card opacity-50"
                    }`}>
                    <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      setupPhase > i ? "bg-green-500 text-white"
                        : setupPhase === i ? "bg-indigo-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {setupPhase > i ? "✓" : i + 1}
                    </span>
                    <span className={`text-sm ${setupPhase === i ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {setupPhase < 5 ? (
                <Button onClick={() => setSetupPhase(p => p + 1)}
                  className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                  {setupPhase === 0 ? "Place Transformer →"
                    : setupPhase === 1 ? "Connect Primary →"
                    : setupPhase === 2 ? "Connect Vp Meter →"
                    : setupPhase === 3 ? "Connect Secondary Load →"
                    : "Connect Meters — Done!"}
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                  <p className="text-sm font-bold text-green-700">✓ Circuit assembled and ready!</p>
                </motion.div>
              )}

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Safety:</strong> Do not switch on the AC supply until all connections are made and your teacher has checked the circuit. Never touch the secondary terminals while the primary is connected to mains.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 3: STEP-DOWN ══════════════════════════════════════ */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-indigo-500/20 bg-gradient-to-br from-card to-indigo-500/5 p-4"
              style={{ minHeight: 280 }}>
              <TransformerCircuitSVG np={8} ns={4} vp={240}
                running={stepDownRun} showReadings={stepDownRun} />
            </motion.div>

            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700">
                Step 3 — Experiment A
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Step-Down Transformer</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                With <strong className="text-foreground">Np = 200 turns</strong> and <strong className="text-foreground">Ns = 100 turns</strong>,
                the turns ratio is 2:1. Predict what the secondary voltage will be before you switch on.
              </p>

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                <p className="text-xs font-bold text-indigo-700 mb-1">Predicted values (before switching on):</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Np : Ns",   value: "200 : 100 = 2 : 1" },
                    { label: "Vp",        value: "240 V (input)" },
                    { label: "Vs = Vp × Ns/Np", value: `240 × ½ = ${vs_sd} V` },
                    { label: "If Ip = 0.5 A → Is", value: "≈ 1.0 A (2×)" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-lg p-2 border border-indigo-100">
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-extrabold font-heading text-indigo-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => setStepDownRun(true)} disabled={stepDownRun}
                className={`w-full gap-2 border-0 ${stepDownRun ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
                <Play className="w-4 h-4" />
                {stepDownRun ? "✓ AC Applied — Readings Visible" : "Switch On AC Supply"}
              </Button>

              {stepDownRun && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-3">
                  <div className="p-3 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-2">
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Measured readings</p>
                    <div className="grid grid-cols-2 gap-2">
                      <MeterCard label="Vp (primary)"    value="240"  unit="V" color="text-indigo-600" />
                      <MeterCard label="Vs (secondary)"  value="120"  unit="V" color="text-green-600"  />
                      <MeterCard label="Ip (primary)"    value="0.50" unit="A" color="text-red-500"    />
                      <MeterCard label="Lamp brightness" value="DIM"  unit=""  color="text-amber-600" sub="Vs = ½ × Vp" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/20 space-y-1">
                    <p className="text-sm font-bold text-indigo-700">✓ Step-down confirmed!</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Vs = 120 V = ½ × 240 V. The voltage was halved exactly as the turns ratio (2:1) predicted.
                      The lamp glows dimly — lower voltage, lower power delivered to the load.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 4: STEP-UP ════════════════════════════════════════ */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-violet-500/20 bg-gradient-to-br from-card to-violet-500/5 p-4"
              style={{ minHeight: 280 }}>
              <TransformerCircuitSVG np={4} ns={8} vp={240}
                running={stepUpRun} showReadings={stepUpRun} />
            </motion.div>

            <div className="space-y-4">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700">
                Step 4 — Experiment B
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Step-Up Transformer</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Now swap the coil connections so <strong className="text-foreground">Np = 100 turns</strong> and
                <strong className="text-foreground"> Ns = 200 turns</strong> (ratio 1:2). Predict the new secondary voltage.
              </p>

              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 space-y-2">
                <p className="text-xs font-bold text-violet-700 mb-1">Predicted values:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Np : Ns",        value: "100 : 200 = 1 : 2" },
                    { label: "Vp",             value: "240 V (input)" },
                    { label: "Vs = Vp × Ns/Np", value: `240 × 2 = ${vs_su} V` },
                    { label: "If Ip = 1.0 A → Is", value: "≈ 0.5 A (½)" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-lg p-2 border border-violet-100">
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-extrabold font-heading text-violet-600">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> 480 V is dangerous. In a real lab the load would be a high-voltage
                  rated component. Here we observe the voltmeter reading only — do not touch secondary terminals.
                </p>
              </div>

              <Button onClick={() => setStepUpRun(true)} disabled={stepUpRun}
                className={`w-full gap-2 border-0 ${stepUpRun ? "bg-green-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
                <Play className="w-4 h-4" />
                {stepUpRun ? "✓ AC Applied — Readings Visible" : "Switch On AC Supply"}
              </Button>

              {stepUpRun && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-3">
                  <div className="p-3 rounded-2xl bg-violet-500/5 border border-violet-500/20 space-y-2">
                    <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Measured readings</p>
                    <div className="grid grid-cols-2 gap-2">
                      <MeterCard label="Vp (primary)"   value="240"  unit="V" color="text-indigo-600" />
                      <MeterCard label="Vs (secondary)" value="480"  unit="V" color="text-violet-600" />
                      <MeterCard label="Ip (primary)"   value="1.00" unit="A" color="text-red-500"    />
                      <MeterCard label="Lamp brightness" value="BRIGHT" unit="" color="text-amber-500" sub="Vs = 2 × Vp" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-violet-500/8 border border-violet-500/20 space-y-1">
                    <p className="text-sm font-bold text-violet-700">✓ Step-up confirmed!</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Vs = 480 V = 2 × 240 V. The turns ratio (1:2) doubled the voltage.
                      Notice the primary current is now higher (1 A vs 0.5 A) — voltage went up, current went down to conserve power.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 5: TURNS RATIO EXPLORER ═══════════════════════════ */}
        {step === 5 && (
          <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 mb-2">
                Step 5 — Interactive
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Turns Ratio Explorer</h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-1">
                Adjust the number of turns on each coil and see how the secondary voltage, current, and power change instantly.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 justify-center">
              {RATIO_PRESETS.map(p => (
                <button key={p.label}
                  onClick={() => { setNp(p.np); setNs(p.ns); setRatioApplied(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    np === p.np && ns === p.ns
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-card border-border hover:border-indigo-300 text-muted-foreground"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-indigo-700">Primary turns (Np)</p>
                  <span className="text-lg font-extrabold font-heading text-indigo-600">{np}</span>
                </div>
                <input type="range" min="50" max="400" step="50"
                  value={np} onChange={e => { setNp(+e.target.value); setRatioApplied(false); }}
                  className="w-full accent-indigo-600" />
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>50</span><span>200</span><span>400</span>
                </div>
                <p className="text-xs text-muted-foreground">Vp = {VP} V (fixed)</p>
              </div>

              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-green-700">Secondary turns (Ns)</p>
                  <span className="text-lg font-extrabold font-heading text-green-600">{ns}</span>
                </div>
                <input type="range" min="50" max="400" step="50"
                  value={ns} onChange={e => { setNs(+e.target.value); setRatioApplied(false); }}
                  className="w-full accent-green-600" />
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>50</span><span>200</span><span>400</span>
                </div>
                <p className="text-xs text-muted-foreground">Load RL = {RL} Ω</p>
              </div>
            </div>

            {/* Live circuit */}
            <div className="rounded-3xl border-2 border-indigo-500/20 bg-gradient-to-br from-card to-indigo-500/5 p-4">
              <TransformerCircuitSVG np={Math.round(np / 50)} ns={Math.round(ns / 50)}
                vp={240} running={ratioApplied} showReadings={ratioApplied} />
            </div>

            {/* Apply + Live results */}
            <Button onClick={() => setRatioApplied(true)}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
              <Zap className="w-4 h-4" />
              {ratioApplied ? "✓ Results Showing" : "Apply Turns Ratio & See Results"}
            </Button>

            {ratioApplied && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MeterCard label="Turns ratio" value={`${np}:${ns}`} unit="" color="text-indigo-600" />
                <MeterCard label="Vs" value={vs_ratio.toFixed(1)} unit="V" color="text-green-600"
                  sub={vs_ratio > VP ? "step-up" : vs_ratio < VP ? "step-down" : "isolating"} />
                <MeterCard label="Is" value={is_ratio.toFixed(3)} unit="A" color="text-amber-600" />
                <MeterCard label="Ip" value={ip_ratio.toFixed(4)} unit="A" color="text-red-500"
                  sub={`Pp ≈ ${pp_ratio} W`} />
              </motion.div>
            )}
          </div>
        )}

        {/* ══ STEP 6: POWER CONSERVATION ═════════════════════════════ */}
        {step === 6 && (
          <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 mb-2">
                Step 6 — Analysis
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Power Conservation</h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-1">
                In an ideal transformer, <strong className="text-foreground">input power = output power</strong>.
                Verify this using both experimental configurations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-center">
              <p className="text-xl font-extrabold font-heading text-indigo-600 mb-1">
                Pp = Vp × Ip = Vs × Is = Ps
              </p>
              <p className="text-xs text-muted-foreground">Energy is neither created nor destroyed — only transferred and voltage-transformed.</p>
            </div>

            {/* Data table */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Results from your experiments
              </div>
              <table className="w-full text-xs">
                <thead className="bg-muted/30">
                  <tr className="text-muted-foreground">
                    <th className="px-3 py-2 text-left font-semibold">Config.</th>
                    <th className="px-3 py-2 text-center font-semibold">Vp (V)</th>
                    <th className="px-3 py-2 text-center font-semibold">Ip (A)</th>
                    <th className="px-3 py-2 text-center font-semibold">Pp (W)</th>
                    <th className="px-3 py-2 text-center font-semibold">Vs (V)</th>
                    <th className="px-3 py-2 text-center font-semibold">Is (A)</th>
                    <th className="px-3 py-2 text-center font-semibold">Ps (W)</th>
                    <th className="px-3 py-2 text-center font-semibold">Match?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { cfg: "Step-down (2:1)", vp: 240, ip: 0.50, vs: 120, is: 1.00, r: "200:100" },
                    { cfg: "Step-up (1:2)",   vp: 240, ip: 1.00, vs: 480, is: 0.50, r: "100:200" },
                    { cfg: `Custom (${np}:${ns})`, vp: VP, ip: ip_ratio, vs: vs_ratio, is: is_ratio, r: `${np}:${ns}` },
                  ].map(row => {
                    const pp = (row.vp * row.ip).toFixed(1);
                    const ps = (row.vs * row.is).toFixed(1);
                    const match = Math.abs(+pp - +ps) < 0.5;
                    return (
                      <tr key={row.cfg} className="bg-card even:bg-muted/20">
                        <td className="px-3 py-2 font-semibold text-foreground">{row.cfg}</td>
                        <td className="px-3 py-2 text-center">{row.vp}</td>
                        <td className="px-3 py-2 text-center">{row.ip.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center font-bold text-indigo-600">{pp}</td>
                        <td className="px-3 py-2 text-center">{row.vs.toFixed(1)}</td>
                        <td className="px-3 py-2 text-center">{row.is.toFixed(3)}</td>
                        <td className="px-3 py-2 text-center font-bold text-green-600">{ps}</td>
                        <td className="px-3 py-2 text-center">{match ? "✅" : "⚠️"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <p className="text-xs font-bold text-foreground">Why isn't it exactly equal in a real transformer?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                {[
                  { icon: "🌡️", t: "Copper losses", d: "I²R heating in coil resistance" },
                  { icon: "🔄", t: "Eddy currents",  d: "Induced currents in the iron core" },
                  { icon: "🔁", t: "Hysteresis",    d: "Energy to re-magnetise core each cycle" },
                ].map(l => (
                  <div key={l.t} className="flex gap-2">
                    <span>{l.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">{l.t}</p>
                      <p>{l.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Real power transformers are 95–99% efficient.</p>
            </div>

            <Button onClick={() => setPowerVerified(true)} disabled={powerVerified}
              className={`w-full gap-2 border-0 ${powerVerified ? "bg-green-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
              <CheckCircle2 className="w-4 h-4" />
              {powerVerified ? "✓ Power Conservation Verified!" : "I've Checked the Table — Verify Power Conservation"}
            </Button>
          </div>
        )}

        {/* ══ STEP 7: CONCLUSION ═════════════════════════════════════ */}
        {step === 7 && (
          <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-semibold mb-3 border border-indigo-500/20">
                🏁 Conclusion
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">What Did We Discover?</h2>
            </motion.div>

            <div className="space-y-2.5">
              {[
                {
                  title: "Transformers only work with AC",
                  desc: "A direct current produces a constant magnetic flux. Since e = −N dΦ/dt, zero rate of change → zero induced EMF. AC continuously changes flux, inducing a voltage every half-cycle.",
                  col: "text-indigo-700", bg: "bg-indigo-500/8", b: "border-indigo-500/20",
                },
                {
                  title: "The turns ratio controls the voltage ratio",
                  desc: "Vs/Vp = Ns/Np. Doubling the secondary turns doubles the secondary voltage (step-up). Halving them halves it (step-down). You verified this in both experiments.",
                  col: "text-violet-700", bg: "bg-violet-500/8", b: "border-violet-500/20",
                },
                {
                  title: "Voltage and current trade off — power is conserved",
                  desc: "When voltage is stepped up by factor n, current is stepped down by the same factor n. Pp = Vp × Ip ≈ Vs × Is = Ps for an ideal transformer.",
                  col: "text-green-700", bg: "bg-green-500/8", b: "border-green-500/20",
                },
                {
                  title: "Laminated core reduces energy losses",
                  desc: "The thin silicon-steel laminations limit eddy currents — circular induced currents that would otherwise waste energy as heat. This is why real transformers are 95–99% efficient.",
                  col: "text-amber-700", bg: "bg-amber-500/8", b: "border-amber-500/20",
                },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.09 }}
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
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 font-heading">Deeper Questions</p>
              <div className="space-y-2">
                {[
                  {
                    q: "Why is electricity transmitted at very high voltage (e.g. 400 kV) in the national grid?",
                    a: "Power loss in transmission lines = I²R. At high voltage, current is much lower (P = VI), so I²R losses are drastically reduced. A step-up transformer at the power station raises voltage to 400 kV; step-down transformers near homes reduce it back to 230 V.",
                    c: "text-indigo-700", bg: "bg-indigo-500/5", b: "border-indigo-500/20",
                  },
                  {
                    q: "What would happen if the secondary coil were short-circuited?",
                    a: "The secondary resistance would be nearly zero, so by Ohm's law the secondary current Is = Vs/R would become extremely large. By Lenz's law this large secondary current creates a counter-flux that collapses the primary inductance — very large primary current flows, which would blow fuses or burn out the primary winding.",
                    c: "text-red-700", bg: "bg-red-500/5", b: "border-red-500/20",
                  },
                  {
                    q: "Why does a transformer hum at 50 Hz / 100 Hz?",
                    a: "Magnetostriction causes the iron core to physically expand and contract as flux cycles at 50 Hz. Each cycle produces two contractions (positive and negative flux), giving a mechanical vibration at 100 Hz — audible as a 100 Hz hum.",
                    c: "text-amber-700", bg: "bg-amber-500/5", b: "border-amber-500/20",
                  },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
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

            {/* Applications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "⚡", title: "National Grid",       desc: "Step-up transformers raise generation voltage to 400 kV for long-distance transmission; step-down units return it to 230 V for homes." },
                { icon: "📱", title: "Phone chargers",      desc: "A tiny ferrite-core transformer inside every USB charger steps down mains voltage to 5–20 V for your device." },
                { icon: "🔊", title: "Audio matching",      desc: "Audio transformers match impedance between amplifier output stages and loudspeakers for maximum power transfer." },
                { icon: "⚕️", title: "Medical isolation",   desc: "Isolation transformers (1:1) in operating theatres break the earth path, preventing electric shock from equipment faults." },
              ].map((app, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.07 }}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card">
                  <span className="text-2xl leading-none mt-0.5">{app.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">{app.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{app.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="rounded-xl border border-indigo-200 bg-indigo-500/5 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1.5">The equation you verified today</p>
              <p className="text-lg font-extrabold font-heading text-indigo-600">Vs / Vp = Ns / Np = Ip / Is</p>
              <p className="text-xs text-muted-foreground mt-1">— and that Pp ≈ Ps for an ideal transformer</p>
            </motion.div>
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
