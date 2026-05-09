import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function StopwatchSVG({ running = false, glow = false }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 0.1), 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = Math.floor(elapsed % 60);
  const tenths = Math.floor((elapsed * 10) % 10);
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;

  const secondAngle = (elapsed % 60) * 6;
  const minuteAngle = (elapsed / 60) * 6;

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
        <radialGradient id="swFace" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
        <linearGradient id="swCase" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="278"
        rx="55"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Crown / winding knob top */}
      <rect
        x="104"
        y="35"
        width="12"
        height="20"
        rx="5"
        fill="url(#swCase)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <rect x="102" y="42" width="16" height="8" rx="2" fill="#94a3b8" />

      {/* Side button (start/stop) */}
      <rect
        x="158"
        y="75"
        width="14"
        height="22"
        rx="5"
        fill="url(#swCase)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <rect x="160" y="80" width="10" height="12" rx="3" fill="#6366f1" />

      {/* Side button 2 (reset) */}
      <rect
        x="48"
        y="75"
        width="14"
        height="22"
        rx="5"
        fill="url(#swCase)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />

      {/* Outer case */}
      <circle
        cx="110"
        cy="168"
        r="88"
        fill="url(#swCase)"
        stroke="#94a3b8"
        strokeWidth="3"
      />
      {/* Bezel ring */}
      <circle
        cx="110"
        cy="168"
        r="84"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      {/* Inner bezel */}
      <circle
        cx="110"
        cy="168"
        r="78"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1"
      />

      {/* Face */}
      <circle cx="110" cy="168" r="74" fill="url(#swFace)" />

      {/* Minute markers */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i * 6 - 90) * (Math.PI / 180);
        const isMajor = i % 5 === 0;
        const r1 = isMajor ? 60 : 64;
        const r2 = 68;
        return (
          <line
            key={i}
            x1={110 + r1 * Math.cos(a)}
            y1={168 + r1 * Math.sin(a)}
            x2={110 + r2 * Math.cos(a)}
            y2={168 + r2 * Math.sin(a)}
            stroke="#64748b"
            strokeWidth={isMajor ? 1.5 : 0.6}
          />
        );
      })}

      {/* Hour numbers */}
      {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((n, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        return (
          <text
            key={n}
            x={110 + 50 * Math.cos(a)}
            y={168 + 50 * Math.sin(a) + 3.5}
            textAnchor="middle"
            fontSize="8.5"
            fill="#475569"
            fontWeight="600"
          >
            {n}
          </text>
        );
      })}

      {/* Minute hand */}
      <motion.line
        x1="110"
        y1="168"
        animate={{
          x2: 110 + 44 * Math.sin((minuteAngle * Math.PI) / 180),
          y2: 168 - 44 * Math.cos((minuteAngle * Math.PI) / 180),
        }}
        stroke="#1e293b"
        strokeWidth="2"
        strokeLinecap="round"
        transition={{ duration: 0.1, ease: "linear" }}
      />

      {/* Second hand (red) */}
      <motion.line
        x1="110"
        y1="168"
        animate={{
          x2: 110 + 58 * Math.sin((secondAngle * Math.PI) / 180),
          y2: 168 - 58 * Math.cos((secondAngle * Math.PI) / 180),
        }}
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeLinecap="round"
        transition={{ duration: 0.1, ease: "linear" }}
      />
      {/* Counter-weight */}
      <motion.line
        x1="110"
        y1="168"
        animate={{
          x2: 110 - 14 * Math.sin((secondAngle * Math.PI) / 180),
          y2: 168 + 14 * Math.cos((secondAngle * Math.PI) / 180),
        }}
        stroke="#ef4444"
        strokeWidth="2.5"
        strokeLinecap="round"
        transition={{ duration: 0.1, ease: "linear" }}
      />

      {/* Center cap */}
      <circle cx="110" cy="168" r="4" fill="#1e293b" />
      <circle cx="110" cy="168" r="2" fill="#ef4444" />

      {/* Digital display at 6 o'clock */}
      <rect x="82" y="196" width="56" height="20" rx="4" fill="#0f172a" />
      <text
        x="110"
        y="210"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#6ee7b7"
        fontFamily="monospace"
      >
        {timeStr}
      </text>

      {/* Label */}
      <text
        x="110"
        y="292"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Stopwatch
      </text>
    </svg>
  );
}
