import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp } from "lucide-react";

const g_actual = 9.81;

function calcGFromReadings(readings) {
  if (!readings || readings.length < 2) return null;
  const points = readings.map((r) => ({ L: r.length, T: r.measured }));
  const slope = points.reduce((sum, p) => sum + p.T * p.T / p.L, 0) / points.length;
  const g_est = (4 * Math.PI * Math.PI) / slope;
  return g_est;
}

const KEY_FINDINGS = [
  {
    title: "Period ∝ √Length",
    desc: "Doubling the length increases the period by a factor of √2 ≈ 1.41, not 2.",
    color: "text-indigo-600",
    bg: "bg-indigo-500/8",
    border: "border-indigo-500/20",
  },
  {
    title: "Mass doesn't matter",
    desc: "A heavier bob swings at the same rate as a lighter one of equal length.",
    color: "text-purple-600",
    bg: "bg-purple-500/8",
    border: "border-purple-500/20",
  },
  {
    title: "Small angles only",
    desc: "The formula T = 2π√(L/g) is accurate only for small oscillation angles (<15°).",
    color: "text-pink-600",
    bg: "bg-pink-500/8",
    border: "border-pink-500/20",
  },
];

export default function PendulumConclusion({ readings }) {
  const g_est = useMemo(() => calcGFromReadings(readings), [readings]);
  const error = g_est ? Math.abs((g_est - g_actual) / g_actual) * 100 : null;

  return (
    <div className="min-h-full flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-semibold mb-3 border border-indigo-500/20">
          🏁 Conclusion
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
          What Did We Learn?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Your pendulum data confirms one of physics' most elegant relationships — and lets us measure gravity directly.
        </p>
      </motion.div>

      {/* g estimate card */}
      {g_est !== null ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border-2 border-indigo-500/25 bg-indigo-500/5 p-5 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading mb-0.5">
              Your Measured g
            </p>
            <p className="text-3xl font-extrabold font-heading text-indigo-600 tabular-nums">
              {g_est.toFixed(2)} m/s²
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {error < 5 ? "Excellent accuracy!" : error < 15 ? "Good result!" : "Try more data points for accuracy"}
              {" "}({error.toFixed(1)}% error vs 9.81 m/s²)
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Accepted value</p>
            <p className="text-lg font-bold text-foreground">{g_actual} m/s²</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground"
        >
          No readings recorded — go back to the experiment and collect some data to see your calculated value of g.
        </motion.div>
      )}

      {/* Key findings */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading">
          Key Findings
        </p>
        {KEY_FINDINGS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`flex gap-3 p-4 rounded-xl border ${f.border} ${f.bg}`}
          >
            <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${f.color}`} />
            <div>
              <p className={`text-sm font-semibold font-heading ${f.color} mb-0.5`}>{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Formula recap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-border bg-card p-4 text-center"
      >
        <p className="text-xs text-muted-foreground mb-2">The relationship you verified</p>
        <p className="text-2xl font-extrabold font-heading text-indigo-600">T = 2π√(L/g)</p>
        <p className="text-xs text-muted-foreground mt-1">
          Rearranged to find gravity: <span className="font-mono font-semibold text-foreground">g = 4π²L / T²</span>
        </p>
      </motion.div>
    </div>
  );
}
