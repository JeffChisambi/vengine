import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Select Object", short: "1" },
  { label: "Measure Mass", short: "2" },
  { label: "Measure Volume", short: "3" },
  { label: "Calculate", short: "4" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isComplete = i < currentStep;

        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isComplete
                    ? "hsl(245, 58%, 51%)"
                    : isActive
                      ? "hsl(245, 58%, 51%)"
                      : "hsl(220, 14%, 93%)",
                }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span
                    className={
                      isActive ? "text-white" : "text-muted-foreground"
                    }
                  >
                    {step.short}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  isActive
                    ? "text-primary font-semibold"
                    : isComplete
                      ? "text-primary/70"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 max-w-[40px]">
                <div className="h-0.5 rounded-full bg-border overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isComplete ? "100%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
