import React from "react";
import { motion } from "framer-motion";

export default function LitmusPaperSVG({
  type = "red",
  dipped = false,
  solution = "acid",
  glow = false,
}) {
  // Red litmus: stays red in acid, turns blue in alkali
  // Blue litmus: turns red in acid, stays blue in alkali
  const isBlueType = type === "blue";
  let resultColor;
  if (isBlueType) {
    resultColor = solution === "acid" ? "#ef4444" : "#3b82f6";
  } else {
    resultColor = solution === "alkali" ? "#3b82f6" : "#ef4444";
  }
  const baseColor = isBlueType ? "#3b82f6" : "#ef4444";
  const stripColor = dipped ? resultColor : baseColor;
  const changed =
    dipped &&
    ((isBlueType && solution === "acid") ||
      (!isBlueType && solution === "alkali"));

  return (
    <svg
      viewBox="0 0 260 320"
      className="w-full h-full max-h-[320px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 14px ${stripColor}55)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="lpBook" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={isBlueType ? "#1e3a8a" : "#7f1d1d"} />
          <stop offset="40%" stopColor={isBlueType ? "#3b82f6" : "#ef4444"} />
          <stop offset="100%" stopColor={isBlueType ? "#1e3a8a" : "#7f1d1d"} />
        </linearGradient>
      </defs>

      {/* Litmus book */}
      <rect
        x="72"
        y="28"
        width="116"
        height="65"
        rx="5"
        fill="url(#lpBook)"
        stroke={isBlueType ? "#1e40af" : "#991b1b"}
        strokeWidth="1.8"
      />
      {/* Book spine */}
      <rect
        x="72"
        y="28"
        width="12"
        height="65"
        rx="4"
        fill={isBlueType ? "#1e3a8a" : "#7f1d1d"}
      />
      {/* Book pages */}
      <rect
        x="84"
        y="32"
        width="100"
        height="57"
        rx="2"
        fill="#fafaf9"
        stroke="#e5e7eb"
        strokeWidth="0.5"
      />
      {/* Label on book */}
      <text
        x="134"
        y="52"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="800"
        fill={isBlueType ? "#1e3a8a" : "#991b1b"}
      >
        LITMUS
      </text>
      <text
        x="134"
        y="65"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        fill={isBlueType ? "#2563eb" : "#dc2626"}
      >
        {isBlueType ? "BLUE" : "RED"}
      </text>
      <text x="134" y="78" textAnchor="middle" fontSize="6.5" fill="#6b7280">
        PAPER
      </text>
      {/* Tear slot */}
      <rect
        x="124"
        y="92"
        width="12"
        height="4"
        rx="1"
        fill={isBlueType ? "#1e3a8a" : "#7f1d1d"}
        opacity="0.5"
      />

      {/* ── Multiple strips fanned out ── */}
      {[-1, 0, 1].map((offset) => (
        <g key={offset} transform={`rotate(${offset * 5}, 130, 92)`}>
          <rect
            x="124"
            y="92"
            width="12"
            height="120"
            rx="2"
            fill={offset === 0 ? "#fafaf9" : "#f5f5f4"}
            stroke="#d1d5db"
            strokeWidth={offset === 0 ? 1 : 0.5}
            opacity={offset === 0 ? 1 : 0.5}
          />
        </g>
      ))}

      {/* ── Main strip ── */}
      <rect
        x="124"
        y="92"
        width="12"
        height="120"
        rx="2"
        fill="#fafaf9"
        stroke="#d1d5db"
        strokeWidth="1"
      />

      {/* Dipped reactive zone */}
      <motion.rect
        x="124"
        y="172"
        width="12"
        height="40"
        rx="2"
        fill={dipped ? stripColor : baseColor}
        animate={dipped ? {} : { fill: baseColor }}
        transition={{ duration: 0.5 }}
      />

      {/* Wet sheen */}
      {dipped && (
        <motion.rect
          x="124"
          y="172"
          width="12"
          height="40"
          rx="2"
          fill="#ffffff"
          fillOpacity="0.2"
          animate={{ fillOpacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* Paper grain lines */}
      {[105, 115, 125, 135, 145, 155, 165].map((y) => (
        <line
          key={y}
          x1="126"
          y1={y}
          x2="134"
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      ))}

      {/* ── Solution beaker (below) ── */}
      <path
        d="M 96 228 L 88 272 Q 88 282 130 282 Q 172 282 172 272 L 164 228 Z"
        fill={
          dipped ? (solution === "acid" ? "#fee2e2" : "#dbeafe") : "#f0f9ff"
        }
        fillOpacity="0.4"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="130"
        cy="228"
        rx="34"
        ry="7"
        fill={
          dipped ? (solution === "acid" ? "#fee2e2" : "#dbeafe") : "#e0f2fe"
        }
        fillOpacity="0.6"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <text
        x="130"
        y="258"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill={solution === "acid" ? "#dc2626" : "#2563eb"}
      >
        {dipped ? (solution === "acid" ? "ACID" : "ALKALI") : ""}
      </text>

      {/* Result indicator */}
      {dipped && (
        <motion.g animate={{ opacity: [0, 1] }} transition={{ delay: 0.5 }}>
          <rect x="148" y="172" width="60" height="22" rx="4" fill="#0f172a" />
          <text
            x="178"
            y="187"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={changed ? "#4ade80" : "#f87171"}
            fontFamily="monospace"
          >
            {changed ? "CHANGED" : "NO CHANGE"}
          </text>
        </motion.g>
      )}

      {/* Type labels */}
      <text
        x="60"
        y="140"
        fontSize="8"
        fontWeight="600"
        fill={isBlueType ? "#2563eb" : "#dc2626"}
        textAnchor="middle"
        transform="rotate(-90,60,140)"
      >
        {isBlueType ? "BLUE LITMUS" : "RED LITMUS"}
      </text>

      {/* Label */}
      <text
        x="130"
        y="305"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Litmus Paper
      </text>
    </svg>
  );
}
