import React from "react";
import { motion } from "framer-motion";

export default function DistillationApparatusSVG({
  liquidColor = "#38bdf8",
  distillateColor = "#a5f3fc",
  boiling = false,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 340 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(56,189,248,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="distGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="distLiquidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="distCondensateGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={distillateColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={distillateColor} stopOpacity="0.8" />
        </linearGradient>
        <clipPath id="distFlaskClip">
          <path d="M 58 95 L 58 150 A 42 42 0 1 0 98 150 L 98 95 Z" />
        </clipPath>
        <clipPath id="recFlaskClip">
          <path d="M 255 220 L 255 260 A 30 30 0 1 0 285 260 L 285 220 Z" />
        </clipPath>
      </defs>

      {/* ===== HEATING MANTLE (base) ===== */}
      <path
        d="M 30 245 Q 30 260 78 260 Q 126 260 126 245 L 126 235 Q 126 225 78 225 Q 30 225 30 235 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Heating glow */}
      {boiling && (
        <motion.ellipse
          cx="78"
          cy="242"
          rx="42"
          ry="10"
          fill="#f97316"
          fillOpacity="0.15"
          animate={{ fillOpacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* ===== DISTILLATION FLASK (round bottom) ===== */}
      <path
        d="M 58 95 L 58 150 A 42 42 0 1 0 98 150 L 98 95 Z"
        fill="url(#distGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Flask opening */}
      <ellipse
        cx="78"
        cy="95"
        rx="20"
        ry="5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Liquid in flask */}
      <g clipPath="url(#distFlaskClip)">
        <motion.rect
          x="36"
          width="84"
          fill="url(#distLiquidGrad)"
          initial={{ y: 210, height: 0 }}
          animate={{ y: 175, height: 55 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        {/* Bubbles */}
        {boiling &&
          [0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx={62 + i * 10}
              r={2 + Math.random() * 2}
              fill="#e0f2fe"
              fillOpacity="0.7"
              initial={{ cy: 215, opacity: 0 }}
              animate={{ cy: 175, opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
      </g>

      {/* ===== DISTILLATION HEAD / CONNECTOR ===== */}
      {/* Vertical tube from flask to bend */}
      <rect
        x="72"
        y="62"
        width="12"
        height="35"
        fill="url(#distGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Three-way adapter / still head */}
      <ellipse
        cx="78"
        cy="62"
        rx="10"
        ry="4"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Thermometer well */}
      <rect
        x="75"
        y="38"
        width="6"
        height="26"
        fill="url(#distGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      {/* Thermometer */}
      <rect
        x="76.5"
        y="28"
        width="3"
        height="32"
        rx="1"
        fill="#fef2f2"
        stroke="#ef4444"
        strokeWidth="0.5"
      />
      <circle cx="78" cy="58" r="3" fill="#ef4444" />
      {/* Mercury column */}
      <rect x="77.5" y="38" width="1" height="18" fill="#ef4444" />

      {/* ===== CONDENSER TUBE (angled) ===== */}
      {/* Outer tube */}
      <path
        d="M 84 64 L 240 150"
        stroke="#94a3b8"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        opacity="0.15"
      />
      <path
        d="M 84 64 L 240 150"
        stroke="#94a3b8"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        opacity="0.08"
      />
      {/* Outer condenser jacket */}
      <line
        x1="88"
        y1="60"
        x2="238"
        y2="146"
        stroke="#94a3b8"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.05"
      />
      <line
        x1="88"
        y1="60"
        x2="238"
        y2="146"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="84"
        y1="68"
        x2="234"
        y2="154"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Inner tube */}
      <line
        x1="86"
        y1="62"
        x2="237"
        y2="148"
        stroke="#bfdbfe"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Water jacket ports */}
      {/* Inlet */}
      <rect
        x="195"
        y="148"
        width="8"
        height="18"
        rx="2"
        fill="url(#distGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <text x="207" y="162" fontSize="6" fill="#64748b">
        H₂O in
      </text>
      {/* Outlet */}
      <rect
        x="108"
        y="60"
        width="8"
        height="18"
        rx="2"
        fill="url(#distGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1"
        transform="rotate(-10, 112, 69)"
      />
      <text x="120" y="68" fontSize="6" fill="#64748b">
        H₂O out
      </text>

      {/* Condensation droplets */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={130 + i * 35}
          cy={88 + i * 22}
          r="2"
          fill={distillateColor}
          fillOpacity="0.7"
          animate={{
            cy: [88 + i * 22, 92 + i * 22, 88 + i * 22],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* ===== DRIP / ADAPTER ===== */}
      <path
        d="M 237 148 L 248 158 L 248 210 Q 248 218 270 218"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <path
        d="M 243 150 L 254 160 L 254 210 Q 254 222 270 222"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Dripping distillate */}
      <motion.circle
        cx="251"
        cy="215"
        r="2"
        fill={distillateColor}
        animate={{ cy: [215, 235, 215], opacity: [0.8, 0, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* ===== RECEIVING FLASK ===== */}
      <path
        d="M 255 220 L 255 260 A 30 30 0 1 0 285 260 L 285 220 Z"
        fill="url(#distGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <ellipse
        cx="270"
        cy="220"
        rx="15"
        ry="4"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Collected distillate */}
      <g clipPath="url(#recFlaskClip)">
        <motion.rect
          x="240"
          width="60"
          fill="url(#distCondensateGrad)"
          initial={{ y: 295, height: 0 }}
          animate={{ y: 275, height: 20 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </g>

      {/* ===== STAND / SUPPORT ===== */}
      {/* Ring stand */}
      <rect x="10" y="310" width="90" height="6" rx="2" fill="#94a3b8" />
      <rect x="52" y="90" width="6" height="222" fill="#94a3b8" rx="1" />
      {/* Clamp */}
      <rect x="45" y="88" width="20" height="8" rx="2" fill="#64748b" />

      {/* Second stand for condenser */}
      <rect x="258" y="310" width="50" height="6" rx="2" fill="#94a3b8" />
      <rect x="280" y="215" width="5" height="97" fill="#94a3b8" rx="1" />

      {/* Shadow */}
      <ellipse
        cx="170"
        cy="330"
        rx="130"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.3"
      />

      {/* Label */}
      <text
        x="170"
        y="352"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Distillation Apparatus
      </text>
    </svg>
  );
}
