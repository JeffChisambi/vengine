import React from "react";
import { motion } from "framer-motion";

export default function GasJarSVG({
  gasColor = "#bbf7d0",
  gasFilled = true,
  lidOn = true,
  glow = false,
}) {
  const jarX = 70;
  const jarY = 60;
  const jarW = 100;
  const jarH = 210;

  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 16px ${gasColor}88)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="gjGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="gjGas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gasColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={gasColor} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gjLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <clipPath id="gjClip">
          <rect x={jarX} y={jarY} width={jarW} height={jarH} rx="4" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="296"
        rx="58"
        ry="9"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Gas fill */}
      {gasFilled && (
        <g clipPath="url(#gjClip)">
          <rect
            x={jarX}
            y={jarY}
            width={jarW}
            height={jarH}
            fill="url(#gjGas)"
          />
          {/* Gas particle dots */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.circle
              key={i}
              cx={jarX + 15 + (i % 3) * 35 + (Math.floor(i / 3) % 2) * 15}
              cy={jarY + 30 + Math.floor(i / 3) * 55}
              r={2 + (i % 2)}
              fill={gasColor}
              fillOpacity="0.6"
              animate={{
                cy: [
                  jarY + 30 + Math.floor(i / 3) * 55,
                  jarY + 20 + Math.floor(i / 3) * 55,
                  jarY + 30 + Math.floor(i / 3) * 55,
                ],
              }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      )}

      {/* Jar body - tall rectangular */}
      <rect
        x={jarX}
        y={jarY}
        width={jarW}
        height={jarH}
        fill="url(#gjGlass)"
        stroke="#94a3b8"
        strokeWidth="2.5"
        rx="4"
      />

      {/* Measurement markings (right side) */}
      {[0.25, 0.5, 0.75].map((m, i) => {
        const y = jarY + jarH - jarH * m;
        return (
          <g key={i}>
            <line
              x1={jarX + jarW}
              y1={y}
              x2={jarX + jarW + 12}
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />
            <text x={jarX + jarW + 16} y={y + 3.5} fontSize="8" fill="#64748b">
              {(m * 1000).toFixed(0)}
            </text>
          </g>
        );
      })}
      <text x={jarX + jarW + 16} y={jarY + 8} fontSize="7" fill="#94a3b8">
        mL
      </text>

      {/* Glass highlight */}
      <line
        x1={jarX + 8}
        y1={jarY + 12}
        x2={jarX + 8}
        y2={jarY + jarH - 15}
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Rim */}
      <rect
        x={jarX - 4}
        y={jarY - 8}
        width={jarW + 8}
        height="14"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <rect
        x={jarX - 2}
        y={jarY - 6}
        width={jarW + 4}
        height="6"
        rx="2"
        fill="#f8fafc"
        opacity="0.5"
      />

      {/* Lid / cover plate */}
      {lidOn && (
        <g>
          <rect
            x={jarX - 8}
            y={jarY - 22}
            width={jarW + 16}
            height="16"
            rx="4"
            fill="url(#gjLid)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <rect
            x={jarX - 6}
            y={jarY - 20}
            width={jarW + 12}
            height="4"
            rx="2"
            fill="#ffffff"
            opacity="0.3"
          />
          {/* Lid handle */}
          <rect
            x="108"
            y={jarY - 36}
            width="24"
            height="16"
            rx="5"
            fill="url(#gjLid)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1="112"
            y1={jarY - 28}
            x2="128"
            y2={jarY - 28}
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.3"
          />
        </g>
      )}

      {/* Gas label */}
      {gasFilled && (
        <text
          x="120"
          y="170"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={gasColor === "#bbf7d0" ? "#166534" : "#1e40af"}
          opacity="0.6"
        >
          GAS
        </text>
      )}

      {/* Label */}
      <text
        x="120"
        y="325"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Gas Jar
      </text>
    </svg>
  );
}
