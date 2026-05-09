import React from "react";
import { motion } from "framer-motion";

export default function RippleTankSVG({ rippling = true, glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="rtankWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="rtankBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="80"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── TANK BODY (trapezoidal tray with perspective) ── */}
      {/* Bottom face */}
      <rect
        x="20"
        y="155"
        width="180"
        height="100"
        rx="4"
        fill="url(#rtankBody)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Top face (water surface in perspective) */}
      <path
        d="M 28 100 L 192 100 L 200 155 L 20 155 Z"
        fill="url(#rtankWater)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Side face left */}
      <path
        d="M 20 155 L 20 255 L 28 255 L 28 100"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Front face */}
      <path
        d="M 20 255 L 200 255 L 192 155 L 20 155 Z"
        fill="#d1dae6"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* ── WATER SURFACE RIPPLES ── */}
      {rippling &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.ellipse
            key={i}
            cx="110"
            cy="128"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="1.5"
            opacity="0.7"
            initial={{ rx: 2, ry: 1, opacity: 0.9 }}
            animate={{ rx: 20 + i * 18, ry: 8 + i * 7, opacity: 0 }}
            transition={{
              duration: 2.2,
              delay: i * 0.35,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

      {/* ── VIBRATOR/DIPPER ARM ── */}
      {/* Support bar */}
      <rect x="90" y="62" width="40" height="5" rx="2" fill="#64748b" />
      <rect x="108" y="42" width="4" height="22" rx="1" fill="#94a3b8" />
      {/* Clamp */}
      <rect
        x="104"
        y="38"
        width="12"
        height="8"
        rx="2"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />
      {/* Dipper rod */}
      <motion.line
        x1="110"
        y1="67"
        x2="110"
        y2="108"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
        animate={rippling ? { y1: [67, 63, 67] } : {}}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Dipper tip */}
      <motion.circle
        cx="110"
        r="5"
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1"
        animate={rippling ? { cy: [108, 104, 108] } : { cy: 108 }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />

      {/* ── LIGHT SOURCE (stroboscope on top) ── */}
      <rect
        x="52"
        y="36"
        width="32"
        height="18"
        rx="4"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <rect
        x="56"
        y="40"
        width="24"
        height="10"
        rx="2"
        fill="#fef08a"
        fillOpacity="0.6"
      />
      {rippling && (
        <motion.rect
          x="56"
          y="40"
          width="24"
          height="10"
          rx="2"
          fill="#fef08a"
          animate={{ fillOpacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      )}
      <text x="68" y="68" textAnchor="middle" fontSize="6" fill="#64748b">
        Light
      </text>

      {/* ── DRAINAGE TAP ── */}
      <rect
        x="192"
        y="200"
        width="12"
        height="6"
        rx="2"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />
      <rect x="202" y="197" width="6" height="12" rx="1" fill="#64748b" />

      {/* ── LEGS ── */}
      {[30, 190].map((x, i) => (
        <g key={i}>
          <line
            x1={x}
            y1="255"
            x2={x - (i === 0 ? 6 : -6)}
            y2="278"
            stroke="#64748b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={x + (i === 0 ? 20 : -20)}
            y1="255"
            x2={x + (i === 0 ? 14 : -14)}
            y2="278"
            stroke="#64748b"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
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
        Ripple Tank
      </text>
    </svg>
  );
}
