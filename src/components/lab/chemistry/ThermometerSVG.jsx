import React from "react";
import { motion } from "framer-motion";

export default function ThermometerSVG({
  temperature = 37,
  minTemp = -10,
  maxTemp = 110,
  mercuryColor = "#ef4444",
  glow = false,
}) {
  const bulbCY = 290;
  const bulbR = 14;
  const tubeTop = 48;
  const tubeBottom = bulbCY - bulbR;
  const tubeHeight = tubeBottom - tubeTop;
  const tempFraction = Math.max(
    0,
    Math.min(1, (temperature - minTemp) / (maxTemp - minTemp)),
  );
  const mercuryHeight = tubeHeight * tempFraction;
  const mercuryY = tubeBottom - mercuryHeight;

  const markings = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];

  return (
    <svg
      viewBox="0 0 140 380"
      className="w-full h-full max-h-[380px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 16px ${mercuryColor}44)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
      }}
    >
      <defs>
        <linearGradient id="thermoGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="mercuryGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mercuryColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={mercuryColor} stopOpacity="1" />
        </linearGradient>
        <clipPath id="thermoClip">
          <rect x="60" y={tubeTop} width="20" height={tubeHeight} rx="5" />
          <circle cx="70" cy={bulbCY} r={bulbR} />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="70"
        cy="330"
        rx="18"
        ry="5"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Outer glass tube */}
      <rect
        x="56"
        y="40"
        width="28"
        height={tubeHeight + 16}
        rx="14"
        fill="url(#thermoGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Bulb */}
      <circle
        cx="70"
        cy={bulbCY}
        r={bulbR + 4}
        fill="url(#thermoGlass)"
        stroke="#94a3b8"
        strokeWidth="2"
      />

      {/* Mercury */}
      <g clipPath="url(#thermoClip)">
        {/* Bulb fill */}
        <circle cx="70" cy={bulbCY} r={bulbR} fill={mercuryColor} />

        {/* Mercury column */}
        <motion.rect
          x="62"
          width="16"
          fill="url(#mercuryGrad)"
          rx="4"
          initial={{ y: tubeBottom, height: 0 }}
          animate={{ y: mercuryY, height: mercuryHeight + bulbR }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </g>

      {/* Inner tube outline */}
      <rect
        x="63"
        y={tubeTop + 4}
        width="14"
        height={tubeHeight - 8}
        rx="5"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Scale markings */}
      {markings.map((temp) => {
        const frac = (temp - minTemp) / (maxTemp - minTemp);
        const y = tubeBottom - tubeHeight * frac;
        const isMajor = temp % 20 === 0;
        return (
          <g key={temp}>
            <line
              x1={isMajor ? "86" : "88"}
              y1={y}
              x2="96"
              y2={y}
              stroke="#64748b"
              strokeWidth={isMajor ? "1.2" : "0.6"}
            />
            {isMajor && (
              <text x="100" y={y + 3.5} fontSize="8" fill="#64748b">
                {temp}°
              </text>
            )}
          </g>
        );
      })}

      {/* Temperature label on left */}
      <text
        x="50"
        y={tubeTop - 8}
        textAnchor="middle"
        fontSize="8"
        fill="#94a3b8"
      >
        °C
      </text>

      {/* Glass highlight */}
      <line
        x1="61"
        y1="55"
        x2="61"
        y2={tubeBottom - 10}
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Current temperature display */}
      <motion.text
        x="70"
        y="28"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={mercuryColor}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {temperature}°C
      </motion.text>

      {/* Label */}
      <text
        x="70"
        y="360"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Thermometer
      </text>
    </svg>
  );
}
