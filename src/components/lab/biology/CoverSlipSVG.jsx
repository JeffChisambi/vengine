import React from "react";

export default function CoverSlipSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 260 200"
      className="w-full h-full max-h-[200px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.35))"
          : "drop-shadow(0 4px 10px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="csGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Drop shadow beneath slip */}
      <rect
        x="58"
        y="120"
        width="148"
        height="8"
        rx="3"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── 3-D isometric view of cover slip ── */}
      {/* Bottom face */}
      <parallelogram />
      <path
        d="M 60 105 L 200 105 L 220 125 L 80 125 Z"
        fill="#c7d2fe"
        fillOpacity="0.3"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Left face (thin edge — only ~0.15 mm in real life, so very thin) */}
      <path
        d="M 60 105 L 60 110 L 80 130 L 80 125 Z"
        fill="#a5b4fc"
        fillOpacity="0.35"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Top face — main visible surface */}
      <path
        d="M 60 58 L 200 58 L 220 78 L 80 78 Z"
        fill="url(#csGlass)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Right edge (thin) */}
      <path
        d="M 200 58 L 200 105 L 220 125 L 220 78 Z"
        fill="#a5b4fc"
        fillOpacity="0.25"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Front edge (thin) */}
      <path
        d="M 60 58 L 200 58 L 200 63 L 60 63 Z"
        fill="#c7d2fe"
        fillOpacity="0.4"
        stroke="#94a3b8"
        strokeWidth="0.5"
      />

      {/* Glass surface reflections */}
      <line
        x1="68"
        y1="62"
        x2="155"
        y2="62"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line
        x1="72"
        y1="66"
        x2="120"
        y2="66"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.28"
      />
      {/* Corner reflection diagonal */}
      <line
        x1="188"
        y1="60"
        x2="210"
        y2="70"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.22"
      />

      {/* Refraction rainbow-ish tint stripe */}
      <path
        d="M 100 60 L 130 60 L 148 78 L 118 78 Z"
        fill="#ddd6fe"
        fillOpacity="0.25"
      />

      {/* Dimension annotation */}
      <line
        x1="60"
        y1="50"
        x2="200"
        y2="50"
        stroke="#cbd5e1"
        strokeWidth="0.8"
        strokeDasharray="3,3"
      />
      <line x1="60" y1="47" x2="60" y2="53" stroke="#94a3b8" strokeWidth="1" />
      <line
        x1="200"
        y1="47"
        x2="200"
        y2="53"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <text x="130" y="47" textAnchor="middle" fontSize="7.5" fill="#94a3b8">
        18 mm × 18 mm
      </text>

      {/* Thickness annotation */}
      <line
        x1="210"
        y1="58"
        x2="245"
        y2="45"
        stroke="#cbd5e1"
        strokeWidth="0.8"
        strokeDasharray="2,2"
      />
      <text x="248" y="44" fontSize="6.5" fill="#94a3b8">
        0.15 mm
      </text>

      {/* Label */}
      <text
        x="140"
        y="175"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Cover Slip
      </text>
    </svg>
  );
}
