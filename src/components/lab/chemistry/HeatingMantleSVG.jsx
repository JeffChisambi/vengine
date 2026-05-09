import React from "react";
import { motion } from "framer-motion";

export default function HeatingMantleSVG({
  heating = false,
  temperature = 150,
  glow = false,
}) {
  const dialAngle = (temperature / 400) * 270 - 135;

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
        <linearGradient id="mantleBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="heatGlow" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== MANTLE BODY ===== */}
      {/* Bowl / well shape */}
      <path
        d="
          M 40 135
          Q 40 100 120 100
          Q 200 100 200 135
          L 200 180
          Q 200 210 120 210
          Q 40 210 40 180
          Z
        "
        fill="url(#mantleBodyGrad)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Inner well (hemispherical cavity) */}
      <ellipse
        cx="120"
        cy="132"
        rx="65"
        ry="32"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Heating coil pattern inside */}
      <path
        d="M 70 132 Q 80 120 90 132 Q 100 144 110 132 Q 120 120 130 132 Q 140 144 150 132 Q 160 120 170 132"
        fill="none"
        stroke={heating ? "#f97316" : "#94a3b8"}
        strokeWidth="2"
        opacity={heating ? 0.8 : 0.3}
      />

      {/* Heat glow effect */}
      {heating && (
        <motion.ellipse
          cx="120"
          cy="125"
          rx="60"
          ry="28"
          fill="url(#heatGlow)"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Mantle rim */}
      <ellipse
        cx="120"
        cy="100"
        rx="80"
        ry="14"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* ===== CONTROL UNIT / BASE ===== */}
      <rect
        x="35"
        y="210"
        width="170"
        height="70"
        rx="6"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="2"
      />

      {/* Front panel */}
      <rect x="38" y="213" width="164" height="64" rx="4" fill="#e2e8f0" />

      {/* Temperature dial */}
      <circle
        cx="90"
        cy="245"
        r="22"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <circle
        cx="90"
        cy="245"
        r="18"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Dial markings */}
      {[0, 45, 90, 135, 180, 225, 270].map((angle, i) => {
        const rad = ((angle - 135) * Math.PI) / 180;
        const x1 = 90 + Math.cos(rad) * 15;
        const y1 = 245 + Math.sin(rad) * 15;
        const x2 = 90 + Math.cos(rad) * 18;
        const y2 = 245 + Math.sin(rad) * 18;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#64748b"
            strokeWidth="1"
          />
        );
      })}

      {/* Dial pointer */}
      <motion.line
        x1="90"
        y1="245"
        x2={90 + Math.cos((dialAngle * Math.PI) / 180) * 13}
        y2={245 + Math.sin((dialAngle * Math.PI) / 180) * 13}
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="90" cy="245" r="3" fill="#1e293b" />

      {/* Dial label */}
      <text x="90" y="275" textAnchor="middle" fontSize="7" fill="#64748b">
        TEMP °C
      </text>

      {/* Power indicator */}
      <circle cx="155" cy="232" r="5" fill={heating ? "#22c55e" : "#64748b"} />
      {heating && (
        <motion.circle
          cx="155"
          cy="232"
          r="5"
          fill="#22c55e"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      <text x="155" y="248" textAnchor="middle" fontSize="7" fill="#64748b">
        POWER
      </text>

      {/* Temperature display */}
      <rect x="135" y="254" width="50" height="18" rx="2" fill="#1e293b" />
      <text
        x="160"
        y="267"
        textAnchor="middle"
        fontSize="10"
        fill={heating ? "#22c55e" : "#64748b"}
        fontFamily="monospace"
      >
        {temperature}°C
      </text>

      {/* Power cord */}
      <path
        d="M 200 260 Q 215 265 220 280 Q 222 290 210 295"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="300"
        rx="80"
        ry="9"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Label */}
      <text
        x="120"
        y="340"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Heating Mantle
      </text>
    </svg>
  );
}
