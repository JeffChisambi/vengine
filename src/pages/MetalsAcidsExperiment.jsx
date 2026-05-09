import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, RotateCcw, Play, Pause,
  FlaskConical, CheckCircle2, BookOpen, BarChart3,
  Zap, Microscope, Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  METAL_DATA,
  ACID_DATA,
  MetalsIntroSVG,
  MetalsReactionSVG,
  MetalsComparisonSVG,
  MetalsHydrogenSVG,
} from "@/components/metals/MetalsSVG";

/* ─── Slide variants ──────────────────────────────────────────── */
const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

/* ─── Steps ───────────────────────────────────────────────────── */
const STEPS = [
  { label: "Intro",      tag: "Overview",  icon: FlaskConical },
  { label: "Setup",      tag: "Step 1",    icon: FlaskConical },
  { label: "React",      tag: "Step 2",    icon: Flame },
  { label: "H₂ Test",   tag: "Step 3",    icon: Zap },
  { label: "Equations",  tag: "Step 4",    icon: BookOpen },
  { label: "Compare",    tag: "Step 5",    icon: BarChart3 },
  { label: "Conclusion", tag: "Complete",  icon: CheckCircle2 },
];
const TOTAL = STEPS.length;

/* ─── Quiz ────────────────────────────────────────────────────── */
const QUIZ = [
  {
    q: "Which metal reacts most vigorously with dilute hydrochloric acid?",
    opts: ["Copper", "Iron", "Zinc", "Magnesium"],
    ans: 3,
    exp: "Magnesium is the most reactive of the four metals — it sits highest in the reactivity series and displaces hydrogen rapidly, producing vigorous fizzing.",
  },
  {
    q: "Why does copper NOT react with dilute hydrochloric acid?",
    opts: [
      "Copper is too heavy to dissolve",
      "Copper is below hydrogen in the reactivity series",
      "HCl is too weak an acid",
    ],
    ans: 1,
    exp: "Only metals above hydrogen in the reactivity series can displace H₂ from acids. Copper sits below hydrogen, so it cannot displace it from dilute HCl.",
  },
  {
    q: "What gas is produced when magnesium reacts with hydrochloric acid?",
    opts: ["Oxygen", "Carbon dioxide", "Hydrogen", "Chlorine"],
    ans: 2,
    exp: "Mg + 2HCl → MgCl₂ + H₂. The hydrogen gas can be confirmed with the glowing splint test — it burns with a characteristic squeaky pop.",
  },
  {
    q: "What is the other product (besides hydrogen) when zinc reacts with H₂SO₄?",
    opts: ["Zinc oxide", "Zinc sulfate", "Zinc chloride", "Zinc hydroxide"],
    ans: 1,
    exp: "Zn + H₂SO₄ → ZnSO₄ + H₂. The metal combines with the acid's anion (SO₄²⁻) to form zinc sulfate — a soluble salt that dissolves in the solution.",
  },
];

/* ─── Discovery Q&A ───────────────────────────────────────────── */
const DISCOVERY = [
  {
    q: "Why does magnesium react faster than iron with the same acid?",
    a: "Magnesium is higher in the reactivity series — it has a greater tendency to lose electrons (lower ionisation energy relative to standard reduction potential). This means Mg atoms more readily donate electrons to H⁺ ions, reducing them to H₂ gas at a much faster rate.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25",
  },
  {
    q: "What happens to the solution temperature during the reaction?",
    a: "The temperature rises because the reactions are exothermic. Energy is released when new bonds form in the products (MgCl₂/H₂) that is greater than the energy needed to break bonds in the reactants. Magnesium's reaction produces the most heat, copper's produces none.",
    color: "text-amber-700", bg: "bg-amber-500/8", border: "border-amber-500/25",
  },
  {
    q: "How does the glowing splint test confirm hydrogen gas?",
    a: "A glowing (not burning) splint is held at the mouth of the test tube. Hydrogen ignites with a distinctive high-pitched 'squeaky pop' as it combusts with oxygen in the air: 2H₂ + O₂ → 2H₂O. The pop is caused by the rapid pressure wave from the fast combustion.",
    color: "text-blue-700", bg: "bg-blue-500/8", border: "border-blue-500/25",
  },
  {
    q: "How is this reaction used industrially?",
    a: "This type of reaction is used to produce hydrogen gas industrially (e.g., from zinc and sulfuric acid in laboratories). More importantly, the reactivity series guides metal extraction — metals high in the series (Na, Al) require electrolysis to extract from ores, while lower metals (Fe, Cu) can be reduced with carbon or other chemicals.",
    color: "text-emerald-700", bg: "bg-emerald-500/8", border: "border-emerald-500/25",
  },
];

/* ─── Metal selector options ──────────────────────────────────── */
const METAL_KEYS  = ["magnesium", "zinc", "iron", "copper"];
const ACID_KEYS   = ["hcl", "h2so4"];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function MetalsAcidsExperiment() {
  /* Navigation */
  const [step,      setStep]      = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoPlay,  setAutoPlay]  = useState(false);

  /* Experiment state */
  const [selectedMetal,  setSelectedMetal]  = useState(null);
  const [selectedAcid,   setSelectedAcid]   = useState("hcl");
  const [stage,          setStage]          = useState(0); // 0=setup,1=metal added,2=reacting
  const [reactionProgress, setReactionProgress] = useState(0);
  const [isRunning,      setIsRunning]      = useState(false);
  const [hasRun,         setHasRun]         = useState(false);

  /* Equations reveal */
  const [eqsRevealed, setEqsRevealed] = useState(0);

  /* Quiz */
  const [quizAnswers,  setQuizAnswers]  = useState({});
  const [quizRevealed, setQuizRevealed] = useState(false);

  /* Discovery */
  const [revealedQs, setRevealedQs] = useState([]);

  const timerRef = useRef(null);

  const metal = selectedMetal ? METAL_DATA[selectedMetal] : null;
  const acid  = ACID_DATA[selectedAcid];

  /* ── Navigation ─────────────────────────────────────────────── */
  const goTo = (next) => { setDirection(next > step ? 1 : -1); setStep(next); };
  const handleNext = () => { if (step < TOTAL - 1) goTo(step + 1); };
  const handleBack = () => { if (step > 0) goTo(step - 1); };

  const handleReset = useCallback(() => {
    setAutoPlay(false);
    setStep(0); setDirection(1);
    setSelectedMetal(null); setSelectedAcid("hcl");
    setStage(0); setReactionProgress(0);
    setIsRunning(false); setHasRun(false);
    setEqsRevealed(0); setQuizAnswers({}); setQuizRevealed(false); setRevealedQs([]);
    clearInterval(timerRef.current);
  }, []);

  /* ── Reaction timer ─────────────────────────────────────────── */
  useEffect(() => {
    if (isRunning && reactionProgress < 1) {
      timerRef.current = setInterval(() => {
        setReactionProgress(p => {
          const speed = metal?.reactivity === 4 ? 0.012
                      : metal?.reactivity === 3 ? 0.007
                      : metal?.reactivity === 2 ? 0.004
                      : 0.008; // copper "reacts" quickly to show no-reaction state
          const next = p + speed;
          if (next >= 1) {
            setIsRunning(false);
            clearInterval(timerRef.current);
            return 1;
          }
          return next;
        });
      }, 80);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, metal]);

  /* ── Auto-play ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL - 1) { setAutoPlay(false); return; }
    const interactive = new Set([1, 2]);
    if (interactive.has(step)) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 4800);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  /* ── Can-advance gate ───────────────────────────────────────── */
  const canAdvance = (() => {
    if (step === 1) return selectedMetal !== null && stage >= 1;
    if (step === 2) return hasRun;
    return true;
  })();

  const toggleQ = (i) =>
    setRevealedQs(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const startReaction = () => {
    if (!isRunning && stage < 2) setStage(2);
    setIsRunning(prev => !prev);
    setHasRun(true);
  };

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
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">Reaction of Metals with Acids</h1>
                <p className="text-xs text-muted-foreground">Chemistry · Reactivity Series</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`gap-1.5 text-xs ${autoPlay ? "border-violet-500 text-violet-600" : ""}`}>
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
                  i + 1 < step ? "bg-violet-400" : i + 1 === step ? "bg-violet-500" : "bg-muted"
                }`} />
            ))}
          </div>
          <div className="max-w-5xl mx-auto flex justify-between mt-1">
            {STEPS.slice(1, -1).map((s, i) => (
              <span key={i} className={`text-[9px] font-medium flex-1 text-center transition-colors ${
                i + 1 === step ? "text-violet-600" : "text-muted-foreground/40"
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
                    <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                      <FlaskConical className="w-10 h-10 text-violet-600" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 text-xs font-semibold mb-3">
                      Chemistry · Reactivity Series
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                      Reaction of Metals with Acids
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      Drop different metals into dilute acids and observe
                      <strong className="text-foreground"> how vigorously each one reacts</strong> — producing
                      hydrogen gas and a dissolved salt. The reactivity series predicts exactly what you'll see.
                    </p>
                  </motion.div>

                  <div className="w-full max-w-sm mx-auto" style={{ height: 300 }}>
                    <MetalsIntroSVG />
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[
                      { label: "Reactants",  value: "Metal + Acid",   sub: "in aqueous solution",    color: "text-violet-600" },
                      { label: "Products",   value: "Salt + H₂↑",     sub: "hydrogen gas released",  color: "text-blue-600"   },
                      { label: "Key concept", value: "Reactivity",    sub: "predicts reaction rate",  color: "text-amber-600"  },
                    ].map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                        <p className={`text-lg font-extrabold font-heading ${s.color}`}>{s.value}</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{s.label}</p>
                        <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2">Core Question</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "If all these metals react with the same acid, why do some fizz violently
                      while others <strong className="text-foreground">produce no bubbles at all?</strong>"
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">Press <strong>Next</strong> or <strong>Auto</strong> to begin.</p>
                </div>
              )}

              {/* ══ STEP 1: SETUP ════════════════════════════════════ */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-violet-500/25 bg-gradient-to-br from-card to-violet-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 340 }}>
                    <div className="w-full max-w-xs">
                      <MetalsReactionSVG
                        metalKey={selectedMetal || "magnesium"}
                        acidKey={selectedAcid}
                        stage={stage}
                        reactionProgress={0}
                      />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                        Step 1 of 5 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Choose Metal & Acid</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Select a metal from the reactivity series and an acid, then add the metal to the beaker.
                    </p>

                    {/* Acid selector */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Acid</p>
                      <div className="grid grid-cols-2 gap-2">
                        {ACID_KEYS.map(ak => {
                          const a = ACID_DATA[ak];
                          const active = selectedAcid === ak;
                          return (
                            <button key={ak}
                              onClick={() => { if (stage === 0) setSelectedAcid(ak); }}
                              disabled={stage >= 1}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${
                                active ? "border-violet-400 bg-violet-500/10"
                                  : stage >= 1 ? "border-border bg-muted/40 opacity-60"
                                  : "border-border bg-card hover:border-violet-300"
                              }`}>
                              <p className={`text-sm font-bold ${active ? "text-violet-700" : "text-foreground"}`}>
                                {a.formula}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{a.name}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Metal selector */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Metal</p>
                      <div className="grid grid-cols-2 gap-2">
                        {METAL_KEYS.map(mk => {
                          const m = METAL_DATA[mk];
                          const active = selectedMetal === mk;
                          return (
                            <motion.button key={mk}
                              onClick={() => { if (stage === 0) setSelectedMetal(mk); }}
                              disabled={stage >= 1}
                              whileHover={stage === 0 ? { scale: 1.02 } : {}}
                              className={`p-3 rounded-xl border-2 text-left transition-all ${
                                active ? "border-violet-400 bg-violet-500/10"
                                  : stage >= 1 ? "border-border bg-muted/40 opacity-60"
                                  : "border-border bg-card hover:border-violet-300"
                              }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-5 h-5 rounded-full border-2"
                                  style={{ background: m.stripColor, borderColor: m.stripBorder }} />
                                <span className={`text-sm font-bold ${active ? "text-violet-700" : "text-foreground"}`}>
                                  {m.name}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground">{m.rate}</p>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 4 }).map((_, ri) => (
                                  <div key={ri}
                                    className={`h-1.5 flex-1 rounded-full ${
                                      ri < m.reactivity ? "bg-violet-500" : "bg-muted"
                                    }`} />
                                ))}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedMetal && stage === 0 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <Button onClick={() => setStage(1)}
                          className="w-full gap-2 bg-violet-600 hover:bg-violet-700 text-white">
                          Add {METAL_DATA[selectedMetal].name} to {acid.formula} →
                        </Button>
                      </motion.div>
                    )}

                    {stage >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">
                          ✓ {METAL_DATA[selectedMetal]?.name} added — advance to run the reaction!
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP 2: RUN REACTION ══════════════════════════════ */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-violet-500/25 bg-gradient-to-br from-card to-violet-500/5 p-3 flex items-center justify-center"
                    style={{ minHeight: 360 }}>
                    <MetalsReactionSVG
                      metalKey={selectedMetal}
                      acidKey={selectedAcid}
                      stage={stage}
                      reactionProgress={reactionProgress}
                    />
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                        Step 2 of 5 — Interactive
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Observe the Reaction</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Start the reaction and watch how <strong className="text-foreground">{metal?.name || "the metal"}</strong> behaves
                      in <strong className="text-foreground">{acid.formula}</strong>.
                      Monitor the bubbles, metal dissolving, and temperature rise.
                    </p>

                    {/* Live readings */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          label: "Reaction rate",
                          value: metal?.rate || "—",
                          color: metal?.reactivity === 0 ? "text-red-600" : metal?.reactivity >= 3 ? "text-violet-600" : "text-amber-600",
                        },
                        {
                          label: "Temperature",
                          value: metal ? `${(20 + metal.tempRise * reactionProgress).toFixed(1)}°C` : "20.0°C",
                          color: metal?.tempRise > 0 ? "text-red-600" : "text-muted-foreground",
                        },
                        {
                          label: "Metal dissolved",
                          value: metal ? `${(metal.dissolveRate * reactionProgress * 100).toFixed(0)}%` : "0%",
                          color: "text-emerald-600",
                        },
                        {
                          label: "H₂ produced",
                          value: metal?.reactivity === 0 ? "None" : reactionProgress > 0 ? "Yes ✓" : "—",
                          color: metal?.reactivity === 0 ? "text-red-600" : "text-blue-600",
                        },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-card rounded-xl p-3 border border-border">
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</p>
                          <p className={`text-sm font-extrabold font-heading mt-0.5 ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Reaction progress</span>
                        <span className="font-mono font-bold">{(reactionProgress * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full rounded-full bg-violet-500"
                          animate={{ width: `${reactionProgress * 100}%` }}
                          transition={{ duration: 0.3 }} />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                      <Button onClick={startReaction}
                        disabled={reactionProgress >= 1}
                        className={`flex-1 gap-2 border-0 ${
                          isRunning
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-violet-600 hover:bg-violet-700 text-white"
                        }`}>
                        {isRunning
                          ? <><Pause className="w-4 h-4" />Pause</>
                          : <><Play className="w-4 h-4" />{hasRun ? "Resume" : "Start Reaction"}</>}
                      </Button>
                      <Button variant="outline" size="sm"
                        onClick={() => { setReactionProgress(0); setIsRunning(false); setHasRun(false); setStage(1); }}>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {/* Observation note */}
                    {hasRun && metal && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl border text-sm ${
                          metal.reactivity === 0
                            ? "bg-red-500/8 border-red-500/25 text-red-700"
                            : "bg-violet-500/8 border-violet-500/25 text-violet-700"
                        }`}>
                        <strong>Observation: </strong>{metal.observations}
                      </motion.div>
                    )}

                    {reactionProgress >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-green-500/8 border border-green-500/25 text-center">
                        <p className="text-sm font-bold text-green-700">✓ Reaction observed — advance to test for H₂!</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP 3: HYDROGEN TEST ════════════════════════════ */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-violet-500/25 bg-gradient-to-br from-card to-violet-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 320 }}>
                    <div className="w-full max-w-xs">
                      <MetalsHydrogenSVG />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                        Step 3 of 5 — Hydrogen Test
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Test for Hydrogen Gas</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Collect the gas produced and confirm it is hydrogen using the
                      <strong className="text-foreground"> glowing splint test</strong>.
                    </p>

                    <div className="space-y-3">
                      {[
                        { n: "1", title: "Collect the gas", desc: "Hold an inverted test tube over the reaction to collect the gas produced.", icon: "🧪" },
                        { n: "2", title: "Prepare a glowing splint", desc: "Light a wooden splint, then blow it out so it is glowing (not burning).", icon: "🔥" },
                        { n: "3", title: "Hold at tube mouth", desc: "Place the glowing splint at the mouth of the inverted gas-filled test tube.", icon: "📌" },
                        { n: "4", title: "Listen for the pop", desc: "A squeaky pop confirms hydrogen — H₂ ignites rapidly with oxygen in air.", icon: "💥" },
                      ].map(step => (
                        <div key={step.n} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                          <div className="w-7 h-7 rounded-full bg-violet-500/10 text-violet-700 text-sm font-bold flex items-center justify-center shrink-0">
                            {step.n}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{step.title}</p>
                            <p className="text-xs text-muted-foreground">{step.desc}</p>
                          </div>
                          <span className="text-xl shrink-0">{step.icon}</span>
                        </div>
                      ))}
                    </div>

                    {metal && metal.reactivity === 0 && (
                      <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/25">
                        <p className="text-sm font-bold text-red-700">Note for Copper:</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          No hydrogen gas was produced — copper did not react with the acid.
                          There would be nothing to collect for the splint test.
                        </p>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-700 mb-1">Why "squeaky pop"?</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Hydrogen combusts extremely rapidly with atmospheric oxygen:
                        2H₂ + O₂ → 2H₂O. The speed of combustion creates a small pressure
                        wave — the characteristic squeaky pop sound.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STEP 4: EQUATIONS ════════════════════════════════ */}
              {step === 4 && (
                <div className="w-full space-y-5">
                  <div className="text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                      Step 4 of 5 — Chemical Equations
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Chemical Equations</h2>
                  </div>

                  {/* Selected reaction highlighted */}
                  {metal && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border-2 border-violet-500/30 bg-violet-500/5 text-center max-w-xl mx-auto">
                      <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Your experiment</p>
                      <p className="text-xl font-extrabold font-heading text-violet-800 font-mono">
                        {metal.eqs[selectedAcid]}
                      </p>
                      {metal.salts[selectedAcid] && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Salt formed: <strong className="text-foreground">{metal.salts[selectedAcid]}</strong>
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* All equations */}
                  <div className="max-w-2xl mx-auto space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold font-heading">All reactions with {acid.formula}</p>
                      <button onClick={() => setEqsRevealed(prev => Math.min(prev + 1, 4))}
                        className="text-xs text-violet-600 font-semibold hover:underline">
                        {eqsRevealed < 4 ? "Reveal next →" : "All shown"}
                      </button>
                    </div>

                    {METAL_KEYS.map((mk, idx) => {
                      const m    = METAL_DATA[mk];
                      const eq   = m.eqs[selectedAcid];
                      const show = idx < eqsRevealed + 1;
                      return (
                        <AnimatePresence key={mk}>
                          {show && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: "auto" }}
                              transition={{ duration: 0.3 }}
                              className={`p-4 rounded-2xl border-2 overflow-hidden ${
                                mk === selectedMetal
                                  ? "border-violet-400 bg-violet-500/8"
                                  : "border-border bg-card"
                              }`}>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold"
                                  style={{ background: m.stripColor, color: m.stripBorder, border: `2px solid ${m.stripBorder}` }}>
                                  {m.symbol}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold font-mono text-foreground truncate">{eq}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{m.rate}</p>
                                </div>
                                {mk === selectedMetal && (
                                  <span className="text-xs font-bold text-violet-600 shrink-0">★ yours</span>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      );
                    })}
                  </div>

                  {/* General equation */}
                  <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-slate-500/5 border border-slate-500/15">
                    <p className="text-xs font-bold text-slate-700 mb-2">General equation (for reactive metals)</p>
                    <p className="text-sm font-mono font-bold text-foreground">Metal + Acid → Salt + Hydrogen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The salt name = metal name + acid's anion (chloride from HCl, sulfate from H₂SO₄)
                    </p>
                  </div>

                  {/* Quiz */}
                  <div className="max-w-2xl mx-auto space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold font-heading">Quick Quiz</h3>
                      <span className="text-xs text-muted-foreground">{Object.keys(quizAnswers).length}/{QUIZ.length} answered</span>
                    </div>

                    {QUIZ.map((q, qi) => {
                      const selected = quizAnswers[qi];
                      const revealed = quizRevealed || selected !== undefined;
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
                                      : picked ? "border-violet-400 bg-violet-500/10"
                                      : "border-border hover:border-violet-300"
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
                          className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2">
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

              {/* ══ STEP 5: COMPARE METALS ═══════════════════════════ */}
              {step === 5 && (
                <div className="w-full space-y-5">
                  <div className="text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 mb-2">
                      Step 5 of 5 — Compare
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Compare All Metals</h2>
                    <p className="text-sm text-muted-foreground mt-1">Side-by-side results after reacting with {acid.name}</p>
                  </div>

                  {/* Comparison SVG */}
                  <div className="rounded-3xl border-2 border-violet-500/25 bg-gradient-to-br from-card to-violet-500/5 p-4"
                    style={{ height: 270 }}>
                    <MetalsComparisonSVG acidKey={selectedAcid} />
                  </div>

                  {/* Comparison table */}
                  <div className="overflow-hidden rounded-2xl border border-border max-w-2xl mx-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left px-4 py-2 text-xs font-bold text-muted-foreground">Metal</th>
                          <th className="text-center px-3 py-2 text-xs font-bold text-violet-700">Rate</th>
                          <th className="text-center px-3 py-2 text-xs font-bold text-blue-700">H₂ gas</th>
                          <th className="text-center px-3 py-2 text-xs font-bold text-red-700">Temp rise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {METAL_KEYS.map(mk => {
                          const m = METAL_DATA[mk];
                          return (
                            <tr key={mk}
                              className={`border-t border-border ${selectedMetal === mk ? "bg-violet-500/8" : ""}`}>
                              <td className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full border"
                                    style={{ background: m.stripColor, borderColor: m.stripBorder }} />
                                  <span className="font-semibold">{m.name}</span>
                                  {selectedMetal === mk && <span className="text-[10px] text-violet-600 font-bold">★</span>}
                                </div>
                              </td>
                              <td className="text-center px-3 py-2 text-xs font-semibold"
                                style={{ color: m.reactivity === 0 ? "#dc2626" : m.reactivity >= 3 ? "#6d28d9" : "#d97706" }}>
                                {m.reactivity === 4 ? "Very fast" : m.reactivity === 3 ? "Moderate" : m.reactivity === 2 ? "Slow" : "None"}
                              </td>
                              <td className="text-center px-3 py-2 text-sm">
                                {m.reactivity > 0 ? <span className="text-green-600 font-bold">✓ Yes</span>
                                  : <span className="text-red-600 font-bold">✕ No</span>}
                              </td>
                              <td className="text-center px-3 py-2 text-sm font-mono font-semibold"
                                style={{ color: m.tempRise > 10 ? "#dc2626" : m.tempRise > 0 ? "#d97706" : "#6b7280" }}>
                                +{m.tempRise}°C
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Reactivity series note */}
                  <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 max-w-2xl mx-auto">
                    <p className="text-xs font-bold text-violet-700 mb-2">Reactivity Series Order (lab metals)</p>
                    <div className="flex items-center gap-2">
                      {["Mg", "Zn", "Fe"].map((sym, i) => (
                        <React.Fragment key={sym}>
                          <span className="px-2 py-1 rounded-lg bg-violet-500/10 text-violet-700 text-sm font-bold">{sym}</span>
                          {i < 2 && <span className="text-muted-foreground font-bold">›</span>}
                        </React.Fragment>
                      ))}
                      <span className="text-muted-foreground text-sm">›› H₂ ›</span>
                      <span className="px-2 py-1 rounded-lg bg-orange-500/10 text-orange-700 text-sm font-bold">Cu</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Metals above H₂ displace it from acids. Copper, being below, cannot.
                    </p>
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
                      You have explored how different metals react with dilute acids and discovered
                      the link between the reactivity series and reaction rate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                    {[
                      { icon: "⚡", title: "Reactivity Predicts Rate", body: "Metals higher in the reactivity series react faster with acids. Mg reacts vigorously, Zn moderately, Fe slowly, and Cu not at all." },
                      { icon: "🧪", title: "Two Products Always", body: "Every successful metal-acid reaction produces a salt (dissolved) and hydrogen gas (H₂↑). The salt's name comes from the metal and the acid's anion." },
                      { icon: "🌡️", title: "Exothermic Reactions", body: "Energy is released as heat — the more reactive the metal, the greater the temperature rise. Mg reactions are noticeably warm to the touch." },
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
                          <span className={`shrink-0 text-lg ${d.color}`}>{revealedQs.includes(i) ? "▲" : "▼"}</span>
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

                  <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/25 text-center max-w-2xl mx-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2">Conclusion</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The reactivity series governs how vigorously metals react with dilute acids.
                      Metals above hydrogen displace it to produce hydrogen gas and a salt.
                      The higher the metal in the series, the faster and more vigorous the reaction.
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
          <Button variant="outline" onClick={handleBack} disabled={step === 0} className="gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all ${
                  i === step ? "w-5 h-2 bg-violet-500" : "w-2 h-2 bg-muted hover:bg-violet-300"
                }`} />
            ))}
          </div>

          <Button onClick={handleNext}
            disabled={step === TOTAL - 1 || !canAdvance}
            className="gap-2 text-sm bg-violet-600 hover:bg-violet-700 text-white border-0">
            {step === TOTAL - 1 ? "Done" : "Next"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
