import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  Legend,
} from "recharts";

const g = 9.81;

const LIQUID_COLORS = {
  Water: "#3b82f6",
  "Sea Water": "#0ea5e9",
  "Vegetable Oil": "#ca8a04",
  Honey: "#d97706",
  Mercury: "#64748b",
};

const LIQUID_RHO = {
  Water: 1000,
  "Sea Water": 1025,
  "Vegetable Oil": 920,
  Honey: 1400,
  Mercury: 13600,
};

export default function PressureData({ readings, setReadings }) {
  const [highlight, setHighlight] = useState(null);

  // Theoretical lines for each liquid in readings
  const liquidNames = [...new Set(readings.map((r) => r.liquid))];

  const theoryLines = useMemo(() => {
    return liquidNames.map((name) => {
      const rho = LIQUID_RHO[name] || 1000;
      return {
        name,
        color: LIQUID_COLORS[name] || "#3b82f6",
        data: Array.from({ length: 31 }, (_, i) => {
          const h = i * 0.1;
          return { h: +h.toFixed(1), P: +(rho * g * h).toFixed(1) };
        }),
      };
    });
  }, [readings]);

  const scatterByLiquid = useMemo(() => {
    const map = {};
    readings.forEach((r) => {
      if (!map[r.liquid]) map[r.liquid] = [];
      map[r.liquid].push({ h: r.depth, P: r.pressure });
    });
    return map;
  }, [readings]);

  const remove = (i) => setReadings((rs) => rs.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-full flex flex-col gap-6 items-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-2">
          Data Analysis
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Pressure vs Depth
        </h2>
        <p className="text-muted-foreground text-sm">
          {readings.length === 0
            ? "No readings yet — go back to the Lab and record some measurements."
            : "Your measured points plotted against the theoretical P = ρgh line."}
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
            <LineChart margin={{ top: 10, right: 20, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,93%)" />
              <XAxis
                type="number"
                dataKey="h"
                domain={[0, 3.1]}
                tickCount={7}
                label={{
                  value: "Depth h (m)",
                  position: "insideBottom",
                  offset: -12,
                  fontSize: 11,
                  fill: "#64748b",
                }}
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
                name="Depth"
              />
              <YAxis
                type="number"
                dataKey="P"
                domain={[0, "auto"]}
                label={{
                  value: "Pressure P (Pa)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 15,
                  fontSize: 11,
                  fill: "#64748b",
                }}
                fontSize={10}
                tick={{ fill: "#94a3b8" }}
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                }
                name="Pressure"
              />
              <Tooltip
                formatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(2)} kPa` : `${v} Pa`
                }
                labelFormatter={(v) => `Depth: ${v} m`}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              {theoryLines.map((line) => (
                <Line
                  key={line.name}
                  data={line.data}
                  dataKey="P"
                  type="monotone"
                  stroke={line.color}
                  strokeWidth={2}
                  dot={false}
                  name={`${line.name} (theory)`}
                  strokeOpacity={0.6}
                />
              ))}
              {Object.entries(scatterByLiquid).map(([name, pts]) => (
                <Scatter
                  key={name}
                  data={pts}
                  dataKey="P"
                  name={`${name} (measured)`}
                  fill={LIQUID_COLORS[name] || "#3b82f6"}
                  r={6}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {readings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-blue-500/8 border border-blue-500/20 text-xs text-center"
          >
            <strong className="text-blue-600">
              P vs h is a straight line!
            </strong>
            <span className="text-muted-foreground">
              {" "}
              The gradient = ρg — steeper for denser liquids. This confirms P =
              ρgh directly.
            </span>
          </motion.div>
        )}
      </div>

      {/* Table */}
      {readings.length > 0 && (
        <div className="w-full rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Liquid</th>
                <th className="px-3 py-3 text-left">ρ (kg/m³)</th>
                <th className="px-3 py-3 text-left">Depth (m)</th>
                <th className="px-3 py-3 text-left">Pressure</th>
                <th className="px-3 py-3 text-left">Theoretical</th>
                <th className="px-3 py-3 text-left">Error</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => {
                const err = Math.abs(
                  ((r.pressure - r.theoretical) / r.theoretical) * 100,
                ).toFixed(1);
                const color = LIQUID_COLORS[r.liquid] || "#3b82f6";
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-t border-border hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-3 py-2 text-muted-foreground font-mono text-xs">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: color }}
                        />
                        <span className="font-semibold text-xs">
                          {r.liquid}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{r.rho}</td>
                    <td className="px-3 py-2 font-semibold font-heading">
                      {r.depth}
                    </td>
                    <td
                      className="px-3 py-2 font-mono font-bold"
                      style={{ color }}
                    >
                      {r.pressure >= 1000
                        ? `${(r.pressure / 1000).toFixed(2)} kPa`
                        : `${r.pressure} Pa`}
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground text-xs">
                      {r.theoretical >= 1000
                        ? `${(r.theoretical / 1000).toFixed(2)} kPa`
                        : `${r.theoretical} Pa`}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          +err < 2
                            ? "bg-emerald-500/10 text-emerald-600"
                            : +err < 5
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {err}%
                      </span>
                    </td>
                    <td className="px-3 py-2">
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
      )}

      {/* Key insight */}
      {readings.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            {
              label: "Pressure at surface",
              value: "0 Pa",
              note: "No liquid above",
            },
            {
              label: "Doubles with depth",
              value: "2× deeper = 2× P",
              note: "Linear relationship",
            },
            {
              label: "Denser liquid",
              value: "Higher P at same depth",
              note: "ρ directly scales P",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-center"
            >
              <p className="text-[10px] text-muted-foreground">{c.label}</p>
              <p className="text-sm font-bold text-blue-600 font-heading my-0.5">
                {c.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
