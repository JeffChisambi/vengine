import React from "react";
import { motion } from "framer-motion";

export default function SyringeSVG({
  fillLevel = 0.6,
  liquidColor = "#38bdf8",
  plungerPushed = false,
  glow = false,
}) {
  const bodyStartX = 55;
  const bodyEndX = 230;
  const bodyLen = bodyEndX - bodyStartX;
  const liquidWidth = bodyLen * fillLevel;
  const liquidX = bodyEndX - liquidWidth;

  const plungerX = plungerPushed ? bodyEndX - liquidWidth - 5 : bodyEndX - 10;

  const markings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      viewBox="0 0 300 180"
      className="w-full h-full max-h-[180px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 14px ${liquidColor}44)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="syGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="syLiquid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="syPlunger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <clipPath id="syCylClip">
          <rect x={bodyStartX} y="68" width={bodyLen} height="28" rx="4" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="150"
        cy="158"
        rx="110"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.3"
      />

      {/* Barrel (glass cylinder) */}
      <rect
        x={bodyStartX}
        y="68"
        width={bodyLen}
        height="28"
        rx="4"
        fill="url(#syGlass)"
        stroke="#94a3b8"
        strokeWidth="1.8"
      />

      {/* Liquid fill */}
      <g clipPath="url(#syCylClip)">
        <motion.rect
          y="68"
          height="28"
          fill="url(#syLiquid)"
          initial={{ x: bodyEndX, width: 0 }}
          animate={{ x: liquidX, width: liquidWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        {/* Meniscus (curved end of liquid) */}
        <motion.ellipse
          cy="82"
          rx="5"
          ry="14"
          fill={liquidColor}
          fillOpacity="0.4"
          initial={{ cx: bodyEndX }}
          animate={{ cx: liquidX + 3 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </g>

      {/* Barrel glass highlight */}
      <line
        x1={bodyStartX + 4}
        y1="73"
        x2={bodyEndX - 4}
        y2="73"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Volume markings */}
      {markings.map((m, i) => {
        const x = bodyStartX + bodyLen * m;
        return (
          <g key={i}>
            <line
              x1={x}
              y1="66"
              x2={x}
              y2="98"
              stroke="#64748b"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <text x={x} y="63" textAnchor="middle" fontSize="7" fill="#64748b">
              {(m * 10).toFixed(0)}
            </text>
          </g>
        );
      })}
      <text
        x={bodyStartX + bodyLen - 5}
        y="112"
        textAnchor="middle"
        fontSize="6.5"
        fill="#94a3b8"
      >
        mL
      </text>

      {/* Finger grip flanges */}
      <rect
        x={bodyEndX - 4}
        y="60"
        width="8"
        height="44"
        rx="2"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x={bodyEndX - 4}
        y="58"
        width="10"
        height="8"
        rx="2"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x={bodyEndX - 4}
        y="98"
        width="10"
        height="8"
        rx="2"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Needle hub */}
      <path
        d={`M ${bodyStartX} 74 L ${bodyStartX - 12} 78 L ${bodyStartX - 12} 86 L ${bodyStartX} 90 Z`}
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.2"
      />

      {/* Needle */}
      <path
        d={`M ${bodyStartX - 12} 82 L ${bodyStartX - 42} 83`}
        stroke="#d1d5db"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`M ${bodyStartX - 42} 83 L ${bodyStartX - 48} 82.5`}
        stroke="#e5e7eb"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Plunger rod */}
      <motion.g
        animate={{ x: plungerPushed ? -(bodyLen * fillLevel) : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 60 }}
      >
        {/* Plunger rod */}
        <line
          x1={plungerX}
          y1="82"
          x2={bodyEndX + 55}
          y2="82"
          stroke="url(#syPlunger)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Rubber tip */}
        <rect
          x={plungerX - 5}
          y="70"
          width="10"
          height="24"
          rx="3"
          fill="#dc2626"
          stroke="#b91c1c"
          strokeWidth="1"
        />
        {/* Plunger thumb press */}
        <rect
          x={bodyEndX + 42}
          y="70"
          width="18"
          height="24"
          rx="4"
          fill="url(#syPlunger)"
          stroke="#64748b"
          strokeWidth="1.2"
        />
        <rect
          x={bodyEndX + 44}
          y="72"
          width="3"
          height="20"
          rx="1"
          fill="#ffffff"
          opacity="0.15"
        />
      </motion.g>

      {/* Label */}
      <text
        x="150"
        y="172"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Syringe
      </text>
    </svg>
  );
}
