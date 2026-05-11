import React from "react";
import { motion } from "framer-motion";

export default function DiodeSVG({ conducting = false, reversed = false, glow = false, showLabel = true }) {
  const color = conducting ? "#22c55e" : reversed ? "#ef4444" : "#94a3b8";
  const glowColor = conducting ? "rgba(34,197,94,0.45)" : reversed ? "rgba(239,68,68,0.4)" : "rgba(0,0,0,0.10)";

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: (conducting || reversed || glow)
          ? `drop-shadow(0 0 16px ${glowColor})`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="diodeBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="20%" stopColor="#334155" />
          <stop offset="80%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="diodeLead" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <radialGradient id="diodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="110" cy="286" rx="52" ry="6" fill="#cbd5e1" fillOpacity="0.35" />

      {/* Glow halo when conducting */}
      {conducting && (
        <motion.ellipse
          cx="110" cy="152" rx="58" ry="38"
          fill="url(#diodeGlow)"
          animate={{ rx: [55, 65, 55], ry: [35, 42, 35], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}

      {/* ── GLASS/EPOXY BODY ── */}
      <rect x="60" y="118" width="100" height="68" rx="14"
        fill="url(#diodeBody)" stroke="#0f172a" strokeWidth="2" />

      {/* Glass body highlight */}
      <rect x="62" y="122" width="96" height="12" rx="6" fill="#ffffff" opacity="0.08" />
      <line x1="63" y1="130" x2="63" y2="180" stroke="#ffffff" strokeWidth="2" opacity="0.07" strokeLinecap="round" />

      {/* Cathode band (white stripe near right) */}
      <rect x="136" y="118" width="14" height="68" rx="0" fill="#e2e8f0" opacity="0.9" />
      <rect x="148" y="118" width="12" height="68" rx="14" fill="url(#diodeBody)" />

      {/* P-N Junction internal representation */}
      <line x1="134" y1="124" x2="134" y2="180" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.5" />

      {/* Diode symbol overlaid on body */}
      {/* Triangle (anode side) */}
      <polygon
        points="84,152 116,136 116,168"
        fill={color}
        fillOpacity="0.7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Bar (cathode side) */}
      <line x1="116" y1="134" x2="116" y2="170"
        stroke={color} strokeWidth="3.5" strokeLinecap="round" />

      {/* Part number */}
      <text x="110" y="107" textAnchor="middle" fontSize="11" fontWeight="700" fill="#94a3b8">
        1N4007
      </text>

      {/* ── LEADS ── */}
      {/* Anode lead (left) */}
      <rect x="18" y="149" width="42" height="6" rx="3" fill="url(#diodeLead)" />
      <path d="M 18 152 Q 14 152 14 158 L 14 200" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <text x="14" y="218" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="700">A</text>
      <text x="14" y="230" textAnchor="middle" fontSize="8" fill="#94a3b8">(+)</text>

      {/* Cathode lead (right) */}
      <rect x="160" y="149" width="42" height="6" rx="3" fill="url(#diodeLead)" />
      <path d="M 202 152 Q 206 152 206 158 L 206 200" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <text x="206" y="218" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="700">K</text>
      <text x="206" y="230" textAnchor="middle" fontSize="8" fill="#94a3b8">(−)</text>

      {/* Animated current flow dots */}
      {conducting && (
        <motion.circle
          r="5" fill="#22c55e" opacity="0.85"
          animate={{ cx: [18, 60, 160, 202], cy: [152, 152, 152, 152] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Reverse block indicator */}
      {reversed && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <line x1="80" y1="136" x2="140" y2="168" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <line x1="140" y1="136" x2="80" y2="168" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
        </motion.g>
      )}

      {showLabel && (
        <text x="110" y="272" textAnchor="middle" fontSize="12" fontWeight="600"
          fill="#475569" fontFamily="var(--font-heading)">
          Diode (1N4007)
        </text>
      )}
    </svg>
  );
}
