import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, RotateCcw, Leaf, Play, Pause, Sun, Moon,
  Zap, FlaskConical, Microscope, CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  PhotoIntroSVG, DestarchSVG, SetupSVG, TimelapseSVG,
  DualBoilSVG, DualEthanolSVG, DualIodineSVG,
} from "@/components/photosynthesis/PhotosynthesisSVG";

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const STEPS = [
  { label: "Intro",         tag: "Overview",  icon: Leaf },
  { label: "Destarch",      tag: "Step 1",    icon: Moon },
  { label: "Setup",         tag: "Step 2",    icon: Sun },
  { label: "Time-lapse",    tag: "Step 3",    icon: Zap },
  { label: "Boil",          tag: "Step 4",    icon: FlaskConical },
  { label: "Ethanol",       tag: "Step 5",    icon: FlaskConical },
  { label: "Iodine Test",   tag: "Step 6",    icon: Microscope },
  { label: "Discovery",     tag: "Step 7",    icon: CheckCircle2 },
  { label: "Conclusion",    tag: "Complete",  icon: CheckCircle2 },
];
const TOTAL_STEPS = STEPS.length;

const DISCOVERY_QS = [
  {
    q: "Why did only one leaf turn blue-black?",
    a: "Only the leaf exposed to light produced starch. The dark leaf had no photosynthesis, so no starch formed — iodine stayed brown.",
    color: "text-indigo-700", bg: "bg-indigo-500/8", border: "border-indigo-500/25",
  },
  {
    q: "What did sunlight provide to the light leaf?",
    a: "Light energy — absorbed by chlorophyll in chloroplasts — powered the photosynthesis reactions that produced glucose, which was then stored as starch.",
    color: "text-amber-700", bg: "bg-amber-500/8", border: "border-amber-500/25",
  },
  {
    q: "What process occurred in the illuminated leaf?",
    a: "Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ (glucose) + 6O₂. The glucose was converted to starch for storage.",
    color: "text-green-700", bg: "bg-green-500/8", border: "border-green-500/25",
  },
  {
    q: "Why did we destarch both plants first?",
    a: "To give both plants an identical starting point — zero starch. Without this step, existing starch in the leaves would make results unreliable.",
    color: "text-violet-700", bg: "bg-violet-500/8", border: "border-violet-500/25",
  },
  {
    q: "What evidence proves photosynthesis happened?",
    a: "The blue-black iodine reaction in the light leaf is direct chemical evidence that starch was produced — which only forms as a product of photosynthesis.",
    color: "text-teal-700", bg: "bg-teal-500/8", border: "border-teal-500/25",
  },
];

export default function PhotosynthesisExperiment() {
  const [step, setStep]               = useState(0);
  const [direction, setDirection]     = useState(1);
  const [destarchProg, setDestarchProg] = useState(0);
  const [destarchRunning, setDestarchRunning] = useState(false);
  const [timeIntensity, setTimeIntensity] = useState(0);
  const [timeRunning, setTimeRunning] = useState(false);
  const [iodineRevealed, setIodineRevealed] = useState(false);
  const [revealedQs, setRevealedQs]   = useState([]);
  const [autoPlay, setAutoPlay]       = useState(false);
  const destarchRef = useRef(null);
  const timeRef     = useRef(null);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };
  const handleNext = () => { if (step < TOTAL_STEPS - 1) goTo(step + 1); };
  const handleBack = () => { if (step > 0) goTo(step - 1); };
  const handleReset = () => {
    setAutoPlay(false); setStep(0); setDirection(1);
    setDestarchProg(0); setDestarchRunning(false);
    setTimeIntensity(0); setTimeRunning(false);
    setIodineRevealed(false); setRevealedQs([]);
    clearInterval(destarchRef.current);
    clearInterval(timeRef.current);
  };

  /* Destarch animation */
  const startDestarch = () => {
    if (destarchProg >= 1) return;
    setDestarchRunning(true);
    destarchRef.current = setInterval(() => {
      setDestarchProg((p) => {
        if (p >= 1) { clearInterval(destarchRef.current); setDestarchRunning(false); return 1; }
        return p + 0.008;
      });
    }, 60);
  };
  const resetDestarch = () => {
    clearInterval(destarchRef.current);
    setDestarchRunning(false);
    setDestarchProg(0);
  };

  /* Timelapse animation */
  const startTimelapse = () => {
    if (timeIntensity >= 1) return;
    setTimeRunning(true);
    timeRef.current = setInterval(() => {
      setTimeIntensity((p) => {
        if (p >= 1) { clearInterval(timeRef.current); setTimeRunning(false); return 1; }
        return p + 0.006;
      });
    }, 60);
  };
  const resetTimelapse = () => {
    clearInterval(timeRef.current);
    setTimeRunning(false);
    setTimeIntensity(0);
  };

  /* Auto-play logic — advances automatically, skips interactive steps */
  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL_STEPS - 1) { setAutoPlay(false); return; }
    const interactiveSteps = new Set([1, 3]);
    if (interactiveSteps.has(step)) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 3800);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  useEffect(() => () => {
    clearInterval(destarchRef.current);
    clearInterval(timeRef.current);
  }, []);

  const toggleQ = (i) =>
    setRevealedQs((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const canAdvance = step === 1 ? destarchProg >= 1 : true;

  return (
    <div className="h-screen flex flex-col bg-background font-body overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Sun className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">
                  Photosynthesis &amp; Starch Production
                </h1>
                <p className="text-xs text-muted-foreground">Biology · Comparative Experiment</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`gap-1.5 text-xs ${autoPlay ? "border-green-500 text-green-600" : ""}`}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {autoPlay ? "Pause" : "Auto"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Step progress bar ── */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="shrink-0 bg-background border-b border-border px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5">
            {STEPS.slice(1, -1).map((s, i) => (
              <button key={i}
                onClick={() => goTo(i + 1)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 < step ? "bg-green-400" : i + 1 === step ? "bg-green-500" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="max-w-5xl mx-auto flex justify-between mt-1">
            {STEPS.slice(1, -1).map((s, i) => (
              <span key={i} className={`text-[9px] font-medium flex-1 text-center transition-colors ${
                i + 1 === step ? "text-green-600" : "text-muted-foreground/40"
              }`}>{s.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Slide area ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div key={step} custom={direction} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

              {/* ════════════ STEP 0: INTRO ════════════ */}
              {step === 0 && (
                <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
                  <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}>
                    <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Sun className="w-10 h-10 text-green-600" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold mb-3">
                      Biology · Photosynthesis
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                      Photosynthesis is Necessary for Starch
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      This experiment proves that{" "}
                      <strong className="text-foreground">light is essential</strong> for starch production.
                      We compare two identical plants — one in sunlight, one in darkness — and use iodine to
                      reveal a{" "}
                      <span className="text-indigo-700 font-semibold">dramatic difference</span>.
                    </p>
                  </motion.div>

                  <div className="w-full max-w-sm mx-auto h-56">
                    <PhotoIntroSVG />
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[
                      { label: "Plants", value: "2", sub: "Light vs. Darkness" },
                      { label: "Key Variable", value: "Light", sub: "all else identical" },
                      { label: "Test Reagent", value: "I₂", sub: "Lugol's iodine" },
                    ].map((s) => (
                      <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                        <p className="text-xl font-extrabold font-heading text-green-600">{s.value}</p>
                        <p className="text-xs font-semibold text-foreground">{s.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Core Question</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "If photosynthesis requires light to produce glucose — and glucose is stored as starch — then
                      <strong className="text-foreground"> a leaf kept in darkness should contain no starch</strong>.
                      Can we prove this?"
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Press <strong>Next</strong> or <strong>Auto</strong> to begin. Some steps require your interaction.
                  </p>
                </div>
              )}

              {/* ════════════ STEP 1: DESTARCH ════════════ */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-slate-600/30 bg-gradient-to-br from-slate-900/20 to-slate-800/10 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}>
                    <div className="w-full max-w-xs">
                      <DestarchSVG progress={destarchProg} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 mb-2">
                        Step 1 of 7
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Destarch Both Plants</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Before the experiment, both plants are placed in complete darkness for{" "}
                      <strong className="text-foreground">48 hours</strong>. This removes all existing starch from
                      the leaves — giving both an identical starting point of{" "}
                      <span className="text-violet-700 font-semibold">zero starch</span>.
                    </p>

                    <div className="rounded-2xl border border-slate-500/25 bg-slate-500/5 p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why this matters</p>
                      {[
                        "Without destarching, existing starch would confuse results",
                        "Starch reserves are used up in respiration during darkness",
                        "Both plants start with identical, zero-starch conditions",
                        "Any starch found later is definitely new — made during the experiment",
                      ].map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.1 }} className="flex items-start gap-2">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-violet-500" />
                          <p className="text-sm">{f}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={startDestarch} disabled={destarchRunning || destarchProg >= 1}
                        className="flex-1 gap-2 bg-slate-700 hover:bg-slate-800 text-white">
                        <Moon className="w-4 h-4" />
                        {destarchProg >= 1 ? "Destarched ✓" : destarchRunning ? "Running…" : "Start 48hr Dark Period"}
                      </Button>
                      {destarchProg > 0 && destarchProg < 1 && (
                        <Button variant="outline" onClick={resetDestarch} className="gap-2">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {destarchProg >= 1 && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-violet-500/8 border border-violet-500/25 text-center">
                        <p className="text-sm font-bold text-violet-700">
                          ✓ All starch reserves depleted — ready to proceed!
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════ STEP 2: SETUP ════════════ */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-green-500/25 bg-gradient-to-br from-card to-green-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 310 }}>
                    <div className="w-full max-w-sm">
                      <SetupSVG />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 mb-2">
                        Step 2 of 7
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Light vs. Dark Setup</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Place one destarched plant in bright sunlight and the other in a sealed{" "}
                      <strong className="text-foreground">dark chamber</strong>. Everything else — temperature,
                      water, soil — remains identical. Light is the{" "}
                      <span className="text-green-700 font-semibold">only variable</span>.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          title: "Light Plant", icon: Sun, items: [
                            "Full sunlight exposure", "Chlorophyll absorbs energy", "Active photosynthesis",
                            "Green, healthy appearance",
                          ], color: "text-green-700", bg: "bg-green-500/8", border: "border-green-500/25",
                        },
                        {
                          title: "Dark Plant", icon: Moon, items: [
                            "Zero light reaches leaves", "Chlorophyll inactive", "No photosynthesis",
                            "Muted, still appearance",
                          ], color: "text-slate-600", bg: "bg-slate-500/8", border: "border-slate-500/25",
                        },
                      ].map((side) => (
                        <div key={side.title} className={`rounded-2xl border ${side.border} ${side.bg} p-3`}>
                          <div className="flex items-center gap-2 mb-2">
                            <side.icon className={`w-4 h-4 ${side.color}`} />
                            <p className={`font-bold font-heading text-sm ${side.color}`}>{side.title}</p>
                          </div>
                          {side.items.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 + i * 0.08 }}
                              className="flex items-center gap-1.5 mt-1">
                              <span className={`w-1 h-1 rounded-full ${side.color.replace("text-", "bg-")}`} />
                              <p className="text-xs text-muted-foreground">{item}</p>
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs text-amber-700 font-medium">
                        Both plants received identical treatment — only the{" "}
                        <strong>presence or absence of light</strong> differs. This makes our experiment a fair test.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════ STEP 3: TIMELAPSE ════════════ */}
              {step === 3 && (
                <div className="flex flex-col gap-5 w-full">
                  <div className="text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                      Step 3 of 7 — Interactive
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-1">
                      Time-lapse: Photosynthesis in Action
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Zoom into a single leaf cell. Watch starch accumulate in the light leaf — while the dark leaf stays inactive.
                    </p>
                  </div>

                  {/* Dual cellular view */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { side: "light", label: "Light Leaf", sublabel: "Chloroplasts ACTIVE", color: "border-green-500/30 bg-green-500/5" },
                      { side: "dark",  label: "Dark Leaf",  sublabel: "Chloroplasts INACTIVE", color: "border-slate-500/25 bg-slate-500/5" },
                    ].map(({ side, label, sublabel, color }) => (
                      <div key={side} className={`rounded-2xl border-2 ${color} p-3`}>
                        <p className={`text-xs font-bold text-center mb-2 ${side === "light" ? "text-green-700" : "text-slate-500"}`}>
                          {label}
                        </p>
                        <div className="h-40 sm:h-48">
                          <TimelapseSVG side={side} intensity={timeIntensity} />
                        </div>
                        <p className={`text-[10px] font-semibold text-center mt-1 ${side === "light" ? "text-green-600" : "text-slate-400"}`}>
                          {sublabel}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Starch level indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-green-700">Starch level (Light)</span>
                        <span className="text-green-600">{Math.round(timeIntensity * 100)}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div className="h-full bg-indigo-600 rounded-full"
                          animate={{ width: `${timeIntensity * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500">Starch level (Dark)</span>
                        <span className="text-slate-400">0%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-slate-300 rounded-full" style={{ width: "0%" }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={startTimelapse} disabled={timeRunning || timeIntensity >= 1}
                      className="gap-2 bg-amber-600 hover:bg-amber-700 text-white min-w-[180px]">
                      <Play className="w-4 h-4" />
                      {timeIntensity >= 1 ? "Time-lapse Complete ✓" : timeRunning ? "Simulating…" : "▶  Run Time-lapse (6 hrs)"}
                    </Button>
                    {timeIntensity > 0 && (
                      <Button variant="outline" onClick={resetTimelapse} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {timeIntensity >= 1 && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-center">
                      <p className="text-sm font-bold text-indigo-700 mb-1">Observation complete!</p>
                      <p className="text-xs text-muted-foreground">
                        The light leaf has accumulated significant starch. The dark leaf shows none.
                        Proceed to test this chemically with iodine.
                      </p>
                    </motion.div>
                  )}

                  {/* Key insight */}
                  <div className="p-3 rounded-xl bg-card border border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Inside the cell</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sunlight → chlorophyll absorbs photons → glucose molecules form → glucose chains build into
                      <strong className="text-foreground"> starch granules</strong> stored in chloroplasts.
                      Without light, none of this chain reaction can start.
                    </p>
                  </div>
                </div>
              )}

              {/* ════════════ STEP 4: BOIL ════════════ */}
              {step === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-blue-500/25 bg-gradient-to-br from-card to-blue-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}>
                    <div className="w-full max-w-sm">
                      <DualBoilSVG />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 mb-2">
                        Step 4 of 7 — Starch Test Begins
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Boil Both Leaves in Water</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Remove a leaf from each plant and boil them{" "}
                      <strong className="text-foreground">simultaneously in boiling water</strong> for 2–3 minutes.
                      This stops all enzyme activity and makes the cell membranes permeable for the next steps.
                    </p>
                    <div className="rounded-2xl border border-blue-500/25 bg-blue-500/5 p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Simultaneously testing both</p>
                      {[
                        "Leaf from light plant: dark green, healthy",
                        "Leaf from dark plant: slightly paler, less active",
                        "Both treated identically from this point on",
                        "Kills enzymes — preserves the starch state",
                      ].map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.1 }} className="flex items-start gap-2">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500" />
                          <p className="text-sm">{f}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs text-amber-700 font-medium">
                        Both leaves receive <strong>exactly the same</strong> treatment from here on — the only
                        difference will be the amount of starch inside each leaf.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════ STEP 5: ETHANOL ════════════ */}
              {step === 5 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-green-500/25 bg-gradient-to-br from-card to-green-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}>
                    <div className="w-full max-w-sm">
                      <DualEthanolSVG />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 mb-2">
                        Step 5 of 7 — Decolorisation
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Ethanol — Remove Chlorophyll</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Both leaves are placed in hot ethanol (via a water bath) until all{" "}
                      <span className="text-green-600 font-semibold">green chlorophyll</span> dissolves out.
                      Both leaves become <strong className="text-foreground">pale yellow-white</strong> —
                      preparing them for a clear iodine reading.
                    </p>
                    <div className="rounded-2xl border border-green-500/25 bg-green-500/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Why remove chlorophyll?
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Chlorophyll is a{" "}
                        <strong className="text-foreground">deep green pigment</strong> that would mask the
                        blue-black colour of iodine reacting with starch. Removing it makes the test result
                        <span className="text-green-700 font-semibold"> visually clear and unambiguous</span>.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      {[
                        { label: "Light leaf", state: "Pale yellow — ready", color: "text-green-700", bg: "bg-green-500/8 border-green-500/25" },
                        { label: "Dark leaf", state: "Pale cream — ready", color: "text-slate-600", bg: "bg-slate-500/8 border-slate-500/25" },
                      ].map((s) => (
                        <div key={s.label} className={`rounded-xl border p-3 ${s.bg}`}>
                          <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{s.state}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      After rinsing in warm water, both leaves are ready for the iodine test.
                    </p>
                  </div>
                </div>
              )}

              {/* ════════════ STEP 6: IODINE TEST ════════════ */}
              {step === 6 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-3xl border-2 p-4 flex items-center justify-center transition-colors duration-1000 ${
                      iodineRevealed
                        ? "border-indigo-500/50 bg-gradient-to-br from-indigo-950/10 to-violet-900/10"
                        : "border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5"
                    }`}
                    style={{ minHeight: 320 }}>
                    <div className="w-full max-w-sm">
                      <DualIodineSVG revealed={iodineRevealed} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                        Step 6 of 7 — The Payoff!
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
                        Add Iodine to Both Leaves
                      </h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Place both decolorised leaves in petri dishes and apply{" "}
                      <strong className="text-foreground">Lugol's iodine solution</strong> to each simultaneously.
                      Watch carefully — the contrast will be{" "}
                      <span className="text-indigo-700 font-semibold">unmistakeable</span>.
                    </p>

                    {!iodineRevealed ? (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={() => setIodineRevealed(true)}
                          className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm py-6 rounded-2xl shadow-lg">
                          <FlaskConical className="w-5 h-5" />
                          Apply Iodine to Both Leaves →
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-3">
                        <div className="rounded-2xl border border-indigo-500/35 bg-indigo-500/5 p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-indigo-700 shrink-0" />
                            <p className="font-bold text-sm text-indigo-700">Light Leaf → Deep Blue-Black</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Iodine molecules entered the starch helices and turned
                            the characteristic blue-black. <strong>Starch is present.</strong>
                          </p>
                        </div>
                        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-amber-700 shrink-0" />
                            <p className="font-bold text-sm text-amber-700">Dark Leaf → Remains Brown-Orange</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            No starch to react with — iodine keeps its natural colour.
                            <strong> No starch formed in darkness.</strong>
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {iodineRevealed && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                        className="p-4 rounded-2xl bg-card border border-border text-center">
                        <p className="text-sm font-bold text-foreground mb-1">This proves:</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong className="text-green-700">Light → Photosynthesis → Starch.</strong>{" "}
                          Without light, the chain breaks. The iodine test is direct chemical evidence.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════ STEP 7: DISCOVERY QUESTIONS ════════════ */}
              {step === 7 && (
                <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 text-xs font-semibold mb-3">
                      Step 7 of 7 — Discovery Learning
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                      Think Like a Scientist
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tap each question to reveal the scientific reasoning. Try answering first!
                    </p>
                  </div>

                  <div className="space-y-3">
                    {DISCOVERY_QS.map((item, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <button
                          onClick={() => toggleQ(i)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                            revealedQs.includes(i) ? `${item.border} ${item.bg}` : "border-border bg-card hover:border-green-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 text-lg font-extrabold font-heading shrink-0 ${item.color}`}>
                              {i + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-foreground">{item.q}</p>
                              <AnimatePresence>
                                {revealedQs.includes(i) && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`text-xs mt-2 leading-relaxed ${item.color}`}
                                  >
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
                      className="p-4 rounded-2xl bg-green-500/8 border border-green-500/25 text-center">
                      <p className="text-sm font-bold text-green-700">
                        🎉 All questions explored — ready for the conclusion!
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ════════════ STEP 8: CONCLUSION ════════════ */}
              {step === 8 && (
                <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold mb-3">
                      ✅ Experiment Complete
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                      Conclusion
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      What this experiment proved about the relationship between light and starch.
                    </p>
                  </div>

                  {/* Side-by-side final result */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        title: "Light Plant", icon: Sun, result: "STARCH PRESENT",
                        detail: "Blue-black with iodine. Photosynthesis occurred — glucose was produced and stored as starch.",
                        color: "text-indigo-700", bg: "bg-indigo-500/8", border: "border-indigo-500/30",
                        dot: "bg-indigo-700",
                      },
                      {
                        title: "Dark Plant", icon: Moon, result: "NO STARCH",
                        detail: "Brown with iodine. No photosynthesis — without light, no glucose or starch could be made.",
                        color: "text-amber-700", bg: "bg-amber-500/8", border: "border-amber-500/30",
                        dot: "bg-amber-600",
                      },
                    ].map((s) => (
                      <motion.div key={s.title}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border-2 ${s.border} ${s.bg} p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <s.icon className={`w-4 h-4 ${s.color}`} />
                          <p className={`font-bold font-heading text-sm ${s.color}`}>{s.title}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 mb-2`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                          <p className={`text-xs font-bold ${s.color}`}>{s.result}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Equation */}
                  <div className="p-5 rounded-2xl bg-green-500/8 border border-green-500/25 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-3">Photosynthesis Equation</p>
                    <p className="text-base font-extrabold font-heading text-foreground">
                      6CO₂ + 6H₂O{" "}
                      <span className="text-amber-500">+ light energy</span>
                      {" "}→{" "}
                      <span className="text-green-600">C₆H₁₂O₆ + 6O₂</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Glucose (C₆H₁₂O₆) is then converted to starch for storage in leaf cells.
                    </p>
                  </div>

                  {/* Evidence chain */}
                  <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Chain of Evidence
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      {[
                        { label: "Sunlight", c: "bg-amber-100 text-amber-800 border-amber-200" },
                        { label: "→", c: "text-muted-foreground" },
                        { label: "Chlorophyll absorbs light", c: "bg-green-100 text-green-800 border-green-200" },
                        { label: "→", c: "text-muted-foreground" },
                        { label: "Photosynthesis", c: "bg-emerald-100 text-emerald-800 border-emerald-200" },
                        { label: "→", c: "text-muted-foreground" },
                        { label: "Glucose produced", c: "bg-lime-100 text-lime-800 border-lime-200" },
                        { label: "→", c: "text-muted-foreground" },
                        { label: "Starch stored", c: "bg-indigo-100 text-indigo-800 border-indigo-200" },
                        { label: "→", c: "text-muted-foreground" },
                        { label: "Iodine → Blue-black ✓", c: "bg-violet-100 text-violet-800 border-violet-200" },
                      ].map((item, i) => (
                        <span key={i}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${item.c}`}>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Conclusion statement */}
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="p-5 rounded-2xl border-2 border-violet-500/30 bg-violet-500/5 text-center">
                    <p className="text-lg font-extrabold font-heading text-violet-700 mb-2">
                      "Photosynthesis is necessary for starch production."
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This experiment provides direct, chemical evidence. Light enables photosynthesis.
                      Photosynthesis produces glucose. Glucose is stored as starch. Iodine reveals it.
                      Without light — the entire chain breaks.
                    </p>
                  </motion.div>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Nav ── */}
      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 0} className="gap-2 min-w-[90px]">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div key={i}
                animate={{ width: i === step ? 20 : 8, backgroundColor: i === step ? "#16a34a" : "hsl(220,14%,85%)" }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={handleNext} disabled={!canAdvance}
              className="gap-2 min-w-[90px] bg-green-600 hover:bg-green-700 text-white">
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleReset}
              className="gap-2 min-w-[90px] bg-green-600 hover:bg-green-700 text-white">
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
