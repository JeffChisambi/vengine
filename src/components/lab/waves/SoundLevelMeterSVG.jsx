import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SoundLevelMeterSVG({
  measuring = true,
  dB = 72,
  glow = false,
}) {
  const [currentDB, setCurrentDB] = useState(dB);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!measuring) return;
    const tick = () => {
      setCurrentDB(dB + (Math.random() - 0.5) * 8);
      rafRef.current = setTimeout(tick, 400);
    };
    rafRef.current = setTimeout(tick, 400);
    return () => clearTimeout(rafRef.current);
  }, [measuring, dB]);

  const barH = Math.min(1, Math.max(0, (currentDB - 30) / 80));
  const barColor =
    currentDB > 85 ? "#ef4444" : currentDB > 65 ? "#f59e0b" : "#22c55e";

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(99,102,241,0.35))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="slmBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
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

      {/* ── DEVICE BODY ── */}
      <rect
        x="62"
        y="18"
        width="96"
        height="240"
        rx="12"
        fill="url(#slmBodyGrad)"
        stroke="#334155"
        strokeWidth="2"
      />
      {/* Outer shell highlight */}
      <rect
        x="64"
        y="20"
        width="92"
        height="236"
        rx="10"
        fill="none"
        stroke="#475569"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* ── MICROPHONE (top) ── */}
      <ellipse
        cx="110"
        cy="28"
        rx="14"
        ry="12"
        fill="#1e293b"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Mic grille dots */}
      {[-5, 0, 5].map((dx) =>
        [-4, 0, 4].map((dy) => (
          <circle
            key={`${dx}${dy}`}
            cx={110 + dx}
            cy={28 + dy}
            r="1.2"
            fill="#475569"
            opacity="0.7"
          />
        )),
      )}

      {/* ── LCD DISPLAY ── */}
      <rect
        x="72"
        y="48"
        width="76"
        height="36"
        rx="4"
        fill="#0f2744"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* dB reading */}
      <motion.text
        x="110"
        y="74"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill={barColor}
        fontFamily="monospace"
        animate={{ opacity: measuring ? [1, 0.9, 1] : 1 }}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        {currentDB.toFixed(1)}
      </motion.text>
      <text x="148" y="72" fontSize="8" fill="#94a3b8">
        dB
      </text>

      {/* ── BAR GRAPH ── */}
      <rect
        x="75"
        y="92"
        width="70"
        height="120"
        rx="3"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Scale lines */}
      {[0.25, 0.5, 0.75].map((m, i) => (
        <g key={i}>
          <line
            x1="75"
            y1={92 + (1 - m) * 120}
            x2="145"
            y2={92 + (1 - m) * 120}
            stroke="#1e3a5f"
            strokeWidth="0.8"
          />
          <text
            x="72"
            y={92 + (1 - m) * 120 + 3}
            fontSize="6"
            fill="#475569"
            textAnchor="end"
          >
            {(30 + m * 80).toFixed(0)}
          </text>
        </g>
      ))}
      {/* Bar fill */}
      <motion.rect
        x="90"
        width="30"
        rx="2"
        fill={barColor}
        animate={{ y: 92 + (1 - barH) * 120, height: barH * 120 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* ── CONTROL BUTTONS ── */}
      <rect
        x="75"
        y="224"
        width="30"
        height="14"
        rx="4"
        fill="#1e3a5f"
        stroke="#334155"
        strokeWidth="1"
      />
      <text x="90" y="234" textAnchor="middle" fontSize="7" fill="#60a5fa">
        RANGE
      </text>
      <rect
        x="115"
        y="224"
        width="30"
        height="14"
        rx="4"
        fill="#1e3a5f"
        stroke="#334155"
        strokeWidth="1"
      />
      <text x="130" y="234" textAnchor="middle" fontSize="7" fill="#60a5fa">
        HOLD
      </text>

      {/* A/C weighting switch */}
      <rect
        x="85"
        y="244"
        width="50"
        height="10"
        rx="3"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1"
      />
      <rect x="85" y="244" width="25" height="10" rx="3" fill="#1e3a5f" />
      <text x="97" y="252" textAnchor="middle" fontSize="6" fill="#93c5fd">
        A-WT
      </text>
      <text x="122" y="252" textAnchor="middle" fontSize="6" fill="#475569">
        C-WT
      </text>

      {/* ── WRIST STRAP HOLE ── */}
      <ellipse
        cx="110"
        cy="258"
        rx="6"
        ry="3"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1"
      />

      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Sound Level Meter
      </text>
    </svg>
  );
}
