import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, ArrowDown, Gauge, BookOpen } from "lucide-react";

function AnimatedTank() {
  // Tank with animated jets at different depths
  const W = 160,
    H = 200,
    tx = 20,
    tw = 120;
  const jets = [
    { y: 60, depth: 0.3, color: "#60a5fa", label: "Shallow" },
    { y: 110, depth: 0.55, color: "#2563eb", label: "Medium" },
    { y: 160, depth: 0.8, color: "#1e3a8a", label: "Deep" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={160} height={200}>
      <defs>
        <linearGradient id="pi-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="pi-tank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.1" />
        </linearGradient>
        <filter id="pi-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="pi-clip">
          <rect x={tx} y={20} width={tw} height={160} rx={4} />
        </clipPath>
      </defs>

      {/* Tank body */}
      <rect
        x={tx}
        y={20}
        width={tw}
        height={160}
        rx={5}
        fill="url(#pi-tank)"
        stroke="#94a3b8"
        strokeWidth={2}
      />
      {/* Water fill */}
      <rect
        x={tx + 2}
        y={22}
        width={tw - 4}
        height={156}
        rx={3}
        fill="url(#pi-water)"
        clipPath="url(#pi-clip)"
      />
      {/* Water surface shimmer */}
      <motion.rect
        x={tx + 2}
        y={22}
        width={tw - 4}
        height={6}
        rx={2}
        fill="#bfdbfe"
        fillOpacity={0.5}
        animate={{ fillOpacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Holes + jets */}
      {jets.map((j, i) => (
        <g key={i}>
          {/* Hole */}
          <circle cx={tx + tw} cy={j.y} r={4} fill="#1e3a8a" />
          {/* Jet stream */}
          <motion.path
            d={`M${tx + tw + 4},${j.y} Q${tx + tw + 20 + i * 10},${j.y + 5} ${tx + tw + 30 + i * 15},${j.y + 12 + i * 5}`}
            fill="none"
            stroke={j.color}
            strokeWidth={2.5 + i * 0.5}
            strokeOpacity={0.8}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{
              duration: 1.2,
              delay: i * 0.4,
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
            filter="url(#pi-glow)"
          />
          {/* Droplets at end */}
          <motion.circle
            r={2.5}
            fill={j.color}
            fillOpacity={0.8}
            animate={{
              cx: [tx + tw + 4, tx + tw + 32 + i * 15],
              cy: [j.y, j.y + 16 + i * 6],
              opacity: [0.9, 0],
            }}
            transition={{
              duration: 0.9,
              delay: i * 0.4 + 0.8,
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
        </g>
      ))}

      {/* Depth arrows */}
      <line
        x1={tx - 2}
        y1={22}
        x2={tx - 2}
        y2={178}
        stroke="#64748b"
        strokeWidth={1}
      />
      <text x={tx - 8} y={26} fontSize={8} fill="#64748b" textAnchor="middle">
        0
      </text>
      <text x={tx - 8} y={180} fontSize={8} fill="#64748b" textAnchor="middle">
        h
      </text>
      <text
        x={tx - 14}
        y={100}
        fontSize={9}
        fill="#3b82f6"
        fontWeight="bold"
        transform={`rotate(-90 ${tx - 14} 100)`}
      >
        depth
      </text>
    </svg>
  );
}

export default function PressureIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-7 px-4 py-10 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <AnimatedTank />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-4">
          Physics · Fluid Mechanics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          Pressure in Liquids
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          Have you noticed that your ears hurt when you dive deep in a pool?
          That's liquid pressure at work. Water above you pushes{" "}
          <strong className="text-foreground">down</strong> — and the deeper you
          go, the more water is above you.
        </p>
      </motion.div>

      {/* Formula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 w-full max-w-md"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          The Formula
        </p>
        <p className="text-3xl font-extrabold font-heading text-blue-600">
          P = ρgh
        </p>
        <div className="flex justify-center gap-5 mt-3 text-xs text-muted-foreground flex-wrap">
          <span>
            <strong className="text-foreground">P</strong> = Pressure (Pa)
          </span>
          <span>
            <strong className="text-foreground">ρ</strong> = Density (kg/m³)
          </span>
          <span>
            <strong className="text-foreground">g</strong> = 9.81 m/s²
          </span>
          <span>
            <strong className="text-foreground">h</strong> = Depth (m)
          </span>
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {[
          { Ic: Droplets, label: "Change depth", desc: "Drag the probe" },
          { Ic: Gauge, label: "Read pressure", desc: "Live gauge" },
          { Ic: ArrowDown, label: "Change liquid", desc: "Water/oil/honey" },
          { Ic: BookOpen, label: "Plot P vs h", desc: "Straight line!" },
        ].map(({ Ic, label, desc }) => (
          <div
            key={label}
            className="p-3 rounded-xl bg-card border border-border text-center"
          >
            <Ic className="w-5 h-5 text-blue-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold">{label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl border-0 font-semibold"
        >
          Start Experiment →
        </Button>
      </motion.div>
    </div>
  );
}
