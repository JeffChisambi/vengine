import React from "react";
import { motion } from "framer-motion";

/* ─── Reusable helpers ─────────────────────────────────────────────── */

function Steam({ x, y, delay = 0 }) {
  return (
    <motion.path
      d={`M${x},${y} Q${x - 6},${y - 14} ${x},${y - 28} Q${x + 6},${y - 42} ${x},${y - 56}`}
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0], y: [0, -8] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function Bubble({ cx, baseY, delay = 0, size = 3 }) {
  return (
    <motion.circle
      cx={cx}
      r={size}
      fill="#bae6fd"
      fillOpacity={0.7}
      initial={{ cy: baseY, opacity: 0 }}
      animate={{ cy: [baseY, baseY - 30], opacity: [0, 0.8, 0] }}
      transition={{ duration: 1.4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ── Leaf shape path (organic oval leaf) ─────────────────────── */
function leafPath(cx, cy, w = 70, h = 100) {
  return `M${cx},${cy - h / 2}
    C${cx + w / 2},${cy - h / 2} ${cx + w / 2},${cy + h / 2} ${cx},${cy + h / 2}
    C${cx - w / 2},${cy + h / 2} ${cx - w / 2},${cy - h / 2} ${cx},${cy - h / 2}Z`;
}

/* ── Leaf veins ──────────────────────────────────────────────── */
function LeafVeins({ cx, cy, color = "#166534", opacity = 0.5 }) {
  return (
    <g stroke={color} strokeWidth="1.2" strokeOpacity={opacity} fill="none" strokeLinecap="round">
      <line x1={cx} y1={cy - 44} x2={cx} y2={cy + 44} />
      <line x1={cx} y1={cy - 20} x2={cx - 26} y2={cy - 32} />
      <line x1={cx} y1={cy - 20} x2={cx + 26} y2={cy - 32} />
      <line x1={cx} y1={cy} x2={cx - 30} y2={cy - 10} />
      <line x1={cx} y1={cy} x2={cx + 30} y2={cy - 10} />
      <line x1={cx} y1={cy + 20} x2={cx - 26} y2={cy + 12} />
      <line x1={cx} y1={cy + 20} x2={cx + 26} y2={cy + 12} />
    </g>
  );
}

/* ─── SVG: Leaf Selector (Intro visual) ───────────────────────────── */
export function LeafSelectSVG({ leafType = "healthy" }) {
  const configs = {
    healthy: { fill: "#22c55e", strokeColor: "#16a34a", label: "Healthy Green Leaf", spots: false, pale: false },
    partial: { fill: "#86efac", strokeColor: "#22c55e", label: "Partially Covered Leaf", spots: true, pale: false },
    pale: { fill: "#d9f99d", strokeColor: "#84cc16", label: "Pale / Etiolated Leaf", spots: false, pale: true },
    dark: { fill: "#15803d", strokeColor: "#14532d", label: "Dark-stored Leaf", spots: false, pale: false },
  };
  const cfg = configs[leafType] || configs.healthy;

  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <radialGradient id="leafGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor={cfg.fill} stopOpacity="0" />
        </radialGradient>
        <filter id="leafShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Stem */}
      <path
        d="M150,230 Q148,248 144,258"
        fill="none"
        stroke="#15803d"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Leaf body */}
      <motion.path
        d={leafPath(150, 140, 88, 120)}
        fill={cfg.fill}
        stroke={cfg.strokeColor}
        strokeWidth="2"
        filter="url(#leafShadow)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformOrigin: "150px 140px" }}
      />

      {/* Shine overlay */}
      <path
        d={leafPath(150, 140, 88, 120)}
        fill="url(#leafGrad)"
      />

      {/* Partial coverage (black patch for partially covered) */}
      {cfg.spots && (
        <motion.path
          d={leafPath(150, 125, 55, 70)}
          fill="#1c1917"
          fillOpacity={0.55}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
      )}

      {/* Veins */}
      <LeafVeins
        cx={150}
        cy={140}
        color={cfg.pale ? "#84cc16" : "#14532d"}
        opacity={cfg.pale ? 0.35 : 0.45}
      />

      {/* Sunlight rays for healthy leaf */}
      {leafType === "healthy" && [0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1={85 + i * 26}
          y1={68}
          x2={85 + i * 26}
          y2={52}
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity={0.7}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 1, 0.7] }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
          style={{ transformOrigin: `${85 + i * 26}px 68px` }}
        />
      ))}

      {/* Label */}
      <text
        x={150}
        y={270}
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#15803d"
        fontFamily="var(--font-heading)"
      >
        {cfg.label}
      </text>
    </svg>
  );
}

/* ─── SVG: Step 1 — Boiling in Water ──────────────────────────────── */
export function BoilingWaterSVG() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <linearGradient id="waterBoilGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="beakerGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.5" />
        </linearGradient>
        <clipPath id="bwClip">
          <rect x="70" y="80" width="160" height="170" rx="6" />
        </clipPath>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Bunsen burner base */}
      <rect x="120" y="268" width="60" height="10" rx="4" fill="#94a3b8" />
      <rect x="138" y="255" width="24" height="16" rx="3" fill="#64748b" />
      {/* Flame */}
      <motion.ellipse
        cx={150} cy={252} rx={10} ry={7}
        fill="#f97316" fillOpacity={0.9}
        animate={{ ry: [7, 10, 7], cy: [252, 249, 252] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.ellipse
        cx={150} cy={248} rx={6} ry={5}
        fill="#fbbf24" fillOpacity={0.9}
        animate={{ ry: [5, 7, 5], cy: [248, 245, 248] }}
        transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
      />
      <motion.ellipse
        cx={150} cy={246} rx={3} ry={3}
        fill="#fef3c7"
        animate={{ ry: [3, 4, 3] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />

      {/* Beaker */}
      <rect x="70" y="80" width="160" height="170" rx="6" fill="url(#beakerGlass)" stroke="#94a3b8" strokeWidth="2.5" />
      {/* Spout */}
      <path d="M70,80 L58,68" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M230,80 L242,68" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Water */}
      <g clipPath="url(#bwClip)">
        <rect x="71" y="140" width="158" height="110" fill="url(#waterBoilGrad)" />
        {/* Rippling surface */}
        <motion.path
          d="M71,140 Q110,134 150,140 Q190,146 229,140"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="2"
          animate={{ d: [
            "M71,140 Q110,134 150,140 Q190,146 229,140",
            "M71,140 Q110,146 150,140 Q190,134 229,140",
            "M71,140 Q110,134 150,140 Q190,146 229,140",
          ]}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* Bubbles */}
        {[85, 108, 130, 155, 178, 205, 220].map((cx, i) => (
          <Bubble key={i} cx={cx} baseY={248} delay={i * 0.22} size={2 + (i % 3)} />
        ))}

        {/* Leaf submerged (dulled) */}
        <motion.g
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeIn" }}
        >
          <path
            d={leafPath(150, 185, 68, 80)}
            fill="#86efac"
            stroke="#4ade80"
            strokeWidth="1.5"
          />
          <LeafVeins cx={150} cy={185} color="#14532d" opacity={0.3} />
        </motion.g>
      </g>

      {/* Measurement marks */}
      {[0.3, 0.6, 0.9].map((m, i) => {
        const y = 80 + 170 * (1 - m);
        return (
          <g key={i}>
            <line x1="72" y1={y} x2="88" y2={y} stroke="#64748b" strokeWidth="1" />
            <text x="92" y={y + 4} fontSize="9" fill="#64748b" fontFamily="var(--font-body)">{(m * 250).toFixed(0)} mL</text>
          </g>
        );
      })}

      {/* Steam rising */}
      <Steam x={125} y={78} delay={0} />
      <Steam x={150} y={78} delay={0.6} />
      <Steam x={175} y={78} delay={1.2} />

      <text x={150} y={294} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0369a1" fontFamily="var(--font-heading)">
        Boiling Water Bath
      </text>
    </svg>
  );
}

/* ─── SVG: Step 2 — Ethanol Decolorization ─────────────────────────── */
export function EthanolSVG({ progress = 1 }) {
  const green = `rgba(34,197,94,${0.85 * (1 - progress)})`;
  const leafFill = progress > 0.5 ? "#fef9c3" : "#86efac";
  const ethanolColor = progress > 0.3 ? `rgba(34,197,94,${progress * 0.7})` : "rgba(186,230,253,0.5)";

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <linearGradient id="ethanolGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity={0.4 + progress * 0.4} />
          <stop offset="100%" stopColor="#4ade80" stopOpacity={0.1 + progress * 0.6} />
        </linearGradient>
        <linearGradient id="ethBeakerGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0.5" />
        </linearGradient>
        <clipPath id="ethClip">
          <rect x="80" y="85" width="140" height="165" rx="5" />
        </clipPath>
      </defs>

      {/* Hot water bath outer container */}
      <rect x="50" y="200" width="200" height="65" rx="6" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2" />
      <text x={150} y={272} textAnchor="middle" fontSize="9" fill="#0369a1" fontFamily="var(--font-body)">Hot Water Bath</text>
      {/* Flame under outer bath */}
      <motion.ellipse cx={150} cy={272} rx={12} ry={5} fill="#f97316" fillOpacity={0.7}
        animate={{ ry: [5, 7, 5] }} transition={{ duration: 0.5, repeat: Infinity }} />

      {/* Inner test tube / beaker with ethanol */}
      <rect x="80" y="85" width="140" height="165" rx="5" fill="url(#ethBeakerGlass)" stroke="#86efac" strokeWidth="2.5" />

      <g clipPath="url(#ethClip)">
        {/* Ethanol liquid */}
        <motion.rect
          x="81" y="145" width="138" height="104"
          fill="url(#ethanolGrad)"
          animate={{ fill: ethanolColor }}
          transition={{ duration: 1 }}
        />

        {/* Chlorophyll diffusing into ethanol */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.circle
            key={i}
            cx={95 + i * 22}
            cy={148 + (i % 3) * 12}
            r={5 + i * 1.5}
            fill="#22c55e"
            fillOpacity={0}
            animate={{
              cx: [95 + i * 22, 85 + i * 25, 80 + i * 28],
              cy: [148 + (i % 3) * 12, 160 + (i % 3) * 10, 175 + (i % 3) * 8],
              r: [3, 9 + i, 18 + i],
              fillOpacity: [0, 0.45, 0],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.35,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Leaf — turning pale */}
        <motion.path
          d={leafPath(150, 175, 65, 85)}
          fill={leafFill}
          stroke="#d9f99d"
          strokeWidth="1.5"
          animate={{ fill: progress > 0.6 ? "#fef9c3" : progress > 0.3 ? "#d9f99d" : "#86efac" }}
          transition={{ duration: 1.5 }}
        />
        <LeafVeins cx={150} cy={175} color="#854d0e" opacity={0.25} />

        {/* Green swirls leaving leaf */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${148 + i * 4},${165} Q${120 - i * 8},${180 + i * 5} ${90 + i * 10},${200}`}
            fill="none"
            stroke={green}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeOpacity={0.8}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </g>

      {/* Steam */}
      <Steam x={130} y={83} delay={0} />
      <Steam x={165} y={83} delay={0.9} />

      <text x={150} y={294} textAnchor="middle" fontSize="12" fontWeight="600" fill="#15803d" fontFamily="var(--font-heading)">
        Chlorophyll Dissolving in Ethanol
      </text>
    </svg>
  );
}

/* ─── SVG: Step 3 — Rinsing ───────────────────────────────────────── */
export function RinsingSVG() {
  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <linearGradient id="rinseWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
        </linearGradient>
        <clipPath id="rinseClip">
          <rect x="80" y="110" width="140" height="130" rx="5" />
        </clipPath>
      </defs>

      {/* Petri dish base */}
      <ellipse cx={150} cy={255} rx={80} ry={14} fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <ellipse cx={150} cy={248} rx={80} ry={14} fill="none" stroke="#94a3b8" strokeWidth="2" />

      {/* Water in petri dish */}
      <ellipse cx={150} cy={248} rx={75} ry={10} fill="url(#rinseWater)" />

      {/* Leaf in petri dish */}
      <motion.path
        d={leafPath(150, 236, 75, 30)}
        fill="#fef9c3"
        stroke="#d9f99d"
        strokeWidth="1.5"
        animate={{ fill: ["#fef9c3", "#fef08a", "#fef9c3"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <LeafVeins cx={150} cy={236} color="#78716c" opacity={0.3} />

      {/* Water droplets from tap */}
      {[0, 1, 2, 3].map((i) => (
        <motion.ellipse
          key={i}
          cx={148 + (i % 2) * 6}
          rx={2}
          ry={4}
          fill="#7dd3fc"
          fillOpacity={0.8}
          initial={{ cy: 80, opacity: 0 }}
          animate={{ cy: [80, 200], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 0.8,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Tap */}
      <path d="M120,70 L180,70 L180,82 L165,82 L165,90 L155,90 L155,82 L145,82 L145,90 L135,90 L135,82 L120,82 Z"
        fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
      <rect x="136" y="55" width="18" height="16" rx="3" fill="#64748b" />

      {/* Ripples in petri dish */}
      {[0, 1].map((i) => (
        <motion.ellipse
          key={i}
          cx={150}
          cy={248}
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="1.5"
          strokeOpacity={0.5}
          initial={{ rx: 5, ry: 2, opacity: 0.8 }}
          animate={{ rx: [5, 40], ry: [2, 8], opacity: [0.7, 0] }}
          transition={{ duration: 1.5, delay: i * 0.7, repeat: Infinity }}
        />
      ))}

      <text x={150} y={275} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0369a1" fontFamily="var(--font-heading)">
        Rinsing in Warm Water
      </text>
    </svg>
  );
}

/* ─── SVG: Step 4 — Iodine Test (the payoff!) ─────────────────────── */
export function IodineSVG({ leafType = "healthy", revealed = false }) {
  const hasStarch = leafType !== "pale";
  const showBlack = revealed && hasStarch;
  const partialCoverage = leafType === "partial";

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <defs>
        <radialGradient id="starchGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#312e81" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="noStarchGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#92400e" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id="leafBg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
        <filter id="starchGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Petri dish */}
      <ellipse cx={150} cy={185} rx={115} ry={20} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      <ellipse cx={150} cy={175} rx={115} ry={20} fill="none" stroke="#cbd5e1" strokeWidth="2" />

      {/* Leaf base (pale yellow after decolorization) */}
      <path
        d={leafPath(150, 162, 100, 140)}
        fill="#fef9c3"
        stroke="#fde047"
        strokeWidth="1.5"
      />
      <path d={leafPath(150, 162, 100, 140)} fill="url(#leafBg)" />

      {/* Veins */}
      <LeafVeins cx={150} cy={162} color="#92400e" opacity={0.25} />

      {/* Starch revealed by iodine — spreading organically */}
      {showBlack && !partialCoverage && (
        <motion.path
          d={leafPath(150, 162, 100, 140)}
          fill="url(#starchGrad)"
          filter="url(#starchGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ transformOrigin: "150px 162px" }}
        />
      )}

      {/* Partial — only uncovered part turns blue-black */}
      {showBlack && partialCoverage && (
        <>
          {/* Bottom half has starch */}
          <motion.path
            d={`M150,162 C210,162 210,230 150,230 C90,230 90,162 150,162Z`}
            fill="url(#starchGrad)"
            filter="url(#starchGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ transformOrigin: "150px 196px" }}
          />
          {/* Top (covered) stays brown/orange */}
          <motion.path
            d={`M150,162 C210,162 210,94 150,94 C90,94 90,162 150,162Z`}
            fill="url(#noStarchGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
        </>
      )}

      {/* No starch leaf stays brownish */}
      {revealed && !hasStarch && (
        <motion.path
          d={leafPath(150, 162, 100, 140)}
          fill="url(#noStarchGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Veins remain visible on top */}
      {showBlack && (
        <LeafVeins cx={150} cy={162} color="#e0e7ff" opacity={0.3} />
      )}

      {/* Iodine dropper */}
      <motion.g
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dropper body */}
        <rect x="220" y="38" width="18" height="55" rx="9" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="229" cy="38" rx="9" ry="7" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        {/* Dropper tip */}
        <path d="M225,93 L229,108 L233,93" fill="#d97706" />

        {/* Iodine drop falling */}
        {revealed && (
          <motion.ellipse
            cx={229}
            ry={5}
            rx={3}
            fill="#92400e"
            fillOpacity={0.9}
            initial={{ cy: 112, opacity: 0 }}
            animate={{ cy: [112, 145], opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, repeat: revealed ? 3 : 0, delay: 0.2 }}
          />
        )}
        <text x="229" y="74" textAnchor="middle" fontSize="7" fill="#92400e" fontWeight="600" fontFamily="var(--font-body)">I₂</text>
      </motion.g>

      {/* Spreading iodine animation on leaf surface */}
      {revealed && hasStarch && (
        [0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={138 + i * 8}
            cy={158 + (i % 2) * 10}
            fill="#312e81"
            fillOpacity={0}
            initial={{ r: 0, fillOpacity: 0 }}
            animate={{ r: [0, 12 + i * 8], fillOpacity: [0, 0.4, 0] }}
            transition={{
              duration: 1.8,
              delay: 0.5 + i * 0.3,
              ease: "easeOut",
            }}
          />
        ))
      )}

      {/* Result badge */}
      {revealed && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          <rect x="22" y="210" width="126" height="32" rx="8" fill={hasStarch ? "#1e1b4b" : "#78350f"} fillOpacity={0.9} />
          <text x="85" y="230" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="var(--font-heading)">
            {hasStarch ? "✓ Starch PRESENT" : "✗ No Starch"}
          </text>
        </motion.g>
      )}

      <text x={150} y={296} textAnchor="middle" fontSize="12" fontWeight="600" fill="#92400e" fontFamily="var(--font-heading)">
        Iodine Test Result
      </text>
    </svg>
  );
}

/* ─── SVG: Intro overview ─────────────────────────────────────────── */
export function StarchIntroSVG() {
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id="introLeafGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sun */}
      <motion.circle
        cx={240} cy={50} r={28}
        fill="url(#sunGrad)"
        animate={{ r: [28, 32, 28] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.line
            key={i}
            x1={240 + 32 * Math.cos(rad)}
            y1={50 + 32 * Math.sin(rad)}
            x2={240 + 44 * Math.cos(rad)}
            y2={50 + 44 * Math.sin(rad)}
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
          />
        );
      })}

      {/* Leaf */}
      <path d={leafPath(120, 140, 88, 115)} fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
      <path d={leafPath(120, 140, 88, 115)} fill="url(#introLeafGrad)" />
      <LeafVeins cx={120} cy={140} color="#14532d" opacity={0.4} />

      {/* Photosynthesis arrow — Sun to Leaf */}
      <motion.path
        d="M218,62 Q185,80 165,110"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
      />

      {/* Starch granules inside leaf */}
      {[[100, 135], [120, 128], [135, 148], [110, 155], [128, 162]].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r={5}
          fill="#312e81"
          fillOpacity={0}
          animate={{ fillOpacity: [0, 0.55, 0.55, 0] }}
          transition={{ duration: 3, delay: 1.2 + i * 0.3, repeat: Infinity, repeatDelay: 0.5 }}
        />
      ))}

      {/* Iodine bottle */}
      <rect x="220" y="150" width="30" height="55" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
      <rect x="226" y="142" width="18" height="12" rx="4" fill="#d97706" />
      <text x="235" y="182" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="700" fontFamily="var(--font-body)">I₂</text>

      {/* Arrow from iodine to leaf */}
      <motion.path
        d="M220,180 Q185,180 168,160"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
      />

      <text x={150} y={248} textAnchor="middle" fontSize="11" fontWeight="600" fill="#15803d" fontFamily="var(--font-heading)">
        Sunlight → Photosynthesis → Starch → Iodine Reveals It
      </text>
    </svg>
  );
}
