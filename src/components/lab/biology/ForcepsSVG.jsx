import React from "react";
import { motion } from "framer-motion";

export default function ForcepsSVG({ open = false, glow = false }) {
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
        <linearGradient id="forcepsGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="35%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="285"
        rx="30"
        ry="5"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ===== LEFT TINE ===== */}
      <motion.g
        animate={{ rotate: open ? -6 : 0 }}
        style={{ transformOrigin: "110px 60px" }}
        transition={{ duration: 0.3 }}
      >
        {/* Handle shaft */}
        <path
          d="M 107 25 L 105 60 L 103 260 Q 103 268 108 270 L 110 270"
          fill="none"
          stroke="url(#forcepsGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Serrated tip */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="103"
            y={250 + i * 4}
            width="5"
            height="2"
            rx="0.5"
            fill="#64748b"
          />
        ))}
        {/* Handle flat region with pattern */}
        {[80, 95, 110, 125, 140].map((y, i) => (
          <line
            key={i}
            x1="104"
            y1={y}
            x2="107"
            y2={y + 6}
            stroke="#94a3b8"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        {/* Highlight */}
        <line
          x1="106"
          y1="30"
          x2="104.5"
          y2="250"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.25"
          strokeLinecap="round"
        />
      </motion.g>

      {/* ===== RIGHT TINE ===== */}
      <motion.g
        animate={{ rotate: open ? 6 : 0 }}
        style={{ transformOrigin: "110px 60px" }}
        transition={{ duration: 0.3 }}
      >
        <path
          d="M 113 25 L 115 60 L 117 260 Q 117 268 112 270 L 110 270"
          fill="none"
          stroke="url(#forcepsGrad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x="112"
            y={250 + i * 4}
            width="5"
            height="2"
            rx="0.5"
            fill="#64748b"
          />
        ))}
        {[80, 95, 110, 125, 140].map((y, i) => (
          <line
            key={i}
            x1="116"
            y1={y}
            x2="113"
            y2={y + 6}
            stroke="#94a3b8"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        <line
          x1="114"
          y1="30"
          x2="115.5"
          y2="250"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.25"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Thumb loop / locking ring left */}
      <ellipse
        cx="100"
        cy="45"
        rx="10"
        ry="16"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />
      {/* Thumb loop right */}
      <ellipse
        cx="120"
        cy="45"
        rx="10"
        ry="16"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Box-lock hinge at pivot */}
      <rect
        x="105"
        y="56"
        width="10"
        height="8"
        rx="2"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />
      <circle cx="110" cy="60" r="2.5" fill="#1e293b" />

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
        Forceps
      </text>
    </svg>
  );
}
