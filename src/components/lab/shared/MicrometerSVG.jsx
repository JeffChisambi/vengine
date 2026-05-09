import React from "react";
import { motion } from "framer-motion";

export default function MicrometerSVG({ measurement = 7.32, glow = false }) {
  const thimbleOffset = Math.min((measurement % 25) / 25, 1) * 45;

  return (
    <svg
      viewBox="0 0 340 240"
      className="w-full h-full max-h-[240px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="micFrame" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="micThimble" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="30%" stopColor="#e2e8f0" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="micSleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="170"
        cy="222"
        rx="120"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.3"
      />

      {/* U-frame (C-frame) */}
      <path
        d="M 30 90 Q 30 50 60 50 L 80 50 L 80 68 Q 60 68 60 90 L 60 148 Q 60 170 80 170 L 80 188 L 60 188 Q 30 188 30 148 Z"
        fill="url(#micFrame)"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Frame back connecting bottom */}
      <rect x="30" y="109" width="32" height="20" rx="2" fill="#475569" />

      {/* Anvil (fixed) */}
      <circle
        cx="80"
        cy="119"
        r="9"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <circle cx="80" cy="119" r="5" fill="#e2e8f0" />
      <line
        x1="80"
        y1="50"
        x2="80"
        y2="68"
        stroke="url(#micFrame)"
        strokeWidth="10"
      />

      {/* Sleeve (barrel) */}
      <rect
        x="90"
        y="108"
        width="120"
        height="22"
        rx="5"
        fill="url(#micSleeve)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line
        x1="92"
        y1="119"
        x2="208"
        y2="119"
        stroke="#94a3b8"
        strokeWidth="0.5"
      />

      {/* Main scale on sleeve */}
      {Array.from({ length: 13 }).map((_, i) => {
        const x = 96 + i * 8.5;
        const isMajor = i % 2 === 0;
        return (
          <g key={i}>
            <line
              x1={x}
              y1="108"
              x2={x}
              y2={108 + (isMajor ? 9 : 6)}
              stroke="#475569"
              strokeWidth={isMajor ? 1 : 0.5}
            />
            <line
              x1={x}
              y1="130"
              x2={x}
              y2={130 - (isMajor ? 9 : 6)}
              stroke="#475569"
              strokeWidth={isMajor ? 1 : 0.5}
            />
            {isMajor && (
              <text
                x={x}
                y="106"
                textAnchor="middle"
                fontSize="6.5"
                fill="#475569"
              >
                {i * 0.5}
              </text>
            )}
          </g>
        );
      })}

      {/* Thimble */}
      <motion.g
        animate={{ x: -thimbleOffset }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
      >
        {/* Thimble body */}
        <rect
          x="168"
          y="100"
          width="72"
          height="38"
          rx="6"
          fill="url(#micThimble)"
          stroke="#475569"
          strokeWidth="1.5"
        />
        {/* Thimble bevel edge */}
        <rect x="168" y="100" width="8" height="38" rx="3" fill="#94a3b8" />
        <line
          x1="170"
          y1="103"
          x2="170"
          y2="135"
          stroke="#e2e8f0"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Thimble scale (50 divisions) */}
        {Array.from({ length: 25 }).map((_, i) => {
          const y = 102 + i * 1.45;
          const isMajor = i % 5 === 0;
          return (
            <g key={i}>
              <line
                x1="175"
                y1={y}
                x2={isMajor ? 192 : 186}
                y2={y}
                stroke="#334155"
                strokeWidth={isMajor ? 1 : 0.4}
              />
              {isMajor && (
                <text x="196" y={y + 2.5} fontSize="5.5" fill="#334155">
                  {i * 2}
                </text>
              )}
            </g>
          );
        })}

        {/* Ratchet */}
        <rect
          x="232"
          y="104"
          width="22"
          height="30"
          rx="8"
          fill="#475569"
          stroke="#334155"
          strokeWidth="1.5"
        />
        {/* Ratchet knurling */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1="232"
            y1={108 + i * 4.5}
            x2="254"
            y2={108 + i * 4.5}
            stroke="#64748b"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
        {/* Ratchet tip */}
        <circle
          cx="254"
          cy="119"
          r="6"
          fill="#64748b"
          stroke="#475569"
          strokeWidth="1"
        />
      </motion.g>

      {/* Spindle (moving) */}
      <motion.g
        animate={{ x: -thimbleOffset }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
      >
        <rect
          x="90"
          y="115"
          width="82"
          height="8"
          rx="4"
          fill="#cbd5e1"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        <circle
          cx="90"
          cy="119"
          r="9"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        <circle cx="90" cy="119" r="5" fill="#e2e8f0" />
      </motion.g>

      {/* Lock nut */}
      <rect
        x="152"
        y="113"
        width="12"
        height="12"
        rx="3"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Reading display */}
      <rect x="75" y="178" width="90" height="22" rx="5" fill="#0f172a" />
      <text
        x="120"
        y="193"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#22d3ee"
        fontFamily="monospace"
      >
        {measurement.toFixed(2)} mm
      </text>

      {/* Label */}
      <text
        x="170"
        y="230"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#475569"
      >
        Micrometer Screw Gauge
      </text>
    </svg>
  );
}
