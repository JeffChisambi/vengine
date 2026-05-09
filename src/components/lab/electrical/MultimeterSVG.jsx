import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MultimeterSVG({
  mode = "V",
  reading = 12.4,
  glow = false,
}) {
  const [val, setVal] = useState(reading);
  const t = useRef(null);
  useEffect(() => {
    const tick = () => {
      setVal(reading + (Math.random() - 0.5) * 0.5);
      t.current = setTimeout(tick, 600);
    };
    t.current = setTimeout(tick, 600);
    return () => clearTimeout(t.current);
  }, [reading]);

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
        <linearGradient id="mmBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="286"
        rx="55"
        ry="7"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── BODY ── */}
      <rect
        x="38"
        y="14"
        width="144"
        height="240"
        rx="14"
        fill="url(#mmBody)"
        stroke="#0f172a"
        strokeWidth="2"
      />
      <rect
        x="42"
        y="18"
        width="136"
        height="236"
        rx="12"
        fill="none"
        stroke="#475569"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Rubber grip sides */}
      <rect
        x="38"
        y="80"
        width="12"
        height="80"
        rx="6"
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="1"
      />
      <rect
        x="170"
        y="80"
        width="12"
        height="80"
        rx="6"
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="1"
      />

      {/* ── LCD DISPLAY ── */}
      <rect
        x="48"
        y="22"
        width="124"
        height="52"
        rx="6"
        fill="#d1fae5"
        stroke="#064e3b"
        strokeWidth="1.5"
      />
      {/* Segment display background */}
      <rect x="52" y="26" width="116" height="44" rx="4" fill="#a7f3d0" />
      {/* Main reading */}
      <motion.text
        x="158"
        y="60"
        textAnchor="end"
        fontSize="24"
        fontWeight="700"
        fill="#064e3b"
        fontFamily="monospace"
      >
        {val.toFixed(1)}
      </motion.text>
      {/* Mode unit */}
      <text x="162" y="44" fontSize="11" fill="#065f46" fontWeight="600">
        {mode}
      </text>
      {/* DC symbol */}
      <text x="54" y="44" fontSize="9" fill="#065f46">
        DC
      </text>
      <line x1="54" y1="46" x2="70" y2="46" stroke="#065f46" strokeWidth="1" />
      <line
        x1="54"
        y1="49"
        x2="70"
        y2="49"
        stroke="#065f46"
        strokeWidth="0.5"
        strokeDasharray="2 1"
      />

      {/* ── ROTARY SELECTOR ── */}
      <circle
        cx="110"
        cy="142"
        r="42"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="2"
      />
      <circle cx="110" cy="142" r="38" fill="#0f172a" />
      {/* Range labels around dial */}
      {[
        { label: "200V", angle: -90 },
        { label: "20V", angle: -45 },
        { label: "2V", angle: 0 },
        { label: "200mA", angle: 45 },
        { label: "20mA", angle: 90 },
        { label: "200Ω", angle: 135 },
        { label: "20kΩ", angle: 180 },
        { label: "AC~", angle: -135 },
      ].map(({ label, angle }, i) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return (
          <text
            key={i}
            x={110 + 30 * Math.cos(rad)}
            y={142 + 30 * Math.sin(rad) + 3}
            textAnchor="middle"
            fontSize="5.5"
            fill="#94a3b8"
            fontWeight="600"
          >
            {label}
          </text>
        );
      })}
      {/* Knob */}
      <circle
        cx="110"
        cy="142"
        r="12"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <line
        x1="110"
        y1="132"
        x2="110"
        y2="138"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* ── INPUT JACKS ── */}
      {/* COM (black) */}
      <circle
        cx="78"
        cy="208"
        r="9"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      <circle cx="78" cy="208" r="5" fill="#0f172a" />
      <text
        x="78"
        y="224"
        textAnchor="middle"
        fontSize="7"
        fill="#94a3b8"
        fontWeight="600"
      >
        COM
      </text>

      {/* V/Ω (red) */}
      <circle
        cx="110"
        cy="208"
        r="9"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <circle cx="110" cy="208" r="5" fill="#dc2626" />
      <text
        x="110"
        y="224"
        textAnchor="middle"
        fontSize="7"
        fill="#fca5a5"
        fontWeight="600"
      >
        V·Ω
      </text>

      {/* 10A (red) */}
      <circle
        cx="142"
        cy="208"
        r="9"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <circle cx="142" cy="208" r="5" fill="#dc2626" />
      <text
        x="142"
        y="224"
        textAnchor="middle"
        fontSize="7"
        fill="#fca5a5"
        fontWeight="600"
      >
        10A
      </text>

      {/* Probe leads */}
      <path
        d="M 78 217 Q 72 235 68 255 L 68 262"
        stroke="#1e293b"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="68"
        cy="264"
        r="4"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="1"
      />
      <path
        d="M 110 217 Q 116 235 120 255 L 120 262"
        stroke="#ef4444"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="120"
        cy="264"
        r="4"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1"
      />

      <text
        x="110"
        y="280"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Multimeter
      </text>
    </svg>
  );
}
