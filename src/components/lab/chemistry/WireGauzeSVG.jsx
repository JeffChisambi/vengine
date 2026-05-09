import React from "react";
import { motion } from "framer-motion";

export default function WireGauzeSVG({ heated = false, glow = false }) {
  const size = 140;
  const offsetX = 50;
  const offsetY = 90;
  const gridSpacing = 10;

  return (
    <svg
      viewBox="0 0 260 260"
      className="w-full h-full max-h-[260px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(251,146,60,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="wireFrame" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="130"
        cy="225"
        rx="75"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Outer frame */}
      <rect
        x={offsetX}
        y={offsetY}
        width={size + 20}
        height={size + 10}
        rx="3"
        fill="none"
        stroke="url(#wireFrame)"
        strokeWidth="5"
      />
      {/* Frame highlight */}
      <line
        x1={offsetX + 2}
        y1={offsetY + 2}
        x2={offsetX + size + 18}
        y2={offsetY + 2}
        stroke="#e2e8f0"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Wire mesh - horizontal lines */}
      {Array.from({ length: Math.floor(size / gridSpacing) + 1 }).map(
        (_, i) => {
          const y = offsetY + 5 + i * gridSpacing;
          return (
            <line
              key={`h-${i}`}
              x1={offsetX + 4}
              y1={y}
              x2={offsetX + size + 16}
              y2={y}
              stroke="#94a3b8"
              strokeWidth="0.8"
              opacity="0.6"
            />
          );
        },
      )}

      {/* Wire mesh - vertical lines */}
      {Array.from({ length: Math.floor((size + 20) / gridSpacing) + 1 }).map(
        (_, i) => {
          const x = offsetX + 4 + i * gridSpacing;
          return (
            <line
              key={`v-${i}`}
              x1={x}
              y1={offsetY + 4}
              x2={x}
              y2={offsetY + size + 6}
              stroke="#94a3b8"
              strokeWidth="0.8"
              opacity="0.6"
            />
          );
        },
      )}

      {/* Center ceramic/asbestos circle */}
      <circle
        cx={offsetX + size / 2 + 10}
        cy={offsetY + size / 2 + 5}
        r="32"
        fill="#e7e5e4"
        stroke="#a8a29e"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Heat glow on center */}
      {heated && (
        <motion.circle
          cx={offsetX + size / 2 + 10}
          cy={offsetY + size / 2 + 5}
          r="32"
          fill="#f97316"
          fillOpacity="0.15"
          animate={{ fillOpacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Label */}
      <text
        x="130"
        y="250"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Wire Gauze
      </text>
    </svg>
  );
}
