import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, RotateCcw, Play, Pause,
  CheckCircle2, BookOpen, BarChart3, Layers, Droplets,
  FlaskConical, Microscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  SoilIntroSVG,
  SoilJarSVG,
  SoilObservationSVG,
  SOIL_DATA,
} from "@/components/soil/SoilSVG";

/* ─── Slide variants ──────────────────────────────────────────── */
const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

/* ─── Steps ───────────────────────────────────────────────────── */
const STEPS = [
  { label: "Intro",      tag: "Overview",  icon: FlaskConical },
  { label: "Add Soil",   tag: "Step 1",    icon: Layers },
  { label: "Add Water",  tag: "Step 2",    icon: Droplets },
  { label: "Settling",   tag: "Step 3",    icon: BarChart3 },
  { label: "Observe",    tag: "Step 4",    icon: Microscope },
  { label: "Classify",   tag: "Step 5",    icon: BookOpen },
  { label: "Conclusion", tag: "Complete",  icon: CheckCircle2 },
];
const TOTAL = STEPS.length;

/* ─── Soil selector options ───────────────────────────────────── */
const SOIL_OPTIONS = [
  { key: "sandy", emoji: "🟡" },
  { key: "clay",  emoji: "🟣" },
  { key: "loamy", emoji: "🟢" },
  { key: "silty", emoji: "🔵" },
];

/* ─── Quiz questions ──────────────────────────────────────────── */
const QUIZ = [
  {
    q: "Which particle type settles to the bottom fastest?",
    opts: ["Sand", "Silt", "Clay"],
    ans: 0,
    exp: "Sand particles are the largest and heaviest. According to Stokes' Law, larger particles experience greater gravitational force relative to drag, so they sink first.",
  },
  {
    q: "Which soil type retains the most water?",
    opts: ["Sandy soil", "Loamy soil", "Clay soil", "Silty soil"],
    ans: 2,
    exp: "Clay particles are the smallest and pack tightly together, creating tiny pores that hold water by capillary action. Sandy soil has large pores that drain quickly.",
  },
  {
    q: "Why do clay particles take the longest to settle?",
    opts: [
      "They are denser than sand and silt",
      "They have the smallest, finest particles — very low settling velocity",
      "They repel water molecules",
    ],
    ans: 1,
    exp: "Stokes' Law: settling velocity is proportional to the square of particle radius. Clay particles (< 0.002 mm diameter) are so tiny that they remain suspended for hours.",
  },
];

/* ─── Discovery Q&A ───────────────────────────────────────────── */
const DISCOVERY = [
  {
    q: "Why does the water become clearer over time?",
    a: "As particles settle into distinct layers, they are removed from suspension. The water above gradually becomes clearer — first losing large sand particles, then silt, and finally the tiny clay particles that take the longest to settle.",
    color: "text-amber-700", bg: "bg-amber-500/8", border: "border-amber-500/25",
  },
  {
    q: "What makes loamy soil ideal for agriculture?",
    a: "Loamy soil has a balanced mix of sand (good drainage and aeration), silt (moisture retention and nutrient supply), and clay (long-term water and nutrient holding). This balance supports plant root growth better than any single soil type.",
    color: "text-emerald-700", bg: "bg-emerald-500/8", border: "border-emerald-500/25",
  },
  {
    q: "How does this jar test relate to real soil science?",
    a: "The hydrometer / jar sedimentation test (ASTM D7928) is a standard method used by geologists and soil scientists to determine particle size distribution. In the field, a hydrometer measures the density of the suspension at timed intervals to calculate the proportion of each particle size.",
    color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/25",
  },
  {
    q: "Why is clay the last to settle even though it is denser than water?",
    a: "Clay minerals carry negative surface charges that attract water molecules, forming a thin hydration shell around each particle. This electrostatic effect, combined with the tiny size (< 0.002 mm), creates a colloidal suspension that can remain stable for days.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25",
  },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function SoilTextureExperiment() {
  /* Navigation */
  const [step, setStep]           = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoPlay, setAutoPlay]   = useState(false);

  /* Experiment state */
  const [selectedSoil,    setSelectedSoil]    = useState(null);
  const [stage,           setStage]           = useState(0);   // 0–4
  const [shaking,         setShaking]         = useState(false);
  const [settleProgress,  setSettleProgress]  = useState(0);   // 0–1
  const [isSettling,      setIsSettling]      = useState(false);
  const [hasShaken,       setHasShaken]       = useState(false);

  /* Quiz */
  const [quizAnswers,  setQuizAnswers]  = useState({});
  const [quizRevealed, setQuizRevealed] = useState(false);

  /* Discovery */
  const [revealedQs, setRevealedQs] = useState([]);

  const shakeTimerRef  = useRef(null);
  const settleTimerRef = useRef(null);

  /* ── Navigation ─────────────────────────────────────────────── */
  const goTo = (next) => { setDirection(next > step ? 1 : -1); setStep(next); };
  const handleNext = () => { if (step < TOTAL - 1) goTo(step + 1); };
  const handleBack = () => { if (step > 0) goTo(step - 1); };

  const handleReset = useCallback(() => {
    setAutoPlay(false);
    setStep(0); setDirection(1);
    setSelectedSoil(null); setStage(0);
    setShaking(false); setHasShaken(false);
    setSettleProgress(0); setIsSettling(false);
    setQuizAnswers({}); setQuizRevealed(false); setRevealedQs([]);
    clearTimeout(shakeTimerRef.current);
    clearInterval(settleTimerRef.current);
  }, []);

  /* ── Shaking sequence ───────────────────────────────────────── */
  const handleShake = () => {
    if (shaking || hasShaken) return;
    setShaking(true);
    shakeTimerRef.current = setTimeout(() => {
      setShaking(false);
      setStage(3);
      setHasShaken(true);
    }, 2500);
  };

  /* ── Settling timer ─────────────────────────────────────────── */
  useEffect(() => {
    if (isSettling && settleProgress < 1) {
      settleTimerRef.current = setInterval(() => {
        setSettleProgress(p => {
          const next = p + 0.007;
          if (next >= 1) {
            setIsSettling(false);
            clearInterval(settleTimerRef.current);
            return 1;
          }
          return next;
        });
      }, 80);
    } else {
      clearInterval(settleTimerRef.current);
    }
    return () => clearInterval(settleTimerRef.current);
  }, [isSettling]);

  /* ── Auto-play ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL - 1) { setAutoPlay(false); return; }
    const interactive = new Set([1, 2, 3]);
    if (interactive.has(step)) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 4800);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  /* ── Can-advance gate ───────────────────────────────────────── */
  const canAdvance = (() => {
    if (step === 1) return selectedSoil !== null && stage >= 1;
    if (step === 2) return hasShaken;
    if (step === 3) return settleProgress >= 0.9;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const currentSoil = selectedSoil ? SOIL_DATA[selectedSoil] : null;

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="h-screen flex flex-col bg-background font-body overflow-hidden">

      {/* Header */}
      <header className="shrink-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">Soil Texture Test</h1>
                <p className="text-xs text-muted-foreground">Agriculture · Soil Science</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`gap-1.5 text-xs ${autoPlay ? "border-amber-500 text-amber-600" : ""}`}>
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {autoPlay ? "Pause" : "Auto"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      {step > 0 && step < TOTAL - 1 && (
        <div className="shrink-0 bg-background border-b border-border px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5">
            {STEPS.slice(1, -1).map((s, i) => (
              <button key={i} onClick={() => goTo(i + 1)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 < step ? "bg-amber-400" : i + 1 === step ? "bg-amber-500" : "bg-muted"
                }`} />
            ))}
          </div>
          <div className="max-w-5xl mx-auto flex justify-between mt-1">
            {STEPS.slice(1, -1).map((s, i) => (
              <span key={i} className={`text-[9px] font-medium flex-1 text-center transition-colors ${
                i + 1 === step ? "text-amber-600" : "text-muted-foreground/40"
              }`}>{s.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div key={step} custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto">
            <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

              {/* ══ STEP 0: INTRO ════════════════════════════════════ */}
              {step === 0 && (
                <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}>
                    <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-10 h-10 text-amber-600" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold mb-3">
                      Agriculture · Soil Science
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">Soil Texture Test</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      Fill a jar with soil and water, shake it vigorously, then watch the particles settle
                      into <strong className="text-foreground">distinct layers</strong> — sand at the bottom,
                      silt in the middle, clay at the top — revealing the soil's texture and composition.
                    </p>
                  </motion.div>

                  <div className="w-full max-w-sm mx-auto" style={{ height: 280 }}>
                    <SoilIntroSVG />
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[
                      { label: "Sand",  value: "Settles 1st", sub: "largest particles", color: "text-amber-600" },
                      { label: "Silt",  value: "Settles 2nd", sub: "medium particles",  color: "text-stone-600" },
                      { label: "Clay",  value: "Settles last", sub: "finest particles",  color: "text-red-700" },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                        <p className={`text-lg font-extrabold font-heading ${s.color}`}>{s.value}</p>
                        <p className="text-xs font-semibold text-foreground">{s.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Core Question</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "If we take different soil samples and shake them with water, can we identify each soil's
                      texture simply by <strong className="text-foreground">measuring the layer heights?</strong>"
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Press <strong>Next</strong> or <strong>Auto</strong> to begin.
                  </p>
                </div>
              )}

              {/* ══ STEP 1: SELECT & ADD SOIL ═════════════════════════ */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 340 }}>
                    <div className="w-full max-w-xs">
                      <SoilJarSVG soilType={selectedSoil || "loamy"} stage={stage} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                        Step 1 of 5 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Choose a Soil Sample</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Select one of the four soil types below, then add it to the jar.
                      <strong className="text-foreground"> Each soil has a unique mix</strong> of sand, silt, and clay.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {SOIL_OPTIONS.map(({ key, emoji }) => {
                        const s = SOIL_DATA[key];
                        const active = selectedSoil === key;
                        return (
                          <motion.button key={key}
                            onClick={() => { setSelectedSoil(key); if (stage === 0) setStage(0); }}
                            disabled={stage >= 1}
                            whileHover={stage < 1 ? { scale: 1.02 } : {}}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                              active
                                ? "border-amber-400 bg-amber-500/10"
                                : stage >= 1 ? "border-border bg-card opacity-60"
                                : "border-border bg-card hover:border-amber-300"
                            }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{emoji}</span>
                              <span className={`text-xs font-bold ${active ? "text-amber-700" : "text-foreground"}`}>
                                {s.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
                            <div className="flex gap-1 mt-2">
                              {[
                                { label: "Sand", pct: s.sand, color: "bg-amber-400" },
                                { label: "Silt", pct: s.silt, color: "bg-stone-500" },
                                { label: "Clay", pct: s.clay, color: "bg-red-600" },
                              ].map(bar => (
                                <div key={bar.label} className="flex-1">
                                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div className={`h-full rounded-full ${bar.color}`}
                                      style={{ width: `${bar.pct}%` }} />
                                  </div>
                                  <p className="text-[8px] text-muted-foreground mt-0.5 text-center">{bar.label} {bar.pct}%</p>
                                </div>
                              ))}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {selectedSoil && stage === 0 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <Button
                          onClick={() => setStage(1)}
                          className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                          Add {SOIL_DATA[selectedSoil].label} to Jar →
                        </Button>
                      </motion.div>
                    )}

                    {stage >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">
                          ✓ {SOIL_DATA[selectedSoil]?.label} added — advance to add water!
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP 2: ADD WATER & SHAKE ═════════════════════════ */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-blue-500/25 bg-gradient-to-br from-card to-blue-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 340 }}>
                    <div className="w-full max-w-xs">
                      <SoilJarSVG soilType={selectedSoil} stage={stage} shaking={shaking} />
                    </div>
                  </motion.div>

                  <div className="space-y-5">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 mb-2">
                        Step 2 of 5 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Add Water & Shake</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Fill the jar with water so the soil mixes with the liquid, then
                      <strong className="text-foreground"> shake vigorously</strong> to fully suspend all
                      particles before settling begins.
                    </p>

                    <div className="space-y-3">
                      {/* Step A: Add water */}
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        stage >= 2 ? "border-green-400 bg-green-500/8" : "border-blue-300 bg-blue-500/5"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                            stage >= 2 ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                          }`}>{stage >= 2 ? "✓" : "1"}</div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Add water to fill the jar</p>
                            <p className="text-xs text-muted-foreground">Creates the soil-water suspension</p>
                          </div>
                          {stage < 2 && (
                            <Button size="sm" onClick={() => setStage(2)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs shrink-0">
                              Add Water
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Step B: Shake */}
                      <div className={`p-3 rounded-xl border-2 transition-all ${
                        hasShaken ? "border-green-400 bg-green-500/8"
                          : stage >= 2 ? "border-amber-400 bg-amber-500/5"
                          : "border-border bg-muted/30 opacity-50"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                            hasShaken ? "bg-green-500 text-white"
                              : shaking ? "bg-amber-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}>{hasShaken ? "✓" : shaking ? "…" : "2"}</div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Shake the jar vigorously</p>
                            <p className="text-xs text-muted-foreground">
                              {shaking ? "Shaking… wait 2 seconds"
                                : hasShaken ? "Shaking complete — all particles suspended"
                                : "Suspends all particles evenly"}
                            </p>
                          </div>
                          {stage >= 2 && !hasShaken && !shaking && (
                            <Button size="sm" onClick={handleShake}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs shrink-0">
                              Shake!
                            </Button>
                          )}
                          {shaking && (
                            <span className="text-xs text-amber-600 font-bold animate-pulse shrink-0">
                              Shaking…
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {hasShaken && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">
                          ✓ Jar shaken — all particles fully suspended. Start settling!
                        </p>
                      </motion.div>
                    )}

                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-700 mb-1">Why shake?</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Shaking ensures all particles start in the same random suspension. Without this,
                        pre-settled particles would give inaccurate layer proportions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STEP 3: SETTLING ══════════════════════════════════ */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5 p-3 flex items-center justify-center"
                    style={{ minHeight: 360 }}>
                    <SoilJarSVG soilType={selectedSoil} stage={stage} settleProgress={settleProgress} />
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                        Step 3 of 5 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Watch the Settling</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Click <strong className="text-foreground">Start Settling</strong> and watch the
                      particles separate into distinct layers. Larger particles sink first.
                    </p>

                    {/* Settling progress */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Settling progress</span>
                        <span className="font-mono font-bold">{(settleProgress * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full bg-amber-500"
                          animate={{ width: `${settleProgress * 100}%` }}
                          transition={{ duration: 0.3 }} />
                      </div>
                    </div>

                    {/* Phase indicators */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Sand", threshold: 0.40, color: "text-amber-700", dot: "bg-amber-400" },
                        { label: "Silt",  threshold: 0.75, color: "text-stone-700",  dot: "bg-stone-500" },
                        { label: "Clay",  threshold: 1.00, color: "text-red-700",    dot: "bg-red-500" },
                      ].map(p => (
                        <div key={p.label} className={`p-2 rounded-xl border text-center transition-all ${
                          settleProgress >= p.threshold
                            ? "border-green-400 bg-green-500/8"
                            : settleProgress >= p.threshold - 0.3 && settleProgress < p.threshold
                            ? "border-amber-300 bg-amber-500/8"
                            : "border-border bg-muted/30"
                        }`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${p.dot} mx-auto mb-1`} />
                          <p className={`text-xs font-bold ${p.color}`}>{p.label}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {settleProgress >= p.threshold ? "settled" : "settling…"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => { setIsSettling(!isSettling); if (stage < 4) setStage(4); }}
                        disabled={settleProgress >= 1}
                        className={`flex-1 gap-2 border-0 ${
                          isSettling
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-amber-600 hover:bg-amber-700 text-white"
                        }`}>
                        {isSettling
                          ? <><Pause className="w-4 h-4" />Pause</>
                          : <><Play className="w-4 h-4" />{settleProgress > 0 ? "Resume" : "Start Settling"}</>}
                      </Button>
                      <Button variant="outline" size="sm"
                        onClick={() => { setSettleProgress(0); setIsSettling(false); setStage(3); }}
                        className="gap-1">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {settleProgress >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">
                          ✓ Settling complete — three distinct layers visible!
                        </p>
                      </motion.div>
                    )}

                    <div className="p-3 rounded-xl bg-slate-500/5 border border-slate-500/15">
                      <p className="text-xs font-bold text-slate-700 mb-1">Stokes' Law</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Settling velocity = <em>2r²(ρ−ρ<sub>f</sub>)g / 9η</em>.
                        Sand grains (0.05–2 mm) settle in seconds; clay particles (&lt; 0.002 mm) take hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STEP 4: OBSERVE LAYERS ════════════════════════════ */}
              {step === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5 p-3 flex items-center justify-center"
                    style={{ minHeight: 360 }}>
                    <SoilJarSVG soilType={selectedSoil} stage={4} settleProgress={1} />
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                        Step 4 of 5 — Observations
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Measure the Layers</h2>
                    </div>

                    {currentSoil && (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The ruler shows layer proportions for your <strong className="text-foreground">{currentSoil.label}</strong>.
                          Record the percentages below.
                        </p>

                        {/* Layer measurement table */}
                        <div className="space-y-2">
                          {[
                            { name: "Sand layer",  pct: currentSoil.sand, color: "bg-amber-400", textC: "text-amber-700", desc: "Settles first — coarse, gritty" },
                            { name: "Silt layer",  pct: currentSoil.silt, color: "bg-stone-500",  textC: "text-stone-700",  desc: "Settles second — silky texture" },
                            { name: "Clay layer",  pct: currentSoil.clay, color: "bg-red-500",    textC: "text-red-700",    desc: "Settles last — fine & sticky" },
                          ].map((layer, i) => (
                            <motion.div key={layer.name}
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-3 rounded-xl bg-card border border-border">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className={`text-sm font-bold ${layer.textC}`}>{layer.name}</p>
                                <span className={`text-sm font-extrabold font-heading ${layer.textC}`}>{layer.pct}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
                                <motion.div className={`h-full rounded-full ${layer.color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${layer.pct}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.15 }} />
                              </div>
                              <p className="text-[10px] text-muted-foreground">{layer.desc}</p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Texture classification */}
                        <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/25">
                          <p className="text-xs font-bold text-amber-700 mb-1">Classification Formula</p>
                          <p className="text-xs text-muted-foreground">
                            % = Layer height ÷ Total soil height × 100
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: currentSoil.color }} />
                            <p className="text-sm font-bold text-foreground">
                              → Classified as: <span style={{ color: currentSoil.color }}>{currentSoil.textureType} Soil</span>
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP 5: CLASSIFY & QUIZ ══════════════════════════ */}
              {step === 5 && (
                <div className="w-full space-y-6">
                  <div className="text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                      Step 5 of 5 — Classification & Quiz
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Classify & Test Your Knowledge</h2>
                  </div>

                  {/* Classification result */}
                  {currentSoil && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border-2 text-center max-w-lg mx-auto"
                      style={{ borderColor: currentSoil.color + "55", background: currentSoil.color + "0f" }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1"
                        style={{ color: currentSoil.color }}>Your Sample</p>
                      <p className="text-3xl font-extrabold font-heading" style={{ color: currentSoil.color }}>
                        {currentSoil.textureType} Soil
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{currentSoil.desc}</p>
                      <div className="flex justify-center gap-4 mt-3">
                        {[
                          { l: "Sand", v: currentSoil.sand, c: "#d97706" },
                          { l: "Silt", v: currentSoil.silt, c: "#78716c" },
                          { l: "Clay", v: currentSoil.clay, c: "#b91c1c" },
                        ].map(b => (
                          <div key={b.l} className="text-center">
                            <p className="text-xl font-extrabold font-heading" style={{ color: b.c }}>{b.v}%</p>
                            <p className="text-xs text-muted-foreground">{b.l}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Classification table */}
                  <div className="overflow-hidden rounded-2xl border border-border max-w-2xl mx-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left px-4 py-2 text-xs font-bold text-muted-foreground">Texture Type</th>
                          <th className="text-center px-3 py-2 text-xs font-bold text-amber-700">Sand %</th>
                          <th className="text-center px-3 py-2 text-xs font-bold text-stone-700">Silt %</th>
                          <th className="text-center px-3 py-2 text-xs font-bold text-red-700">Clay %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(SOIL_DATA).map(([key, s]) => (
                          <tr key={key}
                            className={`border-t border-border ${selectedSoil === key ? "bg-amber-500/8" : ""}`}>
                            <td className="px-4 py-2 font-semibold" style={{ color: s.color }}>
                              {selectedSoil === key && "▶ "}{s.textureType}
                            </td>
                            <td className="text-center px-3 py-2 text-amber-700 font-mono">{s.sand}</td>
                            <td className="text-center px-3 py-2 text-stone-700 font-mono">{s.silt}</td>
                            <td className="text-center px-3 py-2 text-red-700 font-mono">{s.clay}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Quiz */}
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold font-heading">Quick Quiz</h3>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(quizAnswers).length}/{QUIZ.length} answered
                      </span>
                    </div>

                    {QUIZ.map((q, qi) => {
                      const selected = quizAnswers[qi];
                      const revealed = quizRevealed || selected !== undefined;
                      const correct  = selected === q.ans;
                      return (
                        <div key={qi} className="p-4 rounded-2xl border border-border bg-card">
                          <p className="text-sm font-semibold mb-3">{q.q}</p>
                          <div className="space-y-2">
                            {q.opts.map((opt, oi) => {
                              const picked = selected === oi;
                              const showResult = revealed && picked;
                              return (
                                <button key={oi}
                                  onClick={() => !quizRevealed && setQuizAnswers(p => ({ ...p, [qi]: oi }))}
                                  disabled={quizRevealed}
                                  className={`w-full text-left px-3 py-2 rounded-xl border text-sm transition-all ${
                                    showResult && oi === q.ans ? "border-green-400 bg-green-500/10 text-green-700 font-semibold"
                                      : showResult && oi !== q.ans ? "border-red-400 bg-red-500/10 text-red-700"
                                      : quizRevealed && oi === q.ans ? "border-green-300 bg-green-500/5 text-green-700"
                                      : picked ? "border-amber-400 bg-amber-500/10"
                                      : "border-border hover:border-amber-300"
                                  }`}>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizRevealed && (
                            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-2 rounded-lg bg-slate-500/5 border border-slate-500/15">
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Explanation: </strong>{q.exp}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}

                    {Object.keys(quizAnswers).length === QUIZ.length && !quizRevealed && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <Button onClick={() => setQuizRevealed(true)}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Reveal Answers
                        </Button>
                      </motion.div>
                    )}

                    {quizRevealed && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">
                          Score: {QUIZ.filter((q, i) => quizAnswers[i] === q.ans).length}/{QUIZ.length} correct!
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP 6: CONCLUSION ═══════════════════════════════ */}
              {step === 6 && (
                <div className="w-full space-y-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7 text-green-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Experiment Complete!</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You have used the jar sedimentation test to determine soil texture.
                      Here is a side-by-side comparison of all four soil types.
                    </p>
                  </div>

                  {/* All 4 soil types comparison */}
                  <div className="rounded-3xl border-2 border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5 p-4"
                    style={{ height: 280 }}>
                    <SoilObservationSVG />
                  </div>

                  {/* Key findings */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                    {[
                      { icon: "⬇️", title: "Sedimentation", body: "Particles settle fastest to slowest: Sand → Silt → Clay. Governed by Stokes' Law — larger particles experience greater gravitational force relative to drag." },
                      { icon: "🌱", title: "Soil Texture",  body: "The proportion of sand, silt, and clay determines soil texture. Loamy soils are prized in agriculture for their balanced drainage and water retention." },
                      { icon: "💧", title: "Water Retention", body: "Clay retains water longest due to tiny particle size and negative surface charge. Sandy soils drain rapidly because of large pore spaces between grains." },
                    ].map(f => (
                      <div key={f.title} className="p-4 rounded-2xl bg-card border border-border">
                        <div className="text-2xl mb-2">{f.icon}</div>
                        <p className="text-sm font-bold text-foreground mb-1">{f.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Discovery Q&A */}
                  <div className="max-w-2xl mx-auto space-y-2">
                    <h3 className="text-base font-bold font-heading">Go Deeper</h3>
                    {DISCOVERY.map((d, i) => (
                      <div key={i}
                        className={`rounded-2xl border p-4 cursor-pointer transition-all ${d.bg} ${d.border}`}
                        onClick={() => toggleQ(i)}>
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm font-semibold ${d.color}`}>{d.q}</p>
                          <span className={`shrink-0 text-lg ${d.color}`}>
                            {revealedQs.includes(i) ? "▲" : "▼"}
                          </span>
                        </div>
                        <AnimatePresence>
                          {revealedQs.includes(i) && (
                            <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                              className="text-sm text-muted-foreground leading-relaxed mt-2 overflow-hidden">
                              {d.a}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-center max-w-2xl mx-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Conclusion</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Different soil samples contain different proportions of sand, silt, and clay.
                      Larger particles such as sand settle fastest while smaller clay particles settle last.
                      The jar sedimentation test is a reliable, low-cost method to identify soil texture class.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="shrink-0 bg-background/90 backdrop-blur-sm border-t border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}
            className="gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {/* Step dots */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all ${
                  i === step ? "w-5 h-2 bg-amber-500" : "w-2 h-2 bg-muted hover:bg-amber-300"
                }`} />
            ))}
          </div>

          <Button onClick={handleNext}
            disabled={step === TOTAL - 1 || !canAdvance}
            className="gap-2 text-sm bg-amber-600 hover:bg-amber-700 text-white border-0">
            {step === TOTAL - 1 ? "Done" : "Next"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
