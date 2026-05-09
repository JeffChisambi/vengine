import React from "react";
import { motion } from "framer-motion";

export default function FuseSVG({
  blown = false,
  rating = "3A",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(251,191,36,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="fuseGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.55" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="fuseCap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="282"
        rx="55"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── END CAP LEFT ── */}
      <rect
        x="32"
        y="132"
        width="38"
        height="38"
        rx="6"
        fill="url(#fuseCap)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Cap contact face */}
      <rect
        x="32"
        y="138"
        width="8"
        height="26"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />

      {/* ── END CAP RIGHT ── */}
      <rect
        x="150"
        y="132"
        width="38"
        height="38"
        rx="6"
        fill="url(#fuseCap)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      <rect
        x="180"
        y="138"
        width="8"
        height="26"
        rx="3"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />

      {/* ── GLASS BODY ── */}
      <rect
        x="68"
        y="126"
        width="84"
        height="50"
        rx="24"
        fill="url(#fuseGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Glass highlight */}
      <path
        d="M 78 132 Q 110 128 142 132"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
        fill="none"
      />

      {/* ── FUSE WIRE / ELEMENT ── */}
      {blown ? (
        <>
          {/* Broken wire segments */}
          <line
            x1="70"
            y1="151"
            x2="98"
            y2="151"
            stroke="#1e293b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="118"
            y1="151"
            x2="150"
            y2="151"
            stroke="#1e293b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Scorch mark */}
          <ellipse
            cx="108"
            cy="151"
            rx="10"
            ry="8"
            fill="#78350f"
            fillOpacity="0.35"
          />
          <motion.ellipse
            cx="108"
            cy="151"
            rx="6"
            ry="5"
            fill="#f97316"
            fillOpacity="0.2"
            animate={{ fillOpacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {/* Gap spark mark */}
          <circle cx="108" cy="151" r="3" fill="#0f172a" fillOpacity="0.5" />
        </>
      ) : (
        <>
          {/* Intact fuse wire */}
          <line
            x1="70"
            y1="151"
            x2="150"
            y2="151"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Wire shine */}
          <line
            x1="80"
            y1="149"
            x2="140"
            y2="149"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.3"
            strokeLinecap="round"
          />
        </>
      )}

      {/* ── RATING LABEL ── */}
      <text
        x="110"
        y="115"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#475569"
      >
        {rating}
      </text>
      {blown && (
        <text
          x="110"
          y="198"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#ef4444"
        >
          BLOWN
        </text>
      )}

      {/* Leads */}
      <line
        x1="10"
        y1="151"
        x2="32"
        y2="151"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="188"
        y1="151"
        x2="210"
        y2="151"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Fuse
      </text>
    </svg>
  );
}
