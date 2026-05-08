import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Label,
} from "recharts";

const g = 9.81;

export default function PendulumData({ readings, setReadings }) {
  const [view, setView] = useState("T"); // 'T' = T vs L,  'T2' = T² vs L

  const chartData = useMemo(() => {
    // Theoretical curve
    const theory = Array.from({ length: 31 }, (_, i) => {
      const L = 0.05 + i * 0.05;
      const T = 2 * Math.PI * Math.sqrt(L / g);
      return { L: +L.toFixed(2), T: +T.toFixed(3), T2: +(T * T).toFixed(4) };
    });
    return theory;
  }, []);

  const scatterData = readings.map((r) => ({
    L: r.length,
    T: r.measured,
    T2: +(r.measured * r.measured).toFixed(4),
  }));

  const remove = (i) => setReadings((rs) => rs.filter((_, idx) => idx !== i));

  const t2Slope = useMemo(() => {
    // Theoretical: T² = (4π²/g) * L → slope = 4π²/g ≈ 4.03
    return ((4 * Math.PI * Math.PI) / g).toFixed(3);
  }, []);

  return (
    <div className="min-h-full flex flex-col gap-6 items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-semibold mb-2">
          Data Analysis
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Your Results
        </h2>
        <p className="text-muted-foreground text-sm">
          {readings.length === 0
            ? "No readings yet — go back to the Lab and record some measurements."
            : "Analyse how period changes with length. Try plotting T² for a surprise!"}
        </p>
      </div>

      {/* View toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden text-xs font-semibold">
        {[
          ["T", "Period (T) vs Length"],
          ["T2", "Period² (T²) vs Length"],
        ].map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 transition-colors ${view === v ? "bg-indigo-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={280}>
          {view === "T" ? (
            <LineChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis
                dataKey="L"
                type="number"
                domain={[0, 1.6]}
                tickCount={9}
                label={{
                  value: "Length L (m)",
                  position: "insideBottom",
                  offset: -12,
                  fontSize: 11,
                  fill: "#64748b",
                }}
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                domain={[0, 2.8]}
                tickCount={8}
                label={{
                  value: "Period T (s)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 11,
                  fill: "#64748b",
                }}
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
              />
              <Tooltip
                formatter={(v) => v.toFixed(3)}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <Line
                data={chartData}
                dataKey="T"
                type="monotone"
                stroke="#818cf8"
                strokeWidth={2}
                dot={false}
                name="Theory"
              />
              <Scatter
                data={scatterData}
                dataKey="T"
                name="Measured"
                fill="#e11d48"
                r={6}
              />
            </LineChart>
          ) : (
            <LineChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis
                dataKey="L"
                type="number"
                domain={[0, 1.6]}
                tickCount={9}
                label={{
                  value: "Length L (m)",
                  position: "insideBottom",
                  offset: -12,
                  fontSize: 11,
                  fill: "#64748b",
                }}
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
              />
              <YAxis
                domain={[0, 7]}
                tickCount={8}
                label={{
                  value: "T² (s²)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fontSize: 11,
                  fill: "#64748b",
                }}
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
              />
              <Tooltip
                formatter={(v) => v.toFixed(4)}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <Line
                data={chartData}
                dataKey="T2"
                type="monotone"
                stroke="#818cf8"
                strokeWidth={2}
                dot={false}
                name="Theory (straight!)"
              />
              <Scatter
                data={scatterData}
                dataKey="T2"
                name="Measured"
                fill="#e11d48"
                r={6}
              />
            </LineChart>
          )}
        </ResponsiveContainer>

        {view === "T2" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-xs text-center"
          >
            <strong className="text-emerald-600">
              T² vs L is a straight line!
            </strong>
            <span className="text-muted-foreground">
              {" "}
              Slope = 4π²/g ≈ <strong>{t2Slope} s²/m</strong> — this lets you
              calculate g experimentally.
            </span>
          </motion.div>
        )}
      </div>

      {/* Data table */}
      {readings.length > 0 ? (
        <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Length (m)</th>
                <th className="px-4 py-3 text-left">Measured T (s)</th>
                <th className="px-4 py-3 text-left">Theoretical T (s)</th>
                <th className="px-4 py-3 text-left">T² (s²)</th>
                <th className="px-4 py-3 text-left">Error %</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => {
                const err = Math.abs(
                  ((r.measured - r.theoretical) / r.theoretical) * 100,
                ).toFixed(1);
                const t2 = (r.measured * r.measured).toFixed(4);
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-2.5 font-semibold font-heading">
                      {r.length}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-rose-600 font-semibold">
                      {r.measured}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-indigo-600">
                      {r.theoretical}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-purple-600">
                      {t2}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          +err < 3
                            ? "bg-emerald-500/10 text-emerald-600"
                            : +err < 7
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {err}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => remove(i)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
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
      ) : (
        <div className="w-full p-8 rounded-2xl border border-dashed border-border text-center text-muted-foreground text-sm">
          No readings recorded yet. Go to the Lab stage to collect data.
        </div>
      )}
    </div>
  );
}
