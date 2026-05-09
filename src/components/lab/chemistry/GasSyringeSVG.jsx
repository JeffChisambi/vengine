import React from "react";
import { motion } from "framer-motion";

export default function GasSyringeSVG({ gasLevel = 0.5, glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="gasBarrel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.45" />
          <stop offset="25%" stopColor="#f8fafc" stopOpacity="0.9" />
          <stop offset="75%" stopColor="#f8fafc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="gasGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.3" />
        </linearGradient>
        <clipPath id="gasBarrelClip">
          <rect x="50" y="50" width="80" height="180" rx="2" />
        </clipPath>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="48"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── PLUNGER ROD (longer, thicker for gas syringe) ── */}
      <rect
        x="107"
        y="18"
        width="6"
        height="200"
        rx="2"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />

      {/* Plunger T-bar handle */}
      <rect
        x="82"
        y="12"
        width="56"
        height="10"
        rx="4"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <rect x="107" y="10" width="6" height="14" rx="2" fill="#64748b" />

      {/* Plunger disk/piston */}
      <ellipse
        cx="110"
        cy={50 + (1 - gasLevel) * 178}
        rx="38"
        ry="6"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <rect
        x="72"
        y={50 + (1 - gasLevel) * 178}
        width="76"
        height="10"
        rx="3"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1.5"
      />

      {/* ── BARREL (wider, glass) ── */}
      <rect
        x="50"
        y="50"
        width="80"
        height="180"
        rx="5"
        fill="url(#gasBarrel)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />
      {/* Gas fill */}
      <g clipPath="url(#gasBarrelClip)">
        <rect
          x="51"
          y={50 + (1 - gasLevel) * 178}
          width="78"
          height={gasLevel * 178}
          fill="url(#gasGrad)"
        />
        {/* Gas bubbles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={75 + i * 22}
            r="4"
            fill="#e0f2fe"
            fillOpacity="0.5"
            animate={{ cy: [200, 170, 200] }}
            transition={{
              duration: 3,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>

      {/* Barrel graduation marks (every 10 mL, typical 100 mL gas syringe) */}
      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((m, i) => (
        <g key={i}>
          <line
            x1="130"
            y1={50 + m * 178}
            x2={i % 2 === 0 ? 144 : 138}
            y2={50 + m * 178}
            stroke="#64748b"
            strokeWidth="1"
          />
          {i % 2 === 0 && (
            <text x="147" y={50 + m * 178 + 3.5} fontSize="7" fill="#64748b">
              {((1 - m) * 100).toFixed(0)}
            </text>
          )}
        </g>
      ))}
      <text x="150" y="240" fontSize="7" fill="#64748b">
        mL
      </text>

      {/* Barrel finger grips */}
      <rect
        x="44"
        y="196"
        width="8"
        height="14"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x="128"
        y="196"
        width="8"
        height="14"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Barrel highlight */}
      <line
        x1="56"
        y1="56"
        x2="56"
        y2="226"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.25"
        strokeLinecap="round"
      />

      {/* ── NOZZLE with stopcock ── */}
      <rect
        x="96"
        y="230"
        width="18"
        height="15"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Stopcock */}
      <rect
        x="88"
        y="238"
        width="34"
        height="7"
        rx="3"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />
      <circle cx="110" cy="242" r="3" fill="#1e293b" />
      {/* Tip */}
      <rect
        x="104"
        y="245"
        width="12"
        height="16"
        rx="2"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />
      <ellipse cx="110" cy="261" rx="4" ry="2" fill="#64748b" />

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Gas Syringe
      </text>
    </svg>
  );
}
