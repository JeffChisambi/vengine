import React from "react";
import { motion } from "framer-motion";

export default function SpringBalanceSVG({
  load = 0.4,
  maxLoad = 10,
  glow = false,
}) {
  const clampedLoad = Math.max(0, Math.min(1, load));
  const springStretch = clampedLoad * 55;
  const readingNewtons = (clampedLoad * maxLoad).toFixed(1);

  const springCoils = 12;
  const springStartY = 100;
  const springEndY = springStartY + 80 + springStretch;

  return (
    <svg
      viewBox="0 0 160 370"
      className="w-full h-full max-h-[370px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(251,146,60,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="sbBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="40%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="sbMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>

      {/* Top hook */}
      <path
        d="M 80 18 Q 80 8 88 8 Q 96 8 96 18 L 96 30"
        fill="none"
        stroke="url(#sbMetal)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="80"
        y1="18"
        x2="80"
        y2="30"
        stroke="url(#sbMetal)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Body cylinder */}
      <rect
        x="60"
        y="30"
        width="40"
        height="180"
        rx="8"
        fill="url(#sbBody)"
        stroke="#b91c1c"
        strokeWidth="2"
      />
      {/* Body highlight */}
      <rect
        x="63"
        y="32"
        width="6"
        height="176"
        rx="3"
        fill="#fca5a5"
        opacity="0.25"
      />

      {/* Scale window */}
      <rect
        x="68"
        y="45"
        width="24"
        height="150"
        rx="3"
        fill="#fef9c3"
        stroke="#fbbf24"
        strokeWidth="1"
      />

      {/* Scale markings */}
      {Array.from({ length: 11 }).map((_, i) => {
        const y = 52 + i * 13;
        const val = maxLoad - i * (maxLoad / 10);
        const isMajor = i % 2 === 0;
        return (
          <g key={i}>
            <line
              x1={isMajor ? "70" : "72"}
              y1={y}
              x2="90"
              y2={y}
              stroke="#92400e"
              strokeWidth={isMajor ? 1 : 0.5}
            />
            {isMajor && (
              <text
                x="71"
                y={y + 3}
                fontSize="6"
                fill="#92400e"
                fontWeight="600"
              >
                {val.toFixed(0)}
              </text>
            )}
          </g>
        );
      })}

      {/* Pointer / indicator */}
      <motion.g
        animate={{ y: springStretch }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      >
        <line
          x1="62"
          y1="52"
          x2="100"
          y2="52"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
        <polygon points="62,49 62,55 56,52" fill="#1e293b" />
      </motion.g>

      {/* N label */}
      <text x="92" y="190" fontSize="7" fill="#7f1d1d" fontWeight="700">
        N
      </text>

      {/* Body bottom cap */}
      <rect
        x="60"
        y="208"
        width="40"
        height="10"
        rx="4"
        fill="#b91c1c"
        stroke="#991b1b"
        strokeWidth="1"
      />

      {/* Spring coils */}
      <motion.g
        animate={{ scaleY: 1 + clampedLoad * 0.5 }}
        style={{ originY: `${springStartY}px` }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      >
        {Array.from({ length: springCoils }).map((_, i) => {
          const y = springStartY + (i / springCoils) * 80;
          const phase = i % 2 === 0;
          return (
            <path
              key={i}
              d={`M 72 ${y} Q ${phase ? 60 : 100} ${y + 3.5} 88 ${y + 7}`}
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })}
      </motion.g>

      {/* Bottom hook */}
      <motion.g
        animate={{ y: springStretch }}
        transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      >
        <line
          x1="80"
          y1={springEndY - 10}
          x2="80"
          y2={springEndY + 15}
          stroke="url(#sbMetal)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M 80 ${springEndY + 15} Q 80 ${springEndY + 28} 70 ${springEndY + 28} Q 60 ${springEndY + 28} 60 ${springEndY + 18}`}
          fill="none"
          stroke="url(#sbMetal)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Newton display tag */}
        <rect
          x="52"
          y={springEndY + 28}
          width="56"
          height="18"
          rx="4"
          fill="#1e293b"
        />
        <text
          x="80"
          y={springEndY + 41}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#22d3ee"
          fontFamily="monospace"
        >
          {readingNewtons} N
        </text>
      </motion.g>

      {/* Label */}
      <text
        x="80"
        y="355"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Spring Balance
      </text>
    </svg>
  );
}
