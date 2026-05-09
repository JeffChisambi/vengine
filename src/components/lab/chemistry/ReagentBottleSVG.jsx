import React from "react";
import { motion } from "framer-motion";

export default function ReagentBottleSVG({
  liquidLevel = 0.5,
  liquidColor = "#fbbf24",
  glow = false,
  lidOn = true,
}) {
  // Bottle geometry
  const bottleLeft = 90;
  const bottleRight = 190;
  const bottleTop = 105;
  const bottleBottom = 255;
  const bottleH = bottleBottom - bottleTop;
  const liquidY = bottleBottom - bottleH * liquidLevel;

  return (
    <svg
      viewBox="0 0 280 310"
      className="w-full h-full max-h-[310px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 16px ${liquidColor}88)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="rbGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.55" />
          <stop offset="20%" stopColor="#e0f2fe" stopOpacity="0.18" />
          <stop offset="55%" stopColor="#f0f9ff" stopOpacity="0.08" />
          <stop offset="80%" stopColor="#e0f2fe" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="rbLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="rbStopper" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#78716c" />
          <stop offset="40%" stopColor="#d6d3d1" />
          <stop offset="100%" stopColor="#78716c" />
        </linearGradient>
        <clipPath id="rbClip">
          <path d="M 90 105 L 90 255 Q 90 265 140 265 Q 190 265 190 255 L 190 105 Z" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="140"
        cy="268"
        rx="56"
        ry="8"
        fill="#94a3b8"
        fillOpacity="0.22"
      />

      {/* === Bottle body (amber/glass reagent bottle shape) === */}
      {/* Main rectangular body with slightly rounded bottom */}
      <path
        d="M 90 115 L 90 252 Q 90 265 140 265 Q 190 265 190 252 L 190 115 Z"
        fill="url(#rbGlass)"
        stroke="#5ba3c9"
        strokeWidth="2"
      />

      {/* Liquid fill */}
      {liquidLevel > 0 && (
        <g clipPath="url(#rbClip)">
          <rect
            x="90"
            y={liquidY}
            width="100"
            height={bottleBottom - liquidY + 15}
            fill="url(#rbLiquid)"
          />
          <motion.rect
            x="90"
            width="100"
            height="5"
            fill={liquidColor}
            fillOpacity="0.4"
            animate={{ y: [liquidY - 1, liquidY + 1, liquidY - 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Glass highlight left */}
      <rect
        x="95"
        y="120"
        width="7"
        height="125"
        rx="3"
        fill="#ffffff"
        fillOpacity="0.28"
      />
      {/* Glass highlight right (narrow) */}
      <rect
        x="178"
        y="125"
        width="4"
        height="110"
        rx="2"
        fill="#ffffff"
        fillOpacity="0.12"
      />

      {/* Shoulder (tapers from body to neck) */}
      <path
        d="M 90 115 Q 90 100 110 93 L 170 93 Q 190 100 190 115"
        fill="url(#rbGlass)"
        stroke="#5ba3c9"
        strokeWidth="2"
      />

      {/* Neck */}
      <rect
        x="116"
        y="60"
        width="48"
        height="36"
        rx="3"
        fill="url(#rbGlass)"
        stroke="#5ba3c9"
        strokeWidth="2"
      />
      {/* Neck highlight */}
      <rect
        x="120"
        y="63"
        width="7"
        height="28"
        rx="3"
        fill="#ffffff"
        fillOpacity="0.25"
      />

      {/* Thread rings on neck */}
      {[68, 76, 84].map((y, i) => (
        <line
          key={i}
          x1="116"
          y1={y}
          x2="164"
          y2={y}
          stroke="#5ba3c9"
          strokeWidth="1.2"
          opacity="0.4"
        />
      ))}

      {/* === Stopper/Lid === */}
      {lidOn && (
        <g>
          {/* Stopper body */}
          <rect
            x="112"
            y="40"
            width="56"
            height="24"
            rx="5"
            fill="url(#rbStopper)"
            stroke="#57534e"
            strokeWidth="1.5"
          />
          {/* Stopper top flat */}
          <rect
            x="115"
            y="38"
            width="50"
            height="8"
            rx="4"
            fill="#a8a29e"
            stroke="#78716c"
            strokeWidth="1"
          />
          {/* Stopper highlight */}
          <rect
            x="117"
            y="41"
            width="10"
            height="16"
            rx="3"
            fill="#e7e5e4"
            fillOpacity="0.3"
          />
          {/* Stopper grip ridges */}
          {[46, 52, 58].map((y, i) => (
            <line
              key={i}
              x1="113"
              y1={y}
              x2="167"
              y2={y}
              stroke="#d6d3d1"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
        </g>
      )}

      {/* Label area on bottle */}
      <rect
        x="100"
        y="148"
        width="80"
        height="55"
        rx="4"
        fill="#fef9c3"
        fillOpacity="0.75"
        stroke="#d97706"
        strokeWidth="1.2"
      />
      <text
        x="140"
        y="167"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#92400e"
      >
        REAGENT
      </text>
      <text x="140" y="179" textAnchor="middle" fontSize="7" fill="#78350f">
        NaCl Solution
      </text>
      <text x="140" y="191" textAnchor="middle" fontSize="6.5" fill="#92400e">
        0.9% w/v
      </text>
      <text x="140" y="200" textAnchor="middle" fontSize="6" fill="#b45309">
        ⚠ Irritant
      </text>

      {/* Graduated markings */}
      {[0.2, 0.4, 0.6, 0.8].map((frac, i) => {
        const y = bottleBottom - bottleH * frac;
        const ml = Math.round(frac * 500);
        return (
          <g key={i}>
            <line
              x1="186"
              y1={y}
              x2="192"
              y2={y}
              stroke="#5ba3c9"
              strokeWidth="1.2"
            />
            <text x="196" y={y + 4} fontSize="7" fill="#64748b">
              {ml}
            </text>
          </g>
        );
      })}
      <text x="196" y={bottleTop + 10} fontSize="6" fill="#64748b">
        mL
      </text>

      {/* Label */}
      <text
        x="140"
        y="294"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Reagent Bottle
      </text>
    </svg>
  );
}
