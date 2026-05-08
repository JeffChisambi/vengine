import React from "react";
import { motion } from "framer-motion";

export default function ScaleSVG({
  mass = 0,
  showObject = false,
  objectColor = "#8B5CF6",
}) {
  return (
    <svg
      viewBox="0 0 240 280"
      className="w-full h-full max-h-[280px]"
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }}
    >
      <defs>
        <linearGradient id="scaleBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <radialGradient id="screenGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </radialGradient>
      </defs>

      {/* Base */}
      <rect
        x="30"
        y="200"
        width="180"
        height="50"
        rx="12"
        fill="url(#scaleBodyGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Platform */}
      <motion.g
        animate={{ y: showObject ? 3 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <rect
          x="45"
          y="180"
          width="150"
          height="20"
          rx="6"
          fill="url(#platGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Object on scale */}
        {showObject && (
          <motion.g
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          >
            <ellipse
              cx="120"
              cy="165"
              rx="30"
              ry="24"
              fill={objectColor}
              fillOpacity="0.9"
            />
            <ellipse
              cx="113"
              cy="158"
              rx="9"
              ry="6"
              fill="#ffffff"
              fillOpacity="0.3"
            />
          </motion.g>
        )}
      </motion.g>

      {/* Screen */}
      <rect
        x="70"
        y="210"
        width="100"
        height="30"
        rx="6"
        fill="url(#screenGrad)"
      />

      {/* Digital display */}
      <motion.text
        x="120"
        y="231"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fontFamily="monospace"
        fill="#4ade80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {mass > 0 ? `${mass.toFixed(1)} g` : "0.0 g"}
      </motion.text>

      {/* Power indicator */}
      <circle cx="55" cy="225" r="3" fill="#4ade80" />

      {/* Feet */}
      <rect x="45" y="250" width="20" height="6" rx="3" fill="#94a3b8" />
      <rect x="175" y="250" width="20" height="6" rx="3" fill="#94a3b8" />

      {/* Label */}
      <text
        x="120"
        y="275"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Digital Scale
      </text>
    </svg>
  );
}
