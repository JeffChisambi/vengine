import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const g = 9.81;

const LIQUIDS = [
  {
    id: "water",
    label: "Water",
    rho: 1000,
    color: "#3b82f6",
    lightColor: "#93c5fd",
    darkColor: "#1d4ed8",
  },
  {
    id: "seawater",
    label: "Sea Water",
    rho: 1025,
    color: "#0ea5e9",
    lightColor: "#7dd3fc",
    darkColor: "#0369a1",
  },
  {
    id: "oil",
    label: "Vegetable Oil",
    rho: 920,
    color: "#ca8a04",
    lightColor: "#fde68a",
    darkColor: "#92400e",
  },
  {
    id: "honey",
    label: "Honey",
    rho: 1400,
    color: "#d97706",
    lightColor: "#fcd34d",
    darkColor: "#92400e",
  },
  {
    id: "mercury",
    label: "Mercury",
    rho: 13600,
    color: "#64748b",
    lightColor: "#cbd5e1",
    darkColor: "#334155",
  },
];

const TANK_W = 180;
const TANK_H = 320;
const TANK_X = 80;
const TANK_TOP = 30;
const MAX_DEPTH = 3.0; // metres (full tank)
const SVG_W = 420;
const SVG_H = 400;

// Map depth (0–MAX_DEPTH) to SVG y inside tank
function depthToY(depth) {
  return TANK_TOP + (depth / MAX_DEPTH) * TANK_H;
}

function calcPressure(rho, depth) {
  return rho * g * depth;
}

// Gauge needle angle: 0 Pa → -135°, maxP → +135°
function needleAngle(pressure, maxP) {
  const clamped = Math.min(pressure, maxP);
  return -135 + (clamped / maxP) * 270;
}

function PressureGauge({ pressure, maxP, color }) {
  const angle = needleAngle(pressure, maxP);
  const r = 48;
  // Arc path (270° sweep from -135° to +135°)
  const startA = (-135 * Math.PI) / 180;
  const endA = (135 * Math.PI) / 180;
  const cx = 60,
    cy = 60;

  const ticks = Array.from({ length: 9 }, (_, i) => {
    const a = startA + (i / 8) * (endA - startA);
    return {
      a,
      x1: cx + (r - 6) * Math.cos(a),
      y1: cy + (r - 6) * Math.sin(a),
      x2: cx + r * Math.cos(a),
      y2: cy + r * Math.sin(a),
    };
  });

  const needleRad = (angle * Math.PI) / 180;

  return (
    <svg viewBox="0 0 120 80" className="w-full" style={{ maxWidth: 160 }}>
      <defs>
        <radialGradient id="gauge-face" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
        <filter id="gauge-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
      {/* Face */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 6}
        fill="url(#gauge-face)"
        stroke="#cbd5e1"
        strokeWidth={2}
        filter="url(#gauge-shadow)"
      />
      {/* Colored arc */}
      <path
        d={`M ${cx + r * Math.cos(startA)} ${cy + r * Math.sin(startA)}
                 A ${r} ${r} 0 1 1 ${cx + r * Math.cos(endA)} ${cy + r * Math.sin(endA)}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={7}
        strokeLinecap="round"
      />
      {/* Filled arc up to pressure */}
      {pressure > 0 &&
        (() => {
          const curA = startA + Math.min(1, pressure / maxP) * (endA - startA);
          const largeArc = curA - startA > Math.PI ? 1 : 0;
          return (
            <path
              d={`M ${cx + r * Math.cos(startA)} ${cy + r * Math.sin(startA)}
                     A ${r} ${r} 0 ${largeArc} 1 ${cx + r * Math.cos(curA)} ${cy + r * Math.sin(curA)}`}
              fill="none"
              stroke={color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeOpacity={0.8}
            />
          );
        })()}
      {/* Ticks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={i === 0 || i === 8 ? "#94a3b8" : "#cbd5e1"}
          strokeWidth={i % 4 === 0 ? 2 : 1}
        />
      ))}
      {/* Needle */}
      <motion.line
        x1={cx}
        y1={cy}
        x2={cx + (r - 12) * Math.cos(needleRad)}
        y2={cy + (r - 12) * Math.sin(needleRad)}
        stroke="#ef4444"
        strokeWidth={2.5}
        strokeLinecap="round"
        animate={{
          x2: cx + (r - 12) * Math.cos(needleRad),
          y2: cy + (r - 12) * Math.sin(needleRad),
        }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      />
      <circle cx={cx} cy={cy} r={4} fill="#ef4444" />
      {/* Labels */}
      <text
        x={cx}
        y={cy + 20}
        textAnchor="middle"
        fontSize={7}
        fill="#64748b"
        fontFamily="var(--font-body)"
      >
        {pressure >= 1000
          ? `${(pressure / 1000).toFixed(1)} kPa`
          : `${Math.round(pressure)} Pa`}
      </text>
    </svg>
  );
}

export default function PressureLab({ readings, setReadings }) {
  const [liquid, setLiquid] = useState(LIQUIDS[0]);
  const [depth, setDepth] = useState(1.0);
  const [jetsOpen, setJetsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const dragging = useRef(false);
  const svgRef = useRef(null);

  const pressure = calcPressure(liquid.rho, depth);
  const maxP = calcPressure(liquid.rho, MAX_DEPTH);
  const probeY = depthToY(depth);

  // Drag the pressure probe
  const onMouseMove = useCallback((e) => {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgH = SVG_H;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rawY = ((clientY - rect.top) / rect.height) * svgH;
    const clampedY = Math.max(
      TANK_TOP + 10,
      Math.min(TANK_TOP + TANK_H - 10, rawY),
    );
    const d = ((clampedY - TANK_TOP) / TANK_H) * MAX_DEPTH;
    setDepth(parseFloat(d.toFixed(2)));
  }, []);

  const onMouseUp = () => {
    dragging.current = false;
  };
  const onMouseDown = () => {
    dragging.current = true;
  };

  const handleRecord = () => {
    setReadings((r) => [
      ...r,
      {
        liquid: liquid.label,
        rho: liquid.rho,
        depth: parseFloat(depth.toFixed(2)),
        pressure: parseFloat(pressure.toFixed(1)),
        theoretical: parseFloat((liquid.rho * g * depth).toFixed(1)),
      },
    ]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-6 max-w-5xl mx-auto"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onMouseMove}
      onTouchEnd={onMouseUp}
    >
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-2">
          Interactive Lab
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Explore Liquid Pressure
        </h2>
        <p className="text-muted-foreground text-sm">
          Drag the pressure probe to different depths, change the liquid, and
          record your results.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* ── SVG Tank ── */}
        <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden select-none">
          <svg
            ref={svgRef}
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="max-w-full cursor-ns-resize"
          >
            <defs>
              <linearGradient id="lab-water" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={liquid.lightColor}
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor={liquid.darkColor}
                  stopOpacity="0.97"
                />
              </linearGradient>
              <linearGradient id="lab-tank-body" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.6" />
                <stop offset="40%" stopColor="#f8fafc" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.6" />
              </linearGradient>
              <filter id="lab-glow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="lab-probe-shadow">
                <feDropShadow
                  dx="2"
                  dy="2"
                  stdDeviation="3"
                  floodOpacity="0.2"
                />
              </filter>
              <clipPath id="lab-clip">
                <rect
                  x={TANK_X}
                  y={TANK_TOP}
                  width={TANK_W}
                  height={TANK_H}
                  rx={6}
                />
              </clipPath>
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="#f8fafc" />

            {/* Depth ruler on left */}
            {Array.from({ length: 7 }, (_, i) => {
              const d = i * 0.5;
              const y = depthToY(d);
              return (
                <g key={i}>
                  <line
                    x1={TANK_X - 18}
                    y1={y}
                    x2={TANK_X - 4}
                    y2={y}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <text
                    x={TANK_X - 22}
                    y={y + 4}
                    fontSize={9}
                    fill="#64748b"
                    textAnchor="end"
                    fontFamily="var(--font-body)"
                  >
                    {d.toFixed(1)}m
                  </text>
                </g>
              );
            })}
            <text
              x={TANK_X - 35}
              y={TANK_TOP + TANK_H / 2}
              fontSize={10}
              fill="#3b82f6"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(-90 ${TANK_X - 35} ${TANK_TOP + TANK_H / 2})`}
            >
              Depth (m)
            </text>

            {/* Tank shell */}
            <rect
              x={TANK_X}
              y={TANK_TOP}
              width={TANK_W}
              height={TANK_H}
              rx={6}
              fill="url(#lab-tank-body)"
              stroke="#94a3b8"
              strokeWidth={2.5}
            />

            {/* Water */}
            <rect
              x={TANK_X + 2}
              y={TANK_TOP + 2}
              width={TANK_W - 4}
              height={TANK_H - 4}
              rx={5}
              fill="url(#lab-water)"
              clipPath="url(#lab-clip)"
            />

            {/* Surface shimmer animation */}
            <motion.rect
              x={TANK_X + 2}
              y={TANK_TOP + 2}
              width={TANK_W - 4}
              height={10}
              rx={4}
              fill={liquid.lightColor}
              fillOpacity={0.45}
              animate={{ fillOpacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Pressure depth lines (isobars) */}
            {[0.5, 1.0, 1.5, 2.0, 2.5].map((d) => (
              <line
                key={d}
                x1={TANK_X + 4}
                y1={depthToY(d)}
                x2={TANK_X + TANK_W - 4}
                y2={depthToY(d)}
                stroke="#fff"
                strokeOpacity={0.12}
                strokeWidth={1}
                strokeDasharray="4 5"
              />
            ))}

            {/* Jets (optional) */}
            {jetsOpen &&
              [0.5, 1.5, 2.5].map((d, i) => {
                const jy = depthToY(d);
                const speed = calcPressure(liquid.rho, d) / 5000;
                const len = 20 + speed * 0.5;
                return (
                  <g key={d}>
                    <circle
                      cx={TANK_X + TANK_W}
                      cy={jy}
                      r={4}
                      fill={liquid.darkColor}
                    />
                    <motion.path
                      d={`M${TANK_X + TANK_W + 3},${jy} Q${TANK_X + TANK_W + len * 0.6},${jy + 4} ${TANK_X + TANK_W + len},${jy + len * 0.25}`}
                      fill="none"
                      stroke={liquid.color}
                      strokeWidth={2.5 + i * 0.4}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1, 1, 0] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: i * 0.3,
                        repeatDelay: 0.2,
                      }}
                    />
                  </g>
                );
              })}

            {/* Pressure probe cable */}
            <line
              x1={TANK_X + TANK_W / 2}
              y1={TANK_TOP - 10}
              x2={TANK_X + TANK_W / 2}
              y2={probeY - 16}
              stroke="#475569"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />

            {/* Pressure probe — draggable */}
            <g
              style={{ cursor: "ns-resize" }}
              onMouseDown={onMouseDown}
              onTouchStart={onMouseDown}
            >
              {/* Probe body */}
              <rect
                x={TANK_X + TANK_W / 2 - 22}
                y={probeY - 14}
                width={44}
                height={28}
                rx={8}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={1.5}
                filter="url(#lab-probe-shadow)"
              />
              <rect
                x={TANK_X + TANK_W / 2 - 18}
                y={probeY - 10}
                width={36}
                height={20}
                rx={5}
                fill="#0f172a"
                opacity={0.6}
              />
              {/* Sensor tip */}
              <motion.circle
                cx={TANK_X + TANK_W / 2}
                cy={probeY + 14}
                r={8}
                fill={liquid.color}
                filter="url(#lab-glow)"
                animate={{ r: [7, 9, 7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Grip lines */}
              {[-6, 0, 6].map((dx) => (
                <line
                  key={dx}
                  x1={TANK_X + TANK_W / 2 + dx}
                  y1={probeY - 6}
                  x2={TANK_X + TANK_W / 2 + dx}
                  y2={probeY + 6}
                  stroke="#475569"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Depth callout line */}
            <line
              x1={TANK_X - 4}
              y1={probeY}
              x2={TANK_X + TANK_W / 2 - 22}
              y2={probeY}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={TANK_X - 6}
              y={probeY - 3}
              fontSize={9}
              fill="#3b82f6"
              textAnchor="end"
              fontFamily="var(--font-heading)"
              fontWeight="bold"
            >
              {depth.toFixed(2)} m
            </text>

            {/* Gauge on right */}
            <foreignObject
              x={TANK_X + TANK_W + 20}
              y={80}
              width={160}
              height={100}
            >
              <div xmlns="http://www.w3.org/1999/xhtml">
                <PressureGauge
                  pressure={pressure}
                  maxP={maxP}
                  color={liquid.color}
                />
              </div>
            </foreignObject>
            <text
              x={TANK_X + TANK_W + 100}
              y={72}
              textAnchor="middle"
              fontSize={10}
              fill="#64748b"
              fontFamily="var(--font-heading)"
              fontWeight="bold"
            >
              Pressure Gauge
            </text>

            {/* Pressure value big */}
            <text
              x={TANK_X + TANK_W + 100}
              y={200}
              textAnchor="middle"
              fontSize={13}
              fill="#1e293b"
              fontFamily="var(--font-heading)"
              fontWeight="800"
            >
              {pressure >= 1000
                ? `${(pressure / 1000).toFixed(2)} kPa`
                : `${Math.round(pressure)} Pa`}
            </text>
            <text
              x={TANK_X + TANK_W + 100}
              y={215}
              textAnchor="middle"
              fontSize={9}
              fill="#64748b"
              fontFamily="var(--font-body)"
            >
              P = ρgh = {liquid.rho}×9.81×{depth.toFixed(2)}
            </text>

            {/* Pressure arrow — taller = more pressure */}
            {(() => {
              const arrowH = Math.min(100, (pressure / maxP) * 100);
              return (
                <g>
                  <motion.rect
                    x={TANK_X + TANK_W + 70}
                    y={260 - arrowH}
                    width={20}
                    height={arrowH}
                    rx={3}
                    fill={liquid.color}
                    fillOpacity={0.7}
                    animate={{ height: arrowH, y: 260 - arrowH }}
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                  <line
                    x1={TANK_X + TANK_W + 50}
                    y1={260}
                    x2={TANK_X + TANK_W + 110}
                    y2={260}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <text
                    x={TANK_X + TANK_W + 80}
                    y={278}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#64748b"
                    fontFamily="var(--font-body)"
                  >
                    Relative P
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col gap-4 w-full max-w-[240px]">
          {/* Liquid selector */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Choose Liquid
            </p>
            <div className="space-y-2">
              {LIQUIDS.map((liq) => (
                <button
                  key={liq.id}
                  onClick={() => setLiquid(liq)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    liquid.id === liq.id
                      ? "border-blue-400 bg-blue-500/8 text-blue-700"
                      : "border-border bg-muted/40 text-muted-foreground hover:border-blue-200"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ background: liq.color }}
                  />
                  <span className="flex-1 text-left">{liq.label}</span>
                  <span className="text-[10px] font-mono opacity-70">
                    {liq.rho} kg/m³
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Depth slider */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Depth
              </p>
              <span className="text-sm font-bold text-blue-600 font-heading">
                {depth.toFixed(2)} m
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={MAX_DEPTH * 100}
              step={5}
              value={depth * 100}
              onChange={(e) => setDepth(+e.target.value / 100)}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Surface</span>
              <span>{MAX_DEPTH} m</span>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`text-[10px] py-1 rounded-lg border transition-all ${
                    depth === d
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Pressure readout */}
          <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">
              Live Pressure
            </p>
            <motion.p
              key={Math.round(pressure)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-xl font-extrabold font-heading text-blue-600"
            >
              {pressure >= 1000
                ? `${(pressure / 1000).toFixed(2)} kPa`
                : `${Math.round(pressure)} Pa`}
            </motion.p>
            <p className="text-[10px] text-muted-foreground">
              P = {liquid.rho} × 9.81 × {depth.toFixed(2)}
            </p>
          </div>

          {/* Jets toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setJetsOpen((s) => !s)}
              className={`w-9 h-5 rounded-full transition-colors ${jetsOpen ? "bg-blue-500" : "bg-muted"} relative shrink-0`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${jetsOpen ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Show pressure jets
            </span>
          </label>

          {/* Record */}
          <Button
            onClick={handleRecord}
            className={`gap-2 border-0 text-white ${justAdded ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            <Plus className="w-4 h-4" />
            {justAdded ? "✓ Recorded!" : "Record Reading"}
          </Button>

          {readings.length > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {readings.length} reading{readings.length !== 1 ? "s" : ""}{" "}
              recorded
            </p>
          )}

          {readings.length >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-600 font-semibold"
            >
              Head to Data tab to see your graph →
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
