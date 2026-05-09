import React from "react";
import { motion } from "framer-motion";

export default function CrucibleSVG({
  liquidLevel = 0,
  liquidColor = "#f59e0b",
  heated = false,
  glow = false,
}) {
  const bodyTop = 100;
  const bodyBottom = 220;
  const bodyHeight = bodyBottom - bodyTop;
  const liquidHeight = bodyHeight * liquidLevel;
  const liquidY = bodyBottom - liquidHeight;

  return (
    <svg
      viewBox="0 0 240 320"
      className="w-full h-full max-h-[320px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(245,158,11,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="crucibleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#fafaf9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a8a29e" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="crucibleLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.95" />
        </linearGradient>
        <clipPath id="crucibleClip">
          <path d="M 65 100 L 55 220 Q 55 240 120 240 Q 185 240 185 220 L 175 100 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="265"
        rx="60"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Crucible body - tapered cup shape */}
      <path
        d="M 65 100 L 55 220 Q 55 240 120 240 Q 185 240 185 220 L 175 100 Z"
        fill="url(#crucibleGrad)"
        stroke="#78716c"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Bottom curve */}
      <ellipse
        cx="120"
        cy="232"
        rx="65"
        ry="12"
        fill="none"
        stroke="#78716c"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Liquid */}
      {liquidLevel > 0 && (
        <g clipPath="url(#crucibleClip)">
          <motion.rect
            x="50"
            width="140"
            fill="url(#crucibleLiquid)"
            initial={{ y: bodyBottom, height: 0 }}
            animate={{ y: liquidY, height: liquidHeight + 20 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="120"
            rx="55"
            ry="6"
            fill={liquidColor}
            fillOpacity="0.4"
            initial={{ cy: bodyBottom }}
            animate={{ cy: liquidY + 2 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Rim / lip */}
      <ellipse
        cx="120"
        cy="100"
        rx="56"
        ry="12"
        fill="#e7e5e4"
        stroke="#78716c"
        strokeWidth="2.5"
      />
      <ellipse
        cx="120"
        cy="100"
        rx="48"
        ry="9"
        fill="#f5f5f4"
        stroke="#a8a29e"
        strokeWidth="1"
      />

      {/* Pouring spout */}
      <path
        d="M 64 96 Q 52 90 50 82 Q 52 88 66 92"
        fill="#e7e5e4"
        stroke="#78716c"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Glass highlight */}
      <path
        d="M 80 120 Q 72 160 74 210"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Heat glow */}
      {heated && (
        <motion.ellipse
          cx="120"
          cy="240"
          rx="50"
          ry="8"
          fill="#ef4444"
          fillOpacity="0.15"
          animate={{ fillOpacity: [0.1, 0.25, 0.1], ry: [8, 12, 8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Label */}
      <text
        x="120"
        y="290"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Crucible
      </text>
    </svg>
  );
}
