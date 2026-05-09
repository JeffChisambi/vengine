import React from "react";

export default function RetortStandSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(100,116,139,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="metalRod" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="330"
        rx="85"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.4"
      />

      {/* Heavy rectangular base */}
      <rect
        x="30"
        y="305"
        width="180"
        height="18"
        rx="3"
        fill="url(#baseGrad)"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Base top highlight */}
      <rect
        x="32"
        y="305"
        width="176"
        height="4"
        rx="2"
        fill="#cbd5e1"
        opacity="0.4"
      />

      {/* Vertical rod */}
      <rect
        x="112"
        y="38"
        width="16"
        height="270"
        rx="4"
        fill="url(#metalRod)"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Rod highlight */}
      <line
        x1="117"
        y1="45"
        x2="117"
        y2="300"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Rod top cap */}
      <ellipse
        cx="120"
        cy="38"
        rx="10"
        ry="4"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.5"
      />

      {/* Threaded nut 1 (top) */}
      <rect
        x="108"
        y="90"
        width="24"
        height="10"
        rx="3"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />
      <line
        x1="110"
        y1="93"
        x2="130"
        y2="93"
        stroke="#94a3b8"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="110"
        y1="96"
        x2="130"
        y2="96"
        stroke="#94a3b8"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Threaded nut 2 (middle) */}
      <rect
        x="108"
        y="170"
        width="24"
        height="10"
        rx="3"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />
      <line
        x1="110"
        y1="173"
        x2="130"
        y2="173"
        stroke="#94a3b8"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="110"
        y1="176"
        x2="130"
        y2="176"
        stroke="#94a3b8"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Threaded nut 3 (lower) */}
      <rect
        x="108"
        y="240"
        width="24"
        height="10"
        rx="3"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />
      <line
        x1="110"
        y1="243"
        x2="130"
        y2="243"
        stroke="#94a3b8"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1="110"
        y1="246"
        x2="130"
        y2="246"
        stroke="#94a3b8"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Label */}
      <text
        x="120"
        y="352"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Retort Stand
      </text>
    </svg>
  );
}
