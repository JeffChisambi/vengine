import React from "react";

export default function TripodStandSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 260 320"
      className="w-full h-full max-h-[320px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(100,116,139,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="tripodMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="130"
        cy="290"
        rx="90"
        ry="10"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Ring at top */}
      <ellipse
        cx="130"
        cy="85"
        rx="60"
        ry="14"
        fill="none"
        stroke="#64748b"
        strokeWidth="6"
      />
      <ellipse
        cx="130"
        cy="85"
        rx="60"
        ry="14"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        opacity="0.3"
      />
      {/* Ring top surface */}
      <ellipse
        cx="130"
        cy="82"
        rx="56"
        ry="11"
        fill="#cbd5e1"
        fillOpacity="0.2"
      />

      {/* Left leg */}
      <line
        x1="74"
        y1="95"
        x2="40"
        y2="275"
        stroke="url(#tripodMetal)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Left leg highlight */}
      <line
        x1="72"
        y1="100"
        x2="42"
        y2="270"
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />
      {/* Left foot */}
      <ellipse
        cx="38"
        cy="278"
        rx="10"
        ry="4"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Right leg */}
      <line
        x1="186"
        y1="95"
        x2="220"
        y2="275"
        stroke="url(#tripodMetal)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1="188"
        y1="100"
        x2="222"
        y2="270"
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />
      <ellipse
        cx="222"
        cy="278"
        rx="10"
        ry="4"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Back leg (center, slightly shorter visually for perspective) */}
      <line
        x1="130"
        y1="97"
        x2="130"
        y2="275"
        stroke="url(#tripodMetal)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1="133"
        y1="102"
        x2="133"
        y2="270"
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />
      <ellipse
        cx="130"
        cy="278"
        rx="10"
        ry="4"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      {/* Label */}
      <text
        x="130"
        y="310"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Tripod Stand
      </text>
    </svg>
  );
}
