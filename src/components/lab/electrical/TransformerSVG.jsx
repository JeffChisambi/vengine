import React from "react";
import { motion } from "framer-motion";

export default function TransformerSVG({ type = "step-down", glow = false }) {
  const isStepUp = type === "step-up";
  const primaryTurns = isStepUp ? 5 : 8;
  const secondaryTurns = isStepUp ? 8 : 5;

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
        <linearGradient id="tfCore" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="tfCopper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="30%" stopColor="#fde68a" />
          <stop offset="70%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="284"
        rx="68"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── LAMINATED IRON CORE (E-I shape) ── */}
      {/* Top bar */}
      <rect
        x="30"
        y="60"
        width="160"
        height="18"
        rx="3"
        fill="url(#tfCore)"
        stroke="#334155"
        strokeWidth="1.5"
      />
      {/* Bottom bar */}
      <rect
        x="30"
        y="222"
        width="160"
        height="18"
        rx="3"
        fill="url(#tfCore)"
        stroke="#334155"
        strokeWidth="1.5"
      />
      {/* Left leg */}
      <rect
        x="30"
        y="60"
        width="22"
        height="180"
        rx="3"
        fill="url(#tfCore)"
        stroke="#334155"
        strokeWidth="1.5"
      />
      {/* Center leg */}
      <rect
        x="99"
        y="60"
        width="22"
        height="180"
        rx="3"
        fill="url(#tfCore)"
        stroke="#334155"
        strokeWidth="1.5"
      />
      {/* Right leg */}
      <rect
        x="168"
        y="60"
        width="22"
        height="180"
        rx="3"
        fill="url(#tfCore)"
        stroke="#334155"
        strokeWidth="1.5"
      />

      {/* Lamination lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} opacity="0.2">
          <line
            x1="32"
            y1={78 + i * 20}
            x2="50"
            y2={78 + i * 20}
            stroke="#1e293b"
            strokeWidth="0.8"
          />
          <line
            x1="101"
            y1={78 + i * 20}
            x2="119"
            y2={78 + i * 20}
            stroke="#1e293b"
            strokeWidth="0.8"
          />
          <line
            x1="170"
            y1={78 + i * 20}
            x2="188"
            y2={78 + i * 20}
            stroke="#1e293b"
            strokeWidth="0.8"
          />
        </g>
      ))}

      {/* ── PRIMARY COIL (left window) ── */}
      {Array.from({ length: primaryTurns }, (_, i) => {
        const y = 84 + i * (130 / primaryTurns);
        return (
          <g key={`p${i}`}>
            <path
              d={`M 52 ${y} A 12 6 0 0 1 52 ${y + 10}`}
              fill="none"
              stroke="#92400e"
              strokeWidth="3"
              opacity="0.4"
            />
            <path
              d={`M 52 ${y} A 12 6 0 0 0 52 ${y + 10}`}
              fill="none"
              stroke="url(#tfCopper)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        );
      })}
      {/* Primary leads */}
      <line
        x1="18"
        y1="88"
        x2="52"
        y2="88"
        stroke="#b45309"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="208"
        x2="52"
        y2="208"
        stroke="#b45309"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="18"
        cy="88"
        r="5"
        fill="#b45309"
        stroke="#92400e"
        strokeWidth="1.5"
      />
      <circle
        cx="18"
        cy="208"
        r="5"
        fill="#b45309"
        stroke="#92400e"
        strokeWidth="1.5"
      />

      {/* ── SECONDARY COIL (right window) ── */}
      {Array.from({ length: secondaryTurns }, (_, i) => {
        const y = 84 + i * (130 / secondaryTurns);
        return (
          <g key={`s${i}`}>
            <path
              d={`M 168 ${y} A 12 6 0 0 0 168 ${y + 10}`}
              fill="none"
              stroke="#92400e"
              strokeWidth="3"
              opacity="0.4"
            />
            <path
              d={`M 168 ${y} A 12 6 0 0 1 168 ${y + 10}`}
              fill="none"
              stroke="url(#tfCopper)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        );
      })}
      {/* Secondary leads */}
      <line
        x1="168"
        y1="88"
        x2="202"
        y2="88"
        stroke="#b45309"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="168"
        y1="208"
        x2="202"
        y2="208"
        stroke="#b45309"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="202"
        cy="88"
        r="5"
        fill="#b45309"
        stroke="#92400e"
        strokeWidth="1.5"
      />
      <circle
        cx="202"
        cy="208"
        r="5"
        fill="#b45309"
        stroke="#92400e"
        strokeWidth="1.5"
      />

      {/* Labels */}
      <text
        x="18"
        y="80"
        textAnchor="middle"
        fontSize="8"
        fill="#64748b"
        fontWeight="600"
      >
        P
      </text>
      <text
        x="202"
        y="80"
        textAnchor="middle"
        fontSize="8"
        fill="#64748b"
        fontWeight="600"
      >
        S
      </text>

      {/* Magnetic flux arrows in core */}
      <motion.g
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path
          d="M 110 68 L 110 62 L 116 68"
          fill="none"
          stroke="#818cf8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 110 232 L 110 238 L 104 232"
          fill="none"
          stroke="#818cf8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Type label */}
      <text
        x="110"
        y="254"
        textAnchor="middle"
        fontSize="10"
        fill="#6366f1"
        fontWeight="600"
      >
        {isStepUp ? "Step-Up" : "Step-Down"}
      </text>
      <text x="110" y="268" textAnchor="middle" fontSize="8" fill="#94a3b8">
        {isStepUp
          ? `N₁:N₂ = ${primaryTurns}:${secondaryTurns}`
          : `N₁:N₂ = ${primaryTurns}:${secondaryTurns}`}
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
        Transformer
      </text>
    </svg>
  );
}
