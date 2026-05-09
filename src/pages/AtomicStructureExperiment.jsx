import React from "react";
import { Atom } from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell      from "@/components/lab/ExperimentShell";
import StageIntro           from "@/components/atomic/StageIntro";
import StageThomson         from "@/components/atomic/StageThomson";
import StageObservations    from "@/components/atomic/StageObservations";
import StageNucleus         from "@/components/atomic/StageNucleus";
import StageEmptySpace      from "@/components/atomic/StageEmptySpace";
import StageSummary         from "@/components/atomic/StageSummary";

const STAGES = [
  { id: "intro",        label: "Intro"        },
  { id: "thomson",      label: "Plum Pudding" },
  { id: "observations", label: "Experiment"   },
  { id: "nucleus",      label: "Nucleus"      },
  { id: "empty",        label: "Empty Space"  },
  { id: "summary",      label: "Summary"      },
];

const THEME = {
  iconBg:    "bg-sky-500/10",
  iconColor: "text-sky-600",
  done:      "bg-sky-500",
  current:   "bg-sky-400",
  label:     "text-sky-600",
  dot:       "hsl(199,89%,48%)",
  button:    "bg-sky-600 hover:bg-sky-500 text-white border-0",
};

const STAGE_COMPONENTS = [
  StageIntro, StageThomson, StageObservations,
  StageNucleus, StageEmptySpace, StageSummary,
];

export default function AtomicStructureExperiment() {
  const { step, dir, goTo, next, back, reset } = useExperimentNav(STAGES.length);

  const StageComponent = STAGE_COMPONENTS[step];

  return (
    <ExperimentShell
      title="Atomic Structure"
      subject="Rutherford's Discovery · Chemistry"
      icon={Atom}
      theme={THEME}
      stages={STAGES}
      step={step}
      dir={dir}
      onGoTo={goTo}
      onNext={next}
      onBack={back}
      onReset={reset}
    >
      <StageComponent onNext={next} />
    </ExperimentShell>
  );
}
