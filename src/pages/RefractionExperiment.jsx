import React, { useState } from "react";
import { useExperimentNav }   from "@/hooks/useExperimentNav";
import ExperimentShell         from "@/components/lab/ExperimentShell";
import RefractionIntro         from "@/components/refraction/RefractionIntro";
import RefractionLab           from "@/components/refraction/RefractionLab";
import RefractionData          from "@/components/refraction/RefractionData";
import RefractionConclusion    from "@/components/refraction/RefractionConclusion";

const STAGES = [
  { id: "intro",      label: "Introduction" },
  { id: "lab",        label: "Experiment"   },
  { id: "data",       label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-sky-500/10",
  iconColor: "text-sky-600",
  done:      "bg-sky-500",
  current:   "bg-sky-400",
  label:     "text-sky-600",
  dot:       "hsl(199,89%,48%)",
  button:    "bg-sky-600 hover:bg-sky-700 text-white border-0",
};

const STAGE_COMPONENTS = [RefractionIntro, RefractionLab, RefractionData, RefractionConclusion];

function RefractionIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M3 12h18" strokeLinecap="round" />
      <path d="M5 7l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RefractionExperiment() {
  const [readings, setReadings] = useState([]);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setReadings([]),
  );

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Refraction Through Glass"
      subject="Physics · Optics · Snell's Law"
      icon={RefractionIcon}
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
