import React from "react";
import { motion } from "framer-motion";

export default function EvaporatingDishSVG({
  liquidLevel = 0.4,
  liquidColor = "#a78bfa",
  evaporating = false,
  glow = false,
}) {
  const dishTop = 140;
  const dishBottom = 210;
  const dishHeight = dishBottom - dishTop;
  const liquidHeight = dishHeight * liquidLevel;
  const liquidY = dishBottom - liquidHeight;

  return (
    <svg
      viewBox="0 0 280 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(167,139,250,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="dishGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#fafaf9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a8a29e" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="dishLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="dishClip">
          <path d="M 40 150 Q 40 220 140 220 Q 240 220 240 150 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="140"
        cy="240"
        rx="90"
        ry="12"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Dish body - wide shallow bowl */}
      <path
        d="M 40 150 Q 40 220 140 220 Q 240 220 240 150"
        fill="url(#dishGrad)"
        stroke="#78716c"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Liquid */}
      {liquidLevel > 0 && (
        <g clipPath="url(#dishClip)">
          <motion.rect
            x="35"
            width="210"
            fill="url(#dishLiquid)"
            initial={{ y: dishBottom, height: 0 }}
            animate={{ y: liquidY, height: liquidHeight + 10 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="140"
            rx="80"
            ry="5"
            fill={liquidColor}
            fillOpacity="0.35"
            initial={{ cy: dishBottom }}
            animate={{ cy: liquidY + 2 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Rim */}
      <ellipse
        cx="140"
        cy="150"
        rx="100"
        ry="18"
        fill="#e7e5e4"
        stroke="#78716c"
        strokeWidth="2.5"
      />
      <ellipse
        cx="140"
        cy="150"
        rx="92"
        ry="14"
        fill="#f5f5f4"
        stroke="#a8a29e"
        strokeWidth="1"
      />

      {/* Pouring spout on right */}
      <path
        d="M 238 148 Q 252 142 258 132 Q 254 140 242 146"
        fill="#e7e5e4"
        stroke="#78716c"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Glass highlight */}
      <path
        d="M 75 165 Q 65 185 72 208"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* Evaporation steam */}
      {evaporating &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M ${100 + i * 20} 145 Q ${106 + i * 20} 125 ${102 + i * 20} 108`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -15, opacity: [0, 0.45, 0] }}
            transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

      {/* Label */}
      <text
        x="140"
        y="275"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Evaporating Dish
      </text>
    </svg>
  );
}
