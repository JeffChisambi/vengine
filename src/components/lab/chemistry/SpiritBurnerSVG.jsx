import React from "react";
import { motion } from "framer-motion";

export default function SpiritBurnerSVG({
  flameOn = true,
  liquidLevel = 0.6,
  liquidColor = "#a78bfa",
  glow = false,
}) {
  const bodyTop = 160;
  const bodyBottom = 260;
  const bodyHeight = bodyBottom - bodyTop;
  const liquidHeight = bodyHeight * liquidLevel;
  const liquidY = bodyBottom - liquidHeight;

  return (
    <svg
      viewBox="0 0 220 340"
      className="w-full h-full max-h-[340px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(251,146,60,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="spiritGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="spiritLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="spiritClip">
          <path d="M 65 155 Q 55 260 110 270 Q 165 260 155 155 Z" />
        </clipPath>
        <radialGradient id="spiritFlameGrad" cx="0.5" cy="0.85" r="0.55">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="290"
        rx="55"
        ry="9"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Body - rounded jar shape */}
      <path
        d="M 65 155 Q 55 260 110 270 Q 165 260 155 155"
        fill="url(#spiritGlass)"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Liquid */}
      <g clipPath="url(#spiritClip)">
        <motion.rect
          x="50"
          width="120"
          fill="url(#spiritLiquid)"
          initial={{ y: bodyBottom, height: 0 }}
          animate={{ y: liquidY, height: liquidHeight + 15 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="110"
          rx="42"
          ry="5"
          fill={liquidColor}
          fillOpacity="0.35"
          initial={{ cy: bodyBottom }}
          animate={{ cy: liquidY + 2 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </g>

      {/* Glass highlight */}
      <path
        d="M 80 170 Q 72 210 76 255"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* Lid/cap */}
      <rect
        x="88"
        y="148"
        width="44"
        height="14"
        rx="4"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Wick tube */}
      <rect
        x="104"
        y="115"
        width="12"
        height="40"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Wick (string) */}
      <line
        x1="110"
        y1="92"
        x2="110"
        y2="130"
        stroke="#78716c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="110"
        y1="92"
        x2="110"
        y2="118"
        stroke="#57534e"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Flame */}
      {flameOn && (
        <g>
          <motion.path
            d="M 110 50 Q 96 72 98 90 Q 103 96 110 92 Q 117 96 122 90 Q 124 72 110 50 Z"
            fill="url(#spiritFlameGrad)"
            animate={{
              d: [
                "M 110 48 Q 94 70 97 90 Q 103 97 110 92 Q 117 97 123 90 Q 126 70 110 48 Z",
                "M 110 52 Q 98 74 99 90 Q 104 95 110 92 Q 116 95 121 90 Q 122 74 110 52 Z",
                "M 110 48 Q 94 70 97 90 Q 103 97 110 92 Q 117 97 123 90 Q 126 70 110 48 Z",
              ],
            }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner flame */}
          <motion.path
            d="M 110 70 Q 104 80 106 90 Q 108 93 110 92 Q 112 93 114 90 Q 116 80 110 70 Z"
            fill="#fef9c3"
            fillOpacity="0.9"
            animate={{
              d: [
                "M 110 68 Q 103 79 105 90 Q 108 94 110 92 Q 112 94 115 90 Q 117 79 110 68 Z",
                "M 110 72 Q 105 81 107 90 Q 109 93 110 92 Q 111 93 113 90 Q 115 81 110 72 Z",
                "M 110 68 Q 103 79 105 90 Q 108 94 110 92 Q 112 94 115 90 Q 117 79 110 68 Z",
              ],
            }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Cap chain ring (decorative) */}
      <circle
        cx="136"
        cy="155"
        r="4"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Label */}
      <text
        x="110"
        y="315"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Spirit Burner
      </text>
    </svg>
  );
}
