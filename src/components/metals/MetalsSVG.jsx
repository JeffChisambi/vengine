import React from "react";
import { motion } from "framer-motion";

/* ─── Helper ──────────────────────────────────────────────────── */
function GlassSheen({ x, y, w, h, rx = 4 }) {
  return (
    <rect x={x + 4} y={y + 6} width={w * 0.28} height={h - 12} rx={rx}
      fill="white" fillOpacity={0.22} />
  );
}

/* ─── Data (exported) ─────────────────────────────────────────── */
export const ACID_DATA = {
  hcl:   { name: "Hydrochloric Acid", formula: "HCl",   color: "#e0f2fe", label: "Dilute HCl" },
  h2so4: { name: "Sulfuric Acid",     formula: "H₂SO₄", color: "#fef9c3", label: "Dilute H₂SO₄" },
};

export const METAL_DATA = {
  magnesium: {
    symbol: "Mg", name: "Magnesium",
    stripColor: "#e2e8f0", stripBorder: "#94a3b8",
    reactivity: 4, tempRise: 20, dissolveRate: 0.94,
    bubbleCount: 15, bubbleSpeed: 1.3,
    rate: "Very fast — vigorous",
    observations: "Rapid fizzing, metal dissolves quickly, significant heat released.",
    eqs: {
      hcl:   "Mg + 2HCl → MgCl₂ + H₂↑",
      h2so4: "Mg + H₂SO₄ → MgSO₄ + H₂↑",
    },
    salts: { hcl: "MgCl₂", h2so4: "MgSO₄" },
    solutionTint: null,
  },
  zinc: {
    symbol: "Zn", name: "Zinc",
    stripColor: "#94a3b8", stripBorder: "#64748b",
    reactivity: 3, tempRise: 8, dissolveRate: 0.55,
    bubbleCount: 8, bubbleSpeed: 1.9,
    rate: "Moderate — steady",
    observations: "Steady bubbling, metal slowly dissolves, slight warming.",
    eqs: {
      hcl:   "Zn + 2HCl → ZnCl₂ + H₂↑",
      h2so4: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    },
    salts: { hcl: "ZnCl₂", h2so4: "ZnSO₄" },
    solutionTint: null,
  },
  iron: {
    symbol: "Fe", name: "Iron",
    stripColor: "#b45309", stripBorder: "#92400e",
    reactivity: 2, tempRise: 3, dissolveRate: 0.14,
    bubbleCount: 3, bubbleSpeed: 2.8,
    rate: "Slow — few bubbles",
    observations: "Few bubbles, barely dissolves, solution turns faint green (FeCl₂).",
    eqs: {
      hcl:   "Fe + 2HCl → FeCl₂ + H₂↑",
      h2so4: "Fe + H₂SO₄ → FeSO₄ + H₂↑",
    },
    salts: { hcl: "FeCl₂", h2so4: "FeSO₄" },
    solutionTint: "#bbf7d0", // pale green
  },
  copper: {
    symbol: "Cu", name: "Copper",
    stripColor: "#d97706", stripBorder: "#b45309",
    reactivity: 0, tempRise: 0, dissolveRate: 0,
    bubbleCount: 0, bubbleSpeed: 0,
    rate: "No reaction",
    observations: "No bubbles. Copper is below H₂ in the reactivity series — cannot displace it.",
    eqs: {
      hcl:   "Cu + HCl → No reaction",
      h2so4: "Cu + H₂SO₄ (dilute) → No reaction",
    },
    salts: { hcl: null, h2so4: null },
    solutionTint: null,
  },
};

/* ─── Pre-seeded bubbles (x within metal strip 145–169, y ~252–260) */
const BUBBLES = [
  { x: 150, y: 254, r: 3.0, dur: 1.8, delay: 0.0 },
  { x: 157, y: 258, r: 2.5, dur: 2.1, delay: 0.3 },
  { x: 163, y: 252, r: 3.5, dur: 1.5, delay: 0.6 },
  { x: 148, y: 256, r: 2.0, dur: 2.4, delay: 0.9 },
  { x: 161, y: 254, r: 2.8, dur: 1.9, delay: 1.2 },
  { x: 155, y: 257, r: 3.2, dur: 1.7, delay: 0.2 },
  { x: 165, y: 253, r: 2.3, dur: 2.2, delay: 0.5 },
  { x: 152, y: 255, r: 3.0, dur: 1.6, delay: 0.8 },
  { x: 159, y: 256, r: 2.6, dur: 2.0, delay: 1.1 },
  { x: 164, y: 258, r: 2.1, dur: 1.8, delay: 0.4 },
  { x: 149, y: 252, r: 3.5, dur: 2.3, delay: 0.7 },
  { x: 157, y: 254, r: 2.8, dur: 1.5, delay: 1.0 },
  { x: 162, y: 253, r: 2.2, dur: 2.1, delay: 0.1 },
  { x: 147, y: 257, r: 3.0, dur: 1.7, delay: 0.6 },
  { x: 160, y: 255, r: 2.5, dur: 1.9, delay: 1.3 },
];

/* ══════════════════════════════════════════════════════════════
   SVG 0 — INTRO: Reactivity Series
══════════════════════════════════════════════════════════════ */
export function MetalsIntroSVG() {
  const series = [
    { sym: "K",  name: "Potassium",  highlight: false },
    { sym: "Na", name: "Sodium",     highlight: false },
    { sym: "Ca", name: "Calcium",    highlight: false },
    { sym: "Mg", name: "Magnesium",  highlight: true,  color: "#6d28d9" },
    { sym: "Al", name: "Aluminium",  highlight: false },
    { sym: "Zn", name: "Zinc",       highlight: true,  color: "#0369a1" },
    { sym: "Fe", name: "Iron",       highlight: true,  color: "#b45309" },
    { sym: "Pb", name: "Lead",       highlight: false },
    { sym: "H₂", name: "Hydrogen",   highlight: false, isRef: true },
    { sym: "Cu", name: "Copper",     highlight: true,  color: "#d97706" },
    { sym: "Ag", name: "Silver",     highlight: false },
    { sym: "Au", name: "Gold",       highlight: false },
  ];

  return (
    <svg viewBox="0 0 340 370" className="w-full h-full">
      <defs>
        <linearGradient id="mitroBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" /><stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>
        <linearGradient id="mitrArrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="340" height="370" rx="14" fill="url(#mitroBg)" />

      {/* Reactivity arrow */}
      <rect x="22" y="30" width="10" height="290" rx="5" fill="url(#mitrArrow)" />
      <polygon points="27,20 18,36 36,36" fill="#7c3aed" />
      <polygon points="27,330 18,314 36,314" fill="#a78bfa" />
      <text x="12" y="186" fontSize={7} fill="#7c3aed" fontWeight="700"
        transform="rotate(-90,12,186)">MORE REACTIVE</text>

      {/* Title */}
      <text x="47" y="22" fontSize={11} fontWeight="800" fill="#4c1d95">Reactivity Series of Metals</text>

      {/* Series items */}
      {series.map((m, i) => {
        const y = 30 + i * 27;
        const isRef = m.isRef;
        return (
          <g key={m.sym}>
            {isRef ? (
              /* H₂ reference line */
              <>
                <line x1="40" y1={y + 6} x2="310" y2={y + 6}
                  stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3" />
                <text x="44" y={y + 3} fontSize={9} fill="#d97706" fontWeight="700">
                  — H₂ reference line (metals below cannot displace H₂) —
                </text>
              </>
            ) : m.highlight ? (
              /* Highlighted metal */
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <rect x="40" y={y - 1} width="265" height="22" rx="6"
                  fill={m.color} fillOpacity={0.12} stroke={m.color} strokeWidth={1.2} />
                <text x="54" y={y + 14} fontSize={11} fontWeight="800" fill={m.color}>{m.sym}</text>
                <text x="88" y={y + 14} fontSize={10} fill={m.color}>{m.name}</text>
                <text x="270" y={y + 14} fontSize={8} fill={m.color} fontWeight="700">★ IN LAB</text>
              </motion.g>
            ) : (
              /* Normal metal */
              <g>
                <text x="54" y={y + 14} fontSize={10} fontWeight="600" fill="#6b7280">{m.sym}</text>
                <text x="88" y={y + 14} fontSize={9} fill="#9ca3af">{m.name}</text>
              </g>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <rect x="40" y="342" width="265" height="18" rx="5"
        fill="#7c3aed" fillOpacity={0.08} stroke="#7c3aed" strokeWidth="0.8" />
      <text x="170" y="355" textAnchor="middle" fontSize={8.5} fill="#6d28d9" fontWeight="700">
        Mg, Zn, Fe react with dilute acids · Cu does not (below H₂)
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SVG 1 — MAIN REACTION BEAKER
   Props: metalKey, acidKey, stage (0–2), reactionProgress (0–1)
══════════════════════════════════════════════════════════════ */
export function MetalsReactionSVG({
  metalKey       = "magnesium",
  acidKey        = "hcl",
  stage          = 0,
  reactionProgress = 0,
}) {
  const metal = METAL_DATA[metalKey] || METAL_DATA.magnesium;
  const acid  = ACID_DATA[acidKey]   || ACID_DATA.hcl;

  /* Metal strip dimensions (bottom fixed at y=263) */
  const STRIP_FULL_H = 158;
  const STRIP_BOT    = 263;
  const stripH = metal.dissolveRate > 0
    ? Math.max(6, STRIP_FULL_H * (1 - reactionProgress * metal.dissolveRate))
    : STRIP_FULL_H;
  const stripTop = STRIP_BOT - stripH;

  /* Temperature */
  const temp       = 20 + metal.tempRise * reactionProgress;
  const mercuryH   = 20 + (metal.tempRise * reactionProgress / 25) * 110;

  /* Solution tint for Fe */
  const tintOpacity = metal.solutionTint ? reactionProgress * 0.45 : 0;

  /* Bubbles active */
  const bubblesActive  = stage >= 2 && metal.bubbleCount > 0 && reactionProgress > 0;
  const activeBubbles  = BUBBLES.slice(0, metal.bubbleCount);

  return (
    <svg viewBox="0 0 340 370" className="w-full h-full">
      <defs>
        <linearGradient id="mrxBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" /><stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>
        <linearGradient id="mrxGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="mrxMercury" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="mrxStrip" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={metal.stripColor} />
          <stop offset="100%" stopColor={metal.stripBorder} />
        </linearGradient>
        <clipPath id="mrxBeakerClip">
          <rect x="83" y="60" width="149" height="210" rx="3" />
        </clipPath>
        <clipPath id="mrxThermClip">
          <rect x="262" y="78" width="10" height="178" rx="5" />
        </clipPath>
        <filter id="mrxGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="340" height="370" rx="14" fill="url(#mrxBg)" />
      <rect x="0" y="338" width="340" height="32" fill="#e2e8f0" />
      <rect x="0" y="334" width="340" height="6"  fill="#cbd5e1" />

      {/* ── Beaker ── */}
      <rect x="75" y="52" width="165" height="225" rx="6"
        fill="url(#mrxGlass)" stroke="#a78bfa" strokeWidth="1.8" />

      {/* Beaker spout lines at top */}
      <path d="M75,66 L75,52 L240,52 L240,66" fill="none" stroke="#a78bfa" strokeWidth="1.8" />

      {/* Contents (clipped) */}
      <g clipPath="url(#mrxBeakerClip)">
        {/* Acid fill */}
        {stage >= 0 && (
          <rect x="83" y="60" width="149" height="210"
            fill={acid.color} fillOpacity={0.7} />
        )}

        {/* Fe solution tint (pale green when reacting) */}
        {tintOpacity > 0.01 && (
          <rect x="83" y="60" width="149" height="210"
            fill={metal.solutionTint} fillOpacity={tintOpacity} />
        )}

        {/* Metal strip */}
        {stage >= 1 && (
          <motion.rect
            x="145" y={stripTop} width="24" height={stripH}
            fill="url(#mrxStrip)" stroke={metal.stripBorder} strokeWidth="1"
            rx="2"
            animate={{ y: stripTop, height: stripH }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Bubbles */}
        {bubblesActive && activeBubbles.map((b, i) => (
          <motion.circle key={`b${i}`}
            cx={b.x} r={b.r}
            fill="white" fillOpacity={0}
            stroke="#a78bfa" strokeWidth={0.5}
            initial={{ cy: b.y, fillOpacity: 0 }}
            animate={{
              cy:          [b.y, b.y - 50, b.y - 100, b.y - 150, b.y - 190],
              fillOpacity: [0,   0.65,     0.55,      0.4,       0],
              r:           [b.r, b.r * 1.1, b.r * 1.2, b.r * 1.3, b.r * 1.4],
            }}
            transition={{
              duration:   b.dur * (metal.bubbleSpeed / 1.3),
              delay:      b.delay,
              repeat:     Infinity,
              ease:       "easeOut",
            }}
          />
        ))}

        {/* Water surface */}
        <motion.ellipse cx="157" cy="65" rx="70" ry="5"
          fill="#a78bfa" fillOpacity={0.3}
          animate={{ scaleX: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </g>

      <GlassSheen x="75" y="52" w="165" h="225" />

      {/* "No reaction" indicator */}
      {stage >= 2 && metal.reactivity === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <rect x="90" y="145" width="130" height="32" rx="8"
            fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
          <text x="155" y="165" textAnchor="middle" fontSize={11}
            fontWeight="800" fill="#dc2626">✕ No reaction</text>
        </motion.g>
      )}

      {/* H₂ gas label above beaker */}
      {stage >= 2 && metal.reactivity > 0 && reactionProgress > 0.05 && (
        <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <rect x="82" y="28" width="60" height="18" rx="6"
            fill="#7c3aed" fillOpacity={0.12} stroke="#7c3aed" strokeWidth={0.8} />
          <text x="112" y="41" textAnchor="middle" fontSize={9}
            fontWeight="700" fill="#6d28d9">H₂ gas ↑</text>
          {/* rising gas dots */}
          {[0, 1, 2].map(k => (
            <motion.circle key={k} cx={112 + (k - 1) * 10} r={2.5}
              fill="#7c3aed" fillOpacity={0}
              initial={{ cy: 52, fillOpacity: 0 }}
              animate={{ cy: [52, 42, 30], fillOpacity: [0, 0.5, 0] }}
              transition={{ duration: 1.4, delay: k * 0.4, repeat: Infinity }} />
          ))}
        </motion.g>
      )}

      {/* Metal strip handle (always above solution) */}
      {stage >= 1 && (
        <rect x="150" y="40" width="14" height="26" rx="3"
          fill={metal.stripBorder} />
      )}

      {/* Metal label on strip handle */}
      {stage >= 1 && (
        <text x="157" y="57" textAnchor="middle" fontSize={8}
          fontWeight="800" fill="white">{metal.symbol}</text>
      )}

      {/* ── Thermometer ── */}
      {/* Tube */}
      <rect x="260" y="78" width="14" height="180" rx="7"
        fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.2" />
      {/* Mercury column */}
      <g clipPath="url(#mrxThermClip)">
        <motion.rect x="263" width="8" rx="3"
          fill="url(#mrxMercury)"
          animate={{ y: 256 - mercuryH, height: mercuryH }}
          transition={{ duration: 0.5 }} />
      </g>
      {/* Bulb */}
      <circle cx="267" cy="265" r="11" fill="#ef4444" stroke="#dc2626" strokeWidth="1.2" />
      {/* Temp label */}
      <text x="267" y="292" textAnchor="middle" fontSize={9}
        fontWeight="700" fill="#dc2626">{temp.toFixed(0)}°C</text>
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map(pct => (
        <g key={pct}>
          <line x1="257" y1={256 - pct * 1.78} x2="263" y2={256 - pct * 1.78}
            stroke="#94a3b8" strokeWidth="0.8" />
          <text x="254" y={256 - pct * 1.78 + 3.5} textAnchor="end"
            fontSize={5.5} fill="#94a3b8">{(20 + pct * 0.25).toFixed(0)}</text>
        </g>
      ))}

      {/* Status */}
      <text x="157" y="358" textAnchor="middle" fontSize={9.5} fontWeight="600" fill="#475569">
        {stage === 0 ? "Beaker with acid — select metal" :
         stage === 1 ? `${metal.name} strip in ${acid.formula} — ready to react` :
         metal.reactivity === 0 ? "No reaction observed" :
         reactionProgress < 1 ? `Reacting… ${Math.round(reactionProgress * 100)}%` :
         "Reaction complete"}
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SVG 2 — COMPARISON: 4 metals side by side
══════════════════════════════════════════════════════════════ */
export function MetalsComparisonSVG({ acidKey = "hcl" }) {
  const metals  = ["magnesium", "zinc", "iron", "copper"];
  const bW = 60; const bH = 150; const soln = 110;

  /* Mini-bubble positions per beaker slot */
  const miniPos = [
    [{ x: 14, r: 3 }, { x: 22, r: 2.5 }, { x: 30, r: 3.2 }, { x: 18, r: 2 }, { x: 26, r: 2.8 }],
    [{ x: 14, r: 2.5 }, { x: 22, r: 2.0 }, { x: 30, r: 2.8 }, { x: 18, r: 2.2 }],
    [{ x: 18, r: 1.8 }, { x: 28, r: 2.0 }],
    [],
  ];

  return (
    <svg viewBox="0 0 340 250" className="w-full h-full">
      <defs>
        <linearGradient id="cmpBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" /><stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="340" height="250" rx="12" fill="url(#cmpBg)" />

      {metals.map((mk, ti) => {
        const metal = METAL_DATA[mk];
        const acid  = ACID_DATA[acidKey];
        const jarX  = 14 + ti * 82;
        const jarY  = 30;
        const jarBot = jarY + bH;
        /* Strip */
        const stripH  = ti === 0 ? 38 : ti === 1 ? 65 : ti === 2 ? 88 : 95;
        const stripX  = jarX + bW / 2 - 8;
        const stripY  = jarBot - stripH;
        const bubbles = miniPos[ti];

        return (
          <g key={mk}>
            {/* Beaker */}
            <rect x={jarX} y={jarY} width={bW} height={bH} rx="4"
              fill={acid.color} fillOpacity={0.65} stroke="#a78bfa" strokeWidth="1.5" />
            {/* Fe tint */}
            {mk === "iron" && (
              <rect x={jarX} y={jarY} width={bW} height={bH} rx="4"
                fill="#bbf7d0" fillOpacity={0.35} />
            )}
            {/* Metal strip */}
            <rect x={stripX} y={stripY} width="16" height={stripH} rx="2"
              fill={metal.stripColor} stroke={metal.stripBorder} strokeWidth="1" />
            <text x={stripX + 8} y={stripY + stripH - 6} textAnchor="middle"
              fontSize={7} fontWeight="800" fill={metal.stripBorder}>{metal.symbol}</text>
            {/* Bubbles */}
            {bubbles.map((b, bi) => (
              <motion.circle key={bi}
                cx={jarX + b.x} r={b.r}
                fill="white" stroke="#a78bfa" strokeWidth={0.5} fillOpacity={0}
                initial={{ cy: jarBot - 15, fillOpacity: 0 }}
                animate={{
                  cy:          [jarBot - 15, jarBot - 60, jarBot - 100, jarBot - 140],
                  fillOpacity: [0, 0.7, 0.5, 0],
                }}
                transition={{
                  duration:   1.4 + bi * 0.3 + ti * 0.6,
                  delay:      bi * 0.5,
                  repeat:     Infinity,
                  ease:       "easeOut",
                }}
              />
            ))}
            {/* Water surface */}
            <ellipse cx={jarX + bW / 2} cy={jarY + 6} rx={bW / 2 - 4} ry={4}
              fill="#a78bfa" fillOpacity={0.25} />
            {/* Metal name above */}
            <text x={jarX + bW / 2} y={jarY - 10} textAnchor="middle"
              fontSize={8} fontWeight="700" fill="#4c1d95">{metal.name}</text>
            {/* Reaction rate below */}
            <rect x={jarX} y={jarY + bH + 4} width={bW} height={16} rx="4"
              fill={metal.reactivity > 0 ? "#6d28d9" : "#dc2626"} fillOpacity={0.1}
              stroke={metal.reactivity > 0 ? "#6d28d9" : "#dc2626"} strokeWidth={0.8} />
            <text x={jarX + bW / 2} y={jarY + bH + 15} textAnchor="middle"
              fontSize={7.5} fontWeight="700"
              fill={metal.reactivity > 0 ? "#6d28d9" : "#dc2626"}>
              {ti === 0 ? "Vigorous" : ti === 1 ? "Moderate" : ti === 2 ? "Slow" : "No reaction"}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <text x="170" y="232" textAnchor="middle" fontSize={8} fill="#6b7280">
        All beakers contain {ACID_DATA[acidKey].name} — metal strip partially dissolved after reaction
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SVG 3 — HYDROGEN TEST (glowing splint)
══════════════════════════════════════════════════════════════ */
export function MetalsHydrogenSVG() {
  return (
    <svg viewBox="0 0 340 300" className="w-full h-full">
      <defs>
        <linearGradient id="hBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ff" /><stop offset="100%" stopColor="#f5f3ff" />
        </linearGradient>
        <linearGradient id="hTube" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="hFlame" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="340" height="300" rx="14" fill="url(#hBg)" />

      {/* Test tube */}
      <rect x="145" y="55" width="50" height="180" rx="25"
        fill="url(#hTube)" stroke="#a78bfa" strokeWidth="1.8" />
      {/* H₂ gas label inside */}
      <text x="170" y="130" textAnchor="middle" fontSize={10}
        fontWeight="700" fill="#6d28d9">H₂</text>
      <text x="170" y="145" textAnchor="middle" fontSize={8} fill="#8b5cf6">gas</text>
      {/* Tiny gas bubbles inside tube */}
      {[0, 1, 2, 3].map(i => (
        <motion.circle key={i} cx={160 + i * 7} r={2.5}
          fill="#a78bfa" fillOpacity={0}
          initial={{ cy: 200, fillOpacity: 0 }}
          animate={{ cy: [200, 160, 120, 80], fillOpacity: [0, 0.5, 0.4, 0] }}
          transition={{ duration: 1.8, delay: i * 0.45, repeat: Infinity }} />
      ))}

      {/* Splint stick */}
      <motion.g
        animate={{ rotate: [-5, 0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "240px 80px" }}>
        <rect x="200" y="50" width="85" height="6" rx="3" fill="#92400e" />
        {/* Glowing ember at tip */}
        <motion.ellipse cx="204" cy="53" rx="8" ry="5"
          fill="url(#hFlame)"
          animate={{ rx: [8, 10, 7, 9], ry: [5, 7, 4, 6] }}
          transition={{ duration: 0.4, repeat: Infinity }} />
        <motion.ellipse cx="204" cy="53" rx="5" ry="3"
          fill="#fef08a" fillOpacity={0.9}
          animate={{ rx: [5, 7, 4], ry: [3, 5, 2] }}
          transition={{ duration: 0.3, repeat: Infinity }} />
      </motion.g>

      {/* "Squeaky pop!" text */}
      <motion.g
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.0, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
        style={{ transformOrigin: "170px 38px" }}>
        <rect x="108" y="24" width="124" height="24" rx="8"
          fill="#7c3aed" fillOpacity={0.15} stroke="#7c3aed" strokeWidth="1" />
        <text x="170" y="40" textAnchor="middle" fontSize={12}
          fontWeight="800" fill="#6d28d9">💥 Squeaky pop!</text>
      </motion.g>

      {/* Explanation boxes */}
      <rect x="20" y="252" width="140" height="36" rx="8"
        fill="#7c3aed" fillOpacity={0.08} stroke="#7c3aed" strokeWidth="0.8" />
      <text x="90" y="268" textAnchor="middle" fontSize={9} fontWeight="700" fill="#6d28d9">Glowing splint test</text>
      <text x="90" y="282" textAnchor="middle" fontSize={8} fill="#7c3aed">
        H₂ ignites with a pop
      </text>

      <rect x="178" y="252" width="142" height="36" rx="8"
        fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth="0.8" />
      <text x="249" y="268" textAnchor="middle" fontSize={9} fontWeight="700" fill="#b45309">Confirms hydrogen gas</text>
      <text x="249" y="282" textAnchor="middle" fontSize={8} fill="#d97706">
        2H₂ + O₂ → 2H₂O
      </text>
    </svg>
  );
}
