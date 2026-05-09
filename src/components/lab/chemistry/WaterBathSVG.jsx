import React from "react";
import { motion } from "framer-motion";

export default function WaterBathSVG({
  waterColor = "#38bdf8",
  temperature = 60,
  heating = true,
  glow = false,
}) {
  const dialAngle = (temperature / 100) * 270 - 135;

  return (
    <svg
      viewBox="0 0 260 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(56,189,248,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="wbWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={waterColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={waterColor} stopOpacity="0.75" />
        </linearGradient>
        <clipPath id="wbClip">
          <rect x="36" y="75" width="188" height="105" />
        </clipPath>
      </defs>

      {/* ===== MAIN HOUSING ===== */}
      {/* Body */}
      <rect
        x="30"
        y="65"
        width="200"
        height="125"
        rx="6"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Inner basin / chamber */}
      <rect
        x="36"
        y="72"
        width="188"
        height="110"
        rx="3"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />

      {/* Water fill */}
      <g clipPath="url(#wbClip)">
        <motion.rect
          x="36"
          width="188"
          fill="url(#wbWaterGrad)"
          initial={{ y: 182, height: 0 }}
          animate={{ y: 95, height: 87 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Water surface */}
        <motion.ellipse
          cx="130"
          rx="90"
          ry="6"
          fill="#bfdbfe"
          fillOpacity="0.3"
          initial={{ cy: 182 }}
          animate={{ cy: 97 }}
          transition={{ duration: 0.8 }}
        />

        {/* Water ripples */}
        {heating &&
          [0, 1, 2].map((i) => (
            <motion.ellipse
              key={i}
              cx={80 + i * 50}
              cy="97"
              rx="20"
              ry="3"
              fill="#ffffff"
              fillOpacity="0.15"
              animate={{
                rx: [20, 30, 20],
                fillOpacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity }}
            />
          ))}

        {/* Gentle convection current indicators */}
        {heating &&
          [0, 1, 2, 3].map((i) => (
            <motion.circle
              key={`conv-${i}`}
              cx={65 + i * 45}
              r="1.5"
              fill="#93c5fd"
              fillOpacity="0.5"
              initial={{ cy: 170 }}
              animate={{ cy: [170, 100, 170] }}
              transition={{ duration: 4, delay: i * 0.7, repeat: Infinity }}
            />
          ))}
      </g>

      {/* Test tube rack / sample holder inside */}
      {/* Rack frame */}
      <rect
        x="70"
        y="88"
        width="120"
        height="6"
        rx="1"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="0.8"
      />
      <rect x="75" y="94" width="3" height="50" fill="#94a3b8" />
      <rect x="182" y="94" width="3" height="50" fill="#94a3b8" />

      {/* Test tubes in rack */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={90 + i * 25}
            y="85"
            width="8"
            height="55"
            rx="4"
            fill="#e0e7ff"
            fillOpacity="0.4"
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <rect
            x={91 + i * 25}
            y="105"
            width="6"
            height="30"
            rx="3"
            fill={["#fbbf24", "#38bdf8", "#a78bfa", "#f472b6"][i]}
            fillOpacity="0.5"
          />
          <ellipse
            cx={94 + i * 25}
            cy="85"
            rx="4"
            ry="1.5"
            fill="#f8fafc"
            stroke="#94a3b8"
            strokeWidth="0.8"
          />
        </g>
      ))}

      {/* Lid / cover (partially open) */}
      <path
        d="M 28 68 L 232 68 L 232 60 Q 232 55 227 55 L 33 55 Q 28 55 28 60 Z"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Lid handle */}
      <rect
        x="115"
        y="50"
        width="30"
        height="7"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />

      {/* ===== CONTROL PANEL (front face) ===== */}
      <rect
        x="30"
        y="190"
        width="200"
        height="70"
        rx="5"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="2"
      />
      <rect x="34" y="194" width="192" height="62" rx="3" fill="#e2e8f0" />

      {/* Temperature dial */}
      <circle
        cx="75"
        cy="225"
        r="18"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <circle
        cx="75"
        cy="225"
        r="14"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Dial markings */}
      {[0, 45, 90, 135, 180, 225, 270].map((angle, i) => {
        const rad = ((angle - 135) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={75 + Math.cos(rad) * 11}
            y1={225 + Math.sin(rad) * 11}
            x2={75 + Math.cos(rad) * 14}
            y2={225 + Math.sin(rad) * 14}
            stroke="#64748b"
            strokeWidth="1"
          />
        );
      })}

      <motion.line
        x1="75"
        y1="225"
        x2={75 + Math.cos((dialAngle * Math.PI) / 180) * 10}
        y2={225 + Math.sin((dialAngle * Math.PI) / 180) * 10}
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="75" cy="225" r="2.5" fill="#1e293b" />
      <text x="75" y="250" textAnchor="middle" fontSize="7" fill="#64748b">
        TEMP
      </text>

      {/* Digital display */}
      <rect x="120" y="207" width="60" height="22" rx="3" fill="#1e293b" />
      <text
        x="150"
        y="222"
        textAnchor="middle"
        fontSize="12"
        fill={heating ? "#22c55e" : "#64748b"}
        fontFamily="monospace"
      >
        {temperature}°C
      </text>

      {/* Power LED */}
      <circle cx="200" cy="210" r="4" fill={heating ? "#22c55e" : "#475569"} />
      {heating && (
        <motion.circle
          cx="200"
          cy="210"
          r="4"
          fill="#22c55e"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      <text x="200" y="224" textAnchor="middle" fontSize="6" fill="#64748b">
        ON
      </text>

      {/* Power cord */}
      <path
        d="M 228 240 Q 242 245 245 258 Q 247 268 238 272"
        fill="none"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Shadow */}
      <ellipse
        cx="130"
        cy="278"
        rx="95"
        ry="9"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Label */}
      <text
        x="130"
        y="315"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Water Bath
      </text>
    </svg>
  );
}
