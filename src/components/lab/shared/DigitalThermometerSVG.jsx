import React from "react";
import { motion } from "framer-motion";

export default function DigitalThermometerSVG({
  temperature = 36.6,
  unit = "C",
  glow = false,
}) {
  const color =
    temperature > 38 ? "#ef4444" : temperature < 20 ? "#3b82f6" : "#22c55e";

  return (
    <svg
      viewBox="0 0 200 340"
      className="w-full h-full max-h-[340px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 14px ${color}55)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="dtBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="40%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="dtProbe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="100"
        cy="315"
        rx="38"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Body - rectangular handheld device */}
      <rect
        x="55"
        y="60"
        width="90"
        height="185"
        rx="14"
        fill="url(#dtBody)"
        stroke="#1f2937"
        strokeWidth="2"
      />
      {/* Body side highlight */}
      <rect
        x="57"
        y="62"
        width="10"
        height="181"
        rx="5"
        fill="#9ca3af"
        opacity="0.15"
      />

      {/* Display bezel */}
      <rect
        x="65"
        y="72"
        width="70"
        height="90"
        rx="6"
        fill="#111827"
        stroke="#374151"
        strokeWidth="1"
      />
      {/* LCD screen */}
      <rect x="68" y="75" width="64" height="84" rx="4" fill="#0f172a" />
      {/* Screen green tint */}
      <rect
        x="68"
        y="75"
        width="64"
        height="84"
        rx="4"
        fill={color}
        fillOpacity="0.06"
      />

      {/* Temperature reading */}
      <text
        x="100"
        y="123"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill={color}
        fontFamily="monospace"
        letterSpacing="-1"
      >
        {temperature.toFixed(1)}
      </text>
      <text
        x="125"
        y="148"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill={color}
        fontFamily="monospace"
      >
        °{unit}
      </text>

      {/* Small blinking cursor */}
      <motion.rect
        x="115"
        y="110"
        width="2"
        height="18"
        fill={color}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Readout label */}
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontSize="7"
        fill="#4b5563"
        fontFamily="monospace"
      >
        BODY TEMP
      </text>

      {/* Buttons */}
      <rect
        x="68"
        y="176"
        width="28"
        height="12"
        rx="5"
        fill="#374151"
        stroke="#4b5563"
        strokeWidth="1"
      />
      <text x="82" y="185" textAnchor="middle" fontSize="6" fill="#9ca3af">
        MODE
      </text>

      <rect
        x="104"
        y="176"
        width="28"
        height="12"
        rx="5"
        fill="#374151"
        stroke="#4b5563"
        strokeWidth="1"
      />
      <text x="118" y="185" textAnchor="middle" fontSize="6" fill="#9ca3af">
        HOLD
      </text>

      {/* Power button */}
      <rect
        x="79"
        y="200"
        width="42"
        height="14"
        rx="6"
        fill="#1f2937"
        stroke="#374151"
        strokeWidth="1"
      />
      <text x="100" y="210" textAnchor="middle" fontSize="7" fill="#6b7280">
        POWER
      </text>

      {/* Cable to probe */}
      <path
        d="M 100 245 Q 100 255 100 260"
        stroke="#4b5563"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Probe connector */}
      <rect
        x="88"
        y="258"
        width="24"
        height="8"
        rx="3"
        fill="#4b5563"
        stroke="#374151"
        strokeWidth="1"
      />

      {/* Probe wire */}
      <path
        d="M 100 266 Q 100 270 100 272"
        stroke="#374151"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Probe tip — long thin metal probe */}
      <rect
        x="97"
        y="270"
        width="6"
        height="28"
        rx="3"
        fill="url(#dtProbe)"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      {/* Probe tip point */}
      <path
        d="M 97 298 Q 100 308 103 298"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="0.8"
      />

      {/* Label */}
      <text
        x="100"
        y="332"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Digital Thermometer
      </text>
    </svg>
  );
}
