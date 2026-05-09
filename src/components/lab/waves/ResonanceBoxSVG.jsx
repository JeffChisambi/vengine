import React from "react";
import { motion } from "framer-motion";

export default function ResonanceBoxSVG({ vibrating = false, glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(120,113,108,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="rboxWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="15%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="rboxTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="30%" stopColor="#fbbf24" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="rboxSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="82"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── BOX BODY (3/4 perspective) ── */}
      {/* Bottom face */}
      <path
        d="M 22 190 L 22 254 L 198 254 L 198 190 Z"
        fill="url(#rboxSide)"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Right face */}
      <path
        d="M 198 120 L 198 254 L 210 242 L 210 108 Z"
        fill="#92400e"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Front face */}
      <motion.path
        d={vibrating ? undefined : "M 22 120 L 198 120 L 198 254 L 22 254 Z"}
        animate={
          vibrating
            ? {
                d: [
                  "M 22 120 L 198 120 L 198 254 L 22 254 Z",
                  "M 20 120 L 200 120 L 200 254 L 20 254 Z",
                  "M 22 120 L 198 120 L 198 254 L 22 254 Z",
                ],
              }
            : {}
        }
        transition={{ duration: 0.08, repeat: Infinity }}
        fill="url(#rboxWood)"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Top face */}
      <path
        d="M 22 120 L 198 120 L 210 108 L 34 108 Z"
        fill="url(#rboxTop)"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Left edge */}
      <line
        x1="22"
        y1="120"
        x2="34"
        y2="108"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* Wood grain lines (front face) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={60 + i * 24}
          y1="122"
          x2={58 + i * 24}
          y2="252"
          stroke="#78350f"
          strokeWidth="0.6"
          opacity="0.3"
        />
      ))}
      {/* Wood grain on top */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={50 + i * 50}
          y1="108"
          x2={58 + i * 50}
          y2="120"
          stroke="#92400e"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}

      {/* ── SOUND HOLE (circular aperture on front face) ── */}
      <ellipse
        cx="110"
        cy="190"
        rx="38"
        ry="36"
        fill="#1e0a00"
        stroke="#78350f"
        strokeWidth="2"
      />
      {/* Sound hole ring */}
      <ellipse
        cx="110"
        cy="190"
        rx="38"
        ry="36"
        fill="none"
        stroke="#d97706"
        strokeWidth="2"
      />
      <ellipse
        cx="110"
        cy="190"
        rx="34"
        ry="32"
        fill="none"
        stroke="#b45309"
        strokeWidth="1"
      />

      {/* ── TUNING FORK ON TOP ── */}
      {/* Fork handle in mount slot */}
      <rect
        x="102"
        y="85"
        width="16"
        height="26"
        rx="3"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <rect x="106" y="82" width="8" height="8" rx="2" fill="#94a3b8" />
      {/* Left tine */}
      <motion.path
        d="M 102 84 L 98 84 Q 90 84 90 96 L 90 118 Q 90 124 96 124 Q 102 124 102 118 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
        animate={vibrating ? { x: [-2, 2, -2] } : {}}
        transition={{ duration: 0.06, repeat: Infinity }}
      />
      {/* Right tine */}
      <motion.path
        d="M 118 84 L 122 84 Q 130 84 130 96 L 130 118 Q 130 124 124 124 Q 118 124 118 118 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
        animate={vibrating ? { x: [2, -2, 2] } : {}}
        transition={{ duration: 0.06, repeat: Infinity }}
      />
      {/* Tine tips rounded */}
      <ellipse
        cx="96"
        cy="84"
        rx="6"
        ry="8"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <ellipse
        cx="124"
        cy="84"
        rx="6"
        ry="8"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Resonance sound waves from hole */}
      {vibrating &&
        [0, 1, 2].map((i) => (
          <motion.ellipse
            key={i}
            cx="110"
            cy="190"
            rx="38"
            ry="36"
            fill="none"
            stroke="#d97706"
            strokeWidth="1.5"
            initial={{ rx: 38, ry: 36, opacity: 0.6 }}
            animate={{ rx: 55 + i * 14, ry: 52 + i * 13, opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

      {/* ── LABEL ON BOX ── */}
      <text
        x="110"
        y="165"
        textAnchor="middle"
        fontSize="8"
        fill="#fbbf24"
        fontWeight="600"
        opacity="0.8"
      >
        RESONANCE
      </text>

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Resonance Box
      </text>
    </svg>
  );
}
