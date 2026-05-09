import React from "react";
import { motion } from "framer-motion";

export default function BunsenBurnerSVG({
  flameOn = true,
  flameIntensity = "medium",
  glow = false,
}) {
  const flameHeight =
    flameIntensity === "high" ? 65 : flameIntensity === "medium" ? 45 : 28;
  const flameColor =
    flameIntensity === "high"
      ? "#3b82f6"
      : flameIntensity === "medium"
        ? "#60a5fa"
        : "#fbbf24";
  const innerFlameColor =
    flameIntensity === "high"
      ? "#93c5fd"
      : flameIntensity === "medium"
        ? "#bfdbfe"
        : "#fef3c7";

  return (
    <svg
      viewBox="0 0 200 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 18px ${flameColor}55)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="burnerBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="35%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="burnerBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="35%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="0.5" cy="0.9" r="0.6">
          <stop offset="0%" stopColor={innerFlameColor} stopOpacity="0.9" />
          <stop offset="60%" stopColor={flameColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={flameColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="100"
        cy="330"
        rx="50"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Base - heavy hexagonal base */}
      <path
        d="M 50 305 L 50 290 Q 50 280 65 280 L 135 280 Q 150 280 150 290 L 150 305 Q 150 315 135 315 L 65 315 Q 50 315 50 305 Z"
        fill="url(#burnerBase)"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Base highlight */}
      <rect
        x="55"
        y="282"
        width="90"
        height="4"
        rx="2"
        fill="#94a3b8"
        opacity="0.3"
      />

      {/* Gas inlet tube (side) */}
      <path
        d="M 50 295 L 20 295 Q 15 295 15 290 L 15 280 Q 15 275 20 275 L 28 275"
        fill="none"
        stroke="#64748b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Gas nozzle */}
      <circle
        cx="15"
        cy="278"
        r="4"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Barrel / chimney tube */}
      <rect
        x="85"
        y="130"
        width="30"
        height="155"
        rx="3"
        fill="url(#burnerBody)"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Air hole collar */}
      <rect
        x="80"
        y="250"
        width="40"
        height="20"
        rx="4"
        fill="url(#burnerBase)"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Air holes */}
      <ellipse cx="85" cy="260" rx="3" ry="5" fill="#1e293b" />
      <ellipse cx="115" cy="260" rx="3" ry="5" fill="#1e293b" />

      {/* Barrel highlight */}
      <line
        x1="92"
        y1="140"
        x2="92"
        y2="275"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Top opening */}
      <ellipse
        cx="100"
        cy="130"
        rx="17"
        ry="5"
        fill="#475569"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Flame */}
      {flameOn && (
        <g>
          {/* Outer flame */}
          <motion.path
            d={`
              M 100 ${130 - flameHeight}
              Q 80 ${130 - flameHeight * 0.5} 85 128
              Q 92 125 100 128
              Q 108 125 115 128
              Q 120 ${130 - flameHeight * 0.5} 100 ${130 - flameHeight}
              Z
            `}
            fill="url(#flameGrad)"
            animate={{
              d: [
                `M 100 ${130 - flameHeight} Q 78 ${130 - flameHeight * 0.5} 84 128 Q 92 124 100 128 Q 108 124 116 128 Q 122 ${130 - flameHeight * 0.5} 100 ${130 - flameHeight} Z`,
                `M 100 ${130 - flameHeight - 5} Q 82 ${130 - flameHeight * 0.5} 86 128 Q 93 126 100 128 Q 107 126 114 128 Q 118 ${130 - flameHeight * 0.5} 100 ${130 - flameHeight - 5} Z`,
                `M 100 ${130 - flameHeight} Q 78 ${130 - flameHeight * 0.5} 84 128 Q 92 124 100 128 Q 108 124 116 128 Q 122 ${130 - flameHeight * 0.5} 100 ${130 - flameHeight} Z`,
              ],
            }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner flame (hotter core) */}
          <motion.path
            d={`
              M 100 ${130 - flameHeight * 0.55}
              Q 92 ${130 - flameHeight * 0.2} 94 129
              L 106 129
              Q 108 ${130 - flameHeight * 0.2} 100 ${130 - flameHeight * 0.55}
              Z
            `}
            fill={innerFlameColor}
            fillOpacity="0.8"
            animate={{
              d: [
                `M 100 ${130 - flameHeight * 0.55} Q 91 ${130 - flameHeight * 0.2} 93 129 L 107 129 Q 109 ${130 - flameHeight * 0.2} 100 ${130 - flameHeight * 0.55} Z`,
                `M 100 ${130 - flameHeight * 0.6} Q 93 ${130 - flameHeight * 0.2} 95 129 L 105 129 Q 107 ${130 - flameHeight * 0.2} 100 ${130 - flameHeight * 0.6} Z`,
                `M 100 ${130 - flameHeight * 0.55} Q 91 ${130 - flameHeight * 0.2} 93 129 L 107 129 Q 109 ${130 - flameHeight * 0.2} 100 ${130 - flameHeight * 0.55} Z`,
              ],
            }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Label */}
      <text
        x="100"
        y="350"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Bunsen Burner
      </text>
    </svg>
  );
}
