import React from "react";
import { motion } from "framer-motion";

export default function RoundBottomFlaskSVG({
  liquidLevel = 0.45,
  liquidColor = "#38bdf8",
  bubbling = false,
  boiling = false,
  glow = false,
}) {
  const flaskCenterX = 120;
  const flaskCenterY = 205;
  const flaskRadius = 82;

  const neckWidth = 38;
  const neckHeight = 90;

  // Liquid calculations
  const liquidHeight = flaskRadius * 2 * liquidLevel;
  const liquidY = flaskCenterY + flaskRadius - liquidHeight;

  const markings = [0.25, 0.5, 0.75];

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

        {/* Flask clip */}
        <clipPath id="roundFlaskClip">
          <path
            d="
              M 101 45
              L 101 120
              A 82 82 0 1 0 139 120
              L 139 45
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Flask body */}
      <path
        d="
          M 101 45
          L 101 120
          A 82 82 0 1 0 139 120
          L 139 45
          Z
        "
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Flask opening */}
      <ellipse
        cx={flaskCenterX}
        cy="45"
        rx={neckWidth / 2}
        ry="7"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Liquid */}
      <g clipPath="url(#roundFlaskClip)">
        {/* Main liquid */}
        <motion.rect
          x={38}
          width={164}
          fill="url(#liquidGrad)"
          initial={{
            y: flaskCenterY + flaskRadius,
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

        {/* Curved liquid surface */}
        <motion.ellipse
          cx={flaskCenterX}
          rx="60"
          ry="7"
          fill="#bae6fd"
          fillOpacity="0.42"
          initial={{
            cy: flaskCenterY + flaskRadius,
          }}
          animate={{
            cy: liquidY + 2,
          }}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
          }}
        />

        {/* Boiling effect */}
        {boiling && (
          <motion.ellipse
            cx={flaskCenterX}
            cy={liquidY + 4}
            rx="62"
            ry="8"
            fill="#ffffff"
            fillOpacity="0.18"
            animate={{
              ry: [7, 11, 7],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
            }}
          />
        )}

        {/* Glow core */}
        {glow && (
          <motion.circle
            cx={flaskCenterX}
            cy="220"
            r="45"
            fill={liquidColor}
            fillOpacity="0.12"
            animate={{
              scale: [1, 1.12, 1],
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
          [0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.circle
              key={i}
              cx={82 + i * 10}
              r={2 + Math.random() * 3}
              fill="#e0f2fe"
              fillOpacity="0.75"
              initial={{
                cy: 265,
                opacity: 0,
              }}
              animate={{
                cy: liquidY + 10,
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 1.8,
                delay: i * 0.12,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

        {/* Steam */}
        {boiling && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`
                  M ${112 + i * 10} 32
                  Q ${118 + i * 10} 18 ${114 + i * 10} 5
                `}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.5"
                initial={{
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  y: -10,
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.25,
                  repeat: Infinity,
                }}
              />
            ))}
          </>
        )}
      </g>

      {/* Measurement markings */}
      {markings.map((m, i) => {
        const y = flaskCenterY + flaskRadius - flaskRadius * 2 * m;

        return (
          <g key={i}>
            <line
              x1="175"
              y1={y}
              x2="188"
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />

            <text
              x="192"
              y={y + 4}
              fontSize="9"
              fill="#64748b"
              fontFamily="var(--font-body)"
            >
              {(m * 500).toFixed(0)} mL
            </text>
          </g>
        );
      })}

      {/* Glass highlight */}
      <path
        d="
          M 78 110
          Q 58 170 72 260
        "
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Bottom shadow */}
      <ellipse
        cx={flaskCenterX}
        cy="320"
        rx="72"
        ry="11"
        fill="#cbd5e1"
        fillOpacity="0.45"
      />

      {/* Label */}
      <text
        x={flaskCenterX}
        y="345"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Round-Bottom Flask
      </text>
    </svg>
  );
}
