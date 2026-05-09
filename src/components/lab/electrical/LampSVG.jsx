import React from "react";
import { motion } from "framer-motion";

export default function LampSVG({
  on = true,
  color = "#fbbf24",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter:
          on || glow
            ? `drop-shadow(0 0 18px rgba(251,191,36,0.5))`
            : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="bulbGlowGrad" cx="50%" cy="40%" r="55%">
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity={on ? "0.55" : "0.05"}
          />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bulbGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>

      {/* Ambient glow */}
      {on && (
        <motion.circle
          cx="110"
          cy="118"
          r="72"
          fill={color}
          fillOpacity="0.12"
          animate={{ r: [70, 80, 70], fillOpacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <ellipse
        cx="110"
        cy="284"
        rx="38"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── BULB (globe shape) ── */}
      <circle
        cx="110"
        cy="112"
        r="68"
        fill="url(#bulbGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Internal glow fill */}
      <circle cx="110" cy="108" r="65" fill="url(#bulbGlowGrad)" />

      {/* ── FILAMENT ── */}
      <motion.path
        d="M 97 132 L 97 118 Q 97 110 104 110 Q 111 110 111 118 Q 111 126 118 126 Q 125 126 125 118 Q 125 110 118 110"
        fill="none"
        stroke={on ? "#ffffff" : "#94a3b8"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={on ? { opacity: [0.85, 1, 0.85] } : { opacity: 0.3 }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
      {/* Filament support wires */}
      <line
        x1="97"
        y1="132"
        x2="97"
        y2="145"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line
        x1="118"
        y1="110"
        x2="118"
        y2="145"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Support bridge */}
      <line
        x1="97"
        y1="145"
        x2="118"
        y2="145"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Glass highlight */}
      <path
        d="M 68 90 Q 58 115 66 145"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* ── NECK ── */}
      <path
        d="M 88 176 L 92 192 L 128 192 L 132 176 Q 110 162 88 176 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Pinch line */}
      <line
        x1="90"
        y1="180"
        x2="130"
        y2="180"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* ── SCREW BASE (Edison E27) ── */}
      {/* Base cylinder */}
      <rect
        x="90"
        y="192"
        width="40"
        height="52"
        rx="4"
        fill="url(#baseGrad)"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Screw threads */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M 90 ${196 + i * 7} Q 110 ${193 + i * 7} 130 ${196 + i * 7}`}
          fill="none"
          stroke="#475569"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}
      {/* Base contact tip */}
      <ellipse
        cx="110"
        cy="244"
        rx="14"
        ry="4"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />
      <circle cx="110" cy="244" r="5" fill="#64748b" />

      <text
        x="110"
        y="270"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Lamp (Bulb)
      </text>
    </svg>
  );
}
