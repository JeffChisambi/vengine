import React from "react";
import { motion } from "framer-motion";

export default function BellJarSVG({
  vacuum = false,
  objectInside = true,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 18px rgba(148,163,184,0.35))"
          : "drop-shadow(0 4px 14px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="bjGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.55" />
          <stop offset="28%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="bjBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <radialGradient id="bjInner" cx="50%" cy="30%" r="60%">
          <stop
            offset="0%"
            stopColor={vacuum ? "#0f172a" : "#f0f9ff"}
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor={vacuum ? "#0f172a" : "#e0f2fe"}
            stopOpacity="0.06"
          />
        </radialGradient>
        <clipPath id="bjClip">
          <path d="M 120 48 Q 48 52 38 160 Q 30 230 30 260 L 210 260 Q 210 230 202 160 Q 192 52 120 48 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="298"
        rx="78"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Base plate — heavy flat */}
      <rect
        x="30"
        y="258"
        width="180"
        height="22"
        rx="4"
        fill="url(#bjBase)"
        stroke="#475569"
        strokeWidth="2"
      />
      <rect
        x="34"
        y="260"
        width="172"
        height="6"
        rx="3"
        fill="#e2e8f0"
        opacity="0.3"
      />

      {/* Vacuum valve on base */}
      <rect
        x="104"
        y="254"
        width="32"
        height="10"
        rx="4"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />
      <circle
        cx="120"
        cy="254"
        r="4"
        fill="#334155"
        stroke="#475569"
        strokeWidth="1"
      />
      <circle cx="120" cy="254" r="2" fill="#94a3b8" />
      {/* Valve nozzle */}
      <rect
        x="116"
        y="246"
        width="8"
        height="10"
        rx="3"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />

      {/* Inner atmosphere tint */}
      <path
        d="M 120 48 Q 48 52 38 160 Q 30 230 30 260 L 210 260 Q 210 230 202 160 Q 192 52 120 48 Z"
        fill="url(#bjInner)"
      />

      {/* Object inside (small flask or candle) */}
      {objectInside && (
        <g>
          {/* Simple small object — a candle */}
          <rect
            x="112"
            y="220"
            width="16"
            height="35"
            rx="2"
            fill="#fef3c7"
            stroke="#fbbf24"
            strokeWidth="1"
          />
          {/* Flame */}
          {!vacuum ? (
            <motion.path
              d="M 120 218 Q 114 208 116 200 Q 120 194 124 200 Q 126 208 120 218 Z"
              fill="#fbbf24"
              animate={{
                d: [
                  "M 120 218 Q 113 206 116 199 Q 120 193 124 199 Q 127 206 120 218 Z",
                  "M 120 218 Q 115 208 117 200 Q 120 195 123 200 Q 125 208 120 218 Z",
                  "M 120 218 Q 113 206 116 199 Q 120 193 124 199 Q 127 206 120 218 Z",
                ],
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          ) : (
            /* Extinguished — smoke wisp */
            <motion.path
              d="M 120 218 Q 118 210 120 204"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {/* Wick */}
          <line
            x1="120"
            y1="220"
            x2="120"
            y2="215"
            stroke="#78716c"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Vacuum pressure lines */}
      {vacuum && (
        <g clipPath="url(#bjClip)">
          {[0, 1, 2, 3].map((i) => (
            <motion.ellipse
              key={i}
              cx="120"
              cy={150 + i * 28}
              rx={50 - i * 6}
              ry="8"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.6"
              strokeDasharray="4,4"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </g>
      )}

      {/* Bell jar glass body */}
      <path
        d="M 120 48 Q 48 52 38 160 Q 30 230 30 260 L 210 260 Q 210 230 202 160 Q 192 52 120 48 Z"
        fill="url(#bjGlass)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Glass highlights — left broad */}
      <path
        d="M 52 100 Q 40 160 42 240"
        stroke="#ffffff"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.16"
      />
      {/* Glass highlights — thin secondary */}
      <path
        d="M 70 75 Q 58 130 60 200"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.12"
      />

      {/* Right side shadow crescent */}
      <path
        d="M 188 100 Q 198 160 196 240"
        stroke="#94a3b8"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.12"
      />

      {/* Top knob */}
      <ellipse
        cx="120"
        cy="48"
        rx="16"
        ry="6"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <rect
        x="114"
        y="32"
        width="12"
        height="18"
        rx="6"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <ellipse
        cx="120"
        cy="32"
        rx="10"
        ry="5"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Vacuum label */}
      {vacuum && (
        <text
          x="120"
          y="145"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#475569"
          opacity="0.55"
          letterSpacing="2"
        >
          VACUUM
        </text>
      )}

      {/* Label */}
      <text
        x="120"
        y="320"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Bell Jar
      </text>
    </svg>
  );
}
