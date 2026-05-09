import React from "react";
import { motion } from "framer-motion";

export default function MagnifyingGlassSVG({
  magnifying = false,
  glow = false,
}) {
  // Lens center
  const cx = 105;
  const cy = 100;
  const r = 68;

  // Handle attaches at bottom-right of lens at ~315° (bottom-right)
  const handleAngle = 45; // degrees below horizontal to the right
  const rad = (handleAngle * Math.PI) / 180;
  const frameR = r + 10; // outer frame radius

  // Attachment point on frame
  const ax = cx + frameR * Math.cos(rad);
  const ay = cy + frameR * Math.sin(rad);

  // Handle direction vector (normalized)
  const hLen = 95;
  const hx2 = ax + hLen * Math.cos(rad);
  const hy2 = ay + hLen * Math.sin(rad);

  // Ferrule (metal collar) at attachment
  const fx1 = ax - 9 * Math.sin(rad);
  const fy1 = ay + 9 * Math.cos(rad);
  const fx2 = ax + 9 * Math.sin(rad);
  const fy2 = ay - 9 * Math.cos(rad);

  // Perpendicular offset for handle width
  const pw = 7;
  const px = pw * Math.sin(rad);
  const py = pw * Math.cos(rad);

  return (
    <svg
      viewBox="0 0 280 290"
      className="w-full h-full max-h-[290px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(251,191,36,0.4))"
          : "drop-shadow(0 4px 14px rgba(0,0,0,0.10))",
      }}
    >
      <defs>
        <radialGradient id="mgLens" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="35%" stopColor="#bfdbfe" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.38" />
        </radialGradient>
        <linearGradient id="mgFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="40%" stopColor="#e7e5e4" />
          <stop offset="100%" stopColor="#78716c" />
        </linearGradient>
        <linearGradient id="mgHandle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="30%" stopColor="#d97706" />
          <stop offset="65%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="mgFerule" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d6d3d1" />
          <stop offset="50%" stopColor="#f5f5f4" />
          <stop offset="100%" stopColor="#a8a29e" />
        </linearGradient>
        <clipPath id="mgLensClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* ── Handle (wood) — drawn first so frame overlaps it cleanly ── */}
      {/* Handle body as a parallelogram-ish tapered shape */}
      <path
        d={`
          M ${ax + px * 1.1} ${ay - py * 1.1}
          L ${hx2 + px * 0.7} ${hy2 - py * 0.7}
          Q ${hx2 + px * 0.2} ${hy2 - py * 0.2 + 4} ${hx2} ${hy2 + 2}
          Q ${hx2 - px * 0.2} ${hy2 + py * 0.2 + 4} ${hx2 - px * 0.7} ${hy2 + py * 0.7}
          L ${ax - px * 1.1} ${ay + py * 1.1}
          Z
        `}
        fill="url(#mgHandle)"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Handle highlight stripe */}
      <line
        x1={ax + px * 0.4}
        y1={ay - py * 0.4}
        x2={hx2 + px * 0.2}
        y2={hy2 - py * 0.2}
        stroke="#fde68a"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.28"
      />
      {/* Handle grain lines */}
      {[0.25, 0.45, 0.65, 0.82].map((t, i) => {
        const gx = ax + (hx2 - ax) * t;
        const gy = ay + (hy2 - ay) * t;
        return (
          <line
            key={i}
            x1={gx + px * 0.9}
            y1={gy - py * 0.9}
            x2={gx - px * 0.9}
            y2={gy + py * 0.9}
            stroke="#78350f"
            strokeWidth="0.7"
            opacity="0.35"
          />
        );
      })}
      {/* End cap */}
      <ellipse
        cx={hx2}
        cy={hy2}
        rx="6"
        ry="6"
        fill="#57534e"
        stroke="#44403c"
        strokeWidth="1"
        transform={`rotate(${handleAngle}, ${hx2}, ${hy2})`}
      />

      {/* ── Ferrule (metal collar at joint) ── */}
      <path
        d={`
          M ${ax + px * 1.3} ${ay - py * 1.3}
          L ${ax + 14 * Math.cos(rad) + px * 1.1} ${ay + 14 * Math.sin(rad) - py * 1.1}
          L ${ax + 14 * Math.cos(rad) - px * 1.1} ${ay + 14 * Math.sin(rad) + py * 1.1}
          L ${ax - px * 1.3} ${ay + py * 1.3}
          Z
        `}
        fill="url(#mgFerule)"
        stroke="#a8a29e"
        strokeWidth="1"
      />
      {/* Ferrule knurl lines */}
      {[0.2, 0.5, 0.8].map((t, i) => {
        const gx = ax + 14 * Math.cos(rad) * t;
        const gy = ay + 14 * Math.sin(rad) * t;
        return (
          <line
            key={i}
            x1={gx + px * 1.1}
            y1={gy - py * 1.1}
            x2={gx - px * 1.1}
            y2={gy + py * 1.1}
            stroke="#d6d3d1"
            strokeWidth="0.8"
            opacity="0.5"
          />
        );
      })}

      {/* ── Outer frame ring ── */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 11}
        fill="none"
        stroke="url(#mgFrame)"
        strokeWidth="14"
      />
      {/* Frame outer edge highlight */}
      <path
        d={`M ${cx - r - 18} ${cy} A ${r + 18} ${r + 18} 0 0 1 ${cx} ${cy - r - 18}`}
        fill="none"
        stroke="#f5f5f4"
        strokeWidth="3"
        opacity="0.25"
      />
      {/* Frame inner shadow */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill="none"
        stroke="#57534e"
        strokeWidth="1.5"
        opacity="0.15"
      />
      {/* Frame inner bright ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 3}
        fill="none"
        stroke="#e7e5e4"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* ── Lens glass ── */}
      <circle cx={cx} cy={cy} r={r} fill="url(#mgLens)" />

      {/* Magnified content */}
      {magnifying && (
        <g clipPath="url(#mgLensClip)">
          <text
            x={cx}
            y={cy + 18}
            textAnchor="middle"
            fontSize="62"
            fontWeight="900"
            fill="#1e293b"
            fontFamily="serif"
            opacity="0.12"
          >
            A
          </text>
          <circle
            cx={cx}
            cy={cy}
            r="22"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="0.8"
            opacity="0.45"
          />
          <circle
            cx={cx}
            cy={cy}
            r="44"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </g>
      )}

      {/* Lens primary reflection (large soft ellipse, top-left) */}
      <ellipse
        cx={cx - 22}
        cy={cy - 22}
        rx="24"
        ry="14"
        fill="#ffffff"
        fillOpacity="0.32"
        transform={`rotate(-35, ${cx - 22}, ${cy - 22})`}
      />
      {/* Secondary small glint */}
      <ellipse
        cx={cx - 32}
        cy={cy - 34}
        rx="9"
        ry="5"
        fill="#ffffff"
        fillOpacity="0.22"
        transform={`rotate(-35, ${cx - 32}, ${cy - 34})`}
      />

      {/* Label */}
      <text
        x="140"
        y="278"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#475569"
      >
        Magnifying Glass
      </text>
    </svg>
  );
}
