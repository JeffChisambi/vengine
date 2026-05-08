import React from "react";
import { motion } from "framer-motion";

// ── Reusable cell parts ──────────────────────────────────────────────────────

function Membrane({
  cx,
  cy,
  rx,
  ry,
  color = "#4ade80",
  opacity = 1,
  dashed = false,
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={color}
      fillOpacity={0.12 * opacity}
      stroke={color}
      strokeWidth="2.5"
      strokeOpacity={0.8 * opacity}
      strokeDasharray={dashed ? "6 4" : undefined}
    />
  );
}

function Nucleus({ cx, cy, r, color = "#22d3ee" }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth="2"
        strokeOpacity={0.7}
      />
      <circle cx={cx} cy={cy} r={r * 0.35} fill={color} fillOpacity={0.4} />
      {/* Pores */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(rad)}
            cy={cy + r * Math.sin(rad)}
            r={2.5}
            fill={color}
            fillOpacity={0.6}
          />
        );
      })}
    </g>
  );
}

function Chromosome({ cx, cy, angle = 0, color = "#f472b6", scale = 1 }) {
  const rad = (angle * Math.PI) / 180;
  const len = 18 * scale;
  const x1 = cx - Math.cos(rad) * len;
  const y1 = cy - Math.sin(rad) * len;
  const x2 = cx + Math.cos(rad) * len;
  const y2 = cy + Math.sin(rad) * len;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={5 * scale}
        strokeLinecap="round"
        strokeOpacity={0.9}
      />
      <circle cx={cx} cy={cy} r={3.5 * scale} fill={color} fillOpacity={0.9} />
    </g>
  );
}

function SpindleFiber({ x1, y1, x2, y2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#a78bfa"
      strokeWidth="1.2"
      strokeOpacity="0.5"
      strokeDasharray="4 3"
    />
  );
}

function Centriole({ cx, cy }) {
  return (
    <g>
      <rect
        x={cx - 8}
        y={cy - 3}
        width={16}
        height={6}
        rx={3}
        fill="#fbbf24"
        fillOpacity={0.8}
      />
      <rect
        x={cx - 8}
        y={cy - 3}
        width={16}
        height={6}
        rx={3}
        stroke="#f59e0b"
        strokeWidth={1.5}
        fill="none"
      />
    </g>
  );
}

// ── Phase Illustrations ──────────────────────────────────────────────────────

export function InterphaseSVG() {
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="cellBg1" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="nucBg1" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#cffafe" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      {/* Cell body */}
      <ellipse
        cx={150}
        cy={130}
        rx={110}
        ry={95}
        fill="url(#cellBg1)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.7"
      />
      {/* Nucleus */}
      <ellipse
        cx={150}
        cy={125}
        rx={55}
        ry={48}
        fill="url(#nucBg1)"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeOpacity="0.7"
      />
      {/* Chromatin (loose DNA) */}
      {[
        [130, 110],
        [155, 105],
        [165, 130],
        [140, 140],
        [160, 148],
      ].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x},${y} Q${x + 10},${y - 8} ${x + 20},${y + 5}`}
          fill="none"
          stroke="#f472b6"
          strokeWidth="2.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: i * 0.15 }}
        />
      ))}
      {/* Nucleolus */}
      <circle
        cx={150}
        cy={122}
        r={14}
        fill="#22d3ee"
        fillOpacity={0.3}
        stroke="#22d3ee"
        strokeWidth={1.5}
        strokeOpacity={0.5}
      />
      {/* Organelles */}
      <ellipse
        cx={85}
        cy={155}
        rx={16}
        ry={9}
        fill="#86efac"
        fillOpacity={0.5}
        stroke="#4ade80"
        strokeWidth={1.5}
      />
      <ellipse
        cx={205}
        cy={100}
        rx={14}
        ry={8}
        fill="#86efac"
        fillOpacity={0.5}
        stroke="#4ade80"
        strokeWidth={1.5}
      />
      <ellipse
        cx={195}
        cy={160}
        rx={12}
        ry={7}
        fill="#fde68a"
        fillOpacity={0.5}
        stroke="#fbbf24"
        strokeWidth={1.5}
      />
      {/* Vacuole */}
      <circle
        cx={100}
        cy={105}
        r={18}
        fill="#a5f3fc"
        fillOpacity={0.25}
        stroke="#67e8f9"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text
        x={150}
        y={250}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#16a34a"
        fontFamily="var(--font-heading)"
      >
        Interphase
      </text>
    </svg>
  );
}

export function ProphaseSVG() {
  const chroms = [
    [128, 115, 20],
    [148, 110, -15],
    [158, 132, 40],
    [138, 140, -35],
    [165, 118, 70],
    [132, 145, -60],
  ];
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="cellBg2" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <ellipse
        cx={150}
        cy={130}
        rx={110}
        ry={95}
        fill="url(#cellBg2)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.7"
      />
      {/* Dissolving nucleus */}
      <motion.ellipse
        cx={150}
        cy={125}
        rx={55}
        ry={48}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeOpacity="0.3"
        strokeDasharray="6 5"
        animate={{ strokeOpacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Condensed chromosomes */}
      {chroms.map(([cx, cy, angle], i) => (
        <motion.g
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, type: "spring" }}
        >
          <Chromosome
            cx={cx}
            cy={cy}
            angle={angle}
            color="#f472b6"
            scale={0.9}
          />
        </motion.g>
      ))}
      {/* Centrioles */}
      <Centriole cx={150} cy={55} />
      <Centriole cx={150} cy={205} />
      <text
        x={150}
        y={250}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#16a34a"
        fontFamily="var(--font-heading)"
      >
        Prophase
      </text>
    </svg>
  );
}

export function MetaphaseSVG() {
  // Chromosomes lined up at metaphase plate
  const plate = [
    [150, 105],
    [150, 117],
    [150, 129],
    [150, 141],
    [150, 153],
    [150, 165],
  ];
  const spindleTop = [[150, 55]];
  const spindleBot = [[150, 205]];
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="cellBg3" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <ellipse
        cx={150}
        cy={130}
        rx={110}
        ry={95}
        fill="url(#cellBg3)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.7"
      />
      {/* Metaphase plate line */}
      <motion.line
        x1={150}
        y1={50}
        x2={150}
        y2={210}
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeDasharray="5 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      {/* Spindle fibers */}
      {plate.map(([cx, cy], i) => (
        <g key={i}>
          <SpindleFiber x1={55} y1={130} x2={cx} y2={cy} />
          <SpindleFiber x1={245} y1={130} x2={cx} y2={cy} />
        </g>
      ))}
      {/* Centrioles */}
      <Centriole cx={55} cy={130} />
      <Centriole cx={245} cy={130} />
      {/* Aligned chromosomes */}
      {plate.map(([cx, cy], i) => (
        <motion.g
          key={i}
          initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
        >
          <Chromosome cx={cx} cy={cy} angle={0} color="#f472b6" scale={0.85} />
        </motion.g>
      ))}
      <text
        x={150}
        y={250}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#16a34a"
        fontFamily="var(--font-heading)"
      >
        Metaphase
      </text>
    </svg>
  );
}

export function AnaphaseSVG() {
  const top = [
    [140, 82],
    [153, 88],
    [144, 96],
    [157, 75],
    [148, 101],
  ];
  const bot = [
    [140, 168],
    [153, 162],
    [144, 154],
    [157, 175],
    [148, 149],
  ];
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="cellBg4" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      {/* Elongating cell */}
      <motion.ellipse
        cx={150}
        cy={130}
        rx={100}
        ry={108}
        fill="url(#cellBg4)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.7"
        initial={{ ry: 95 }}
        animate={{ ry: 108 }}
        transition={{ duration: 0.8 }}
      />
      {/* Spindle fibers */}
      {top.map(([cx, cy], i) => (
        <SpindleFiber key={i} x1={150} y1={130} x2={cx} y2={cy} />
      ))}
      {bot.map(([cx, cy], i) => (
        <SpindleFiber key={i} x1={150} y1={130} x2={cx} y2={cy} />
      ))}
      <Centriole cx={150} cy={55} />
      <Centriole cx={150} cy={205} />
      {/* Chromatids moving to poles */}
      {top.map(([cx, cy], i) => (
        <motion.g
          key={i}
          initial={{ cy: 130 - cy }}
          animate={{ cy: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <Chromosome
            cx={cx}
            cy={cy}
            angle={i * 25}
            color="#fb7185"
            scale={0.75}
          />
        </motion.g>
      ))}
      {bot.map(([cx, cy], i) => (
        <motion.g
          key={i}
          initial={{ cy: 0 }}
          animate={{ cy: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <Chromosome
            cx={cx}
            cy={cy}
            angle={i * 25}
            color="#f472b6"
            scale={0.75}
          />
        </motion.g>
      ))}
      <text
        x={150}
        y={252}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#16a34a"
        fontFamily="var(--font-heading)"
      >
        Anaphase
      </text>
    </svg>
  );
}

export function TelophaseSVG() {
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="cellBg5a" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="cellBg5b" cx="50%" cy="70%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      {/* Two forming cells */}
      <motion.ellipse
        cx={150}
        cy={72}
        rx={88}
        ry={56}
        fill="url(#cellBg5a)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        initial={{ ry: 10 }}
        animate={{ ry: 56 }}
        transition={{ duration: 0.8 }}
      />
      <motion.ellipse
        cx={150}
        cy={188}
        rx={88}
        ry={56}
        fill="url(#cellBg5b)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        initial={{ ry: 10 }}
        animate={{ ry: 56 }}
        transition={{ duration: 0.8 }}
      />
      {/* Cleavage furrow line */}
      <motion.line
        x1={62}
        y1={130}
        x2={238}
        y2={130}
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={{ transformOrigin: "center" }}
        transition={{ duration: 0.6 }}
      />
      {/* Forming nuclei */}
      <Nucleus cx={150} cy={72} r={22} color="#22d3ee" />
      <Nucleus cx={150} cy={188} r={22} color="#22d3ee" />
      {/* Chromosomes decondensing */}
      {[
        [140, 65],
        [158, 65],
        [148, 80],
        [140, 82],
        [158, 80],
      ].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x},${y} Q${x + 6},${y - 5} ${x + 12},${y + 4}`}
          fill="none"
          stroke="#f472b6"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
        />
      ))}
      {[
        [140, 181],
        [158, 181],
        [148, 196],
        [140, 198],
        [158, 196],
      ].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x},${y} Q${x + 6},${y - 5} ${x + 12},${y + 4}`}
          fill="none"
          stroke="#f472b6"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
        />
      ))}
      <text
        x={150}
        y={252}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#16a34a"
        fontFamily="var(--font-heading)"
      >
        Telophase
      </text>
    </svg>
  );
}

export function CytokinesisSVG() {
  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <defs>
        <radialGradient id="cellBg6a" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      {/* Two separate daughter cells */}
      <motion.ellipse
        cx={100}
        cy={130}
        rx={80}
        ry={78}
        fill="url(#cellBg6a)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.85"
        initial={{ cx: 150, rx: 40 }}
        animate={{ cx: 100, rx: 80 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.ellipse
        cx={200}
        cy={130}
        rx={80}
        ry={78}
        fill="url(#cellBg6a)"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeOpacity="0.85"
        initial={{ cx: 150, rx: 40 }}
        animate={{ cx: 200, rx: 80 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Nuclei */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Nucleus cx={100} cy={130} r={28} color="#22d3ee" />
        <Nucleus cx={200} cy={130} r={28} color="#22d3ee" />
      </motion.g>
      {/* Organelles */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <ellipse
          cx={70}
          cy={155}
          rx={13}
          ry={7}
          fill="#86efac"
          fillOpacity={0.6}
          stroke="#4ade80"
          strokeWidth={1.5}
        />
        <ellipse
          cx={122}
          cy={108}
          rx={11}
          ry={6}
          fill="#fde68a"
          fillOpacity={0.5}
          stroke="#fbbf24"
          strokeWidth={1.5}
        />
        <ellipse
          cx={178}
          cy={108}
          rx={11}
          ry={6}
          fill="#fde68a"
          fillOpacity={0.5}
          stroke="#fbbf24"
          strokeWidth={1.5}
        />
        <ellipse
          cx={230}
          cy={155}
          rx={13}
          ry={7}
          fill="#86efac"
          fillOpacity={0.6}
          stroke="#4ade80"
          strokeWidth={1.5}
        />
      </motion.g>
      <text
        x={150}
        y={252}
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="#16a34a"
        fontFamily="var(--font-heading)"
      >
        Cytokinesis
      </text>
    </svg>
  );
}
