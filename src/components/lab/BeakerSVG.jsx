import React from "react";
import { motion } from "framer-motion";

export default function BeakerSVG({
  waterLevel = 0.4,
  showObject = false,
  objectColor = "#8B5CF6",
  displaced = false,
}) {
  const beakerHeight = 260;
  const beakerWidth = 160;
  const waterBaseY = 300;
  const waterHeight = beakerHeight * waterLevel;
  const waterY = waterBaseY - waterHeight;
  const markings = [0.2, 0.4, 0.6, 0.8];

  return (
    <svg
      viewBox="0 0 220 360"
      className="w-full h-full max-h-[360px]"
      style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))" }}
    >
      {/* Beaker body */}
      <defs>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
        </linearGradient>
        <clipPath id="beakerClip">
          <rect
            x="30"
            y="40"
            width={beakerWidth}
            height={beakerHeight + 2}
            rx="4"
          />
        </clipPath>
      </defs>

      {/* Beaker outline */}
      <rect
        x="30"
        y="40"
        width={beakerWidth}
        height={beakerHeight}
        rx="4"
        ry="4"
        fill="url(#glassGrad)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Spout */}
      <path
        d="M 30 40 L 20 30 L 30 35"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 190 40 L 200 30 L 190 35"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Water */}
      <g clipPath="url(#beakerClip)">
        <motion.rect
          x="31"
          width={beakerWidth - 2}
          rx="2"
          fill="url(#waterGrad)"
          initial={{ y: waterBaseY, height: 0 }}
          animate={{ y: waterY, height: waterHeight }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        {/* Water surface highlight */}
        <motion.ellipse
          cx={30 + beakerWidth / 2}
          rx={beakerWidth / 2 - 4}
          ry="4"
          fill="#7dd3fc"
          fillOpacity="0.5"
          initial={{ cy: waterBaseY }}
          animate={{ cy: waterY + 2 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Bubbles when object is dropped */}
        {showObject && displaced && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.circle
                key={i}
                cx={80 + i * 15}
                r={2 + Math.random() * 3}
                fill="#bae6fd"
                fillOpacity="0.6"
                initial={{ cy: waterBaseY - 20, opacity: 0 }}
                animate={{ cy: waterY + 10, opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 1.2,
                  delay: 0.2 + i * 0.15,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}

        {/* Object inside beaker */}
        {showObject && (
          <motion.g
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeIn", delay: 0.1 }}
          >
            <ellipse
              cx={30 + beakerWidth / 2}
              cy={waterBaseY - 30}
              rx="28"
              ry="22"
              fill={objectColor}
              fillOpacity="0.9"
            />
            <ellipse
              cx={30 + beakerWidth / 2 - 6}
              cy={waterBaseY - 35}
              rx="8"
              ry="5"
              fill="#ffffff"
              fillOpacity="0.3"
            />
          </motion.g>
        )}
      </g>

      {/* Measurement markings */}
      {markings.map((m, i) => {
        const y = waterBaseY - beakerHeight * m;
        return (
          <g key={i}>
            <line
              x1="32"
              y1={y}
              x2="52"
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />
            <text
              x="56"
              y={y + 4}
              fontSize="10"
              fill="#64748b"
              fontFamily="var(--font-body)"
            >
              {(m * 500).toFixed(0)} mL
            </text>
          </g>
        );
      })}

      {/* Base */}
      <rect
        x="20"
        y={waterBaseY}
        width={beakerWidth + 20}
        height="8"
        rx="4"
        fill="#cbd5e1"
      />

      {/* Label */}
      <text
        x={30 + beakerWidth / 2}
        y={waterBaseY + 30}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Graduated Beaker
      </text>
    </svg>
  );
}
