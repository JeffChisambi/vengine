import React from "react";
import { motion } from "framer-motion";

export default function MortarPestleSVG({
  grinding = false,
  contentColor = "#84cc16",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 280 320"
      className="w-full h-full max-h-[320px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(132,204,22,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="mortarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4b5a0" />
          <stop offset="30%" stopColor="#e8e0d5" />
          <stop offset="60%" stopColor="#f5f0ea" />
          <stop offset="100%" stopColor="#b5a090" />
        </linearGradient>
        <linearGradient id="mortarInner" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a89080" />
          <stop offset="50%" stopColor="#d4c8b8" />
          <stop offset="100%" stopColor="#a89080" />
        </linearGradient>
        <linearGradient id="pestleBodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b5a090" />
          <stop offset="35%" stopColor="#e8e0d5" />
          <stop offset="65%" stopColor="#f5f0ea" />
          <stop offset="100%" stopColor="#a89080" />
        </linearGradient>
        <linearGradient id="pestleHeadGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a89080" />
          <stop offset="40%" stopColor="#ddd5c8" />
          <stop offset="100%" stopColor="#9a8070" />
        </linearGradient>
        <clipPath id="mortarClip">
          <path d="M 58 148 Q 52 235 140 244 Q 228 235 222 148 Z" />
        </clipPath>
      </defs>

      {/* ── Drop shadow ── */}
      <ellipse
        cx="140"
        cy="262"
        rx="78"
        ry="11"
        fill="#94a3b8"
        fillOpacity="0.22"
      />

      {/* ── Mortar body ── */}
      {/* Outer wall */}
      <path
        d="M 52 143 Q 46 238 140 248 Q 234 238 228 143"
        fill="url(#mortarGrad)"
        stroke="#8a7060"
        strokeWidth="2.5"
      />
      {/* Inner bowl (concave surface) */}
      <path
        d="M 68 150 Q 64 228 140 236 Q 216 228 212 150"
        fill="url(#mortarInner)"
        stroke="none"
      />
      {/* Inner highlight (light catch) */}
      <path
        d="M 78 158 Q 76 215 105 230"
        fill="none"
        stroke="#f5f0ea"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Ground content */}
      {contentColor && (
        <g clipPath="url(#mortarClip)">
          <ellipse
            cx="140"
            cy="224"
            rx="58"
            ry="10"
            fill={contentColor}
            fillOpacity="0.38"
          />
          {[
            [105, 218, 3],
            [122, 214, 2.5],
            [140, 216, 3.5],
            [158, 215, 2.5],
            [172, 219, 3],
            [115, 225, 2],
            [148, 223, 2],
            [132, 220, 1.5],
          ].map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={contentColor}
              fillOpacity="0.65"
            />
          ))}
        </g>
      )}

      {/* ── Mortar rim ── */}
      {/* Rim outer ellipse */}
      <ellipse
        cx="140"
        cy="143"
        rx="90"
        ry="19"
        fill="#ddd5c8"
        stroke="#8a7060"
        strokeWidth="2.5"
      />
      {/* Rim inner lip */}
      <ellipse
        cx="140"
        cy="142"
        rx="80"
        ry="15"
        fill="#c8bfb0"
        stroke="#a89080"
        strokeWidth="1.5"
      />
      {/* Rim top highlight */}
      <ellipse
        cx="140"
        cy="140"
        rx="72"
        ry="10"
        fill="#e8e0d5"
        fillOpacity="0.6"
      />

      {/* ── Mortar base foot ── */}
      <ellipse
        cx="140"
        cy="248"
        rx="42"
        ry="8"
        fill="#c4b5a0"
        stroke="#8a7060"
        strokeWidth="1.5"
      />
      <ellipse cx="140" cy="248" rx="38" ry="5" fill="#d4c8b8" opacity="0.5" />

      {/* ══════════════════════════════════════════
           PESTLE — accurate elongated club shape
           Held at ~30° angle from vertical
          ══════════════════════════════════════════ */}
      <motion.g
        animate={grinding ? { rotate: [-6, 6, -6], x: [-4, 4, -4] } : {}}
        transition={
          grinding
            ? { duration: 0.75, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
        style={{ originX: "155px", originY: "195px" }}
      >
        {/*
          Pestle geometry (at ~28° tilt, tip at bottom-left inside mortar):
          - Tip (rounded, blunt grinding end): center ~(128, 210)
          - Narrow neck just above tip
          - Body gradually widens upward
          - Upper bulge / knob at the top for grip
        */}

        {/* === Pestle shaft (elongated body) === */}
        {/* The pestle is drawn as a tapered shape wider at top, narrower near tip */}
        {/* Using a path along the ~28° axis */}

        {/* Axis: tip at (130,208), knob center at (195,58) — ~28° from vertical */}
        {/* We build the outline as a closed path */}
        <path
          d={`
            M 122 192
            C 116 178, 114 162, 118 128
            C 121 100, 128 75,  140 55
            C 146 44,  158 40,  168 46
            C 178 52,  182 66,  178 80
            C 174 94,  164 105, 156 130
            C 150 155, 150 178, 148 196
            C 145 206, 137 214, 130 210
            C 123 206, 120 200, 122 192
            Z
          `}
          fill="url(#pestleBodyGrad)"
          stroke="#7a6a5a"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Shaft highlight (left side catch) */}
        <path
          d="M 125 188 C 121 170, 120 145, 124 112 C 127 88, 133 66, 142 52"
          fill="none"
          stroke="#f5f0ea"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.28"
        />

        {/* Narrow neck just above grinding head */}
        <path
          d={`
            M 122 192
            C 121 197, 122 204, 126 208
            C 129 212, 135 213, 140 210
            C 145 207, 148 202, 148 196
            C 146 192, 138 190, 130 191
            C 126 191, 122 192, 122 192
            Z
          `}
          fill="url(#pestleHeadGrad)"
          stroke="#7a6a5a"
          strokeWidth="1.5"
        />

        {/* Grinding tip — rounded dome */}
        <ellipse
          cx="135"
          cy="209"
          rx="14"
          ry="9"
          fill="url(#pestleHeadGrad)"
          stroke="#7a6a5a"
          strokeWidth="1.5"
        />
        {/* Tip highlight */}
        <ellipse
          cx="131"
          cy="206"
          rx="5"
          ry="3"
          fill="#e8e0d5"
          opacity="0.35"
          transform="rotate(-20, 131, 206)"
        />

        {/* Upper knob / grip bulge */}
        <ellipse
          cx="158"
          cy="57"
          rx="20"
          ry="14"
          fill="url(#pestleBodyGrad)"
          stroke="#7a6a5a"
          strokeWidth="1.8"
          transform="rotate(-28, 158, 57)"
        />
        {/* Knob highlight */}
        <ellipse
          cx="151"
          cy="51"
          rx="8"
          ry="5"
          fill="#f5f0ea"
          opacity="0.30"
          transform="rotate(-28, 151, 51)"
        />

        {/* Neck ring (decorative groove near knob) */}
        <path
          d="M 140 77 Q 150 74 158 76 Q 166 79 168 85"
          fill="none"
          stroke="#8a7060"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M 141 83 Q 151 80 159 82 Q 167 85 169 91"
          fill="none"
          stroke="#8a7060"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />
      </motion.g>

      {/* Label */}
      <text
        x="140"
        y="294"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Mortar &amp; Pestle
      </text>
    </svg>
  );
}
