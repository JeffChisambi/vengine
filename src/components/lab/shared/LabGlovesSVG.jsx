import React from "react";
import { motion } from "framer-motion";

export default function LabGlovesSVG({
  color = "#7c3aed",
  worn = false,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 18px rgba(124,58,237,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="gloveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="40%" stopColor={color} stopOpacity="0.78" />
          <stop offset="100%" stopColor={color} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="gloveCuffGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Left glove */}
      <g transform="translate(-10, 0)">
        {/* Cuff */}
        <motion.rect
          x="42"
          y="210"
          width="62"
          height="55"
          rx="6"
          fill="url(#gloveCuffGrad)"
          stroke="#6d28d9"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Cuff rolled edge */}
        <ellipse
          cx="73"
          cy="265"
          rx="31"
          ry="5"
          fill={color}
          stroke="#6d28d9"
          strokeWidth="1.5"
        />

        {/* Palm */}
        <motion.path
          d="
            M 42 210
            L 42 140
            Q 42 125 52 120
            L 52 72
            Q 52 62 58 62
            Q 64 62 64 72
            L 64 108

            L 64 55
            Q 64 44 70 44
            Q 76 44 76 55
            L 76 105

            L 76 48
            Q 76 37 82 37
            Q 88 37 88 48
            L 88 105

            L 88 58
            Q 88 47 94 47
            Q 100 47 100 58
            L 100 118

            Q 104 130 104 140
            L 104 210
          "
          fill="url(#gloveGrad)"
          stroke="#6d28d9"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Thumb */}
        <motion.path
          d="
            M 42 150
            Q 28 140 26 125
            Q 24 112 32 108
            Q 40 104 44 115
            Q 46 125 42 140
          "
          fill="url(#gloveGrad)"
          stroke="#6d28d9"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />

        {/* Finger creases */}
        <line
          x1="55"
          y1="95"
          x2="62"
          y2="95"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <line
          x1="67"
          y1="88"
          x2="74"
          y2="88"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <line
          x1="79"
          y1="85"
          x2="86"
          y2="85"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <line
          x1="91"
          y1="90"
          x2="98"
          y2="90"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Palm crease */}
        <path
          d="M 50 160 Q 70 150 95 158"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.3"
          fill="none"
        />

        {/* Highlight */}
        <path
          d="M 60 130 Q 55 170 58 200"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.15"
        />
      </g>

      {/* Right glove */}
      <g transform="translate(100, 8) scale(-1,1) translate(-73, 0)">
        {/* Cuff */}
        <rect
          x="42"
          y="210"
          width="62"
          height="55"
          rx="6"
          fill="url(#gloveCuffGrad)"
          stroke="#6d28d9"
          strokeWidth="2"
        />
        <ellipse
          cx="73"
          cy="265"
          rx="31"
          ry="5"
          fill={color}
          stroke="#6d28d9"
          strokeWidth="1.5"
        />

        {/* Palm */}
        <path
          d="
            M 42 210
            L 42 140
            Q 42 125 52 120
            L 52 72
            Q 52 62 58 62
            Q 64 62 64 72
            L 64 108
            L 64 55
            Q 64 44 70 44
            Q 76 44 76 55
            L 76 105
            L 76 48
            Q 76 37 82 37
            Q 88 37 88 48
            L 88 105
            L 88 58
            Q 88 47 94 47
            Q 100 47 100 58
            L 100 118
            Q 104 130 104 140
            L 104 210
          "
          fill="url(#gloveGrad)"
          stroke="#6d28d9"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Thumb */}
        <path
          d="
            M 42 150
            Q 28 140 26 125
            Q 24 112 32 108
            Q 40 104 44 115
            Q 46 125 42 140
          "
          fill="url(#gloveGrad)"
          stroke="#6d28d9"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <line
          x1="55"
          y1="95"
          x2="62"
          y2="95"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <line
          x1="67"
          y1="88"
          x2="74"
          y2="88"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <line
          x1="79"
          y1="85"
          x2="86"
          y2="85"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <line
          x1="91"
          y1="90"
          x2="98"
          y2="90"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.4"
        />
        <path
          d="M 50 160 Q 70 150 95 158"
          stroke="#6d28d9"
          strokeWidth="0.8"
          opacity="0.3"
          fill="none"
        />
        <path
          d="M 60 130 Q 55 170 58 200"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.15"
        />
      </g>

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="310"
        rx="80"
        ry="10"
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
        Lab Gloves
      </text>
    </svg>
  );
}
