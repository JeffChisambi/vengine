import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Microscope, Play, Pause, RotateCcw } from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell     from "@/components/lab/ExperimentShell";
import {
  InterphaseSVG, ProphaseSVG, MetaphaseSVG,
  AnaphaseSVG, TelophaseSVG, CytokinesisSVG,
} from "@/components/lab/CellSVG";

const TOTAL_STEPS = 8;

const PHASES = [
  {
    name: "Interphase", color: "text-emerald-600", bg: "bg-emerald-500/10",
    border: "border-emerald-500/30", tag: "Preparation", SVG: InterphaseSVG,
    description: "The cell spends most of its life in interphase. During this stage, the cell grows, performs normal functions, and duplicates its DNA in preparation for division.",
    keyFacts: [
      "DNA replication occurs (S phase)",
      "Cell grows and produces proteins (G1 & G2)",
      "Organelles are duplicated",
      "Chromosomes are loose chromatin — not yet visible under a microscope",
    ],
  },
  {
    name: "Prophase", color: "text-pink-600", bg: "bg-pink-500/10",
    border: "border-pink-500/30", tag: "Phase 1", SVG: ProphaseSVG,
    description: "Chromatin condenses into distinct chromosomes. The nuclear envelope begins to break down, and the mitotic spindle starts to form from centrioles.",
    keyFacts: [
      "Chromatin condenses into visible chromosomes",
      "Nuclear membrane dissolves",
      "Centrioles move to opposite poles",
      "Spindle fibers begin to form",
    ],
  },
  {
    name: "Metaphase", color: "text-violet-600", bg: "bg-violet-500/10",
    border: "border-violet-500/30", tag: "Phase 2", SVG: MetaphaseSVG,
    description: "Chromosomes align along the cell's equator (metaphase plate). Spindle fibers attach to each chromosome's centromere, ready to pull them apart.",
    keyFacts: [
      "Chromosomes line up at the cell's equator",
      "Spindle fibers attach to centromeres",
      "Each chromosome is at maximum condensation",
      "Easiest phase to count chromosomes",
    ],
  },
  {
    name: "Anaphase", color: "text-orange-600", bg: "bg-orange-500/10",
    border: "border-orange-500/30", tag: "Phase 3", SVG: AnaphaseSVG,
    description: "Sister chromatids are pulled apart toward opposite poles of the cell. The cell elongates as spindle fibers shorten.",
    keyFacts: [
      "Sister chromatids separate and move to poles",
      "Spindle fibers shorten, pulling chromosomes",
      "Cell begins to elongate",
      "Each pole receives an identical set of chromosomes",
    ],
  },
  {
    name: "Telophase", color: "text-blue-600", bg: "bg-blue-500/10",
    border: "border-blue-500/30", tag: "Phase 4", SVG: TelophaseSVG,
    description: "Two new nuclei form at each pole as chromosomes decondense. The nuclear envelope re-forms around each set of chromosomes.",
    keyFacts: [
      "Two nuclei form at opposite poles",
      "Chromosomes begin to decondense",
      "Nuclear envelopes re-form",
      "Spindle fibers break down",
    ],
  },
  {
    name: "Cytokinesis", color: "text-teal-600", bg: "bg-teal-500/10",
    border: "border-teal-500/30", tag: "Final Stage", SVG: CytokinesisSVG,
    description: "The cytoplasm divides, producing two genetically identical daughter cells. In animal cells, a cleavage furrow pinches the cell in two.",
    keyFacts: [
      "Cytoplasm splits into two equal parts",
      "Two identical daughter cells are produced",
      "Each cell has the full chromosome set (diploid)",
      "In plants, a cell plate forms instead of a furrow",
    ],
  },
];

const ALL_STAGES = Array.from({ length: TOTAL_STEPS }, (_, i) => ({ id: i, label: String(i) }));

const THEME = {
  iconBg:    "bg-emerald-500/10",
  iconColor: "text-emerald-600",
  done:      "bg-emerald-400",
  current:   "bg-emerald-500",
  label:     "text-emerald-600",
  dot:       "#16a34a",
  button:    "bg-emerald-600 hover:bg-emerald-700 text-white",
};

export default function CellDivisionExperiment() {
  const [autoPlay, setAutoPlay] = useState(false);

  const resetExperimentState = () => setAutoPlay(false);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    TOTAL_STEPS,
    resetExperimentState,
  );

  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL_STEPS - 1) { setAutoPlay(false); return; }
    const t = setTimeout(() => goTo(step + 1), 3000);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  const phaseIndex   = step - 1;
  const currentPhase = phaseIndex >= 0 && phaseIndex < PHASES.length ? PHASES[phaseIndex] : null;

  const autoPlayButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setAutoPlay(!autoPlay)}
      className={`gap-1.5 text-xs ${autoPlay ? "border-emerald-500 text-emerald-600" : ""}`}
    >
      {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      {autoPlay ? "Pause" : "Auto"}
    </Button>
  );

  return (
    <ExperimentShell
      title="Cell Division — Mitosis"
      subject="Biology · Interactive"
      icon={Microscope}
      theme={THEME}
      stages={ALL_STAGES}
      step={step}
      dir={dir}
      onGoTo={goTo}
      onNext={next}
      onBack={back}
      onReset={reset}
      maxWidth="max-w-5xl"
      progressVariant="middle"
      barStages={PHASES}
      barOffset={1}
      extraHeaderControls={autoPlayButton}
    >
      <div className="min-h-full max-w-5xl mx-auto px-4 py-6 pb-24 flex flex-col justify-center">

        {/* ── INTRO ── */}
        {step === 0 && (
          <div className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Microscope className="w-10 h-10 text-emerald-600" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                Biology
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">Cell Division</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mitosis is the process by which a cell duplicates its chromosomes and divides to
                produce two genetically{" "}
                <strong className="text-foreground">identical daughter cells</strong>. It is
                fundamental to growth, repair, and asexual reproduction.
              </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { label: "Phases",      value: "6",    sub: "Interphase → Cytokinesis" },
                { label: "Chromosomes", value: "46",   sub: "in human cells" },
                { label: "Duration",    value: "1–3h", sub: "average cell cycle phase" },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl bg-card border border-border text-center">
                  <p className="text-xl font-extrabold font-heading text-emerald-600">{s.value}</p>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 w-full overflow-x-auto pb-1">
              {PHASES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i + 1)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Press <strong>Next</strong> or <strong>Auto</strong> to watch each phase animate live.
            </p>
          </div>
        )}

        {/* ── PHASE SLIDES 1–6 ── */}
        {currentPhase && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center w-full">
            <motion.div
              key={`cell-${step}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-3xl border-2 ${currentPhase.border} bg-gradient-to-br from-card to-muted/30 p-4 flex items-center justify-center`}
              style={{ minHeight: 260 }}
            >
              <div className="w-full max-w-xs">
                <currentPhase.SVG />
              </div>
            </motion.div>

            <div className="space-y-4">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${currentPhase.bg} ${currentPhase.color} mb-2`}>
                  {currentPhase.tag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">{currentPhase.name}</h2>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{currentPhase.description}</p>

              <div className={`rounded-2xl border ${currentPhase.border} ${currentPhase.bg} p-4 space-y-2`}>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Events</p>
                {currentPhase.keyFacts.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${currentPhase.color.replace("text-", "bg-")}`} />
                    <p className="text-sm">{fact}</p>
                  </motion.div>
                ))}
              </div>

              <p className={`text-xs font-medium ${currentPhase.color}`}>
                Phase {phaseIndex + 1} of {PHASES.length}
              </p>
            </div>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {step === TOTAL_STEPS - 1 && (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                ✅ Complete
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Mitosis Summary</h2>
              <p className="text-sm text-muted-foreground">Review all phases and their key events.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PHASES.map((p, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => goTo(i + 1)}
                  className={`text-left p-4 rounded-2xl border ${p.border} ${p.bg} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${p.color}`}>{p.tag}</span>
                  </div>
                  <p className={`font-bold font-heading ${p.color}`}>{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </motion.button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border text-center">
              <p className="text-sm font-semibold text-foreground mb-1">End Result</p>
              <p className="text-xs text-muted-foreground">
                1 parent cell →{" "}
                <strong className="text-emerald-600">2 identical daughter cells</strong>, each with
                the full set of chromosomes.
              </p>
            </div>
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
