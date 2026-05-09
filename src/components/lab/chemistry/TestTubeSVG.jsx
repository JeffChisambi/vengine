import React from "react";
import { motion } from "framer-motion";

export default function TestTubeSVG({
  liquidLevel = 0.5,
  liquidColor = "#38bdf8",
  showObject = false,
  objectColor = "#8B5CF6",
  bubbling = false,
}) {
  const tubeWidth = 70;
  const tubeHeight = 240;
  const tubeX = 75;
  const tubeY = 30;

  // Inner liquid calculations
  const liquidMaxHeight = tubeHeight - 20;
  const liquidHeight = liquidMaxHeight * liquidLevel;
  const liquidY = tubeY + tubeHeight - liquidHeight;

  const markings = [0.2, 0.4, 0.6, 0.8];

  return (
    <svg
      viewBox="0 0 220 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      {/* Definitions */}
      <defs>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.65" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.9" />
        </linearGradient>

        {/* Clip path for liquid */}
        <clipPath id="tubeClip">
          <path
            d={`
              M ${tubeX} ${tubeY}
              L ${tubeX} ${tubeY + tubeHeight - 35}
              A ${tubeWidth / 2} ${tubeWidth / 2} 0 0 0 ${tubeX + tubeWidth} ${tubeY + tubeHeight - 35}
              L ${tubeX + tubeWidth} ${tubeY}
              Z
            `}
          />
        </clipPath>
      </defs>

      {/* Test tube body */}
      <path
        d={`
          M ${tubeX} ${tubeY}
          L ${tubeX} ${tubeY + tubeHeight - 35}
          A ${tubeWidth / 2} ${tubeWidth / 2} 0 0 0 ${tubeX + tubeWidth} ${tubeY + tubeHeight - 35}
          L ${tubeX + tubeWidth} ${tubeY}
        `}
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="3"
      />

      {/* Open rim */}
      <ellipse
        cx={tubeX + tubeWidth / 2}
        cy={tubeY}
        rx={tubeWidth / 2}
        ry="8"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Liquid */}
      <g clipPath="url(#tubeClip)">
        <motion.rect
          x={tubeX + 2}
          width={tubeWidth - 4}
          fill="url(#liquidGrad)"
          initial={{
            y: tubeY + tubeHeight,
            height: 0,
          }}
          animate={{
            y: liquidY,
            height: liquidHeight,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />

        {/* Liquid surface */}
        <motion.ellipse
          cx={tubeX + tubeWidth / 2}
          rx={tubeWidth / 2 - 4}
          ry="4"
          fill="#bae6fd"
          fillOpacity="0.45"
          initial={{
            cy: tubeY + tubeHeight,
          }}
          animate={{
            cy: liquidY + 2,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />

        {/* Floating object */}
        {showObject && (
          <motion.g
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <circle
              cx={tubeX + tubeWidth / 2}
              cy={tubeY + tubeHeight - 65}
              r="16"
              fill={objectColor}
              fillOpacity="0.9"
            />

            <circle
              cx={tubeX + tubeWidth / 2 - 5}
              cy={tubeY + tubeHeight - 70}
              r="4"
              fill="#ffffff"
              fillOpacity="0.35"
            />
          </motion.g>
        )}

        {/* Bubbles */}
        {bubbling &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.circle
              key={i}
              cx={tubeX + 20 + i * 8}
              r={2 + Math.random() * 2}
              fill="#dbeafe"
              fillOpacity="0.7"
              initial={{
                cy: tubeY + tubeHeight - 40,
                opacity: 0,
              }}
              animate={{
                cy: liquidY + 10,
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
      </g>

      {/* Measurement markings */}
      {markings.map((m, i) => {
        const y = tubeY + tubeHeight - liquidMaxHeight * m;

        return (
          <g key={i}>
            <line
              x1={tubeX + tubeWidth + 5}
              y1={y}
              x2={tubeX + tubeWidth + 18}
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />

            <text
              x={tubeX + tubeWidth + 22}
              y={y + 4}
              fontSize="9"
              fill="#64748b"
              fontFamily="var(--font-body)"
            >
              {(m * 100).toFixed(0)} mL
            </text>
          </g>
        );
      })}

      {/* Bottom shadow */}
      <ellipse
        cx={tubeX + tubeWidth / 2}
        cy={tubeY + tubeHeight + 18}
        rx="42"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.5"
      />

      {/* Label */}
      <text
        x={110}
        y={335}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Laboratory Test Tube
      </text>
    </svg>
  );
}
