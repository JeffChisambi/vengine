import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import PressureIntro from "@/components/pressure/PressureIntro";
import PressureLab from "@/components/pressure/PressureLab";
import PressureData from "@/components/pressure/PressureData";
import PressureConclusion from "@/components/pressure/PressureConclusion";

const STAGES = [
  { id: "intro", label: "Introduction" },
  { id: "lab", label: "Experiment" },
  { id: "data", label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion" },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function PressureExperiment() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [readings, setReadings] = useState([]);

  const goTo = (n) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const next = () => {
    if (step < STAGES.length - 1) goTo(step + 1);
  };
  const back = () => {
    if (step > 0) goTo(step - 1);
  };
  const reset = () => {
    setDir(-1);
    setStep(0);
    setReadings([]);
  };

  const StageComponents = [
    PressureIntro,
    PressureLab,
    PressureData,
    PressureConclusion,
  ];
  const StageComponent = StageComponents[step];

  return (
    <div className="h-screen flex flex-col bg-background font-body overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <path
                    d="M8 12h2M8 16h2M14 12h2M14 16h2"
                    strokeLinecap="round"
                  />
                  <path d="M4 8h16" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">
                  Pressure in Liquids
                </h1>
                <p className="text-xs text-muted-foreground">
                  Physics · Fluid Pressure & Depth
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="shrink-0 border-b border-border px-4 py-2 bg-background/80">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                  i < step
                    ? "bg-blue-500"
                    : i === step
                      ? "bg-blue-400"
                      : "bg-muted"
                }`}
              />
              <span
                className={`text-[9px] font-medium hidden sm:block transition-colors ${
                  i === step ? "text-blue-600" : "text-muted-foreground/50"
                }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto"
          >
            <StageComponent
              readings={readings}
              setReadings={setReadings}
              onNext={next}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={back}
            disabled={step === 0}
            className="gap-2 min-w-[90px]"
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
                  backgroundColor:
                    i === step ? "hsl(217,91%,60%)" : "hsl(220,14%,85%)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
              />
            ))}
          </div>
          {step < STAGES.length - 1 ? (
            <Button
              onClick={next}
              className="gap-2 min-w-[90px] bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={reset}
              className="gap-2 min-w-[90px] bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
