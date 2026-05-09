import React from "react";
import { motion } from "framer-motion";

export default function InductorSVG({ coreType = "air", glow = false }) {
  const hasIronCore = coreType === "iron";
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(99,102,241,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="coilGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="30%" stopColor="#fde68a" />
          <stop offset="70%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="inductLead" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="62"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Iron core (dashed parallel lines) */}
      {hasIronCore && (
        <>
          <line
            x1="98"
            y1="100"
            x2="98"
            y2="202"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="105"
            y1="100"
            x2="105"
            y2="202"
            stroke="#475569"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}

      {/* ── LEADS ── */}
      <line
        x1="18"
        y1="152"
        x2="58"
        y2="152"
        stroke="url(#inductLead)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="162"
        y1="152"
        x2="202"
        y2="152"
        stroke="url(#inductLead)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* ── COIL LOOPS (8 half-circles = 8 turns) ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const cx = 66 + i * 12;
        return (
          <g key={i}>
            {/* Back half (shadow) */}
            <path
              d={`M ${cx} 152 A 6 18 0 0 0 ${cx + 12} 152`}
              fill="none"
              stroke="#92400e"
              strokeWidth="4"
              opacity="0.4"
            />
            {/* Front half */}
            <path
              d={`M ${cx} 152 A 6 18 0 0 1 ${cx + 12} 152`}
              fill="none"
              stroke="url(#coilGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Highlight on front */}
            <path
              d={`M ${cx + 2} 148 A 4 12 0 0 1 ${cx + 10} 148`}
              fill="none"
              stroke="#fef3c7"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </g>
        );
      })}

      {/* Connecting points to leads */}
      <line
        x1="58"
        y1="152"
        x2="66"
        y2="152"
        stroke="url(#inductLead)"
        strokeWidth="5"
      />
      <line
        x1="162"
        y1="152"
        x2="162"
        y2="152"
        stroke="url(#inductLead)"
        strokeWidth="5"
      />

      {/* Value label */}
      <text
        x="110"
        y="112"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#92400e"
      >
        10 mH
      </text>

      {/* Core type label */}
      <text x="110" y="200" textAnchor="middle" fontSize="9" fill="#64748b">
        {hasIronCore ? "Iron Core" : "Air Core"}
      </text>

      {/* Magnetic field lines */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx="110"
          cy="152"
          rx={30 + i * 18}
          ry={12 + i * 6}
          fill="none"
          stroke="#818cf8"
          strokeWidth="1"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Inductor / Coil
      </text>
    </svg>
  );
}
