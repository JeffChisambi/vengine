import React from "react";
import { motion } from "framer-motion";

export default function WiresSVG({ glow = false }) {
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(59,130,246,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="wireRedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="wireBlackGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="wireGreenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="wireYellowGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="285"
        rx="85"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── CROCODILE CLIP helper function rendered as paths ── */}
      {/* Wire 1 – RED */}
      {/* Clip jaw left */}
      <g>
        <path
          d="M 18 68 Q 14 62 22 58 L 36 62 Q 38 66 36 70 Z"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="1"
        />
        <path
          d="M 18 68 Q 14 74 22 78 L 36 74 Q 38 70 36 70 Z"
          fill="#b91c1c"
          stroke="#dc2626"
          strokeWidth="1"
        />
        <rect x="34" y="62" width="4" height="12" rx="1" fill="#dc2626" />
        {/* Screw pin */}
        <circle
          cx="26"
          cy="68"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        {/* Insulation sleeve */}
        <rect x="38" y="63" width="16" height="10" rx="5" fill="#ef4444" />
      </g>
      {/* Wire body red - curved */}
      <path
        d="M 54 68 Q 90 55 110 72 Q 130 88 166 68"
        fill="none"
        stroke="url(#wireRedGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Clip right */}
      <g>
        <path
          d="M 202 68 Q 206 62 198 58 L 184 62 Q 182 66 184 70 Z"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="1"
        />
        <path
          d="M 202 68 Q 206 74 198 78 L 184 74 Q 182 70 184 70 Z"
          fill="#b91c1c"
          stroke="#dc2626"
          strokeWidth="1"
        />
        <rect x="182" y="62" width="4" height="12" rx="1" fill="#dc2626" />
        <circle
          cx="194"
          cy="68"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="166" y="63" width="16" height="10" rx="5" fill="#ef4444" />
      </g>

      {/* ── Wire 2 – BLACK ── */}
      <g>
        <path
          d="M 18 118 Q 14 112 22 108 L 36 112 Q 38 116 36 120 Z"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="1"
        />
        <path
          d="M 18 118 Q 14 124 22 128 L 36 124 Q 38 120 36 120 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1"
        />
        <rect x="34" y="112" width="4" height="12" rx="1" fill="#1e293b" />
        <circle
          cx="26"
          cy="118"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="38" y="113" width="16" height="10" rx="5" fill="#334155" />
      </g>
      <path
        d="M 54 118 Q 90 132 110 118 Q 130 104 166 118"
        fill="none"
        stroke="url(#wireBlackGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g>
        <path
          d="M 202 118 Q 206 112 198 108 L 184 112 Q 182 116 184 120 Z"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="1"
        />
        <path
          d="M 202 118 Q 206 124 198 128 L 184 124 Q 182 120 184 120 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1"
        />
        <rect x="182" y="112" width="4" height="12" rx="1" fill="#1e293b" />
        <circle
          cx="194"
          cy="118"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="166" y="113" width="16" height="10" rx="5" fill="#334155" />
      </g>

      {/* ── Wire 3 – GREEN ── */}
      <g>
        <path
          d="M 18 168 Q 14 162 22 158 L 36 162 Q 38 166 36 170 Z"
          fill="#16a34a"
          stroke="#15803d"
          strokeWidth="1"
        />
        <path
          d="M 18 168 Q 14 174 22 178 L 36 174 Q 38 170 36 170 Z"
          fill="#15803d"
          stroke="#166534"
          strokeWidth="1"
        />
        <rect x="34" y="162" width="4" height="12" rx="1" fill="#15803d" />
        <circle
          cx="26"
          cy="168"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="38" y="163" width="16" height="10" rx="5" fill="#16a34a" />
      </g>
      <path
        d="M 54 168 Q 90 152 110 168 Q 130 184 166 168"
        fill="none"
        stroke="url(#wireGreenGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g>
        <path
          d="M 202 168 Q 206 162 198 158 L 184 162 Q 182 166 184 170 Z"
          fill="#16a34a"
          stroke="#15803d"
          strokeWidth="1"
        />
        <path
          d="M 202 168 Q 206 174 198 178 L 184 174 Q 182 170 184 170 Z"
          fill="#15803d"
          stroke="#166534"
          strokeWidth="1"
        />
        <rect x="182" y="162" width="4" height="12" rx="1" fill="#15803d" />
        <circle
          cx="194"
          cy="168"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="166" y="163" width="16" height="10" rx="5" fill="#16a34a" />
      </g>

      {/* ── Wire 4 – YELLOW ── */}
      <g>
        <path
          d="M 18 218 Q 14 212 22 208 L 36 212 Q 38 216 36 220 Z"
          fill="#d97706"
          stroke="#b45309"
          strokeWidth="1"
        />
        <path
          d="M 18 218 Q 14 224 22 228 L 36 224 Q 38 220 36 220 Z"
          fill="#b45309"
          stroke="#92400e"
          strokeWidth="1"
        />
        <rect x="34" y="212" width="4" height="12" rx="1" fill="#b45309" />
        <circle
          cx="26"
          cy="218"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="38" y="213" width="16" height="10" rx="5" fill="#d97706" />
      </g>
      <path
        d="M 54 218 Q 90 205 110 218 Q 130 232 166 218"
        fill="none"
        stroke="url(#wireYellowGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g>
        <path
          d="M 202 218 Q 206 212 198 208 L 184 212 Q 182 216 184 220 Z"
          fill="#d97706"
          stroke="#b45309"
          strokeWidth="1"
        />
        <path
          d="M 202 218 Q 206 224 198 228 L 184 224 Q 182 220 184 220 Z"
          fill="#b45309"
          stroke="#92400e"
          strokeWidth="1"
        />
        <rect x="182" y="212" width="4" height="12" rx="1" fill="#b45309" />
        <circle
          cx="194"
          cy="218"
          r="3"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="0.8"
        />
        <rect x="166" y="213" width="16" height="10" rx="5" fill="#d97706" />
      </g>

      <text
        x="110"
        y="256"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Connecting Wires
      </text>
    </svg>
  );
}
