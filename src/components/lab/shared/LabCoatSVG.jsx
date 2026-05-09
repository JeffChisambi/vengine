import React from "react";
import { motion } from "framer-motion";

export default function LabCoatSVG({ coatColor = "#f8fafc", glow = false }) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(100,116,139,0.25))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="coatGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.6" />
          <stop offset="30%" stopColor={coatColor} stopOpacity="0.95" />
          <stop offset="70%" stopColor={coatColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Hanger hook */}
      <motion.path
        d="M 120 8 Q 120 2 126 2 Q 132 2 132 8 L 132 22"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Hanger */}
      <motion.path
        d="M 72 38 L 120 22 L 168 38"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* Coat body */}
      <motion.path
        d="
          M 72 38
          L 48 52
          L 28 140
          L 48 142
          L 56 80
          L 56 290
          L 100 295
          L 100 290
          L 120 292
          L 140 290
          L 140 295
          L 184 290
          L 184 80
          L 192 142
          L 212 140
          L 192 52
          L 168 38
          L 145 48
          Q 120 58 95 48
          Z
        "
        fill="url(#coatGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Collar - left lapel */}
      <path
        d="M 95 48 L 105 55 L 110 100 L 100 95 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Collar - right lapel */}
      <path
        d="M 145 48 L 135 55 L 130 100 L 140 95 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Center seam */}
      <line
        x1="120"
        y1="58"
        x2="120"
        y2="290"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="4 3"
      />

      {/* Buttons */}
      {[105, 140, 175, 210, 245].map((y, i) => (
        <circle
          key={i}
          cx="120"
          cy={y}
          r="3"
          fill="#cbd5e1"
          stroke="#94a3b8"
          strokeWidth="1"
        />
      ))}

      {/* Left chest pocket */}
      <rect
        x="128"
        y="105"
        width="30"
        height="3"
        rx="1"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      <path
        d="M 128 108 L 128 132 Q 143 136 158 132 L 158 108"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />

      {/* Pen in pocket */}
      <rect x="140" y="98" width="3" height="18" rx="1" fill="#3b82f6" />
      <rect x="140" y="97" width="3" height="3" rx="1" fill="#1d4ed8" />
      <circle cx="141.5" cy="97" r="1" fill="#93c5fd" />

      {/* Right lower pocket */}
      <rect
        x="64"
        y="185"
        width="44"
        height="3"
        rx="1"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      <path
        d="M 64 188 L 64 230 Q 86 234 108 230 L 108 188"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />

      {/* Left lower pocket */}
      <rect
        x="132"
        y="185"
        width="44"
        height="3"
        rx="1"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      <path
        d="M 132 188 L 132 230 Q 154 234 176 230 L 176 188"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />

      {/* Left sleeve */}
      <path
        d="M 28 140 L 20 144 L 22 148 L 48 142"
        fill={coatColor}
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Right sleeve */}
      <path
        d="M 212 140 L 220 144 L 218 148 L 192 142"
        fill={coatColor}
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Fabric folds */}
      <path
        d="M 70 180 Q 72 200 68 220"
        stroke="#cbd5e1"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 170 180 Q 168 200 172 220"
        stroke="#cbd5e1"
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />

      {/* Highlight */}
      <path
        d="M 80 60 Q 75 120 78 180"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="310"
        rx="70"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Label */}
      <text
        x="120"
        y="345"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Lab Coat
      </text>
    </svg>
  );
}
