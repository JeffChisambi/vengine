import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Glass sheen helper ────────────────────────────────────────────── */
function GlassSheen({ x, y, w, h, rx = 3 }) {
  return (
    <rect x={x + 2} y={y + 4} width={w * 0.32} height={h - 8} rx={rx}
      fill="white" fillOpacity={0.18} />
  );
}

/* ─── Bubble rising in solution ─────────────────────────────────────── */
function IonBubble({ cx, baseY, toY, delay = 0, color, opacity = 0.7, r = 3 }) {
  return (
    <motion.circle cx={cx} r={r} fill={color} fillOpacity={0}
      initial={{ cy: baseY }}
      animate={{ cy: [baseY, toY], fillOpacity: [0, opacity, opacity, 0] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Swirl animation ───────────────────────────────────────────────── */
function Swirl({ cx, cy, r = 14, delay = 0, opacity = 0.18 }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} fill="none"
      stroke="white" strokeWidth={1.5} strokeOpacity={opacity}
      animate={{ scale: [0.6, 1.3, 0.6], opacity: [opacity, 0, opacity] }}
      transition={{ duration: 2.8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── DC Power Supply ────────────────────────────────────────────────── */
function DCSupply({ x, y, w, h, voltage, running }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill="#1e293b" stroke={running ? "#38bdf8" : "#475569"} strokeWidth={running ? 2 : 1.5} />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 20} rx={4}
        fill="#0f172a" />
      <motion.text x={x + w / 2} y={y + h - 10} textAnchor="middle"
        fontSize={8.5} fontWeight="700" fill={running ? "#4ade80" : "#64748b"}
        fontFamily="monospace"
        animate={{ opacity: running ? [0.7, 1, 0.7] : 1 }}
        transition={{ duration: 1.5, repeat: Infinity }}>
        {voltage.toFixed(1)} V
      </motion.text>
      <text x={x + w / 2} y={y + h - 22} textAnchor="middle"
        fontSize={6.5} fill="#94a3b8">DC POWER SUPPLY</text>
      {/* + terminal on right */}
      <rect x={x + w - 2} y={y + h / 2 - 5} width={8} height={10} rx={2}
        fill="#ef4444" />
      <text x={x + w + 8} y={y + h / 2 + 3} fontSize={9} fill="#ef4444" fontWeight="800">+</text>
      {/* − terminal on left */}
      <rect x={x - 6} y={y + h / 2 - 5} width={8} height={10} rx={2}
        fill="#94a3b8" />
      <text x={x - 14} y={y + h / 2 + 3} fontSize={9} fill="#94a3b8" fontWeight="800">−</text>
    </g>
  );
}

/* ─── Ammeter ────────────────────────────────────────────────────────── */
function Ammeter({ cx, cy, current, running }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill="white" stroke="#64748b" strokeWidth={1.5} />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize={9} fill="#475569" fontWeight="800">A</text>
      <motion.text x={cx} y={cy + 9} textAnchor="middle" fontSize={6} fill="#0891b2" fontWeight="700"
        animate={{ opacity: running ? [0.6, 1, 0.6] : 1 }}
        transition={{ duration: 1.2, repeat: Infinity }}>
        {running ? `${current.toFixed(2)}A` : "0.00A"}
      </motion.text>
    </g>
  );
}

/* ─── Switch ─────────────────────────────────────────────────────────── */
function Switch({ cx, cy, closed }) {
  return (
    <g>
      <circle cx={cx - 9} cy={cy} r={3} fill="#64748b" />
      <circle cx={cx + 9} cy={cy} r={3} fill="#64748b" />
      <motion.line
        x1={cx - 6} y1={cy}
        animate={{ x2: closed ? cx + 6 : cx + 8, y2: closed ? cy : cy - 8 }}
        transition={{ duration: 0.3 }}
        stroke="#64748b" strokeWidth={2.5} strokeLinecap="round" />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={6.5} fill="#94a3b8">
        {closed ? "CLOSED" : "OPEN"}
      </text>
    </g>
  );
}

/* ─── Animated current path ─────────────────────────────────────────── */
function CurrentPath({ d, running, color = "#38bdf8" }) {
  if (!running) return null;
  return (
    <motion.path d={d} fill="none" stroke={color} strokeWidth={2}
      strokeDasharray="7 12" strokeLinecap="round"
      animate={{ strokeDashoffset: [0, -19] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Pre-seeded ion positions (no Math.random in render) ───────────── */
const CU_IONS = [
  { cx: 148, baseY: 290, delay: 0.0 },
  { cx: 165, baseY: 310, delay: 0.6 },
  { cx: 183, baseY: 275, delay: 1.1 },
  { cx: 200, baseY: 300, delay: 0.3 },
  { cx: 218, baseY: 285, delay: 1.5 },
  { cx: 235, baseY: 305, delay: 0.8 },
  { cx: 252, baseY: 270, delay: 0.2 },
  { cx: 167, baseY: 260, delay: 1.8 },
  { cx: 240, baseY: 265, delay: 1.2 },
  { cx: 195, baseY: 255, delay: 0.5 },
];

const SULFATE_IONS = [
  { cx: 155, baseY: 260, delay: 0.4 },
  { cx: 172, baseY: 280, delay: 1.0 },
  { cx: 195, baseY: 270, delay: 0.7 },
  { cx: 215, baseY: 290, delay: 1.4 },
  { cx: 238, baseY: 260, delay: 0.1 },
  { cx: 258, baseY: 280, delay: 0.9 },
  { cx: 176, baseY: 295, delay: 1.6 },
  { cx: 225, baseY: 250, delay: 0.3 },
];

/* ══════════════════════════════════════════════════════════════════════
   SVG 0 — INTRO OVERVIEW
══════════════════════════════════════════════════════════════════════ */
export function ElectrolysisIntroSVG() {
  return (
    <svg viewBox="0 0 340 300" className="w-full h-full">
      <defs>
        <linearGradient id="elLabBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="elGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="elSolution" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="elCopper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <clipPath id="elIntroBeakerClip">
          <rect x="95" y="148" width="150" height="130" rx="2" />
        </clipPath>
        <filter id="elGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="340" height="300" rx="14" fill="url(#elLabBg)" />
      {/* Lab bench */}
      <rect x="0" y="268" width="340" height="32" fill="#e2e8f0" />
      <rect x="0" y="264" width="340" height="6" fill="#cbd5e1" />

      {/* DC Supply box */}
      <rect x="118" y="22" width="104" height="46" rx="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.8" />
      <rect x="124" y="28" width="92" height="28" rx="4" fill="#0f172a" />
      <motion.text x="170" y="51" textAnchor="middle" fontSize={11} fontWeight="700" fill="#4ade80"
        fontFamily="monospace"
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.6, repeat: Infinity }}>
        6.0 V
      </motion.text>
      <text x="170" y="38" textAnchor="middle" fontSize={6.5} fill="#94a3b8">DC POWER SUPPLY</text>
      {/* terminals */}
      <rect x="218" y="40" width="7" height="9" rx="2" fill="#ef4444" />
      <text x="231" y="47" fontSize={9} fill="#ef4444" fontWeight="800">+</text>
      <rect x="115" y="40" width="7" height="9" rx="2" fill="#94a3b8" />
      <text x="105" y="47" fontSize={9} fill="#94a3b8" fontWeight="800">−</text>

      {/* Wires */}
      {/* Right wire: + → cathode */}
      <polyline points="225,44 270,44 270,100 252,100 252,148"
        fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
      {/* Left wire: − → anode */}
      <polyline points="115,44 70,44 70,100 148,100 148,148"
        fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />

      {/* Animated current */}
      <motion.path d="M225,44 L270,44 L270,100 L252,100 L252,148"
        fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="6 11" strokeLinecap="round"
        animate={{ strokeDashoffset: [0, -17] }}
        transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
      />
      <motion.path d="M115,44 L70,44 L70,100 L148,100 L148,148"
        fill="none" stroke="#64748b" strokeWidth="1.8" strokeDasharray="6 11" strokeLinecap="round"
        animate={{ strokeDashoffset: [0, 17] }}
        transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
      />

      {/* Ammeter on right wire */}
      <circle cx="270" cy="72" r="11" fill="white" stroke="#64748b" strokeWidth="1.4" />
      <text x="270" y="75" textAnchor="middle" fontSize={8} fill="#475569" fontWeight="800">A</text>

      {/* Beaker body */}
      <rect x="95" y="148" width="150" height="130" rx="4"
        fill="url(#elGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <GlassSheen x={95} y={148} w={150} h={130} />
      {/* Rim */}
      <ellipse cx="170" cy="148" rx="75" ry="7" fill="#dbeafe" fillOpacity="0.5" stroke="#7dd3fc" strokeWidth="1.4" />

      {/* CuSO₄ solution */}
      <g clipPath="url(#elIntroBeakerClip)">
        <rect x="96" y="185" width="148" height="93" fill="url(#elSolution)" />
        <ellipse cx="170" cy="185" rx="73" ry="5" fill="#38bdf8" fillOpacity="0.4" />
        <Swirl cx={155} cy={230} r={20} opacity={0.2} />
        <Swirl cx={185} cy={245} r={13} delay={1.0} opacity={0.15} />
        {/* Cu²⁺ ions */}
        {[155,170,185,200,215].map((cx, i) => (
          <motion.circle key={`cu${i}`} cx={cx} r={3} fill="#f59e0b" fillOpacity={0.8}
            initial={{ cy: 260 }}
            animate={{ cy: [260, 220, 260], cx: [cx, cx + 10, cx] }}
            transition={{ duration: 2 + i * 0.3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* SO₄²⁻ ions */}
        {[158,172,188,204].map((cx, i) => (
          <motion.circle key={`so${i}`} cx={cx} r={2.5} fill="#818cf8" fillOpacity={0.7}
            initial={{ cy: 210 }}
            animate={{ cy: [210, 255, 210], cx: [cx, cx - 8, cx] }}
            transition={{ duration: 2.4 + i * 0.25, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </g>

      {/* Anode (left electrode) */}
      <rect x="139" y="100" width="18" height="165" rx="3"
        fill="url(#elCopper)" stroke="#92400e" strokeWidth="1.2" />
      <GlassSheen x={139} y={100} w={18} h={80} rx={2} />
      <text x="148" y="94" textAnchor="middle" fontSize={7.5} fontWeight="700" fill="#92400e">ANODE (+)</text>

      {/* Cathode (right electrode) with deposit */}
      <rect x="243" y="100" width="18" height="165" rx="3"
        fill="url(#elCopper)" stroke="#92400e" strokeWidth="1.2" />
      {/* Reddish-brown deposit */}
      <motion.rect x="240" y="185" width="24" height="80" rx="3"
        fill="#7c2d12" fillOpacity={0}
        animate={{ fillOpacity: [0, 0.65, 0.65, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <GlassSheen x={243} y={100} w={18} h={80} rx={2} />
      <text x="252" y="94" textAnchor="middle" fontSize={7.5} fontWeight="700" fill="#92400e">CATHODE (−)</text>

      {/* Copper deposit indicator label */}
      <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
        <rect x="275" y="215" width="52" height="18" rx="5" fill="#7c2d12" fillOpacity="0.15" stroke="#7c2d12" strokeWidth="0.8" />
        <text x="301" y="227" textAnchor="middle" fontSize={6.5} fill="#7c2d12" fontWeight="700">Cu deposit</text>
      </motion.g>

      {/* Solution label */}
      <text x="170" y="276" textAnchor="middle" fontSize={8} fontWeight="700" fill="#0369a1">CuSO₄ solution</text>

      {/* Title */}
      <text x="170" y="292" textAnchor="middle" fontSize={10} fontWeight="700" fill="#0e7490"
        fontFamily="var(--font-heading)">Electrolysis of Copper Sulfate</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SVG 1 — SETUP (phase 0–3)
══════════════════════════════════════════════════════════════════════ */
export function ElectrolysisSetupSVG({ phase = 0 }) {
  const labels = [
    "Prepare the beaker",
    "Pour copper sulfate solution",
    "Insert copper electrodes",
    "Connect the circuit",
  ];
  const phaseColors = ["#7dd3fc", "#38bdf8", "#b45309", "#4ade80"];

  return (
    <svg viewBox="0 0 300 320" className="w-full h-full">
      <defs>
        <linearGradient id="setupElBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="setupElGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="setupElSolution" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="setupElCopper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <clipPath id="setupElBeakerClip">
          <rect x="72" y="155" width="156" height="130" rx="2" />
        </clipPath>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="300" height="320" rx="12" fill="url(#setupElBg)" />
      <rect x="0" y="282" width="300" height="38" fill="#e2e8f0" />
      <rect x="0" y="278" width="300" height="6" fill="#cbd5e1" />

      {/* Beaker body - always visible */}
      <rect x="72" y="155" width="156" height="130" rx="4"
        fill="url(#setupElGlass)" stroke={phaseColors[phase]} strokeWidth="1.8" />
      <GlassSheen x={72} y={155} w={156} h={130} />
      <ellipse cx="150" cy="155" rx="78" ry="7" fill="#dbeafe" fillOpacity="0.5"
        stroke={phaseColors[phase]} strokeWidth="1.4" />

      {/* Phase label badge */}
      <motion.rect x="18" y="20" width="72" height="26" rx="9"
        fill={phaseColors[phase]} fillOpacity="0.22" stroke={phaseColors[phase]} strokeWidth="1"
        key={phase} initial={{ scale: 0.88 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
      />
      <text x="54" y="36" textAnchor="middle" fontSize={9} fontWeight="700" fill="#0e7490">Step {phase + 1}/4</text>

      {/* Phase 0: Empty beaker */}
      {phase === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <text x="150" y="230" textAnchor="middle" fontSize={9} fill="#94a3b8">Empty beaker</text>
          <text x="150" y="245" textAnchor="middle" fontSize={8} fill="#cbd5e1">ready to fill</text>
        </motion.g>
      )}

      {/* Phase 1+: CuSO₄ solution */}
      {phase >= 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <g clipPath="url(#setupElBeakerClip)">
            <motion.rect x="73" width="154" fill="url(#setupElSolution)" rx="2"
              initial={{ y: 285, height: 0 }} animate={{ y: 185, height: 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.ellipse cx="150" rx="76" ry="5" fill="#38bdf8" fillOpacity="0.45"
              initial={{ cy: 285 }} animate={{ cy: 185 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </g>
          {/* Pouring animation */}
          {phase === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}>
              <rect x="195" y="80" width="40" height="70" rx="6"
                fill="#bae6fd" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="1.2" />
              <text x="215" y="122" textAnchor="middle" fontSize={7} fill="#0369a1" fontWeight="700">CuSO₄</text>
              {/* pouring stream */}
              <motion.path d="M 208,149 Q 205,160 198,175 Q 193,190 185,192"
                fill="none" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.6"
                animate={{ pathLength: [0, 1] }} transition={{ duration: 0.8 }}
              />
            </motion.g>
          )}
          <text x="150" y="265" textAnchor="middle" fontSize={8} fontWeight="700" fill="#0369a1">CuSO₄ (aq)</text>
        </motion.g>
      )}

      {/* Phase 2+: Electrodes */}
      {phase >= 2 && (
        <motion.g initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          {/* Anode */}
          <rect x="118" y="110" width="18" height="168" rx="3"
            fill="url(#setupElCopper)" stroke="#92400e" strokeWidth="1.2" />
          <GlassSheen x={118} y={110} w={18} h={80} rx={2} />
          <text x="127" y="105" textAnchor="middle" fontSize={7.5} fontWeight="700" fill="#92400e">ANODE</text>
          <text x="127" y="114" textAnchor="middle" fontSize={8} fontWeight="800" fill="#ef4444">(+)</text>
          {/* Cathode */}
          <rect x="164" y="110" width="18" height="168" rx="3"
            fill="url(#setupElCopper)" stroke="#92400e" strokeWidth="1.2" />
          <GlassSheen x={164} y={110} w={18} h={80} rx={2} />
          <text x="173" y="105" textAnchor="middle" fontSize={7.5} fontWeight="700" fill="#92400e">CATHODE</text>
          <text x="173" y="114" textAnchor="middle" fontSize={8} fontWeight="800" fill="#3b82f6">(−)</text>
        </motion.g>
      )}

      {/* Phase 3: Circuit connections */}
      {phase >= 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* DC supply */}
          <rect x="98" y="22" width="104" height="44" rx="7" fill="#1e293b" stroke="#4ade80" strokeWidth="1.8" />
          <rect x="104" y="28" width="92" height="26" rx="4" fill="#0f172a" />
          <text x="150" y="48" textAnchor="middle" fontSize={10} fontWeight="700" fill="#4ade80"
            fontFamily="monospace">6.0 V</text>
          <text x="150" y="37" textAnchor="middle" fontSize={6.5} fill="#94a3b8">DC POWER SUPPLY</text>
          {/* + terminal */}
          <rect x="198" y="38" width="7" height="8" rx="2" fill="#ef4444" />
          {/* − terminal */}
          <rect x="95" y="38" width="7" height="8" rx="2" fill="#94a3b8" />
          {/* Right wire: + → cathode */}
          <polyline points="205,42 230,42 230,100 173,100 173,110"
            fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinejoin="round" />
          {/* Left wire: − → anode */}
          <polyline points="95,42 70,42 70,100 127,100 127,110"
            fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinejoin="round" />
          {/* Ammeter */}
          <circle cx="230" cy="70" r="10" fill="white" stroke="#64748b" strokeWidth="1.4" />
          <text x="230" y="73" textAnchor="middle" fontSize={8} fill="#475569" fontWeight="800">A</text>
          {/* Ready label */}
          <motion.rect x="76" y="20" width="72" height="26" rx="9" fill="#4ade80" fillOpacity="0.15"
            stroke="#4ade80" strokeWidth="1" initial={{ scale: 0.85 }} animate={{ scale: 1 }}
            transition={{ type: "spring" }} />
          <motion.text x="112" y="36" textAnchor="middle" fontSize={8} fontWeight="700" fill="#15803d"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            ✓ Ready!
          </motion.text>
        </motion.g>
      )}

      {/* Step label */}
      <motion.text x="150" y="300" textAnchor="middle" fontSize={9.5} fontWeight="600" fill="#0369a1"
        key={phase} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        {labels[phase]}
      </motion.text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SVG 2 — MAIN ELECTROLYSIS (interactive)
   Props: running, timeElapsed (0–1), voltage, current
══════════════════════════════════════════════════════════════════════ */
export function ElectrolysisMainSVG({
  running = false,
  timeElapsed = 0,
  voltage = 6,
  current = 0.5,
}) {
  /* Electrode changes derived from timeElapsed */
  const anodeWidth = 20 - timeElapsed * 8;          // 20 → 12 px (dissolves)
  const depositThickness = timeElapsed * 16;          // 0 → 16 px thick deposit
  const depositOpacity = 0.4 + timeElapsed * 0.55;   // grows more opaque

  /* Circuit paths */
  const rightWirePath = "M260,58 L310,58 L310,105 L268,105 L268,148";
  const leftWirePath  = "M148,58 L90,58 L90,105 L132,105 L132,148";

  return (
    <svg viewBox="0 0 420 385" className="w-full h-full">
      <defs>
        <linearGradient id="mainElBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="mainElGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="mainElSolution" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="mainElCopper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="mainElDeposit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <clipPath id="mainElBeakerClip">
          <rect x="102" y="155" width="216" height="188" rx="2" />
        </clipPath>
        <filter id="mainElGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="420" height="385" rx="14" fill="url(#mainElBg)" />
      {/* Lab bench */}
      <rect x="0" y="355" width="420" height="30" fill="#e2e8f0" />
      <rect x="0" y="351" width="420" height="6" fill="#cbd5e1" />

      {/* ── DC Power supply ── */}
      <DCSupply x={148} y={18} w={124} h={52} voltage={voltage} running={running} />

      {/* ── Wires (base, grey) ── */}
      <polyline points="260,44 310,44 310,105 268,105 268,148"
        fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinejoin="round" />
      <polyline points="148,44 90,44 90,105 132,105 132,148"
        fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinejoin="round" />

      {/* ── Animated current on wires ── */}
      <CurrentPath d={rightWirePath} running={running} color="#38bdf8" />
      <CurrentPath d={leftWirePath} running={running} color="#64748b" />

      {/* ── Ammeter on right wire ── */}
      <Ammeter cx={310} cy={74} current={current} running={running} />

      {/* ── Switch on left wire ── */}
      <Switch cx={90} cy={75} closed={running} />

      {/* ── Beaker ── */}
      <rect x="102" y="155" width="216" height="188" rx="5"
        fill="url(#mainElGlass)" stroke="#7dd3fc" strokeWidth="2" />
      <GlassSheen x={102} y={155} w={216} h={188} />
      {/* Rim ellipse */}
      <ellipse cx="210" cy="155" rx="108" ry="9"
        fill="#dbeafe" fillOpacity="0.55" stroke="#7dd3fc" strokeWidth="1.6" />
      {/* Bottom base */}
      <rect x="88" y="341" width="244" height="10" rx="5" fill="#cbd5e1" />

      {/* ── Solution inside beaker ── */}
      <g clipPath="url(#mainElBeakerClip)">
        <rect x="103" y="192" width="214" height="151" fill="url(#mainElSolution)" />
        <ellipse cx="210" cy="192" rx="106" ry="7" fill="#38bdf8" fillOpacity="0.4" />

        {/* Swirls when running */}
        {running && (
          <>
            <Swirl cx={175} cy={290} r={22} opacity={0.18} />
            <Swirl cx={245} cy={310} r={15} delay={1.2} opacity={0.14} />
          </>
        )}

        {/* Cu²⁺ ions moving TOWARD cathode (right) when running */}
        {running && CU_IONS.map((ion, i) => (
          <motion.g key={`cu${i}`}>
            <motion.circle r={3.5} fill="#f59e0b" fillOpacity={0.85}
              initial={{ cx: ion.cx, cy: ion.baseY }}
              animate={{
                cx: [ion.cx, ion.cx + 18, ion.cx + 8],
                cy: [ion.baseY, ion.baseY - 18, ion.baseY],
              }}
              transition={{ duration: 1.8 + i * 0.2, delay: ion.delay, repeat: Infinity, ease: "easeInOut" }}
            />
            {i < 4 && (
              <motion.text fontSize={5.5} fill="#b45309" fontWeight="700"
                initial={{ x: ion.cx + 4, y: ion.baseY - 4, opacity: 0 }}
                animate={{
                  x: [ion.cx + 4, ion.cx + 22, ion.cx + 12],
                  y: [ion.baseY - 4, ion.baseY - 22, ion.baseY - 4],
                  opacity: [0, 0.9, 0],
                }}
                transition={{ duration: 1.8 + i * 0.2, delay: ion.delay, repeat: Infinity, ease: "easeInOut" }}
              >Cu²⁺</motion.text>
            )}
          </motion.g>
        ))}

        {/* SO₄²⁻ ions moving TOWARD anode (left) when running */}
        {running && SULFATE_IONS.map((ion, i) => (
          <motion.g key={`so${i}`}>
            <motion.circle r={3} fill="#818cf8" fillOpacity={0.8}
              initial={{ cx: ion.cx, cy: ion.baseY }}
              animate={{
                cx: [ion.cx, ion.cx - 16, ion.cx - 6],
                cy: [ion.baseY, ion.baseY - 14, ion.baseY],
              }}
              transition={{ duration: 2 + i * 0.18, delay: ion.delay, repeat: Infinity, ease: "easeInOut" }}
            />
            {i < 3 && (
              <motion.text fontSize={5} fill="#6366f1" fontWeight="700"
                initial={{ x: ion.cx - 2, y: ion.baseY - 4, opacity: 0 }}
                animate={{
                  x: [ion.cx - 2, ion.cx - 18, ion.cx - 8],
                  y: [ion.baseY - 4, ion.baseY - 18, ion.baseY - 4],
                  opacity: [0, 0.85, 0],
                }}
                transition={{ duration: 2 + i * 0.18, delay: ion.delay, repeat: Infinity, ease: "easeInOut" }}
              >SO₄²⁻</motion.text>
            )}
          </motion.g>
        ))}
      </g>

      {/* ── Anode (left, dissolves) ── */}
      <motion.rect
        x={132 - anodeWidth / 2} y={105}
        width={anodeWidth} height={240} rx={3}
        fill="url(#mainElCopper)" stroke="#92400e" strokeWidth="1.2"
        animate={{ width: anodeWidth, x: 132 - anodeWidth / 2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <GlassSheen x={122} y={105} w={18} h={80} rx={2} />

      {/* Anode dissolving particles */}
      {running && timeElapsed > 0.1 && [0, 1, 2].map(i => (
        <motion.circle key={`ap${i}`} cx={118 + i * 5} r={2} fill="#d97706" fillOpacity={0}
          animate={{
            cy: [165 + i * 20, 185 + i * 20],
            cx: [118 + i * 5, 110 + i * 3],
            fillOpacity: [0, 0.7, 0],
          }}
          transition={{ duration: 1.2, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* ── Cathode (right, gains deposit) ── */}
      <rect x={268 - 10} y={105} width={20} height={240} rx={3}
        fill="url(#mainElCopper)" stroke="#92400e" strokeWidth="1.2" />
      {/* Deposit layer */}
      <motion.rect
        x={268 - 10 - depositThickness / 2} y={192}
        width={20 + depositThickness} height={149} rx={3}
        fill="url(#mainElDeposit)"
        animate={{
          width: 20 + depositThickness,
          x: 268 - 10 - depositThickness / 2,
          fillOpacity: depositOpacity,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <GlassSheen x={258} y={105} w={20} h={80} rx={2} />

      {/* ── Electrode labels ── */}
      <rect x="106" y="88" width="52" height="20" rx="6"
        fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
      <text x="132" y="101" textAnchor="middle" fontSize={8.5} fontWeight="700" fill="#dc2626">
        ANODE (+)
      </text>
      <rect x="242" y="88" width="52" height="20" rx="6"
        fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" />
      <text x="268" y="101" textAnchor="middle" fontSize={8.5} fontWeight="700" fill="#2563eb">
        CATHODE (−)
      </text>

      {/* ── Solution label ── */}
      <text x="210" y="375" textAnchor="middle" fontSize={9} fontWeight="700" fill="#0369a1">
        CuSO₄ solution
      </text>

      {/* ── Status readout ── */}
      <rect x="10" y="165" width="78" height="70" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="49" y="180" textAnchor="middle" fontSize={6.5} fill="#94a3b8">STATUS</text>
      <motion.circle cx="49" cy="193" r="4"
        fill={running ? "#4ade80" : "#475569"}
        animate={{ opacity: running ? [0.6, 1, 0.6] : 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <text x="49" y="193" textAnchor="start" dx={8} fontSize={7} fill={running ? "#4ade80" : "#64748b"}>
        {running ? "RUNNING" : "STOPPED"}
      </text>
      <text x="49" y="210" textAnchor="middle" fontSize={6} fill="#94a3b8">Voltage</text>
      <text x="49" y="221" textAnchor="middle" fontSize={9} fontWeight="700" fill="#38bdf8"
        fontFamily="monospace">{voltage.toFixed(1)}V</text>
      <text x="49" y="232" textAnchor="middle" fontSize={6} fill="#94a3b8">Current</text>

      <motion.text x="49" y="243" textAnchor="middle" fontSize={9} fontWeight="700" fill="#4ade80"
        fontFamily="monospace"
        animate={{ opacity: running ? [0.7, 1, 0.7] : 1 }}
        transition={{ duration: 1.2, repeat: Infinity }}>
        {running ? `${current.toFixed(2)}A` : "0.00A"}
      </motion.text>

      {/* ── Ion legend ── */}
      <rect x="332" y="165" width="80" height="60" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="372" y="178" textAnchor="middle" fontSize={6.5} fill="#94a3b8">ION LEGEND</text>
      <circle cx="345" cy="193" r="4" fill="#f59e0b" />
      <text x="353" y="196" fontSize={7} fill="#f59e0b">Cu²⁺ → cathode</text>
      <circle cx="345" cy="210" r="3.5" fill="#818cf8" />
      <text x="353" y="213" fontSize={7} fill="#818cf8">SO₄²⁻ → anode</text>

      {/* ── Deposit indicator label ── */}
      {timeElapsed > 0.05 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <line x1="280" y1="268" x2="322" y2="255" stroke="#7c2d12" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="320" y="244" width="70" height="20" rx="5"
            fill="#7c2d12" fillOpacity="0.12" stroke="#7c2d12" strokeWidth="0.8" />
          <text x="355" y="257" textAnchor="middle" fontSize={7} fill="#7c2d12" fontWeight="700">
            Cu deposit
          </text>
        </motion.g>
      )}
      {timeElapsed > 0.1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <line x1="125" y1="270" x2="80" y2="255" stroke="#92400e" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="10" y="244" width="72" height="20" rx="5"
            fill="#92400e" fillOpacity="0.1" stroke="#92400e" strokeWidth="0.8" />
          <text x="46" y="257" textAnchor="middle" fontSize={7} fill="#92400e" fontWeight="700">
            dissolving
          </text>
        </motion.g>
      )}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SVG 3 — OBSERVATIONS (before / after comparison)
══════════════════════════════════════════════════════════════════════ */
export function ElectrolysisObservationSVG() {
  return (
    <svg viewBox="0 0 340 280" className="w-full h-full">
      <defs>
        <linearGradient id="obsGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="obsSolution" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="obsCopper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <clipPath id="obsBeaker1Clip">
          <rect x="18" y="80" width="130" height="160" rx="2" />
        </clipPath>
        <clipPath id="obsBeaker2Clip">
          <rect x="192" y="80" width="130" height="160" rx="2" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="340" height="280" rx="12" fill="#f8fafc" />

      {/* BEFORE label */}
      <rect x="18" y="15" width="130" height="22" rx="7" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1" />
      <text x="83" y="30" textAnchor="middle" fontSize={9.5} fontWeight="700" fill="#0369a1">BEFORE</text>

      {/* AFTER label */}
      <rect x="192" y="15" width="130" height="22" rx="7" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
      <text x="257" y="30" textAnchor="middle" fontSize={9.5} fontWeight="700" fill="#b45309">AFTER</text>

      {/* ── BEFORE beaker ── */}
      <rect x="18" y="80" width="130" height="160" rx="4" fill="url(#obsGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <GlassSheen x={18} y={80} w={130} h={160} />
      <g clipPath="url(#obsBeaker1Clip)">
        <rect x="19" y="120" width="128" height="120" fill="url(#obsSolution)" />
        <ellipse cx="83" cy="120" rx="63" ry="5" fill="#38bdf8" fillOpacity="0.4" />
      </g>
      {/* Before: clean electrodes, same size */}
      <rect x="55" y="50" width="16" height="175" rx="3" fill="url(#obsCopper)" stroke="#92400e" strokeWidth="1" />
      <rect x="95" y="50" width="16" height="175" rx="3" fill="url(#obsCopper)" stroke="#92400e" strokeWidth="1" />
      <text x="63" y="44" textAnchor="middle" fontSize={7} fill="#92400e">Anode</text>
      <text x="103" y="44" textAnchor="middle" fontSize={7} fill="#92400e">Cathode</text>
      <text x="83" y="258" textAnchor="middle" fontSize={7.5} fill="#475569">Both clean & same size</text>

      {/* ── AFTER beaker ── */}
      <rect x="192" y="80" width="130" height="160" rx="4" fill="url(#obsGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <GlassSheen x={192} y={80} w={130} h={160} />
      <g clipPath="url(#obsBeaker2Clip)">
        <rect x="193" y="120" width="128" height="120" fill="url(#obsSolution)" />
        <ellipse cx="257" cy="120" rx="63" ry="5" fill="#38bdf8" fillOpacity="0.4" />
      </g>
      {/* After: anode thinner, cathode has deposit */}
      {/* Anode (thinner) */}
      <rect x="227" y="50" width="10" height="175" rx="3" fill="url(#obsCopper)" stroke="#92400e" strokeWidth="1" />
      <motion.path d="M222,130 Q215,145 216,160 Q217,175 222,185"
        fill="none" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6"
        animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Cathode (with thick deposit) */}
      <rect x="279" y="50" width="16" height="175" rx="3" fill="url(#obsCopper)" stroke="#92400e" strokeWidth="1" />
      <rect x="275" y="120" width="24" height="115" rx="3" fill="#7c2d12" fillOpacity="0.75" />
      <motion.rect x="274" y="119" width="26" height="116" rx="3" fill="#7c2d12" fillOpacity={0}
        animate={{ fillOpacity: [0, 0.2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <text x="229" y="44" textAnchor="middle" fontSize={7} fill="#dc2626">Anode −</text>
      <text x="287" y="44" textAnchor="middle" fontSize={7} fill="#2563eb">Cathode +</text>
      <text x="257" y="258" textAnchor="middle" fontSize={7.5} fill="#475569">Anode thinner; Cu on cathode</text>

      {/* Arrows */}
      <motion.path d="M152,168 L188,168" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3"
        animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
      />
      <polygon points="188,165 195,168 188,171" fill="#64748b" />
      <text x="170" y="162" textAnchor="middle" fontSize={7} fill="#64748b">time</text>

      {/* Deposit call-out */}
      <line x1="299" y1="165" x2="320" y2="145" stroke="#7c2d12" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="305" y="130" width="30" height="18" rx="4"
        fill="#7c2d12" fillOpacity="0.12" stroke="#7c2d12" strokeWidth="0.7" />
      <text x="320" y="141" textAnchor="middle" fontSize={6} fill="#7c2d12" fontWeight="700">Cu (s)</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SVG 4 — IONIC EQUATIONS
══════════════════════════════════════════════════════════════════════ */
export function ElectrolysisEquationsSVG({ revealed = 0 }) {
  return (
    <svg viewBox="0 0 360 280" className="w-full h-full">
      <defs>
        <linearGradient id="eqBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="280" rx="12" fill="url(#eqBg)" />

      {/* Cathode equation */}
      <rect x="20" y="25" width="320" height="95" rx="10"
        fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <rect x="20" y="25" width="10" height="95" rx="5"
        fill="#3b82f6" />
      <text x="44" y="48" fontSize={9.5} fontWeight="700" fill="#1d4ed8">CATHODE (−) — Reduction</text>
      <text x="44" y="66" fontSize={9} fill="#374151">Copper ions gain electrons and deposit as copper metal:</text>
      <motion.g
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: revealed >= 1 ? 1 : 0, y: revealed >= 1 ? 0 : 6 }}
        transition={{ duration: 0.5 }}>
        <rect x="44" y="74" width="256" height="32" rx="7"
          fill="#1d4ed8" fillOpacity="0.08" stroke="#93c5fd" strokeWidth="1" />
        <text x="172" y="96" textAnchor="middle" fontSize={14} fontWeight="700" fill="#1d4ed8">
          Cu²⁺  +  2e⁻  →  Cu (s)
        </text>
      </motion.g>
      {revealed < 1 && (
        <text x="172" y="96" textAnchor="middle" fontSize={9} fill="#94a3b8">
          Click to reveal equation
        </text>
      )}

      {/* Anode equation */}
      <rect x="20" y="140" width="320" height="95" rx="10"
        fill="#fff7ed" stroke="#fdba74" strokeWidth="1.5" />
      <rect x="20" y="140" width="10" height="95" rx="5"
        fill="#ef4444" />
      <text x="44" y="163" fontSize={9.5} fontWeight="700" fill="#b91c1c">ANODE (+) — Oxidation</text>
      <text x="44" y="181" fontSize={9} fill="#374151">Copper atoms lose electrons and dissolve into solution:</text>
      <motion.g
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: revealed >= 2 ? 1 : 0, y: revealed >= 2 ? 0 : 6 }}
        transition={{ duration: 0.5 }}>
        <rect x="44" y="189" width="256" height="32" rx="7"
          fill="#b91c1c" fillOpacity="0.07" stroke="#fdba74" strokeWidth="1" />
        <text x="172" y="211" textAnchor="middle" fontSize={14} fontWeight="700" fill="#b91c1c">
          Cu (s)  →  Cu²⁺  +  2e⁻
        </text>
      </motion.g>
      {revealed < 2 && (
        <text x="172" y="211" textAnchor="middle" fontSize={9} fill="#94a3b8">
          Click to reveal equation
        </text>
      )}

      {/* Overall summary */}
      {revealed >= 2 && (
        <motion.text x="180" y="260" textAnchor="middle" fontSize={8.5} fontWeight="600" fill="#0369a1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          Net effect: Cu is transferred from anode → cathode
        </motion.text>
      )}
    </svg>
  );
}
