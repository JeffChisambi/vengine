import React from "react";
import { motion } from "framer-motion";

export default function IceBathContainerSVG({
  liquidColor = "#bfdbfe",
  iceAmount = 0.6,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 240 360"
      className="w-full h-full max-h-[360px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(147,197,253,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="iceBathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="iceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.85" />
        </linearGradient>
        <clipPath id="iceBathClip">
          <path d="M 38 110 L 50 280 L 190 280 L 202 110 Z" />
        </clipPath>
      </defs>

      {/* ===== CONTAINER (wide crystallization dish / trough) ===== */}
      {/* Container body - trapezoidal trough */}
      <path
        d="M 35 105 L 48 285 Q 50 295 120 295 Q 190 295 192 285 L 205 105 Z"
        fill="#f1f5f9"
        stroke="#94a3b8"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fillOpacity="0.5"
      />

      {/* Container rim */}
      <ellipse
        cx="120"
        cy="105"
        rx="85"
        ry="14"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* Water + ice inside */}
      <g clipPath="url(#iceBathClip)">
        {/* Water */}
        <motion.rect
          x="35"
          width="172"
          fill="url(#iceBathGrad)"
          initial={{ y: 280, height: 0 }}
          animate={{ y: 140, height: 140 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Water surface */}
        <motion.ellipse
          cx="120"
          rx="78"
          ry="10"
          fill="#dbeafe"
          fillOpacity="0.35"
          initial={{ cy: 280 }}
          animate={{ cy: 142 }}
          transition={{ duration: 0.8 }}
        />

        {/* Ice cubes */}
        {[
          { x: 65, y: 155, w: 22, h: 18, rot: 5 },
          { x: 95, y: 148, w: 20, h: 16, rot: -8 },
          { x: 130, y: 152, w: 24, h: 18, rot: 12 },
          { x: 160, y: 156, w: 18, h: 15, rot: -3 },
          { x: 78, y: 175, w: 20, h: 16, rot: 15 },
          { x: 115, y: 170, w: 22, h: 17, rot: -10 },
          { x: 148, y: 172, w: 19, h: 15, rot: 7 },
          { x: 90, y: 195, w: 18, h: 14, rot: -5 },
          { x: 125, y: 192, w: 21, h: 16, rot: 20 },
          { x: 155, y: 198, w: 17, h: 13, rot: -12 },
          { x: 70, y: 210, w: 20, h: 15, rot: 8 },
          { x: 105, y: 215, w: 22, h: 16, rot: -6 },
          { x: 140, y: 218, w: 19, h: 14, rot: 10 },
        ]
          .slice(0, Math.ceil(13 * iceAmount))
          .map((cube, i) => (
            <motion.rect
              key={i}
              x={cube.x}
              y={cube.y}
              width={cube.w}
              height={cube.h}
              rx="3"
              fill="url(#iceGrad)"
              stroke="#93c5fd"
              strokeWidth="1"
              transform={`rotate(${cube.rot}, ${cube.x + cube.w / 2}, ${cube.y + cube.h / 2})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}

        {/* Ice highlights / reflections */}
        {[
          { x: 70, y: 158 },
          { x: 135, y: 155 },
          { x: 100, y: 178 },
          { x: 152, y: 175 },
          { x: 120, y: 195 },
        ]
          .slice(0, Math.ceil(5 * iceAmount))
          .map((h, i) => (
            <rect
              key={`h-${i}`}
              x={h.x}
              y={h.y}
              width="6"
              height="2"
              rx="1"
              fill="#ffffff"
              opacity="0.6"
            />
          ))}

        {/* Cold mist / condensation */}
        {[0, 1, 2].map((i) => (
          <motion.ellipse
            key={i}
            cx={80 + i * 35}
            cy="138"
            rx="18"
            ry="4"
            fill="#ffffff"
            fillOpacity="0.15"
            animate={{
              cy: [138, 128, 138],
              fillOpacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
          />
        ))}
      </g>

      {/* Handle - left */}
      <path
        d="M 38 120 Q 25 120 22 130 Q 20 140 30 140"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Handle - right */}
      <path
        d="M 202 120 Q 215 120 218 130 Q 220 140 210 140"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Glass highlight */}
      <path
        d="M 52 120 Q 48 160 52 220"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Thermometer sticking out */}
      <rect
        x="168"
        y="80"
        width="4"
        height="85"
        rx="1"
        fill="#fef2f2"
        stroke="#94a3b8"
        strokeWidth="0.8"
      />
      <circle cx="170" cy="155" r="4" fill="#3b82f6" />
      <rect x="169" y="100" width="2" height="52" fill="#3b82f6" />
      <text x="178" y="102" fontSize="8" fill="#64748b">
        0°C
      </text>

      {/* Shadow */}
      <ellipse
        cx="120"
        cy="308"
        rx="80"
        ry="9"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Label */}
      <text
        x="120"
        y="340"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Ice Bath Container
      </text>
    </svg>
  );
}
