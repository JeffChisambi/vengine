import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, RotateCcw, FlaskConical, Play, Pause,
  Droplets, Microscope, BarChart3, CheckCircle2, Zap, AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  TitrationIntroSVG, SetupSVG, IndicatorDropSVG,
  TitrationViewSVG, MolecularSVG, PHCurveSVG, EndpointSVG,
  getFlaskColor, getPH,
} from "@/components/titration/TitrationSVG";

/* ─── Slide variants ────────────────────────────────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

/* ─── Experiment constants ──────────────────────────────────────────── */
const V_ENDPOINT = 23.5;   // mL of NaOH at exact neutralisation
const V_HCL = 25.0;        // mL of HCl in flask (pipetted)
const C_NAOH = 0.1;        // known concentration of NaOH (mol/L)
// Expected: C(HCl) = (0.1 × 23.5) / 25 = 0.094 mol/L

/* ─── Step definitions ──────────────────────────────────────────────── */
const STEPS = [
  { label: "Intro",       tag: "Overview",   icon: FlaskConical },
  { label: "Apparatus",   tag: "Step 1",     icon: FlaskConical },
  { label: "Indicator",   tag: "Step 2",     icon: Droplets },
  { label: "Titration",   tag: "Step 3",     icon: Zap },
  { label: "Endpoint",    tag: "Step 4",     icon: CheckCircle2 },
  { label: "Molecules",   tag: "Step 5",     icon: Microscope },
  { label: "pH Data",     tag: "Step 6",     icon: BarChart3 },
  { label: "Discovery",   tag: "Step 7",     icon: CheckCircle2 },
  { label: "Conclusion",  tag: "Complete",   icon: CheckCircle2 },
];
const TOTAL_STEPS = STEPS.length;

/* ─── Discovery questions ───────────────────────────────────────────── */
const DISCOVERY_QS = [
  {
    q: "Why did the colour suddenly remain in the flask?",
    a: "At the equivalence point all the H⁺ ions from the acid have been neutralised by OH⁻ from the base. With no more acid to decolourise the indicator, the pink colour persists permanently.",
    color: "text-pink-700", bg: "bg-pink-500/8", border: "border-pink-500/25",
  },
  {
    q: "What happened to the acid particles near the endpoint?",
    a: "The concentration of H⁺ ions dropped sharply — each added drop of NaOH neutralises a large fraction of the remaining acid. The molecular view shows this as H⁺ particles disappearing and water molecules forming.",
    color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/25",
  },
  {
    q: "Why does the pH curve rise so steeply near the equivalence point?",
    a: "Near equivalence the acid is nearly exhausted. Each tiny addition of base has a huge effect on [H⁺], causing the pH to jump by several units — even with a fraction of a drop.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25",
  },
  {
    q: "How does the volume of NaOH help us find the concentration of HCl?",
    a: "At equivalence: moles HCl = moles NaOH → C(HCl) × V(HCl) = C(NaOH) × V(NaOH). Since we know three values, we can solve for the unknown concentration of HCl.",
    color: "text-teal-700", bg: "bg-teal-500/8", border: "border-teal-500/25",
  },
  {
    q: "Why is it critical NOT to overshoot the endpoint?",
    a: "If excess NaOH is added, the calculated volume is too large, giving an HCl concentration that is too high. Precision at the endpoint — ideally a single half-drop — is essential for an accurate result.",
    color: "text-amber-700", bg: "bg-amber-500/8", border: "border-amber-500/25",
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function TitrationExperiment() {
  /* navigation */
  const [step, setStep]           = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoPlay, setAutoPlay]   = useState(false);

  /* step 1 — apparatus setup */
  const [setupPhase, setSetupPhase] = useState(0); // 0-3

  /* step 2 — indicator */
  const [indicator, setIndicator]           = useState("phenolphthalein");
  const [indicatorDropped, setIndicatorDropped] = useState(false);

  /* step 3 — titration */
  const [neutralization, setNeutralization] = useState(0);
  const [volumeAdded, setVolumeAdded]       = useState(0);
  const [dropKey, setDropKey]               = useState(0);
  const [flashIntensity, setFlashIntensity] = useState(0);
  const [endpointReached, setEndpointReached] = useState(false);
  const [overshot, setOvershot]             = useState(false);
  const [isHolding, setIsHolding]           = useState(false);
  const [pHData, setPHData]                 = useState([]);
  const holdRef = useRef(null);
  const flashRef = useRef(null);

  /* step 7 — discovery */
  const [revealedQs, setRevealedQs] = useState([]);

  /* ── Derived ────────────────────────────────────────────────────── */
  const concentration = endpointReached
    ? parseFloat(((C_NAOH * volumeAdded) / V_HCL).toFixed(4))
    : 0;

  /* ── Helpers ────────────────────────────────────────────────────── */
  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };
  const handleNext = () => { if (step < TOTAL_STEPS - 1) goTo(step + 1); };
  const handleBack = () => { if (step > 0) goTo(step - 1); };

  const handleReset = () => {
    setAutoPlay(false); setStep(0); setDirection(1);
    setSetupPhase(0); setIndicator("phenolphthalein"); setIndicatorDropped(false);
    setNeutralization(0); setVolumeAdded(0); setDropKey(0);
    setFlashIntensity(0); setEndpointReached(false); setOvershot(false);
    setPHData([]); setRevealedQs([]);
    clearInterval(holdRef.current);
    clearTimeout(flashRef.current);
  };

  /* ── Add a drop ─────────────────────────────────────────────────── */
  const addDrop = useCallback((size = "coarse") => {
    setVolumeAdded((prev) => {
      const amount = size === "coarse"
        ? 0.45 + Math.random() * 0.25
        : 0.04 + Math.random() * 0.04;
      const next = Math.min(prev + amount, 28);   // allow overshoot

      const newNeutr = next / V_ENDPOINT;
      const newFlash = newNeutr > 0.8
        ? Math.min(1, (newNeutr - 0.8) * 5)
        : 0.3;

      setNeutralization(newNeutr);
      setDropKey((k) => k + 1);
      setFlashIntensity(newFlash);

      setPHData((pts) => {
        const pH = getPH(next);
        return [...pts, { v: parseFloat(next.toFixed(2)), pH }];
      });

      if (newNeutr >= 1.0) {
        setEndpointReached(true);
        if (newNeutr > 1.08) setOvershot(true);
      }

      return next;
    });
  }, []);

  /* ── Flash decay ────────────────────────────────────────────────── */
  useEffect(() => {
    if (flashIntensity > 0) {
      flashRef.current = setTimeout(
        () => setFlashIntensity((f) => Math.max(0, f - 0.12)),
        80,
      );
      return () => clearTimeout(flashRef.current);
    }
  }, [flashIntensity]);

  /* ── Hold-to-drip (coarse) ──────────────────────────────────────── */
  const startHold = () => {
    if (endpointReached) return;
    setIsHolding(true);
    addDrop("coarse");
    holdRef.current = setInterval(() => addDrop("coarse"), 700);
  };
  const stopHold = () => {
    setIsHolding(false);
    clearInterval(holdRef.current);
  };

  useEffect(() => () => {
    clearInterval(holdRef.current);
    clearTimeout(flashRef.current);
  }, []);

  /* ── Auto-play (skips interactive steps) ───────────────────────── */
  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL_STEPS - 1) { setAutoPlay(false); return; }
    const interactive = new Set([1, 2, 3]);
    if (interactive.has(step)) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 4000);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  /* ── Can advance gate ───────────────────────────────────────────── */
  const canAdvance = (() => {
    if (step === 1) return setupPhase >= 3;
    if (step === 2) return indicatorDropped;
    if (step === 3) return endpointReached;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const nearEndpoint = neutralization > 0.85 && !endpointReached;
  const buretteMode = nearEndpoint ? "fine" : "coarse";

  /* ─── Render ──────────────────────────────────────────────────── */
  return (
    <div className="h-screen flex flex-col bg-background font-body overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="shrink-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">
                  Acid–Base Titration
                </h1>
                <p className="text-xs text-muted-foreground">Chemistry · Quantitative Analysis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`gap-1.5 text-xs ${autoPlay ? "border-cyan-500 text-cyan-600" : ""}`}>
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {autoPlay ? "Pause" : "Auto"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Step progress bar ──────────────────────────────────────── */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="shrink-0 bg-background border-b border-border px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5">
            {STEPS.slice(1, -1).map((s, i) => (
              <button key={i} onClick={() => goTo(i + 1)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 < step ? "bg-cyan-400" : i + 1 === step ? "bg-cyan-500" : "bg-muted"
                }`} />
            ))}
          </div>
          <div className="max-w-5xl mx-auto flex justify-between mt-1">
            {STEPS.slice(1, -1).map((s, i) => (
              <span key={i} className={`text-[9px] font-medium flex-1 text-center transition-colors ${
                i + 1 === step ? "text-cyan-600" : "text-muted-foreground/40"
              }`}>{s.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Slide area ─────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div key={step} custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto">
            <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

              {/* ══════════ STEP 0: INTRO ══════════════════════════ */}
              {step === 0 && (
                <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}>
                    <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                      <FlaskConical className="w-10 h-10 text-cyan-600" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-semibold mb-3">
                      Chemistry · Titration
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                      Acid–Base Titration
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      A precisely measured volume of NaOH is slowly added to an HCl solution of unknown concentration.
                      An indicator changes colour at the <strong className="text-foreground">exact moment</strong> of
                      neutralisation — letting you calculate the unknown concentration like a real chemist.
                    </p>
                  </motion.div>

                  <div className="w-full max-w-xs mx-auto h-56">
                    <TitrationIntroSVG />
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[
                      { label: "Known",   value: "NaOH",  sub: "0.1 mol L⁻¹" },
                      { label: "Unknown", value: "HCl",   sub: "concentration" },
                      { label: "Signal",  value: "Pink",  sub: "phenolphthalein" },
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
                      "If acids and bases react in exact proportions, and I know the concentration of one — can I discover
                      <strong className="text-foreground"> the concentration of the other by measuring volume at the endpoint?</strong>"
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">Press <strong>Next</strong> or <strong>Auto</strong> to begin. Interactive steps require your action.</p>
                </div>
              )}

              {/* ══════════ STEP 1: APPARATUS SETUP ═══════════════ */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-cyan-500/25 bg-gradient-to-br from-card to-cyan-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 320 }}>
                    <div className="w-full max-w-xs">
                      <SetupSVG phase={setupPhase} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-2">
                        Step 1 of 7 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Prepare the Apparatus</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Set up the titration workstation step-by-step.
                      <strong className="text-foreground"> Every step matters</strong> — contamination,
                      improper rinsing, or air bubbles will give inaccurate results.
                    </p>

                    {/* Step checklist */}
                    <div className="space-y-2">
                      {[
                        { label: "Clamp burette vertically to retort stand", phase: 0 },
                        { label: "Rinse burette with NaOH — then fill to 0.00 mL", phase: 1 },
                        { label: "Pipette exactly 25.00 mL of HCl into conical flask", phase: 2 },
                        { label: "Apparatus assembled and ready", phase: 3 },
                      ].map((item, i) => (
                        <motion.button
                          key={i}
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
                          whileHover={setupPhase === i ? { scale: 1.01 } : {}}
                        >
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
                      <Button onClick={() => setSetupPhase((p) => Math.min(p + 1, 3))}
                        className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                        {setupPhase === 0 ? "Clamp Burette →" :
                         setupPhase === 1 ? "Fill Burette →" :
                         setupPhase === 2 ? "Pipette HCl →" : "Done"}
                      </Button>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">✓ Apparatus ready — proceed to add indicator!</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ STEP 2: INDICATOR ══════════════════════ */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-pink-500/25 bg-gradient-to-br from-card to-pink-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 320 }}>
                    <div className="w-full max-w-xs">
                      <IndicatorDropSVG dropped={indicatorDropped} indicator={indicator} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-700 mb-2">
                        Step 2 of 7 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Add the Indicator</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The indicator is a weak acid/base that changes colour at a specific pH.
                      It acts as a <strong className="text-foreground">chemical signal</strong> —
                      revealing the exact moment of neutralisation without interrupting the reaction.
                    </p>

                    {/* Indicator selector */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Choose indicator</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "phenolphthalein", label: "Phenolphthalein", change: "Colourless → Pink", range: "pH 8.3–10" },
                          { id: "methyl_orange",   label: "Methyl Orange",   change: "Orange → Yellow",  range: "pH 3.1–4.4" },
                        ].map((ind) => (
                          <button key={ind.id}
                            onClick={() => { if (!indicatorDropped) setIndicator(ind.id); }}
                            disabled={indicatorDropped}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                              indicator === ind.id
                                ? "border-pink-400 bg-pink-500/8"
                                : "border-border bg-card hover:border-pink-300"
                            }`}>
                            <p className="text-xs font-bold text-foreground">{ind.label}</p>
                            <p className="text-[10px] text-pink-700 mt-0.5">{ind.change}</p>
                            <p className="text-[10px] text-muted-foreground">{ind.range}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {!indicatorDropped ? (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        <Button onClick={() => setIndicatorDropped(true)}
                          className="w-full gap-2 bg-pink-600 hover:bg-pink-700 text-white py-5 rounded-2xl">
                          <Droplets className="w-4 h-4" />
                          Add 3 Drops of Indicator →
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-pink-500/8 border border-pink-500/25 text-center">
                        <p className="text-sm font-bold text-pink-700">
                          ✓ Indicator added — the flask is ready. Begin titration!
                        </p>
                      </motion.div>
                    )}

                    <div className="p-3 rounded-xl bg-card border border-border">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Why only 2–3 drops?</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Too much indicator can consume acid/base itself, shifting the endpoint slightly.
                        A minimal amount gives the clearest colour change with the least interference.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════ STEP 3: TITRATION ══════════════════════ */}
              {step === 3 && (
                <div className="flex flex-col gap-4 w-full">
                  {/* Suspense banner */}
                  {nearEndpoint && !endpointReached && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/35 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <p className="text-sm font-bold text-amber-700">
                        Getting close! Colour flashes are lasting longer — switch to fine drops. One extra may overshoot!
                      </p>
                    </motion.div>
                  )}
                  {endpointReached && !overshot && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/35 flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                      <p className="text-sm font-bold text-pink-700">
                        ✦ Endpoint! The pale pink persists — perfect. Click Next to see the results.
                      </p>
                    </motion.div>
                  )}
                  {overshot && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="p-3 rounded-xl bg-red-500/8 border border-red-500/25 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <p className="text-xs text-red-700 font-medium">
                        Overshot slightly — the deep pink shows excess NaOH was added. In a real lab, this run would be repeated.
                      </p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
                    {/* Main apparatus */}
                    <div className="lg:col-span-2 rounded-3xl border-2 border-cyan-500/25 bg-gradient-to-br from-card to-cyan-500/5 p-3 flex items-center justify-center" style={{ minHeight: 360 }}>
                      <div className="w-full max-w-[240px]">
                        <TitrationViewSVG
                          neutralization={neutralization}
                          dropKey={dropKey}
                          volumeAdded={volumeAdded}
                          flashIntensity={flashIntensity}
                          indicator={indicator}
                          endpointReached={endpointReached}
                        />
                      </div>
                    </div>

                    {/* Controls + molecular */}
                    <div className="lg:col-span-3 space-y-4">
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 mb-1">
                          Step 3 of 7 — The Heart of the Experiment
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold font-heading">Run the Titration</h2>
                      </div>

                      {/* Mode indicator */}
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        nearEndpoint ? "border-amber-400 bg-amber-500/8" : "border-cyan-400/30 bg-cyan-500/5"
                      }`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold uppercase tracking-wider ${nearEndpoint ? "text-amber-700" : "text-cyan-700"}`}>
                            {nearEndpoint ? "⚠ PRECISION MODE — Fine drops only!" : buretteMode === "coarse" ? "Coarse mode — hold to drip" : "Precision mode"}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            nearEndpoint ? "bg-amber-500 text-white" : "bg-cyan-500 text-white"
                          }`}>
                            {neutralization < 0.5 ? "Far from endpoint" :
                             neutralization < 0.8 ? "Approaching endpoint" :
                             neutralization < 1.0 ? "⚡ Near endpoint!" : "✓ Endpoint reached"}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-2.5 rounded-full bg-muted overflow-hidden">
                          <motion.div className={`h-full rounded-full transition-colors duration-500 ${
                            endpointReached ? "bg-pink-500" :
                            neutralization > 0.8 ? "bg-amber-500" : "bg-cyan-500"
                          }`}
                            animate={{ width: `${Math.min(neutralization * 100, 100)}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Neutralisation: {Math.min(neutralization * 100, 100).toFixed(1)}%
                        </p>
                      </div>

                      {/* Drop buttons */}
                      {!endpointReached && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
                            disabled={neutralization > 0.85}
                            className={`gap-2 py-5 rounded-2xl font-bold select-none transition-all ${
                              isHolding ? "bg-cyan-700 scale-95" : "bg-cyan-600 hover:bg-cyan-700"
                            } text-white ${neutralization > 0.85 ? "opacity-40 cursor-not-allowed" : ""}`}>
                            <Droplets className="w-4 h-4" />
                            {isHolding ? "Dripping…" : "Hold — Coarse drip"}
                          </Button>
                          <Button
                            onClick={() => addDrop("fine")}
                            className="gap-2 py-5 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600 text-white">
                            <Droplets className="w-3.5 h-3.5" />
                            Fine Drop (+0.05 mL)
                          </Button>
                        </div>
                      )}

                      {/* Volume readout */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { label: "Vol added", value: `${volumeAdded.toFixed(2)} mL`, color: "text-cyan-600" },
                          { label: "pH", value: getPH(volumeAdded).toFixed(2), color: endpointReached ? "text-green-600" : neutralization > 0.9 ? "text-amber-600" : "text-red-500" },
                          { label: "Neutralised", value: `${Math.min(neutralization * 100, 100).toFixed(1)}%`, color: "text-violet-600" },
                        ].map((s) => (
                          <div key={s.label} className="p-2 rounded-xl bg-card border border-border">
                            <motion.p className={`text-lg font-extrabold font-heading ${s.color}`}
                              animate={{ scale: dropKey > 0 ? [1, 1.1, 1] : 1 }}
                              transition={{ duration: 0.25 }}>
                              {s.value}
                            </motion.p>
                            <p className="text-[10px] text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Mini molecular view */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Molecular View</p>
                        <div className="h-36">
                          <MolecularSVG neutralization={neutralization} />
                        </div>
                      </div>

                      {endpointReached && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-xl bg-pink-500/8 border border-pink-500/25 text-center">
                          <p className="text-sm font-bold text-pink-700 mb-1">Volume at endpoint: {volumeAdded.toFixed(2)} mL NaOH</p>
                          <p className="text-xs text-muted-foreground">Click Next → to calculate the concentration.</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════ STEP 4: ENDPOINT ═══════════════════════ */}
              {step === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-card to-pink-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}>
                    <div className="w-full max-w-xs">
                      <EndpointSVG concentration={concentration} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-700 mb-2">
                        Step 4 of 7 — Endpoint Achieved
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
                        Neutralisation Complete!
                      </h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The pale pink colour persisted — exactly {volumeAdded.toFixed(2)} mL of NaOH
                      was required to neutralise the HCl. Now calculate the unknown concentration.
                    </p>

                    {/* Calculation */}
                    <div className="p-4 rounded-2xl bg-card border-2 border-cyan-500/25 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Calculation</p>
                      <div className="space-y-1.5 font-mono">
                        {[
                          { label: "C(NaOH)", value: `${C_NAOH} mol L⁻¹`, color: "text-blue-600" },
                          { label: "V(NaOH)", value: `${volumeAdded.toFixed(2)} mL`, color: "text-blue-600" },
                          { label: "V(HCl)",  value: `${V_HCL.toFixed(2)} mL`,      color: "text-red-500" },
                          { label: "─────────────────", value: "", color: "text-muted-foreground" },
                          { label: "C(HCl) = C(NaOH) × V(NaOH) / V(HCl)", value: "", color: "text-muted-foreground", small: true },
                          { label: "C(HCl)", value: `${concentration} mol L⁻¹`, color: "text-pink-600", bold: true },
                        ].map((row, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex justify-between items-center ${row.small ? "opacity-60" : ""}`}>
                            <span className={`text-xs ${row.small ? "text-muted-foreground" : "text-foreground"}`}>{row.label}</span>
                            {row.value && <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {overshot && (
                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <p className="text-xs text-amber-700 font-medium">
                          <strong>Note:</strong> A slight overshoot means V(NaOH) is a fraction too high,
                          giving a concentration slightly above the true value. In practice, titrations are
                          repeated and the mean of concordant results is used.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ STEP 5: MOLECULAR VIEW ════════════════ */}
              {step === 5 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-violet-500/25 bg-gradient-to-br from-slate-900/30 to-violet-900/10 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}>
                    <div className="w-full max-w-xs">
                      <MolecularSVG neutralization={1.0} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                        Step 5 of 7 — Atomic Scale
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">What Happened at the Molecular Level?</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      At the equivalence point, every H⁺ ion from the acid has been paired with an OH⁻ ion from the base,
                      forming <strong className="text-foreground">water</strong> — and nothing else.
                    </p>

                    <div className="p-4 rounded-2xl bg-card border border-border font-mono text-center">
                      <p className="text-sm font-bold text-foreground">
                        H⁺ <span className="text-red-500">(aq)</span> + OH⁻ <span className="text-blue-500">(aq)</span>
                        {" → "}
                        <span className="text-cyan-600">H₂O (l)</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">neutralisation reaction at the equivalence point</p>
                    </div>

                    <div className="space-y-2">
                      {[
                        { before: "Before endpoint", desc: "Excess H⁺ ions present. Acid dominates. pH below 7.", color: "text-red-600", dot: "bg-red-500" },
                        { before: "At endpoint", desc: "H⁺ and OH⁻ in equal moles. pH ≈ 7. Indicator changes colour permanently.", color: "text-green-600", dot: "bg-green-500" },
                        { before: "After endpoint", desc: "Excess OH⁻ ions present. Solution basic. pH above 7.", color: "text-blue-600", dot: "bg-blue-500" },
                      ].map((row, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                          <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${row.dot}`} />
                          <div>
                            <p className={`text-xs font-bold ${row.color}`}>{row.before}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{row.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════ STEP 6: pH CURVE ═══════════════════════ */}
              {step === 6 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-slate-700/50 bg-gradient-to-br from-slate-900/40 to-slate-800/20 p-4 flex flex-col gap-4 items-center justify-center"
                    style={{ minHeight: 300 }}>
                    <div className="w-full max-w-xs">
                      <PHCurveSVG dataPoints={pHData} currentV={volumeAdded} endpointV={V_ENDPOINT} />
                    </div>
                    <div className="w-full max-w-xs">
                      <MolecularSVG neutralization={1.0} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 mb-2">
                        Step 6 of 7 — Data Analysis
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">The pH Curve</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The S-shaped (sigmoidal) titration curve is the signature of a strong acid–strong base
                      titration. Notice the <strong className="text-foreground">vertical jump</strong> at {V_ENDPOINT} mL —
                      this is where a single drop causes a multi-unit pH shift.
                    </p>

                    <div className="space-y-3">
                      {[
                        { label: "Initial pH", val: `~${getPH(0).toFixed(1)}`, note: "Strong acid, very low pH", color: "text-red-600", bg: "bg-red-500/8 border-red-500/25" },
                        { label: "Equivalence Point", val: `~7.0 at ${V_ENDPOINT} mL`, note: "Sharp vertical rise — the endpoint", color: "text-green-600", bg: "bg-green-500/8 border-green-500/25" },
                        { label: "After Endpoint", val: `pH ~${getPH(30).toFixed(1)}`, note: "Excess NaOH, strongly basic", color: "text-blue-600", bg: "bg-blue-500/8 border-blue-500/25" },
                      ].map((row, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className={`flex items-center gap-3 p-3 rounded-xl border ${row.bg}`}>
                          <div className="flex-1">
                            <p className={`text-xs font-bold ${row.color}`}>{row.label}</p>
                            <p className="text-xs text-muted-foreground">{row.note}</p>
                          </div>
                          <span className={`text-sm font-bold font-heading ${row.color}`}>{row.val}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Concentration result */}
                    <div className="p-4 rounded-2xl bg-cyan-500/5 border-2 border-cyan-500/25 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-1">Determined Concentration</p>
                      <p className="text-2xl font-extrabold font-heading text-cyan-600">
                        [HCl] = {concentration} mol L⁻¹
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Based on {volumeAdded.toFixed(2)} mL NaOH at endpoint</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════ STEP 7: DISCOVERY ═══════════════════════ */}
              {step === 7 && (
                <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 text-xs font-semibold mb-3">
                      Step 7 of 7 — Discovery Learning
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Think Like a Chemist</h2>
                    <p className="text-sm text-muted-foreground">Reason from your observations before revealing each answer.</p>
                  </div>

                  <div className="space-y-3">
                    {DISCOVERY_QS.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}>
                        <button onClick={() => toggleQ(i)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                            revealedQs.includes(i) ? `${item.border} ${item.bg}` : "border-border bg-card hover:border-cyan-300"
                          }`}>
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 text-lg font-extrabold font-heading shrink-0 ${item.color}`}>{i + 1}.</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">{item.q}</p>
                              <AnimatePresence>
                                {revealedQs.includes(i) && (
                                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`text-xs mt-2 leading-relaxed ${item.color}`}>
                                    {item.a}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`text-xs font-medium shrink-0 ${item.color}`}>
                              {revealedQs.includes(i) ? "▲ Hide" : "▼ Reveal"}
                            </span>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {revealedQs.length === DISCOVERY_QS.length && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-cyan-500/8 border border-cyan-500/25 text-center">
                      <p className="text-sm font-bold text-cyan-700">All questions explored — proceed to the conclusion!</p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ══════════ STEP 8: CONCLUSION ═════════════════════ */}
              {step === 8 && (
                <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-semibold mb-3">
                      ✅ Experiment Complete
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Conclusion</h2>
                    <p className="text-sm text-muted-foreground">What this experiment proved about acid-base chemistry.</p>
                  </div>

                  {/* Final result card */}
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-3xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-cyan-500/5 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-pink-700 mb-2">Your Result</p>
                    <p className="text-4xl font-extrabold font-heading text-pink-600 mb-1">{concentration} mol L⁻¹</p>
                    <p className="text-sm text-muted-foreground">Concentration of HCl determined by titration</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Using {volumeAdded.toFixed(2)} mL of {C_NAOH} mol L⁻¹ NaOH against {V_HCL} mL HCl
                      </p>
                    </div>
                  </motion.div>

                  {/* Procedure chain */}
                  <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Titration Process</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {[
                        { label: "Assemble apparatus",   c: "bg-slate-100 text-slate-800 border-slate-200" },
                        { label: "→",  c: "text-muted-foreground border-transparent" },
                        { label: "Fill burette with NaOH", c: "bg-blue-100 text-blue-800 border-blue-200" },
                        { label: "→",  c: "text-muted-foreground border-transparent" },
                        { label: "Pipette HCl + indicator", c: "bg-pink-100 text-pink-800 border-pink-200" },
                        { label: "→",  c: "text-muted-foreground border-transparent" },
                        { label: "Titrate to endpoint", c: "bg-amber-100 text-amber-800 border-amber-200" },
                        { label: "→",  c: "text-muted-foreground border-transparent" },
                        { label: "Record volume", c: "bg-cyan-100 text-cyan-800 border-cyan-200" },
                        { label: "→",  c: "text-muted-foreground border-transparent" },
                        { label: "Calculate [HCl] ✓", c: "bg-green-100 text-green-800 border-green-200" },
                      ].map((item, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${item.c}`}>{item.label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Key skills */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: "Stoichiometry",   detail: "Acids and bases react in exact molar ratios.", icon: "⚗️", color: "border-violet-500/25 bg-violet-500/5" },
                      { title: "Endpoint detection", detail: "A permanent colour change signals neutralisation.", icon: "🎯", color: "border-pink-500/25 bg-pink-500/5" },
                      { title: "Precision",       detail: "Technique and careful observation determine accuracy.", icon: "📏", color: "border-amber-500/25 bg-amber-500/5" },
                      { title: "Quantitative analysis", detail: "Unknown concentrations can be found experimentally.", icon: "🧮", color: "border-cyan-500/25 bg-cyan-500/5" },
                    ].map((card) => (
                      <motion.div key={card.title}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-3 ${card.color}`}>
                        <p className="text-xl mb-1">{card.icon}</p>
                        <p className="font-bold text-sm font-heading text-foreground">{card.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{card.detail}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="p-5 rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/5 text-center">
                    <p className="text-lg font-extrabold font-heading text-cyan-700 mb-2">
                      "I can determine an unknown concentration by carefully balancing a chemical reaction."
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Titration is one of chemistry's most precise quantitative techniques.
                      The same principle powers pharmaceutical quality control, water treatment, and clinical analysis worldwide.
                    </p>
                  </motion.div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav ─────────────────────────────────────────────── */}
      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 0} className="gap-2 min-w-[90px]">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div key={i}
                animate={{ width: i === step ? 20 : 8, backgroundColor: i === step ? "#0891b2" : "hsl(220,14%,85%)" }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={handleNext} disabled={!canAdvance}
              className="gap-2 min-w-[90px] bg-cyan-600 hover:bg-cyan-700 text-white">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleReset}
              className="gap-2 min-w-[90px] bg-cyan-600 hover:bg-cyan-700 text-white">
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
