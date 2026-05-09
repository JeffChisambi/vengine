import React from "react";
import { motion } from "framer-motion";

export default function FumeHoodSVG({
  sashOpen = 0.5,
  fanOn = false,
  lightOn = true,
  glow = false,
}) {
  const sashY = 60 + (1 - sashOpen) * 120;

  return (
    <svg
      viewBox="0 0 280 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(56,189,248,0.25))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="hoodBodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="glassPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.15" />
        </linearGradient>
        <clipPath id="sashClip">
          <rect x="35" y="55" width="210" height="130" />
        </clipPath>
      </defs>

      {/* Exhaust duct on top */}
      <rect
        x="110"
        y="8"
        width="60"
        height="30"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="2"
      />
      <rect x="118" y="4" width="44" height="8" rx="2" fill="#64748b" />

      {/* Fan indicator */}
      {fanOn && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "140px 18px" }}
        >
          <line
            x1="140"
            y1="10"
            x2="140"
            y2="26"
            stroke="#475569"
            strokeWidth="2"
          />
          <line
            x1="132"
            y1="18"
            x2="148"
            y2="18"
            stroke="#475569"
            strokeWidth="2"
          />
        </motion.g>
      )}

      {/* Main hood body */}
      <motion.rect
        x="25"
        y="38"
        width="230"
        height="160"
        rx="4"
        fill="url(#hoodBodyGrad)"
        stroke="#94a3b8"
        strokeWidth="2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Interior */}
      <rect
        x="35"
        y="55"
        width="210"
        height="130"
        rx="2"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Interior light */}
      {lightOn && (
        <rect
          x="60"
          y="56"
          width="160"
          height="4"
          rx="1"
          fill="#fef9c3"
          opacity="0.6"
        />
      )}
      {lightOn && (
        <rect
          x="35"
          y="55"
          width="210"
          height="130"
          rx="2"
          fill="#fefce8"
          fillOpacity="0.12"
        />
      )}

      {/* Interior back wall */}
      <rect
        x="36"
        y="56"
        width="208"
        height="128"
        rx="1"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="0.5"
      />

      {/* Small beaker inside */}
      <path
        d="M 100 155 L 100 140 L 90 140 L 85 155 Q 92 162 105 155 Z"
        fill="#bfdbfe"
        fillOpacity="0.4"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <rect
        x="90"
        y="145"
        width="10"
        height="8"
        fill="#38bdf8"
        fillOpacity="0.5"
      />

      {/* Erlenmeyer inside */}
      <path
        d="M 160 155 L 150 130 L 148 125 L 162 125 L 160 130 L 170 155 Q 165 160 155 155 Z"
        fill="#bfdbfe"
        fillOpacity="0.3"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Glass sash */}
      <motion.rect
        x="35"
        width="210"
        height={sashOpen * 120}
        rx="2"
        fill="url(#glassPanel)"
        stroke="#93c5fd"
        strokeWidth="2"
        initial={{ y: 55, height: 0 }}
        animate={{ y: 55, height: sashOpen * 120 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Sash handle */}
      <motion.rect
        x="120"
        width="40"
        height="6"
        rx="3"
        fill="#64748b"
        initial={{ y: 55 }}
        animate={{ y: 55 + sashOpen * 120 - 3 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Sash glass reflection */}
      <motion.line
        x1="50"
        x2="50"
        stroke="#ffffff"
        strokeWidth="2"
        opacity="0.3"
        initial={{ y1: 60, y2: 60 }}
        animate={{ y1: 60, y2: 55 + sashOpen * 110 }}
        transition={{ duration: 0.6 }}
      />

      {/* Base / work surface */}
      <rect
        x="20"
        y="198"
        width="240"
        height="14"
        rx="2"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Lower cabinet */}
      <rect
        x="20"
        y="212"
        width="240"
        height="100"
        rx="3"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Cabinet doors */}
      <line
        x1="140"
        y1="215"
        x2="140"
        y2="309"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Door handles */}
      <rect x="130" y="250" width="4" height="18" rx="2" fill="#94a3b8" />
      <rect x="146" y="250" width="4" height="18" rx="2" fill="#94a3b8" />

      {/* Airflow arrows when fan is on */}
      {fanOn && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M ${70 + i * 60} ${55 + sashOpen * 120 + 5} L ${70 + i * 60} ${55 + sashOpen * 120 - 15}`}
              stroke="#93c5fd"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
              opacity="0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </>
      )}

      {/* Shadow */}
      <ellipse
        cx="140"
        cy="325"
        rx="100"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Label */}
      <text
        x="140"
        y="350"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Fume Hood
      </text>
    </svg>
  );
}
