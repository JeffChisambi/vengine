import React from "react";

export default function ClampHolderSVG({ open = true, glow = false }) {
  const jawAngle = open ? 15 : 0;

  return (
    <svg
      viewBox="0 0 260 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(100,116,139,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="clampMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="clampDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="130"
        cy="268"
        rx="60"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.3"
      />

      {/* Attachment boss - connects to stand rod */}
      <rect
        x="38"
        y="120"
        width="40"
        height="30"
        rx="5"
        fill="url(#clampDark)"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Boss hole */}
      <circle
        cx="58"
        cy="135"
        r="8"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="1.5"
      />
      <circle cx="58" cy="135" r="5" fill="#334155" />

      {/* Connecting arm */}
      <rect
        x="72"
        y="128"
        width="70"
        height="14"
        rx="4"
        fill="url(#clampMetal)"
        stroke="#64748b"
        strokeWidth="1.5"
      />
      {/* Arm highlight */}
      <line
        x1="78"
        y1="132"
        x2="136"
        y2="132"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Pivot point */}
      <circle
        cx="145"
        cy="135"
        r="10"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="2"
      />
      <circle cx="145" cy="135" r="4" fill="#94a3b8" />

      {/* Upper jaw */}
      <g transform={`rotate(${-jawAngle}, 145, 135)`}>
        <path
          d="M 145 130 L 220 118 Q 228 116 230 120 L 230 128 Q 228 132 220 130 L 145 130 Z"
          fill="url(#clampMetal)"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Jaw pad (rubber/cork) */}
        <rect
          x="200"
          y="118"
          width="28"
          height="12"
          rx="2"
          fill="#78716c"
          stroke="#57534e"
          strokeWidth="1"
        />
        {/* Serrations on jaw pad */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={204 + i * 6}
            y1="119"
            x2={204 + i * 6}
            y2="129"
            stroke="#a8a29e"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Lower jaw */}
      <g transform={`rotate(${jawAngle}, 145, 135)`}>
        <path
          d="M 145 140 L 220 152 Q 228 154 230 150 L 230 142 Q 228 138 220 140 L 145 140 Z"
          fill="url(#clampMetal)"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Jaw pad */}
        <rect
          x="200"
          y="140"
          width="28"
          height="12"
          rx="2"
          fill="#78716c"
          stroke="#57534e"
          strokeWidth="1"
        />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={204 + i * 6}
            y1="141"
            x2={204 + i * 6}
            y2="151"
            stroke="#a8a29e"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Screw/tightening knob */}
      <circle
        cx="145"
        cy="165"
        r="7"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <line
        x1="145"
        y1="160"
        x2="145"
        y2="170"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <line
        x1="140"
        y1="165"
        x2="150"
        y2="165"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      {/* Knob stem */}
      <rect
        x="142"
        y="142"
        width="6"
        height="18"
        rx="2"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1"
      />

      {/* Label */}
      <text
        x="130"
        y="260"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Clamp Holder
      </text>
    </svg>
  );
}
