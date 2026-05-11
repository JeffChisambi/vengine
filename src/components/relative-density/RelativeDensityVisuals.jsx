import React from "react";
import { motion } from "framer-motion";

/* ── Colour helpers ─────────────────────────────────── */
const LIQUID_PALETTE = {
  water:       { fill: "#bae6fd", stroke: "#38bdf8", deep: "#0284c7" },
  kerosene:    { fill: "#fde68a", stroke: "#f59e0b", deep: "#d97706" },
  "cooking-oil":{ fill: "#fef08a", stroke: "#eab308", deep: "#ca8a04" },
  "salt-water": { fill: "#93c5fd", stroke: "#3b82f6", deep: "#2563eb" },
  glycerine:   { fill: "#86efac", stroke: "#22c55e", deep: "#16a34a" },
  ethanol:     { fill: "#c4b5fd", stroke: "#8b5cf6", deep: "#7c3aed" },
};
function lc(id) { return LIQUID_PALETTE[id] || LIQUID_PALETTE.water; }

/* ── Density Bottle (Pyknometer) ────────────────────── */
export function DensityBottleSVG({ liquid = null, filled = false }) {
  const c = filled && liquid ? lc(liquid) : null;
  return (
    <svg viewBox="0 0 180 320" className="w-full h-full max-h-[300px]"
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.10))" }}>
      <defs>
        <linearGradient id="dbGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#dbeafe" stopOpacity="0.55" />
          <stop offset="50%"  stopColor="#f0f9ff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="dbLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c ? c.fill : "#bae6fd"} stopOpacity="0.85" />
          <stop offset="100%" stopColor={c ? c.deep : "#0284c7"} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="dbClip">
          <path d="M 60 100 Q 30 120 28 160 L 28 260 Q 28 268 36 268 L 144 268 Q 152 268 152 260 L 152 160 Q 150 120 120 100 Z" />
        </clipPath>
      </defs>

      <ellipse cx="90" cy="280" rx="68" ry="8" fill="#cbd5e1" fillOpacity="0.3" />

      {/* Body outline */}
      <path d="M 60 100 Q 30 120 28 160 L 28 260 Q 28 268 36 268 L 144 268 Q 152 268 152 260 L 152 160 Q 150 120 120 100 Z"
        fill="url(#dbGlass)" stroke="#94a3b8" strokeWidth="2" />

      {/* Liquid fill */}
      {filled && (
        <motion.rect x="29" width="122" y="130" height="138"
          clipPath="url(#dbClip)" fill="url(#dbLiquid)"
          initial={{ height: 0, y: 268 }} animate={{ height: 138, y: 130 }}
          transition={{ duration: 0.9, ease: "easeOut" }} />
      )}

      {/* Glass highlight */}
      <path d="M 36 115 Q 34 140 34 160 L 34 240" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.25" />

      {/* Neck */}
      <rect x="75" y="36" width="30" height="68" rx="4" fill="url(#dbGlass)" stroke="#94a3b8" strokeWidth="2" />
      <rect x="77" y="38" width="6" height="64" rx="3" fill="#fff" opacity="0.15" />

      {/* Stopper / cap */}
      <rect x="68" y="22" width="44" height="18" rx="6" fill="#64748b" stroke="#475569" strokeWidth="1.5" />
      <rect x="74" y="10" width="32" height="14" rx="5" fill="#475569" />
      {/* Capillary hole */}
      <circle cx="90" cy="16" r="3" fill="#1e293b" />
      <circle cx="90" cy="16" r="1.5" fill="#334155" />

      {/* Volume label */}
      <text x="90" y="200" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b" opacity="0.7">25 mL</text>

      {/* Bottom label */}
      <text x="90" y="296" textAnchor="middle" fontSize="11" fontWeight="600" fill="#475569"
        fontFamily="var(--font-heading)">Density Bottle</text>
    </svg>
  );
}

/* ── Analytical Balance ─────────────────────────────── */
export function AnalyticalBalanceSVG({ mass = 0, bottleOn = false, liquidId = null }) {
  const stableReading = bottleOn ? mass : 0;
  return (
    <svg viewBox="0 0 280 320" className="w-full h-full max-h-[300px]"
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }}>
      <defs>
        <linearGradient id="balBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="balPlat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      <ellipse cx="140" cy="295" rx="90" ry="8" fill="#cbd5e1" fillOpacity="0.35" />

      {/* Base */}
      <rect x="40" y="230" width="200" height="55" rx="10"
        fill="url(#balBody)" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Wind shield frame (4 glass panes) */}
      <rect x="50" y="90" width="180" height="145" rx="4"
        fill="#f0f9ff" fillOpacity="0.35" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="50" y1="90" x2="50" y2="235" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="230" y1="90" x2="230" y2="235" stroke="#cbd5e1" strokeWidth="2" />

      {/* Wind shield door (slightly open) */}
      <rect x="130" y="90" width="50" height="140" rx="2"
        fill="#bae6fd" fillOpacity="0.12" stroke="#94a3b8" strokeWidth="1"
        transform="skewY(-2)" />

      {/* Weighing pan (inside shield) */}
      <motion.g animate={{ y: bottleOn ? 3 : 0 }} transition={{ duration: 0.5 }}>
        <ellipse cx="140" cy="200" rx="55" ry="8"
          fill="url(#balPlat)" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Thin pan platform */}
        <rect x="86" y="200" width="108" height="6" rx="3"
          fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

        {/* Object on pan — mini density bottle */}
        {bottleOn && (
          <motion.g initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            {/* bottle body */}
            <path d="M 124 170 Q 112 175 110 182 L 110 200 L 170 200 L 170 182 Q 168 175 156 170 Z"
              fill={liquidId ? lc(liquidId).fill + "cc" : "#dbeafe99"}
              stroke="#94a3b8" strokeWidth="1.5" />
            {/* neck */}
            <rect x="133" y="153" width="14" height="19" rx="3"
              fill="#dbeafe80" stroke="#94a3b8" strokeWidth="1" />
            {/* stopper */}
            <rect x="129" y="147" width="22" height="8" rx="4"
              fill="#64748b" />
          </motion.g>
        )}
      </motion.g>

      {/* Pillar */}
      <rect x="132" y="50" width="16" height="45" rx="4"
        fill="#94a3b8" stroke="#64748b" strokeWidth="1" />

      {/* Levelling screws */}
      <circle cx="70" cy="270" r="8" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="210" cy="270" r="8" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
      <line x1="66" y1="270" x2="74" y2="270" stroke="#64748b" strokeWidth="2" />
      <line x1="70" y1="266" x2="70" y2="274" stroke="#64748b" strokeWidth="2" />
      <line x1="206" y1="270" x2="214" y2="270" stroke="#64748b" strokeWidth="2" />
      <line x1="210" y1="266" x2="210" y2="274" stroke="#64748b" strokeWidth="2" />

      {/* Digital display */}
      <rect x="85" y="240" width="110" height="30" rx="5" fill="#0f172a" />
      <motion.text x="140" y="261" textAnchor="middle" fontSize="15" fontWeight="700"
        fontFamily="monospace" fill="#4ade80"
        animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        {stableReading > 0 ? `${stableReading.toFixed(1)} g` : "0.00 g"}
      </motion.text>

      {/* Power LED */}
      <circle cx="60" cy="255" r="3.5" fill="#4ade80" />

      {/* Spirit level bubble */}
      <circle cx="140" cy="52" r="8" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="140" cy="52" r="3" fill="#22c55e" opacity="0.8" />

      <text x="140" y="308" textAnchor="middle" fontSize="11" fontWeight="600"
        fill="#475569" fontFamily="var(--font-heading)">Analytical Balance</text>
    </svg>
  );
}

/* ── Hydrometer in Beaker ───────────────────────────── */
export function HydrometerSVG({ liquid = "water", rd = 1.0 }) {
  const { fill, stroke, deep } = lc(liquid);
  const beakerH = 200;
  const beakerY = 80;
  const liquidLevel = 0.75;
  const liquidY = beakerY + beakerH * (1 - liquidLevel);
  const liquidH = beakerH * liquidLevel;

  /* Hydrometer geometry */
  const BULB_CY  = beakerY + beakerH - 28;
  const BULB_R   = 22;
  const STEM_W   = 8;
  // Submersion: in water rd=1.0 stem tip is 70px above bulb top
  // Denser → floats higher (tip rises), less dense → sinks lower
  const REF_SUB  = 130; // total submerged length at rd=1.0 (bulb + part of stem)
  const submersion = REF_SUB / rd;
  const stemTop_submerged = Math.min(BULB_CY - BULB_R - submersion + REF_SUB, BULB_CY - BULB_R + 5);
  const stemTip = stemTop_submerged - 80; // always 80px stem above submerged part
  const waterlineY = BULB_CY - BULB_R - (submersion - BULB_R * 2);

  // Clamp to visible range
  const wl = Math.max(liquidY + 4, Math.min(liquidY + liquidH - 10, waterlineY));

  /* RD scale marks on stem */
  const marks = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3];
  const stemBaseY = BULB_CY - BULB_R;
  const stemScale = 80 / (1.3 - 0.7); // 80px for 0.6 RD range

  return (
    <svg viewBox="0 0 300 380" className="w-full"
      style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.10))", minHeight: 220 }}>
      <defs>
        <linearGradient id="hydGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#dbeafe" stopOpacity="0.4" />
          <stop offset="50%"  stopColor="#f0f9ff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="hydLiq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={fill}  stopOpacity="0.75" />
          <stop offset="100%" stopColor={deep}  stopOpacity="0.90" />
        </linearGradient>
        <clipPath id="hydBeakerClip">
          <rect x="72" y={liquidY} width="156" height={liquidH} />
        </clipPath>
        <clipPath id="hydBeakerBody">
          <rect x="72" y={beakerY} width="156" height={beakerH} />
        </clipPath>
      </defs>

      {/* ── Beaker ── */}
      <rect x="72" y={beakerY} width="156" height={beakerH} rx="4"
        fill="#f0f9ff" fillOpacity="0.3" stroke="#94a3b8" strokeWidth="2.5" />
      {/* Liquid */}
      <rect x="73" y={liquidY} width="154" height={liquidH}
        fill="url(#hydLiq)" />
      {/* Liquid surface highlight */}
      <ellipse cx="150" cy={liquidY} rx="74" ry="4" fill={fill} fillOpacity="0.6" />
      {/* Beaker front glass overlay */}
      <rect x="72" y={beakerY} width="156" height={beakerH} rx="4"
        fill="url(#hydGlass)" stroke="#94a3b8" strokeWidth="2.5" />
      {/* Beaker spout */}
      <path d={`M 72 ${beakerY} L 62 ${beakerY - 12} L 72 ${beakerY - 4}`}
        fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Beaker base */}
      <rect x="62" y={beakerY + beakerH} width="176" height="8" rx="4" fill="#cbd5e1" />
      {/* Volume markings */}
      {[0.25, 0.5, 0.75].map((f, i) => {
        const my = beakerY + beakerH * (1 - f);
        return (
          <g key={i}>
            <line x1="73" y1={my} x2="88" y2={my} stroke="#64748b" strokeWidth="1" />
            <text x="91" y={my + 4} fontSize="9" fill="#64748b">{(f * 500).toFixed(0)} mL</text>
          </g>
        );
      })}

      {/* ── Hydrometer ── */}
      {/* Stem (upper, above liquid) */}
      <rect x={150 - STEM_W / 2} y={stemTip} width={STEM_W} height={wl - stemTip}
        fill="#f0f9ff" fillOpacity="0.85" stroke="#94a3b8" strokeWidth="1.5" rx="3" />

      {/* Stem (submerged part) */}
      <rect x={150 - STEM_W / 2} y={wl} width={STEM_W} height={stemBaseY - wl}
        fill="#dbeafe" fillOpacity="0.7" stroke="#94a3b8" strokeWidth="1.5" rx="1" />

      {/* Bulb (submerged) */}
      <ellipse cx="150" cy={BULB_CY} rx={BULB_R} ry={BULB_R + 4}
        fill="#dbeafe" fillOpacity="0.85" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Bulb highlight */}
      <ellipse cx="143" cy={BULB_CY - 6} rx="8" ry="6" fill="#fff" opacity="0.25" />
      {/* Weight in bulb */}
      <ellipse cx="150" cy={BULB_CY + 8} rx="14" ry="8" fill="#94a3b8" opacity="0.6" />

      {/* RD scale marks on stem */}
      {marks.map((val) => {
        const markY = stemBaseY - (val - 0.7) * stemScale;
        const isRead = Math.abs(val - rd) < 0.055;
        return (
          <g key={val}>
            <line x1={150 - STEM_W / 2 - 3} y1={markY} x2={150 - STEM_W / 2} y2={markY}
              stroke={isRead ? "#ef4444" : "#64748b"} strokeWidth={isRead ? 2 : 1} />
            <text x={150 - STEM_W / 2 - 6} y={markY + 3.5} textAnchor="end" fontSize="8"
              fill={isRead ? "#ef4444" : "#64748b"} fontWeight={isRead ? "800" : "400"}>
              {val.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Waterline indicator */}
      <motion.line x1={150 - STEM_W / 2 - 14} y1={wl} x2={150 + STEM_W / 2 + 14} y2={wl}
        stroke="#ef4444" strokeWidth="1.8" strokeDasharray="4 3" strokeLinecap="round"
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <text x={150 + STEM_W / 2 + 18} y={wl + 4} fontSize="9" fill="#ef4444" fontWeight="700">
        RD = {rd.toFixed(3)}
      </text>

      {/* Liquid label in beaker */}
      <text x="150" y={beakerY + beakerH + 26} textAnchor="middle" fontSize="11"
        fontWeight="700" fill={stroke} fontFamily="var(--font-heading)">
        Hydrometer
      </text>
    </svg>
  );
}

/* ── Liquid Columns comparison ──────────────────────── */
export function LiquidColumnsSVG({ selectedId = null }) {
  const cols = [
    { id: "ethanol",      name: "Ethanol",      rd: 0.789 },
    { id: "kerosene",     name: "Kerosene",     rd: 0.80  },
    { id: "cooking-oil",  name: "Cooking Oil",  rd: 0.91  },
    { id: "water",        name: "Water",        rd: 1.000 },
    { id: "salt-water",   name: "Salt Water",   rd: 1.025 },
    { id: "glycerine",    name: "Glycerine",    rd: 1.261 },
  ];
  const BASE_H = 150;
  const COL_W = 34;
  const W = 300, H = 220;
  const BOTTOM = 180;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {cols.map((c, i) => {
        const { fill, stroke } = lc(c.id);
        const colH = BASE_H * c.rd;
        const x = 14 + i * (COL_W + 12);
        const isSelected = selectedId === c.id;
        return (
          <g key={c.id}>
            {/* Column */}
            <motion.rect x={x} y={BOTTOM - colH} width={COL_W} height={colH} rx="3"
              fill={fill} stroke={stroke} strokeWidth={isSelected ? 2.5 : 1.2}
              opacity={selectedId && !isSelected ? 0.4 : 1}
              initial={{ height: 0, y: BOTTOM }} animate={{ height: colH, y: BOTTOM - colH }}
              transition={{ duration: 0.8, delay: i * 0.1 }} />
            {/* RD label */}
            <text x={x + COL_W / 2} y={BOTTOM - colH - 5} textAnchor="middle"
              fontSize="8" fontWeight="700" fill={stroke} opacity={selectedId && !isSelected ? 0.4 : 1}>
              {c.rd.toFixed(3)}
            </text>
            {/* Name label */}
            <text x={x + COL_W / 2} y={BOTTOM + 12} textAnchor="middle" fontSize="7"
              fill={isSelected ? stroke : "#64748b"} fontWeight={isSelected ? "700" : "400"}
              opacity={selectedId && !isSelected ? 0.4 : 1}>
              {c.name}
            </text>
          </g>
        );
      })}
      {/* Water reference line */}
      <line x1="8" y1={BOTTOM - BASE_H} x2={W - 8} y2={BOTTOM - BASE_H}
        stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" />
      <text x="6" y={BOTTOM - BASE_H - 4} fontSize="7" fill="#3b82f6">RD = 1.000 (water)</text>
      {/* Base line */}
      <line x1="8" y1={BOTTOM} x2={W - 8} y2={BOTTOM} stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Intro visual — layered liquids ─────────────────── */
export function RelativeDensityIntroSVG() {
  const layers = [
    { id: "glycerine",   h: 46, label: "Glycerine  RD 1.26" },
    { id: "water",       h: 46, label: "Water  RD 1.00" },
    { id: "cooking-oil", h: 40, label: "Cooking Oil  RD 0.91" },
    { id: "kerosene",    h: 40, label: "Kerosene  RD 0.80" },
  ];
  const W = 220, H = 280;
  const beakerX = 40, beakerW = 120, baseY = 248;
  let curY = baseY;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
      <defs>
        <clipPath id="introClip">
          <rect x={beakerX} y="50" width={beakerW} height={baseY - 50} />
        </clipPath>
      </defs>

      {/* Beaker shell */}
      <rect x={beakerX} y="50" width={beakerW} height={baseY - 50} rx="4"
        fill="#f0f9ff" fillOpacity="0.2" stroke="#94a3b8" strokeWidth="2.5" />
      {/* Spout */}
      <path d={`M ${beakerX} 50 L ${beakerX - 10} 38 L ${beakerX} 45`}
        fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Liquid layers */}
      {[...layers].reverse().map((l, i) => {
        const { fill, stroke } = lc(l.id);
        curY -= l.h;
        const y = curY;
        return (
          <motion.rect key={l.id} x={beakerX + 1} y={y} width={beakerW - 2} height={l.h}
            fill={fill} fillOpacity="0.85"
            clipPath="url(#introClip)"
            initial={{ height: 0, y: y + l.h }} animate={{ height: l.h, y }}
            transition={{ duration: 0.7, delay: i * 0.18 }} />
        );
      })}

      {/* Layer labels */}
      {(() => {
        let ly = baseY;
        return [...layers].map((l, i) => {
          ly -= l.h;
          const { stroke } = lc(l.id);
          return (
            <g key={l.id}>
              <line x1={beakerX + beakerW} y1={ly + l.h / 2} x2={beakerX + beakerW + 6} y2={ly + l.h / 2}
                stroke={stroke} strokeWidth="1.2" />
              <text x={beakerX + beakerW + 8} y={ly + l.h / 2 + 3.5} fontSize="8" fill={stroke} fontWeight="600">
                {l.label}
              </text>
            </g>
          );
        });
      })()}

      {/* Beaker front glass */}
      <rect x={beakerX} y="50" width={beakerW} height={baseY - 50} rx="4"
        fill="none" stroke="#94a3b8" strokeWidth="2.5" />
      {/* Beaker base */}
      <rect x={beakerX - 8} y={baseY} width={beakerW + 16} height="8" rx="4" fill="#cbd5e1" />

      <text x={beakerX + beakerW / 2} y={baseY + 24} textAnchor="middle" fontSize="9"
        fill="#64748b" fontWeight="600">Immiscible liquid layers</text>
    </svg>
  );
}
