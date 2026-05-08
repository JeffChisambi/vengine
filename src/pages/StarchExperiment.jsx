import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Leaf,
  Play,
  Pause,
  FlaskConical,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  StarchIntroSVG,
  LeafSelectSVG,
  BoilingWaterSVG,
  EthanolSVG,
  RinsingSVG,
  IodineSVG,
} from "@/components/starch/StarchSVG";

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const LEAF_OPTIONS = [
  {
    id: "healthy",
    label: "Healthy Green Leaf",
    desc: "Full sunlight exposure — photosynthesis active all day.",
    result: "Will test POSITIVE for starch.",
    color: "text-green-700",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
  {
    id: "partial",
    label: "Partially Covered Leaf",
    desc: "Half the leaf was covered with foil — no light reached that region.",
    result: "Only uncovered half will show starch.",
    color: "text-yellow-700",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
  {
    id: "pale",
    label: "Pale / Etiolated Leaf",
    desc: "Grown in low light — very little photosynthesis occurred.",
    result: "Will test NEGATIVE for starch.",
    color: "text-lime-700",
    bg: "bg-lime-500/10",
    border: "border-lime-500/30",
  },
  {
    id: "dark",
    label: "Dark-stored Leaf",
    desc: "Kept in darkness for 48 hours — starch has been transported away.",
    result: "Will test NEGATIVE for starch.",
    color: "text-emerald-800",
    bg: "bg-emerald-900/10",
    border: "border-emerald-900/20",
  },
];

const STEPS = [
  { label: "Intro", tag: "Overview" },
  { label: "Select Leaf", tag: "Step 1" },
  { label: "Boil in Water", tag: "Step 2" },
  { label: "Ethanol Bath", tag: "Step 3" },
  { label: "Rinse", tag: "Step 4" },
  { label: "Iodine Test", tag: "Step 5" },
  { label: "Results", tag: "Complete" },
];

const TOTAL_STEPS = STEPS.length;

export default function StarchExperiment() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [iodineRevealed, setIodineRevealed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };
  const handleNext = () => { if (step < TOTAL_STEPS - 1) goTo(step + 1); };
  const handleBack = () => { if (step > 0) goTo(step - 1); };
  const handleReset = () => {
    setAutoPlay(false);
    setDirection(-1);
    setStep(0);
    setSelectedLeaf(null);
    setIodineRevealed(false);
  };

  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL_STEPS - 1) { setAutoPlay(false); return; }
    if (step === 1 && !selectedLeaf) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 3500);
    return () => clearTimeout(t);
  }, [autoPlay, step, selectedLeaf]);

  const canAdvance = step === 1 ? !!selectedLeaf : true;
  const leafConfig = LEAF_OPTIONS.find((l) => l.id === selectedLeaf);
  const hasStarch = selectedLeaf && selectedLeaf !== "pale" && selectedLeaf !== "dark";

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
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">Test for Starch in Leaves</h1>
                <p className="text-xs text-muted-foreground">Biology · Photosynthesis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className={`gap-1.5 text-xs ${autoPlay ? "border-green-500 text-green-600" : ""}`}
              disabled={step === 1 && !selectedLeaf}
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

      {/* Step progress bar */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="shrink-0 bg-background border-b border-border px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-2">
            {STEPS.slice(1, -1).map((s, i) => (
              <button
                key={i}
                onClick={() => { if (i + 1 <= step) goTo(i + 1); }}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 < step ? "bg-green-400" : i + 1 === step ? "bg-green-500" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="max-w-5xl mx-auto flex justify-between mt-1">
            {STEPS.slice(1, -1).map((s, i) => (
              <span
                key={i}
                className={`text-[9px] font-medium transition-colors flex-1 text-center ${
                  i + 1 === step ? "text-green-600" : "text-muted-foreground/50"
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

              {/* ── STEP 0: Intro ── */}
              {step === 0 && (
                <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold mb-3">
                      Biology · Photosynthesis
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
                      Test for Starch in Leaves
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      Plants produce{" "}
                      <strong className="text-foreground">glucose</strong> through photosynthesis, which is quickly converted into{" "}
                      <strong className="text-foreground">starch</strong> for storage. Iodine solution reveals exactly
                      where starch is stored — turning from brown to{" "}
                      <strong className="text-indigo-700">deep blue-black</strong>{" "}
                      in the presence of starch.
                    </p>
                  </motion.div>

                  <div className="w-full max-w-xs mx-auto h-52">
                    <StarchIntroSVG />
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[
                      { label: "Steps", value: "5", sub: "Boil → Ethanol → Rinse → Iodine" },
                      { label: "Reagent", value: "I₂", sub: "Iodine solution (Lugol's)" },
                      { label: "Positive Result", value: "Blue-black", sub: "starch present" },
                    ].map((s) => (
                      <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                        <p className="text-xl font-extrabold font-heading text-green-600">{s.value}</p>
                        <p className="text-xs font-semibold text-foreground">{s.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Key Concept</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Chlorophyll <strong className="text-foreground">masks</strong> the iodine colour change — we must
                      remove it first using ethanol. This is why the procedure has multiple steps before adding iodine.
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Press <strong>Next</strong> or <strong>Auto</strong> to begin the experiment.
                  </p>
                </div>
              )}

              {/* ── STEP 1: Select Leaf ── */}
              {step === 1 && (
                <div className="flex flex-col gap-6 w-full">
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold mb-3">
                      Step 1 of 5
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Select Your Leaf</h2>
                    <p className="text-muted-foreground text-sm">
                      Choose a leaf to test. Different leaves will give different results — think about why!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {LEAF_OPTIONS.map((leaf) => (
                      <motion.button
                        key={leaf.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedLeaf(leaf.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${
                          selectedLeaf === leaf.id
                            ? `${leaf.border} ${leaf.bg}`
                            : "border-border bg-card hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-24 h-24 shrink-0">
                            <LeafSelectSVG leafType={leaf.id} />
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-bold font-heading text-sm ${selectedLeaf === leaf.id ? leaf.color : "text-foreground"}`}>
                              {leaf.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{leaf.desc}</p>
                            {selectedLeaf === leaf.id && (
                              <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs font-semibold mt-2 ${leaf.color}`}
                              >
                                {leaf.result}
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {!selectedLeaf && (
                    <p className="text-center text-xs text-muted-foreground">
                      Select a leaf to continue →
                    </p>
                  )}
                </div>
              )}

              {/* ── STEP 2: Boiling in Water ── */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-blue-500/30 bg-gradient-to-br from-card to-blue-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}
                  >
                    <div className="w-full max-w-xs">
                      <BoilingWaterSVG />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 mb-2">
                        Step 2 of 5
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Boil the Leaf in Water</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Place the <strong className="text-foreground">{leafConfig?.label}</strong> into boiling water for
                      2–3 minutes. The heat <strong className="text-foreground">denatures enzymes</strong> and stops all
                      metabolic reactions inside the leaf, preserving its current chemical state.
                    </p>
                    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What happens</p>
                      {[
                        "Water bubbles actively around the leaf",
                        "Enzymes are denatured — reactions stop",
                        "Leaf cell membranes soften slightly",
                        "Leaf colour begins to dull",
                      ].map((fact, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-500" />
                          <p className="text-sm">{fact}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <p className="text-xs text-amber-700 font-medium">
                        Why not add iodine directly? — The leaf is still <strong>green</strong>. Chlorophyll would
                        mask any colour change from iodine. We must remove it first.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Ethanol Decolorization ── */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-green-500/30 bg-gradient-to-br from-card to-green-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}
                  >
                    <div className="w-full max-w-xs">
                      <EthanolSVG progress={1} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 mb-2">
                        Step 3 of 5 — Most Important!
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Remove Chlorophyll</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Place the leaf in <strong className="text-foreground">ethanol (alcohol)</strong> inside a hot
                      water bath. Watch the <span className="text-green-600 font-semibold">green chlorophyll</span> dissolve
                      and swirl out of the leaf, leaving it <strong className="text-foreground">pale yellow-white</strong>.
                    </p>

                    {/* Visual emphasis box */}
                    <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Why this step is critical
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Chlorophyll is a <strong className="text-foreground">dark green pigment</strong>. If it
                        remains in the leaf, it makes the blue-black colour of iodine impossible to see. Removing it
                        is what makes the starch test <span className="text-green-700 font-semibold">visible</span>.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sequence of changes</p>
                      {[
                        { label: "Green pigment swirls into ethanol", color: "bg-green-500" },
                        { label: "Leaf slowly turns pale/yellow", color: "bg-yellow-400" },
                        { label: "Ethanol turns bright green", color: "bg-emerald-400" },
                        { label: "Leaf is now decolorised", color: "bg-slate-300" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.12 }}
                          className="flex items-center gap-2"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                          <p className="text-sm">{item.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Rinse ── */}
              {step === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border-2 border-sky-500/30 bg-gradient-to-br from-card to-sky-500/5 p-4 flex items-center justify-center"
                    style={{ minHeight: 300 }}
                  >
                    <div className="w-full max-w-xs">
                      <RinsingSVG />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 mb-2">
                        Step 4 of 5
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Rinse in Warm Water</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Transfer the decolorised leaf into warm water. The leaf is <strong className="text-foreground">brittle</strong>{" "}
                      from the ethanol — warm water re-softens it and removes any remaining alcohol, preparing it
                      for the iodine test.
                    </p>
                    <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Purpose of rinsing</p>
                      {[
                        "Removes ethanol residue from the leaf",
                        "Re-hydrates and softens the brittle tissue",
                        "Allows iodine to penetrate cells evenly",
                        "Leaf is now fully prepared for testing",
                      ].map((fact, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 bg-sky-500" />
                          <p className="text-sm">{fact}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                      <p className="text-xs text-green-700 font-medium">
                        The leaf should now appear <strong>pale yellow-white</strong> — almost translucent.
                        This is the correct appearance before adding iodine.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Iodine Test ── */}
              {step === 5 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-3xl border-2 p-4 flex items-center justify-center transition-colors duration-1000 ${
                      iodineRevealed && hasStarch
                        ? "border-indigo-500/50 bg-gradient-to-br from-indigo-950/10 to-violet-900/10"
                        : "border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5"
                    }`}
                    style={{ minHeight: 300 }}
                  >
                    <div className="w-full max-w-xs">
                      <IodineSVG leafType={selectedLeaf} revealed={iodineRevealed} />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 mb-2">
                        Step 5 of 5 — The Payoff!
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Add Iodine Solution</h2>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use the dropper to apply <strong className="text-foreground">Lugol's iodine solution</strong>{" "}
                      onto the pale leaf. Watch what happens — the reaction is almost instant!
                    </p>

                    {!iodineRevealed ? (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => setIodineRevealed(true)}
                          className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm py-6 rounded-2xl shadow-lg"
                        >
                          <FlaskConical className="w-5 h-5" />
                          Apply Iodine Solution →
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-4 space-y-3 ${
                          hasStarch
                            ? "border-indigo-500/40 bg-indigo-500/5"
                            : "border-amber-500/30 bg-amber-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl`}>{hasStarch ? "🔵" : "🟤"}</span>
                          <div>
                            <p className={`font-bold font-heading text-sm ${hasStarch ? "text-indigo-700" : "text-amber-700"}`}>
                              {hasStarch
                                ? selectedLeaf === "partial"
                                  ? "Partial Blue-Black — Starch in Exposed Area Only!"
                                  : "Deep Blue-Black — Starch Present!"
                                : "Remains Brown-Orange — No Starch Detected"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {hasStarch
                                ? "Iodine molecules fit inside starch's helical structure, creating the intense blue-black colour."
                                : "Without starch, iodine remains its natural brown colour."}
                            </p>
                          </div>
                        </div>
                        <div className={`pt-2 border-t ${hasStarch ? "border-indigo-500/20" : "border-amber-500/20"}`}>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">What this proves:</p>
                          <p className="text-sm text-foreground leading-relaxed">{leafConfig?.result}</p>
                        </div>
                      </motion.div>
                    )}

                    <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Iodine test interpretation</p>
                      {[
                        { result: "Blue-black", meaning: "Starch present — photosynthesis occurred", dot: "bg-indigo-700" },
                        { result: "Brown-orange", meaning: "No starch — little or no photosynthesis", dot: "bg-amber-600" },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${r.dot}`} />
                          <p className="text-xs"><strong>{r.result}</strong> → {r.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 6: Results & Summary ── */}
              {step === 6 && (
                <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-700 text-xs font-semibold mb-3">
                      ✅ Experiment Complete
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Results & Conclusions</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedLeaf
                        ? `You tested the ${leafConfig?.label}.`
                        : "Review what each leaf type reveals about photosynthesis."}
                    </p>
                  </div>

                  {/* Tested leaf result */}
                  {selectedLeaf && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border-2 ${leafConfig?.border} ${leafConfig?.bg}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 shrink-0">
                          <IodineSVG leafType={selectedLeaf} revealed={true} />
                        </div>
                        <div>
                          <p className={`font-extrabold font-heading text-lg ${leafConfig?.color}`}>
                            {leafConfig?.label}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{leafConfig?.result}</p>
                          <p className={`text-xs font-bold mt-2 ${hasStarch ? "text-indigo-700" : "text-amber-700"}`}>
                            Iodine result: {hasStarch ? selectedLeaf === "partial" ? "Blue-black (exposed area only)" : "Deep blue-black" : "Remains brown — no starch"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* All leaf results summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LEAF_OPTIONS.map((leaf, i) => {
                      const pos = leaf.id !== "pale" && leaf.id !== "dark";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`p-4 rounded-2xl border ${leaf.border} ${leaf.bg}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2.5 h-2.5 rounded-full ${pos ? "bg-indigo-600" : "bg-amber-500"}`} />
                            <span className={`text-xs font-bold ${leaf.color}`}>{pos ? "Starch Present" : "No Starch"}</span>
                          </div>
                          <p className={`font-bold font-heading text-sm ${leaf.color}`}>{leaf.label}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{leaf.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Key conclusion */}
                  <div className="p-5 rounded-2xl bg-card border border-border">
                    <p className="text-sm font-semibold text-foreground mb-2">🌿 The Big Picture</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The starch test proves that{" "}
                      <strong className="text-foreground">light is essential for photosynthesis</strong>. Only the
                      parts of a leaf that received sunlight stored starch. Covered or dark-stored leaves had no
                      starch because photosynthesis could not occur without light energy.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Sunlight", "→", "Photosynthesis", "→", "Glucose", "→", "Starch", "→", "Iodine reveals it"].map(
                        (item, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item === "→"
                                ? "text-muted-foreground"
                                : i === 8
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                                : "bg-green-100 text-green-800 border border-green-200"
                            }`}
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2 min-w-[90px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === step ? 20 : 8,
                  backgroundColor: i === step ? "#16a34a" : "hsl(220, 14%, 85%)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
                onClick={() => { if (i !== 1 || selectedLeaf) goTo(i); }}
              />
            ))}
          </div>

          {step < TOTAL_STEPS - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canAdvance}
              className="gap-2 min-w-[90px] bg-green-600 hover:bg-green-700 text-white"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleReset}
              className="gap-2 min-w-[90px] bg-green-600 hover:bg-green-700 text-white"
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
