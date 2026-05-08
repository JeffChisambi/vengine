import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
  LineChart, Line,
} from "recharts";

const LENS_COLORS = { Convex: "#818cf8", Concave: "#f472b6" };

export default function LensData({ readings, setReadings }) {
  const lensTypes = [...new Set(readings.map(r => r.lensType))];

  // 1/di vs 1/do scatter points
  const scatterByType = useMemo(() => {
    const map = {};
    readings.forEach(r => {
      if (!map[r.lensType]) map[r.lensType] = [];
      if (isFinite(r.inv_do) && isFinite(r.inv_di)) {
        map[r.lensType].push({ x: r.inv_do, y: r.inv_di });
      }
    });
    return map;
  }, [readings]);

  // v vs do scatter points
  const doVi = useMemo(() =>
    readings.filter(r => isFinite(r.di) && Math.abs(r.di) < 800)
      .map(r => ({ x: r.do, y: r.di, type: r.lensType })),
    [readings]
  );

  const remove = (i) => setReadings(rs => rs.filter((_, idx) => idx !== i));

  // Average focal length from 1/f readings
  const avgF = useMemo(() => {
    if (!readings.length) return null;
    const vals = readings.map(r => isFinite(r.inv_f) ? r.f : null).filter(Boolean);
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [readings]);

  return (
    <div className="min-h-full flex flex-col gap-6 items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-2">
          Data Analysis
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Lens Formula Graphs
        </h2>
        <p className="text-muted-foreground text-sm">
          {readings.length === 0
            ? "No readings yet — go back to the Lab and record measurements at different object distances."
            : "Plot 1/dᵢ vs 1/dₒ — the intercepts give you 1/f. Check that the lens formula holds for every measurement."}
        </p>
      </div>

      {/* Chart 1: 1/di vs 1/do */}
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold font-heading mb-1">
          1/dᵢ vs 1/dₒ — Verifying 1/f = 1/dₒ + 1/dᵢ
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Points should lie on a straight line. The y-intercept = 1/f and x-intercept = 1/f.
        </p>
        {readings.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            Record readings in the Lab to see your graph.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis type="number" dataKey="x" name="1/dₒ" domain={[0, "auto"]}
                label={{ value: "1/dₒ (cm⁻¹)", position: "insideBottom", offset: -14, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }}
                tickFormatter={v => v.toFixed(3)} />
              <YAxis type="number" dataKey="y" name="1/dᵢ"
                label={{ value: "1/dᵢ (cm⁻¹)", angle: -90, position: "insideLeft", offset: 20, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }}
                tickFormatter={v => v.toFixed(3)} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-xs shadow">
                      <p>1/dₒ = {d.x?.toFixed(4)} cm⁻¹</p>
                      <p>1/dᵢ = {d.y?.toFixed(4)} cm⁻¹</p>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              {/* Reference line: 1/di + 1/do = 1/f means y = 1/f - x (line through 1/f on both axes) */}
              {readings.length > 0 && (
                <ReferenceLine
                  segment={[
                    { x: 0, y: 1 / readings[0].f },
                    { x: 1 / readings[0].f, y: 0 },
                  ]}
                  stroke={LENS_COLORS[readings[0].lensType] || "#818cf8"}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  label={{ value: `1/f = ${(1 / readings[0].f).toFixed(4)}`, fontSize: 9, fill: "#94a3b8", position: "insideTopRight" }}
                />
              )}
              {Object.entries(scatterByType).map(([name, data]) => (
                <Scatter
                  key={name} name={name} data={data}
                  fill={LENS_COLORS[name] || "#818cf8"}
                  r={6}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
        {readings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-violet-500/8 border border-violet-500/20 text-xs text-center"
          >
            <strong className="text-violet-600">1/f = 1/dₒ + 1/dᵢ is a straight line!</strong>
            <span className="text-muted-foreground">
              {" "}Every point should fall on the line y = 1/f − x. The intercepts both equal 1/f.
            </span>
          </motion.div>
        )}
      </div>

      {/* Chart 2: dᵢ vs dₒ */}
      {readings.length >= 2 && (
        <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-bold font-heading mb-1">dᵢ vs dₒ — Image Distance vs Object Distance</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Notice the hyperbola-like curve — as dₒ approaches f, dᵢ → ∞. Virtual images appear as negative dᵢ.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis type="number" dataKey="x" name="dₒ"
                label={{ value: "Object distance dₒ (cm)", position: "insideBottom", offset: -14, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }} />
              <YAxis type="number" dataKey="y" name="dᵢ"
                label={{ value: "dᵢ (cm)", angle: -90, position: "insideLeft", offset: 16, fontSize: 11, fill: "#64748b" }}
                fontSize={10} tick={{ fill: "#94a3b8" }} />
              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 3" strokeWidth={1} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 text-xs shadow">
                      <p>dₒ = {d.x?.toFixed(1)} cm</p>
                      <p>dᵢ = {d.y?.toFixed(1)} cm {d.y < 0 ? "(virtual)" : "(real)"}</p>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              {lensTypes.map(t => (
                <Scatter key={t} name={t}
                  data={doVi.filter(d => d.type === t).map(d => ({ x: d.x, y: d.y }))}
                  fill={LENS_COLORS[t] || "#818cf8"} r={6}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Insight cards */}
      {readings.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { label: "Relationship",  value: "1/f = 1/dₒ + 1/dᵢ",    note: "Always linear on 1/di vs 1/do graph", c: "violet" },
            { label: "Convex",        value: "Real & virtual images",  note: "Virtual when dₒ < f",                 c: "indigo" },
            { label: "Concave",       value: "Always virtual",         note: "Upright, reduced, same-side image",   c: "pink"   },
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
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Lens</th>
                  <th className="px-3 py-3 text-left">f (cm)</th>
                  <th className="px-3 py-3 text-left">dₒ (cm)</th>
                  <th className="px-3 py-3 text-left">dᵢ (cm)</th>
                  <th className="px-3 py-3 text-left">m</th>
                  <th className="px-3 py-3 text-left">Type</th>
                  <th className="px-3 py-3 text-left">1/dₒ+1/dᵢ</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => {
                  const color = LENS_COLORS[r.lensType] || "#818cf8";
                  const formulaCheck = isFinite(r.inv_do) && isFinite(r.inv_di)
                    ? (r.inv_do + r.inv_di).toFixed(4) : "—";
                  return (
                    <motion.tr key={i}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-t border-border hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{i + 1}</td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                          <span className="font-semibold text-xs">{r.lensType}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{r.f}</td>
                      <td className="px-3 py-2 font-semibold font-heading">{r.do.toFixed(1)}</td>
                      <td className="px-3 py-2 font-semibold font-heading" style={{ color: r.di < 0 ? "#e879f9" : "#22d3ee" }}>
                        {r.di.toFixed(1)} {r.di < 0 ? "(virt.)" : ""}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{r.m.toFixed(3)}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                          r.isVirt ? "bg-fuchsia-500/10 text-fuchsia-600" : "bg-cyan-500/10 text-cyan-600"
                        }`}>
                          {r.isVirt ? "Virtual" : "Real"} · {r.isInverted ? "Inv." : "Upr."}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{formulaCheck}</td>
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
