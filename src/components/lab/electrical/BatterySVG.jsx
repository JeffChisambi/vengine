import React from "react";
import { motion } from "framer-motion";

export default function BatterySVG({ cells = 4, voltage = 6, glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(251,191,36,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="batBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="20%" stopColor="#334155" />
          <stop offset="80%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="batLabel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="batPole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="284"
        rx="48"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── BATTERY CASE ── */}
      <rect
        x="56"
        y="62"
        width="108"
        height="190"
        rx="8"
        fill="url(#batBody)"
        stroke="#0f172a"
        strokeWidth="2"
      />

      {/* Label band */}
      <rect x="58" y="100" width="104" height="110" fill="url(#batLabel)" />
      {/* Label text */}
      <text
        x="110"
        y="148"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#fbbf24"
        transform="rotate(-90,110,148)"
      >
        {voltage}V BATTERY
      </text>
      <text
        x="110"
        y="168"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="#fca5a5"
        transform="rotate(-90,110,168)"
      >
        Alkaline
      </text>

      {/* Cell dividers visible on side */}
      {Array.from({ length: cells - 1 }, (_, i) => (
        <line
          key={i}
          x1="56"
          y1={62 + ((i + 1) / cells) * 190}
          x2="164"
          y2={62 + ((i + 1) / cells) * 190}
          stroke="#0f172a"
          strokeWidth="1.5"
          opacity="0.4"
        />
      ))}

      {/* Bottom of case */}
      <ellipse
        cx="110"
        cy="252"
        rx="54"
        ry="10"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="1.5"
      />

      {/* ── POSITIVE TERMINAL (top, wide bump) ── */}
      <ellipse
        cx="110"
        cy="62"
        rx="54"
        ry="10"
        fill="#334155"
        stroke="#1e293b"
        strokeWidth="1.5"
      />
      {/* Positive pole */}
      <rect
        x="98"
        y="36"
        width="24"
        height="28"
        rx="8"
        fill="url(#batPole)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="110"
        cy="36"
        rx="12"
        ry="5"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* + marker */}
      <text
        x="110"
        y="52"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#dc2626"
      >
        +
      </text>

      {/* ── NEGATIVE TERMINAL (flat base plate) ── */}
      <rect
        x="76"
        y="256"
        width="68"
        height="10"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* − marker */}
      <text
        x="110"
        y="265"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#1e293b"
      >
        −
      </text>

      {/* Voltage label */}
      <text
        x="110"
        y="24"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#fbbf24"
      >
        {voltage} V
      </text>

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Battery
      </text>
    </svg>
  );
}
