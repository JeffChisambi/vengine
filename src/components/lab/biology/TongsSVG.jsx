import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function TongsSVG({ open = false, glow = false }) {
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
        <linearGradient id="tongsMetalGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="tongsGripGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="285"
        rx="45"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ===== PIVOT POINT ===== */}
      <circle
        cx="110"
        cy="165"
        r="7"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <circle cx="110" cy="165" r="3" fill="#1e293b" />

      {/* ===== LEFT ARM (handle + jaw) ===== */}
      <motion.g
        animate={{ rotate: open ? -12 : 0 }}
        style={{ transformOrigin: "110px 165px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Handle */}
        <rect
          x="98"
          y="25"
          width="10"
          height="140"
          rx="5"
          fill="url(#tongsMetalGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Grip rings */}
        {[40, 55, 70, 85, 100, 115].map((y, i) => (
          <rect
            key={i}
            x="97"
            y={y}
            width="12"
            height="5"
            rx="2"
            fill="url(#tongsGripGrad)"
          />
        ))}
        {/* Jaw - serrated */}
        <path
          d="M 98 165 L 88 225 Q 85 232 90 235 L 108 235 Q 113 232 108 225 Z"
          fill="url(#tongsMetalGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Jaw serrations */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={90 + i * 4}
            y1={235}
            x2={91 + i * 4}
            y2={242}
            stroke="#64748b"
            strokeWidth="1"
          />
        ))}
        {/* Jaw inner face */}
        <path
          d="M 100 170 L 92 222 L 106 222 L 106 170"
          fill="#cbd5e1"
          fillOpacity="0.4"
        />
      </motion.g>

      {/* ===== RIGHT ARM (handle + jaw) ===== */}
      <motion.g
        animate={{ rotate: open ? 12 : 0 }}
        style={{ transformOrigin: "110px 165px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Handle */}
        <rect
          x="112"
          y="25"
          width="10"
          height="140"
          rx="5"
          fill="url(#tongsMetalGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Grip rings */}
        {[40, 55, 70, 85, 100, 115].map((y, i) => (
          <rect
            key={i}
            x="111"
            y={y}
            width="12"
            height="5"
            rx="2"
            fill="url(#tongsGripGrad)"
          />
        ))}
        {/* Jaw */}
        <path
          d="M 122 165 L 132 225 Q 135 232 130 235 L 112 235 Q 107 232 112 225 Z"
          fill="url(#tongsMetalGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />
        {/* Jaw serrations */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={113 + i * 4}
            y1={235}
            x2={114 + i * 4}
            y2={242}
            stroke="#64748b"
            strokeWidth="1"
          />
        ))}
        {/* Jaw inner face */}
        <path
          d="M 120 170 L 128 222 L 114 222 L 114 170"
          fill="#cbd5e1"
          fillOpacity="0.4"
        />
      </motion.g>

      {/* Spring tension loop at top */}
      <path
        d="M 103 28 Q 110 18 117 28"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Highlight */}
      <line
        x1="101"
        y1="30"
        x2="101"
        y2="155"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.3"
        strokeLinecap="round"
      />

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
        Tongs
      </text>
    </svg>
  );
}
