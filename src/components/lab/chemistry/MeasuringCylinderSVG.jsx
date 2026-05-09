import React from "react";
import { motion } from "framer-motion";

export default function MeasuringCylinderSVG({
  liquidLevel = 0.6,
  liquidColor = "#38bdf8",
  showMeniscus = true,
  bubbling = false,
  glow = false,
}) {
  const cylinderX = 85;
  const cylinderY = 30;
  const cylinderWidth = 50;
  const cylinderHeight = 250;

  const liquidHeight = cylinderHeight * liquidLevel;
  const liquidY = cylinderY + cylinderHeight - liquidHeight;

  const majorMarks = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 18px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      {/* Definitions */}
      <defs>
        {/* Glass gradient */}
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.42" />
        </linearGradient>

        {/* Liquid gradient */}
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.68" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.92" />
        </linearGradient>

        {/* Cylinder clip */}
        <clipPath id="cylinderClip">
          <rect
            x={cylinderX}
            y={cylinderY}
            width={cylinderWidth}
            height={cylinderHeight}
            rx="10"
          />
        </clipPath>
      </defs>

      {/* Base */}
      <ellipse
        cx="110"
        cy="315"
        rx="52"
        ry="12"
        fill="#cbd5e1"
        fillOpacity="0.55"
      />

      <rect x="65" y="295" width="90" height="14" rx="6" fill="#cbd5e1" />

      {/* Cylinder body */}
      <rect
        x={cylinderX}
        y={cylinderY}
        width={cylinderWidth}
        height={cylinderHeight}
        rx="10"
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="3"
      />

      {/* Top opening */}
      <ellipse
        cx={cylinderX + cylinderWidth / 2}
        cy={cylinderY}
        rx={cylinderWidth / 2}
        ry="7"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Pouring lip */}
      <path
        d="
          M 133 34
          Q 145 26 142 40
        "
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Liquid */}
      <g clipPath="url(#cylinderClip)">
        <motion.rect
          x={cylinderX + 2}
          width={cylinderWidth - 4}
          fill="url(#liquidGrad)"
          initial={{
            y: cylinderY + cylinderHeight,
            height: 0,
          }}
          animate={{
            y: liquidY,
            height: liquidHeight,
          }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
          }}
        />

        {/* Meniscus */}
        {showMeniscus && (
          <motion.ellipse
            cx={cylinderX + cylinderWidth / 2}
            rx={cylinderWidth / 2 - 4}
            ry="5"
            fill="#bae6fd"
            fillOpacity="0.45"
            initial={{
              cy: cylinderY + cylinderHeight,
            }}
            animate={{
              cy: liquidY + 2,
            }}
            transition={{
              duration: 0.9,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Glow */}
        {glow && (
          <motion.circle
            cx="110"
            cy="190"
            r="38"
            fill={liquidColor}
            fillOpacity="0.12"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}

        {/* Bubbles */}
        {bubbling &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={98 + i * 6}
              r={2 + Math.random() * 2}
              fill="#e0f2fe"
              fillOpacity="0.8"
              initial={{
                cy: 260,
                opacity: 0,
              }}
              animate={{
                cy: liquidY + 12,
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 1.6,
                delay: i * 0.14,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
      </g>

      {/* Major measurement markings */}
      {majorMarks.map((mark, i) => {
        const y = cylinderY + cylinderHeight - (i + 1) * (cylinderHeight / 10);

        return (
          <g key={i}>
            {/* Major line */}
            <line
              x1={cylinderX - 18}
              y1={y}
              x2={cylinderX}
              y2={y}
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Minor lines */}
            {[1, 2, 3, 4].map((minor) => {
              const minorY = y + minor * (cylinderHeight / 50);

              return (
                <line
                  key={minor}
                  x1={cylinderX - 10}
                  y1={minorY}
                  x2={cylinderX}
                  y2={minorY}
                  stroke="#64748b"
                  strokeWidth="1"
                />
              );
            })}

            {/* Label */}
            <text
              x={cylinderX - 24}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#475569"
              fontFamily="var(--font-body)"
            >
              {mark * 10}
            </text>
          </g>
        );
      })}

      {/* Glass highlight */}
      <path
        d="
          M 96 50
          Q 88 130 95 250
        "
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* Volume text */}
      <text
        x="110"
        y="155"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        opacity="0.65"
        fontFamily="var(--font-heading)"
        transform="rotate(-90 110 155)"
      >
        mL
      </text>

      {/* Label */}
      <text
        x="110"
        y="345"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Measuring Cylinder
      </text>
    </svg>
  );
}
