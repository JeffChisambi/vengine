import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  ScatterChart, Scatter, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

export default function CircuitData({ readings, setReadings }) {
  const [view, setView] = useState("ohm");

  const seriesReadings = readings.filter(r => r.mode === "series");
  const parallelReadings = readings.filter(r => r.mode === "parallel");

  // Ohm's law theoretical curve: I = V / R for V = 6 (most common)
  const ohmCurve = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const R = 5 + i * 5;
      return { R, I_6V: +(6 / R).toFixed(4), I_12V: +(12 / R).toFixed(4) };
    });
  }, []);

  const scatterSeries = seriesReadings.map(r => ({ R: r.rTotal, I: r.iTotal, V: r.voltage }));
  const scatterParallel = parallelReadings.map(r => ({ R: r.rTotal, I: r.iTotal, V: r.voltage }));

  const remove = i => setReadings(rs => rs.filter((_, idx) => idx !== i));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white border border-border rounded-xl p-2 text-xs shadow-lg">
          {d.R !== undefined && <p><b>R:</b> {d.R?.toFixed(2)} Ω</p>}
          {d.I !== undefined && <p><b>I:</b> {d.I?.toFixed(4)} A</p>}
          {d.V !== undefined && <p><b>V:</b> {d.V} V</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-full flex flex-col gap-6 items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold mb-2">
          Data Analysis
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">Analyse Your Results</h2>
        <p className="text-muted-foreground text-sm">
          {readings.length === 0
            ? "No readings yet — go back to the Lab and record some measurements."
            : "Explore how current responds to resistance and compare series vs parallel behaviour."}
        </p>
      </div>

      {/* Chart tabs */}
      <div className="flex rounded-xl border border-border overflow-hidden text-xs font-semibold self-center">
        {[
          ["ohm", "Ohm's Law (I vs R)"],
          ["compare", "Series vs Parallel"],
          ["power", "Power Analysis"],
        ].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 transition-colors ${view === v ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        {view === "ohm" && (
          <>
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Current (I) vs Total Resistance (R) — Ohm's Law: I = V/R
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
                <XAxis dataKey="R" type="number" name="Resistance"
                  domain={[0, 260]} tickCount={8}
                  label={{ value: "Total Resistance R (Ω)", position: "insideBottom", offset: -12, fontSize: 11, fill: "#64748b" }}
                  fontSize={10} tick={{ fill: "#94a3b8" }} />
                <YAxis dataKey="I" type="number" name="Current"
                  domain={[0, 1.4]} tickCount={8}
                  label={{ value: "Current I (A)", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#64748b" }}
                  fontSize={10} tick={{ fill: "#94a3b8" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={28} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Scatter name="Series readings" data={scatterSeries} fill="#f59e0b" r={6} />
                <Scatter name="Parallel readings" data={scatterParallel} fill="#d97706" r={6} shape="triangle" />
              </ScatterChart>
            </ResponsiveContainer>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs text-center">
              <strong className="text-amber-700">Ohm's Law confirmed:</strong>
              <span className="text-muted-foreground"> doubling resistance halves the current — the curve is a hyperbola (I = V/R).</span>
            </motion.div>
          </>
        )}

        {view === "compare" && (
          <>
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Comparing series and parallel for the same resistor values
            </p>
            {readings.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                No data yet — record readings in the Lab.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
                  <XAxis dataKey="V" type="number" name="Voltage"
                    domain={[0, 14]} tickCount={8}
                    label={{ value: "Battery Voltage (V)", position: "insideBottom", offset: -12, fontSize: 11, fill: "#64748b" }}
                    fontSize={10} tick={{ fill: "#94a3b8" }} />
                  <YAxis dataKey="I" type="number" name="Current"
                    label={{ value: "Current I (A)", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#64748b" }}
                    fontSize={10} tick={{ fill: "#94a3b8" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={28} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Scatter name="Series (higher R, lower I)" data={scatterSeries} fill="#f59e0b" r={6} />
                  <Scatter name="Parallel (lower R, higher I)" data={scatterParallel} fill="#d97706" r={6} shape="triangle" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-3 p-3 rounded-xl bg-orange-500/8 border border-orange-500/20 text-xs text-center">
              <strong className="text-orange-700">Key insight:</strong>
              <span className="text-muted-foreground"> parallel circuits have lower total resistance → more current flows than in a series arrangement with the same resistors.</span>
            </motion.div>
          </>
        )}

        {view === "power" && (
          <>
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Power (P = V × I) for all recorded readings
            </p>
            {readings.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                No data yet — record readings in the Lab.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
                  <XAxis dataKey="V" type="number" name="Voltage"
                    domain={[0, 14]} tickCount={8}
                    label={{ value: "Voltage (V)", position: "insideBottom", offset: -12, fontSize: 11, fill: "#64748b" }}
                    fontSize={10} tick={{ fill: "#94a3b8" }} />
                  <YAxis dataKey="power" type="number" name="Power"
                    label={{ value: "Power P (W)", angle: -90, position: "insideLeft", offset: 10, fontSize: 11, fill: "#64748b" }}
                    fontSize={10} tick={{ fill: "#94a3b8" }} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-border rounded-xl p-2 text-xs shadow-lg">
                          <p><b>Mode:</b> {d.mode}</p>
                          <p><b>V:</b> {d.voltage} V</p>
                          <p><b>P:</b> {d.power?.toFixed(3)} W</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Legend verticalAlign="top" height={28} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Scatter name="Series" data={seriesReadings} fill="#f59e0b" r={6} />
                  <Scatter name="Parallel" data={parallelReadings} fill="#d97706" r={6} shape="triangle" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </div>

      {/* Data table */}
      {readings.length > 0 ? (
        <div className="w-full rounded-2xl border border-border bg-card overflow-auto shadow-sm">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Mode</th>
                <th className="px-3 py-3 text-left">V (V)</th>
                <th className="px-3 py-3 text-left">R₁ (Ω)</th>
                <th className="px-3 py-3 text-left">R₂ (Ω)</th>
                <th className="px-3 py-3 text-left">R_total (Ω)</th>
                <th className="px-3 py-3 text-left">I_total (A)</th>
                <th className="px-3 py-3 text-left">P (W)</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => (
                <motion.tr key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 text-muted-foreground font-mono text-xs">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.mode === "series" ? "bg-amber-500/10 text-amber-700" : "bg-orange-500/10 text-orange-700"}`}>
                      {r.mode}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold font-heading text-amber-600">{r.voltage}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{r.r1}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{r.r2}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-orange-600">{r.rTotal}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-amber-700">{r.iTotal}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{r.power}</td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => remove(i)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full p-8 rounded-2xl border border-dashed border-border text-center text-muted-foreground text-sm">
          No readings recorded yet. Go to the Lab stage to collect data.
        </div>
      )}

      {/* Summary stats */}
      {readings.length >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total readings", value: readings.length, color: "text-amber-600" },
            { label: "Series readings", value: seriesReadings.length, color: "text-amber-700" },
            { label: "Parallel readings", value: parallelReadings.length, color: "text-orange-600" },
            {
              label: "Max current",
              value: `${Math.max(...readings.map(r => r.iTotal)).toFixed(3)} A`,
              color: "text-orange-700"
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-card border border-border text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className={`text-xl font-extrabold font-heading ${color}`}>{value}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
