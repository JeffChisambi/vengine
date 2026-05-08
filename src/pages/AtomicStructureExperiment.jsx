import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, Atom } from "lucide-react";
import { Link } from "react-router-dom";
import StageIntro from "@/components/atomic/StageIntro";
import StageThomson from "@/components/atomic/StageThomson";
import StageObservations from "@/components/atomic/StageObservations";
import StageNucleus from "@/components/atomic/StageNucleus";
import StageEmptySpace from "@/components/atomic/StageEmptySpace";
import StageSummary from "@/components/atomic/StageSummary";

const STAGES = [
  { id: "intro",        label: "Intro",       short: "0" },
  { id: "thomson",      label: "Plum Pudding", short: "1" },
  { id: "observations", label: "Experiment",   short: "2" },
  { id: "nucleus",      label: "Nucleus",      short: "3" },
  { id: "empty",        label: "Empty Space",  short: "4" },
  { id: "summary",      label: "Summary",      short: "5" },
];

const TOTAL = STAGES.length;

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function AtomicStructureExperiment() {
  const [step, setStep]  = useState(0);
  const [direction, setDir] = useState(1);

  const goTo = (n) => { setDir(n > step ? 1 : -1); setStep(n); };
  const next  = () => { if (step < TOTAL - 1) goTo(step + 1); };
  const back  = () => { if (step > 0) goTo(step - 1); };
  const reset = () => { setDir(-1); setStep(0); };

  const StageComponent = [
    StageIntro, StageThomson, StageObservations,
    StageNucleus, StageEmptySpace, StageSummary,
  ][step];

  return (
    <div className="h-screen flex flex-col bg-[#0d1f17] font-body overflow-hidden text-white">

      {/* ── Header ── */}
      <header className="shrink-0 z-20 bg-[#0d1f17]/95 backdrop-blur-xl border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/40 hover:text-white/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                <Atom className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none text-white">
                  Atomic Structure
                </h1>
                <p className="text-xs text-white/40">Rutherford's Discovery · Chemistry</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost" size="sm" onClick={reset}
            className="text-white/40 hover:text-white/80 hover:bg-white/5"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* ── Stage progress ── */}
      <div className="shrink-0 border-b border-white/8 px-4 py-2 bg-[#0d1f17]/80">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5">
          {STAGES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)} className="flex-1 group flex flex-col items-center gap-1">
              <div className={`w-full h-1 rounded-full transition-all duration-400 ${
                i < step  ? "bg-green-600" :
                i === step ? "bg-green-400" :
                             "bg-white/10"
              }`} />
              <span className={`text-[9px] font-medium transition-colors hidden sm:block ${
                i === step ? "text-green-400" : "text-white/25"
              }`}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Slide area ── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <StageComponent onNext={next} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav ── */}
      <footer className="shrink-0 bg-[#0d1f17]/95 backdrop-blur-xl border-t border-white/8 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline" onClick={back} disabled={step === 0}
            className="gap-2 min-w-[90px] border-white/15 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-1.5">
            {STAGES.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => goTo(i)}
                animate={{
                  width: i === step ? 20 : 8,
                  backgroundColor: i === step ? "#4ade80" : "rgba(255,255,255,0.15)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
              />
            ))}
          </div>

          {step < TOTAL - 1 ? (
            <Button
              onClick={next}
              className="gap-2 min-w-[90px] bg-green-700 hover:bg-green-600 text-white border-0"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={reset}
              className="gap-2 min-w-[90px] bg-green-700 hover:bg-green-600 text-white border-0"
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
