import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AmmeterSVG({
  current = 0.65,
  measuring = true,
  glow = false,
}) {
  const [val, setVal] = useState(current);
  const t = useRef(null);
  useEffect(() => {
    if (!measuring) return;
    const tick = () => {
      setVal(current + (Math.random() - 0.5) * 0.08);
      t.current = setTimeout(tick, 500);
    };
    t.current = setTimeout(tick, 500);
    return () => clearTimeout(t.current);
  }, [measuring, current]);

  const needleAngle = (val / 2) * 130 - 65; // -65° to +65° for 0-2A

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(239,68,68,0.4))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="amFace" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
        <linearGradient id="amCase" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      <ellipse
        cx="110"
        cy="278"
        rx="58"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* ── CASE ── */}
      <rect
        x="28"
        y="38"
        width="164"
        height="150"
        rx="14"
        fill="url(#amCase)"
        stroke="#94a3b8"
        strokeWidth="2.5"
      />

      {/* ── FACE ── */}
      <rect
        x="36"
        y="46"
        width="148"
        height="134"
        rx="10"
        fill="url(#amFace)"
      />

      {/* A label (Ammeter) */}
      <text
        x="110"
        y="72"
        textAnchor="middle"
        fontSize="28"
        fontWeight="800"
        fill="#ef4444"
      >
        A
      </text>

      {/* Scale arc */}
      {Array.from({ length: 21 }, (_, i) => {
        const angle = (i / 20) * 130 - 65;
        const rad = ((angle - 90) * Math.PI) / 180;
        const isMajor = i % 4 === 0;
        const r1 = isMajor ? 54 : 58;
        return (
          <line
            key={i}
            x1={110 + r1 * Math.cos(rad)}
            y1={148 + r1 * Math.sin(rad)}
            x2={110 + 62 * Math.cos(rad)}
            y2={148 + 62 * Math.sin(rad)}
            stroke="#64748b"
            strokeWidth={isMajor ? 1.5 : 0.7}
          />
        );
      })}

      {/* Scale numbers */}
      {[0, 0.5, 1.0, 1.5, 2.0].map((n, i) => {
        const angle = (i / 4) * 130 - 65;
        const rad = ((angle - 90) * Math.PI) / 180;
        return (
          <text
            key={n}
            x={110 + 44 * Math.cos(rad)}
            y={148 + 44 * Math.sin(rad) + 3}
            textAnchor="middle"
            fontSize="8"
            fill="#475569"
            fontWeight="600"
          >
            {n}
          </text>
        );
      })}
      <text x="110" y="122" textAnchor="middle" fontSize="8" fill="#64748b">
        Amperes (A)
      </text>

      {/* Needle */}
      <motion.line
        x1="110"
        y1="148"
        animate={{
          x2: 110 + 52 * Math.sin((needleAngle * Math.PI) / 180),
          y2: 148 - 52 * Math.cos((needleAngle * Math.PI) / 180),
        }}
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <circle cx="110" cy="148" r="4" fill="#1e293b" />
      <circle cx="110" cy="148" r="2" fill="#ef4444" />

      {/* ── TERMINALS ── */}
      {/* Red (+) */}
      <rect
        x="58"
        y="188"
        width="20"
        height="22"
        rx="4"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1.5"
      />
      <rect x="65" y="185" width="6" height="8" rx="2" fill="#dc2626" />
      <text
        x="68"
        y="204"
        textAnchor="middle"
        fontSize="9"
        fill="#fff"
        fontWeight="700"
      >
        +
      </text>

      {/* Black (−) */}
      <rect
        x="142"
        y="188"
        width="20"
        height="22"
        rx="4"
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="1.5"
      />
      <rect x="149" y="185" width="6" height="8" rx="2" fill="#0f172a" />
      <text
        x="152"
        y="204"
        textAnchor="middle"
        fontSize="9"
        fill="#fff"
        fontWeight="700"
      >
        −
      </text>

      {/* Zero adjust screw */}
      <circle
        cx="110"
        cy="195"
        r="5"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />
      <line
        x1="107"
        y1="195"
        x2="113"
        y2="195"
        stroke="#475569"
        strokeWidth="1.5"
      />

      {/* Connecting wires/leads */}
      <line
        x1="68"
        y1="210"
        x2="68"
        y2="240"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="152"
        y1="210"
        x2="152"
        y2="240"
        stroke="#1e293b"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <text
        x="110"
        y="270"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        Ammeter
      </text>
    </svg>
  );
}
