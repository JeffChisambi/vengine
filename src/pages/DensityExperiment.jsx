import React, { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell     from "@/components/lab/ExperimentShell";
import BeakerSVG           from "@/components/lab/BeakerSVG";
import ScaleSVG            from "@/components/lab/ScaleSVG";
import ObjectSelector      from "@/components/lab/ObjectSelector";
import ResultsPanel        from "@/components/lab/ResultsPanel";

const INITIAL_WATER = 200;
const BEAKER_MAX    = 500;

const STAGES = [
  { id: "theory",     label: "Theory"        },
  { id: "select",     label: "Select Object" },
  { id: "mass",       label: "Measure Mass"  },
  { id: "volume",     label: "Measure Volume"},
  { id: "calculate",  label: "Calculate"     },
];

const THEME = {
  iconBg:    "bg-primary/10",
  iconColor: "text-primary",
  done:      "bg-primary",
  current:   "bg-primary/70",
  label:     "text-primary",
  dot:       "hsl(245,58%,51%)",
  button:    "bg-primary hover:bg-primary/90 text-white border-0",
};

export default function DensityExperiment() {
  const [selectedObject, setSelectedObject] = useState(null);

  const { step, dir, goTo, next, back, reset } = useExperimentNav(
    STAGES.length,
    () => setSelectedObject(null),
  );

  const canAdvance  = step === 1 ? !!selectedObject : true;
  const waterLevel  = INITIAL_WATER / BEAKER_MAX;
  const finalWaterLevel = selectedObject
    ? (INITIAL_WATER + selectedObject.volume) / BEAKER_MAX
    : waterLevel;

  return (
    <ExperimentShell
      title="Density of Irregular Objects"
      subject="Water Displacement Method"
      icon={FlaskConical}
      theme={THEME}
      stages={STAGES}
      step={step}
      dir={dir}
      onGoTo={goTo}
      onNext={next}
      onBack={back}
      onReset={reset}
      canAdvance={canAdvance}
      maxWidth="max-w-2xl"
      progressVariant="none"
    >
      <div className="min-h-full flex flex-col max-w-2xl mx-auto px-4 py-6 pb-24">

        {/* ── SLIDE 0: Theory ── */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                💡 Theory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                What is Density?
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Density tells us how much mass is packed into a given volume.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Formula</p>
              <span className="text-3xl font-extrabold font-heading text-primary">ρ = m / V</span>
              <p className="text-xs text-muted-foreground mt-2">density = mass ÷ volume</p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                For <strong className="text-foreground">irregular objects</strong>, we can't use
                simple geometry formulas for volume. Instead, we use the{" "}
                <strong className="text-foreground">water displacement method</strong> — submerging
                the object causes the water level to rise by exactly the object's volume.
              </p>
              <p>
                This is <strong className="text-foreground">Archimedes' Principle</strong>: any
                submerged object displaces a volume of fluid equal to its own volume.
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-4">
              <p className="text-xs font-bold font-heading text-primary mb-3">
                📊 Common Densities (g/cm³)
              </p>
              <div className="space-y-2">
                {[
                  { name: "Wood (Oak)", density: 0.75, max: 8 },
                  { name: "Water",      density: 1.0,  max: 8 },
                  { name: "Glass",      density: 2.5,  max: 8 },
                  { name: "Aluminum",   density: 2.7,  max: 8 },
                  { name: "Iron",       density: 7.87, max: 8 },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="text-xs w-24 text-muted-foreground">{item.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary/50 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.density / item.max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold w-10 text-right">
                      {item.density}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SLIDE 1: Select Object ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium mb-3">
                Step 1 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                Select Your Object
              </h2>
              <p className="text-muted-foreground text-sm">
                Choose an irregular object to measure its density.
              </p>
            </div>
            <ObjectSelector selectedObject={selectedObject} onSelect={setSelectedObject} />
          </div>
        )}

        {/* ── SLIDE 2: Measure Mass ── */}
        {step === 2 && selectedObject && (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium mb-3">
                Step 2 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                Measure the Mass
              </h2>
              <p className="text-muted-foreground text-sm">
                Place the <strong>{selectedObject.name}</strong> on the digital scale.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-64">
                <ScaleSVG
                  mass={selectedObject.mass}
                  showObject={true}
                  objectColor={selectedObject.color}
                />
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Measured Mass
              </p>
              <p className="text-4xl font-extrabold font-heading text-blue-600">
                {selectedObject.mass} <span className="text-xl font-medium">g</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Record this value — you'll need it for the density formula.
              </p>
            </div>
          </div>
        )}

        {/* ── SLIDE 3: Measure Volume ── */}
        {step === 3 && selectedObject && (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-xs font-medium mb-3">
                Step 3 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                Measure the Volume
              </h2>
              <p className="text-muted-foreground text-sm">
                Submerge the <strong>{selectedObject.name}</strong> and read the water displacement.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Before</p>
                <div className="h-48 sm:h-56">
                  <BeakerSVG waterLevel={waterLevel} showObject={false} />
                </div>
                <p className="text-sm font-bold mt-1">{INITIAL_WATER} mL</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">After</p>
                <div className="h-48 sm:h-56">
                  <BeakerSVG
                    waterLevel={finalWaterLevel}
                    showObject={true}
                    objectColor={selectedObject.color}
                    displaced={true}
                  />
                </div>
                <p className="text-sm font-bold mt-1">
                  {(INITIAL_WATER + selectedObject.volume).toFixed(1)} mL
                </p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Displaced Volume</p>
              <p className="text-4xl font-extrabold font-heading text-cyan-600">
                {selectedObject.volume} <span className="text-xl font-medium">mL = cm³</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                The rise in water level equals the object's volume.
              </p>
            </div>
          </div>
        )}

        {/* ── SLIDE 4: Calculate ── */}
        {step === 4 && selectedObject && (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-medium mb-3">
                Step 4 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                Calculate Density
              </h2>
              <p className="text-muted-foreground text-sm">
                Apply the formula <strong>ρ = m ÷ V</strong> with your measurements.
              </p>
            </div>
            <ResultsPanel
              object={selectedObject}
              mass={selectedObject.mass}
              initialVolume={INITIAL_WATER}
              finalVolume={INITIAL_WATER + selectedObject.volume}
            />
          </div>
        )}

      </div>
    </ExperimentShell>
  );
}
