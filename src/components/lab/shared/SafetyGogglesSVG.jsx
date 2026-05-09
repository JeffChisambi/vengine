import React from "react";
import { motion } from "framer-motion";

export default function SafetyGogglesSVG({ worn = false, glow = false }) {
  return (
    <svg
      viewBox="0 0 280 240"
      className="w-full h-full max-h-[240px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(56,189,248,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        {/* Lens gradients */}
        <linearGradient id="sgLensLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="sgLensRight" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="sgFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="sgBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        {/* Vent gradient */}
        <linearGradient id="sgVent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* ── Head band / strap ── */}
      {/* Left strap */}
      <path
        d="M 52 110 Q 28 112 18 118 Q 10 124 12 134 Q 14 144 26 146 Q 38 148 54 144"
        fill="none"
        stroke="url(#sgBand)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 52 110 Q 28 112 18 118 Q 10 124 12 134 Q 14 144 26 146 Q 38 148 54 144"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.2"
      />
      {/* Right strap */}
      <path
        d="M 228 110 Q 252 112 262 118 Q 270 124 268 134 Q 266 144 254 146 Q 242 148 226 144"
        fill="none"
        stroke="url(#sgBand)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M 228 110 Q 252 112 262 118 Q 270 124 268 134 Q 266 144 254 146 Q 242 148 226 144"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* ── Main frame / face seal (soft rubber surround) ── */}
      {/* This is the outer contoured shield frame */}
      <path
        d={`
          M 52 88
          Q 50 70 68 62
          Q 90 54 120 56
          Q 132 57 140 60
          Q 148 57 160 56
          Q 190 54 212 62
          Q 230 70 228 88
          Q 226 108 216 122
          Q 206 138 192 144
          Q 170 152 140 152
          Q 110 152 88 144
          Q 74 138 64 122
          Q 54 108 52 88
          Z
        `}
        fill="url(#sgFrame)"
        stroke="#0f172a"
        strokeWidth="2"
      />

      {/* Inner frame recess (rubber face seal lip) */}
      <path
        d={`
          M 58 90
          Q 57 74 72 68
          Q 92 61 120 63
          Q 132 64 140 67
          Q 148 64 160 63
          Q 188 61 208 68
          Q 223 74 222 90
          Q 220 108 210 120
          Q 200 134 186 140
          Q 166 147 140 147
          Q 114 147 94 140
          Q 80 134 70 120
          Q 60 108 58 90
          Z
        `}
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* ── Bridge (nose piece) ── */}
      <path
        d="M 118 97 Q 132 108 140 110 Q 148 108 162 97"
        fill="none"
        stroke="#0f172a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 118 97 Q 132 108 140 110 Q 148 108 162 97"
        fill="none"
        stroke="#64748b"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* ── Left lens ── */}
      <ellipse
        cx="92"
        cy="100"
        rx="44"
        ry="34"
        fill="url(#sgLensLeft)"
        stroke="#0ea5e9"
        strokeWidth="2.5"
      />
      {/* Left lens inner frame ring */}
      <ellipse
        cx="92"
        cy="100"
        rx="44"
        ry="34"
        fill="none"
        stroke="#1e293b"
        strokeWidth="4"
      />
      {/* Left lens reflection 1 */}
      <ellipse
        cx="76"
        cy="86"
        rx="12"
        ry="7"
        fill="#ffffff"
        fillOpacity="0.28"
        transform="rotate(-25, 76, 86)"
      />
      {/* Left lens reflection 2 */}
      <ellipse
        cx="104"
        cy="82"
        rx="5"
        ry="3"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="rotate(-20, 104, 82)"
      />

      {/* ── Right lens ── */}
      <ellipse
        cx="188"
        cy="100"
        rx="44"
        ry="34"
        fill="url(#sgLensRight)"
        stroke="#0ea5e9"
        strokeWidth="2.5"
      />
      <ellipse
        cx="188"
        cy="100"
        rx="44"
        ry="34"
        fill="none"
        stroke="#1e293b"
        strokeWidth="4"
      />
      {/* Right lens reflection */}
      <ellipse
        cx="172"
        cy="86"
        rx="12"
        ry="7"
        fill="#ffffff"
        fillOpacity="0.28"
        transform="rotate(-25, 172, 86)"
      />
      <ellipse
        cx="200"
        cy="82"
        rx="5"
        ry="3"
        fill="#ffffff"
        fillOpacity="0.18"
        transform="rotate(-20, 200, 82)"
      />

      {/* ── Side vents (indirect ventilation slots) ── */}
      {/* Left side vents */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`lv${i}`}
          x="50"
          y={84 + i * 10}
          width="9"
          height="5"
          rx="1"
          fill="url(#sgVent)"
          stroke="#334155"
          strokeWidth="0.8"
          transform={`rotate(-10, 54, ${86 + i * 10})`}
        />
      ))}
      {/* Right side vents */}
      {[0, 1, 2].map((i) => (
        <rect
          key={`rv${i}`}
          x="221"
          y={84 + i * 10}
          width="9"
          height="5"
          rx="1"
          fill="url(#sgVent)"
          stroke="#334155"
          strokeWidth="0.8"
          transform={`rotate(10, 226, ${86 + i * 10})`}
        />
      ))}

      {/* Top brow vents */}
      {[-16, -6, 4, 14].map((offset, i) => (
        <rect
          key={`tv${i}`}
          x={136 + offset}
          y="56"
          width="7"
          height="4"
          rx="1"
          fill="url(#sgVent)"
          stroke="#334155"
          strokeWidth="0.5"
        />
      ))}

      {/* Anti-fog indicator dot */}
      <circle
        cx="140"
        cy="152"
        r="4"
        fill="#22c55e"
        stroke="#16a34a"
        strokeWidth="1"
      />

      {/* "worn" glow animation */}
      {worn && (
        <motion.ellipse
          cx="140"
          cy="100"
          rx="110"
          ry="60"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          animate={{ opacity: [0.2, 0.6, 0.2], strokeWidth: [1.5, 3, 1.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Label */}
      <text
        x="140"
        y="218"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Safety Goggles
      </text>
    </svg>
  );
}
