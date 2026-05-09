import React from "react";
import { motion } from "framer-motion";

export default function ResonanceTubeSVG({
  waterLevel = 0.4,
  resonating = false,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="rtGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="rtWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
        </linearGradient>
        <clipPath id="rtClip">
          <rect x="76" y="28" width="46" height="230" />
        </clipPath>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="40"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── OUTER TUBE (water reservoir) ── */}
      <rect
        x="68"
        y="28"
        width="62"
        height="240"
        rx="5"
        fill="url(#rtGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <ellipse
        cx="99"
        cy="28"
        rx="31"
        ry="6"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Water in reservoir */}
      <g clipPath="url(#rtClip)">
        <motion.rect
          x="77"
          width="44"
          fill="url(#rtWaterGrad)"
          initial={{ y: 258, height: 0 }}
          animate={{ y: 258 - waterLevel * 220, height: waterLevel * 220 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </g>

      {/* ── INNER RESONANCE TUBE (narrow, sits inside) ── */}
      <rect
        x="88"
        y="15"
        width="24"
        height="255"
        rx="3"
        fill="url(#rtGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="100"
        cy="15"
        rx="12"
        ry="3.5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* ── TUNING FORK above tube ── */}
      <line x1="100" y1="5" x2="100" y2="15" stroke="#64748b" strokeWidth="2" />
      {/* Fork tines */}
      <motion.path
        d="M 88 -10 Q 88 -2 92 2 L 92 12"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
        animate={
          resonating
            ? {
                d: [
                  "M 88 -10 Q 88 -2 92 2 L 92 12",
                  "M 85 -10 Q 85 -2 92 2 L 92 12",
                  "M 88 -10 Q 88 -2 92 2 L 92 12",
                ],
              }
            : {}
        }
        transition={{ duration: 0.15, repeat: Infinity }}
      />
      <motion.path
        d="M 112 -10 Q 112 -2 108 2 L 108 12"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
        animate={
          resonating
            ? {
                d: [
                  "M 112 -10 Q 112 -2 108 2 L 108 12",
                  "M 115 -10 Q 115 -2 108 2 L 108 12",
                  "M 112 -10 Q 112 -2 108 2 L 108 12",
                ],
              }
            : {}
        }
        transition={{ duration: 0.15, repeat: Infinity }}
      />
      <line
        x1="92"
        y1="5"
        x2="108"
        y2="5"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ── STANDING WAVE nodes/antinodes ── */}
      {resonating && (
        <g opacity="0.35">
          {[0.15, 0.45, 0.75].map((pos, i) => (
            <motion.ellipse
              key={i}
              cx="100"
              cy={258 - waterLevel * 220 - pos * (258 - waterLevel * 220 - 18)}
              rx="8"
              ry="3"
              fill="#fbbf24"
              animate={{ rx: [8, 13, 8], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </g>
      )}

      {/* Ruler marks on tube */}
      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((m, i) => (
        <g key={i}>
          <line
            x1="112"
            y1={28 + m * 240}
            x2={i % 2 === 0 ? 122 : 117}
            y2={28 + m * 240}
            stroke="#64748b"
            strokeWidth="0.8"
          />
          {i % 2 === 0 && (
            <text x="125" y={28 + m * 240 + 3} fontSize="7" fill="#64748b">
              {(m * 100).toFixed(0)}
            </text>
          )}
        </g>
      ))}
      <text x="138" y="196" fontSize="7" fill="#64748b">
        cm
      </text>

      {/* Highlight */}
      <line
        x1="73"
        y1="34"
        x2="73"
        y2="255"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.2"
        strokeLinecap="round"
      />

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Resonance Tube
      </text>
    </svg>
  );
}
