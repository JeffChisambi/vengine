import React from "react";
import { motion } from "framer-motion";

export default function TuningForkSVG({
  vibrating = false,
  frequency = 440,
  glow = false,
}) {
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
        <linearGradient id="tfMetalGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="35%" stopColor="#f1f5f9" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="tfHandleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="25"
        ry="5"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── LEFT TINE ── */}
      <motion.g
        animate={vibrating ? { x: [-3, 3, -3] } : { x: 0 }}
        transition={{ duration: 0.06, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M 96 58 L 92 58 Q 82 58 82 78 L 82 155 Q 82 162 89 162 Q 96 162 96 155 Z"
          fill="url(#tfMetalGrad)"
          stroke="#64748b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Tine rounded tip */}
        <ellipse
          cx="89"
          cy="58"
          rx="7"
          ry="10"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Tine inner face highlight */}
        <line
          x1="94"
          y1="68"
          x2="94"
          y2="152"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.3"
          strokeLinecap="round"
        />
        {/* Vibration blur */}
        {vibrating && (
          <motion.path
            d="M 84 58 L 80 58 Q 70 58 70 78 L 70 155 Q 70 162 77 162 Q 84 162 84 155 Z"
            fill="#6366f1"
            fillOpacity="0.08"
            stroke="none"
            animate={{ x: [-4, 4, -4] }}
            transition={{ duration: 0.06, repeat: Infinity }}
          />
        )}
      </motion.g>

      {/* ── RIGHT TINE ── */}
      <motion.g
        animate={vibrating ? { x: [3, -3, 3] } : { x: 0 }}
        transition={{ duration: 0.06, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M 124 58 L 128 58 Q 138 58 138 78 L 138 155 Q 138 162 131 162 Q 124 162 124 155 Z"
          fill="url(#tfMetalGrad)"
          stroke="#64748b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse
          cx="131"
          cy="58"
          rx="7"
          ry="10"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        <line
          x1="126"
          y1="68"
          x2="126"
          y2="152"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.3"
          strokeLinecap="round"
        />
        {vibrating && (
          <motion.path
            d="M 136 58 L 140 58 Q 150 58 150 78 L 150 155 Q 150 162 143 162 Q 136 162 136 155 Z"
            fill="#6366f1"
            fillOpacity="0.08"
            animate={{ x: [4, -4, 4] }}
            transition={{ duration: 0.06, repeat: Infinity }}
          />
        )}
      </motion.g>

      {/* ── YOKE (U-bend connecting tines to handle) ── */}
      <path
        d="M 92 155 Q 92 175 110 175 Q 128 175 128 155"
        fill="none"
        stroke="url(#tfMetalGrad)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M 92 155 Q 92 175 110 175 Q 128 175 128 155"
        fill="none"
        stroke="#f1f5f9"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* ── HANDLE (cylindrical rod) ── */}
      <rect
        x="104"
        y="172"
        width="12"
        height="100"
        rx="5"
        fill="url(#tfHandleGrad)"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Knurling */}
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1="104"
          y1={176 + i * 7}
          x2="116"
          y2={176 + i * 7}
          stroke="#94a3b8"
          strokeWidth="0.6"
          opacity="0.45"
        />
      ))}
      {/* Handle end cap */}
      <ellipse
        cx="110"
        cy="272"
        rx="6"
        ry="3"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Frequency stamp */}
      <text
        x="110"
        y="145"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#475569"
        fontFamily="monospace"
      >
        {frequency} Hz
      </text>

      {/* Sound waves when vibrating */}
      {vibrating &&
        [0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M ${72 - i * 10} 100 Q ${62 - i * 10} 110 ${72 - i * 10} 120`}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0, 0.6, 0], x: [0, -8, -16] }}
            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      {vibrating &&
        [0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M ${148 + i * 10} 100 Q ${158 + i * 10} 110 ${148 + i * 10} 120`}
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0, 0.6, 0], x: [0, 8, 16] }}
            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Tuning Fork
      </text>
    </svg>
  );
}
