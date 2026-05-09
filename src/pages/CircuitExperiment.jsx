import React, { useState } from "react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell    from "@/components/lab/ExperimentShell";
import CircuitIntro       from "@/components/circuit/CircuitIntro";
import CircuitLab         from "@/components/circuit/CircuitLab";
import CircuitData        from "@/components/circuit/CircuitData";
import CircuitConclusion  from "@/components/circuit/CircuitConclusion";

const STAGES = [
  { id: "intro",      label: "Introduction" },
  { id: "lab",        label: "Experiment"   },
  { id: "data",       label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-amber-500/10",
  iconColor: "text-amber-600",
  done:      "bg-amber-500",
  current:   "bg-amber-400",
  label:     "text-amber-600",
  dot:       "hsl(38,92%,50%)",
  button:    "bg-amber-500 hover:bg-amber-600 text-white border-0",
};

const STAGE_COMPONENTS = [CircuitIntro, CircuitLab, CircuitData, CircuitConclusion];

function CircuitIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="13 2 13 9 20 9" />
      <path d="M13 2L4 13h7l-1 9 9-11h-7l1-9z" />
    </svg>
  );
}

export default function CircuitExperiment() {
  const [readings, setReadings] = useState([]);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setReadings([]),
  );

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Simple Electric Circuits"
      subject="Physics · Series & Parallel"
      icon={CircuitIcon}
      theme={THEME}
      stages={STAGES}
      step={step}
      dir={dir}
      onGoTo={goTo}
      onNext={next}
      onBack={back}
      onReset={reset}
    >
      <StageComponent readings={readings} setReadings={setReadings} onNext={next} />
    </ExperimentShell>
  );
}
