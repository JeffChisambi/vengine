import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, RotateCcw, Plus, GitBranch, Minus } from "lucide-react";

/* ─── Physics helpers ─────────────────────────────────────────── */
function calcSeries(voltage, r1, r2) {
  const rTotal = r1 + r2;
  const iTotal = voltage / rTotal;
  return { rTotal, iTotal, i1: iTotal, i2: iTotal, v1: iTotal * r1, v2: iTotal * r2 };
}
function calcParallel(voltage, r1, r2) {
  const rTotal = (r1 * r2) / (r1 + r2);
  const iTotal = voltage / rTotal;
  const i1 = voltage / r1;
  const i2 = voltage / r2;
  return { rTotal, iTotal, i1, i2, v1: voltage, v2: voltage };
}

/* ─── SVG component helpers ───────────────────────────────────── */
function BatteryV({ cx, termPlus, termMinus }) {
  const mid = (termPlus + termMinus) / 2;
  return (
    <g>
      <line x1={cx} y1={termPlus} x2={cx} y2={mid - 18} stroke="#64748b" strokeWidth={1.8} />
      <line x1={cx - 15} y1={mid - 18} x2={cx + 15} y2={mid - 18} stroke="#10b981" strokeWidth={2} />
      <line x1={cx - 9} y1={mid - 8} x2={cx + 9} y2={mid - 8} stroke="#475569" strokeWidth={3.5} />
      <line x1={cx} y1={mid - 8} x2={cx} y2={mid + 8} stroke="#64748b" strokeWidth={1.8} />
      <line x1={cx - 15} y1={mid + 8} x2={cx + 15} y2={mid + 8} stroke="#10b981" strokeWidth={2} />
      <line x1={cx - 9} y1={mid + 18} x2={cx + 9} y2={mid + 18} stroke="#475569" strokeWidth={3.5} />
      <line x1={cx} y1={mid + 18} x2={cx} y2={termMinus} stroke="#64748b" strokeWidth={1.8} />
      <text x={cx + 22} y={mid - 14} fontSize={12} fill="#10b981" fontWeight="800">+</text>
      <text x={cx + 22} y={mid + 22} fontSize={12} fill="#64748b" fontWeight="800">−</text>
    </g>
  );
}

function ResistorH({ cx, cy, label, value, color = "#f59e0b" }) {
  return (
    <g>
      <rect x={cx - 30} y={cy - 10} width={60} height={20} rx={3}
        fill="white" stroke={color} strokeWidth={1.8} />
      <polyline
        points={`${cx - 23},${cy} ${cx - 17},${cy - 7} ${cx - 9},${cy + 7} ${cx - 1},${cy - 7} ${cx + 7},${cy + 7} ${cx + 15},${cy - 7} ${cx + 22},${cy}`}
        fill="none" stroke={color} strokeWidth={1.4} />
      <text x={cx} y={cy - 16} textAnchor="middle" fontSize={10} fill="#64748b" fontFamily="sans-serif">{label}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize={10} fill={color} fontWeight="700" fontFamily="sans-serif">{value}Ω</text>
    </g>
  );
}

function BulbSymbol({ cx, cy, brightness }) {
  const clampedB = Math.min(1, Math.max(0, brightness));
  const r = 19;
  const glowR = 14 + clampedB * 28;
  const yellowMix = Math.round(clampedB * 255);
  const fillColor = clampedB > 0.05
    ? `rgb(255, ${Math.round(200 + clampedB * 55)}, ${Math.round(clampedB * 60)})`
    : "white";
  return (
    <g>
      {clampedB > 0.05 && (
        <circle cx={cx} cy={cy} r={glowR} fill={`rgba(251,191,36,${clampedB * 0.35})`} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={fillColor} stroke="#64748b" strokeWidth={1.8} />
      <line x1={cx - 9} y1={cy - 9} x2={cx + 9} y2={cy + 9} stroke="#475569" strokeWidth={1.6} />
      <line x1={cx + 9} y1={cy - 9} x2={cx - 9} y2={cy + 9} stroke="#475569" strokeWidth={1.6} />
      {clampedB > 0.4 && (
        <>
          <line x1={cx} y1={cy - r - 6} x2={cx} y2={cy - r - 14} stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={cx + r + 4} y1={cy} x2={cx + r + 12} y2={cy} stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={cx - r - 4} y1={cy} x2={cx - r - 12} y2={cy} stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={cx + 14} y1={cy - 14} x2={cx + 20} y2={cy - 20} stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={cx - 14} y1={cy - 14} x2={cx - 20} y2={cy - 20} stroke="#fbbf24" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
      <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize={10} fill="#64748b">Bulb</text>
    </g>
  );
}

function AmmeterSymbol({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} fill="white" stroke="#64748b" strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fill="#475569" fontWeight="700">A</text>
    </g>
  );
}

/* ─── Animated current path overlay ──────────────────────────── */
function CurrentPath({ d, speed, color = "#f59e0b", strokeWidth = 2.2, delay = 0 }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray="9 15"
      strokeLinecap="round"
      animate={{ strokeDashoffset: [delay * -24, delay * -24 - 24] }}
      transition={{ duration: speed > 0 ? 24 / (speed * 60) : 999, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Series SVG ─────────────────────────────────────────────── */
function SeriesSVG({ voltage, r1, r2, physics, running }) {
  const { iTotal, v1, v2 } = physics;
  const brightness = Math.min(1, iTotal / 1.5);
  const speed = Math.min(80, iTotal * 40);

  // Layout constants
  const W = 500, H = 310;
  const LX = 65, RX = 445, TY = 50, BY = 270;
  const BATT_PLUS = 100, BATT_MINUS = 210;
  const BULB_CY = 160;

  const mainPath = `M${LX},${BATT_PLUS} L${LX},${TY} L${RX},${TY} L${RX},${BY} L${LX},${BY} L${LX},${BATT_MINUS}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[500px]" style={{ minHeight: 220 }}>
      <defs>
        <filter id="bulb-glow-s">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}

      {/* Base wires */}
      <polyline points={`${LX},${BATT_PLUS} ${LX},${TY} ${RX},${TY} ${RX},${BY} ${LX},${BY} ${LX},${BATT_MINUS}`}
        fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Animated current */}
      {running && speed > 0 && (
        <CurrentPath d={mainPath} speed={speed} />
      )}

      {/* Battery */}
      <BatteryV cx={LX} termPlus={BATT_PLUS} termMinus={BATT_MINUS} />

      {/* Voltage label */}
      <text x={LX - 28} y={BATT_PLUS + (BATT_MINUS - BATT_PLUS) / 2 + 4}
        textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight="700">{voltage}V</text>

      {/* R1 on top wire */}
      <ResistorH cx={175} cy={TY} label="R₁" value={r1} color="#f59e0b" />
      {/* V drop label */}
      <text x={175} y={TY - 28} textAnchor="middle" fontSize={9} fill="#64748b">
        {v1.toFixed(2)}V
      </text>

      {/* R2 on top wire */}
      <ResistorH cx={315} cy={TY} label="R₂" value={r2} color="#d97706" />
      <text x={315} y={TY - 28} textAnchor="middle" fontSize={9} fill="#64748b">
        {v2.toFixed(2)}V
      </text>

      {/* Bulb on right wire */}
      <BulbSymbol cx={RX} cy={BULB_CY} brightness={brightness} />

      {/* Ammeter on bottom wire */}
      <AmmeterSymbol cx={255} cy={BY} />
      <text x={255} y={BY + 20} textAnchor="middle" fontSize={9} fill="#64748b">
        {iTotal.toFixed(3)} A
      </text>

      {/* Current direction arrow */}
      {running && (
        <text x={LX + 14} y={TY - 6} fontSize={9} fill="#f59e0b" fontWeight="600">→</text>
      )}

      {/* R_total badge */}
      <rect x={W / 2 - 40} y={H - 22} width={80} height={16} rx={8} fill="#f59e0b" fillOpacity={0.12} />
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={9} fill="#d97706" fontWeight="700">
        R = {physics.rTotal.toFixed(1)} Ω
      </text>
    </svg>
  );
}

/* ─── Parallel SVG ───────────────────────────────────────────── */
function ParallelSVG({ voltage, r1, r2, physics, running }) {
  const { iTotal, i1, i2, rTotal } = physics;
  const brightness = Math.min(1, iTotal / 1.5);
  const speedMain = Math.min(80, iTotal * 40);
  const speed1 = Math.min(80, i1 * 40);
  const speed2 = Math.min(80, i2 * 40);

  const W = 500, H = 330;
  const LX = 65, RX = 445, TY = 45, BY = 285;
  const BATT_PLUS = 100, BATT_MINUS = 225;
  const BULB_CY = 165;
  const JL = 185, JR = 365;
  const BR1Y = 125, BR2Y = 205;

  const preJunction = `M${LX},${BATT_PLUS} L${LX},${TY} L${JL},${TY}`;
  const postJunction = `M${JR},${TY} L${RX},${TY} L${RX},${BY} L${LX},${BY} L${LX},${BATT_MINUS}`;
  const branch1 = `M${JL},${TY} L${JL},${BR1Y} L${JR},${BR1Y} L${JR},${TY}`;
  const branch2 = `M${JL},${TY} L${JL},${BR2Y} L${JR},${BR2Y} L${JR},${TY}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[500px]" style={{ minHeight: 240 }}>
      <defs>
        <filter id="bulb-glow-p">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}

      {/* Base wires — outer rect */}
      <polyline points={`${LX},${BATT_PLUS} ${LX},${TY} ${RX},${TY} ${RX},${BY} ${LX},${BY} ${LX},${BATT_MINUS}`}
        fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Branch wire outlines */}
      <polyline points={`${JL},${TY} ${JL},${BR1Y} ${JR},${BR1Y} ${JR},${TY}`}
        fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinejoin="round" />
      <polyline points={`${JL},${TY} ${JL},${BR2Y} ${JR},${BR2Y} ${JR},${TY}`}
        fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Animated current */}
      {running && speedMain > 0 && (
        <>
          <CurrentPath d={preJunction} speed={speedMain} />
          <CurrentPath d={postJunction} speed={speedMain} />
          <CurrentPath d={branch1} speed={speed1} color="#f59e0b" />
          <CurrentPath d={branch2} speed={speed2} color="#fbbf24" delay={0.5} />
        </>
      )}

      {/* Battery */}
      <BatteryV cx={LX} termPlus={BATT_PLUS} termMinus={BATT_MINUS} />
      <text x={LX - 28} y={BATT_PLUS + (BATT_MINUS - BATT_PLUS) / 2 + 4}
        textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight="700">{voltage}V</text>

      {/* Junction dots */}
      <circle cx={JL} cy={TY} r={5} fill="#f59e0b" />
      <circle cx={JR} cy={TY} r={5} fill="#f59e0b" />

      {/* R1 on upper branch */}
      <ResistorH cx={(JL + JR) / 2} cy={BR1Y} label="R₁" value={r1} color="#f59e0b" />
      <text x={(JL + JR) / 2 - 44} y={BR1Y + 4} textAnchor="middle" fontSize={9} fill="#64748b">
        {i1.toFixed(3)}A
      </text>
      <text x={(JL + JR) / 2 + 54} y={BR1Y + 4} textAnchor="middle" fontSize={9} fill="#64748b">
        {voltage}V
      </text>

      {/* R2 on lower branch */}
      <ResistorH cx={(JL + JR) / 2} cy={BR2Y} label="R₂" value={r2} color="#d97706" />
      <text x={(JL + JR) / 2 - 44} y={BR2Y + 4} textAnchor="middle" fontSize={9} fill="#64748b">
        {i2.toFixed(3)}A
      </text>
      <text x={(JL + JR) / 2 + 54} y={BR2Y + 4} textAnchor="middle" fontSize={9} fill="#64748b">
        {voltage}V
      </text>

      {/* Bulb */}
      <BulbSymbol cx={RX} cy={BULB_CY} brightness={brightness} />

      {/* Ammeter on bottom */}
      <AmmeterSymbol cx={255} cy={BY} />
      <text x={255} y={BY + 20} textAnchor="middle" fontSize={9} fill="#64748b">
        {iTotal.toFixed(3)} A
      </text>

      {/* I_total label near battery+ */}
      {running && (
        <text x={LX + 14} y={TY - 6} fontSize={9} fill="#f59e0b" fontWeight="600">I={iTotal.toFixed(2)}A →</text>
      )}

      {/* R_total badge */}
      <rect x={W / 2 - 40} y={H - 22} width={80} height={16} rx={8} fill="#f59e0b" fillOpacity={0.12} />
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={9} fill="#d97706" fontWeight="700">
        R = {rTotal.toFixed(2)} Ω
      </text>
    </svg>
  );
}

/* ─── Preset buttons ──────────────────────────────────────────── */
const VOLTAGES = [1.5, 3, 4.5, 6, 9, 12];
const RESISTANCES = [10, 22, 47, 100, 220];

/* ─── Main Lab Component ─────────────────────────────────────── */
export default function CircuitLab({ readings, setReadings, onNext }) {
  const [mode, setMode] = useState("series");
  const [voltage, setVoltage] = useState(6);
  const [r1, setR1] = useState(47);
  const [r2, setR2] = useState(100);
  const [running, setRunning] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const physics = mode === "series"
    ? calcSeries(voltage, r1, r2)
    : calcParallel(voltage, r1, r2);

  const { rTotal, iTotal, i1, i2, v1, v2 } = physics;
  const power = voltage * iTotal;

  const handleRecord = () => {
    setReadings(prev => [...prev, {
      mode,
      voltage,
      r1,
      r2,
      rTotal: parseFloat(rTotal.toFixed(3)),
      iTotal: parseFloat(iTotal.toFixed(4)),
      i1: parseFloat(i1.toFixed(4)),
      i2: parseFloat(i2.toFixed(4)),
      v1: parseFloat(v1.toFixed(3)),
      v2: parseFloat(v2.toFixed(3)),
      power: parseFloat(power.toFixed(3)),
    }]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="min-h-full flex flex-col gap-5 items-center justify-start px-4 py-6 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold mb-2">
          Interactive Lab
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">Build & Measure</h2>
        <p className="text-muted-foreground text-sm">
          Adjust voltage and resistors. Watch current, voltage drops, and bulb brightness respond instantly.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden shadow-sm text-sm font-semibold self-center">
        <button
          onClick={() => setMode("series")}
          className={`flex items-center gap-2 px-5 py-2.5 transition-colors ${mode === "series" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
        >
          <Minus className="w-4 h-4" /> Series
        </button>
        <button
          onClick={() => setMode("parallel")}
          className={`flex items-center gap-2 px-5 py-2.5 transition-colors ${mode === "parallel" ? "bg-amber-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
        >
          <GitBranch className="w-4 h-4" /> Parallel
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* Circuit SVG panel */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg flex-1 min-w-0 p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {mode === "series"
                ? <SeriesSVG voltage={voltage} r1={r1} r2={r2} physics={physics} running={running} />
                : <ParallelSVG voltage={voltage} r1={r1} r2={r2} physics={physics} running={running} />
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls panel */}
        <div className="flex flex-col gap-4 w-full lg:max-w-[270px] shrink-0">

          {/* Voltage */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Battery Voltage</p>
              <span className="text-sm font-bold text-amber-600 font-heading">{voltage} V</span>
            </div>
            <input
              type="range" min={1.5} max={12} step={1.5} value={voltage}
              onChange={e => setVoltage(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>1.5 V</span><span>12 V</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {VOLTAGES.map(v => (
                <button key={v} onClick={() => setVoltage(v)}
                  className={`text-xs px-2 py-0.5 rounded-md border transition-all ${voltage === v ? "bg-amber-500 text-white border-amber-500" : "bg-muted text-muted-foreground border-border hover:border-amber-300"}`}>
                  {v}V
                </button>
              ))}
            </div>
          </div>

          {/* R1 */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resistor R₁</p>
              <span className="text-sm font-bold text-amber-600 font-heading">{r1} Ω</span>
            </div>
            <input
              type="range" min={10} max={220} step={1} value={r1}
              onChange={e => setR1(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {RESISTANCES.map(v => (
                <button key={v} onClick={() => setR1(v)}
                  className={`text-xs px-2 py-0.5 rounded-md border transition-all ${r1 === v ? "bg-amber-500 text-white border-amber-500" : "bg-muted text-muted-foreground border-border hover:border-amber-300"}`}>
                  {v}Ω
                </button>
              ))}
            </div>
          </div>

          {/* R2 */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resistor R₂</p>
              <span className="text-sm font-bold text-amber-600 font-heading">{r2} Ω</span>
            </div>
            <input
              type="range" min={10} max={220} step={1} value={r2}
              onChange={e => setR2(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {RESISTANCES.map(v => (
                <button key={v} onClick={() => setR2(v)}
                  className={`text-xs px-2 py-0.5 rounded-md border transition-all ${r2 === v ? "bg-amber-500 text-white border-amber-500" : "bg-muted text-muted-foreground border-border hover:border-amber-300"}`}>
                  {v}Ω
                </button>
              ))}
            </div>
          </div>

          {/* Readings display */}
          <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Live Readings</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "R total", value: `${rTotal.toFixed(mode === "series" ? 0 : 2)} Ω`, color: "text-amber-600" },
                { label: "I total", value: `${iTotal.toFixed(3)} A`, color: "text-orange-600" },
                { label: mode === "series" ? "V across R₁" : "I through R₁", value: mode === "series" ? `${v1.toFixed(2)} V` : `${i1.toFixed(3)} A`, color: "text-yellow-700" },
                { label: mode === "series" ? "V across R₂" : "I through R₂", value: mode === "series" ? `${v2.toFixed(2)} V` : `${i2.toFixed(3)} A`, color: "text-yellow-700" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-lg p-2 border border-amber-100">
                  <p className="text-[9px] text-muted-foreground leading-tight">{label}</p>
                  <p className={`text-sm font-extrabold font-heading ${color} leading-tight`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-1 pt-1">
              <p className="text-[10px] text-muted-foreground">Power consumed</p>
              <p className="text-sm font-extrabold text-amber-700">{power.toFixed(3)} W</p>
            </div>
          </div>

          {/* Animation toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div onClick={() => setRunning(s => !s)}
              className={`w-9 h-5 rounded-full transition-colors ${running ? "bg-amber-500" : "bg-muted"} relative shrink-0`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${running ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-muted-foreground">Animate current flow</span>
          </label>

          {/* Record */}
          <Button
            onClick={handleRecord}
            className={`gap-2 text-sm border-0 ${justAdded ? "bg-emerald-500 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}`}
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

      {/* Insight hint */}
      <AnimatePresence>
        {mode === "parallel" && r1 !== r2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold"
          >
            💡 Notice: more current flows through the lower resistance branch!
          </motion.div>
        )}
      </AnimatePresence>
      {readings.length >= 4 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold">
          Great data! Head to the Analysis tab to explore patterns →
        </motion.div>
      )}
    </div>
  );
}
