import { useState, useCallback } from "react";

/**
 * Encapsulates all step-based navigation logic for experiments.
 *
 * Abstraction  — callers only see {step, dir, goTo, next, back, reset}.
 * Encapsulation — the internal setStep / setDir state is hidden inside the hook.
 *
 * @param {number}   totalSteps       Total number of steps in the experiment.
 * @param {Function} onResetCallback  Optional side-effect run on reset (clears
 *                                    experiment-specific state in the page).
 */
export function useExperimentNav(totalSteps, onResetCallback) {
  const [step, setStep] = useState(0);
  const [dir, setDir]   = useState(1);

  const goTo = (n) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const next = () => {
    if (step < totalSteps - 1) goTo(step + 1);
  };

  const back = () => {
    if (step > 0) goTo(step - 1);
  };

  const reset = useCallback(() => {
    setDir(-1);
    setStep(0);
    onResetCallback?.();
  }, [onResetCallback]);

  return { step, dir, goTo, next, back, reset };
}
