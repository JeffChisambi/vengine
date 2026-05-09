import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Shared slide-transition variants — defined once here, never duplicated.
 */
export const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

/**
 * ExperimentShell — the single abstract layout shared by every experiment.
 *
 * Abstraction   — hides header / progress-bar / animation / footer chrome.
 * Encapsulation — all structural decisions (layout, transition timing, dot
 *                 animation) live here; experiments only declare their content.
 * Polymorphism  — any experiment can be dropped in as `children`; the shell
 *                 treats them identically regardless of their internal logic.
 *
 * Props
 * ─────
 * title                 string     Experiment heading shown in header
 * subject               string     Subject/subtitle shown in header
 * icon                  Component  Lucide icon OR custom SVG functional component
 * theme                 object     { iconBg, iconColor, done, current, label,
 *                                    dot, button }
 * stages                array      All stages — drives footer dot indicators
 *                                  Each item: { id, label }
 * step                  number     Current step index
 * dir                   number     Animation direction (+1 forward / -1 back)
 * onGoTo                function   Navigate to an arbitrary step index
 * onNext                function   Advance one step
 * onBack                function   Go back one step
 * onReset               function   Reset to step 0
 * canAdvance            boolean    Whether the Next button is enabled
 * maxWidth              string     Tailwind max-w-* class for inner containers
 * progressVariant       string     "full"   – bar always visible, all stages
 *                                  "middle" – bar only between intro & conclusion
 *                                  "none"   – no progress bar
 * barStages             array?     Override which stages appear in the progress
 *                                  bar (defaults to `stages` for "full" or
 *                                  stages.slice(1,-1) for "middle")
 * barOffset             number?    Index offset for active-state calculation
 *                                  in the bar (auto-computed when not supplied)
 * extraHeaderControls   ReactNode  Extra buttons rendered left of Reset in header
 * children              ReactNode  The active stage's content
 */
export default function ExperimentShell({
  title,
  subject,
  icon: Icon,
  theme,
  stages,
  step,
  dir,
  onGoTo,
  onNext,
  onBack,
  onReset,
  canAdvance = true,
  maxWidth = "max-w-6xl",
  progressVariant = "full",
  barStages: barStagesProp,
  barOffset: barOffsetProp,
  extraHeaderControls,
  children,
}) {
  const total  = stages.length;
  const isLast = step === total - 1;

  const showProgress =
    progressVariant === "full" ||
    (progressVariant === "middle" && step > 0 && step < total - 1);

  const barStages =
    barStagesProp ??
    (progressVariant === "middle" ? stages.slice(1, -1) : stages);

  const barOffset =
    barOffsetProp ?? (progressVariant === "middle" ? 1 : 0);

  return (
    <div className="h-screen flex flex-col bg-background font-body overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="shrink-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className={`${maxWidth} mx-auto px-4 py-3 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.iconBg}`}>
                <Icon className={`w-4 h-4 ${theme.iconColor}`} />
              </div>
              <div>
                <h1 className="text-sm font-bold font-heading leading-none">{title}</h1>
                <p className="text-xs text-muted-foreground">{subject}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {extraHeaderControls}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Progress bar ─────────────────────────────────────────────── */}
      {showProgress && (
        <div className="shrink-0 border-b border-border px-4 py-2 bg-background/80">
          <div className={`${maxWidth} mx-auto flex items-center gap-1.5`}>
            {barStages.map((s, i) => {
              const idx = i + barOffset;
              const isDone    = idx < step;
              const isCurrent = idx === step;
              if (progressVariant === "full") {
                return (
                  <button
                    key={s.id ?? i}
                    onClick={() => onGoTo(idx)}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                      isDone ? theme.done : isCurrent ? theme.current : "bg-muted"
                    }`} />
                    <span className={`text-[9px] font-medium hidden sm:block transition-colors ${
                      isCurrent ? theme.label : "text-muted-foreground/50"
                    }`}>{s.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={s.id ?? i}
                  onClick={() => onGoTo(idx)}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    isDone ? theme.done : isCurrent ? theme.current : "bg-muted"
                  }`}
                />
              );
            })}
          </div>
          {progressVariant === "middle" && (
            <div className={`${maxWidth} mx-auto flex justify-between mt-1`}>
              {barStages.map((s, i) => (
                <span
                  key={s.id ?? i}
                  className={`text-[9px] font-medium flex-1 text-center transition-colors ${
                    i + barOffset === step ? theme.label : "text-muted-foreground/40"
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Animated slide area ───────────────────────────────────────── */}
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
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer nav ───────────────────────────────────────────────── */}
      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border px-4 py-3">
        <div className={`${maxWidth} mx-auto flex items-center justify-between gap-4`}>
          <Button
            variant="outline"
            onClick={onBack}
            disabled={step === 0}
            className="gap-2 min-w-[90px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-1.5">
            {stages.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => onGoTo(i)}
                animate={{
                  width: i === step ? 20 : 8,
                  backgroundColor: i === step ? theme.dot : "hsl(220,14%,85%)",
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full cursor-pointer"
              />
            ))}
          </div>

          {!isLast ? (
            <Button
              onClick={onNext}
              disabled={!canAdvance}
              className={`gap-2 min-w-[90px] ${theme.button}`}
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onReset}
              className={`gap-2 min-w-[90px] ${theme.button}`}
            >
              <RotateCcw className="w-4 h-4" /> Restart
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
