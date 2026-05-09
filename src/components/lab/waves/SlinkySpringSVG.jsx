import React from "react";
import { motion } from "framer-motion";

export default function SlinkySpringSVG({ stretched = false, glow = false }) {
  const COILS = 18;
  const TOP_Y = 30;
  const BOT_Y = stretched ? 255 : 210;
  const TOTAL = BOT_Y - TOP_Y;
  const CX = 110;
  const AMP = 42;

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(156,163,175,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="slinkyCoilGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="30%" stopColor="#f1f5f9" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx={CX}
        cy="274"
        rx="46"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── SLINKY COILS ── */}
      {Array.from({ length: COILS }, (_, i) => {
        const t0 = i / COILS;
        const t1 = (i + 0.5) / COILS;
        const t2 = (i + 1) / COILS;
        const y0 = TOP_Y + t0 * TOTAL;
        const y1 = TOP_Y + t1 * TOTAL;
        const y2 = TOP_Y + t2 * TOTAL;
        // Perspective: depth varies as sine — front/back alternates
        const frontX = CX + AMP;
        const backX = CX - AMP;

        return (
          <g key={i}>
            {/* Back half (darker, behind) */}
            <path
              d={`M ${CX} ${y0} Q ${backX} ${(y0 + y1) / 2} ${CX} ${y1}`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Front half (lighter, in front) */}
            <path
              d={`M ${CX} ${y1} Q ${frontX} ${(y1 + y2) / 2} ${CX} ${y2}`}
              fill="none"
              stroke="url(#slinkyCoilGrad)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Highlight on front */}
            <path
              d={`M ${CX + 4} ${y1 + 2} Q ${frontX - 4} ${(y1 + y2) / 2} ${CX + 4} ${y2 - 2}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
          </g>
        );
      })}

      {/* Top coil end cap */}
      <ellipse
        cx={CX}
        cy={TOP_Y}
        rx={AMP + 3}
        ry="5"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Bottom coil end cap */}
      <motion.ellipse
        cx={CX}
        rx={AMP + 3}
        ry="7"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="2"
        initial={{ cy: BOT_Y }}
        animate={{ cy: BOT_Y }}
      />

      {/* Suspension string / hand hold */}
      <line
        x1={CX}
        y1="12"
        x2={CX}
        y2={TOP_Y}
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="3 2"
      />
      <circle
        cx={CX}
        cy="10"
        r="5"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Wave pulse if stretched */}
      {stretched && (
        <motion.ellipse
          cx={CX}
          cy={TOP_Y + TOTAL * 0.5}
          rx={AMP + 8}
          ry="12"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          opacity="0.4"
          animate={{
            cy: [TOP_Y + TOTAL * 0.3, TOP_Y + TOTAL * 0.7, TOP_Y + TOTAL * 0.3],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <text
        x="110"
        y="290"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Slinky Spring
      </text>
    </svg>
  );
}
