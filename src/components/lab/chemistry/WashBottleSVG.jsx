import React from "react";
import { motion } from "framer-motion";

export default function WashBottleSVG({
  liquidLevel = 0.55,
  liquidColor = "#38bdf8",
  squirting = false,
  glow = false,
  label = "Distilled Water",
}) {
  const bottleX = 60;
  const bottleY = 70;
  const bottleWidth = 120;
  const bottleHeight = 210;

  const liquidHeight = bottleHeight * liquidLevel;
  const liquidY = bottleY + bottleHeight - liquidHeight;

  return (
    <svg
      viewBox="0 0 260 380"
      className="w-full h-full max-h-[380px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 18px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        {/* Plastic gradient */}
        <linearGradient id="plasticGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.92" />
        </linearGradient>

        {/* Liquid gradient */}
        <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.72" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.94" />
        </linearGradient>

        {/* Bottle clip */}
        <clipPath id="washBottleClip">
          <path
            d="
              M 95 70
              L 145 70
              Q 160 70 160 86
              L 160 102
              Q 180 112 180 140
              L 180 258
              Q 180 282 160 282
              L 80 282
              Q 60 282 60 258
              L 60 140
              Q 60 112 80 102
              L 80 86
              Q 80 70 95 70
              Z
            "
          />
        </clipPath>
      </defs>

      {/* Bottle body */}
      <path
        d="
          M 95 70
          L 145 70
          Q 160 70 160 86
          L 160 102
          Q 180 112 180 140
          L 180 258
          Q 180 282 160 282
          L 80 282
          Q 60 282 60 258
          L 60 140
          Q 60 112 80 102
          L 80 86
          Q 80 70 95 70
          Z
        "
        fill="url(#plasticGrad)"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Bottle cap */}
      <rect x="88" y="48" width="64" height="28" rx="6" fill="#475569" />

      {/* Cap grooves */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={94 + i * 9}
          y1="50"
          x2={94 + i * 9}
          y2="74"
          stroke="#64748b"
          strokeWidth="1"
        />
      ))}

      {/* Bent nozzle */}
      <path
        d="
          M 142 55
          Q 190 52 210 92
          Q 220 110 214 146
        "
        fill="none"
        stroke="#94a3b8"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Nozzle inner tube */}
      <path
        d="
          M 142 55
          Q 190 52 210 92
          Q 220 110 214 146
        "
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Liquid inside */}
      <g clipPath="url(#washBottleClip)">
        <motion.rect
          x={bottleX + 2}
          width={bottleWidth - 4}
          fill="url(#liquidGrad)"
          initial={{
            y: bottleY + bottleHeight,
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
          rx="50"
          ry="6"
          fill="#bae6fd"
          fillOpacity="0.45"
          initial={{
            cy: bottleY + bottleHeight,
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
            cy="180"
            rx="46"
            ry="78"
            fill={liquidColor}
            fillOpacity="0.12"
            animate={{
              opacity: [0.05, 0.16, 0.05],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </g>

      {/* Bottle label */}
      <rect
        x="78"
        y="165"
        width="84"
        height="44"
        rx="8"
        fill="#ffffff"
        fillOpacity="0.78"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      <text
        x="120"
        y="184"
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#334155"
        fontFamily="var(--font-heading)"
      >
        WASH BOTTLE
      </text>

      <text
        x="120"
        y="200"
        textAnchor="middle"
        fontSize="8"
        fill="#475569"
        fontFamily="var(--font-body)"
      >
        {label}
      </text>

      {/* Graduations */}
      {[0, 1, 2, 3].map((m) => {
        const y = 130 + m * 35;

        return (
          <g key={m}>
            <line
              x1="184"
              y1={y}
              x2="196"
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />

            <text
              x="202"
              y={y + 4}
              fontSize="8"
              fill="#64748b"
              fontFamily="var(--font-body)"
            >
              {(m + 1) * 100}
            </text>
          </g>
        );
      })}

      {/* Reflection */}
      <path
        d="
          M 82 92
          Q 72 170 90 248
        "
        fill="none"
        stroke="#ffffff"
        strokeWidth="8"
        opacity="0.2"
        strokeLinecap="round"
      />

      {/* Water stream */}
      {squirting && (
        <>
          <motion.path
            d="
              M 214 146
              Q 236 162 242 192
            "
            fill="none"
            stroke={liquidColor}
            strokeWidth="4"
            strokeLinecap="round"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
            }}
          />

          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              r={3 + i * 0.5}
              fill={liquidColor}
              fillOpacity="0.88"
              initial={{
                cx: 214,
                cy: 146,
                opacity: 0,
              }}
              animate={{
                cx: [214, 240 + i * 4],
                cy: [146, 190 + i * 6],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.15,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="330"
        rx="54"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.38"
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
        Laboratory Wash Bottle
      </text>
    </svg>
  );
}
