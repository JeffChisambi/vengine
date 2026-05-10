import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, CheckCircle2, FlaskConical } from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell from "@/components/lab/ExperimentShell";
import {
  OxygenMoleculeSVG,
  OxygenApparatusSVG,
  OxygenTestSVG,
} from "@/components/oxygen/OxygenSVG";

/* ─── Experiment metadata ─────────────────────────────────── */
const STEPS = [
  { id: "intro",      label: "Introduction" },
  { id: "setup",      label: "Apparatus"    },
  { id: "prepare",    label: "Preparation"  },
  { id: "test",       label: "Testing"      },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-emerald-500/10",
  iconColor: "text-emerald-600",
  done:      "bg-emerald-500",
  current:   "bg-emerald-400",
  label:     "text-emerald-600",
  dot:       "hsl(160,84%,39%)",
  button:    "bg-emerald-600 hover:bg-emerald-700 text-white border-0",
};

function OxygenIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none"
      stroke="currentColor" strokeWidth="2">
      <circle cx="8"  cy="12" r="4" />
      <circle cx="16" cy="12" r="4" />
      <line x1="11.2" y1="10" x2="12.8" y2="10" />
      <line x1="11.2" y1="14" x2="12.8" y2="14" />
    </svg>
  );
}

/* ─── Setup steps ─────────────────────────────────────────── */
const SETUP_STEPS = [
  { label: "Set up tripod stand, wire gauze and Bunsen burner on the bench",
    detail: "Ensure the Bunsen burner is connected to the gas tap and stable." },
  { label: "Clamp the round-bottom flask to the retort stand",
    detail: "The flask should be at a comfortable height above the gauze." },
  { label: "Fit the rubber stopper with delivery tube into the flask",
    detail: "Ensure an airtight seal — no gas should escape from the stopper." },
  { label: "Fill a pneumatic trough with water and place inverted gas jar",
    detail: "Fill the gas jar with water, invert it into the trough under water." },
];

/* ─── Test cards ──────────────────────────────────────────── */
const TESTS = [
  { id: "splint",   label: "Glowing Splint",   desc: "Insert a glowing (not burning) splint into the jar.",
    result: "The splint relights — confirming oxygen's presence.",
    color: "emerald", icon: "🔥", required: true },
  { id: "charcoal", label: "Burning Charcoal",  desc: "Introduce a glowing charcoal piece into the jar.",
    result: "Charcoal glows brightly and burns vigorously.",
    color: "amber",   icon: "⚫" },
  { id: "magnesium",label: "Burning Magnesium", desc: "Hold burning magnesium ribbon inside the jar.",
    result: "Magnesium burns with a dazzling white flame.",
    color: "sky",     icon: "✨" },
];

/* ─── Quiz questions ──────────────────────────────────────── */
const QUIZ = [
  { q: "What chemical produces oxygen when heated in the lab?",
    opts: ["NaCl", "KMnO₄", "CaCO₃", "FeSO₄"], ans: 1,
    explain: "Potassium manganate(VII) (KMnO₄) decomposes on heating: 2KMnO₄ → K₂MnO₄ + MnO₂ + O₂",
    color: "text-emerald-700", bg: "bg-emerald-500/8", border: "border-emerald-500/25" },
  { q: "How is oxygen collected in the lab?",
    opts: ["Upward displacement of air", "Downward displacement of water", "Downward displacement of air", "Downward displacement of water"],
    ans: 3,
    explain: "Oxygen is slightly denser than air and only slightly soluble in water. It is collected by downward displacement of water in an inverted gas jar placed in a pneumatic trough.",
    color: "text-teal-700", bg: "bg-teal-500/8", border: "border-teal-500/25" },
  { q: "What is the best chemical test for oxygen?",
    opts: ["Turns limewater milky", "Turns damp litmus paper red", "Relights a glowing splint", "Burns with a squeaky pop"],
    ans: 2,
    explain: "A glowing splint relights in pure oxygen. This is the standard test used in school laboratories. (A squeaky pop identifies hydrogen, not oxygen.)",
    color: "text-sky-700", bg: "bg-sky-500/8", border: "border-sky-500/25" },
  { q: "Which equation correctly shows the decomposition of hydrogen peroxide?",
    opts: ["H₂O₂ → H₂ + O₂", "2H₂O₂ → 2H₂O + O₂", "H₂O₂ → H₂O + O", "2H₂O → 2H₂ + O₂"],
    ans: 1,
    explain: "2H₂O₂ → 2H₂O + O₂. This is catalysed by manganese(IV) oxide (MnO₂) and is also used as a lab preparation method. The MnO₂ is a catalyst — it speeds up the reaction but is unchanged at the end.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25" },
];

function QuizItem({ item, index }) {
  const [chosen, setChosen] = useState(null);
  const answered = chosen !== null;
  const ok = chosen === item.ans;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`p-4 rounded-2xl border transition-all ${ok && answered ? `${item.bg} ${item.border}` : "bg-card border-border"}`}>
      <p className={`text-sm font-semibold mb-3 ${ok && answered ? item.color : "text-foreground"}`}>
        {index + 1}. {item.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {item.opts.map((opt, oi) => {
          let cls = "px-3 py-2 rounded-xl text-xs border text-left transition-all ";
          if (!answered)       cls += "bg-muted/50 border-border hover:border-emerald-300 cursor-pointer";
          else if (oi===item.ans) cls += "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 font-semibold";
          else if (oi===chosen) cls += "bg-red-500/10 border-red-500/20 text-red-600";
          else                  cls += "bg-muted/30 border-border text-muted-foreground opacity-50";
          return (
            <button key={oi} disabled={answered} onClick={() => setChosen(oi)} className={cls}>
              {oi===item.ans && answered && <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-600" />}
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            className={`mt-3 text-xs leading-relaxed p-3 rounded-xl overflow-hidden ${item.bg} ${item.color} border ${item.border}`}>
            {ok ? "✓ Correct! " : "✗ Not quite. "}{item.explain}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Experiment ─────────────────────────────────────── */
export default function OxygenExperiment() {
  /* Navigation state */
  const [setupPhase,   setSetupPhase]   = useState(0);   // 0–3 setup steps done
  const [method,       setMethod]       = useState("kmno4");
  const [heating,      setHeating]      = useState(false);
  const [progress,     setProgress]     = useState(0);   // 0–1 collection progress
  const [activeTest,   setActiveTest]   = useState("splint");
  const [relighting,   setRelighting]   = useState(false);
  const [testsRun,     setTestsRun]     = useState(new Set());
  const timerRef = useRef(null);

  const resetState = useCallback(() => {
    setSetupPhase(0); setHeating(false); setProgress(0);
    setActiveTest("splint"); setRelighting(false); setTestsRun(new Set());
    clearInterval(timerRef.current);
  }, []);

  const { step, dir, goTo, next, back, reset } =
    useExperimentNav(STEPS.length, resetState);

  /* Auto-advance collection progress while heating */
  useEffect(() => {
    if (heating && progress < 1) {
      timerRef.current = setInterval(() => {
        setProgress(p => {
          const n = p + 0.008;
          if (n >= 1) { clearInterval(timerRef.current); setHeating(false); return 1; }
          return n;
        });
      }, 80);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [heating]);

  /* canAdvance gate */
  const canAdvance = (() => {
    if (step === 1) return setupPhase >= SETUP_STEPS.length;
    if (step === 2) return progress >= 0.90;
    if (step === 3) return testsRun.has("splint");
    return true;
  })();

  /* Run a test */
  const runTest = (id) => {
    setActiveTest(id);
    setRelighting(false);
    setTimeout(() => setRelighting(true), 800);
    setTestsRun(s => new Set([...s, id]));
  };

  return (
    <ExperimentShell
      title="Preparation and Testing of Oxygen"
      subject="Chemistry · Gas Preparation · O₂"
      icon={OxygenIcon}
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
      progressVariant="full"
    >
      <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

        {/* ══════════ STEP 0: INTRODUCTION ══════════════════════ */}
        {step === 0 && (
          <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
            <motion.div initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.55 }}>
              <OxygenMoleculeSVG size={220} />
            </motion.div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700
                text-xs font-semibold mb-3">
                Chemistry · Gas Preparation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                Preparation &amp; Testing of Oxygen
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Oxygen (O₂) makes up <strong className="text-foreground">21%</strong> of Earth's atmosphere.
                Pure oxygen is vital for combustion, respiration, and industrial processes.
                In this experiment you will <strong className="text-foreground">prepare</strong> oxygen by
                heating potassium manganate(VII) or by decomposing hydrogen peroxide, <strong className="text-foreground">collect</strong>
                &nbsp;it by water displacement, and <strong className="text-foreground">test</strong> for it using a glowing splint.
              </p>
            </div>

            {/* Key facts grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {[
                { v: "O₂",       l: "Formula",        s: "diatomic molecule"      },
                { v: "21%",      l: "In atmosphere",  s: "by volume"              },
                { v: "32 g/mol", l: "Molar mass",     s: "denser than air (29)"   },
                { v: "Colourless",l:"Properties",     s: "odourless, tasteless"   },
              ].map(c => (
                <div key={c.l} className="p-3 rounded-xl bg-card border border-border text-center">
                  <p className="text-lg font-extrabold font-heading text-emerald-600">{c.v}</p>
                  <p className="text-xs font-semibold">{c.l}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.s}</p>
                </div>
              ))}
            </div>

            {/* Methods */}
            <div className="w-full p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-left space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Lab Preparation Methods</p>
              {[
                { title: "Method 1 — Heating KMnO₄",
                  eq: "2KMnO₄  →  K₂MnO₄  +  MnO₂  +  O₂" },
                { title: "Method 2 — H₂O₂ with MnO₂ catalyst",
                  eq: "2H₂O₂  →  2H₂O  +  O₂" },
              ].map(m => (
                <div key={m.title} className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-foreground">{m.title}</p>
                  <p className="font-mono text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{m.eq}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Press <strong>Next</strong> to begin assembling the apparatus.
            </p>
          </div>
        )}

        {/* ══════════ STEP 1: APPARATUS SETUP ═══════════════════ */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border-2 border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5
                p-2 flex items-center justify-center overflow-hidden"
              style={{ minHeight: 340 }}>
              <OxygenApparatusSVG phase={setupPhase} heating={false} progress={0} method={method} />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold
                  bg-emerald-500/10 text-emerald-700 mb-2">
                  Step 2 of 5 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
                  Assemble the Apparatus
                </h2>
              </div>

              {/* Method selector */}
              <div className="flex gap-2">
                {[
                  { id: "kmno4", label: "KMnO₄ (heat)" },
                  { id: "h2o2",  label: "H₂O₂ + MnO₂"  },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      method === m.id
                        ? "bg-emerald-500/12 border-emerald-400 text-emerald-700"
                        : "bg-muted/40 border-border text-muted-foreground"
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Setup checklist */}
              <div className="space-y-2">
                {SETUP_STEPS.map((s, i) => (
                  <motion.button key={i}
                    onClick={() => i <= setupPhase && setSetupPhase(i)}
                    disabled={i > setupPhase}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      i < setupPhase
                        ? "border-emerald-400 bg-emerald-500/8 opacity-80"
                        : i === setupPhase
                        ? "border-emerald-400 bg-emerald-500/8"
                        : "border-border bg-card opacity-40"
                    }`}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: i > setupPhase ? 0.4 : 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <span className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center
                      text-xs font-bold mt-0.5 ${
                        i < setupPhase ? "bg-emerald-500 text-white"
                        : i === setupPhase ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                      }`}>
                      {i < setupPhase ? "✓" : i + 1}
                    </span>
                    <div>
                      <p className={`text-sm leading-tight ${i === setupPhase ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {s.label}
                      </p>
                      {i === setupPhase && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {setupPhase < SETUP_STEPS.length ? (
                <Button onClick={() => setSetupPhase(p => Math.min(p + 1, SETUP_STEPS.length))}
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                  {setupPhase === 0 ? "Clamp Flask →"
                    : setupPhase === 1 ? "Fit Stopper & Tube →"
                    : setupPhase === 2 ? "Set Up Trough & Jar →"
                    : "Apparatus complete →"}
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 text-center">
                  <p className="text-sm font-bold text-emerald-700">
                    ✓ Apparatus assembled — ready to prepare oxygen!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ STEP 2: PREPARATION & COLLECTION ══════════ */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border-2 border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5
                p-2 flex items-center justify-center overflow-hidden"
              style={{ minHeight: 360 }}>
              <OxygenApparatusSVG phase={4} heating={heating} progress={progress} method={method} />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold
                  bg-emerald-500/10 text-emerald-700 mb-2">
                  Step 3 of 5 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
                  Prepare &amp; Collect O₂
                </h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {method === "kmno4"
                  ? "Heat the KMnO₄ gently. Purple vapour indicates heating. Oxygen is released and travels through the delivery tube, displacing water in the inverted gas jar."
                  : "The MnO₂ catalyst decomposes H₂O₂ at room temperature. Oxygen is released vigorously — no heating is needed."}
              </p>

              {/* Equation display */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Chemical Equation
                </p>
                <p className="font-mono text-xs text-emerald-700">
                  {method === "kmno4"
                    ? "2KMnO₄  →  K₂MnO₄  +  MnO₂  +  O₂↑"
                    : "2H₂O₂  →  2H₂O  +  O₂↑   [MnO₂ catalyst]"}
                </p>
              </div>

              {/* Safety notes */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                  ⚠ Safety
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {method === "kmno4"
                    ? "KMnO₄ is an oxidiser. Wear goggles & gloves. Heat gently with a blue flame. Never heat a sealed flask."
                    : "H₂O₂ (>30%) is corrosive. Wear goggles & gloves. Add MnO₂ slowly to avoid rapid gas evolution."}
                </p>
              </div>

              {/* Progress gauge */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Gas jar filling</span>
                  <span>{(progress * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.3 }} />
                </div>
                {progress >= 0.9 && (
                  <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-emerald-600 font-semibold mt-1">
                    ✓ Gas jar nearly full — oxygen collected!
                  </motion.p>
                )}
              </div>

              {/* Live observations */}
              <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                  Observations
                </p>
                <div className="space-y-1.5">
                  {[
                    { obs: "Gas bubbles form and rise in the flask",        show: progress > 0.05  },
                    { obs: "Bubbles travel through the delivery tube",       show: progress > 0.12  },
                    { obs: "Water level drops in the inverted gas jar",      show: progress > 0.20  },
                    { obs: `Flask contents turn dark brown (MnO₂ residue)`,  show: progress > 0.5 && method === "kmno4"  },
                    { obs: "Gas jar is full — seal with glass cover plate",  show: progress >= 0.98 },
                  ].map((o, i) => (
                    <AnimatePresence key={i}>
                      {o.show && (
                        <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                          className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-emerald-500 mt-0.5 shrink-0">▸</span>
                          <span>{o.obs}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setHeating(h => !h)}
                  disabled={progress >= 1}
                  className={`flex-1 gap-2 border-0 ${
                    heating
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  } disabled:opacity-40`}>
                  {heating
                    ? <><Pause className="w-4 h-4" /> {method==="kmno4" ? "Stop heating" : "Stop reaction"}</>
                    : <><Play  className="w-4 h-4" /> {method==="kmno4" ? "Start heating" : "Add MnO₂ catalyst"}</>}
                </Button>
                <Button variant="outline" size="icon" className="w-10 h-10"
                  onClick={() => { setProgress(0); setHeating(false); }}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ STEP 3: TESTING ════════════════════════════ */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border-2 border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5
                p-4 flex items-center justify-center"
              style={{ minHeight: 320 }}>
              <OxygenTestSVG testType={activeTest} relighting={relighting} />
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold
                  bg-emerald-500/10 text-emerald-700 mb-2">
                  Step 4 of 5 — Interactive
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
                  Testing for Oxygen
                </h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Perform the tests below. The <strong className="text-foreground">glowing splint test</strong> is
                the definitive laboratory test for oxygen. Complete it first.
              </p>

              <div className="space-y-2">
                {TESTS.map(t => (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      activeTest === t.id
                        ? `border-${t.color}-400 bg-${t.color}-500/8`
                        : "border-border bg-card"
                    }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold">{t.label}</p>
                          {t.required && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/12
                              text-emerald-700 font-bold border border-emerald-500/20">REQUIRED</span>
                          )}
                          {testsRun.has(t.id) && (
                            <span className="ml-auto text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                      </div>
                    </div>
                    {/* Result if run */}
                    {testsRun.has(t.id) && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        className="mt-2 ml-9 p-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20
                          text-xs text-emerald-700 overflow-hidden">
                        ✓ {t.result}
                      </motion.div>
                    )}
                    <Button size="sm"
                      onClick={() => runTest(t.id)}
                      className={`mt-2 ml-9 text-xs gap-1 border-0 ${
                        activeTest === t.id && relighting
                          ? "bg-emerald-500 text-white"
                          : `bg-${t.color}-600 hover:bg-${t.color}-700 text-white`
                      }`}>
                      <Play className="w-3 h-3" />
                      {testsRun.has(t.id) ? "Re-run test" : "Perform test"}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {testsRun.has("splint") && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 text-center">
                  <p className="text-sm font-bold text-emerald-700">
                    ✓ Oxygen confirmed — proceed to conclusions!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ STEP 4: CONCLUSION ═════════════════════════ */}
        {step === 4 && (
          <div className="flex flex-col gap-6 items-center max-w-3xl mx-auto w-full">
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700
                text-xs font-semibold mb-3">
                Conclusion
              </span>
              <h2 className="text-2xl font-extrabold font-heading mb-2">What Did We Discover?</h2>
              <p className="text-muted-foreground text-sm">
                Review the key equations, properties and applications of oxygen.
              </p>
            </div>

            {/* Equations card */}
            <div className="w-full p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                Chemical Equations
              </p>
              <div className="space-y-3">
                {[
                  { label: "Heating KMnO₄",      eq: "2KMnO₄  →  K₂MnO₄  +  MnO₂  +  O₂",   color: "text-violet-600" },
                  { label: "H₂O₂ decomposition",  eq: "2H₂O₂  →  2H₂O  +  O₂   [MnO₂ cat.]", color: "text-sky-600"    },
                  { label: "Combustion of carbon", eq: "C  +  O₂  →  CO₂",                      color: "text-orange-600" },
                  { label: "Combustion of Mg",     eq: "2Mg  +  O₂  →  2MgO",                   color: "text-amber-600"  },
                ].map(e => (
                  <div key={e.label} className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-muted-foreground w-36 shrink-0">{e.label}</span>
                    <code className={`text-sm font-mono font-bold ${e.color}`}>{e.eq}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties grid */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Colour",      val: "Colourless",        icon: "🔵" },
                { label: "Smell",       val: "Odourless",         icon: "👃" },
                { label: "Density",     val: "Denser than air",   icon: "⚖️"  },
                { label: "Solubility",  val: "Slightly soluble",  icon: "💧" },
                { label: "Supports…",  val: "Combustion",        icon: "🔥" },
                { label: "Test",        val: "Relights splint",   icon: "✅" },
              ].map(p => (
                <motion.div key={p.label}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-card border border-border text-center">
                  <span className="text-xl">{p.icon}</span>
                  <p className="text-xs font-bold mt-1.5">{p.val}</p>
                  <p className="text-[10px] text-muted-foreground">{p.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Real-world applications */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { emoji: "🏥", title: "Medicine",      desc: "Oxygen therapy for respiratory conditions and surgery." },
                { emoji: "🚀", title: "Rocketry",      desc: "Liquid O₂ (LOX) is the oxidiser in rocket engines."    },
                { emoji: "⚙️",  title: "Steelmaking",   desc: "Pure O₂ is blown into molten iron to remove carbon."   },
                { emoji: "🌊", title: "Aquatic life",  desc: "Dissolved O₂ in water sustains fish and aquatic life."  },
              ].map(r => (
                <div key={r.title} className="p-3 rounded-xl bg-card border border-border text-center">
                  <span className="text-2xl">{r.emoji}</span>
                  <p className="text-xs font-bold mt-1.5 mb-0.5">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            {/* Quiz */}
            <div className="w-full space-y-4">
              <p className="text-sm font-bold font-heading">Test Your Understanding</p>
              {QUIZ.map((q, i) => <QuizItem key={i} item={q} index={i} />)}
            </div>
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
