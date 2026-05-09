import React from "react";
import { motion } from "framer-motion";

export default function WaveMachineSVG({ running = true, glow = false }) {
  const RODS = 14;
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(99,102,241,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="wmFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="75"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── FRAME ── */}
      {/* Two side rails */}
      <rect
        x="18"
        y="70"
        width="12"
        height="170"
        rx="4"
        fill="url(#wmFrame)"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <rect
        x="190"
        y="70"
        width="12"
        height="170"
        rx="4"
        fill="url(#wmFrame)"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Top and bottom crossbars */}
      <rect
        x="18"
        y="68"
        width="184"
        height="10"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      <rect
        x="18"
        y="230"
        width="184"
        height="10"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Legs */}
      <rect x="20" y="240" width="12" height="36" rx="3" fill="#94a3b8" />
      <rect x="188" y="240" width="12" height="36" rx="3" fill="#94a3b8" />
      {/* Feet */}
      <rect x="14" y="272" width="24" height="6" rx="2" fill="#64748b" />
      <rect x="182" y="272" width="24" height="6" rx="2" fill="#64748b" />

      {/* ── SPINE (central torsion bar) ── */}
      <rect
        x="106"
        y="72"
        width="8"
        height="162"
        rx="2"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* ── PENDULUM RODS ── */}
      {Array.from({ length: RODS }, (_, i) => {
        const x = 30 + i * 12;
        const phase = (i / RODS) * Math.PI * 2;
        const baseAngle = running ? Math.sin(phase) * 35 : 0;
        return (
          <motion.g
            key={i}
            style={{ transformOrigin: `${x}px 150px` }}
            animate={
              running
                ? { rotate: [baseAngle, -baseAngle, baseAngle] }
                : { rotate: 0 }
            }
            transition={{
              duration: 1.8,
              delay: (i / RODS) * 0.9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Rod */}
            <line
              x1={x}
              y1="90"
              x2={x}
              y2="212"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Ball weight */}
            <circle
              cx={x}
              cy="84"
              r="7"
              fill="#818cf8"
              stroke="#4338ca"
              strokeWidth="1.5"
            />
            <circle
              cx={x}
              cy="218"
              r="7"
              fill="#818cf8"
              stroke="#4338ca"
              strokeWidth="1.5"
            />
            {/* Shine */}
            <circle cx={x - 2} cy="82" r="2" fill="#c7d2fe" opacity="0.7" />
          </motion.g>
        );
      })}

      {/* Motor unit on right side */}
      <rect
        x="185"
        y="138"
        width="18"
        height="26"
        rx="4"
        fill="#334155"
        stroke="#1e293b"
        strokeWidth="1.5"
      />
      {running && (
        <motion.circle
          cx="194"
          cy="151"
          r="4"
          fill="#22c55e"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Wave Machine
      </text>
    </svg>
  );
}
