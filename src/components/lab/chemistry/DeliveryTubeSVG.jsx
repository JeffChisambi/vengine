import React from "react";
import { motion } from "framer-motion";

export default function DeliveryTubeSVG({ gasFlowing = false, glow = false }) {
  return (
    <svg
      viewBox="0 0 300 240"
      className="w-full h-full max-h-[240px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="dtGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* ── Horizontal left segment ── */}
      {/* Outer tube */}
      <rect
        x="20"
        y="78"
        width="100"
        height="16"
        rx="5"
        fill="url(#dtGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Inner channel */}
      <rect
        x="22"
        y="82"
        width="96"
        height="8"
        rx="3"
        fill="#e0f2fe"
        fillOpacity="0.25"
      />
      {/* Highlight */}
      <line
        x1="24"
        y1="81"
        x2="116"
        y2="81"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* ── 90° elbow bend (top-right of horizontal, curving down) ── */}
      {/* Outer bend */}
      <path
        d="M 118 78 Q 148 78 148 108"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Inner bend fill */}
      <path
        d="M 118 82 Q 144 82 144 108"
        fill="none"
        stroke="#dbeafe"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Highlight on bend */}
      <path
        d="M 119 80 Q 145 80 145 108"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* ── Vertical down segment ── */}
      <rect
        x="140"
        y="106"
        width="16"
        height="80"
        rx="5"
        fill="url(#dtGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <rect
        x="143"
        y="108"
        width="8"
        height="76"
        rx="3"
        fill="#e0f2fe"
        fillOpacity="0.2"
      />
      <line
        x1="143"
        y1="110"
        x2="143"
        y2="182"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.28"
      />

      {/* ── Tip (nozzle) ── tapered glass end */}
      <path
        d="M 140 184 L 140 196 Q 140 202 148 202 Q 156 202 156 196 L 156 184 Z"
        fill="url(#dtGlass)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="148"
        cy="202"
        rx="8"
        ry="4"
        fill="#bfdbfe"
        fillOpacity="0.5"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      {/* Tip taper point */}
      <path
        d="M 143 202 Q 148 212 153 202"
        fill="#bfdbfe"
        fillOpacity="0.4"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* ── Left entry (stopper end) ── */}
      <ellipse
        cx="20"
        cy="86"
        rx="7"
        ry="9"
        fill="#78716c"
        stroke="#57534e"
        strokeWidth="1.5"
      />
      <ellipse cx="20" cy="86" rx="4" ry="6" fill="#a8a29e" />

      {/* ── Gas bubbles flowing ── */}
      {gasFlowing &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="148"
            r={2.5 + i * 0.8}
            fill="#bfdbfe"
            fillOpacity="0.7"
            initial={{ cy: 185, opacity: 0 }}
            animate={{ cy: 215, opacity: [0, 0.85, 0], r: [2, 4, 2] }}
            transition={{
              duration: 1.6,
              delay: i * 0.45,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

      {/* Gas flow arrows inside tube */}
      {gasFlowing && (
        <>
          {[30, 60, 90].map((x, i) => (
            <motion.text
              key={i}
              x={x}
              y="89"
              fontSize="9"
              fill="#38bdf8"
              fillOpacity="0.7"
              animate={{ opacity: [0, 0.8, 0], x: [x, x + 10, x + 10] }}
              transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
            >
              ›
            </motion.text>
          ))}
          <motion.text
            x="146"
            y="135"
            fontSize="9"
            fill="#38bdf8"
            fillOpacity="0.7"
            animate={{ opacity: [0, 0.8, 0], y: [135, 155, 155] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ↓
          </motion.text>
        </>
      )}

      {/* Dimension callout */}
      <line
        x1="20"
        y1="65"
        x2="148"
        y2="65"
        stroke="#cbd5e1"
        strokeWidth="0.8"
        strokeDasharray="3,3"
      />
      <text x="84" y="61" textAnchor="middle" fontSize="7.5" fill="#94a3b8">
        glass tube
      </text>

      {/* Label */}
      <text
        x="150"
        y="230"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Delivery Tube
      </text>
    </svg>
  );
}
