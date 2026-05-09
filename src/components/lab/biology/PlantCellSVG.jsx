import React from "react";
import { motion } from "framer-motion";

export default function PlantCellSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(74,222,128,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="pcBodyGrad" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#86efac" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="pcNucleusGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id="pcVacuoleGrad" cx="40%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="chloroplastGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
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

      {/* ===== CELL WALL (thick rigid rectangle) ===== */}
      <rect
        x="18"
        y="18"
        width="184"
        height="252"
        rx="8"
        fill="none"
        stroke="#166534"
        strokeWidth="7"
      />
      {/* Cell wall texture */}
      <rect
        x="18"
        y="18"
        width="184"
        height="252"
        rx="8"
        fill="none"
        stroke="#bbf7d0"
        strokeWidth="3"
        opacity="0.5"
      />

      {/* ===== CELL MEMBRANE ===== */}
      <rect
        x="22"
        y="22"
        width="176"
        height="244"
        rx="6"
        fill="url(#pcBodyGrad)"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeDasharray="5 3"
      />

      {/* ===== CENTRAL VACUOLE (large) ===== */}
      <ellipse
        cx="110"
        cy="148"
        rx="54"
        ry="62"
        fill="url(#pcVacuoleGrad)"
        stroke="#0ea5e9"
        strokeWidth="1.5"
      />
      <text
        x="110"
        y="145"
        textAnchor="middle"
        fontSize="6.5"
        fill="#0369a1"
        fontWeight="600"
      >
        Central
      </text>
      <text
        x="110"
        y="155"
        textAnchor="middle"
        fontSize="6.5"
        fill="#0369a1"
        fontWeight="600"
      >
        Vacuole
      </text>

      {/* Tonoplast */}
      <ellipse
        cx="110"
        cy="148"
        rx="54"
        ry="62"
        fill="none"
        stroke="#38bdf8"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.4"
      />

      {/* ===== NUCLEUS ===== */}
      <ellipse
        cx="88"
        cy="72"
        rx="28"
        ry="24"
        fill="url(#pcNucleusGrad)"
        stroke="#7c3aed"
        strokeWidth="1.5"
      />
      {/* Nuclear envelope pores */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={88 + Math.cos(rad) * 26}
            cy={72 + Math.sin(rad) * 22}
            r="2"
            fill="#6d28d9"
            opacity="0.7"
          />
        );
      })}
      {/* Nucleolus */}
      <ellipse
        cx="88"
        cy="70"
        rx="10"
        ry="9"
        fill="#ddd6fe"
        stroke="#7c3aed"
        strokeWidth="0.8"
      />
      <text
        x="88"
        y="102"
        textAnchor="middle"
        fontSize="5.5"
        fill="#4c1d95"
        fontWeight="600"
      >
        Nucleus
      </text>

      {/* ===== CHLOROPLASTS ===== */}
      {[
        { cx: 148, cy: 60, rx: 16, ry: 9 },
        { cx: 172, cy: 88, rx: 15, ry: 8 },
        { cx: 155, cy: 110, rx: 16, ry: 8 },
        { cx: 40, cy: 160, rx: 14, ry: 8 },
        { cx: 35, cy: 195, rx: 15, ry: 8 },
        { cx: 42, cy: 228, rx: 14, ry: 8 },
        { cx: 170, cy: 220, rx: 14, ry: 8 },
        { cx: 178, cy: 185, rx: 14, ry: 8 },
      ].map((c, i) => (
        <g key={i}>
          <ellipse
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry}
            fill="url(#chloroplastGrad)"
            stroke="#166534"
            strokeWidth="1"
          />
          {/* Thylakoid stacks (grana) */}
          {[-5, 0, 5].map((dx, j) => (
            <line
              key={j}
              x1={c.cx + dx - 1}
              y1={c.cy - c.ry + 2}
              x2={c.cx + dx - 1}
              y2={c.cy + c.ry - 2}
              stroke="#166534"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
        </g>
      ))}
      <text
        x="155"
        y="132"
        textAnchor="middle"
        fontSize="5.5"
        fill="#166534"
        fontWeight="600"
      >
        Chloroplast
      </text>

      {/* ===== MITOCHONDRIA ===== */}
      {[
        { cx: 40, cy: 125 },
        { cx: 172, cy: 145 },
        { cx: 100, cy: 240 },
      ].map((m, i) => (
        <g key={i}>
          <ellipse
            cx={m.cx}
            cy={m.cy}
            rx="14"
            ry="8"
            fill="#fca5a5"
            stroke="#ef4444"
            strokeWidth="1"
          />
          <path
            d={`M ${m.cx - 10} ${m.cy} Q ${m.cx} ${m.cy - 6} ${m.cx + 10} ${m.cy}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.8"
            opacity="0.7"
          />
        </g>
      ))}

      {/* ===== ENDOPLASMIC RETICULUM ===== */}
      <path
        d="M 62 95 Q 78 88 88 98 Q 98 108 110 100 Q 120 92 128 100"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.8"
        strokeDasharray="4 2"
        opacity="0.7"
      />

      {/* ===== RIBOSOMES ===== */}
      {[
        { cx: 55, cy: 60 },
        { cx: 130, cy: 245 },
        { cx: 175, cy: 255 },
        { cx: 38, cy: 252 },
        { cx: 32, cy: 95 },
        { cx: 175, cy: 58 },
      ].map((r, i) => (
        <circle
          key={i}
          cx={r.cx}
          cy={r.cy}
          r="2.5"
          fill="#4ade80"
          stroke="#16a34a"
          strokeWidth="0.6"
        />
      ))}

      {/* ===== PLASMODESMATA (on cell wall) ===== */}
      {[
        { x: 18, y: 100 },
        { x: 18, y: 160 },
        { x: 18, y: 220 },
        { x: 202, y: 100 },
        { x: 202, y: 160 },
        { x: 202, y: 220 },
        { x: 75, y: 18 },
        { x: 145, y: 18 },
        { x: 75, y: 270 },
        { x: 145, y: 270 },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#166534" opacity="0.5" />
      ))}

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
        Plant Cell Diagram
      </text>
    </svg>
  );
}
