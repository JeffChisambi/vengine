import React from "react";
import { motion } from "framer-motion";

export default function HotPlateSVG({
  heating = false,
  stirring = false,
  temperature = 200,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(249,115,22,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="hotplateTopGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1f5f9" stopOpacity="1" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="plateHeatGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== MAIN BODY ===== */}
      {/* Body housing */}
      <rect
        x="30"
        y="160"
        width="180"
        height="100"
        rx="8"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Top plate surface */}
      <rect
        x="30"
        y="120"
        width="180"
        height="44"
        rx="6"
        fill="url(#hotplateTopGrad)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Ceramic plate surface */}
      <rect
        x="42"
        y="126"
        width="156"
        height="32"
        rx="4"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Heating element pattern (concentric rings) */}
      <circle
        cx="120"
        cy="142"
        r="10"
        fill="none"
        stroke={heating ? "#f97316" : "#cbd5e1"}
        strokeWidth="1.5"
        opacity={heating ? 0.7 : 0.3}
      />
      <circle
        cx="120"
        cy="142"
        r="22"
        fill="none"
        stroke={heating ? "#f97316" : "#cbd5e1"}
        strokeWidth="1.5"
        opacity={heating ? 0.6 : 0.3}
      />
      <circle
        cx="120"
        cy="142"
        r="34"
        fill="none"
        stroke={heating ? "#f97316" : "#cbd5e1"}
        strokeWidth="1.5"
        opacity={heating ? 0.5 : 0.3}
      />
      <circle
        cx="120"
        cy="142"
        r="46"
        fill="none"
        stroke={heating ? "#f97316" : "#cbd5e1"}
        strokeWidth="1"
        opacity={heating ? 0.4 : 0.2}
      />

      {/* Heat glow */}
      {heating && (
        <motion.rect
          x="42"
          y="126"
          width="156"
          height="32"
          rx="4"
          fill="url(#plateHeatGlow)"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Heat waves */}
      {heating && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M ${90 + i * 20} 120 Q ${95 + i * 20} 108 ${100 + i * 20} 100`}
              fill="none"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
              animate={{ y: [-5, -15], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </>
      )}

      {/* ===== CONTROL PANEL ===== */}
      <rect x="40" y="175" width="160" height="72" rx="4" fill="#cbd5e1" />

      {/* Temperature knob */}
      <circle
        cx="80"
        cy="210"
        r="18"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <circle
        cx="80"
        cy="210"
        r="14"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Knob indicator */}
      <motion.line
        x1="80"
        y1="210"
        x2="80"
        y2="198"
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transformOrigin: "80px 210px" }}
        animate={{ rotate: (temperature / 400) * 270 - 135 }}
      />
      <circle cx="80" cy="210" r="3" fill="#1e293b" />
      <text x="80" y="236" textAnchor="middle" fontSize="7" fill="#64748b">
        HEAT
      </text>

      {/* Stirrer knob */}
      <circle
        cx="160"
        cy="210"
        r="18"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <circle
        cx="160"
        cy="210"
        r="14"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Stirrer knob indicator */}
      <motion.line
        x1="160"
        y1="210"
        x2="160"
        y2="198"
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transformOrigin: "160px 210px" }}
        animate={{ rotate: stirring ? 90 : -135 }}
      />
      <circle cx="160" cy="210" r="3" fill="#1e293b" />
      <text x="160" y="236" textAnchor="middle" fontSize="7" fill="#64748b">
        STIR
      </text>

      {/* Power LED */}
      <circle
        cx="120"
        cy="180"
        r="4"
        fill={heating || stirring ? "#22c55e" : "#475569"}
      />
      {(heating || stirring) && (
        <motion.circle
          cx="120"
          cy="180"
          r="4"
          fill="#22c55e"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* Stirring icon */}
      {stirring && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "120px 142px" }}
        >
          <line
            x1="114"
            y1="142"
            x2="126"
            y2="142"
            stroke="#3b82f6"
            strokeWidth="2"
            opacity="0.4"
          />
          <line
            x1="120"
            y1="136"
            x2="120"
            y2="148"
            stroke="#3b82f6"
            strokeWidth="2"
            opacity="0.4"
          />
        </motion.g>
      )}

      {/* Feet */}
      <rect x="42" y="258" width="20" height="6" rx="3" fill="#64748b" />
      <rect x="100" y="258" width="40" height="6" rx="3" fill="#64748b" />
      <rect x="178" y="258" width="20" height="6" rx="3" fill="#64748b" />

      {/* Power cord */}
      <path
        d="M 210 230 Q 225 235 228 250 Q 230 260 220 268"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="280"
        rx="85"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Label */}
      <text
        x="120"
        y="315"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Hot Plate Stirrer
      </text>
    </svg>
  );
}
