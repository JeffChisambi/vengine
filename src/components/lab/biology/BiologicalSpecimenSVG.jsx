import React from "react";
import { motion } from "framer-motion";

export default function BiologicalSpecimenSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(134,239,172,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="jarGlassGrad" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.15" />
        </radialGradient>
        <linearGradient id="fluidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="jarClip">
          <path d="M 52 65 L 52 240 Q 52 258 110 258 Q 168 258 168 240 L 168 65 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="280"
        rx="60"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ===== SPECIMEN JAR ===== */}
      {/* Jar body */}
      <path
        d="M 52 65 L 52 240 Q 52 260 110 260 Q 168 260 168 240 L 168 65 Z"
        fill="url(#jarGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Formaldehyde fluid */}
      <g clipPath="url(#jarClip)">
        <rect x="52" y="110" width="116" height="150" fill="url(#fluidGrad)" />
        <ellipse
          cx="110"
          cy="112"
          rx="55"
          ry="6"
          fill="#fef3c7"
          fillOpacity="0.3"
        />
      </g>

      {/* Jar lid */}
      <rect
        x="48"
        y="50"
        width="124"
        height="18"
        rx="5"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="2"
      />
      <rect x="52" y="54" width="116" height="10" rx="3" fill="#cbd5e1" />
      <ellipse
        cx="110"
        cy="50"
        rx="62"
        ry="7"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* ===== SPECIMEN: frog inside ===== */}
      <g>
        {/* Body */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ellipse
            cx="110"
            cy="192"
            rx="22"
            ry="30"
            fill="#86efac"
            stroke="#22c55e"
            strokeWidth="1.2"
          />
          {/* Head */}
          <ellipse
            cx="110"
            cy="158"
            rx="16"
            ry="12"
            fill="#86efac"
            stroke="#22c55e"
            strokeWidth="1.2"
          />
          {/* Eyes */}
          <circle
            cx="104"
            cy="153"
            r="3.5"
            fill="#dcfce7"
            stroke="#16a34a"
            strokeWidth="0.8"
          />
          <circle
            cx="116"
            cy="153"
            r="3.5"
            fill="#dcfce7"
            stroke="#16a34a"
            strokeWidth="0.8"
          />
          <circle cx="104" cy="153" r="1.5" fill="#1e293b" />
          <circle cx="116" cy="153" r="1.5" fill="#1e293b" />
          {/* Front legs */}
          <path
            d="M 90 178 Q 78 174 72 182 Q 68 188 76 190 Q 82 190 86 184 Q 88 180 90 182"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 130 178 Q 142 174 148 182 Q 152 188 144 190 Q 138 190 134 184 Q 132 180 130 182"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Hind legs */}
          <path
            d="M 92 208 Q 80 216 76 228 Q 74 234 80 235 Q 86 235 90 228 Q 94 218 96 212"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 128 208 Q 140 216 144 228 Q 146 234 140 235 Q 134 235 130 228 Q 126 218 124 212"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Spine line */}
          <line
            x1="110"
            y1="165"
            x2="110"
            y2="215"
            stroke="#16a34a"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </motion.g>
      </g>

      {/* Label sticker on jar */}
      <rect
        x="68"
        y="78"
        width="84"
        height="24"
        rx="3"
        fill="#fef9c3"
        stroke="#fbbf24"
        strokeWidth="1"
      />
      <text
        x="110"
        y="88"
        textAnchor="middle"
        fontSize="7"
        fontWeight="600"
        fill="#78350f"
      >
        SPECIMEN
      </text>
      <text x="110" y="98" textAnchor="middle" fontSize="6" fill="#92400e">
        Preserved · Rana sp.
      </text>

      {/* Jar highlights */}
      <path
        d="M 58 70 Q 55 130 58 200"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.18"
      />

      {/* Label */}
      <text
        x="110"
        y="292"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Biological Specimen
      </text>
    </svg>
  );
}
