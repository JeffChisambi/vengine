import React from "react";
import { motion } from "framer-motion";

export default function RubberTubingSVG({
  flowing = false,
  fluidColor = "#38bdf8",
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 300 220"
      className="w-full h-full max-h-[220px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(0,0,0,0.2))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.09))",
      }}
    >
      <defs>
        <linearGradient id="rtOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="35%" stopColor="#57534e" />
          <stop offset="100%" stopColor="#292524" />
        </linearGradient>
        <linearGradient id="rtInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#0c0a09" />
        </linearGradient>
      </defs>

      {/* ══ Tube path — S-curve coil for realism ══ */}

      {/* Segment 1: horizontal left */}
      {/* Shadow/dark outer */}
      <path
        d="M 22 80 L 100 80"
        fill="none"
        stroke="#1c1917"
        strokeWidth="20"
        strokeLinecap="round"
      />
      {/* Rubber surface */}
      <path
        d="M 22 80 L 100 80"
        fill="none"
        stroke="url(#rtOuter)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Inner bore */}
      <path
        d="M 22 80 L 100 80"
        fill="none"
        stroke="url(#rtInner)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Highlight */}
      <path
        d="M 24 76 L 100 76"
        fill="none"
        stroke="#78716c"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Segment 2: curve down-right */}
      <path
        d="M 100 80 Q 148 80 148 128"
        fill="none"
        stroke="#1c1917"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M 100 80 Q 148 80 148 128"
        fill="none"
        stroke="url(#rtOuter)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M 100 80 Q 148 80 148 128"
        fill="none"
        stroke="url(#rtInner)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 100 76 Q 144 76 144 128"
        fill="none"
        stroke="#78716c"
        strokeWidth="2.5"
        opacity="0.35"
      />

      {/* Segment 3: horizontal right */}
      <path
        d="M 148 128 L 278 128"
        fill="none"
        stroke="#1c1917"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M 148 128 L 278 128"
        fill="none"
        stroke="url(#rtOuter)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M 148 128 L 278 128"
        fill="none"
        stroke="url(#rtInner)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M 150 124 L 276 124"
        fill="none"
        stroke="#78716c"
        strokeWidth="2.5"
        opacity="0.35"
      />

      {/* ══ Connectors / clamps at each end ══ */}
      {/* Left clamp ring */}
      <rect
        x="16"
        y="72"
        width="14"
        height="16"
        rx="3"
        fill="#78716c"
        stroke="#57534e"
        strokeWidth="1.2"
      />
      <line
        x1="16"
        y1="77"
        x2="30"
        y2="77"
        stroke="#a8a29e"
        strokeWidth="0.8"
      />
      <line
        x1="16"
        y1="81"
        x2="30"
        y2="81"
        stroke="#a8a29e"
        strokeWidth="0.8"
      />
      <line
        x1="16"
        y1="85"
        x2="30"
        y2="85"
        stroke="#a8a29e"
        strokeWidth="0.8"
      />
      {/* Left open end */}
      <ellipse
        cx="16"
        cy="80"
        rx="5"
        ry="8"
        fill="#1c1917"
        stroke="#57534e"
        strokeWidth="1.2"
      />
      <ellipse cx="16" cy="80" rx="2.5" ry="4" fill="#0c0a09" />

      {/* Right clamp ring */}
      <rect
        x="270"
        y="120"
        width="14"
        height="16"
        rx="3"
        fill="#78716c"
        stroke="#57534e"
        strokeWidth="1.2"
      />
      <line
        x1="270"
        y1="125"
        x2="284"
        y2="125"
        stroke="#a8a29e"
        strokeWidth="0.8"
      />
      <line
        x1="270"
        y1="129"
        x2="284"
        y2="129"
        stroke="#a8a29e"
        strokeWidth="0.8"
      />
      <line
        x1="270"
        y1="133"
        x2="284"
        y2="133"
        stroke="#a8a29e"
        strokeWidth="0.8"
      />
      <ellipse
        cx="284"
        cy="128"
        rx="5"
        ry="8"
        fill="#1c1917"
        stroke="#57534e"
        strokeWidth="1.2"
      />
      <ellipse cx="284" cy="128" rx="2.5" ry="4" fill="#0c0a09" />

      {/* ══ Flowing fluid inside bore ══ */}
      {flowing && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              r="3"
              fill={fluidColor}
              fillOpacity="0.75"
              initial={{ cx: 30, cy: 80 }}
              animate={{ cx: [30, 100, 148, 260], cy: [80, 80, 128, 128] }}
              transition={{
                duration: 2.5,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}

      {/* Texture lines on rubber */}
      {[40, 55, 70, 85].map((x) => (
        <line
          key={x}
          x1={x}
          y1="73"
          x2={x}
          y2="87"
          stroke="#1c1917"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {[170, 190, 210, 230, 250].map((x) => (
        <line
          key={x}
          x1={x}
          y1="121"
          x2={x}
          y2="135"
          stroke="#1c1917"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}

      {/* Label */}
      <text
        x="150"
        y="210"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Rubber Tubing
      </text>
    </svg>
  );
}
