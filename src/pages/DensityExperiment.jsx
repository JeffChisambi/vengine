import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import BeakerSVG from "@/components/lab/BeakerSVG";
import ScaleSVG from "@/components/lab/ScaleSVG";
import ObjectSelector from "@/components/lab/ObjectSelector";
import ResultsPanel from "@/components/lab/ResultsPanel";

const INITIAL_WATER = 200;
const BEAKER_MAX = 500;
const TOTAL_STEPS = 5; // theory, select, mass, volume, calculate

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function DensityExperiment() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedObject, setSelectedObject] = useState(null);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) goTo(step + 1);
  };
  const handleBack = () => {
    if (step > 0) goTo(step - 1);
  };
  const handleReset = () => {
    setDirection(-1);
    setStep(0);
    setSelectedObject(null);
  };

  const canAdvance = step === 1 ? !!selectedObject : true;
  const waterLevel = INITIAL_WATER / BEAKER_MAX;
  const finalWaterLevel = selectedObject
    ? (INITIAL_WATER + selectedObject.volume) / BEAKER_MAX
    : waterLevel;

  const dots = Array.from({ length: TOTAL_STEPS });

  return (
    <div className="h-screen flex flex-col bg-background font-body overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">
                  Density of Irregular Objects
                </h1>
                <p className="text-xs text-muted-foreground">
                  Water Displacement Method
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto"
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
                      Density tells us how much mass is packed into a given
                      volume.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Formula
                    </p>
                    <span className="text-3xl font-extrabold font-heading text-primary">
                      ρ = m / V
                    </span>
                    <p className="text-xs text-muted-foreground mt-2">
                      density = mass ÷ volume
                    </p>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      For{" "}
                      <strong className="text-foreground">
                        irregular objects
                      </strong>
                      , we can't use simple geometry formulas for volume.
                      Instead, we use the{" "}
                      <strong className="text-foreground">
                        water displacement method
                      </strong>{" "}
                      — submerging the object causes the water level to rise by
                      exactly the object's volume.
                    </p>
                    <p>
                      This is{" "}
                      <strong className="text-foreground">
                        Archimedes' Principle
                      </strong>
                      : any submerged object displaces a volume of fluid equal
                      to its own volume.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-card border border-border p-4">
                    <p className="text-xs font-bold font-heading text-primary mb-3">
                      📊 Common Densities (g/cm³)
                    </p>
                    <div className="space-y-2">
                      {[
                        { name: "Wood (Oak)", density: 0.75, max: 8 },
                        { name: "Water", density: 1.0, max: 8 },
                        { name: "Glass", density: 2.5, max: 8 },
                        { name: "Aluminum", density: 2.7, max: 8 },
                        { name: "Iron", density: 7.87, max: 8 },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3"
                        >
                          <span className="text-xs w-24 text-muted-foreground">
                            {item.name}
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary/50 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(item.density / item.max) * 100}%`,
                              }}
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
                  <ObjectSelector
                    selectedObject={selectedObject}
                    onSelect={setSelectedObject}
                  />
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
                      Place the <strong>{selectedObject.name}</strong> on the
                      digital scale.
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
                      {selectedObject.mass}{" "}
                      <span className="text-xl font-medium">g</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Record this value — you'll need it for the density
                      formula.
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
                      Submerge the <strong>{selectedObject.name}</strong> and
                      read the water displacement.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Before
                      </p>
                      <div className="h-48 sm:h-56">
                        <BeakerSVG waterLevel={waterLevel} showObject={false} />
                      </div>
                      <p className="text-sm font-bold mt-1">
                        {INITIAL_WATER} mL
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        After
                      </p>
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
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Displaced Volume
                    </p>
                    <p className="text-4xl font-extrabold font-heading text-cyan-600">
                      {selectedObject.volume}{" "}
                      <span className="text-xl font-medium">mL = cm³</span>
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
                      Apply the formula <strong>ρ = m ÷ V</strong> with your
                      measurements.
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2 min-w-[90px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {dots.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === step ? 20 : 8,
                  backgroundColor:
                    i === step ? "hsl(245, 58%, 51%)" : "hsl(220, 14%, 85%)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>

          {step < TOTAL_STEPS - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canAdvance}
              className="gap-2 min-w-[90px] bg-primary hover:bg-primary/90"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleReset} className="gap-2 min-w-[90px]">
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
