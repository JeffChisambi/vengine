import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const MAT_COLORS = {
  "Crown Glass":  "#0369a1",
  "Flint Glass":  "#4338ca",
  "Acrylic":      "#166534",
  "Water":        "#1d4ed8",
  "Diamond":      "#9d174d",
};

const MAT_N = {
  "Crown Glass": 1.52, "Flint Glass": 1.62,
  "Acrylic": 1.49, "Water": 1.33, "Diamond": 2.42,
};

export default function RefractionData({ readings, setReadings }) {
  const matNames = [...new Set(readings.map(r => r.material))];

  // Theoretical lines: sin(θ₂) = sin(θ₁)/n
  const theoryLines = useMemo(() => matNames.map(name => {
    const n = MAT_N[name] || 1.5;
    return {
      name,
      slope: 1 / n,
      color: MAT_COLORS[name] || "#0369a1",
      pts: Array.from({ length: 21 }, (_, i) => {
        const s1 = i * 0.05;
        return { sinTheta1: +s1.toFixed(2), sinTheta2: +(s1 / n).toFixed(4) };
      }),
    };
  }), [readings]);

  const byMat = useMemo(() => {
    const map = {};
    readings.forEach(r => {
      if (!map[r.material]) map[r.material] = [];
      map[r.material].push({ sinTheta1: r.sinTheta1, sinTheta2: r.sinTheta2 });
    });
    return map;
  }, [readings]);

  const remove = (i) => setReadings(rs => rs.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-full flex flex-col gap-6 items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-2">
          Data Analysis
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          sin θ₁ vs sin θ₂
        </h2>
        <p className="text-muted-foreground text-sm">
          {readings.length === 0
            ? "No readings yet — go back to the Lab and record some measurements."
            : "Your data plotted against n₁ sin θ₁ = n₂ sin θ₂. A straight line confirms Snell's Law."}
        </p>
      </div>

      {/* Chart */}
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        {readings.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            Record readings in the Lab stage to see your graph here.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis
                type="number" dataKey="sinTheta1" domain={[0, 1]}
                tickCount={6} name="sin θ₁"
                label={{ value: "sin θ₁ (angle of incidence)", position: "insideBottom", offset: -14, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                type="number" dataKey="sinTheta2" domain={[0, 0.85]}
                tickCount={5} name="sin θ₂"
                label={{ value: "sin θ₂ (angle of refraction)", angle: -90, position: "insideLeft", offset: 12, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(v, name) => [v.toFixed(4), name]}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />

              {/* Theoretical lines rendered as scatter with many dense points */}
              {theoryLines.map(line => (
                <Scatter
                  key={`theory-${line.name}`}
                  name={`${line.name} theory (n=${MAT_N[line.name]})`}
                  data={line.pts}
                  fill={line.color}
                  fillOpacity={0.3}
                  line={{ stroke: line.color, strokeWidth: 2, strokeOpacity: 0.5, strokeDasharray: "5 3" }}
                  shape={() => null}
                />
              ))}

              {/* Measured points */}
              {Object.entries(byMat).map(([name, pts]) => (
                <Scatter
                  key={`measured-${name}`}
                  name={`${name} (measured)`}
                  data={pts}
                  fill={MAT_COLORS[name] || "#0369a1"}
                  r={6}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}

        {readings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-sky-500/8 border border-sky-500/20 text-xs text-center"
          >
            <strong className="text-sky-600">sin θ₁ vs sin θ₂ is a straight line!</strong>
            <span className="text-muted-foreground">
              {" "}The gradient equals the refractive index n — confirming Snell's Law directly.
            </span>
          </motion.div>
        )}
      </div>

      {/* Key insight cards */}
      {readings.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            {
              label: "Snell's Law ratio",
              value: `n = ${(readings.reduce((s, r) => s + r.nMeasured, 0) / readings.length).toFixed(3)}`,
              note: "Average measured n",
              color: "sky",
            },
            {
              label: "Graph gradient",
              value: "slope = n",
              note: "sin θ₁ / sin θ₂ = const",
              color: "amber",
            },
            {
              label: "Light bends toward",
              value: "Normal (θ₂ < θ₁)",
              note: "Entering denser medium",
              color: "orange",
            },
          ].map(c => (
            <div key={c.label}
              className={`p-3 rounded-xl bg-${c.color}-500/5 border border-${c.color}-500/15 text-center`}>
              <p className="text-[10px] text-muted-foreground">{c.label}</p>
              <p className={`text-sm font-bold text-${c.color}-600 font-heading my-0.5`}>{c.value}</p>
              <p className="text-[10px] text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Data table */}
      {readings.length > 0 && (
        <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Material</th>
                  <th className="px-3 py-3 text-left">n (theory)</th>
                  <th className="px-3 py-3 text-left">θ₁ (°)</th>
                  <th className="px-3 py-3 text-left">θ₂ (°)</th>
                  <th className="px-3 py-3 text-left">sin θ₁</th>
                  <th className="px-3 py-3 text-left">sin θ₂</th>
                  <th className="px-3 py-3 text-left">n measured</th>
                  <th className="px-3 py-3 text-left">Error</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => {
                  const err = Math.abs(((r.nMeasured - r.n) / r.n) * 100).toFixed(1);
                  const color = MAT_COLORS[r.material] || "#0369a1";
                  return (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{i + 1}</td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                          <span className="font-semibold text-xs">{r.material}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{r.n}</td>
                      <td className="px-3 py-2 font-semibold font-heading">{r.angle1}°</td>
                      <td className="px-3 py-2 font-semibold font-heading">{r.angle2}°</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.sinTheta1}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.sinTheta2}</td>
                      <td className="px-3 py-2 font-mono font-bold" style={{ color }}>
                        {r.nMeasured}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          +err < 1 ? "bg-emerald-500/10 text-emerald-600"
                          : +err < 3 ? "bg-amber-500/10 text-amber-600"
                          : "bg-red-500/10 text-red-600"
                        }`}>{err}%</span>
                      </td>
                      <td className="px-3 py-2">
                        <button onClick={() => remove(i)}
                          className="text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
