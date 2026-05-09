import React from "react";
import { motion } from "framer-motion";

export default function DissectionTraySVG({
  specimenVisible = true,
  glow = false,
}) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(148,163,184,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="trayBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="trayWaxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f2744" />
        </linearGradient>
        <linearGradient id="specGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="283"
        rx="75"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ===== TRAY OUTER BODY ===== */}
      <path
        d="M 15 80 L 15 260 Q 15 272 28 272 L 192 272 Q 205 272 205 260 L 205 80 Q 205 68 192 68 L 28 68 Q 15 68 15 80 Z"
        fill="url(#trayBodyGrad)"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Tray rim highlight */}
      <path
        d="M 17 82 Q 17 70 28 70 L 192 70 Q 203 70 203 82 L 203 88 L 17 88 Z"
        fill="#334155"
        opacity="0.5"
      />

      {/* ===== WAX / PARAFFIN INTERIOR ===== */}
      <rect
        x="24"
        y="88"
        width="172"
        height="174"
        rx="3"
        fill="url(#trayWaxGrad)"
      />

      {/* Wax surface sheen */}
      <path
        d="M 26 92 Q 70 88 110 90 Q 150 88 194 92 L 194 96 Q 150 100 110 98 Q 70 100 26 96 Z"
        fill="#93c5fd"
        fillOpacity="0.08"
      />

      {/* Grid pin pattern on wax */}
      {[0, 1, 2, 3, 4, 5, 6].map((col) =>
        [0, 1, 2, 3, 4].map((row) => (
          <circle
            key={`${col}-${row}`}
            cx={42 + col * 24}
            cy={112 + row * 30}
            r="1.5"
            fill="#475569"
            opacity="0.4"
          />
        )),
      )}

      {/* ===== SPECIMEN (frog outline) ===== */}
      {specimenVisible && (
        <g>
          {/* Body */}
          <ellipse
            cx="110"
            cy="185"
            rx="30"
            ry="42"
            fill="url(#specGrad)"
            stroke="#22c55e"
            strokeWidth="1.2"
          />

          {/* Head */}
          <ellipse
            cx="110"
            cy="140"
            rx="20"
            ry="16"
            fill="#86efac"
            stroke="#22c55e"
            strokeWidth="1.2"
          />

          {/* Eyes */}
          <circle
            cx="102"
            cy="134"
            r="4.5"
            fill="#dcfce7"
            stroke="#16a34a"
            strokeWidth="1"
          />
          <circle
            cx="118"
            cy="134"
            r="4.5"
            fill="#dcfce7"
            stroke="#16a34a"
            strokeWidth="1"
          />
          <circle cx="102" cy="134" r="2" fill="#1e293b" />
          <circle cx="118" cy="134" r="2" fill="#1e293b" />

          {/* Front legs */}
          <path
            d="M 82 168 Q 65 162 55 172 Q 50 178 58 182 Q 62 184 68 178 Q 74 173 82 176"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 138 168 Q 155 162 165 172 Q 170 178 162 182 Q 158 184 152 178 Q 146 173 138 176"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Hind legs */}
          <path
            d="M 84 212 Q 68 222 60 238 Q 56 246 65 248 Q 72 248 78 240 Q 84 230 88 218"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 136 212 Q 152 222 160 238 Q 164 246 155 248 Q 148 248 142 240 Q 136 230 132 218"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Incision line */}
          <path
            d="M 110 152 L 110 220"
            stroke="#166534"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            opacity="0.7"
          />

          {/* Dissection pins */}
          {[
            { cx: 88, cy: 150 },
            { cx: 132, cy: 150 },
            { cx: 82, cy: 200 },
            { cx: 138, cy: 200 },
            { cx: 82, cy: 175 },
            { cx: 138, cy: 175 },
          ].map((p, i) => (
            <g key={i}>
              <line
                x1={p.cx}
                y1={p.cy - 12}
                x2={p.cx}
                y2={p.cy}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <circle cx={p.cx} cy={p.cy - 12} r="2.5" fill="#ef4444" />
            </g>
          ))}
        </g>
      )}

      {/* Ruler markings on tray edge */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i}>
          <line
            x1={28 + i * 14}
            y1="88"
            x2={28 + i * 14}
            y2={i % 2 === 0 ? 94 : 91}
            stroke="#334155"
            strokeWidth="1"
          />
        </g>
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
        Dissection Tray
      </text>
    </svg>
  );
}
