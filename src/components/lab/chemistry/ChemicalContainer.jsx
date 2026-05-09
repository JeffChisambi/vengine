import React from "react";
import { motion } from "framer-motion";

export default function ChemicalContainerSVG({
  liquidLevel = 0.55,
  liquidColor = "#4ade80",
  lidOn = true,
  glow = false,
}) {
  const bodyLeft = 70;
  const bodyRight = 210;
  const bodyTop = 110;
  const bodyBottom = 255;
  const bodyH = bodyBottom - bodyTop;
  const liquidY = bodyBottom - bodyH * liquidLevel;

  return (
    <svg
      viewBox="0 0 280 310"
      className="w-full h-full max-h-[310px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 18px ${liquidColor}66)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="ccBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.9" />
          <stop offset="18%" stopColor="#dcfce7" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="82%" stopColor="#dcfce7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="ccLid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="45%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="ccLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={liquidColor} stopOpacity="0.82" />
        </linearGradient>
        <clipPath id="ccClip">
          <rect
            x={bodyLeft}
            y={bodyTop}
            width={bodyRight - bodyLeft}
            height={bodyH + 20}
            rx="4"
          />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="140"
        cy="270"
        rx="75"
        ry="10"
        fill="#94a3b8"
        fillOpacity="0.22"
      />

      {/* === Body — wide-mouth HDPE/glass chemical container === */}
      <rect
        x={bodyLeft}
        y={bodyTop}
        width={bodyRight - bodyLeft}
        height={bodyH}
        rx="6"
        ry="6"
        fill="url(#ccBody)"
        stroke="#86efac"
        strokeWidth="2"
      />

      {/* Liquid */}
      {liquidLevel > 0 && (
        <g clipPath="url(#ccClip)">
          <rect
            x={bodyLeft}
            y={liquidY}
            width={bodyRight - bodyLeft}
            height={bodyBottom - liquidY + 10}
            fill="url(#ccLiquid)"
          />
          <motion.ellipse
            cx="140"
            cy={liquidY}
            rx="67"
            ry="4"
            fill={liquidColor}
            fillOpacity="0.35"
            animate={{ ry: [3.5, 5, 3.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      )}

      {/* Body highlight left */}
      <rect
        x={bodyLeft + 6}
        y={bodyTop + 8}
        width="10"
        height={bodyH - 20}
        rx="4"
        fill="#ffffff"
        fillOpacity="0.3"
      />
      {/* Body highlight right */}
      <rect
        x={bodyRight - 18}
        y={bodyTop + 12}
        width="5"
        height={bodyH - 30}
        rx="2"
        fill="#ffffff"
        fillOpacity="0.14"
      />

      {/* Ribbed grip bands (HDPE container characteristic) */}
      {[0.18, 0.32, 0.46, 0.6, 0.74, 0.88].map((f, i) => (
        <rect
          key={i}
          x={bodyLeft}
          y={bodyTop + bodyH * f}
          width={bodyRight - bodyLeft}
          height="4"
          rx="1"
          fill="none"
          stroke="#86efac"
          strokeWidth="1.2"
          opacity="0.45"
        />
      ))}

      {/* === Hazard / label area === */}
      <rect
        x="88"
        y="148"
        width="104"
        height="72"
        rx="4"
        fill="#fefce8"
        fillOpacity="0.88"
        stroke="#ca8a04"
        strokeWidth="1.5"
      />
      {/* Hazard diamond */}
      <polygon
        points="140,155 154,166 140,177 126,166"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="1.2"
      />
      <text
        x="140"
        y="170"
        textAnchor="middle"
        fontSize="9"
        fontWeight="900"
        fill="#92400e"
      >
        !
      </text>
      <text
        x="140"
        y="186"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill="#92400e"
      >
        CHEMICAL
      </text>
      <text x="140" y="196" textAnchor="middle" fontSize="7" fill="#78350f">
        NaOH Solution
      </text>
      <text x="140" y="208" textAnchor="middle" fontSize="6.5" fill="#b45309">
        1 mol/L ⚠ Corrosive
      </text>

      {/* Volume markings */}
      {[0.25, 0.5, 0.75].map((f, i) => {
        const y = bodyBottom - bodyH * f;
        const vol = Math.round(f * 1000);
        return (
          <g key={i}>
            <line
              x1={bodyRight}
              y1={y}
              x2={bodyRight + 8}
              y2={y}
              stroke="#86efac"
              strokeWidth="1.5"
            />
            <text x={bodyRight + 11} y={y + 4} fontSize="8" fill="#64748b">
              {vol}
            </text>
          </g>
        );
      })}
      <text x={bodyRight + 11} y={bodyTop + 8} fontSize="7" fill="#64748b">
        mL
      </text>

      {/* Handle on right side */}
      <path
        d={`M ${bodyRight - 2} 130 Q 230 130 232 160 Q 232 195 ${bodyRight - 2} 195`}
        fill="none"
        stroke="#64748b"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d={`M ${bodyRight - 2} 130 Q 228 130 230 160 Q 230 193 ${bodyRight - 2} 195`}
        fill="none"
        stroke="#94a3b8"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* === Lid (screw cap) === */}
      {lidOn && (
        <g>
          {/* Lid body */}
          <rect
            x="100"
            y="88"
            width="80"
            height="26"
            rx="5"
            fill="url(#ccLid)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Lid top */}
          <rect
            x="104"
            y="84"
            width="72"
            height="10"
            rx="4"
            fill="#64748b"
            stroke="#475569"
            strokeWidth="1"
          />
          {/* Lid grip ridges */}
          {[94, 100, 106].map((y, i) => (
            <line
              key={i}
              x1="101"
              y1={y}
              x2="179"
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
          {/* Lid highlight */}
          <rect
            x="106"
            y="89"
            width="12"
            height="20"
            rx="3"
            fill="#ffffff"
            fillOpacity="0.15"
          />
          {/* UN number / safety ring */}
          <circle
            cx="140"
            cy="86"
            r="4"
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="1"
          />
        </g>
      )}

      <text
        x="140"
        y="294"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Chemical Container
      </text>
    </svg>
  );
}
