import React from "react";
import { motion } from "framer-motion";

export default function VernierCaliperSVG({
  measurement = 24.3,
  glow = false,
}) {
  const maxMeas = 50;
  const slideOffset = Math.min(measurement / maxMeas, 1) * 110;

  return (
    <svg
      viewBox="0 0 340 260"
      className="w-full h-full max-h-[260px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="vcMain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="40%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="vcSlide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="170"
        cy="240"
        rx="140"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.3"
      />

      {/* === MAIN SCALE (fixed jaw) === */}
      {/* Main beam */}
      <rect
        x="20"
        y="95"
        width="270"
        height="28"
        rx="3"
        fill="url(#vcMain)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <rect
        x="20"
        y="97"
        width="268"
        height="5"
        rx="2"
        fill="#ffffff"
        opacity="0.3"
      />

      {/* Main scale mm markings */}
      {Array.from({ length: 51 }).map((_, i) => {
        const x = 50 + i * 4.8;
        const isCm = i % 10 === 0;
        const isMid = i % 5 === 0;
        const h = isCm ? 16 : isMid ? 11 : 7;
        return (
          <g key={i}>
            <line
              x1={x}
              y1="95"
              x2={x}
              y2={95 + h}
              stroke="#475569"
              strokeWidth={isCm ? 1.2 : 0.5}
            />
            {isCm && (
              <text
                x={x}
                y="91"
                textAnchor="middle"
                fontSize="7"
                fill="#475569"
                fontWeight="600"
              >
                {i / 10}
              </text>
            )}
          </g>
        );
      })}
      <text x="300" y="91" fontSize="6" fill="#64748b">
        cm
      </text>

      {/* Fixed upper jaw */}
      <path
        d="M 20 123 L 20 80 Q 20 70 30 70 L 68 70 L 68 123 Z"
        fill="url(#vcMain)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Fixed lower jaw */}
      <path
        d="M 20 95 L 20 155 Q 20 165 30 165 L 68 165 L 68 123 L 20 123 Z"
        fill="url(#vcMain)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Inside measurement jaw (upper fixed) */}
      <path
        d="M 38 70 L 58 70 L 58 62 L 38 62 Z"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Tail (depth rod slot) */}
      <rect
        x="270"
        y="103"
        width="50"
        height="12"
        rx="2"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* === SLIDING JAW (vernier) === */}
      <motion.g
        animate={{ x: slideOffset }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
      >
        {/* Sliding jaw body */}
        <rect
          x="50"
          y="88"
          width="55"
          height="42"
          rx="2"
          fill="url(#vcSlide)"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Vernier scale (10 divisions over 9mm) */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 55 + i * 4.32;
          const isMajor = i % 5 === 0;
          return (
            <g key={i}>
              <line
                x1={x}
                y1="130"
                x2={x}
                y2={130 - (isMajor ? 10 : 6)}
                stroke="#1e293b"
                strokeWidth={isMajor ? 1 : 0.5}
              />
              {isMajor && (
                <text
                  x={x}
                  y="140"
                  textAnchor="middle"
                  fontSize="5.5"
                  fill="#334155"
                >
                  {i}
                </text>
              )}
            </g>
          );
        })}

        {/* Sliding lower jaw */}
        <path
          d="M 50 123 L 50 168 Q 50 178 60 178 L 92 178 L 100 130 L 100 123 Z"
          fill="url(#vcSlide)"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Sliding upper jaw (inside measure) */}
        <path
          d="M 68 88 L 90 88 L 90 62 L 68 62 Z"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1"
        />

        {/* Lock screw */}
        <circle
          cx="93"
          cy="110"
          r="5"
          fill="#475569"
          stroke="#334155"
          strokeWidth="1"
        />
        <line
          x1="90"
          y1="110"
          x2="96"
          y2="110"
          stroke="#94a3b8"
          strokeWidth="0.8"
        />
        <line
          x1="93"
          y1="107"
          x2="93"
          y2="113"
          stroke="#94a3b8"
          strokeWidth="0.8"
        />

        {/* Depth rod */}
        <rect
          x="100"
          y="107"
          width={55}
          height="4"
          rx="1"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.5"
        />
      </motion.g>

      {/* Reading display */}
      <rect x="110" y="165" width="90" height="24" rx="5" fill="#0f172a" />
      <text
        x="155"
        y="181"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#22d3ee"
        fontFamily="monospace"
      >
        {measurement.toFixed(1)} mm
      </text>

      {/* Label */}
      <text
        x="170"
        y="250"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Vernier Caliper
      </text>
    </svg>
  );
}
