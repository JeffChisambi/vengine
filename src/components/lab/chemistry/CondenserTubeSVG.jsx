import React from "react";
import { motion } from "framer-motion";

export default function CondenserTubeSVG({
  waterFlowing = true,
  condensateColor = "#a5f3fc",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(56,189,248,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="condGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="condWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* ===== OUTER JACKET ===== */}
      {/* Left wall */}
      <line
        x1="85"
        y1="40"
        x2="85"
        y2="280"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />
      {/* Right wall */}
      <line
        x1="155"
        y1="40"
        x2="155"
        y2="280"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Top joint */}
      <path
        d="M 85 40 Q 85 32 120 32 Q 155 32 155 40"
        fill="url(#condGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Bottom joint */}
      <path
        d="M 85 280 Q 85 288 120 288 Q 155 288 155 280"
        fill="url(#condGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Jacket fill (water) */}
      {waterFlowing && (
        <motion.rect
          x="86"
          y="40"
          width="68"
          height="240"
          rx="0"
          fill="url(#condWaterGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* ===== INNER TUBE ===== */}
      <line
        x1="110"
        y1="20"
        x2="110"
        y2="300"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <line
        x1="130"
        y1="20"
        x2="130"
        y2="300"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Inner tube top opening */}
      <ellipse
        cx="120"
        cy="20"
        rx="10"
        ry="3.5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Inner tube bottom opening */}
      <ellipse
        cx="120"
        cy="300"
        rx="10"
        ry="3.5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Inner tube glass fill */}
      <rect
        x="111"
        y="22"
        width="18"
        height="276"
        fill="#e0e7ff"
        fillOpacity="0.12"
      />

      {/* Condensation inside inner tube */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.circle
          key={i}
          cx={116 + (i % 2) * 8}
          r="2"
          fill={condensateColor}
          fillOpacity="0.6"
          initial={{ cy: 60 + i * 45, opacity: 0 }}
          animate={{
            cy: [60 + i * 45, 80 + i * 45, 60 + i * 45],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}

      {/* ===== WATER PORTS ===== */}
      {/* Bottom inlet */}
      <rect
        x="155"
        y="240"
        width="30"
        height="10"
        rx="3"
        fill="url(#condGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="185"
        cy="245"
        rx="4"
        ry="5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <text
        x="192"
        y="248"
        fontSize="8"
        fill="#64748b"
        fontFamily="var(--font-body)"
      >
        In
      </text>

      {/* Top outlet */}
      <rect
        x="155"
        y="68"
        width="30"
        height="10"
        rx="3"
        fill="url(#condGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="185"
        cy="73"
        rx="4"
        ry="5"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <text
        x="192"
        y="76"
        fontSize="8"
        fill="#64748b"
        fontFamily="var(--font-body)"
      >
        Out
      </text>

      {/* Water flow arrows */}
      {waterFlowing && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.path
              key={i}
              d={`M 120 ${250 - i * 55} L 120 ${220 - i * 55}`}
              stroke="#60a5fa"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
        </>
      )}

      {/* Glass highlights */}
      <line
        x1="90"
        y1="50"
        x2="90"
        y2="270"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.15"
        strokeLinecap="round"
      />
      <line
        x1="113"
        y1="30"
        x2="113"
        y2="290"
        stroke="#ffffff"
        strokeWidth="1.5"
        opacity="0.1"
        strokeLinecap="round"
      />

      {/* Ground glass joint indicators */}
      {/* Top */}
      {[0, 1, 2].map((i) => (
        <line
          key={`top-${i}`}
          x1="108"
          y1={24 + i * 3}
          x2="132"
          y2={24 + i * 3}
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
      ))}
      {/* Bottom */}
      {[0, 1, 2].map((i) => (
        <line
          key={`bot-${i}`}
          x1="108"
          y1={292 + i * 3}
          x2="132"
          y2={292 + i * 3}
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
      ))}

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="320"
        rx="50"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Label */}
      <text
        x="120"
        y="345"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Condenser Tube
      </text>
    </svg>
  );
}
