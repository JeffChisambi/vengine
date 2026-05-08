import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, BarChart3, BookOpen, Layers } from "lucide-react";

function AnimatedRefraction() {
  const W = 220, H = 200;
  const glassX = 50, glassY = 65, glassW = 120, glassH = 70;
  const entryX = glassX + glassW / 2; // 110
  const entryY = glassY; // 65
  const theta1 = 38 * Math.PI / 180;
  const n = 1.52;
  const theta2 = Math.asin(Math.sin(theta1) / n);
  const exitX = entryX + glassH * Math.tan(theta2);
  const exitY = glassY + glassH;
  const incStartX = entryX - 60 * Math.sin(theta1);
  const incStartY = entryY - 60 * Math.cos(theta1);
  const transEndX = exitX + 50 * Math.sin(theta1);
  const transEndY = exitY + 50 * Math.cos(theta1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={220} height={200}>
      <defs>
        <linearGradient id="ri-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.35" />
        </linearGradient>
        <filter id="ri-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ri-laserGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={W} height={H} fill="#f0f9ff" rx={8} />

      {/* Grid */}
      {[40, 80, 120, 160].map(x => (
        <line key={x} x1={x} y1={0} x2={x} y2={H} stroke="#e0f2fe" strokeWidth={0.5} />
      ))}
      {[40, 80, 120, 160].map(y => (
        <line key={y} x1={0} y1={y} x2={W} y2={y} stroke="#e0f2fe" strokeWidth={0.5} />
      ))}

      {/* Normal line */}
      <line x1={entryX} y1={10} x2={entryX} y2={entryY - 2}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <line x1={exitX} y1={exitY + 2} x2={exitX - (exitX - entryX) * 0.4} y2={exitY + 40}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />

      {/* Glass block */}
      <rect x={glassX} y={glassY} width={glassW} height={glassH}
        rx={3} fill="url(#ri-glass)"
        stroke="#7dd3fc" strokeWidth={1.5} />
      <rect x={glassX} y={glassY} width={glassW} height={8}
        rx={3} fill="#bae6fd" fillOpacity={0.4} />
      <text x={glassX + glassW / 2} y={glassY + glassH / 2 + 4}
        textAnchor="middle" fontSize={8} fill="#0369a1" fontWeight="bold" fontFamily="sans-serif">
        n = 1.52
      </text>

      {/* Incident ray */}
      <motion.line
        x1={incStartX} y1={incStartY} x2={entryX} y2={entryY}
        stroke="#fbbf24" strokeWidth={2.5} strokeLinecap="round"
        filter="url(#ri-laserGlow)"
        initial={{ pathLength: 0 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Refracted inside glass */}
      <motion.line
        x1={entryX} y1={entryY} x2={exitX} y2={exitY}
        stroke="#fb923c" strokeWidth={2.5} strokeLinecap="round"
        filter="url(#ri-laserGlow)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
      />

      {/* Transmitted ray */}
      <motion.line
        x1={exitX} y1={exitY} x2={transEndX} y2={transEndY}
        stroke="#fbbf24" strokeWidth={2.5} strokeLinecap="round"
        filter="url(#ri-laserGlow)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
      />

      {/* θ₁ arc */}
      <path
        d={`M ${entryX} ${entryY - 22} A 22 22 0 0 1 ${entryX + 22 * Math.sin(theta1)} ${entryY - 22 * Math.cos(theta1)}`}
        fill="none" stroke="#f59e0b" strokeWidth={1.2} strokeOpacity={0.7}
      />
      <text x={entryX + 9} y={entryY - 14} fontSize={7} fill="#b45309" fontFamily="sans-serif" fontWeight="bold">θ₁</text>

      {/* θ₂ arc */}
      <path
        d={`M ${entryX} ${entryY + 22} A 22 22 0 0 1 ${entryX + 22 * Math.sin(theta2)} ${entryY + 22 * Math.cos(theta2)}`}
        fill="none" stroke="#fb923c" strokeWidth={1.2} strokeOpacity={0.7}
      />
      <text x={entryX + 10} y={entryY + 18} fontSize={7} fill="#c2410c" fontFamily="sans-serif" fontWeight="bold">θ₂</text>

      {/* Labels */}
      <text x={incStartX - 8} y={incStartY + 4} fontSize={7} fill="#92400e" fontFamily="sans-serif">Laser</text>
      <text x={transEndX + 2} y={transEndY} fontSize={7} fill="#92400e" fontFamily="sans-serif">Out</text>

      {/* Angle callouts */}
      <text x={4} y={H - 6} fontSize={7} fill="#64748b" fontFamily="sans-serif">
        θ₁ = 38°  θ₂ = 24°
      </text>
    </svg>
  );
}

export default function RefractionIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-7 px-4 py-10 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="p-4 rounded-2xl bg-sky-50 border border-sky-200 shadow-sm"
      >
        <AnimatedRefraction />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-4">
          Physics · Optics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          Refraction Through a Glass Block
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          Ever noticed a straw looks bent in a glass of water? That's{" "}
          <strong className="text-foreground">refraction</strong> — light changing
          direction as it crosses between materials with different optical densities.
          When light enters glass, it slows down and bends toward the normal.
        </p>
      </motion.div>

      {/* Snell's Law formula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl bg-sky-500/5 border border-sky-500/20 w-full max-w-md"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Snell's Law
        </p>
        <p className="text-3xl font-extrabold font-heading text-sky-600">
          n₁ sin θ₁ = n₂ sin θ₂
        </p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          <span><strong className="text-foreground">n₁</strong> = index (medium 1)</span>
          <span><strong className="text-foreground">n₂</strong> = index (medium 2)</span>
          <span><strong className="text-foreground">θ₁</strong> = angle of incidence</span>
          <span><strong className="text-foreground">θ₂</strong> = angle of refraction</span>
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
          { Ic: Zap, label: "Fire laser beam", desc: "Control angle" },
          { Ic: Layers, label: "Change material", desc: "5 glass types" },
          { Ic: BarChart3, label: "Measure angles", desc: "θ₁ and θ₂ live" },
          { Ic: BookOpen, label: "Verify Snell's Law", desc: "Plot sin θ graph" },
        ].map(({ Ic, label, desc }) => (
          <div key={label} className="p-3 rounded-xl bg-card border border-border text-center">
            <Ic className="w-5 h-5 text-sky-500 mx-auto mb-1.5" />
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
          className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl border-0 font-semibold"
        >
          Start Experiment →
        </Button>
      </motion.div>
    </div>
  );
}
