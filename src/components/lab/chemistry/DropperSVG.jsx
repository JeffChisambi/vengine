import React from "react";
import { motion } from "framer-motion";

export default function DropperSVG({
  liquidColor = "#38bdf8",
  filled = true,
  droplet = true,
  glow = false,
  squeezing = false,
}) {
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
      <defs>
        {/* Glass gradient */}
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.45" />
        </linearGradient>

        {/* Liquid gradient */}
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.72" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.92" />
        </linearGradient>

        {/* Glass clip */}
        <clipPath id="dropperClip">
          <path
            d="
              M 102 95
              Q 102 85 120 85
              Q 138 85 138 95
              L 132 240
              Q 130 282 120 308
              Q 110 282 108 240
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Rubber top */}
      <motion.path
        d="
          M 88 70
          Q 88 28 120 20
          Q 152 28 152 70
          Q 152 88 120 94
          Q 88 88 88 70
        "
        fill="#475569"
        animate={
          squeezing
            ? {
                scaleY: [1, 0.92, 1],
              }
            : {}
        }
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformOrigin: "120px 60px",
        }}
      />

      {/* Rubber highlight */}
      <ellipse cx="108" cy="42" rx="10" ry="16" fill="#ffffff" opacity="0.12" />

      {/* Glass tube */}
      <path
        d="
          M 102 95
          Q 102 85 120 85
          Q 138 85 138 95
          L 132 240
          Q 130 282 120 308
          Q 110 282 108 240
          Z
        "
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Liquid inside */}
      {filled && (
        <g clipPath="url(#dropperClip)">
          <motion.path
            fill="url(#liquidGrad)"
            initial={{
              d: `
                M 108 260
                L 132 260
                L 126 308
                Q 120 294 114 308
                Z
              `,
            }}
            animate={{
              d: `
                M 106 145
                Q 120 138 134 145
                L 128 250
                Q 126 286 120 304
                Q 114 286 112 250
                Z
              `,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />

          {/* Liquid highlight */}
          <motion.path
            d="
              M 114 150
              Q 118 146 121 150
              L 118 262
            "
            fill="none"
            stroke="#bae6fd"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.35"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </g>
      )}

      {/* Measurement markings */}
      {[0, 1, 2, 3, 4, 5].map((m) => {
        const y = 120 + m * 22;

        return (
          <g key={m}>
            <line
              x1="142"
              y1={y}
              x2="154"
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />

            <text
              x="160"
              y={y + 4}
              fontSize="8"
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
          M 114 102
          Q 108 190 116 272
        "
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        opacity="0.18"
        strokeLinecap="round"
      />

      {/* Droplet */}
      {droplet && (
        <motion.path
          d="
            M 120 314
            Q 130 330 120 346
            Q 110 330 120 314
          "
          fill={liquidColor}
          fillOpacity="0.9"
          initial={{
            y: -2,
            opacity: 0.7,
          }}
          animate={{
            y: [0, 6, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Glow effect */}
      {glow && (
        <motion.ellipse
          cx="120"
          cy="190"
          rx="34"
          ry="70"
          fill={liquidColor}
          fillOpacity="0.1"
          animate={{
            opacity: [0.06, 0.16, 0.06],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="352"
        rx="34"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Label */}
      <text
        x="120"
        y="22"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Laboratory Dropper
      </text>
    </svg>
  );
}
