import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap, Play, Pause, RotateCcw,
  CheckCircle2, Microscope, BarChart3, BookOpen,
} from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell from "@/components/lab/ExperimentShell";
import {
  ElectrolysisIntroSVG,
  ElectrolysisSetupSVG,
  ElectrolysisMainSVG,
  ElectrolysisObservationSVG,
  ElectrolysisEquationsSVG,
} from "@/components/electrolysis/ElectrolysisSVG";

const STEPS = [
  { id: 0, label: "Intro" },
  { id: 1, label: "Setup" },
  { id: 2, label: "Electrolysis" },
  { id: 3, label: "Observations" },
  { id: 4, label: "Equations" },
  { id: 5, label: "Applications" },
  { id: 6, label: "Conclusion" },
];
const TOTAL_STEPS = STEPS.length;

const THEME = {
  iconBg:    "bg-cyan-500/10",
  iconColor: "text-cyan-600",
  done:      "bg-cyan-400",
  current:   "bg-cyan-500",
  label:     "text-cyan-600",
  dot:       "hsl(186,85%,38%)",
  button:    "bg-cyan-600 hover:bg-cyan-700 text-white border-0",
};

const DISCOVERY_QS = [
  {
    q: "Why does copper deposit on the cathode and not elsewhere?",
    a: "The cathode is the negative electrode. Cu²⁺ ions (positive charge) are attracted to it by electrostatic forces. When they reach the cathode they gain 2 electrons each and are reduced to solid copper metal, which sticks to the electrode surface.",
    color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/25",
  },
  {
    q: "Why does the anode lose mass during electrolysis?",
    a: "The anode is the positive electrode. Copper atoms on its surface lose 2 electrons (oxidation) and become Cu²⁺ ions that dissolve into the solution. This is why the anode becomes thinner and lighter over time.",
    color: "text-orange-700", bg: "bg-orange-500/8", border: "border-orange-500/25",
  },
  {
    q: "Why does the blue colour of the solution remain almost unchanged?",
    a: "For every Cu²⁺ ion deposited at the cathode, one Cu²⁺ ion is released from the anode. The concentration of copper ions in solution stays nearly constant, so the intensity of the blue colour barely changes.",
    color: "text-cyan-700", bg: "bg-cyan-500/8", border: "border-cyan-500/25",
  },
  {
    q: "What is the role of the sulfate ions (SO₄²⁻) in this process?",
    a: "Sulfate ions carry current through the solution by migrating toward the anode. They complete the electrical circuit in the liquid phase. However, because copper is easier to oxidise at the anode, sulfate ions themselves are not discharged — they remain in solution.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25",
  },
  {
    q: "How is this experiment used in industrial copper purification?",
    a: "In electrorefining, an impure copper block acts as the anode and a thin pure copper sheet is the cathode. When current flows, copper dissolves from the impure anode and deposits as very pure copper on the cathode. Impurities either stay in solution or collect as 'anode sludge'.",
    color: "text-emerald-700", bg: "bg-emerald-500/8", border: "border-emerald-500/25",
  },
];

const APPLICATIONS = [
  { title: "Electroplating",         desc: "Coat objects with a thin copper layer for protection or decoration.",       icon: "⚡" },
  { title: "Copper Purification",    desc: "Refine impure copper to very high purity (99.99%) for electrical use.",      icon: "🔩" },
  { title: "Metal Extraction",       desc: "Recover metals from their ores using controlled electrolytic processes.",     icon: "⛏️" },
  { title: "Printed Circuit Boards", desc: "Electrodeposit copper tracks onto PCBs in electronics manufacturing.",       icon: "🖥️" },
];

export default function ElectrolysisExperiment() {
  const [autoPlay, setAutoPlay]           = useState(false);
  const [setupPhase, setSetupPhase]       = useState(0);
  const [running, setRunning]             = useState(false);
  const [timeElapsed, setTimeElapsed]     = useState(0);
  const [voltage, setVoltage]             = useState(6);
  const [hasRun, setHasRun]               = useState(false);
  const [equationsRevealed, setEquationsRevealed] = useState(0);
  const [revealedQs, setRevealedQs]       = useState([]);
  const timerRef = useRef(null);

  const current = running ? (voltage / 12) * 0.8 : 0;

  const resetExperimentState = () => {
    setAutoPlay(false);
    setSetupPhase(0);
    setRunning(false); setTimeElapsed(0); setHasRun(false);
    setEquationsRevealed(0);
    setRevealedQs([]);
    clearInterval(timerRef.current);
  };

  const { step, dir, goTo, next, back, reset } = useExperimentNav(TOTAL_STEPS, resetExperimentState);

  const toggleRunning = useCallback(() => {
    setRunning(prev => {
      if (!prev) { setHasRun(true); return true; }
      return false;
    });
  }, []);

  useEffect(() => {
    if (running && timeElapsed < 1) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(t => {
          const next = t + 0.005;
          if (next >= 1) { setRunning(false); clearInterval(timerRef.current); return 1; }
          return next;
        });
      }, 80);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL_STEPS - 1) { setAutoPlay(false); return; }
    const interactive = new Set([1, 2]);
    if (interactive.has(step)) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 4500);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  const canAdvance = (() => {
    if (step === 1) return setupPhase >= 3;
    if (step === 2) return hasRun;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const autoPlayButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setAutoPlay(!autoPlay)}
      className={`gap-1.5 text-xs ${autoPlay ? "border-cyan-500 text-cyan-600" : ""}`}
    >
      {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      {autoPlay ? "Pause" : "Auto"}
    </Button>
  );

  return (
    <ExperimentShell
      title="Electrolysis of Copper Sulfate"
      subject="Chemistry · Electrochemistry"
      icon={Zap}
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
      extraHeaderControls={autoPlayButton}
    >
      <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

        {/* ══════════ STEP 0: INTRO ════════════════════════════ */}
        {step === 0 && (
          <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}>
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-cyan-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-semibold mb-3">
                Chemistry · Electrochemistry
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                Electrolysis of Copper Sulfate
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Pass direct current through copper sulfate solution using copper electrodes.
                Watch copper ions migrate, deposit on the cathode, and dissolve from the anode
                — revealing the electrochemical principles behind industrial copper purification and electroplating.
              </p>
            </motion.div>

            <div className="w-full max-w-sm mx-auto" style={{ height: 280 }}>
              <ElectrolysisIntroSVG />
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { label: "Electrolyte", value: "CuSO₄",  sub: "copper sulfate" },
                { label: "Electrodes",  value: "Copper",  sub: "both anode & cathode" },
                { label: "Ion charge",  value: "Cu²⁺",    sub: "migrates to cathode" },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <p className="text-xl font-extrabold font-heading text-cyan-600">{s.value}</p>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="w-full p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-2">Core Question</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "When electricity passes through a copper salt solution, where does the copper go — and why does
                <strong className="text-foreground"> the solution stay the same blue colour?</strong>"
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Press <strong>Next</strong> or <strong>Auto</strong> to begin. Interactive steps require your action.
            </p>
          </div>
        )}

        {/* ══════════ STEP 1: SETUP ════════════════════════════ */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-cyan-500/25 bg-gradient-to-br from-card to-cyan-500/5 p-4 flex items-center justify-center"
              style={{ minHeight: 340 }}>
              <div className="w-full max-w-xs">
                <ElectrolysisSetupSVG phase={setupPhase} />
              </div>
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-2">
                  Step 1 of 5 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Assemble the Apparatus</h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Set up the electrolytic cell step by step.
                <strong className="text-foreground"> Clean electrodes are essential</strong> —
                surface contamination will give inconsistent results.
              </p>

              <div className="space-y-2">
                {[
                  { label: "Prepare a clean beaker on the bench", phase: 0 },
                  { label: "Pour copper sulfate (CuSO₄) solution into the beaker", phase: 1 },
                  { label: "Insert two clean copper electrodes into the solution", phase: 2 },
                  { label: "Connect electrodes to the DC power supply with wires", phase: 3 },
                ].map((item, i) => (
                  <motion.button key={i}
                    onClick={() => setSetupPhase(i)}
                    disabled={setupPhase > i}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      setupPhase > i
                        ? "border-green-400 bg-green-500/8 opacity-70"
                        : setupPhase === i
                        ? "border-cyan-400 bg-cyan-500/8"
                        : "border-border bg-card hover:border-cyan-300"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={setupPhase === i ? { scale: 1.01 } : {}}>
                    <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      setupPhase > i ? "bg-green-500 text-white" :
                      setupPhase === i ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {setupPhase > i ? "✓" : i + 1}
                    </span>
                    <span className={`text-sm ${setupPhase === i ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {setupPhase < 3 ? (
                <Button onClick={() => setSetupPhase(p => Math.min(p + 1, 3))}
                  className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                  {setupPhase === 0 ? "Add Solution →"
                    : setupPhase === 1 ? "Insert Electrodes →"
                    : setupPhase === 2 ? "Connect Circuit →"
                    : "Done"}
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                  <p className="text-sm font-bold text-green-700">✓ Apparatus ready — proceed to run electrolysis!</p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ STEP 2: ELECTROLYSIS ════════════════════ */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-cyan-500/25 bg-gradient-to-br from-card to-cyan-500/5 p-3 flex items-center justify-center"
              style={{ minHeight: 360 }}>
              <ElectrolysisMainSVG
                running={running}
                timeElapsed={timeElapsed}
                voltage={voltage}
                current={current}
              />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-2">
                  Step 2 of 5 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Run the Electrolysis</h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Adjust the voltage then switch on the current. Watch
                <strong className="text-foreground"> Cu²⁺ ions migrate</strong> to the cathode and deposit,
                while the anode slowly dissolves.
              </p>

              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Voltage</p>
                  <span className="text-sm font-bold text-cyan-600 font-heading">{voltage.toFixed(1)} V</span>
                </div>
                <input type="range" min={2} max={12} step={0.5} value={voltage}
                  onChange={e => setVoltage(+e.target.value)}
                  className="w-full accent-cyan-500"
                  disabled={running} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>2 V</span><span>12 V</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {[3, 6, 9, 12].map(v => (
                    <button key={v} onClick={() => !running && setVoltage(v)}
                      disabled={running}
                      className={`text-xs px-2 py-0.5 rounded-md border transition-all ${
                        voltage === v ? "bg-cyan-500 text-white border-cyan-500"
                                     : "bg-muted text-muted-foreground border-border hover:border-cyan-300"
                      }`}>
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">Live Readings</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Voltage",          value: `${voltage.toFixed(1)} V`,                    color: "text-cyan-600" },
                    { label: "Current",          value: running ? `${current.toFixed(2)} A` : "0.00 A", color: "text-blue-600" },
                    { label: "Anode mass",        value: `${(100 - timeElapsed * 22).toFixed(1)}%`,   color: "text-orange-600" },
                    { label: "Cathode deposit",   value: `${(timeElapsed * 22).toFixed(1)}%`,          color: "text-emerald-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-lg p-2 border border-cyan-100">
                      <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
                      <p className={`text-sm font-extrabold font-heading ${color} leading-tight`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Electrolysis progress</span>
                  <span>{(timeElapsed * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full rounded-full bg-cyan-500"
                    animate={{ width: `${timeElapsed * 100}%` }}
                    transition={{ duration: 0.3 }} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={toggleRunning}
                  disabled={timeElapsed >= 1}
                  className={`flex-1 gap-2 border-0 ${
                    running ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-cyan-600 hover:bg-cyan-700 text-white"
                  }`}>
                  {running ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> {hasRun ? "Resume" : "Start Electrolysis"}</>}
                </Button>
                <Button variant="outline" size="sm"
                  onClick={() => { setTimeElapsed(0); setRunning(false); setHasRun(false); }}
                  className="gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>

              {timeElapsed >= 1 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                  <p className="text-sm font-bold text-green-700">✓ Electrolysis complete — observe the results!</p>
                </motion.div>
              )}

              {hasRun && !running && timeElapsed > 0 && timeElapsed < 1 && (
                <p className="text-xs text-center text-muted-foreground">
                  You can continue or advance — results are visible already.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ══════════ STEP 3: OBSERVATIONS ════════════════════ */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5 p-4 flex items-center justify-center"
              style={{ minHeight: 300 }}>
              <div className="w-full">
                <ElectrolysisObservationSVG />
              </div>
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                  Step 3 of 5 — Observations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">What Did We Observe?</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    at: "At the Cathode (−)",
                    obs: "A reddish-brown deposit of copper metal forms on the surface.",
                    color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/20", dot: "bg-blue-500",
                  },
                  {
                    at: "At the Anode (+)",
                    obs: "The electrode gradually becomes thinner and lighter as copper dissolves.",
                    color: "text-red-700", bg: "bg-red-500/8", border: "border-red-500/20", dot: "bg-red-500",
                  },
                  {
                    at: "The Solution",
                    obs: "The blue colour remains almost unchanged — the CuSO₄ concentration stays nearly constant.",
                    color: "text-cyan-700", bg: "bg-cyan-500/8", border: "border-cyan-500/20", dot: "bg-cyan-500",
                  },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-xl border ${item.bg} ${item.border} flex gap-3`}>
                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${item.dot}`} />
                    <div>
                      <p className={`text-xs font-bold ${item.color}`}>{item.at}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.obs}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Key Finding</p>
                <p className="text-sm text-foreground leading-relaxed">
                  Mass is transferred from the anode to the cathode.
                  <strong> The total mass of copper in the system is conserved.</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ STEP 4: IONIC EQUATIONS ════════════════ */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border-2 border-violet-500/25 bg-gradient-to-br from-card to-violet-500/5 p-4 flex items-center justify-center"
              style={{ minHeight: 300 }}>
              <div className="w-full">
                <ElectrolysisEquationsSVG revealed={equationsRevealed} />
              </div>
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                  Step 4 of 5 — Ionic Equations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">The Ionic Equations</h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Each electrode has a half-equation describing the electron transfer.
                Click each card to reveal the equation — try to predict it first!
              </p>

              <button onClick={() => setEquationsRevealed(r => Math.max(r, 1))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  equationsRevealed >= 1
                    ? "border-blue-400 bg-blue-500/8"
                    : "border-border bg-card hover:border-blue-300"
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-700 mb-1">Cathode (−) — Reduction</p>
                    {equationsRevealed >= 1
                      ? <p className="text-base font-bold text-blue-800">Cu²⁺ + 2e⁻ → Cu (s)</p>
                      : <p className="text-sm text-muted-foreground">Click to reveal ↓</p>
                    }
                  </div>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    equationsRevealed >= 1 ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {equationsRevealed >= 1 ? "✓" : "?"}
                  </span>
                </div>
              </button>

              <button onClick={() => setEquationsRevealed(r => Math.max(r, 2))}
                disabled={equationsRevealed < 1}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  equationsRevealed >= 2
                    ? "border-red-400 bg-red-500/8"
                    : equationsRevealed >= 1
                    ? "border-border bg-card hover:border-red-300"
                    : "border-border bg-card opacity-50 cursor-not-allowed"
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-red-700 mb-1">Anode (+) — Oxidation</p>
                    {equationsRevealed >= 2
                      ? <p className="text-base font-bold text-red-800">Cu (s) → Cu²⁺ + 2e⁻</p>
                      : <p className="text-sm text-muted-foreground">
                          {equationsRevealed >= 1 ? "Click to reveal ↓" : "Reveal cathode first"}
                        </p>
                    }
                  </div>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    equationsRevealed >= 2 ? "bg-red-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {equationsRevealed >= 2 ? "✓" : "?"}
                  </span>
                </div>
              </button>

              {equationsRevealed >= 2 && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20">
                  <p className="text-xs font-bold text-cyan-700 mb-1">Overall Effect</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Copper atoms leave the anode, travel as Cu²⁺ ions through the solution,
                    and are deposited as copper metal on the cathode.
                    <strong className="text-foreground"> Net: copper is transferred from anode to cathode.</strong>
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ STEP 5: APPLICATIONS ════════════════════ */}
        {step === 5 && (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
            <div className="text-center">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 mb-2">
                Step 5 of 5 — Real World Applications
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                Applications of Electrolysis
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                The same principles you just observed are used in major industrial processes worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {APPLICATIONS.map((app, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-cyan-300 transition-all">
                  <div className="text-2xl mb-2">{app.icon}</div>
                  <p className="text-sm font-bold text-foreground mb-1">{app.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{app.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold font-heading text-center">Deepen Your Understanding</h3>
              {DISCOVERY_QS.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}>
                  <button onClick={() => toggleQ(i)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      revealedQs.includes(i)
                        ? `${item.bg} ${item.border}`
                        : "border-border bg-card hover:border-cyan-200"
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        revealedQs.includes(i) ? "bg-cyan-500 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {revealedQs.includes(i) ? "✓" : "Q"}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${item.color}`}>{item.q}</p>
                        <AnimatePresence>
                          {revealedQs.includes(i) && (
                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-sm text-muted-foreground mt-2 leading-relaxed">
                              {item.a}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ STEP 6: CONCLUSION ══════════════════════ */}
        {step === 6 && (
          <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}>
              <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold mb-3">
                Experiment Complete
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                Conclusion
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                You have successfully investigated the electrolysis of copper sulfate solution using copper electrodes.
              </p>
            </motion.div>

            <div className="w-full space-y-3 text-left">
              {[
                { heading: "Copper deposits at the cathode",   body: "Cu²⁺ ions gain 2 electrons at the negative electrode and are reduced to copper metal, building up a reddish-brown layer.",      color: "border-blue-400 bg-blue-500/5" },
                { heading: "Copper dissolves at the anode",    body: "Copper atoms lose 2 electrons at the positive electrode and are oxidised to Cu²⁺ ions that enter the solution.",                 color: "border-red-400 bg-red-500/5" },
                { heading: "Solution concentration unchanged", body: "Because copper is simultaneously consumed and produced, the concentration of CuSO₄ remains nearly constant throughout.",          color: "border-cyan-400 bg-cyan-500/5" },
                { heading: "Mass is transferred",              body: "The cathode gains mass while the anode loses mass. The total copper in the system is conserved — it merely changes location.",    color: "border-emerald-400 bg-emerald-500/5" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className={`p-4 rounded-xl border-l-4 ${item.color} border border-l-4`}>
                  <p className="text-sm font-bold text-foreground mb-1">{item.heading}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
