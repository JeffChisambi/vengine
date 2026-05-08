import React from "react";
import { motion } from "framer-motion";

const DENSITY_WATER = 1.0;

function floatsSink(density) {
  return density > DENSITY_WATER ? "Sinks" : "Floats";
}

function densityLabel(density) {
  if (density < 0.5) return { label: "Very Light", color: "text-sky-500" };
  if (density < 1.0) return { label: "Lighter than water", color: "text-blue-500" };
  if (density < 3.0) return { label: "Moderate density", color: "text-yellow-600" };
  if (density < 7.0) return { label: "Dense", color: "text-orange-500" };
  return { label: "Very Dense", color: "text-red-500" };
}

export default function ResultsPanel({ object, mass, initialVolume, finalVolume }) {
  if (!object) return null;

  const displacedVolume = finalVolume - initialVolume;
  const density = mass / displacedVolume;
  const { label, color } = densityLabel(density);
  const sinkFloat = floatsSink(density);

  const rows = [
    { name: "Mass", value: `${mass.toFixed(1)} g`, sub: "measured on scale" },
    { name: "Initial Volume", value: `${initialVolume.toFixed(0)} mL`, sub: "water only" },
    { name: "Final Volume", value: `${finalVolume.toFixed(1)} mL`, sub: "water + object" },
    { name: "Displaced Volume", value: `${displacedVolume.toFixed(1)} mL`, sub: "final − initial", highlight: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Measurement table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading">
            Measurements
          </p>
        </div>
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.name}
              className={`flex items-center justify-between px-4 py-3 ${
                row.highlight ? "bg-primary/5" : ""
              }`}
            >
              <div>
                <p className={`text-sm font-medium font-heading ${row.highlight ? "text-primary" : "text-foreground"}`}>
                  {row.name}
                </p>
                <p className="text-xs text-muted-foreground">{row.sub}</p>
              </div>
              <span className={`text-sm font-bold tabular-nums ${row.highlight ? "text-primary" : "text-foreground"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Formula */}
      <div className="rounded-2xl border border-border bg-card px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading">
          Calculation
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span className="font-heading font-bold text-foreground">ρ</span>
          <span>=</span>
          <span>m ÷ V</span>
          <span>=</span>
          <span className="font-mono">{mass.toFixed(1)} g</span>
          <span>÷</span>
          <span className="font-mono">{displacedVolume.toFixed(1)} mL</span>
        </div>
      </div>

      {/* Result */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border-2 border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between"
      >
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading mb-0.5">
            Density of {object.name}
          </p>
          <p className={`text-xs font-medium ${color}`}>{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {sinkFloat} in water (ρ_water = 1.00 g/mL)
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold font-heading text-primary tabular-nums">
            {density.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground font-medium">g/mL</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
