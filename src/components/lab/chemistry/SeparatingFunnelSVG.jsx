import React from "react";
import { motion } from "framer-motion";

export default function SeparatingFunnelSVG({
  upperLiquidColor = "#fbbf24",
  lowerLiquidColor = "#38bdf8",
  upperLevel = 0.35,
  lowerLevel = 0.35,
  stopcockeOpen = false,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(251,191,36,0.25))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="sepGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="upperLiqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={upperLiquidColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={upperLiquidColor} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="lowerLiqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lowerLiquidColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={lowerLiquidColor} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="sepFunnelClip">
          <path d="M 90 50 L 90 55 L 60 220 L 60 240 Q 60 250 75 250 L 75 250 Q 75 250 75 250 L 120 250 Q 120 250 120 250 L 165 250 Q 180 250 180 240 L 180 220 L 150 55 L 150 50 Z" />
        </clipPath>
      </defs>

      {/* Ring stand */}
      <rect x="55" y="310" width="130" height="6" rx="2" fill="#94a3b8" />
      <rect x="117" y="55" width="6" height="258" fill="#94a3b8" rx="1" />
      {/* Ring clamp */}
      <path
        d="M 80 125 Q 80 118 120 118 Q 160 118 160 125"
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
      />
      <rect x="117" y="116" width="6" height="12" fill="#64748b" rx="1" />

      {/* ===== FUNNEL BODY (pear/globe shape) ===== */}
      <path
        d="
          M 100 50
          L 100 55
          L 68 225
          Q 65 245 85 250
          L 155 250
          Q 175 245 172 225
          L 140 55
          L 140 50
          Z
        "
        fill="url(#sepGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Top opening / stopper */}
      <ellipse
        cx="120"
        cy="50"
        rx="20"
        ry="6"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Glass stopper */}
      <ellipse
        cx="120"
        cy="44"
        rx="10"
        ry="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <rect
        x="117"
        y="36"
        width="6"
        height="9"
        rx="2"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Liquids */}
      <g clipPath="url(#sepFunnelClip)">
        {/* Lower (denser) liquid */}
        <motion.rect
          x="58"
          width="124"
          fill="url(#lowerLiqGrad)"
          initial={{ y: 250, height: 0 }}
          animate={{
            y: 250 - lowerLevel * 200,
            height: lowerLevel * 200,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Interface line */}
        <motion.line
          x1="60"
          x2="180"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="3 2"
          opacity="0.4"
          initial={{ y1: 250, y2: 250 }}
          animate={{
            y1: 250 - lowerLevel * 200,
            y2: 250 - lowerLevel * 200,
          }}
          transition={{ duration: 0.8 }}
        />

        {/* Upper (lighter) liquid */}
        <motion.rect
          x="58"
          width="124"
          fill="url(#upperLiqGrad)"
          initial={{ y: 250, height: 0 }}
          animate={{
            y: 250 - (lowerLevel + upperLevel) * 200,
            height: upperLevel * 200,
          }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
        />

        {/* Meniscus on upper */}
        <motion.ellipse
          cx="120"
          rx="40"
          ry="4"
          fill="#ffffff"
          fillOpacity="0.2"
          initial={{ cy: 250 }}
          animate={{ cy: 250 - (lowerLevel + upperLevel) * 200 + 2 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </g>

      {/* ===== STOPCOCK ===== */}
      <rect
        x="110"
        y="250"
        width="20"
        height="16"
        rx="2"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Stopcock handle */}
      <motion.rect
        x="97"
        y="255"
        width="46"
        height="6"
        rx="3"
        fill={stopcockeOpen ? "#22c55e" : "#ef4444"}
        stroke={stopcockeOpen ? "#16a34a" : "#dc2626"}
        strokeWidth="1"
        animate={{ rotate: stopcockeOpen ? 0 : 90 }}
        style={{ transformOrigin: "120px 258px" }}
        transition={{ duration: 0.3 }}
      />

      {/* Drain tube */}
      <rect
        x="115"
        y="266"
        width="10"
        height="30"
        fill="url(#sepGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Drain opening */}
      <ellipse
        cx="120"
        cy="296"
        rx="5"
        ry="2"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Dripping when open */}
      {stopcockeOpen && (
        <motion.circle
          cx="120"
          r="2.5"
          fill={lowerLiquidColor}
          fillOpacity="0.7"
          initial={{ cy: 296 }}
          animate={{ cy: [296, 320], opacity: [0.8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      {/* Glass highlight */}
      <path
        d="M 88 70 Q 78 130 74 200"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.18"
      />

      {/* Graduation marks */}
      {[0.2, 0.4, 0.6, 0.8].map((m, i) => {
        const y = 250 - m * 200;
        return (
          <g key={i}>
            <line
              x1="170"
              y1={y}
              x2="180"
              y2={y}
              stroke="#64748b"
              strokeWidth="0.8"
            />
            <text x="183" y={y + 3} fontSize="7" fill="#64748b">
              {(m * 250).toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="322"
        rx="55"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Label */}
      <text
        x="120"
        y="348"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Separating Funnel
      </text>
    </svg>
  );
}
