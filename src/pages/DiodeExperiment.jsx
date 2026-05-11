import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap, Play, Pause, RotateCcw, CheckCircle2, ChevronRight,
  AlertTriangle, Lightbulb,
} from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell from "@/components/lab/ExperimentShell";
import DiodeSVG from "@/components/diode/DiodeSVG";
import {
  DiodeIntroSVG,
  DiodeSetupSVG,
  ForwardBiasSVG,
  ReverseBiasSVG,
  HalfWaveSVG,
} from "@/components/diode/DiodeCircuitSVG";
import BatterySVG from "@/components/lab/electrical/BatterySVG";
import ResistorSVG from "@/components/lab/electrical/ResistorSVG";
import LEDSVGComponent from "@/components/lab/electrical/LEDSVGComponent";
import WiresSVG from "@/components/lab/electrical/WiresSVG";
import MultimeterSVG from "@/components/lab/electrical/MultimeterSVG";

/* ─── Stage definitions ───────────────────────────────────── */
const STEPS = [
  { id: 0, label: "Intro" },
  { id: 1, label: "Materials" },
  { id: 2, label: "Setup" },
  { id: 3, label: "Forward Bias" },
  { id: 4, label: "Reverse Bias" },
  { id: 5, label: "Rectification" },
  { id: 6, label: "Conclusion" },
];
const TOTAL_STEPS = STEPS.length;

const THEME = {
  iconBg:    "bg-violet-500/10",
  iconColor: "text-violet-600",
  done:      "bg-violet-400",
  current:   "bg-violet-500",
  label:     "text-violet-600",
  dot:       "hsl(263,70%,50%)",
  button:    "bg-violet-600 hover:bg-violet-700 text-white border-0",
};

/* ─── Materials list ──────────────────────────────────────── */
const MATERIALS = [
  {
    id: "diode",
    name: "Diode (1N4007)",
    material: "Silicon semiconductor",
    reason: "The star of our experiment. A silicon P-N junction that allows current to flow in only one direction — from anode (+) to cathode (−). Silicon is chosen because its 0.7V forward-voltage threshold is predictable and stable.",
    tag: "Semiconductor",
    tagColor: "text-violet-700 bg-violet-500/10 border-violet-500/20",
    Component: () => <DiodeSVG showLabel={false} />,
  },
  {
    id: "resistor",
    name: "Resistor (1 kΩ)",
    material: "Carbon / ceramic",
    reason: "Limits the current through the circuit to a safe level (≈ 8 mA at 9 V). Without it, too much current would flow and destroy the diode and LED. Carbon film on a ceramic rod with colour-coded bands.",
    tag: "Passive",
    tagColor: "text-amber-700 bg-amber-500/10 border-amber-500/20",
    Component: () => <ResistorSVG />,
  },
  {
    id: "battery",
    name: "Battery (9 V)",
    material: "Alkaline / zinc-carbon",
    reason: "Provides the DC voltage to drive the circuit. 9 V is high enough to overcome the diode's forward voltage (0.7 V) and the LED's drop (≈ 2 V) while leaving a safe voltage across the resistor.",
    tag: "Power source",
    tagColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    Component: () => <BatterySVG voltage={9} />,
  },
  {
    id: "led",
    name: "LED (Green)",
    material: "GaP / GaAsP semiconductor",
    reason: "Acts as a visible current indicator. When the diode conducts, the LED lights up; when blocked, it stays off. Using a green LED (2.1 V forward voltage) gives a clear visual contrast.",
    tag: "Indicator",
    tagColor: "text-green-700 bg-green-500/10 border-green-500/20",
    Component: () => <LEDSVGComponent color="#22c55e" on={false} />,
  },
  {
    id: "wires",
    name: "Connecting Wires",
    material: "Copper core, PVC insulation",
    reason: "Copper has very low resistance, so it does not affect the measurements. Colour-coded wires (red = positive, black = negative, green = signal) make circuit connections clear and reduce wiring mistakes.",
    tag: "Conductor",
    tagColor: "text-blue-700 bg-blue-500/10 border-blue-500/20",
    Component: () => <WiresSVG />,
  },
  {
    id: "multimeter",
    name: "Multimeter",
    material: "Plastic casing, digital display",
    reason: "Measures voltage across the diode to confirm the 0.7 V forward-voltage drop. Also used in reverse bias to show near-zero current. A digital readout gives precise, easy-to-read values.",
    tag: "Measuring",
    tagColor: "text-indigo-700 bg-indigo-500/10 border-indigo-500/20",
    Component: () => <MultimeterSVG mode="V" reading={0.7} />,
  },
];

/* ─── Mistakes the student can make ──────────────────────── */
const FORWARD_MISTAKES = [
  "Make sure the battery positive (+) terminal connects to the diode ANODE.",
  "Check that the diode stripe (cathode) faces toward the resistor, not the battery.",
  "Ensure all wires are fully inserted — a loose connection blocks current.",
];

/* ─── Discovery Q&A ───────────────────────────────────────── */
const DISCOVERY_QS = [
  {
    q: "Why does the LED light only in forward bias?",
    a: "In forward bias the positive voltage at the anode pushes holes (in the P-region) toward the junction while the negative voltage at the cathode pushes electrons (in the N-region) toward it. They meet and recombine at the junction, releasing energy as photons — the LED glows. In reverse bias, charge carriers are pulled away from the junction, depleting it and preventing any current.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25",
  },
  {
    q: "Why is the diode's forward voltage about 0.7 V and not 0 V?",
    a: "A potential barrier (built-in field) exists at every P-N junction due to diffusion of charges during manufacturing. For silicon this barrier is ≈ 0.7 V. Until the applied voltage exceeds this barrier, the junction remains effectively closed. Germanium diodes have a lower barrier (≈ 0.3 V) — a different semiconductor material.",
    color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/25",
  },
  {
    q: "What would happen if you connected a second diode in parallel (same orientation)?",
    a: "The circuit would behave almost identically — the second diode conducts in parallel, slightly lowering the combined forward voltage by a few millivolts. Current would share between both diodes. The LED would still light up at the same brightness.",
    color: "text-emerald-700", bg: "bg-emerald-500/8", border: "border-emerald-500/25",
  },
  {
    q: "How does the half-wave rectifier convert AC to DC?",
    a: "The diode is placed in series with the AC supply. During the positive half-cycle, the diode is forward-biased and conducts, allowing current to flow through the load. During the negative half-cycle the diode is reverse-biased — it blocks current. The result is pulsating DC: a waveform that is always positive (or zero). A capacitor smooths these pulses into steady DC.",
    color: "text-cyan-700", bg: "bg-cyan-500/8", border: "border-cyan-500/25",
  },
];

/* ─── Applications ────────────────────────────────────────── */
const APPLICATIONS = [
  { icon: "🔌", title: "Power Supplies", desc: "Every phone charger uses a bridge rectifier (4 diodes) to convert mains AC into smooth DC." },
  { icon: "🛡️", title: "Reverse polarity protection", desc: "A diode across a battery connection lets it conduct normally but blocks reverse current if the battery is inserted backwards." },
  { icon: "📡", title: "Radio demodulation", desc: "AM radio receivers use a diode to extract audio from the modulated carrier wave." },
  { icon: "🌞", title: "Solar panels", desc: "A bypass diode prevents a shaded panel from acting as a resistance load on the rest of the array." },
];

/* ─── Icon ────────────────────────────────────────────────── */
function DiodeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,4 5,20 19,12" fill="currentColor" opacity="0.3" stroke="none" />
      <polygon points="5,4 5,20 19,12" />
      <line x1="19" y1="3" x2="19" y2="21" />
    </svg>
  );
}

/* ─── Main page ───────────────────────────────────────────── */
export default function DiodeExperiment() {
  /* Nav */
  const [materialIdx, setMaterialIdx]     = useState(0);
  const [setupPhase, setSetupPhase]       = useState(0);
  const [fwConnected, setFwConnected]     = useState(false);
  const [fwRunning, setFwRunning]         = useState(false);
  const [rvReversed, setRvReversed]       = useState(false);
  const [rvApplied, setRvApplied]         = useState(false);
  const [waveTime, setWaveTime]           = useState(0);
  const [waveRunning, setWaveRunning]     = useState(false);
  const [revealedQs, setRevealedQs]       = useState([]);
  const [mistake, setMistake]             = useState(null);
  const waveRef = useRef(null);

  const resetAll = useCallback(() => {
    setMaterialIdx(0);
    setSetupPhase(0);
    setFwConnected(false); setFwRunning(false);
    setRvReversed(false);  setRvApplied(false);
    setWaveTime(0);        setWaveRunning(false);
    setRevealedQs([]);     setMistake(null);
    clearInterval(waveRef.current);
  }, []);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(TOTAL_STEPS, resetAll);

  /* Wave animation */
  useEffect(() => {
    if (waveRunning) {
      waveRef.current = setInterval(() => {
        setWaveTime(t => t + 0.05);
      }, 60);
    } else {
      clearInterval(waveRef.current);
    }
    return () => clearInterval(waveRef.current);
  }, [waveRunning]);

  /* Gate conditions */
  const canAdvance = (() => {
    if (step === 2) return setupPhase >= 4;
    if (step === 3) return fwRunning;
    if (step === 4) return rvApplied;
    if (step === 5) return waveTime > 1;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <ExperimentShell
      title="Diode Rectification"
      subject="Physics · Electronics"
      icon={DiodeIcon}
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
              transition={{ duration: 0.6 }}>
              <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <DiodeIcon className="w-10 h-10 text-violet-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 text-xs font-semibold mb-3">
                Physics · Electronics
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                Diode Rectification
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                A diode is the simplest semiconductor device — a one-way valve for electric current.
                In this experiment you will explore <strong className="text-foreground">forward bias</strong>,
                observe what happens in <strong className="text-foreground">reverse bias</strong>, and
                see how a single diode turns alternating current into direct current:
                the foundation of every power supply on the planet.
              </p>
            </motion.div>

            <div className="w-full max-w-sm mx-auto" style={{ height: 220 }}>
              <DiodeIntroSVG />
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {[
                { label: "Diode type",     value: "1N4007",  sub: "silicon rectifier" },
                { label: "Forward voltage", value: "0.7 V",   sub: "silicon threshold" },
                { label: "Peak inverse V",  value: "1000 V",  sub: "max reverse voltage" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <p className="text-xl font-extrabold font-heading text-violet-600">{s.value}</p>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="w-full p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2">Core Question</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Why does an LED light up when the diode faces one way,
                yet <strong className="text-foreground">stay off</strong> when you flip it around — even
                though the same battery is connected both times?"
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Press <strong>Next</strong> to meet your equipment.</p>
          </div>
        )}

        {/* ══ STEP 1: MATERIALS ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex flex-col gap-6 w-full">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                Step 1 of 7 — Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Meet Your Equipment</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
                Select each component to learn what it's made of and why we chose it for this experiment.
              </p>
            </div>

            {/* Tab bar */}
            <div className="flex flex-wrap gap-2 justify-center">
              {MATERIALS.map((m, i) => (
                <button key={m.id} onClick={() => setMaterialIdx(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    materialIdx === i
                      ? "bg-violet-600 text-white border-violet-600 shadow-md"
                      : "bg-card text-muted-foreground border-border hover:border-violet-300"
                  }`}>
                  {m.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Material card */}
            <AnimatePresence mode="wait">
              <motion.div key={materialIdx}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">

                {/* SVG */}
                <div className="rounded-3xl border-2 border-violet-500/20 bg-gradient-to-br from-card to-violet-500/5 p-6 flex items-center justify-center"
                  style={{ minHeight: 260 }}>
                  <div className="w-full max-w-[160px] mx-auto">
                    {React.createElement(MATERIALS[materialIdx].Component)}
                  </div>
                </div>

                {/* Info */}
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

                  <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/15">
                    <p className="text-xs font-bold text-violet-700 mb-1.5">Why this component?</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{MATERIALS[materialIdx].reason}</p>
                  </div>

                  {/* Navigation between materials */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setMaterialIdx(i => Math.max(0, i - 1))}
                      disabled={materialIdx === 0}
                      className="px-3 py-2 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors">
                      ← Previous
                    </button>
                    <span className="text-xs text-muted-foreground flex-1 text-center">
                      {materialIdx + 1} / {MATERIALS.length}
                    </span>
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
              className="rounded-3xl border-2 border-violet-500/20 bg-gradient-to-br from-card to-violet-500/5 p-4 flex items-center justify-center"
              style={{ minHeight: 300 }}>
              <DiodeSetupSVG phase={setupPhase} />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                  Step 2 of 7 — Interactive Setup
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Assemble the Circuit</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Follow each step carefully. Pay close attention to the
                <strong className="text-foreground"> diode orientation</strong> — the white cathode stripe
                must face away from the battery's positive terminal.
              </p>

              <div className="space-y-2">
                {[
                  { label: "Place the breadboard on your bench", phase: 0 },
                  { label: "Insert the diode — stripe (K) toward the resistor side", phase: 1 },
                  { label: "Insert the 1kΩ resistor next to the diode cathode", phase: 2 },
                  { label: "Insert the LED — long leg (+) toward the resistor", phase: 3 },
                  { label: "Connect the 9V battery with red wire to diode anode", phase: 4 },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      setupPhase > i
                        ? "border-green-400 bg-green-500/8 opacity-70"
                        : setupPhase === i
                        ? "border-violet-400 bg-violet-500/8"
                        : "border-border bg-card opacity-50"
                    }`}>
                    <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      setupPhase > i ? "bg-green-500 text-white" :
                      setupPhase === i ? "bg-violet-500 text-white" : "bg-muted text-muted-foreground"
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
                <Button onClick={() => setSetupPhase(p => Math.min(p + 1, 5))}
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0">
                  {setupPhase === 0 ? "Add Diode →"
                    : setupPhase === 1 ? "Add Resistor →"
                    : setupPhase === 2 ? "Add LED →"
                    : setupPhase === 3 ? "Connect Battery →"
                    : "Circuit Ready!"}
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                  <p className="text-sm font-bold text-green-700">✓ Circuit assembled — let's test it!</p>
                </motion.div>
              )}

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Safety tip:</strong> Always connect the resistor before the LED and diode. This prevents excessive current that could permanently damage components.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══ STEP 3: FORWARD BIAS ═══════════════════════════════════ */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-violet-500/20 bg-gradient-to-br from-card to-violet-500/5 p-4"
              style={{ minHeight: 280 }}>
              <ForwardBiasSVG running={fwRunning} voltage={9} />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                  Step 3 of 7 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Forward Bias</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The battery's <strong className="text-foreground">positive terminal</strong> connects
                to the diode's <strong className="text-foreground">anode (A)</strong>. This is forward bias.
                When the applied voltage exceeds the silicon's 0.7 V barrier, the diode opens and current flows freely.
              </p>

              {/* Connection checklist */}
              <div className="space-y-2">
                {[
                  { label: "Battery (+) connected to Anode (A) of diode", done: fwConnected },
                  { label: "Battery (−) connected through LED to Cathode (K)", done: fwConnected },
                  { label: "All connections tight on breadboard", done: fwConnected },
                ].map((item, i) => (
                  <div key={i} onClick={() => !fwConnected && setFwConnected(true)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      item.done ? "border-green-400 bg-green-500/8" : "border-border bg-card hover:border-violet-300"
                    }`}>
                    <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      item.done ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {item.done ? "✓" : i + 1}
                    </span>
                    <span className={`text-sm ${item.done ? "text-green-800 font-medium" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {!fwConnected ? (
                <Button onClick={() => setFwConnected(true)}
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0">
                  <Zap className="w-4 h-4" /> I've Connected the Circuit
                </Button>
              ) : (
                <div className="space-y-3">
                  {/* Live readings */}
                  <div className="p-3 rounded-2xl bg-violet-500/5 border border-violet-500/20 space-y-2">
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Live Readings</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Battery voltage",    value: "9.0 V",  color: "text-amber-600" },
                        { label: "Diode V-drop",       value: fwRunning ? "0.7 V" : "— V", color: "text-violet-600" },
                        { label: "Current (approx.)",  value: fwRunning ? "8.3 mA" : "0 mA", color: "text-blue-600" },
                        { label: "LED status",         value: fwRunning ? "ON 💡" : "OFF",   color: fwRunning ? "text-green-600" : "text-muted-foreground" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-lg p-2 border border-violet-100">
                          <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
                          <p className={`text-sm font-extrabold font-heading ${color} leading-tight`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => setFwRunning(true)} disabled={fwRunning}
                    className={`w-full gap-2 border-0 ${fwRunning ? "bg-green-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
                    <Play className="w-4 h-4" />
                    {fwRunning ? "✓ Current Flowing — LED is ON!" : "Switch On the Battery"}
                  </Button>

                  {fwRunning && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 space-y-1">
                      <p className="text-sm font-bold text-green-700">✓ Forward bias confirmed!</p>
                      <p className="text-xs text-green-800 leading-relaxed">
                        The diode is conducting. 8.3 mA flows through the circuit.
                        The LED glows because charge carriers recombine at the junction, releasing light energy.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Mistake guide */}
              {!fwRunning && fwConnected && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <p className="text-xs font-bold text-amber-700 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> If the LED doesn't light up, check:
                  </p>
                  {FORWARD_MISTAKES.map((m, i) => (
                    <p key={i} className="text-xs text-amber-800 leading-relaxed mb-0.5">• {m}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 4: REVERSE BIAS ═══════════════════════════════════ */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-red-500/20 bg-gradient-to-br from-card to-red-500/5 p-4"
              style={{ minHeight: 280 }}>
              <ReverseBiasSVG running={rvApplied} />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-700 mb-2">
                  Step 4 of 7 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Reverse Bias</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Now <strong className="text-foreground">flip the diode around</strong> in the breadboard so its
                cathode faces the battery positive terminal. This is reverse bias.
                The depletion region widens — no current can flow.
              </p>

              {/* Interactive step */}
              <div className="space-y-3">
                <button
                  onClick={() => setRvReversed(true)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    rvReversed ? "border-green-400 bg-green-500/8" : "border-border bg-card hover:border-red-300"
                  }`}>
                  <span className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm ${
                    rvReversed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {rvReversed ? "✓" : "↔"}
                  </span>
                  <span className={`text-sm ${rvReversed ? "font-semibold text-green-800" : "text-muted-foreground"}`}>
                    I've reversed the diode (stripe now faces the battery +)
                  </span>
                </button>

                {rvReversed && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <Button onClick={() => setRvApplied(true)} disabled={rvApplied}
                      className={`w-full gap-2 border-0 ${rvApplied ? "bg-muted text-muted-foreground" : "bg-red-600 hover:bg-red-700 text-white"}`}>
                      <Zap className="w-4 h-4" />
                      {rvApplied ? "Battery applied — what happened?" : "Apply the Battery (same 9V)"}
                    </Button>
                  </motion.div>
                )}
              </div>

              {rvApplied && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-3">
                  {/* Readings */}
                  <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Live Readings</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Battery voltage",  value: "9.0 V",     color: "text-amber-600" },
                        { label: "Diode V-drop",     value: "≈ 9.0 V",   color: "text-red-600" },
                        { label: "Current",          value: "≈ 0 µA",    color: "text-muted-foreground" },
                        { label: "LED status",       value: "OFF 🔕",    color: "text-muted-foreground" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-lg p-2 border border-red-100">
                          <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
                          <p className={`text-sm font-extrabold font-heading ${color} leading-tight`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/25 space-y-1">
                    <p className="text-sm font-bold text-red-700">✓ Reverse bias confirmed — diode blocks!</p>
                    <p className="text-xs text-red-800 leading-relaxed">
                      The entire 9 V sits across the diode. No current flows — the LED is dark.
                      The diode is acting as an <em>open circuit</em>.
                      This property is what makes rectification possible.
                    </p>
                  </div>

                  {/* What would happen question */}
                  <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                    <p className="text-xs font-bold text-violet-700 mb-1">Think about it 🤔</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      What would happen if the voltage exceeded 1000 V? The diode would break down
                      (avalanche breakdown) and suddenly conduct in both directions — destroying itself.
                      This is why we chose the 1N4007 which handles up to 1000 V reverse voltage.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══ STEP 5: HALF-WAVE RECTIFICATION ════════════════════════ */}
        {step === 5 && (
          <div className="flex flex-col gap-6 w-full">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                Step 5 of 7 — Concept
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Half-Wave Rectification</h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-1">
                Now we replace the battery with an AC source. Watch how the diode selects only the
                positive half-cycles and blocks the negative ones — converting AC into pulsating DC.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-violet-500/20 bg-gradient-to-br from-card to-violet-500/5 p-4 w-full">
              <HalfWaveSVG time={waveTime} running={waveRunning} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center">
                <p className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wider">Input</p>
                <p className="text-lg font-extrabold font-heading text-blue-600">AC Sine Wave</p>
                <p className="text-xs text-muted-foreground mt-0.5">alternates + and −</p>
              </div>
              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-center">
                <p className="text-xs font-bold text-violet-700 mb-1 uppercase tracking-wider">Device</p>
                <p className="text-lg font-extrabold font-heading text-violet-600">Diode (1N4007)</p>
                <p className="text-xs text-muted-foreground mt-0.5">passes + half-cycles only</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
                <p className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wider">Output</p>
                <p className="text-lg font-extrabold font-heading text-green-600">Pulsating DC</p>
                <p className="text-xs text-muted-foreground mt-0.5">always ≥ 0 V</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => setWaveRunning(r => !r)}
                className={`gap-2 border-0 ${waveRunning ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
                {waveRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Animate Waveforms</>}
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => { setWaveTime(0); setWaveRunning(false); }}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {waveTime > 1 && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-sm font-bold text-emerald-700 mb-2">What you're seeing:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 mt-0.5 rounded-full bg-blue-400 shrink-0" />
                    <span><strong className="text-foreground">Blue wave</strong> — the AC input. It swings above and below 0 V alternately.</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 mt-0.5 rounded-full bg-green-500 shrink-0" />
                    <span><strong className="text-foreground">Green wave</strong> — the rectified output. Negative halves are cut off by the diode.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ══ STEP 6: CONCLUSION ══════════════════════════════════════ */}
        {step === 6 && (
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }} className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-3 border border-violet-500/20">
                🏁 Conclusion
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">What Did We Discover?</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                You've verified three fundamental properties of a semiconductor diode with your own observations.
              </p>
            </motion.div>

            {/* Key findings */}
            <div className="space-y-3">
              {[
                {
                  title: "Diodes are one-way current valves",
                  desc: "In forward bias (anode positive), the silicon P-N junction's 0.7 V barrier is overcome and current flows freely. The LED lit up.",
                  color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/20",
                },
                {
                  title: "Reverse bias = open circuit",
                  desc: "When the cathode was made positive, charge carriers were pulled away from the junction. No current flowed. The LED stayed dark. The full 9 V appeared across the diode.",
                  color: "text-red-700", bg: "bg-red-500/8", border: "border-red-500/20",
                },
                {
                  title: "Half-wave rectification converts AC → DC",
                  desc: "By placing a diode in series with an AC source, only the positive half-cycles pass through. The output is always ≥ 0 V — pulsating direct current.",
                  color: "text-green-700", bg: "bg-green-500/8", border: "border-green-500/20",
                },
                {
                  title: "The forward voltage drop is ~0.7 V for silicon",
                  desc: "Regardless of the supply voltage, the silicon diode always 'uses' about 0.7 V. This is a material property of the P-N junction — predictable and consistent.",
                  color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/20",
                },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className={`flex gap-3 p-4 rounded-xl border ${f.border} ${f.bg}`}>
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${f.color}`} />
                  <div>
                    <p className={`text-sm font-semibold font-heading ${f.color} mb-0.5`}>{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Discovery questions */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading mb-3">
                Deeper Questions
              </p>
              <div className="space-y-2">
                {DISCOVERY_QS.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className={`rounded-xl border overflow-hidden ${item.border}`}>
                    <button onClick={() => toggleQ(i)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 ${item.bg}`}>
                      <span className={`text-sm font-semibold ${item.color}`}>{item.q}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${item.color} transition-transform ${revealedQs.includes(i) ? "rotate-90" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {revealedQs.includes(i) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                          <p className="px-4 py-3 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-world applications */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading mb-3">
                Real-World Applications
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {APPLICATIONS.map((app, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + i * 0.08 }}
                    className="flex gap-3 p-3 rounded-xl border border-border bg-card">
                    <span className="text-2xl leading-none mt-0.5">{app.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">{app.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{app.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Formula recap */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="rounded-xl border border-violet-200 bg-violet-500/5 p-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Key values you measured</p>
              <div className="flex justify-center gap-6 flex-wrap">
                {[
                  { label: "Forward V-drop", eq: "≈ 0.7 V" },
                  { label: "Reverse current", eq: "≈ 0 µA" },
                  { label: "Output", eq: "½-wave DC" },
                ].map(({ label, eq }) => (
                  <div key={label} className="text-center">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-base font-extrabold font-heading text-violet-600">{eq}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
