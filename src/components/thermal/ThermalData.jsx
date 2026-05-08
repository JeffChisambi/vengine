import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Scatter, ScatterChart,
} from "recharts";

const MAT_COLORS = {
  "Iron":     "#6b7280",
  "Copper":   "#cd7f32",
  "Aluminum": "#94a3b8",
  "Steel":    "#475569",
  "Brass":    "#d4a017",
};
const MAT_ALPHA = {
  "Iron": 12e-6, "Copper": 17e-6, "Aluminum": 23e-6, "Steel": 11e-6, "Brass": 19e-6,
};

export default function ThermalData({ readings, setReadings }) {
  const matNames = [...new Set(readings.map(r => r.material))];

  const theoryLines = useMemo(() => matNames.map(name => {
    const alpha = MAT_ALPHA[name] || 12e-6;
    return {
      name,
      color: MAT_COLORS[name] || "#6b7280",
      data: Array.from({ length: 49 }, (_, i) => {
        const dT = i * 10;
        return { deltaT: dT, deltaL_mm: +(alpha * 1.0 * dT * 1000).toFixed(4) };
      }),
    };
  }), [readings]);

  const byMat = useMemo(() => {
    const map = {};
    readings.forEach(r => {
      if (!map[r.material]) map[r.material] = [];
      map[r.material].push({ deltaT: r.deltaT, deltaL_mm: r.deltaL_mm });
    });
    return map;
  }, [readings]);

  const remove = (i) => setReadings(rs => rs.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-full flex flex-col gap-6 items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-2">
          Data Analysis
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">ΔL vs ΔT Graph</h2>
        <p className="text-muted-foreground text-sm">
          {readings.length === 0
            ? "No readings yet — go back to the Lab and record some measurements."
            : "Your measured extensions plotted against ΔL = α·L₀·ΔT. A straight line confirms the linear relationship."}
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
            <LineChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis
                type="number" dataKey="deltaT" domain={[0, 500]}
                label={{ value: "ΔT — Temperature rise (°C)", position: "insideBottom", offset: -14, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }} allowDuplicatedCategory={false}
              />
              <YAxis
                type="number" dataKey="deltaL_mm"
                label={{ value: "ΔL (mm)", angle: -90, position: "insideLeft", offset: 14, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }}
                tickFormatter={v => v.toFixed(2)}
              />
              <Tooltip
                formatter={(v, n) => [v.toFixed(4) + " mm", n]}
                labelFormatter={v => `ΔT = ${v} °C`}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />

              {/* Theory lines */}
              {theoryLines.map(line => (
                <Line
                  key={`th-${line.name}`}
                  data={line.data}
                  dataKey="deltaL_mm"
                  type="linear"
                  stroke={line.color}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  strokeOpacity={0.5}
                  dot={false}
                  name={`${line.name} (theory)`}
                />
              ))}

              {/* Measured points */}
              {Object.entries(byMat).map(([name, pts]) => (
                <Line
                  key={`m-${name}`}
                  data={pts}
                  dataKey="deltaL_mm"
                  type="linear"
                  stroke={MAT_COLORS[name] || "#f97316"}
                  strokeWidth={0}
                  dot={{ r: 6, fill: MAT_COLORS[name] || "#f97316", strokeWidth: 0 }}
                  name={`${name} (measured)`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {readings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-orange-500/8 border border-orange-500/20 text-xs text-center"
          >
            <strong className="text-orange-600">ΔL is directly proportional to ΔT!</strong>
            <span className="text-muted-foreground">
              {" "}The gradient = α·L₀ — steeper for materials with higher expansion coefficients.
            </span>
          </motion.div>
        )}
      </div>

      {/* Insight cards */}
      {readings.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { label: "Relationship", value: "ΔL ∝ ΔT", note: "Linear — straight line through origin", c: "orange" },
            { label: "Highest α tested", value: matNames.sort((a, b) => (MAT_ALPHA[b] || 0) - (MAT_ALPHA[a] || 0))[0] || "—", note: "Expands most per °C", c: "amber" },
            { label: "Formula verified", value: "ΔL = α·L₀·ΔT", note: "Matches theoretical line", c: "red" },
          ].map(c => (
            <div key={c.label}
              className={`p-3 rounded-xl bg-${c.c}-500/5 border border-${c.c}-500/15 text-center`}>
              <p className="text-[10px] text-muted-foreground">{c.label}</p>
              <p className={`text-sm font-bold text-${c.c}-600 font-heading my-0.5`}>{c.value}</p>
              <p className="text-[10px] text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Data table */}
      {readings.length > 0 && (
        <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Material</th>
                  <th className="px-3 py-3 text-left">α (×10⁻⁶ °C⁻¹)</th>
                  <th className="px-3 py-3 text-left">Temp (°C)</th>
                  <th className="px-3 py-3 text-left">ΔT (°C)</th>
                  <th className="px-3 py-3 text-left">ΔL (mm)</th>
                  <th className="px-3 py-3 text-left">ΔL/L₀ (×10⁻⁶)</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => {
                  const color = MAT_COLORS[r.material] || "#f97316";
                  const strain = (r.alpha * r.deltaT * 1e6).toFixed(2);
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
                      <td className="px-3 py-2 font-mono text-xs">{+(r.alpha * 1e6).toFixed(0)}</td>
                      <td className="px-3 py-2 font-semibold font-heading">{r.temp.toFixed(1)}</td>
                      <td className="px-3 py-2 font-semibold font-heading">{r.deltaT.toFixed(1)}</td>
                      <td className="px-3 py-2 font-mono font-bold" style={{ color }}>
                        {r.deltaL_mm.toFixed(4)}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{strain}</td>
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
