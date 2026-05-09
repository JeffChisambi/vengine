import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import BuretteSVG      from "@/components/lab/chemistry/BuretteSVG";
import ConicalFlaskSVG from "@/components/lab/chemistry/ConicalFlaskSVG";
import DropperSVG      from "@/components/lab/chemistry/DropperSVG";
import ReagentBottleSVG from "@/components/lab/chemistry/ReagentBottleSVG";
import PHPaperSVG      from "@/components/lab/chemistry/PHPaperSVG";
import PipetteSVG      from "@/components/lab/chemistry/PipetteSVG";
import { getFlaskColor, getPH } from "./titrationUtils";

/* ─── Reusable helpers (still used by EndpointSVG) ─────────────────── */
function GlassSheen({ x, y, w, h, rx = 3 }) {
  return (
    <rect x={x + 2} y={y + 3} width={w * 0.35} height={h - 6} rx={rx}
      fill="white" fillOpacity={0.18} />
  );
}
function Swirl({ cx, cy, r = 14, delay = 0, opacity = 0.25 }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} fill="none"
      stroke="white" strokeWidth={1.5} strokeOpacity={opacity}
      animate={{ scale: [0.7, 1.2, 0.7], opacity: [opacity, 0, opacity] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── SVG 0: Intro overview — real instruments ───────────────────────── */
export function TitrationIntroSVG() {
  return (
    <div className="flex items-end justify-center gap-2 h-full w-full pb-2">

      {/* NaOH reagent bottle */}
      <div className="flex flex-col items-center shrink-0">
        <p className="text-[8px] text-muted-foreground mb-1 font-semibold tracking-wide">NaOH</p>
        <div className="w-14 h-24">
          <ReagentBottleSVG liquidLevel={0.55} liquidColor="#bae6fd" glow />
        </div>
      </div>

      {/* Burette — flowing */}
      <div className="flex flex-col items-center shrink-0">
        <p className="text-[8px] text-muted-foreground mb-1 font-semibold tracking-wide">Burette</p>
        <div className="w-20 h-36">
          <BuretteSVG liquidLevel={0.72} liquidColor="#bae6fd" flowing glow />
        </div>
      </div>

      {/* Conical flask — pink endpoint */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-28 h-44">
          <ConicalFlaskSVG
            liquidLevel={0.5}
            liquidColor="rgba(249,168,212,0.75)"
            showReaction
            glow
          />
        </div>
        <motion.p
          className="text-[9px] font-bold text-pink-600 mt-1"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          Endpoint ✦
        </motion.p>
      </div>

      {/* pH paper */}
      <div className="flex flex-col items-center shrink-0">
        <p className="text-[8px] text-muted-foreground mb-1 font-semibold tracking-wide">pH</p>
        <div className="w-14 h-32">
          <PHPaperSVG ph={8} dipped glow />
        </div>
      </div>

    </div>
  );
}

/* ─── SVG 1: Apparatus setup — real instruments ──────────────────────── */
export function SetupSVG({ phase = 0 }) {
  const labels = [
    "Clamp the burette to the stand",
    "Fill burette with NaOH",
    "Pipette 25 mL HCl into flask",
    "Apparatus ready!",
  ];
  const buretteLevels  = [0.05, 0.9, 0.9, 0.85];
  const flaskLevels    = [0,    0,   0.4, 0.42];
  const flaskColors    = ["#e0f2fe", "#e0f2fe", "#dcfce7", "#dcfce7"];

  return (
    <div className="flex flex-col h-full w-full items-center justify-between py-2 gap-3">

      {/* Instruments row */}
      <div className="flex items-end justify-center gap-2 flex-1 w-full">

        {/* Burette */}
        <motion.div
          className="w-24 h-44"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BuretteSVG
            liquidLevel={buretteLevels[phase]}
            liquidColor="#bae6fd"
            glow={phase === 1 || phase === 3}
            droplet={phase >= 1}
          />
        </motion.div>

        {/* Pipette — visible at phase 2 */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              className="w-16 h-40"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PipetteSVG liquidColor="#86efac" filled glow />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conical flask */}
        <motion.div
          className="w-28 h-36"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ConicalFlaskSVG
            liquidLevel={flaskLevels[phase]}
            liquidColor={flaskColors[phase]}
            glow={phase === 3}
          />
        </motion.div>

      </div>

      {/* Phase badge */}
      <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold text-center transition-colors ${
        phase === 3
          ? "bg-green-500/15 text-green-700 border border-green-500/25"
          : "bg-cyan-500/15 text-cyan-700 border border-cyan-500/25"
      }`}>
        {labels[phase]}
      </div>

    </div>
  );
}

/* ─── SVG 2: Indicator drop — real instruments ──────────────────────── */
export function IndicatorDropSVG({ dropped = false, indicator = "phenolphthalein" }) {
  const dropperColor = indicator === "phenolphthalein" ? "#ec4899" : "#f59e0b";
  const flaskColor   = dropped
    ? indicator === "phenolphthalein"
      ? "rgba(252,231,243,0.65)"
      : "rgba(253,230,138,0.55)"
    : "#dcfce7";

  return (
    <div className="flex items-end justify-center gap-4 h-full w-full pb-2">

      {/* Dropper with indicator */}
      <div className="flex flex-col items-center shrink-0">
        <p className="text-[9px] text-muted-foreground mb-1 font-semibold">
          {indicator === "phenolphthalein" ? "Phenolphthalein" : "Methyl Orange"}
        </p>
        <div className="w-20 h-36">
          <DropperSVG
            liquidColor={dropperColor}
            filled
            squeezing={dropped}
            droplet={dropped}
            glow={dropped}
          />
        </div>
      </div>

      {/* Flask receiving indicator */}
      <div className="flex flex-col items-center shrink-0">
        <p className="text-[9px] text-muted-foreground mb-1 font-semibold">Conical Flask</p>
        <div className="w-32 h-48">
          <ConicalFlaskSVG
            liquidLevel={0.45}
            liquidColor={flaskColor}
            showReaction={dropped}
            glow={dropped}
          />
        </div>
        {dropped && (
          <motion.p
            className="text-[9px] font-bold text-pink-600 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Indicator added ✓
          </motion.p>
        )}
      </div>

    </div>
  );
}

/* ─── SVG 3: Interactive titration view — real instruments ──────────── */
export function TitrationViewSVG({
  neutralization = 0,
  dropKey = 0,
  volumeAdded = 0,
  flashIntensity = 0,
  indicator = "phenolphthalein",
  endpointReached = false,
}) {
  const buretteLiquidLevel = Math.max(0, 1 - volumeAdded / 50);
  const flaskColor         = getFlaskColor(neutralization, indicator, flashIntensity);
  const nearEndpoint       = neutralization > 0.8 && !endpointReached;
  const isFlowing          = flashIntensity > 0.08;
  const flaskLiquidLevel   = 0.35 + Math.min(neutralization, 1) * 0.22;
  const phNow              = getPH(volumeAdded);

  return (
    <div className="flex flex-col h-full gap-2">

      {/* ── Apparatus: burette + flask side by side ── */}
      <div className="flex items-end justify-center gap-3 flex-1">

        {/* Burette */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-[8px] text-muted-foreground font-mono mb-0.5">NaOH</span>
          <div className="w-24 h-56">
            <BuretteSVG
              liquidLevel={buretteLiquidLevel}
              liquidColor="#bae6fd"
              flowing={isFlowing}
              droplet={!endpointReached && !isFlowing}
              glow={nearEndpoint}
            />
          </div>
        </div>

        {/* Conical flask */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-[8px] text-muted-foreground font-mono mb-0.5">HCl (aq)</span>
          <div className="w-36 h-52">
            <ConicalFlaskSVG
              liquidLevel={flaskLiquidLevel}
              liquidColor={flaskColor}
              showReaction={nearEndpoint || endpointReached}
              bubbling={flashIntensity > 0.25}
              glow={endpointReached}
            />
          </div>
        </div>

      </div>

      {/* ── Digital readout ── */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="bg-slate-900 rounded-xl p-2 text-center">
          <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wide">Burette</p>
          <p className="text-sm font-bold text-sky-400 font-mono">
            {Math.max(0, 50 - volumeAdded).toFixed(2)} mL
          </p>
          <p className="text-[8px] text-slate-500 font-mono">remaining</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-2 text-center">
          <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wide">pH</p>
          <motion.p
            className={`text-sm font-bold font-mono ${
              endpointReached
                ? "text-green-400"
                : phNow < 4
                ? "text-red-400"
                : phNow < 7
                ? "text-amber-400"
                : "text-blue-400"
            }`}
            animate={{ scale: dropKey > 0 ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.22 }}
          >
            {phNow.toFixed(2)}
          </motion.p>
          <p className="text-[8px] text-slate-500 font-mono">+{volumeAdded.toFixed(2)} mL</p>
        </div>
      </div>

    </div>
  );
}

/* ─── SVG 4: Molecular particle view ───────────────────────────────── */
const POSITIONS = [
  [30,30],[70,22],[110,35],[145,28],[175,38],[210,25],
  [20,65],[55,72],[90,60],[128,68],[162,58],[196,70],[228,58],
  [35,100],[72,108],[108,98],[143,104],[178,92],[215,100],
  [48,135],[85,140],[120,130],[155,138],[188,130],[220,140],
];

export function MolecularSVG({ neutralization = 0 }) {
  const n = neutralization;
  const acidCount  = Math.max(0, Math.round((1 - Math.min(n, 1)) * 12));
  const baseCount  = Math.min(12, Math.round(n * 12));
  const waterCount = Math.min(Math.round(n * 10), 10);

  const particles = POSITIONS.map((_, i) => {
    if (i < acidCount) return "acid";
    if (i < acidCount + baseCount) return "base";
    if (i < acidCount + baseCount + waterCount) return "water";
    return "none";
  });

  const colors  = { acid: "#f87171", base: "#60a5fa", water: "#7dd3fc", none: "transparent" };
  const labels  = { acid: "H⁺",     base: "OH⁻",     water: "H₂O",    none: "" };
  const strokes = { acid: "#ef4444", base: "#3b82f6", water: "#38bdf8", none: "transparent" };

  return (
    <svg viewBox="0 0 260 168" className="w-full h-full">
      <defs>
        <radialGradient id="molBg" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#0f172a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" stopOpacity="1" />
        </radialGradient>
        <filter id="molGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="260" height="168" rx="10" fill="url(#molBg)" />
      <text x="130" y="14" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">
        MOLECULAR VIEW
      </text>

      {POSITIONS.map(([px, py], i) => {
        const type = particles[i];
        if (type === "none") return null;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: "spring" }}
          >
            <motion.circle cx={px} cy={py + 18} r={8}
              fill={colors[type]} fillOpacity={0.85}
              stroke={strokes[type]} strokeWidth="1"
              filter="url(#molGlow)"
              animate={{
                cx: [px, px + (Math.sin(i * 1.3) * 5), px],
                cy: [py + 18, py + 18 + (Math.cos(i * 0.9) * 4), py + 18],
              }}
              transition={{ duration: 2 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
            />
            <text x={px} y={py + 22} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="white">
              {labels[type]}
            </text>
          </motion.g>
        );
      })}

      {n > 0.8 && n < 1.05 && [0, 1, 2].map((i) => (
        <motion.circle key={`s-${i}`}
          cx={80 + i * 50} cy={90}
          r={3} fill="#fbbf24" fillOpacity={0}
          animate={{ r: [2, 8], fillOpacity: [0, 0.7, 0] }}
          transition={{ duration: 0.8, delay: i * 0.3, repeat: Infinity }}
          filter="url(#molGlow)"
        />
      ))}

      {[
        { c: "#f87171", label: `H⁺ (acid) ×${acidCount}` },
        { c: "#60a5fa", label: `OH⁻ (base) ×${baseCount}` },
        { c: "#7dd3fc", label: `H₂O ×${waterCount}` },
      ].map(({ c, label }, i) => (
        <g key={i}>
          <circle cx={16} cy={152 - (2 - i) * 12} r={4} fill={c} />
          <text x={24} y={155 - (2 - i) * 12} fontSize="7.5" fill="#94a3b8">{label}</text>
        </g>
      ))}

      <text x="210" y="155" textAnchor="middle" fontSize="7" fill="#475569">H⁺ + OH⁻ → H₂O</text>
    </svg>
  );
}

/* ─── SVG 5: pH Curve graph ─────────────────────────────────────────── */
export function PHCurveSVG({ dataPoints = [], endpointV = 23.5, currentV = 0 }) {
  const W = 240, H = 140;
  const PAD = { l: 36, r: 16, t: 16, b: 30 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const maxV = 30;

  const toX = (v)  => PAD.l + (v / maxV) * plotW;
  const toY = (ph) => PAD.t + plotH - ((ph - 0) / 14) * plotH;

  const points = dataPoints.map(({ v, pH }) => `${toX(v)},${toY(pH)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="phBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f172a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} rx="10" fill="url(#phBg)" />
      <text x={W / 2} y="12" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">
        pH CURVE
      </text>

      {[2, 4, 6, 7, 8, 10, 12].map((ph) => (
        <g key={ph}>
          <line x1={PAD.l} y1={toY(ph)} x2={PAD.l + plotW} y2={toY(ph)}
            stroke={ph === 7 ? "#4ade80" : "#1e293b"}
            strokeWidth={ph === 7 ? 1.2 : 0.8}
            strokeDasharray={ph === 7 ? "4 3" : "none"}
          />
          <text x={PAD.l - 4} y={toY(ph) + 3} textAnchor="end" fontSize="6.5"
            fill={ph === 7 ? "#4ade80" : "#475569"} fontFamily="monospace">{ph}</text>
        </g>
      ))}

      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="#334155" strokeWidth="1.5" />
      <line x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH} stroke="#334155" strokeWidth="1.5" />

      {[0, 10, 20, 30].map((v) => (
        <text key={v} x={toX(v)} y={PAD.t + plotH + 12} textAnchor="middle" fontSize="6.5" fill="#475569" fontFamily="monospace">{v}</text>
      ))}
      <text x={PAD.l + plotW / 2} y={H - 2} textAnchor="middle" fontSize="7" fill="#64748b">Volume NaOH (mL)</text>
      <text x="8" y={PAD.t + plotH / 2} textAnchor="middle" fontSize="7" fill="#64748b"
        transform={`rotate(-90, 8, ${PAD.t + plotH / 2})`}>pH</text>

      <line x1={toX(endpointV)} y1={PAD.t} x2={toX(endpointV)} y2={PAD.t + plotH}
        stroke="#db2777" strokeWidth="1" strokeDasharray="3 3" />
      <text x={toX(endpointV) + 2} y={PAD.t + 8} fontSize="6" fill="#db2777">EP</text>

      {points.length > 1 && (
        <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {currentV > 0 && (
        <motion.circle
          cx={toX(currentV)} cy={toY(getPH(currentV))} r={4}
          fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"
          animate={{ r: [3.5, 5, 3.5] }} transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

/* ─── SVG 6: Endpoint celebration ───────────────────────────────────── */
export function EndpointSVG({ concentration = 0 }) {
  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <radialGradient id="epBg" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#fdf2f8" />
          <stop offset="100%" stopColor="#fce7f3" stopOpacity="0.6" />
        </radialGradient>
        <filter id="epGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="300" height="280" rx="14" fill="url(#epBg)" />

      {[[40,40],[260,35],[80,80],[220,75],[150,30],[50,130],[250,120]].map(([px, py], i) => (
        <motion.circle key={i} cx={px} cy={py} r={4}
          fill={["#f472b6","#818cf8","#34d399","#fbbf24","#60a5fa"][i % 5]}
          animate={{ cy: [py, py + 20, py], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <path d="M118,100 L132,100 L152,140 Q190,155 190,188 Q190,204 150,204 Q110,204 110,188 Q110,155 148,140 Z"
        fill="rgba(249,168,212,0.7)" stroke="#f472b6" strokeWidth="2"
        filter="url(#epGlow)"
      />
      <path d="M118,85 L132,85 L132,102 L118,102 Z" fill="rgba(249,168,212,0.4)" stroke="#f472b6" strokeWidth="1.8" />
      <Swirl cx={150} cy={184} r={18} opacity={0.4} />

      <motion.circle cx={150} cy={150} r={0} fill="#db2777" fillOpacity={0}
        animate={{ r: [0, 50], fillOpacity: [0, 0.12, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.text x={150} y={158} textAnchor="middle" fontSize="36"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
        🎯
      </motion.text>

      <text x="150" y="225" textAnchor="middle" fontSize="15" fontWeight="800" fill="#be185d" fontFamily="var(--font-heading)">
        ENDPOINT REACHED!
      </text>
      <text x="150" y="243" textAnchor="middle" fontSize="9.5" fill="#6b7280">
        The solution turned permanently pale pink.
      </text>

      {concentration > 0 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <rect x="60" y="252" width="180" height="24" rx="10" fill="#db2777" fillOpacity={0.15} stroke="#db2777" strokeWidth="1" />
          <text x="150" y="268" textAnchor="middle" fontSize="10" fontWeight="700" fill="#be185d">
            [HCl] = {concentration.toFixed(3)} mol L⁻¹
          </text>
        </motion.g>
      )}
    </svg>
  );
}
