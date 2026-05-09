import React from "react";
import { motion } from "framer-motion";

export default function ScalpelSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.5))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="scalpelHandleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="35%" stopColor="#f1f5f9" />
          <stop offset="65%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="scalpelBladeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="scalpelEdgeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="285"
        rx="50"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.3"
      />

      {/* Transform entire scalpel to be at a slight angle for realism */}
      <g transform="rotate(-8, 110, 150)">
        {/* ===== HANDLE ===== */}
        {/* Handle body — flat, slightly tapered */}
        <path
          d="M 95 50 L 93 195 Q 93 200 97 200 L 123 200 Q 127 200 127 195 L 125 50 Z"
          fill="url(#scalpelHandleGrad)"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Handle knurling / grip lines (evenly spaced fine cross-hatching) */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="94"
            y1={55 + i * 6}
            x2="126"
            y2={55 + i * 6}
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.45"
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={96 + i * 6}
            y1="55"
            x2={96 + i * 6}
            y2="192"
            stroke="#94a3b8"
            strokeWidth="0.4"
            opacity="0.25"
          />
        ))}

        {/* Handle end cap / bolster */}
        <rect
          x="93"
          y="43"
          width="34"
          height="10"
          rx="3"
          fill="#475569"
          stroke="#334155"
          strokeWidth="1"
        />
        <ellipse
          cx="110"
          cy="43"
          rx="17"
          ry="4"
          fill="#64748b"
          stroke="#475569"
          strokeWidth="1"
        />

        {/* ===== BLADE COLLAR / FERRULE ===== */}
        <rect
          x="95"
          y="200"
          width="30"
          height="12"
          rx="2"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Ferrule rings */}
        <line
          x1="95"
          y1="204"
          x2="125"
          y2="204"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <line
          x1="95"
          y1="208"
          x2="125"
          y2="208"
          stroke="#64748b"
          strokeWidth="0.8"
        />

        {/* ===== BLADE (No. 22 style — large belly) ===== */}
        {/* Blade body */}
        <path
          d="
            M 98 212
            L 98 230
            Q 98 248 110 262
            Q 116 270 122 265
            Q 128 258 125 245
            Q 122 235 122 212
            Z
          "
          fill="url(#scalpelBladeGrad)"
          stroke="#94a3b8"
          strokeWidth="1.2"
        />

        {/* Blade cutting edge (bottom belly) */}
        <path
          d="M 99 230 Q 100 248 110 262 Q 116 270 122 265 Q 128 258 124 244 Q 121 235 121 212"
          fill="url(#scalpelEdgeGrad)"
          stroke="#e2e8f0"
          strokeWidth="0.8"
          opacity="0.7"
        />

        {/* Blade spine (top edge, thicker) */}
        <path
          d="M 98 212 L 99 260 Q 100 268 108 270"
          stroke="#475569"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Blade notch at base */}
        <path
          d="M 98 212 Q 96 218 98 224"
          fill="none"
          stroke="#64748b"
          strokeWidth="1"
        />

        {/* Blade shine */}
        <path
          d="M 101 220 Q 103 240 108 258"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Sharp edge glint */}
        <motion.line
          x1="121"
          y1="220"
          x2="119"
          y2="255"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />

        {/* Handle highlight */}
        <path
          d="M 99 52 L 99 192"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.2"
          strokeLinecap="round"
        />
      </g>

      {/* Label */}
      <text
        x="110"
        y="292"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Scalpel
      </text>
    </svg>
  );
}
