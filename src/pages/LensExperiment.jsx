import React, { useState } from "react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell      from "@/components/lab/ExperimentShell";
import LensIntro            from "@/components/lens/LensIntro";
import LensLab              from "@/components/lens/LensLab";
import LensData             from "@/components/lens/LensData";
import LensConclusion       from "@/components/lens/LensConclusion";

const STAGES = [
  { id: "intro",      label: "Introduction" },
  { id: "lab",        label: "Experiment"   },
  { id: "data",       label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-violet-500/10",
  iconColor: "text-violet-600",
  done:      "bg-violet-500",
  current:   "bg-violet-400",
  label:     "text-violet-600",
  dot:       "hsl(263,70%,60%)",
  button:    "bg-violet-600 hover:bg-violet-700 text-white border-0",
};

const STAGE_COMPONENTS = [LensIntro, LensLab, LensData, LensConclusion];

function LensIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 C 8,7 8,17 12,21" strokeLinecap="round" />
      <path d="M12 3 C 16,7 16,17 12,21" strokeLinecap="round" />
    </svg>
  );
}

export default function LensExperiment() {
  const [readings, setReadings] = useState([]);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setReadings([]),
  );

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Virtual Lenses & Focal Length"
      subject="Physics · Optics · 1/f = 1/dₒ + 1/dᵢ"
      icon={LensIcon}
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
