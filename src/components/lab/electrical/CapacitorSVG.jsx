import React from "react";
import { motion } from "framer-motion";

export default function CapacitorSVG({
  type = "electrolytic",
  charged = false,
  glow = false,
}) {
  const isElec = type === "electrolytic";
  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(99,102,241,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="capBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="25%" stopColor="#1d4ed8" />
          <stop offset="75%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id="capTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="capLead" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="38"
        ry="6"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── CYLINDRICAL BODY ── */}
      {/* Main cylinder */}
      <rect
        x="74"
        y="82"
        width="72"
        height="140"
        rx="8"
        fill="url(#capBody)"
        stroke="#1e3a5f"
        strokeWidth="2"
      />

      {/* Safety vent (cross score on top) — electrolytic only */}
      {isElec && (
        <>
          <ellipse
            cx="110"
            cy="82"
            rx="36"
            ry="10"
            fill="url(#capTop)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1="110"
            y1="74"
            x2="110"
            y2="90"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <line
            x1="102"
            y1="82"
            x2="118"
            y2="82"
            stroke="#64748b"
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Polarity stripe (white stripe on negative side) */}
      {isElec && (
        <rect
          x="74"
          y="82"
          width="16"
          height="140"
          rx="8"
          fill="#f1f5f9"
          opacity="0.18"
        />
      )}

      {/* Capacitance label on body */}
      <text
        x="110"
        y="150"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#bfdbfe"
        transform="rotate(-90, 110, 150)"
      >
        100µF 25V
      </text>

      {/* Polarity markings */}
      {isElec && (
        <>
          <text
            x="83"
            y="128"
            textAnchor="middle"
            fontSize="14"
            fill="#e2e8f0"
            fontWeight="700"
          >
            −
          </text>
          <text
            x="138"
            y="128"
            textAnchor="middle"
            fontSize="14"
            fill="#fbbf24"
            fontWeight="700"
          >
            +
          </text>
        </>
      )}

      {/* Charge glow */}
      {charged && (
        <motion.rect
          x="75"
          y="83"
          width="70"
          height="138"
          rx="7"
          fill="#6366f1"
          fillOpacity="0.12"
          animate={{ fillOpacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Body highlight */}
      <line
        x1="78"
        y1="90"
        x2="78"
        y2="216"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.15"
        strokeLinecap="round"
      />

      {/* Bottom of cylinder */}
      <ellipse
        cx="110"
        cy="222"
        rx="36"
        ry="8"
        fill="#1e3a5f"
        stroke="#1e3a5f"
        strokeWidth="1"
      />

      {/* ── LEADS ── */}
      {/* Positive lead (+, longer) */}
      <rect x="122" y="222" width="5" height="52" rx="2" fill="url(#capLead)" />
      <text x="132" y="252" fontSize="10" fill="#fbbf24" fontWeight="700">
        +
      </text>

      {/* Negative lead (−, shorter) */}
      <rect x="93" y="222" width="5" height="44" rx="2" fill="url(#capLead)" />
      <text x="78" y="252" fontSize="10" fill="#e2e8f0" fontWeight="700">
        −
      </text>

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Capacitor
      </text>
    </svg>
  );
}
