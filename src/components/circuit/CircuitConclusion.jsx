import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";

const KEY_FINDINGS = [
  {
    title: "Ohm's Law governs everything",
    desc: "V = I × R. Double the resistance, halve the current (at constant voltage). This relationship is linear.",
    color: "text-amber-600",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
  },
  {
    title: "Series: resistance adds up",
    desc: "R_total = R₁ + R₂. The same current flows everywhere, but voltage splits across each component proportionally.",
    color: "text-orange-600",
    bg: "bg-orange-500/8",
    border: "border-orange-500/20",
  },
  {
    title: "Parallel: resistance decreases",
    desc: "1/R_total = 1/R₁ + 1/R₂. Adding branches gives current more paths, so total resistance always falls below the smallest branch.",
    color: "text-yellow-700",
    bg: "bg-yellow-500/8",
    border: "border-yellow-500/20",
  },
  {
    title: "Parallel means more current",
    desc: "For the same voltage and resistors, a parallel circuit draws more total current — and more power — than a series circuit.",
    color: "text-amber-700",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
  },
];

const REAL_WORLD = [
  { label: "Home lighting", desc: "Bulbs are wired in parallel — one failing doesn't turn off others.", icon: "💡" },
  { label: "Christmas lights", desc: "Old-style series strings: one blown bulb kills the whole string.", icon: "🎄" },
  { label: "USB chargers", desc: "Plugging in more devices is like adding parallel branches — draws more total current.", icon: "🔌" },
  { label: "Car electrics", desc: "Every device (lights, horn, radio) is a parallel branch from the 12 V battery.", icon: "🚗" },
];

export default function CircuitConclusion({ readings }) {
  const hasData = readings && readings.length >= 2;

  const stats = useMemo(() => {
    if (!hasData) return null;
    const seriesR = readings.filter(r => r.mode === "series");
    const parallelR = readings.filter(r => r.mode === "parallel");
    const maxI = Math.max(...readings.map(r => r.iTotal));
    const maxP = Math.max(...readings.map(r => r.power));
    const avgI = readings.reduce((s, r) => s + r.iTotal, 0) / readings.length;
    return { seriesCount: seriesR.length, parallelCount: parallelR.length, maxI, maxP, avgI };
  }, [readings, hasData]);

  return (
    <div className="min-h-full flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold mb-3 border border-amber-500/20">
          🏁 Conclusion
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">What Did We Learn?</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Your measurements confirm the fundamental laws that govern every electrical device you've ever used.
        </p>
      </motion.div>

      {/* Data summary */}
      {hasData ? (
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border-2 border-amber-500/25 bg-amber-500/5 p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Experiment Summary</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Readings", value: readings.length },
              { label: "Series", value: stats.seriesCount },
              { label: "Parallel", value: stats.parallelCount },
              { label: "Max I", value: `${stats.maxI.toFixed(3)} A` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold font-heading text-amber-600">{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
          No readings recorded — go back to the Lab and collect some data.
        </motion.div>
      )}

      {/* Key findings */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading">Key Findings</p>
        {KEY_FINDINGS.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            className={`flex gap-3 p-4 rounded-xl border ${f.border} ${f.bg}`}>
            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${f.color}`} />
            <div>
              <p className={`text-sm font-semibold font-heading ${f.color} mb-0.5`}>{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Series vs Parallel comparison table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quick Comparison</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 text-left text-muted-foreground">Property</th>
              <th className="px-4 py-2.5 text-center text-amber-600 font-bold">Series</th>
              <th className="px-4 py-2.5 text-center text-orange-600 font-bold">Parallel</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Total resistance", "R₁ + R₂", "R₁R₂ / (R₁+R₂)"],
              ["Current", "Same everywhere", "Splits by branch"],
              ["Voltage", "Splits across parts", "Same across each branch"],
              ["If one breaks", "All go off", "Others still work"],
              ["Total resistance vs parts", "Always higher", "Always lower"],
              ["Used in", "Old Christmas lights", "Household wiring"],
            ].map(([prop, s, p], i) => (
              <tr key={prop} className={`border-t border-border ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-4 py-2 text-muted-foreground font-medium">{prop}</td>
                <td className="px-4 py-2 text-center text-amber-700 font-semibold">{s}</td>
                <td className="px-4 py-2 text-center text-orange-700 font-semibold">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Real-world connections */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading mb-3">Real-World Applications</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REAL_WORLD.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 + i * 0.08 }}
              className="flex gap-3 p-3 rounded-xl border border-border bg-card">
              <span className="text-2xl leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Formula recap */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        className="rounded-xl border border-amber-200 bg-amber-500/5 p-4 text-center">
        <p className="text-xs text-muted-foreground mb-2">The three laws you verified</p>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { label: "Ohm's Law", eq: "V = I × R" },
            { label: "Series", eq: "R = R₁ + R₂" },
            { label: "Parallel", eq: "1/R = 1/R₁ + 1/R₂" },
          ].map(({ label, eq }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-muted-foreground">{label}</p>
              <p className="text-base font-extrabold font-heading text-amber-600">{eq}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
