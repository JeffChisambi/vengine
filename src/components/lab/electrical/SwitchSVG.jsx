import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SwitchSVG({ closed = false, glow = false }) {
  const [isOn, setIsOn] = useState(closed);
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      onClick={() => setIsOn((v) => !v)}
      style={{
        cursor: "pointer",
        filter: glow
          ? "drop-shadow(0 0 14px rgba(34,197,94,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="swBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="swLead" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="75"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── BINDING POST BASE PLATES ── */}
      <rect
        x="20"
        y="130"
        width="50"
        height="50"
        rx="6"
        fill="url(#swBase)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <rect
        x="150"
        y="130"
        width="50"
        height="50"
        rx="6"
        fill="url(#swBase)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Binding posts / terminals */}
      <circle
        cx="45"
        cy="155"
        r="14"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="2"
      />
      <circle
        cx="45"
        cy="155"
        r="8"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <circle cx="45" cy="155" r="3" fill="#475569" />

      <circle
        cx="175"
        cy="155"
        r="14"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="2"
      />
      <circle
        cx="175"
        cy="155"
        r="8"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <circle cx="175" cy="155" r="3" fill="#475569" />

      {/* ── PIVOTING LEVER ── */}
      {/* Pivot pin on left terminal */}
      <circle cx="45" cy="155" r="5" fill="#64748b" />

      {/* Lever arm */}
      <motion.line
        x1="45"
        y1="155"
        animate={{
          x2: isOn ? 175 : 145,
          y2: isOn ? 155 : 108,
        }}
        stroke="#475569"
        strokeWidth="7"
        strokeLinecap="round"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      {/* Lever tip ball */}
      <motion.circle
        r="6"
        fill="#64748b"
        stroke="#334155"
        strokeWidth="1.5"
        animate={{ cx: isOn ? 175 : 145, cy: isOn ? 155 : 108 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Connecting wires */}
      <line
        x1="20"
        y1="155"
        x2="8"
        y2="155"
        stroke="url(#swLead)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="8"
        cy="155"
        r="6"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <line
        x1="200"
        y1="155"
        x2="212"
        y2="155"
        stroke="url(#swLead)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="212"
        cy="155"
        r="6"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Open/closed label */}
      <rect
        x="76"
        y="200"
        width="68"
        height="28"
        rx="8"
        fill={isOn ? "#22c55e" : "#94a3b8"}
      />
      <text
        x="110"
        y="219"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#ffffff"
      >
        {isOn ? "CLOSED" : "OPEN"}
      </text>

      {/* Circuit symbol below */}
      <text x="110" y="256" textAnchor="middle" fontSize="9" fill="#64748b">
        (click to toggle)
      </text>

      <text
        x="110"
        y="272"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Switch (SPST)
      </text>
    </svg>
  );
}
