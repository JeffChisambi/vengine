import React from "react";
import { motion } from "framer-motion";

export default function ElectronicBalanceSVG({
  mass = 125.47,
  unit = "g",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 260 280"
      className="w-full h-full max-h-[280px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(34,211,238,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="ebBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="ebPan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="40%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="130"
        cy="255"
        rx="90"
        ry="9"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Base body */}
      <rect
        x="20"
        y="155"
        width="220"
        height="90"
        rx="10"
        fill="url(#ebBody)"
        stroke="#0f172a"
        strokeWidth="2"
      />
      {/* Body top bevel */}
      <rect
        x="22"
        y="157"
        width="216"
        height="8"
        rx="5"
        fill="#475569"
        opacity="0.4"
      />

      {/* Side profile slope (slanted front) */}
      <path
        d="M 20 165 L 20 200 Q 20 245 35 245 L 225 245 Q 240 245 240 200 L 240 165 Z"
        fill="none"
      />

      {/* Display panel */}
      <rect
        x="30"
        y="165"
        width="140"
        height="68"
        rx="6"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1"
      />
      <rect x="31" y="166" width="138" height="66" rx="5" fill="#022c22" />

      {/* Main reading */}
      <text
        x="100"
        y="206"
        textAnchor="middle"
        fontSize="30"
        fontWeight="900"
        fill="#22d3ee"
        fontFamily="monospace"
        letterSpacing="2"
      >
        {mass.toFixed(2)}
      </text>
      <text
        x="155"
        y="206"
        fontSize="11"
        fontWeight="600"
        fill="#6ee7b7"
        fontFamily="monospace"
      >
        {unit}
      </text>

      {/* Stable indicator */}
      <motion.circle
        cx="45"
        cy="185"
        r="4"
        fill="#22c55e"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="55" y="188" fontSize="7" fill="#4ade80" fontFamily="monospace">
        STABLE
      </text>

      {/* MIN/MAX line */}
      <line
        x1="32"
        y1="220"
        x2="168"
        y2="220"
        stroke="#164e63"
        strokeWidth="0.8"
      />
      <text
        x="38"
        y="230"
        fontSize="7"
        fill="#22d3ee"
        fontFamily="monospace"
        opacity="0.5"
      >
        NET: {mass.toFixed(2)} g
      </text>

      {/* Buttons right side */}
      <rect
        x="180"
        y="168"
        width="50"
        height="14"
        rx="4"
        fill="#0284c7"
        stroke="#075985"
        strokeWidth="1"
      />
      <text
        x="205"
        y="178"
        textAnchor="middle"
        fontSize="7"
        fontWeight="600"
        fill="#fff"
      >
        TARE
      </text>

      <rect
        x="180"
        y="188"
        width="50"
        height="14"
        rx="4"
        fill="#374151"
        stroke="#475569"
        strokeWidth="1"
      />
      <text x="205" y="198" textAnchor="middle" fontSize="7" fill="#9ca3af">
        MODE
      </text>

      <rect
        x="180"
        y="208"
        width="50"
        height="14"
        rx="4"
        fill="#374151"
        stroke="#475569"
        strokeWidth="1"
      />
      <text x="205" y="218" textAnchor="middle" fontSize="7" fill="#9ca3af">
        PRINT
      </text>

      {/* Weighing pan column */}
      <rect
        x="110"
        y="95"
        width="40"
        height="65"
        rx="2"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />
      <rect x="112" y="97" width="5" height="61" fill="#64748b" opacity="0.2" />

      {/* Pan */}
      <ellipse
        cx="130"
        cy="95"
        rx="58"
        ry="9"
        fill="url(#ebPan)"
        stroke="#9ca3af"
        strokeWidth="1.5"
      />
      {/* Pan surface */}
      <ellipse cx="130" cy="93" rx="54" ry="7" fill="#f9fafb" opacity="0.35" />
      {/* Pan rim detail */}
      <ellipse
        cx="130"
        cy="95"
        rx="58"
        ry="9"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="0.5"
      />

      {/* Pan draft shield frame (partial) */}
      <line
        x1="75"
        y1="50"
        x2="75"
        y2="95"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
      />
      <line
        x1="185"
        y1="50"
        x2="185"
        y2="95"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
      />
      <line
        x1="75"
        y1="50"
        x2="185"
        y2="50"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
      />

      {/* Level bubble */}
      <circle
        cx="222"
        cy="175"
        r="8"
        fill="none"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <circle cx="222" cy="175" r="3" fill="#22c55e" opacity="0.8" />
      <text x="222" y="192" textAnchor="middle" fontSize="5.5" fill="#64748b">
        LEVEL
      </text>

      {/* Label */}
      <text
        x="130"
        y="270"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Electronic Balance
      </text>
    </svg>
  );
}
