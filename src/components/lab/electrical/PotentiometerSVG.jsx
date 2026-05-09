import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PotentiometerSVG({ position = 0.5, glow = false }) {
  const [pos, setPos] = useState(position);
  const dialAngle = pos * 270 - 135;

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(99,102,241,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="potBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <radialGradient id="potFace" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <linearGradient id="potTrack" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="52"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── CYLINDRICAL BODY ── */}
      <circle
        cx="110"
        cy="132"
        r="70"
        fill="url(#potBody)"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <circle
        cx="110"
        cy="132"
        r="66"
        fill="none"
        stroke="#475569"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* ── RESISTIVE TRACK (visible arc) ── */}
      <path
        d="M 55 170 A 60 60 0 1 1 165 170"
        fill="none"
        stroke="url(#potTrack)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Track highlight */}
      <path
        d="M 58 168 A 57 57 0 1 1 162 168"
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        opacity="0.3"
        strokeLinecap="round"
      />

      {/* Scale markings around the track */}
      {Array.from({ length: 11 }, (_, i) => {
        const angle = (i / 10) * 270 - 135;
        const rad = ((angle - 90) * Math.PI) / 180;
        const isMajor = i % 2 === 0;
        const r1 = isMajor ? 55 : 58;
        return (
          <g key={i}>
            <line
              x1={110 + r1 * Math.cos(rad)}
              y1={132 + r1 * Math.sin(rad)}
              x2={110 + 63 * Math.cos(rad)}
              y2={132 + 63 * Math.sin(rad)}
              stroke="#94a3b8"
              strokeWidth={isMajor ? 1.5 : 0.8}
            />
            {isMajor && (
              <text
                x={110 + 48 * Math.cos(rad)}
                y={132 + 48 * Math.sin(rad) + 3}
                textAnchor="middle"
                fontSize="7"
                fill="#94a3b8"
                fontWeight="600"
              >
                {i}
              </text>
            )}
          </g>
        );
      })}

      {/* ── KNOB FACE ── */}
      <circle
        cx="110"
        cy="132"
        r="38"
        fill="url(#potFace)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Knurling lines on knob edge */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * 360;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={110 + 34 * Math.cos(rad)}
            y1={132 + 34 * Math.sin(rad)}
            x2={110 + 38 * Math.cos(rad)}
            y2={132 + 38 * Math.sin(rad)}
            stroke="#94a3b8"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      {/* Pointer line */}
      <motion.line
        x1="110"
        y1="132"
        animate={{
          x2: 110 + 32 * Math.cos(((dialAngle - 90) * Math.PI) / 180),
          y2: 132 + 32 * Math.sin(((dialAngle - 90) * Math.PI) / 180),
        }}
        stroke="#1e293b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="110" cy="132" r="5" fill="#1e293b" />
      <circle cx="110" cy="132" r="2.5" fill="#94a3b8" />

      {/* ── THREE TERMINALS ── */}
      {/* Terminal 1 (left) */}
      <rect
        x="42"
        y="210"
        width="12"
        height="28"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <rect x="45" y="236" width="6" height="14" rx="2" fill="#64748b" />
      <text
        x="48"
        y="260"
        textAnchor="middle"
        fontSize="7"
        fill="#64748b"
        fontWeight="600"
      >
        1
      </text>

      {/* Wiper terminal (center) */}
      <rect
        x="104"
        y="210"
        width="12"
        height="28"
        rx="3"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      <rect x="107" y="236" width="6" height="14" rx="2" fill="#d97706" />
      <text
        x="110"
        y="260"
        textAnchor="middle"
        fontSize="7"
        fill="#d97706"
        fontWeight="600"
      >
        W
      </text>

      {/* Terminal 3 (right) */}
      <rect
        x="166"
        y="210"
        width="12"
        height="28"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <rect x="169" y="236" width="6" height="14" rx="2" fill="#64748b" />
      <text
        x="172"
        y="260"
        textAnchor="middle"
        fontSize="7"
        fill="#64748b"
        fontWeight="600"
      >
        3
      </text>

      {/* Value label */}
      <text x="110" y="270" textAnchor="middle" fontSize="9" fill="#64748b">
        10 kΩ
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
        Potentiometer
      </text>
    </svg>
  );
}
