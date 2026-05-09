import React, { useState } from "react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell     from "@/components/lab/ExperimentShell";
import PendulumIntro       from "@/components/pendulum/PendulumIntro";
import PendulumLab         from "@/components/pendulum/PendulumLab";
import PendulumData        from "@/components/pendulum/PendulumData";
import PendulumConclusion  from "@/components/pendulum/PendulumConclusion";

const STAGES = [
  { id: "intro",      label: "Introduction" },
  { id: "lab",        label: "Experiment"   },
  { id: "data",       label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-indigo-500/10",
  iconColor: "text-indigo-600",
  done:      "bg-indigo-500",
  current:   "bg-indigo-400",
  label:     "text-indigo-600",
  dot:       "hsl(245,58%,51%)",
  button:    "bg-indigo-600 hover:bg-indigo-700 text-white border-0",
};

const STAGE_COMPONENTS = [PendulumIntro, PendulumLab, PendulumData, PendulumConclusion];

function PendulumIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="2" x2="12" y2="6" strokeLinecap="round" />
      <line x1="12" y1="6" x2="18" y2="18" strokeLinecap="round" />
      <circle cx="18" cy="19" r="2" fill="currentColor" />
    </svg>
  );
}

export default function PendulumExperiment() {
  const [readings, setReadings] = useState([]);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setReadings([]),
  );

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Simple Pendulum"
      subject="Physics · Period & Length"
      icon={PendulumIcon}
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
