import React from "react";
import { motion } from "framer-motion";

// Base pair colors matching the diagram:
// Adenine (A) = yellow-green  ↔  Thymine (T) = green
// Guanine (G) = red/pink      ↔  Cytosine (C) = orange
const BASE_PAIRS = [
  { left: "#e2c84b", right: "#3a9e5f" }, // A-T
  { left: "#d94f5c", right: "#e07b2a" }, // G-C
  { left: "#e2c84b", right: "#3a9e5f" }, // A-T
  { left: "#d94f5c", right: "#e07b2a" }, // G-C
  { left: "#3a9e5f", right: "#e2c84b" }, // T-A
  { left: "#e07b2a", right: "#d94f5c" }, // C-G
  { left: "#e2c84b", right: "#3a9e5f" }, // A-T
  { left: "#d94f5c", right: "#e07b2a" }, // G-C
  { left: "#e07b2a", right: "#d94f5c" }, // C-G
  { left: "#3a9e5f", right: "#e2c84b" }, // T-A
  { left: "#e2c84b", right: "#3a9e5f" }, // A-T
  { left: "#d94f5c", right: "#e07b2a" }, // G-C
  { left: "#3a9e5f", right: "#e2c84b" }, // T-A
  { left: "#e07b2a", right: "#d94f5c" }, // C-G
];

const N = BASE_PAIRS.length;
const CX = 110;
const TOP = 18;
const BOTTOM = 268;
const TOTAL_H = BOTTOM - TOP;
const AMPLITUDE = 38; // how wide the backbone ribbons swing

function getBackbonePoint(index, side, total) {
  const t = index / (total - 1);
  const y = TOP + t * TOTAL_H;
  // Full period = every 7 rungs (one complete helix turn)
  const phase = t * Math.PI * 4 + (side === "right" ? Math.PI : 0);
  const x = CX + Math.sin(phase) * AMPLITUDE;
  return { x, y, phase };
}

export default function DNAHelixSVG({ glow = false }) {
  // Precompute backbone points for both strands
  const SPINE_PTS = 60; // smooth ribbon
  const leftPts = Array.from({ length: SPINE_PTS }, (_, i) =>
    getBackbonePoint(i, "left", SPINE_PTS),
  );
  const rightPts = Array.from({ length: SPINE_PTS }, (_, i) =>
    getBackbonePoint(i, "right", SPINE_PTS),
  );

  // Build SVG path string for a ribbon edge (offset by ±ribbonHalf perpendicular)
  function ribbonEdgePath(pts, offset) {
    return pts
      .map(({ x, y }, i) => {
        // Perpendicular offset (approximate: horizontal since helix is mostly vertical)
        const px = x + offset;
        return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }

  // Ribbon polygon: left edge forward + right edge backward
  function ribbonPath(pts, halfW) {
    const forward = pts
      .map(
        ({ x, y }, i) =>
          `${i === 0 ? "M" : "L"} ${(x - halfW).toFixed(1)} ${y.toFixed(1)}`,
      )
      .join(" ");
    const backward = [...pts]
      .reverse()
      .map(
        ({ x, y }, i) =>
          `${i === 0 ? "L" : "L"} ${(x + halfW).toFixed(1)} ${y.toFixed(1)}`,
      )
      .join(" ");
    return forward + " " + backward + " Z";
  }

  // For each base pair rung, compute positions
  const rungs = Array.from({ length: N }, (_, i) => {
    const t = (i + 0.5) / N;
    const y = TOP + t * TOTAL_H;
    const phaseL = t * Math.PI * 4;
    const phaseR = phaseL + Math.PI;
    const lx = CX + Math.sin(phaseL) * AMPLITUDE;
    const rx = CX + Math.sin(phaseR) * AMPLITUDE;
    // Depth: cosine tells us which strand is "in front"
    const lDepth = Math.cos(phaseL); // >0 = front
    const rDepth = Math.cos(phaseR);
    return { y, lx, rx, lDepth, rDepth, pair: BASE_PAIRS[i] };
  });

  const RIBBON_W = 8; // half-width of backbone ribbon

  return (
    <svg
      viewBox="0 0 220 300"
      className="w-full h-full max-h-[300px]"
      style={{
        filter: glow
          ? "drop-shadow(0 0 16px rgba(100,180,255,0.55))"
          : "drop-shadow(0 4px 14px rgba(0,0,0,0.12))",
      }}
    >
      <defs>
        {/* Left backbone ribbon gradient */}
        <linearGradient id="bbLGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7ec8e3" />
          <stop offset="40%" stopColor="#c8e8f5" />
          <stop offset="100%" stopColor="#5ba8c4" />
        </linearGradient>
        {/* Right backbone ribbon gradient */}
        <linearGradient id="bbRGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5ba8c4" />
          <stop offset="60%" stopColor="#c8e8f5" />
          <stop offset="100%" stopColor="#7ec8e3" />
        </linearGradient>

        {/* Shadow ribbon for depth */}
        <linearGradient id="bbShadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a7d96" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#3a7d96" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#3a7d96" stopOpacity="0.3" />
        </linearGradient>

        <filter id="softBlur">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {/* ── Shadow beneath helix ── */}
      <ellipse
        cx="110"
        cy="283"
        rx="44"
        ry="6"
        fill="#b0c4d4"
        fillOpacity="0.4"
      />

      {/* ══════════════════════════════════════
          DRAWING ORDER:
          1. Back-facing base pair halves
          2. Back-facing backbone segments
          3. Front-facing base pair halves
          4. Front-facing backbone segments
          (interleaved per rung for correct occlusion)
         ══════════════════════════════════════ */}

      {rungs.map(({ y, lx, rx, lDepth, rDepth, pair }, i) => {
        const midX = (lx + rx) / 2;
        // Rung cylinder: slightly tapered rounded rect
        const rungLen = Math.abs(rx - lx);
        const leftIsBack = lDepth < 0;

        return (
          <g key={i}>
            {/* ── BACK rung half (goes behind backbone) ── */}
            {leftIsBack ? (
              // left half goes behind → draw first
              <line
                x1={lx}
                y1={y}
                x2={midX}
                y2={y}
                stroke={pair.left}
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.65"
              />
            ) : (
              // right half goes behind
              <line
                x1={midX}
                y1={y}
                x2={rx}
                y2={y}
                stroke={pair.right}
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.65"
              />
            )}
          </g>
        );
      })}

      {/* ── LEFT backbone ribbon (smooth sinusoidal) ── */}
      {/* Draw as a series of thick rounded segments for ribbon feel */}
      {Array.from({ length: SPINE_PTS - 1 }, (_, i) => {
        const a = leftPts[i];
        const b = leftPts[i + 1];
        const depthA = Math.cos((i / (SPINE_PTS - 1)) * Math.PI * 4);
        const depthB = Math.cos(((i + 1) / (SPINE_PTS - 1)) * Math.PI * 4);
        const avgDepth = (depthA + depthB) / 2;
        const isFront = avgDepth >= 0;
        if (isFront) return null; // draw front pass later
        return (
          <line
            key={`bbL-back-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#7bbdd4"
            strokeWidth={RIBBON_W * 2}
            strokeLinecap="round"
            opacity="0.75"
          />
        );
      })}

      {Array.from({ length: SPINE_PTS - 1 }, (_, i) => {
        const a = rightPts[i];
        const b = rightPts[i + 1];
        const depthA = Math.cos((i / (SPINE_PTS - 1)) * Math.PI * 4 + Math.PI);
        const depthB = Math.cos(
          ((i + 1) / (SPINE_PTS - 1)) * Math.PI * 4 + Math.PI,
        );
        const avgDepth = (depthA + depthB) / 2;
        const isFront = avgDepth >= 0;
        if (isFront) return null;
        return (
          <line
            key={`bbR-back-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#7bbdd4"
            strokeWidth={RIBBON_W * 2}
            strokeLinecap="round"
            opacity="0.75"
          />
        );
      })}

      {/* ── FRONT rung halves and full rungs ── */}
      {rungs.map(({ y, lx, rx, lDepth, rDepth, pair }, i) => {
        const midX = (lx + rx) / 2;
        const leftIsBack = lDepth < 0;

        return (
          <g key={`front-rung-${i}`}>
            {/* Full rung center connector */}
            <line
              x1={lx}
              y1={y}
              x2={rx}
              y2={y}
              stroke="#1e293b"
              strokeWidth="1"
              opacity="0.1"
            />

            {/* FRONT half */}
            {!leftIsBack ? (
              <line
                x1={lx}
                y1={y}
                x2={midX + 1}
                y2={y}
                stroke={pair.left}
                strokeWidth="6"
                strokeLinecap="round"
              />
            ) : (
              <line
                x1={midX - 1}
                y1={y}
                x2={rx}
                y2={y}
                stroke={pair.right}
                strokeWidth="6"
                strokeLinecap="round"
              />
            )}
            {/* BACK half (drawn after so rung end shows) */}
            {!leftIsBack ? (
              <line
                x1={midX - 1}
                y1={y}
                x2={rx}
                y2={y}
                stroke={pair.right}
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.6"
              />
            ) : (
              <line
                x1={lx}
                y1={y}
                x2={midX + 1}
                y2={y}
                stroke={pair.left}
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.6"
              />
            )}

            {/* Tiny gap / shadow at center joint */}
            <circle cx={midX} cy={y} r="1.5" fill="#1e293b" opacity="0.18" />
          </g>
        );
      })}

      {/* ── FRONT backbone ribbon segments ── */}
      {Array.from({ length: SPINE_PTS - 1 }, (_, i) => {
        const a = leftPts[i];
        const b = leftPts[i + 1];
        const depthA = Math.cos((i / (SPINE_PTS - 1)) * Math.PI * 4);
        const depthB = Math.cos(((i + 1) / (SPINE_PTS - 1)) * Math.PI * 4);
        const avgDepth = (depthA + depthB) / 2;
        if (avgDepth < 0) return null;
        return (
          <g key={`bbL-front-${i}`}>
            {/* Main ribbon */}
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#8ecfe6"
              strokeWidth={RIBBON_W * 2}
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Inner highlight */}
            <line
              x1={a.x - 1}
              y1={a.y}
              x2={b.x - 1}
              y2={b.y}
              stroke="#d6f0f8"
              strokeWidth={RIBBON_W * 0.7}
              strokeLinecap="round"
              opacity="0.5"
            />
            {/* Edge shadow */}
            <line
              x1={a.x + RIBBON_W * 0.7}
              y1={a.y}
              x2={b.x + RIBBON_W * 0.7}
              y2={b.y}
              stroke="#4a90a8"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
            />
          </g>
        );
      })}

      {Array.from({ length: SPINE_PTS - 1 }, (_, i) => {
        const a = rightPts[i];
        const b = rightPts[i + 1];
        const depthA = Math.cos((i / (SPINE_PTS - 1)) * Math.PI * 4 + Math.PI);
        const depthB = Math.cos(
          ((i + 1) / (SPINE_PTS - 1)) * Math.PI * 4 + Math.PI,
        );
        const avgDepth = (depthA + depthB) / 2;
        if (avgDepth < 0) return null;
        return (
          <g key={`bbR-front-${i}`}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#8ecfe6"
              strokeWidth={RIBBON_W * 2}
              strokeLinecap="round"
              opacity="0.95"
            />
            <line
              x1={a.x + 1}
              y1={a.y}
              x2={b.x + 1}
              y2={b.y}
              stroke="#d6f0f8"
              strokeWidth={RIBBON_W * 0.7}
              strokeLinecap="round"
              opacity="0.5"
            />
            <line
              x1={a.x - RIBBON_W * 0.7}
              y1={a.y}
              x2={b.x - RIBBON_W * 0.7}
              y2={b.y}
              stroke="#4a90a8"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
            />
          </g>
        );
      })}

      {/* ══ LEGEND (bottom right, matching the reference image) ══ */}
      {/* A-T */}
      <rect x="128" y="218" width="22" height="7" rx="3" fill="#e2c84b" />
      <rect x="150" y="218" width="22" height="7" rx="3" fill="#3a9e5f" />
      <text x="128" y="233" fontSize="6.5" fill="#475569" fontWeight="500">
        Adenine
      </text>
      <text x="150" y="233" fontSize="6.5" fill="#475569" fontWeight="500">
        Thymine
      </text>

      {/* G-C */}
      <rect x="128" y="240" width="22" height="7" rx="3" fill="#d94f5c" />
      <rect x="150" y="240" width="22" height="7" rx="3" fill="#e07b2a" />
      <text x="128" y="255" fontSize="6.5" fill="#475569" fontWeight="500">
        Guanine
      </text>
      <text x="150" y="255" fontSize="6.5" fill="#475569" fontWeight="500">
        Cytosine
      </text>

      {/* ══ CALLOUT LABELS ══ */}
      {/* Base pairs label */}
      <line
        x1="82"
        y1="95"
        x2="60"
        y2="88"
        stroke="#64748b"
        strokeWidth="0.8"
      />
      <line
        x1="82"
        y1="118"
        x2="60"
        y2="88"
        stroke="#64748b"
        strokeWidth="0.8"
      />
      <text x="8" y="86" fontSize="7" fill="#475569" fontWeight="600">
        Base
      </text>
      <text x="8" y="95" fontSize="7" fill="#475569" fontWeight="600">
        pairs
      </text>

      {/* Sugar phosphate backbone label */}
      <line
        x1="148"
        y1="175"
        x2="178"
        y2="185"
        stroke="#64748b"
        strokeWidth="0.8"
      />
      <text x="148" y="195" fontSize="6.5" fill="#475569" fontWeight="600">
        Sugar-phosphate
      </text>
      <text x="148" y="205" fontSize="6.5" fill="#475569" fontWeight="600">
        backbone
      </text>

      {/* 5' / 3' end markers */}
      <text
        x="68"
        y="26"
        fontSize="9"
        fill="#4a7f9a"
        fontWeight="700"
        fontFamily="monospace"
      >
        5'
      </text>
      <text
        x="143"
        y="26"
        fontSize="9"
        fill="#4a7f9a"
        fontWeight="700"
        fontFamily="monospace"
      >
        3'
      </text>
      <text
        x="68"
        y="275"
        fontSize="9"
        fill="#4a7f9a"
        fontWeight="700"
        fontFamily="monospace"
      >
        3'
      </text>
      <text
        x="143"
        y="275"
        fontSize="9"
        fill="#4a7f9a"
        fontWeight="700"
        fontFamily="monospace"
      >
        5'
      </text>

      {/* Main label */}
      <text
        x="110"
        y="294"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
        fill="#475569"
        fontFamily="var(--font-heading)"
      >
        DNA Helix Model
      </text>
    </svg>
  );
}
