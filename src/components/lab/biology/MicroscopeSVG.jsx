import React from "react";

export default function MicroscopeSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 260 380"
      className="w-full h-full max-h-[380px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(99,102,241,0.35))"
          : "drop-shadow(0 4px 14px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="msBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="35%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="msArm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="40%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id="msBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="msLens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* ── BASE ── horseshoe/U shape */}
      <path
        d="M 52 318 Q 52 342 80 342 L 180 342 Q 208 342 208 318 L 208 308 L 52 308 Z"
        fill="url(#msBase)"
        stroke="#1f2937"
        strokeWidth="2"
      />
      {/* Base top surface */}
      <rect
        x="54"
        y="306"
        width="152"
        height="8"
        rx="2"
        fill="#4b5563"
        opacity="0.4"
      />
      {/* Base feet */}
      <rect
        x="55"
        y="334"
        width="40"
        height="10"
        rx="4"
        fill="#111827"
        stroke="#1f2937"
        strokeWidth="1"
      />
      <rect
        x="165"
        y="334"
        width="40"
        height="10"
        rx="4"
        fill="#111827"
        stroke="#1f2937"
        strokeWidth="1"
      />

      {/* ── STAGE (specimen platform) ── */}
      <rect
        x="72"
        y="255"
        width="116"
        height="14"
        rx="3"
        fill="url(#msBody)"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      {/* Stage opening (hole for light) */}
      <ellipse cx="130" cy="262" rx="14" ry="6" fill="#1f2937" />
      <ellipse cx="130" cy="262" rx="10" ry="4" fill="#0f172a" />
      {/* Stage clips */}
      <rect
        x="95"
        y="254"
        width="8"
        height="6"
        rx="2"
        fill="#6b7280"
        stroke="#374151"
        strokeWidth="0.8"
      />
      <rect
        x="157"
        y="254"
        width="8"
        height="6"
        rx="2"
        fill="#6b7280"
        stroke="#374151"
        strokeWidth="0.8"
      />
      {/* Stage adjustment knobs (coarse/fine) */}
      <circle
        cx="72"
        cy="262"
        r="8"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      <circle cx="72" cy="262" r="4" fill="#4b5563" />
      <circle
        cx="188"
        cy="262"
        r="8"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      <circle cx="188" cy="262" r="4" fill="#4b5563" />
      {/* Fine adjustment (smaller, below) */}
      <circle
        cx="72"
        cy="278"
        r="6"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.2"
      />
      <circle cx="72" cy="278" r="3" fill="#6b7280" />
      <circle
        cx="188"
        cy="278"
        r="6"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.2"
      />
      <circle cx="188" cy="278" r="3" fill="#6b7280" />

      {/* ── ARM / PILLAR ── */}
      <path
        d="M 118 78 Q 104 78 100 120 L 98 290 Q 98 308 118 308 L 142 308 Q 162 308 162 290 L 160 120 Q 156 78 142 78 Z"
        fill="url(#msArm)"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      {/* Arm highlight */}
      <line
        x1="126"
        y1="88"
        x2="126"
        y2="300"
        stroke="#6b7280"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* ── BODY TUBE ── */}
      <rect
        x="112"
        y="55"
        width="36"
        height="30"
        rx="4"
        fill="url(#msBody)"
        stroke="#1f2937"
        strokeWidth="1.5"
      />

      {/* ── EYEPIECE ── */}
      <rect
        x="116"
        y="28"
        width="28"
        height="32"
        rx="5"
        fill="url(#msBody)"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      {/* Eyepiece eye-guard rubber */}
      <ellipse
        cx="130"
        cy="28"
        rx="16"
        ry="7"
        fill="#1f2937"
        stroke="#374151"
        strokeWidth="1"
      />
      <ellipse cx="130" cy="28" rx="12" ry="5" fill="#111827" />
      <ellipse
        cx="130"
        cy="28"
        rx="7"
        ry="3"
        fill="#1d4ed8"
        fillOpacity="0.6"
      />
      {/* Eyepiece glass */}
      <ellipse
        cx="130"
        cy="28"
        rx="4"
        ry="2"
        fill="#93c5fd"
        fillOpacity="0.7"
      />
      {/* Eyepiece knurling */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="117"
          y1={36 + i * 4}
          x2="143"
          y2={36 + i * 4}
          stroke="#1f2937"
          strokeWidth="0.8"
          opacity="0.5"
        />
      ))}

      {/* ── REVOLVING NOSEPIECE ── */}
      <circle
        cx="130"
        cy="200"
        r="22"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      <circle
        cx="130"
        cy="200"
        r="12"
        fill="#1f2937"
        stroke="#374151"
        strokeWidth="1"
      />

      {/* ── OBJECTIVE LENSES (3 objectives) ── */}
      {/* Low power (shortest) */}
      <rect
        x="144"
        y="195"
        width="8"
        height="28"
        rx="3"
        fill="url(#msBody)"
        stroke="#1f2937"
        strokeWidth="1"
      />
      <ellipse cx="148" cy="223" rx="5" ry="3" fill="url(#msLens)" />
      <ellipse
        cx="148"
        cy="223"
        rx="3"
        ry="2"
        fill="#bfdbfe"
        fillOpacity="0.6"
      />
      <text x="152" y="214" fontSize="5" fill="#9ca3af">
        10x
      </text>

      {/* Medium power */}
      <rect
        x="128"
        y="216"
        width="8"
        height="36"
        rx="3"
        fill="url(#msBody)"
        stroke="#1f2937"
        strokeWidth="1"
      />
      <ellipse cx="132" cy="252" rx="5" ry="3" fill="url(#msLens)" />
      <ellipse
        cx="132"
        cy="252"
        rx="3"
        ry="2"
        fill="#bfdbfe"
        fillOpacity="0.6"
      />
      <text x="120" y="242" fontSize="5" fill="#9ca3af">
        40x
      </text>

      {/* High power (longest — pointing toward stage) */}
      <rect
        x="112"
        y="205"
        width="8"
        height="50"
        rx="3"
        fill="#1d4ed8"
        stroke="#1e3a8a"
        strokeWidth="1"
      />
      <ellipse cx="116" cy="255" rx="5" ry="3" fill="url(#msLens)" />
      <ellipse
        cx="116"
        cy="255"
        rx="3"
        ry="2"
        fill="#bfdbfe"
        fillOpacity="0.7"
      />
      <text x="98" y="235" fontSize="5" fill="#93c5fd">
        100x
      </text>

      {/* ── CONDENSER below stage ── */}
      <rect
        x="118"
        y="268"
        width="24"
        height="18"
        rx="3"
        fill="url(#msBody)"
        stroke="#1f2937"
        strokeWidth="1.2"
      />
      <ellipse
        cx="130"
        cy="286"
        rx="10"
        ry="4"
        fill="#4b5563"
        stroke="#1f2937"
        strokeWidth="0.8"
      />

      {/* ── MIRROR / ILLUMINATOR ── */}
      <ellipse
        cx="130"
        cy="302"
        rx="18"
        ry="7"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <ellipse
        cx="130"
        cy="302"
        rx="14"
        ry="5"
        fill="#bfdbfe"
        fillOpacity="0.5"
      />
      <rect
        x="126"
        y="292"
        width="8"
        height="12"
        rx="2"
        fill="#4b5563"
        stroke="#374151"
        strokeWidth="0.8"
      />

      {/* Label */}
      <text
        x="130"
        y="365"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Microscope
      </text>
    </svg>
  );
}
