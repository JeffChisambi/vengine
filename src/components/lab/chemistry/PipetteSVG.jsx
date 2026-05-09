import React from "react";
import { motion } from "framer-motion";

export default function PipetteSVG({
  liquidColor = "#38bdf8",
  filled = true,
  droplet = true,
  glow = false,
  angle = -18,
}) {
  const tubeLength = 210;
  const tubeThickness = 16;

  return (
    <svg
      viewBox="0 0 320 220"
      className="w-full h-full max-h-[220px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 10px rgba(0,0,0,0.08))",
      }}
    >
      <g transform={`rotate(${angle} 160 110)`}>
        {/* Definitions */}
        <defs>
          {/* Glass gradient */}
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.45" />
          </linearGradient>

          {/* Liquid gradient */}
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={liquidColor} stopOpacity="0.72" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="0.92" />
          </linearGradient>

          {/* Clip for liquid */}
          <clipPath id="pipetteClip">
            <path
              d="
                M 52 100
                Q 45 100 45 110
                Q 45 120 52 120
                L 215 120
                Q 228 120 236 110
                Q 228 100 215 100
                Z
              "
            />
          </clipPath>
        </defs>

        {/* Rubber bulb */}
        <ellipse cx="48" cy="110" rx="24" ry="32" fill="#0f172a" />

        {/* Bulb highlight */}

        {/* Glass tube */}
        <path
          d="
            M 52 100
            Q 45 100 45 110
            Q 45 120 52 120
            L 215 120
            Q 228 120 236 110
            Q 228 100 215 100
            Z
          "
          fill="url(#glassGrad)"
          stroke="#94a3b8"
          strokeWidth="2.5"
        />

        {/* Narrow tip */}
        <path
          d="
            M 236 106
            L 286 110
            L 236 114
            Z
          "
          fill="url(#glassGrad)"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Liquid inside */}
        {filled && (
          <g clipPath="url(#pipetteClip)">
            <motion.rect
              x="50"
              y="102"
              height={tubeThickness}
              fill="url(#liquidGrad)"
              initial={{
                width: 0,
              }}
              animate={{
                width: tubeLength * 0.72,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
            />

            {/* Liquid highlight */}
            <motion.rect
              x="52"
              y="104"
              height="4"
              fill="#bae6fd"
              fillOpacity="0.45"
              initial={{
                width: 0,
              }}
              animate={{
                width: tubeLength * 0.68,
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
              }}
            />
          </g>
        )}

        {/* Measurement markings */}
        {[0, 1, 2, 3, 4, 5, 6].map((m) => {
          const x = 82 + m * 18;

          return (
            <g key={m}>
              <line
                x1={x}
                y1="96"
                x2={x}
                y2="88"
                stroke="#64748b"
                strokeWidth="1"
              />

              <text
                x={x}
                y="82"
                textAnchor="middle"
                fontSize="7"
                fill="#64748b"
                fontFamily="var(--font-body)"
              >
                {m + 1}
              </text>
            </g>
          );
        })}

        {/* Glass reflection */}
        <path
          d="
            M 65 103
            Q 130 96 205 102
          "
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.18"
          strokeLinecap="round"
        />

        {/* Droplet */}
        {droplet && (
          <motion.path
            d="
              M 292 110
              Q 300 122 292 134
              Q 284 122 292 110
            "
            fill={liquidColor}
            fillOpacity="0.88"
            initial={{
              y: -2,
              opacity: 0,
            }}
            animate={{
              y: [0, 4, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Small glow inside liquid */}
        {glow && (
          <motion.ellipse
            cx="155"
            cy="110"
            rx="50"
            ry="10"
            fill={liquidColor}
            fillOpacity="0.14"
            animate={{
              opacity: [0.08, 0.18, 0.08],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </g>

      {/* Shadow */}
      <ellipse
        cx="160"
        cy="188"
        rx="85"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Label */}
      <text
        x="160"
        y="208"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Laboratory Pipette
      </text>
    </svg>
  );
}
