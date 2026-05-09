import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ChevronDown } from "lucide-react";

export default function InstrumentCard({ instrument, isSelected, onSelect }) {
  const {
    component: Component,
    defaultProps,
    toggles,
    hasSlider,
    name,
    description,
  } = instrument;
  const [props, setProps] = useState({ ...defaultProps, glow: false });

  const handleToggle = (key, invert) => {
    setProps((prev) => ({ ...prev, [key]: invert ? !prev[key] : !prev[key] }));
  };

  const handleSlider = (key, value) => {
    setProps((prev) => ({ ...prev, [key]: value[0] }));
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/60 cursor-pointer"
      onClick={onSelect}
    >
      {/* SVG Display */}
      <div className="flex items-center justify-center p-4 pt-6 h-[240px] bg-gradient-to-b from-muted/30 to-transparent">
        <Component {...props} />
      </div>

      {/* Info */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            {name}
          </h3>
          <motion.div
            animate={{ rotate: isSelected ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Expanded controls */}
      <AnimatePresence>
        {isSelected && (toggles.length > 0 || hasSlider) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pb-4 pt-2 border-t border-border/40 space-y-3">
              {/* Glow toggle (always available) */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Glow Effect
                </span>
                <Switch
                  checked={props.glow}
                  onCheckedChange={() => handleToggle("glow")}
                  className="scale-75"
                />
              </div>

              {toggles.map((t) => (
                <div key={t.key} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {t.label}
                  </span>
                  <Switch
                    checked={t.invert ? !props[t.key] : props[t.key]}
                    onCheckedChange={() => handleToggle(t.key)}
                    className="scale-75"
                  />
                </div>
              ))}

              {hasSlider && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {hasSlider.label}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {props[hasSlider.key]}
                      {hasSlider.unit}
                    </span>
                  </div>
                  <Slider
                    value={[props[hasSlider.key]]}
                    min={hasSlider.min}
                    max={hasSlider.max}
                    step={hasSlider.step ?? 1}
                    onValueChange={(v) => handleSlider(hasSlider.key, v)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
