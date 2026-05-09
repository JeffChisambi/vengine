import React, { useState } from "react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell      from "@/components/lab/ExperimentShell";
import PressureIntro        from "@/components/pressure/PressureIntro";
import PressureLab          from "@/components/pressure/PressureLab";
import PressureData         from "@/components/pressure/PressureData";
import PressureConclusion   from "@/components/pressure/PressureConclusion";

const STAGES = [
  { id: "intro",      label: "Introduction" },
  { id: "lab",        label: "Experiment"   },
  { id: "data",       label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-blue-500/10",
  iconColor: "text-blue-600",
  done:      "bg-blue-500",
  current:   "bg-blue-400",
  label:     "text-blue-600",
  dot:       "hsl(217,91%,60%)",
  button:    "bg-blue-600 hover:bg-blue-700 text-white border-0",
};

const STAGE_COMPONENTS = [PressureIntro, PressureLab, PressureData, PressureConclusion];

function PressureIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 12h2M8 16h2M14 12h2M14 16h2" strokeLinecap="round" />
      <path d="M4 8h16" strokeLinecap="round" />
    </svg>
  );
}

export default function PressureExperiment() {
  const [readings, setReadings] = useState([]);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setReadings([]),
  );

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Pressure in Liquids"
      subject="Physics · Fluid Pressure & Depth"
      icon={PressureIcon}
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
