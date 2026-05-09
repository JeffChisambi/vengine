import React from "react";
import { motion } from "framer-motion";

export default function LEDSVGComponent({
  color = "#ef4444",
  on = true,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter:
          on || glow
            ? `drop-shadow(0 0 16px ${color}88)`
            : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="ledGlow" cx="50%" cy="35%" r="60%">
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity={on ? "0.6" : "0.05"}
          />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ledBodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="ledFlatGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="38"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Glow halo */}
      {on && (
        <motion.circle
          cx="110"
          cy="112"
          r="68"
          fill={color}
          fillOpacity="0.1"
          animate={{ r: [65, 78, 65], fillOpacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* ── DOME (epoxy lens) ── */}
      <ellipse
        cx="110"
        cy="112"
        rx="52"
        ry="52"
        fill="url(#ledBodyGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse cx="110" cy="112" rx="52" ry="52" fill="url(#ledGlow)" />

      {/* Internal semiconductor die */}
      <rect
        x="98"
        y="100"
        width="24"
        height="24"
        rx="3"
        fill={on ? color : "#94a3b8"}
        fillOpacity={on ? 0.85 : 0.3}
        stroke={on ? color : "#64748b"}
        strokeWidth="1"
      />
      {/* Bond wires */}
      <line
        x1="110"
        y1="100"
        x2="110"
        y2="92"
        stroke="#fbbf24"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="110"
        y1="124"
        x2="110"
        y2="132"
        stroke="#fbbf24"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Dome highlight */}
      <ellipse
        cx="96"
        cy="96"
        rx="14"
        ry="10"
        fill="#ffffff"
        fillOpacity="0.2"
        transform="rotate(-30,96,96)"
      />

      {/* Flat edge (cathode indicator) */}
      <path
        d="M 98 162 L 122 162"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="97" y="160" width="4" height="8" rx="1" fill="#64748b" />

      {/* ── LEADS ── */}
      {/* Anode (+, longer) */}
      <line
        x1="118"
        y1="164"
        x2="118"
        y2="250"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="118"
        y1="248"
        x2="130"
        y2="258"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="134" y="256" fontSize="10" fill="#64748b" fontWeight="700">
        +
      </text>

      {/* Cathode (−, shorter) */}
      <line
        x1="102"
        y1="164"
        x2="102"
        y2="242"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="102"
        y1="240"
        x2="90"
        y2="250"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <text x="78" y="248" fontSize="10" fill="#64748b" fontWeight="700">
        −
      </text>

      {/* Emitted light rays */}
      {on &&
        [0, 1, 2, 3, 4].map((i) => {
          const angle = ((-50 + i * 25) * Math.PI) / 180;
          return (
            <motion.line
              key={i}
              x1={110 + 52 * Math.cos(angle - Math.PI / 2)}
              y1={112 + 52 * Math.sin(angle - Math.PI / 2)}
              x2={110 + 70 * Math.cos(angle - Math.PI / 2)}
              y2={112 + 70 * Math.sin(angle - Math.PI / 2)}
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
              animate={{ opacity: [0.3, 0.7, 0.3], strokeWidth: [1.5, 2, 1.5] }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
            />
          );
        })}

      <text
        x="110"
        y="272"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        LED
      </text>
    </svg>
  );
}
