import React from "react";

export default function MicroscopeSlideSVG({
  hasSpecimen = true,
  specimenColor = "#86efac",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 300 160"
      className="w-full h-full max-h-[160px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.3))"
          : "drop-shadow(0 4px 10px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="slideGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <rect
        x="26"
        y="116"
        width="248"
        height="6"
        rx="3"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Slide body — 75 mm × 25 mm proportional */}
      <rect
        x="22"
        y="60"
        width="256"
        height="52"
        rx="3"
        fill="url(#slideGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Frosted label end (left) */}
      <rect
        x="22"
        y="60"
        width="44"
        height="52"
        rx="3"
        fill="#e5e7eb"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <line
        x1="22"
        y1="67"
        x2="66"
        y2="67"
        stroke="#d1d5db"
        strokeWidth="0.8"
      />
      <line
        x1="22"
        y1="74"
        x2="66"
        y2="74"
        stroke="#d1d5db"
        strokeWidth="0.8"
      />
      <line
        x1="22"
        y1="81"
        x2="66"
        y2="81"
        stroke="#d1d5db"
        strokeWidth="0.8"
      />
      <text
        x="44"
        y="90"
        textAnchor="middle"
        fontSize="7"
        fill="#6b7280"
        transform="rotate(-90,44,86)"
      >
        SPECIMEN
      </text>

      {/* Glass highlight */}
      <line
        x1="70"
        y1="64"
        x2="272"
        y2="64"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Specimen stain area */}
      {hasSpecimen && (
        <g>
          {/* Mounted specimen — onion cells or similar */}
          <rect
            x="130"
            y="68"
            width="80"
            height="36"
            rx="2"
            fill={specimenColor}
            fillOpacity="0.28"
          />
          {/* Cell grid pattern */}
          {[0, 1, 2, 3].map((col) =>
            [0, 1].map((row) => (
              <rect
                key={`${col}-${row}`}
                x={133 + col * 19}
                y={70 + row * 17}
                width="17"
                height="15"
                rx="1"
                fill="none"
                stroke={specimenColor}
                strokeWidth="0.8"
                fillOpacity="0.5"
              />
            )),
          )}
          {/* Nuclei dots */}
          {[0, 1, 2, 3].map((col) =>
            [0, 1].map((row) => (
              <circle
                key={`n-${col}-${row}`}
                cx={141 + col * 19}
                cy={77 + row * 17}
                r="2.5"
                fill={specimenColor}
                fillOpacity="0.7"
              />
            )),
          )}
          {/* Cover slip outline (over specimen) */}
          <rect
            x="120"
            y="65"
            width="100"
            height="42"
            rx="1"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
        </g>
      )}

      {/* Scale bar */}
      <line
        x1="240"
        y1="100"
        x2="268"
        y2="100"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <line
        x1="240"
        y1="97"
        x2="240"
        y2="103"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <line
        x1="268"
        y1="97"
        x2="268"
        y2="103"
        stroke="#94a3b8"
        strokeWidth="1"
      />
      <text x="254" y="96" textAnchor="middle" fontSize="6" fill="#94a3b8">
        1 mm
      </text>

      {/* Label */}
      <text
        x="150"
        y="148"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Microscope Slide
      </text>
    </svg>
  );
}
