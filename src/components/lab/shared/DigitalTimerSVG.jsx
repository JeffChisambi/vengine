import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DigitalTimerSVG({
  initialSeconds = 300,
  running = false,
  glow = false,
}) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(
        () => setRemaining((r) => Math.max(0, r - 1)),
        1000,
      );
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isAlarm = remaining === 0;
  const displayColor = isAlarm ? "#ef4444" : "#22d3ee";

  return (
    <svg
      viewBox="0 0 220 280"
      className="w-full h-full max-h-[280px]"
      style={{
        filter: glow
          ? `drop-shadow(0 0 14px ${displayColor}55)`
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="timerBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse
        cx="110"
        cy="252"
        rx="65"
        ry="8"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Body */}
      <rect
        x="25"
        y="40"
        width="170"
        height="200"
        rx="12"
        fill="url(#timerBody)"
        stroke="#0f172a"
        strokeWidth="2"
      />
      {/* Front panel bevel */}
      <rect
        x="27"
        y="42"
        width="166"
        height="196"
        rx="11"
        fill="none"
        stroke="#475569"
        strokeWidth="0.8"
      />

      {/* Display window */}
      <rect
        x="35"
        y="55"
        width="150"
        height="80"
        rx="6"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* LCD green tint */}
      <rect
        x="36"
        y="56"
        width="148"
        height="78"
        rx="5"
        fill={displayColor}
        fillOpacity="0.05"
      />

      {/* Time display — seven-segment style */}
      <motion.text
        x="110"
        y="110"
        textAnchor="middle"
        fontSize="42"
        fontWeight="900"
        fill={displayColor}
        fontFamily="monospace"
        letterSpacing="3"
        animate={isAlarm ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
        transition={isAlarm ? { duration: 0.5, repeat: Infinity } : {}}
      >
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </motion.text>

      {/* Countdown label */}
      <text
        x="110"
        y="125"
        textAnchor="middle"
        fontSize="7"
        fill={displayColor}
        fontFamily="monospace"
        opacity="0.5"
      >
        {isAlarm ? "TIME'S UP" : "COUNTDOWN"}
      </text>

      {/* Button row */}
      {/* Start/Stop */}
      <rect
        x="38"
        y="152"
        width="38"
        height="20"
        rx="5"
        fill="#16a34a"
        stroke="#15803d"
        strokeWidth="1"
      />
      <text
        x="57"
        y="166"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        fill="#ffffff"
      >
        START
      </text>

      {/* Pause */}
      <rect
        x="83"
        y="152"
        width="38"
        height="20"
        rx="5"
        fill="#d97706"
        stroke="#b45309"
        strokeWidth="1"
      />
      <text
        x="102"
        y="166"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        fill="#ffffff"
      >
        PAUSE
      </text>

      {/* Reset */}
      <rect
        x="128"
        y="152"
        width="38"
        height="20"
        rx="5"
        fill="#dc2626"
        stroke="#b91c1c"
        strokeWidth="1"
      />
      <text
        x="147"
        y="166"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="600"
        fill="#ffffff"
      >
        RESET
      </text>

      {/* +/- buttons */}
      <rect
        x="38"
        y="182"
        width="28"
        height="20"
        rx="5"
        fill="#334155"
        stroke="#475569"
        strokeWidth="1"
      />
      <text
        x="52"
        y="196"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#94a3b8"
      >
        +
      </text>

      <rect
        x="73"
        y="182"
        width="28"
        height="20"
        rx="5"
        fill="#334155"
        stroke="#475569"
        strokeWidth="1"
      />
      <text
        x="87"
        y="197"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#94a3b8"
      >
        −
      </text>

      {/* Set/Mode */}
      <rect
        x="110"
        y="182"
        width="56"
        height="20"
        rx="5"
        fill="#334155"
        stroke="#475569"
        strokeWidth="1"
      />
      <text x="138" y="196" textAnchor="middle" fontSize="7.5" fill="#94a3b8">
        SET / MODE
      </text>

      {/* Speaker grill */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={40 + i * 7}
          y="212"
          width="3"
          height="12"
          rx="1"
          fill="#475569"
        />
      ))}
      <text x="100" y="221" fontSize="7" fill="#64748b" fontFamily="monospace">
        ◉ ALARM
      </text>

      {/* Label */}
      <text
        x="110"
        y="268"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Digital Timer
      </text>
    </svg>
  );
}
