import React from "react";
import { motion } from "framer-motion";

export default function FunnelSVG({
  liquidColor = "#38bdf8",
  showLiquid = true,
  pouring = false,
  glow = false,
}) {
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
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.94" />
        </linearGradient>

        {/* Funnel clip */}
        <clipPath id="funnelClip">
          <path
            d="
              M 40 60
              L 200 60
              L 145 170
              L 132 315
              Q 132 326 120 326
              Q 108 326 108 315
              L 95 170
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Funnel body */}
      <path
        d="
          M 40 60
          L 200 60
          L 145 170
          L 132 315
          Q 132 326 120 326
          Q 108 326 108 315
          L 95 170
          Z
        "
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Top opening */}
      <ellipse
        cx="120"
        cy="60"
        rx="80"
        ry="10"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Liquid inside */}
      {showLiquid && (
        <g clipPath="url(#funnelClip)">
          {/* Upper liquid */}
          <motion.path
            fill="url(#liquidGrad)"
            initial={{
              d: `
                M 60 150
                L 180 150
                L 135 250
                L 105 250
                Z
              `,
            }}
            animate={{
              d: `
                M 54 110
                Q 120 100 186 110
                L 138 245
                L 102 245
                Z
              `,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />

          {/* Stem liquid */}
          <motion.rect
            x="111"
            y="210"
            width="18"
            height="110"
            rx="8"
            fill="url(#liquidGrad)"
            initial={{
              height: 0,
              y: 320,
            }}
            animate={{
              height: 110,
              y: 210,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />

          {/* Liquid surface */}
          <motion.ellipse
            cx="120"
            rx="58"
            ry="6"
            fill="#bae6fd"
            fillOpacity="0.45"
            initial={{
              cy: 150,
            }}
            animate={{
              cy: 110,
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />

          {/* Internal glow */}
          {glow && (
            <motion.ellipse
              cx="120"
              cy="170"
              rx="44"
              ry="80"
              fill={liquidColor}
              fillOpacity="0.1"
              animate={{
                opacity: [0.05, 0.16, 0.05],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </g>
      )}

      {/* Glass reflection */}
      <path
        d="
          M 78 72
          Q 66 140 92 240
        "
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        opacity="0.18"
        strokeLinecap="round"
      />

      {/* Pouring stream */}
      {pouring && (
        <motion.path
          d="
            M 120 326
            Q 122 344 120 360
          "
          fill="none"
          stroke={liquidColor}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [0.2, 0.95, 0.2],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
          }}
        />
      )}

      {/* Droplets */}
      {pouring &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="120"
            r={3 + i}
            fill={liquidColor}
            fillOpacity="0.85"
            initial={{
              cy: 330,
              opacity: 0,
            }}
            animate={{
              cy: [330, 360 + i * 10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: i * 0.22,
              repeat: Infinity,
              ease: "easeIn",
            }}
          />
        ))}

      {/* Stand shadow */}
      <ellipse
        cx="120"
        cy="344"
        rx="42"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Label */}
      <text
        x="120"
        y="356"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Laboratory Funnel
      </text>
    </svg>
  );
}
