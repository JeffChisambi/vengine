import React from "react";
import { motion } from "framer-motion";

export default function PetriDishSVG({
  hasCulture = true,
  cultureColor = "#86efac",
  lidOn = true,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 260 200"
      className="w-full h-full max-h-[200px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 14px ${cultureColor}66)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="pdGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="pdAgar" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={cultureColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={cultureColor} stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="pdColony" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor={cultureColor} stopOpacity="0.3" />
        </radialGradient>
        <clipPath id="pdBaseClip">
          <ellipse cx="130" cy="130" rx="96" ry="28" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="130"
        cy="162"
        rx="100"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── BASE DISH ── */}
      {/* Base wall — side profile, shallow cylinder */}
      <path
        d="M 34 118 L 34 138 Q 34 158 130 158 Q 226 158 226 138 L 226 118 Z"
        fill="url(#pdGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Agar / culture medium */}
      {hasCulture && (
        <g clipPath="url(#pdBaseClip)">
          <ellipse cx="130" cy="125" rx="90" ry="22" fill="url(#pdAgar)" />
          {/* Colony spots */}
          {[
            { cx: 110, cy: 120, r: 9 },
            { cx: 148, cy: 118, r: 6 },
            { cx: 130, cy: 128, r: 7 },
            { cx: 162, cy: 125, r: 5 },
            { cx: 100, cy: 128, r: 4 },
            { cx: 140, cy: 110, r: 3 },
          ].map((c, i) => (
            <motion.circle
              key={i}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill="url(#pdColony)"
              stroke={cultureColor}
              strokeWidth="0.5"
              animate={{ r: [c.r, c.r * 1.05, c.r] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
            />
          ))}
        </g>
      )}

      {/* Base bottom */}
      <ellipse
        cx="130"
        cy="118"
        rx="96"
        ry="22"
        fill="url(#pdGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Base bottom highlight */}
      <ellipse
        cx="112"
        cy="114"
        rx="42"
        ry="9"
        fill="#ffffff"
        fillOpacity="0.18"
      />

      {/* ── LID ── sits slightly above and wider */}
      {lidOn && (
        <g>
          {/* Lid wall */}
          <path
            d="M 22 92 L 22 112 Q 22 130 130 130 Q 238 130 238 112 L 238 92 Z"
            fill="url(#pdGlass)"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          {/* Lid top ellipse */}
          <ellipse
            cx="130"
            cy="92"
            rx="108"
            ry="26"
            fill="url(#pdGlass)"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          {/* Lid highlight */}
          <ellipse
            cx="110"
            cy="87"
            rx="50"
            ry="10"
            fill="#ffffff"
            fillOpacity="0.2"
          />
          {/* Lid rim lip */}
          <path
            d="M 22 112 Q 22 128 130 128 Q 238 128 238 112"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      )}

      {/* Label */}
      <text
        x="130"
        y="186"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Petri Dish
      </text>
    </svg>
  );
}
