import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";

const MATERIALS = [
  { id: "iron",     label: "Iron",     alpha: 12e-6, color: "#9ca3af", light: "#e5e7eb", dark: "#374151", glow: "#6b7280" },
  { id: "copper",   label: "Copper",   alpha: 17e-6, color: "#cd7f32", light: "#fcd0a1", dark: "#7c2d12", glow: "#f97316" },
  { id: "aluminum", label: "Aluminum", alpha: 23e-6, color: "#b0b8c1", light: "#f1f5f9", dark: "#475569", glow: "#94a3b8" },
  { id: "steel",    label: "Steel",    alpha: 11e-6, color: "#64748b", light: "#cbd5e1", dark: "#1e293b", glow: "#475569" },
  { id: "brass",    label: "Brass",    alpha: 19e-6, color: "#d4a017", light: "#fde68a", dark: "#92400e", glow: "#f59e0b" },
];

const L0 = 1.0;
const T_REF = 20;
const T_MAX = 500;
const ALPHA_MAX = 23e-6;
const MAX_VIS_EXP = 64;

const SVG_W = 520;
const SVG_H = 390;
const ROD_BASE_X = 80;
const ROD_BASE_W = 360;
const ROD_Y = 185;
const ROD_H = 46;

// Pre-calculate particles so they never use Math.random() in render
const PARTICLE_GRID = (() => {
  const cols = 18, rows = 3;
  const pts = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pts.push({
        bx: (c + 0.5) / cols,
        by: (r + 0.5) / rows,
        phase: (r * cols + c) * 0.37,
        speed: 0.28 + ((r * cols + c) % 7) * 0.05,
      });
    }
  }
  return pts;
})();

function heatColor(t) {
  const f = (t - T_REF) / (T_MAX - T_REF);
  if (f <= 0) return "#9ca3af";
  const r = Math.round(156 + f * 99);
  const g = Math.round(163 - f * 130);
  const b = Math.round(175 - f * 160);
  return `rgb(${r},${g},${b})`;
}

function Thermometer({ temp }) {
  const pct = Math.max(0, Math.min(1, (temp - T_REF) / (T_MAX - T_REF)));
  const bulbY = 148, tubeTop = 18, tubeH = 120;
  const fillH = pct * tubeH;
  const fillY = tubeTop + tubeH - fillH;
  const fillColor = pct < 0.35 ? "#3b82f6" : pct < 0.65 ? "#f59e0b" : "#ef4444";

  return (
    <svg viewBox="0 0 36 170" width={36} height={170}>
      <defs>
        <linearGradient id="th-tube" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="40%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      {/* Tube */}
      <rect x={13} y={tubeTop} width={10} height={tubeH + 10} rx={5}
        fill="url(#th-tube)" stroke="#cbd5e1" strokeWidth={1.2} />
      {/* Mercury fill */}
      <motion.rect
        x={15} y={fillY} width={6} height={fillH}
        rx={2} fill={fillColor}
        animate={{ height: fillH, y: fillY }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
      />
      {/* Bulb */}
      <circle cx={18} cy={bulbY} r={11} fill={fillColor} />
      <circle cx={18} cy={bulbY} r={11} fill="url(#th-tube)" fillOpacity={0.4} />
      {/* Tick marks */}
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
        <g key={i}>
          <line x1={6} y1={tubeTop + (1 - f) * tubeH} x2={12} y2={tubeTop + (1 - f) * tubeH}
            stroke="#94a3b8" strokeWidth={1} />
          <text x={4} y={tubeTop + (1 - f) * tubeH + 3}
            fontSize={6} fill="#64748b" textAnchor="end" fontFamily="sans-serif">
            {Math.round(T_REF + f * (T_MAX - T_REF))}
          </text>
        </g>
      ))}
      <text x={18} y={170} textAnchor="middle" fontSize={7}
        fill="#64748b" fontFamily="sans-serif">°C</text>
    </svg>
  );
}

function Flame({ temp }) {
  const intensity = Math.max(0, (temp - T_REF) / (T_MAX - T_REF));
  if (intensity < 0.02) return null;
  const flameH = 18 + intensity * 30;
  const cx = ROD_BASE_W / 2 + ROD_BASE_X;

  return (
    <g opacity={Math.min(1, intensity * 1.4)}>
      {/* Outer flame */}
      <motion.path
        d={`M${cx - 40},${ROD_Y + ROD_H + 2}
           Q${cx - 20},${ROD_Y + ROD_H - flameH * 0.6} ${cx},${ROD_Y + ROD_H - flameH * 0.2}
           Q${cx + 20},${ROD_Y + ROD_H - flameH * 0.6} ${cx + 40},${ROD_Y + ROD_H + 2} Z`}
        fill="#fb923c" fillOpacity={0.5}
        animate={{ scaleY: [0.92, 1.08, 0.95, 1.03, 0.92] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      {/* Mid flame */}
      <motion.path
        d={`M${cx - 26},${ROD_Y + ROD_H + 1}
           Q${cx - 12},${ROD_Y + ROD_H - flameH * 0.8} ${cx},${ROD_Y + ROD_H - flameH}
           Q${cx + 12},${ROD_Y + ROD_H - flameH * 0.8} ${cx + 26},${ROD_Y + ROD_H + 1} Z`}
        fill="#f97316" fillOpacity={0.75}
        animate={{ scaleY: [1.05, 0.9, 1.08, 0.95, 1.05] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
      />
      {/* Inner hot core */}
      <motion.path
        d={`M${cx - 14},${ROD_Y + ROD_H + 1}
           Q${cx - 5},${ROD_Y + ROD_H - flameH * 0.65} ${cx},${ROD_Y + ROD_H - flameH * 0.85}
           Q${cx + 5},${ROD_Y + ROD_H - flameH * 0.65} ${cx + 14},${ROD_Y + ROD_H + 1} Z`}
        fill="#fcd34d" fillOpacity={0.9}
        animate={{ scaleY: [0.95, 1.1, 0.92, 1.05, 0.95] }}
        transition={{ duration: 0.4, repeat: Infinity, delay: 0.05 }}
      />
      {/* Heater base */}
      <rect x={cx - 50} y={ROD_Y + ROD_H + 1} width={100} height={8}
        rx={2} fill="#1e293b" />
      <rect x={cx - 46} y={ROD_Y + ROD_H + 3} width={8} height={4}
        rx={1} fill="#ef4444" fillOpacity={0.8} />
      <rect x={cx - 34} y={ROD_Y + ROD_H + 3} width={8} height={4}
        rx={1} fill="#ef4444" fillOpacity={0.65} />
    </g>
  );
}

export default function ThermalLab({ readings, setReadings }) {
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [temp, setTemp] = useState(T_REF);
  const [running, setRunning] = useState(false);
  const [showParticles, setShowParticles] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  const deltaT = temp - T_REF;
  const deltaL_m = material.alpha * L0 * deltaT;
  const deltaL_mm = deltaL_m * 1000;
  const heatFrac = deltaT / (T_MAX - T_REF);
  const visExp = (material.alpha / ALPHA_MAX) * heatFrac * MAX_VIS_EXP;

  const rodX = ROD_BASE_X - visExp / 2;
  const rodW = ROD_BASE_W + visExp;
  const rodColor = heatColor(temp);

  // Auto-heat loop
  useEffect(() => {
    if (!running) { lastTsRef.current = null; return; }
    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTemp(prev => {
        const next = prev + 40 * dt;
        if (next >= T_MAX) { setRunning(false); return T_MAX; }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
    setTemp(T_REF);
    lastTsRef.current = null;
  };

  const handleRecord = () => {
    setReadings(r => [...r, {
      material: material.label,
      alpha: material.alpha,
      temp: parseFloat(temp.toFixed(1)),
      deltaT: parseFloat(deltaT.toFixed(1)),
      deltaL_mm: parseFloat(deltaL_mm.toFixed(4)),
      theoretical: parseFloat(deltaL_mm.toFixed(4)),
    }]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Particle vibration amplitude
  const vibAmp = heatFrac * 6.5;

  return (
    <div className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-6 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-2">
          Interactive Lab
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Thermal Expansion
        </h2>
        <p className="text-muted-foreground text-sm">
          Heat the metal rod and observe it expanding. Watch atoms vibrate faster as temperature rises.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">

        {/* ── SVG Scene ── */}
        <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden select-none w-full">
          <svg
            width={SVG_W} height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="max-w-full w-full" style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="tl-rod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="white"    stopOpacity={0.35} />
                <stop offset="30%"  stopColor={rodColor} stopOpacity={0.9} />
                <stop offset="100%" stopColor={material.dark} stopOpacity={1} />
              </linearGradient>
              <radialGradient id="tl-heatGlow" cx="50%" cy="100%" r="60%">
                <stop offset="0%"   stopColor="#f97316" stopOpacity={heatFrac * 0.55} />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <filter id="tl-glow" x="-20%" y="-60%" width="140%" height="220%">
                <feGaussianBlur stdDeviation={1 + heatFrac * 5} result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="tl-rodGlow" x="-5%" y="-40%" width="110%" height="180%">
                <feGaussianBlur stdDeviation={heatFrac * 4} result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <clipPath id="tl-rodClip">
                <rect x={rodX} y={ROD_Y - 4} width={rodW} height={ROD_H + 8} rx={8} />
              </clipPath>
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="#f8fafc" />

            {/* Light grid */}
            {Array.from({ length: 12 }, (_, i) => (
              <line key={`gx${i}`} x1={i * 47} y1={0} x2={i * 47} y2={SVG_H}
                stroke="#e2e8f0" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`gy${i}`} x1={0} y1={i * 48} x2={SVG_W} y2={i * 48}
                stroke="#e2e8f0" strokeWidth={0.5} />
            ))}

            {/* Heat glow behind rod */}
            <ellipse
              cx={ROD_BASE_X + ROD_BASE_W / 2}
              cy={ROD_Y + ROD_H}
              rx={rodW * 0.6 + heatFrac * 30}
              ry={30 + heatFrac * 25}
              fill="url(#tl-heatGlow)"
            />

            {/* Original length bracket */}
            <line x1={ROD_BASE_X} y1={ROD_Y - 16} x2={ROD_BASE_X + ROD_BASE_W} y2={ROD_Y - 16}
              stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 4" />
            <line x1={ROD_BASE_X} y1={ROD_Y - 22} x2={ROD_BASE_X} y2={ROD_Y - 10}
              stroke="#94a3b8" strokeWidth={1} />
            <line x1={ROD_BASE_X + ROD_BASE_W} y1={ROD_Y - 22} x2={ROD_BASE_X + ROD_BASE_W} y2={ROD_Y - 10}
              stroke="#94a3b8" strokeWidth={1} />
            <text x={ROD_BASE_X + ROD_BASE_W / 2} y={ROD_Y - 23}
              textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="var(--font-body)">
              L₀ = 1.000 m
            </text>

            {/* Expansion indicators (ΔL on each side) */}
            {visExp > 1 && (
              <>
                {/* Left expansion */}
                <motion.g animate={{ x: 0 }} transition={{ type: "spring", stiffness: 80 }}>
                  <line x1={rodX} y1={ROD_Y - 16} x2={ROD_BASE_X} y2={ROD_Y - 16}
                    stroke="#f97316" strokeWidth={1.5} />
                  <line x1={rodX} y1={ROD_Y - 22} x2={rodX} y2={ROD_Y - 10}
                    stroke="#f97316" strokeWidth={1.5} />
                </motion.g>
                {/* Right expansion */}
                <line x1={ROD_BASE_X + ROD_BASE_W} y1={ROD_Y - 16}
                  x2={rodX + rodW} y2={ROD_Y - 16}
                  stroke="#f97316" strokeWidth={1.5} />
                <line x1={rodX + rodW} y1={ROD_Y - 22} x2={rodX + rodW} y2={ROD_Y - 10}
                  stroke="#f97316" strokeWidth={1.5} />
                {/* ΔL label */}
                <text x={ROD_BASE_X + ROD_BASE_W / 2} y={ROD_Y - 32}
                  textAnchor="middle" fontSize={10} fill="#f97316"
                  fontFamily="var(--font-heading)" fontWeight="bold">
                  ΔL = {deltaL_mm.toFixed(3)} mm
                </text>
              </>
            )}

            {/* ── Left clamp ── */}
            <rect x={rodX - 14} y={ROD_Y - 8} width={14} height={ROD_H + 16} rx={3}
              fill="#334155" stroke="#1e293b" strokeWidth={1} />
            <rect x={rodX - 10} y={ROD_Y - 4} width={6} height={ROD_H + 8} rx={2}
              fill="#475569" />

            {/* ── Right clamp ── */}
            <rect x={rodX + rodW} y={ROD_Y - 8} width={14} height={ROD_H + 16} rx={3}
              fill="#334155" stroke="#1e293b" strokeWidth={1} />
            <rect x={rodX + rodW + 4} y={ROD_Y - 4} width={6} height={ROD_H + 8} rx={2}
              fill="#475569" />

            {/* ── Rod body ── */}
            {/* Glow layer */}
            {heatFrac > 0.05 && (
              <rect x={rodX} y={ROD_Y} width={rodW} height={ROD_H} rx={6}
                fill={material.glow} fillOpacity={heatFrac * 0.35}
                filter="url(#tl-rodGlow)" />
            )}
            {/* Main rod */}
            <motion.rect
              x={rodX} y={ROD_Y} width={rodW} height={ROD_H} rx={6}
              fill="url(#tl-rod)"
              stroke={material.dark} strokeWidth={1.5}
              animate={{ x: rodX, width: rodW }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
            {/* Top sheen */}
            <rect x={rodX + 8} y={ROD_Y + 4} width={rodW - 16} height={8} rx={4}
              fill="white" fillOpacity={0.28} clipPath="url(#tl-rodClip)" />

            {/* ── Particles ── */}
            {showParticles && PARTICLE_GRID.map((p, i) => {
              const px = rodX + p.bx * rodW;
              const py = ROD_Y + 6 + p.by * (ROD_H - 12);
              const amp = vibAmp;
              return (
                <motion.circle
                  key={i} r={1.8}
                  fill="white" fillOpacity={0.45 + heatFrac * 0.35}
                  animate={{
                    cx: [px - amp * Math.cos(p.phase), px + amp * Math.cos(p.phase), px - amp * Math.cos(p.phase)],
                    cy: [py - amp * Math.sin(p.phase), py + amp * Math.sin(p.phase), py - amp * Math.sin(p.phase)],
                  }}
                  transition={{
                    duration: Math.max(0.12, p.speed * (1 - heatFrac * 0.75)),
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              );
            })}

            {/* ── Flame / Heater ── */}
            <Flame temp={temp} />

            {/* ── Ruler ── */}
            <g>
              <line x1={ROD_BASE_X - 5} y1={ROD_Y + ROD_H + 22}
                x2={ROD_BASE_X + ROD_BASE_W + 5} y2={ROD_Y + ROD_H + 22}
                stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: 11 }, (_, i) => (
                <g key={i}>
                  <line
                    x1={ROD_BASE_X + i * (ROD_BASE_W / 10)}
                    y1={ROD_Y + ROD_H + 18}
                    x2={ROD_BASE_X + i * (ROD_BASE_W / 10)}
                    y2={ROD_Y + ROD_H + 26}
                    stroke="#94a3b8" strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                  />
                  {i % 5 === 0 && (
                    <text
                      x={ROD_BASE_X + i * (ROD_BASE_W / 10)}
                      y={ROD_Y + ROD_H + 35}
                      textAnchor="middle" fontSize={8} fill="#94a3b8"
                      fontFamily="var(--font-body)">
                      {i === 0 ? "0" : i === 5 ? "0.5 m" : "1 m"}
                    </text>
                  )}
                </g>
              ))}
            </g>

            {/* ── Thermometer ── */}
            <foreignObject x={SVG_W - 56} y={20} width={50} height={185}>
              <div xmlns="http://www.w3.org/1999/xhtml">
                <Thermometer temp={temp} />
              </div>
            </foreignObject>

            {/* ── Temp readout ── */}
            <rect x={SVG_W - 72} y={210} width={64} height={38} rx={6}
              fill="white" fillOpacity={0.95} stroke="#e2e8f0" strokeWidth={1} />
            <motion.text
              x={SVG_W - 40} y={227}
              textAnchor="middle" fontSize={13}
              fill={heatFrac > 0.5 ? "#ef4444" : heatFrac > 0.25 ? "#f59e0b" : "#3b82f6"}
              fontFamily="var(--font-heading)" fontWeight="800"
              key={Math.round(temp)}
              initial={{ scale: 1.05 }} animate={{ scale: 1 }}
            >
              {Math.round(temp)}°C
            </motion.text>
            <text x={SVG_W - 40} y={241}
              textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily="var(--font-body)">
              Temperature
            </text>

            {/* ΔL info panel */}
            <rect x={SVG_W - 72} y={258} width={64} height={50} rx={6}
              fill="white" fillOpacity={0.95} stroke="#e2e8f0" strokeWidth={1} />
            <text x={SVG_W - 40} y={273}
              textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily="var(--font-body)">
              Extension
            </text>
            <text x={SVG_W - 40} y={288}
              textAnchor="middle" fontSize={11}
              fill="#f97316" fontFamily="var(--font-heading)" fontWeight="800">
              {deltaL_mm.toFixed(3)}
            </text>
            <text x={SVG_W - 40} y={301}
              textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily="var(--font-body)">
              mm
            </text>

            {/* Material label */}
            <text x={ROD_BASE_X + ROD_BASE_W / 2} y={SVG_H - 10}
              textAnchor="middle" fontSize={10}
              fill={material.dark} fontFamily="var(--font-heading)" fontWeight="bold">
              {material.label}  ·  α = {(material.alpha * 1e6).toFixed(0)} × 10⁻⁶ °C⁻¹
            </text>
          </svg>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[250px]">

          {/* Material selector */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Material
            </p>
            <div className="space-y-2">
              {MATERIALS.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => { handleReset(); setMaterial(mat); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    material.id === mat.id
                      ? "border-orange-400 bg-orange-500/8 text-orange-700"
                      : "border-border bg-muted/40 text-muted-foreground hover:border-orange-200"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full shrink-0"
                    style={{ background: mat.color, border: `1.5px solid ${mat.dark}` }} />
                  <span className="flex-1 text-left">{mat.label}</span>
                  <span className="text-[10px] font-mono opacity-70">
                    α={+(mat.alpha * 1e6).toFixed(0)}e-6
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Temperature slider */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Temperature
              </p>
              <span className="text-sm font-bold text-orange-600 font-heading">
                {Math.round(temp)}°C
              </span>
            </div>
            <input
              type="range" min={T_REF} max={T_MAX} step={1}
              value={Math.round(temp)}
              onChange={e => { setRunning(false); setTemp(+e.target.value); }}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{T_REF}°C</span><span>{T_MAX}°C</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {[100, 200, 350, 500].map(t => (
                <button key={t}
                  onClick={() => { setRunning(false); setTemp(t); }}
                  className={`text-[10px] py-1 rounded-lg border transition-all ${
                    Math.abs(temp - t) < 3
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >{t}°</button>
              ))}
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex gap-2">
            <Button
              onClick={() => setRunning(r => !r)}
              disabled={temp >= T_MAX}
              className={`flex-1 border-0 text-white text-xs gap-1.5 ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-600 hover:bg-orange-700"}`}
            >
              {running ? <><Pause className="w-3.5 h-3.5" />Pause</> : <><Play className="w-3.5 h-3.5" />Heat Up</>}
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} className="w-9 h-9 shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* ΔT / ΔL readout */}
          <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20 space-y-1.5">
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Live Readings</p>
            {[
              { label: "ΔT", value: `${deltaT.toFixed(1)} °C` },
              { label: "ΔL", value: `${deltaL_mm.toFixed(4)} mm` },
              { label: "ΔL/L₀", value: `${(material.alpha * deltaT * 1e6).toFixed(2)} μ` },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <motion.span
                  key={c.value}
                  initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                  className="text-sm font-bold font-heading text-orange-600"
                >{c.value}</motion.span>
              </div>
            ))}
          </div>

          {/* Particle toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setShowParticles(p => !p)}
              className={`w-9 h-5 rounded-full transition-colors ${showParticles ? "bg-orange-500" : "bg-muted"} relative shrink-0`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showParticles ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-muted-foreground">Show atom vibration</span>
          </label>

          {/* Record */}
          <Button
            onClick={handleRecord}
            disabled={deltaT < 10}
            className={`gap-2 text-sm border-0 ${justAdded ? "bg-emerald-500 text-white" : "bg-orange-600 hover:bg-orange-700 text-white"} disabled:opacity-40`}
          >
            <Plus className="w-4 h-4" />
            {justAdded ? "✓ Recorded!" : "Record Reading"}
          </Button>

          {readings.length > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-xs text-muted-foreground">
              {readings.length} reading{readings.length !== 1 ? "s" : ""} recorded
            </motion.p>
          )}
        </div>
      </div>

      {readings.length >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold">
          Great data! Head to the Data tab to plot ΔL vs ΔT →
        </motion.div>
      )}
    </div>
  );
}
