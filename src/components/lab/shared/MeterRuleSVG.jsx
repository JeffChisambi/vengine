import React from "react";

export default function MeterRuleSVG({ glow = false }) {
  const ruleX = 18;
  const ruleY = 80;
  const ruleW = 244;
  const ruleH = 52;

  const cmCount = 30; // show 30 cm for readability
  const cmWidth = ruleW / cmCount;

  return (
    <svg
      viewBox="0 0 280 220"
      className="w-full h-full max-h-[220px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 14px rgba(251,191,36,0.3))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <linearGradient id="ruleWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="40%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="ruleEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <rect
        x={ruleX + 4}
        y={ruleY + ruleH + 4}
        width={ruleW}
        height={6}
        rx="2"
        fill="#cbd5e1"
        fillOpacity="0.35"
      />

      {/* Rule body */}
      <rect
        x={ruleX}
        y={ruleY}
        width={ruleW}
        height={ruleH}
        rx="3"
        fill="url(#ruleWood)"
        stroke="#d97706"
        strokeWidth="2"
      />

      {/* Top & bottom edge strips */}
      <rect
        x={ruleX}
        y={ruleY}
        width={ruleW}
        height="6"
        rx="3"
        fill="url(#ruleEdge)"
      />
      <rect
        x={ruleX}
        y={ruleY + ruleH - 6}
        width={ruleW}
        height="6"
        rx="3"
        fill="url(#ruleEdge)"
      />

      {/* Wood grain lines */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={ruleX + 6}
          y1={ruleY + 16 + i * 8}
          x2={ruleX + ruleW - 6}
          y2={ruleY + 18 + i * 8}
          stroke="#fde68a"
          strokeWidth="0.5"
          opacity="0.5"
        />
      ))}

      {/* cm markings */}
      {Array.from({ length: cmCount + 1 }).map((_, cm) => {
        const x = ruleX + cm * cmWidth;
        const isMajor = cm % 5 === 0;
        const tickH = isMajor ? 18 : cm % 1 === 0 ? 12 : 6;

        return (
          <g key={cm}>
            {/* Top ticks */}
            <line
              x1={x}
              y1={ruleY + 6}
              x2={x}
              y2={ruleY + 6 + tickH}
              stroke="#92400e"
              strokeWidth={isMajor ? 1.2 : 0.6}
            />
            {/* Bottom ticks */}
            <line
              x1={x}
              y1={ruleY + ruleH - 6}
              x2={x}
              y2={ruleY + ruleH - 6 - tickH}
              stroke="#92400e"
              strokeWidth={isMajor ? 1.2 : 0.6}
            />

            {/* cm numbers (top) */}
            {isMajor && cm > 0 && (
              <text
                x={x}
                y={ruleY + 34}
                textAnchor="middle"
                fontSize="8.5"
                fill="#92400e"
                fontWeight="700"
              >
                {cm}
              </text>
            )}

            {/* mm sub-marks */}
            {cm < cmCount &&
              Array.from({ length: 9 }).map((_, mm) => {
                const mx = x + (mm + 1) * (cmWidth / 10);
                const mh = mm === 4 ? 9 : 5;
                return (
                  <g key={mm}>
                    <line
                      x1={mx}
                      y1={ruleY + 6}
                      x2={mx}
                      y2={ruleY + 6 + mh}
                      stroke="#b45309"
                      strokeWidth="0.4"
                    />
                    <line
                      x1={mx}
                      y1={ruleY + ruleH - 6}
                      x2={mx}
                      y2={ruleY + ruleH - 6 - mh}
                      stroke="#b45309"
                      strokeWidth="0.4"
                    />
                  </g>
                );
              })}
          </g>
        );
      })}

      {/* "cm" label */}
      <text
        x={ruleX + ruleW - 8}
        y={ruleY + ruleH / 2 + 3}
        textAnchor="end"
        fontSize="7"
        fill="#92400e"
        fontWeight="600"
      >
        cm
      </text>

      {/* "1 METRE RULE" stamp */}
      <text
        x={ruleX + 20}
        y={ruleY + ruleH / 2 + 4}
        fontSize="9"
        fontWeight="700"
        fill="#b45309"
        opacity="0.5"
      >
        1 METRE RULE
      </text>

      {/* 0 label */}
      <text
        x={ruleX + 2}
        y={ruleY + 34}
        fontSize="8"
        fill="#92400e"
        fontWeight="700"
      >
        0
      </text>

      {/* Label */}
      <text
        x="140"
        y="200"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
      >
        Metre Rule
      </text>
    </svg>
  );
}
