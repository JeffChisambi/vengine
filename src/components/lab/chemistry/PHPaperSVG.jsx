import React from "react";
import { motion } from "framer-motion";

const phColors = [
  "#ef4444", // pH 1
  "#f97316", // pH 2
  "#fb923c", // pH 3
  "#fbbf24", // pH 4
  "#facc15", // pH 5
  "#a3e635", // pH 6
  "#4ade80", // pH 7 (neutral)
  "#34d399", // pH 8
  "#22d3ee", // pH 9
  "#38bdf8", // pH 10
  "#60a5fa", // pH 11
  "#818cf8", // pH 12
  "#a78bfa", // pH 13
  "#c084fc", // pH 14
];

export default function PHPaperSVG({ ph = 7, dipped = false, glow = false }) {
  const clampedPH = Math.max(1, Math.min(14, Math.round(ph)));
  const stripColor = phColors[clampedPH - 1];
  const isNeutral = clampedPH === 7;

  return (
    <svg
      viewBox="0 0 240 320"
      className="w-full h-full max-h-[320px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 14px ${stripColor}66)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="phpBook" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="35%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>

      {/* pH book / dispenser */}
      <rect
        x="68"
        y="30"
        width="104"
        height="62"
        rx="5"
        fill="url(#phpBook)"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      <rect
        x="70"
        y="32"
        width="100"
        height="10"
        rx="3"
        fill="#4b5563"
        opacity="0.4"
      />
      {/* Book label */}
      <rect
        x="76"
        y="48"
        width="88"
        height="36"
        rx="3"
        fill="#fef3c7"
        stroke="#fbbf24"
        strokeWidth="1"
      />
      <text
        x="120"
        y="63"
        textAnchor="middle"
        fontSize="9"
        fontWeight="800"
        fill="#92400e"
      >
        pH PAPER
      </text>
      <text
        x="120"
        y="76"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        fill="#b45309"
      >
        UNIVERSAL
      </text>
      {/* Tear-off slot */}
      <rect x="110" y="91" width="20" height="4" rx="1" fill="#1f2937" />

      {/* pH colour reference chart on side */}
      <rect
        x="175"
        y="30"
        width="16"
        height="62"
        rx="3"
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      {phColors.slice(0, 7).map((c, i) => (
        <rect key={i} x="176" y={31 + i * 8.5} width="14" height="8" fill={c} />
      ))}
      {phColors.slice(7, 14).map((c, i) => (
        <rect
          key={i + 7}
          x="176"
          y={31 + (i + 7) * 8.5}
          width="14"
          height="8"
          fill={c}
        />
      ))}

      {/* Paper strip */}
      <motion.g
        animate={dipped ? { y: 30 } : { y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
      >
        {/* Strip body — white/cream paper */}
        <rect
          x="110"
          y="92"
          width="20"
          height="140"
          rx="2"
          fill="#fafaf9"
          stroke="#d1d5db"
          strokeWidth="1"
        />
        {/* Reactive zone (bottom portion changes colour) */}
        <rect
          x="110"
          y="182"
          width="20"
          height="50"
          rx="2"
          fill={dipped ? stripColor : "#f5f5f4"}
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
        {/* Wetness sheen when dipped */}
        {dipped && (
          <motion.rect
            x="110"
            y="182"
            width="20"
            height="50"
            rx="2"
            fill="#ffffff"
            fillOpacity="0.2"
            animate={{ fillOpacity: [0.25, 0.05, 0.25] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        {/* Paper texture lines */}
        {[110, 122, 134, 146, 158, 170].map((y) => (
          <line
            key={y}
            x1="112"
            y1={y}
            x2="128"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}
        {/* pH reading label on strip */}
        {dipped && (
          <motion.text
            x="120"
            y="215"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={
              clampedPH <= 6
                ? "#7f1d1d"
                : clampedPH >= 8
                  ? "#1e3a8a"
                  : "#14532d"
            }
            animate={{ opacity: [0, 1] }}
            transition={{ delay: 0.4 }}
          >
            {clampedPH}
          </motion.text>
        )}
      </motion.g>

      {/* pH scale legend */}
      {phColors.map((c, i) => (
        <g key={i}>
          <rect
            x={24 + i * 13.5}
            y="258"
            width="12"
            height="20"
            rx="1"
            fill={c}
            stroke="#e2e8f0"
            strokeWidth="0.4"
          />
          {(i === 0 || i === 6 || i === 13) && (
            <text
              x={30 + i * 13.5}
              y="290"
              textAnchor="middle"
              fontSize="7"
              fill="#475569"
            >
              {i + 1}
            </text>
          )}
        </g>
      ))}
      {/* Acid / Neutral / Alkali labels */}
      <text
        x="48"
        y="302"
        textAnchor="middle"
        fontSize="7"
        fill="#dc2626"
        fontWeight="600"
      >
        ACID
      </text>
      <text
        x="120"
        y="302"
        textAnchor="middle"
        fontSize="7"
        fill="#16a34a"
        fontWeight="600"
      >
        NEUTRAL
      </text>
      <text
        x="192"
        y="302"
        textAnchor="middle"
        fontSize="7"
        fill="#2563eb"
        fontWeight="600"
      >
        ALKALI
      </text>

      {/* Label */}
      <text
        x="120"
        y="316"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        pH Paper Strip
      </text>
    </svg>
  );
}
