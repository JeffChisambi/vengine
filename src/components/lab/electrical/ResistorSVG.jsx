import React from "react";
import { motion } from "framer-motion";

// Color band codes
const BAND_COLORS = {
  0: "#000000",
  1: "#8B4513",
  2: "#ef4444",
  3: "#f97316",
  4: "#fbbf24",
  5: "#22c55e",
  6: "#3b82f6",
  7: "#8b5cf6",
  8: "#94a3b8",
  9: "#ffffff",
};

export default function ResistorSVG({ bands = [2, 2, 4, 1], glow = false }) {
  // bands: [d1, d2, multiplier, tolerance]
  const tolColor = ["#d4af37", "#94a3b8"]; // gold, silver
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
        <linearGradient id="resBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a76a" />
          <stop offset="30%" stopColor="#c8956a" />
          <stop offset="70%" stopColor="#b8763a" />
          <stop offset="100%" stopColor="#8b5e3c" />
        </linearGradient>
        <linearGradient id="resLead" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="60"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── LEADS ── */}
      <rect x="18" y="148" width="56" height="5" rx="2" fill="url(#resLead)" />
      <rect x="146" y="148" width="56" height="5" rx="2" fill="url(#resLead)" />

      {/* Lead bends going down to PCB pads */}
      <path
        d="M 18 150 Q 14 150 14 158 L 14 190"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 202 150 Q 206 150 206 158 L 206 190"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* ── CERAMIC BODY ── */}
      <rect
        x="74"
        y="118"
        width="72"
        height="66"
        rx="10"
        fill="url(#resBody)"
        stroke="#8b5e3c"
        strokeWidth="1.5"
      />

      {/* Body end caps (metallic) */}
      <rect
        x="74"
        y="118"
        width="12"
        height="66"
        rx="10"
        fill="#c0c0c0"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x="134"
        y="118"
        width="12"
        height="66"
        rx="10"
        fill="#c0c0c0"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* ── COLOR BANDS ── */}
      {bands.slice(0, 3).map((band, i) => (
        <rect
          key={i}
          x={88 + i * 11}
          y="118"
          width="7"
          height="66"
          fill={BAND_COLORS[band]}
          opacity="0.92"
        />
      ))}
      {/* Tolerance band (spaced away) */}
      <rect
        x="130"
        y="118"
        width="7"
        height="66"
        fill={tolColor[bands[3] ?? 1]}
        opacity="0.92"
      />

      {/* Body highlight */}
      <rect
        x="76"
        y="122"
        width="68"
        height="8"
        rx="4"
        fill="#ffffff"
        opacity="0.18"
      />
      <line
        x1="76"
        y1="128"
        x2="76"
        y2="178"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.1"
        strokeLinecap="round"
      />

      {/* Resistance value label */}
      <text
        x="110"
        y="108"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#92400e"
      >
        2.2 kΩ
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
        Resistor
      </text>
    </svg>
  );
}
