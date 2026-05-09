import React, { useState } from "react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell      from "@/components/lab/ExperimentShell";
import ThermalIntro         from "@/components/thermal/ThermalIntro";
import ThermalLab           from "@/components/thermal/ThermalLab";
import ThermalData          from "@/components/thermal/ThermalData";
import ThermalConclusion    from "@/components/thermal/ThermalConclusion";

const STAGES = [
  { id: "intro",      label: "Introduction" },
  { id: "lab",        label: "Experiment"   },
  { id: "data",       label: "Data & Graph" },
  { id: "conclusion", label: "Conclusion"   },
];

const THEME = {
  iconBg:    "bg-orange-500/10",
  iconColor: "text-orange-600",
  done:      "bg-orange-500",
  current:   "bg-orange-400",
  label:     "text-orange-600",
  dot:       "hsl(25,95%,53%)",
  button:    "bg-orange-600 hover:bg-orange-700 text-white border-0",
};

const STAGE_COMPONENTS = [ThermalIntro, ThermalLab, ThermalData, ThermalConclusion];

function ThermalIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v10m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" strokeLinecap="round" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThermalExperiment() {
  const [readings, setReadings] = useState([]);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setReadings([]),
  );

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Thermal Expansion"
      subject="Physics · Thermodynamics · ΔL = αL₀ΔT"
      icon={ThermalIcon}
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
