import React from "react";
import { motion } from "framer-motion";

export default function CellModelSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(251,146,60,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="cellBodyGrad" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.38" />
        </radialGradient>
        <radialGradient id="nucleusGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.65" />
        </radialGradient>
        <radialGradient id="nucleolusGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="283"
        rx="78"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ===== ANIMAL CELL ===== */}
      {/* Cell membrane (irregular blob) */}
      <motion.path
        d="M 110 22 Q 168 18 192 55 Q 212 90 208 138 Q 210 185 188 218 Q 168 250 130 258 Q 96 265 68 248 Q 38 228 30 192 Q 18 155 28 115 Q 38 75 62 50 Q 82 28 110 22 Z"
        fill="url(#cellBodyGrad)"
        stroke="#f59e0b"
        strokeWidth="2.5"
        animate={{
          d: [
            "M 110 22 Q 168 18 192 55 Q 212 90 208 138 Q 210 185 188 218 Q 168 250 130 258 Q 96 265 68 248 Q 38 228 30 192 Q 18 155 28 115 Q 38 75 62 50 Q 82 28 110 22 Z",
            "M 110 20 Q 170 22 195 60 Q 215 96 206 145 Q 208 190 185 222 Q 164 252 128 260 Q 92 268 65 250 Q 35 230 27 194 Q 15 158 26 118 Q 36 78 60 52 Q 80 26 110 20 Z",
            "M 110 22 Q 168 18 192 55 Q 212 90 208 138 Q 210 185 188 218 Q 168 250 130 258 Q 96 265 68 248 Q 38 228 30 192 Q 18 155 28 115 Q 38 75 62 50 Q 82 28 110 22 Z",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ===== NUCLEUS ===== */}
      <ellipse
        cx="108"
        cy="128"
        rx="40"
        ry="34"
        fill="url(#nucleusGrad)"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      {/* Nuclear pores */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={108 + Math.cos(rad) * 38}
            cy={128 + Math.sin(rad) * 32}
            r="2.5"
            fill="#7c3aed"
            opacity="0.6"
          />
        );
      })}
      {/* Nucleolus */}
      <ellipse
        cx="108"
        cy="126"
        rx="14"
        ry="12"
        fill="url(#nucleolusGrad)"
        stroke="#6d28d9"
        strokeWidth="1"
      />

      {/* ===== ORGANELLES ===== */}
      {/* Mitochondria (x2) */}
      <g>
        <ellipse
          cx="68"
          cy="185"
          rx="18"
          ry="10"
          fill="#fca5a5"
          stroke="#ef4444"
          strokeWidth="1.2"
        />
        <path
          d="M 53 185 Q 58 179 63 185 Q 68 191 73 185 Q 78 179 83 185"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          opacity="0.7"
        />
      </g>
      <g>
        <ellipse
          cx="162"
          cy="168"
          rx="16"
          ry="9"
          fill="#fca5a5"
          stroke="#ef4444"
          strokeWidth="1.2"
        />
        <path
          d="M 148 168 Q 153 162 158 168 Q 163 174 168 168 Q 173 162 178 168"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          opacity="0.7"
        />
      </g>

      {/* Golgi apparatus */}
      <g opacity="0.85">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${82} ${210 + i * 6} Q ${108} ${206 + i * 6} ${138} ${210 + i * 6}`}
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Ribosomes (tiny dots) */}
      {[
        { cx: 55, cy: 140 },
        { cx: 60, cy: 155 },
        { cx: 145, cy: 125 },
        { cx: 155, cy: 140 },
        { cx: 90, cy: 225 },
        { cx: 135, cy: 220 },
        { cx: 80, cy: 95 },
        { cx: 140, cy: 95 },
      ].map((r, i) => (
        <circle
          key={i}
          cx={r.cx}
          cy={r.cy}
          r="3"
          fill="#4ade80"
          stroke="#16a34a"
          strokeWidth="0.6"
        />
      ))}

      {/* Endoplasmic reticulum */}
      <path
        d="M 140 150 Q 165 145 168 160 Q 172 175 155 178 Q 145 180 142 168"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeDasharray="4 2"
        opacity="0.7"
      />
      <path
        d="M 143 155 Q 166 150 169 166 Q 173 181 156 184"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        opacity="0.5"
      />

      {/* Vacuoles */}
      <circle
        cx="72"
        cy="82"
        r="12"
        fill="#a5f3fc"
        fillOpacity="0.4"
        stroke="#0891b2"
        strokeWidth="1"
      />
      <circle
        cx="148"
        cy="228"
        r="10"
        fill="#a5f3fc"
        fillOpacity="0.4"
        stroke="#0891b2"
        strokeWidth="1"
      />

      {/* Lysosomes */}
      <circle
        cx="158"
        cy="100"
        r="6"
        fill="#fde68a"
        stroke="#d97706"
        strokeWidth="1"
      />
      <circle
        cx="70"
        cy="228"
        r="5"
        fill="#fde68a"
        stroke="#d97706"
        strokeWidth="1"
      />

      {/* Centriole */}
      <g opacity="0.6">
        <rect x="105" y="170" width="10" height="4" rx="1" fill="#64748b" />
        <rect x="107" y="174" width="4" height="10" rx="1" fill="#64748b" />
      </g>

      {/* Labels */}
      <text
        x="108"
        y="120"
        textAnchor="middle"
        fontSize="6"
        fill="#4c1d95"
        fontWeight="700"
      >
        Nucleus
      </text>
      <text x="68" y="200" textAnchor="middle" fontSize="5.5" fill="#991b1b">
        Mitochon.
      </text>
      <text x="110" y="240" textAnchor="middle" fontSize="5.5" fill="#c2410c">
        Golgi
      </text>

      {/* Label */}
      <text
        x="110"
        y="292"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Cell Model (Animal)
      </text>
    </svg>
  );
}
