import React from "react";
import { motion } from "framer-motion";

export default function ConicalFlaskSVG({
  liquidLevel = 0.45,
  liquidColor = "#38bdf8",
  showReaction = false,
  bubbling = false,
  glow = false,
}) {
  const flaskBottomY = 300;
  const flaskTopY = 55;

  // Flask dimensions
  const neckWidth = 42;
  const neckHeight = 75;
  const bodyWidth = 160;
  const bodyHeight = 180;

  // Liquid calculations
  const liquidMaxHeight = 135;
  const liquidHeight = liquidMaxHeight * liquidLevel;
  const liquidY = flaskBottomY - liquidHeight - 8;

  const markings = [0.2, 0.4, 0.6, 0.8];

  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      {/* Definitions */}
      <defs>
        {/* Glass gradient */}
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.45" />
        </linearGradient>

        {/* Liquid gradient */}
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.92" />
        </linearGradient>

        {/* Flask clip */}
        <clipPath id="flaskClip">
          <path
            d="
              M 99 55
              L 99 130
              L 42 292
              Q 40 300 50 300
              L 190 300
              Q 200 300 198 292
              L 141 130
              L 141 55
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Flask body */}
      <path
        d="
          M 99 55
          L 99 130
          L 42 292
          Q 40 300 50 300
          L 190 300
          Q 200 300 198 292
          L 141 130
          L 141 55
          Z
        "
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Flask opening */}
      <ellipse
        cx="120"
        cy={flaskTopY}
        rx={neckWidth / 2}
        ry="7"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Liquid */}
      <g clipPath="url(#flaskClip)">
        <motion.path
          fill="url(#liquidGrad)"
          initial={{
            d: `
              M 50 ${flaskBottomY}
              L 190 ${flaskBottomY}
              L 190 ${flaskBottomY}
              L 50 ${flaskBottomY}
              Z
            `,
          }}
          animate={{
            d: `
              M 58 ${flaskBottomY}
              Q 120 ${liquidY - 6} 182 ${flaskBottomY}
              L 182 ${flaskBottomY}
              L 58 ${flaskBottomY}
              Z
            `,
          }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
          }}
        />

        {/* Liquid surface */}
        <motion.ellipse
          cx="120"
          rx="58"
          ry="6"
          fill="#bae6fd"
          fillOpacity="0.4"
          initial={{
            cy: flaskBottomY,
          }}
          animate={{
            cy: liquidY,
          }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
          }}
        />

        {/* Reaction glow */}
        {showReaction && (
          <motion.circle
            cx="120"
            cy="240"
            r="45"
            fill={liquidColor}
            fillOpacity="0.12"
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Bubbles */}
        {bubbling &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <motion.circle
              key={i}
              cx={88 + i * 10}
              r={2 + Math.random() * 3}
              fill="#dbeafe"
              fillOpacity="0.75"
              initial={{
                cy: 280,
                opacity: 0,
              }}
              animate={{
                cy: liquidY + 8,
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 1.8,
                delay: i * 0.18,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Foam layer */}
        {showReaction && (
          <motion.ellipse
            cx="120"
            cy={liquidY - 2}
            rx="52"
            ry="8"
            fill="#ffffff"
            fillOpacity="0.25"
            animate={{
              ry: [7, 10, 7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        )}
      </g>

      {/* Measurement markings */}
      {markings.map((m, i) => {
        const y = 290 - liquidMaxHeight * m;

        return (
          <g key={i}>
            <line
              x1="165"
              y1={y}
              x2="180"
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />

            <text
              x="184"
              y={y + 4}
              fontSize="9"
              fill="#64748b"
              fontFamily="var(--font-body)"
            >
              {(m * 250).toFixed(0)} mL
            </text>
          </g>
        );
      })}

      {/* Glass highlight */}
      <path
        d="
          M 84 82
          Q 72 160 74 250
        "
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* Base shadow */}
      <ellipse
        cx="120"
        cy="320"
        rx="70"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.45"
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
        Conical Flask
      </text>
    </svg>
  );
}
