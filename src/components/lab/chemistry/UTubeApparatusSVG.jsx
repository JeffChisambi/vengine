import React from "react";
import { motion } from "framer-motion";

export default function UTubeApparatusSVG({
  leftColor = "#38bdf8",
  rightColor = "#f59e0b",
  leftLevel = 0.45,
  rightLevel = 0.6,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(56,189,248,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="utGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="utLeftLiq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={leftColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={leftColor} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="utRightLiq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rightColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={rightColor} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id="utLeftClip">
          <rect x="58" y="25" width="28" height="225" />
        </clipPath>
        <clipPath id="utRightClip">
          <rect x="132" y="25" width="28" height="225" />
        </clipPath>
        <clipPath id="utCurveClip">
          <rect x="58" y="210" width="102" height="50" />
        </clipPath>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="60"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── U-TUBE GLASS BODY ── */}
      {/* Left arm */}
      <rect
        x="58"
        y="25"
        width="28"
        height="225"
        rx="4"
        fill="url(#utGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Right arm */}
      <rect
        x="132"
        y="25"
        width="28"
        height="225"
        rx="4"
        fill="url(#utGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Bottom curve */}
      <path
        d="M 58 235 Q 58 265 110 265 Q 162 265 162 235"
        fill="url(#utGlassGrad)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* ── LIQUIDS ── */}
      {/* Left arm liquid */}
      <g clipPath="url(#utLeftClip)">
        <motion.rect
          x="60"
          width="24"
          fill="url(#utLeftLiq)"
          initial={{ y: 250, height: 0 }}
          animate={{ y: 250 - leftLevel * 200, height: leftLevel * 200 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="72"
          rx="10"
          ry="3"
          fill={leftColor}
          fillOpacity="0.3"
          initial={{ cy: 250 }}
          animate={{ cy: 250 - leftLevel * 200 + 2 }}
          transition={{ duration: 0.8 }}
        />
      </g>
      {/* Right arm liquid */}
      <g clipPath="url(#utRightClip)">
        <motion.rect
          x="134"
          width="24"
          fill="url(#utRightLiq)"
          initial={{ y: 250, height: 0 }}
          animate={{ y: 250 - rightLevel * 200, height: rightLevel * 200 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
        />
        <motion.ellipse
          cx="146"
          rx="10"
          ry="3"
          fill={rightColor}
          fillOpacity="0.3"
          initial={{ cy: 250 }}
          animate={{ cy: 250 - rightLevel * 200 + 2 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </g>
      {/* Bottom fill */}
      <g clipPath="url(#utCurveClip)">
        <path
          d="M 60 235 Q 60 262 110 262 Q 160 262 160 235 Z"
          fill="url(#utLeftLiq)"
        />
      </g>

      {/* Tube openings */}
      <ellipse
        cx="72"
        cy="25"
        rx="14"
        ry="4"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="146"
        cy="25"
        rx="14"
        ry="4"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Level difference indicator */}
      {leftLevel !== rightLevel && (
        <>
          <line
            x1="88"
            y1={250 - leftLevel * 200}
            x2="130"
            y2={250 - leftLevel * 200}
            stroke="#64748b"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />
          <line
            x1="88"
            y1={250 - rightLevel * 200}
            x2="130"
            y2={250 - rightLevel * 200}
            stroke="#64748b"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />
          {/* Δh arrow */}
          <line
            x1="110"
            y1={250 - leftLevel * 200}
            x2="110"
            y2={250 - rightLevel * 200}
            stroke="#ef4444"
            strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />
          <text
            x="115"
            y={250 - ((leftLevel + rightLevel) / 2) * 200 + 4}
            fontSize="8"
            fill="#ef4444"
            fontWeight="600"
          >
            Δh
          </text>
        </>
      )}

      {/* Glass highlights */}
      <line
        x1="63"
        y1="30"
        x2="63"
        y2="225"
        stroke="#ffffff"
        strokeWidth="2.5"
        opacity="0.22"
        strokeLinecap="round"
      />
      <line
        x1="137"
        y1="30"
        x2="137"
        y2="225"
        stroke="#ffffff"
        strokeWidth="2.5"
        opacity="0.22"
        strokeLinecap="round"
      />

      {/* Graduation marks */}
      {[0.2, 0.4, 0.6, 0.8].map((m, i) => (
        <g key={i}>
          <line
            x1="86"
            y1={250 - m * 200}
            x2="92"
            y2={250 - m * 200}
            stroke="#64748b"
            strokeWidth="0.8"
          />
          <text x="94" y={250 - m * 200 + 3} fontSize="7" fill="#64748b">
            {(m * 50).toFixed(0)}
          </text>
        </g>
      ))}

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        U-Tube Apparatus
      </text>
    </svg>
  );
}
