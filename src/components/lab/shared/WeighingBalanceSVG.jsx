import React from "react";
import { motion } from "framer-motion";

export default function WeighingBalanceSVG({
  leftWeight = 0,
  rightWeight = 0,
  glow = false,
}) {
  const diff = leftWeight - rightWeight;
  const tiltAngle = Math.max(-18, Math.min(18, diff * 3));

  return (
    <svg
      viewBox="0 0 280 320"
      className="w-full h-full max-h-[320px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(251,191,36,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="wbStand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="40%" stopColor="#d6d3d1" />
          <stop offset="100%" stopColor="#78716c" />
        </linearGradient>
        <linearGradient id="wbPan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="140"
        cy="288"
        rx="80"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Base */}
      <rect
        x="65"
        y="270"
        width="150"
        height="14"
        rx="4"
        fill="url(#wbStand)"
        stroke="#57534e"
        strokeWidth="1.5"
      />
      <rect
        x="70"
        y="270"
        width="140"
        height="4"
        rx="2"
        fill="#e7e5e4"
        opacity="0.3"
      />

      {/* Stand column */}
      <rect
        x="133"
        y="110"
        width="14"
        height="162"
        rx="3"
        fill="url(#wbStand)"
        stroke="#78716c"
        strokeWidth="1"
      />
      <line
        x1="138"
        y1="115"
        x2="138"
        y2="265"
        stroke="#e7e5e4"
        strokeWidth="2"
        opacity="0.2"
        strokeLinecap="round"
      />

      {/* Top pivot */}
      <circle
        cx="140"
        cy="108"
        r="8"
        fill="#78716c"
        stroke="#57534e"
        strokeWidth="1.5"
      />
      <circle cx="140" cy="108" r="3" fill="#d6d3d1" />

      {/* Beam */}
      <motion.g
        animate={{ rotate: tiltAngle }}
        style={{ originX: "140px", originY: "108px" }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      >
        <rect
          x="58"
          y="104"
          width="164"
          height="8"
          rx="4"
          fill="url(#wbStand)"
          stroke="#78716c"
          strokeWidth="1"
        />
        <line
          x1="65"
          y1="106"
          x2="215"
          y2="106"
          stroke="#e7e5e4"
          strokeWidth="1.5"
          opacity="0.2"
        />

        {/* Left arm indicator */}
        <circle
          cx="72"
          cy="108"
          r="5"
          fill="#78716c"
          stroke="#57534e"
          strokeWidth="1"
        />
        {/* Right arm indicator */}
        <circle
          cx="208"
          cy="108"
          r="5"
          fill="#78716c"
          stroke="#57534e"
          strokeWidth="1"
        />

        {/* Left strings */}
        <line
          x1="72"
          y1="113"
          x2="55"
          y2="148"
          stroke="#78716c"
          strokeWidth="1.2"
        />
        <line
          x1="72"
          y1="113"
          x2="90"
          y2="148"
          stroke="#78716c"
          strokeWidth="1.2"
        />
        {/* Right strings */}
        <line
          x1="208"
          y1="113"
          x2="191"
          y2="148"
          stroke="#78716c"
          strokeWidth="1.2"
        />
        <line
          x1="208"
          y1="113"
          x2="225"
          y2="148"
          stroke="#78716c"
          strokeWidth="1.2"
        />

        {/* Left pan */}
        <path
          d="M 48 152 Q 48 162 72 162 Q 96 162 96 152 Z"
          fill="url(#wbPan)"
          stroke="#78716c"
          strokeWidth="1.5"
        />
        <ellipse
          cx="72"
          cy="152"
          rx="24"
          ry="5"
          fill="#d1d5db"
          stroke="#9ca3af"
          strokeWidth="1"
        />

        {/* Right pan */}
        <path
          d="M 184 152 Q 184 162 208 162 Q 232 162 232 152 Z"
          fill="url(#wbPan)"
          stroke="#78716c"
          strokeWidth="1.5"
        />
        <ellipse
          cx="208"
          cy="152"
          rx="24"
          ry="5"
          fill="#d1d5db"
          stroke="#9ca3af"
          strokeWidth="1"
        />

        {/* Left weight object */}
        {leftWeight > 0 && (
          <rect
            x="59"
            y="140"
            width="26"
            height="12"
            rx="2"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="1"
          />
        )}
        {/* Right weight object */}
        {rightWeight > 0 && (
          <rect
            x="195"
            y="140"
            width="26"
            height="12"
            rx="2"
            fill="#60a5fa"
            stroke="#2563eb"
            strokeWidth="1"
          />
        )}
      </motion.g>

      {/* Pointer needle */}
      <motion.line
        x1="140"
        y1="108"
        x2="140"
        y2="85"
        animate={{
          x2: 140 + 14 * Math.sin((tiltAngle * Math.PI) / 180),
          y2: 85,
        }}
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeLinecap="round"
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      />
      {/* Pointer scale */}
      <line
        x1="126"
        y1="80"
        x2="154"
        y2="80"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <circle cx="140" cy="80" r="2" fill="#94a3b8" />

      {/* Label */}
      <text
        x="140"
        y="305"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Weighing Balance
      </text>
    </svg>
  );
}
