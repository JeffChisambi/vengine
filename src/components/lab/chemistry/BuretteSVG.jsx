import React from "react";
import { motion } from "framer-motion";

export default function BuretteSVG({
  liquidLevel = 0.72,
  liquidColor = "#38bdf8",
  droplet = true,
  glow = false,
  flowing = false,
}) {
  const tubeX = 108;
  const tubeY = 24;
  const tubeWidth = 24;
  const tubeHeight = 250;

  const liquidHeight = tubeHeight * liquidLevel;
  const liquidY = tubeY + tubeHeight - liquidHeight;

  return (
    <svg
      viewBox="0 0 240 420"
      className="w-full h-full max-h-[420px]"
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
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.94" />
        </linearGradient>

        {/* Tube clip */}
        <clipPath id="buretteClip">
          <rect
            x={tubeX}
            y={tubeY}
            width={tubeWidth}
            height={tubeHeight}
            rx="8"
          />
        </clipPath>
      </defs>

      {/* Hanging hook */}
      <path
        d="
          M 120 8
          Q 132 8 132 18
          Q 132 26 120 26
          Q 108 26 108 18
        "
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Main glass tube */}
      <rect
        x={tubeX}
        y={tubeY}
        width={tubeWidth}
        height={tubeHeight}
        rx="8"
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Top opening */}
      <ellipse
        cx="120"
        cy={tubeY}
        rx="12"
        ry="5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Liquid */}
      <g clipPath="url(#buretteClip)">
        <motion.rect
          x={tubeX + 1.5}
          width={tubeWidth - 3}
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
            duration: 1,
            ease: "easeInOut",
          }}
        />

        {/* Liquid surface */}
        <motion.ellipse
          cx="120"
          rx="9"
          ry="3"
          fill="#bae6fd"
          fillOpacity="0.45"
          initial={{
            cy: tubeY + tubeHeight,
          }}
          animate={{
            cy: liquidY + 2,
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
            cy="160"
            rx="12"
            ry="80"
            fill={liquidColor}
            fillOpacity="0.12"
            animate={{
              opacity: [0.06, 0.18, 0.06],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </g>

      {/* Graduations */}
      {Array.from({ length: 25 }).map((_, i) => {
        const y = tubeY + 10 + i * 10;
        const major = i % 5 === 0;

        return (
          <g key={i}>
            <line
              x1={major ? 90 : 98}
              y1={y}
              x2={108}
              y2={y}
              stroke="#475569"
              strokeWidth={major ? 1.5 : 1}
            />

            {major && (
              <text
                x="84"
                y={y + 4}
                textAnchor="end"
                fontSize="8"
                fill="#475569"
                fontFamily="var(--font-body)"
              >
                {i}
              </text>
            )}
          </g>
        );
      })}

      {/* Glass highlight */}
      <path
        d="
          M 114 36
          Q 110 150 116 260
        "
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        opacity="0.2"
        strokeLinecap="round"
      />

      {/* Stopcock */}
      <g>
        {/* Horizontal valve */}
        <rect x="92" y="282" width="56" height="12" rx="4" fill="#64748b" />

        {/* Valve center */}
        <circle cx="120" cy="288" r="9" fill="#475569" />

        {/* Handle */}
        <motion.rect
          x="117"
          y="268"
          width="6"
          height="40"
          rx="3"
          fill="#334155"
          animate={
            flowing
              ? {
                  rotate: [0, 18, 0],
                }
              : {}
          }
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: "120px 288px",
          }}
        />
      </g>

      {/* Narrow tip */}
      <path
        d="
          M 116 294
          L 124 294
          L 122 350
          Q 120 362 118 350
          Z
        "
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Flow stream */}
      {flowing && (
        <motion.path
          d="
            M 120 360
            Q 121 374 120 388
          "
          fill="none"
          stroke={liquidColor}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
        />
      )}

      {/* Droplet */}
      {droplet && (
        <motion.path
          d="
            M 120 388
            Q 130 404 120 418
            Q 110 404 120 388
          "
          fill={liquidColor}
          fillOpacity="0.92"
          initial={{
            y: -2,
            opacity: 0.7,
          }}
          animate={{
            y: [0, 5, 0],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Label */}
      <text
        x="120"
        y="408"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Laboratory Burette
      </text>
    </svg>
  );
}
