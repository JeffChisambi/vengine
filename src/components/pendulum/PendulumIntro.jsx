import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Ruler, Target, TrendingDown } from "lucide-react";

// A small animated pendulum for the intro card
function MiniPendulum() {
  return (
    <svg viewBox="0 0 120 130" width={120} height={130}>
      <defs>
        <linearGradient id="pi-bob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <filter id="pi-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Pivot bracket */}
      </defs>
      {/* Ceiling mount */}
      <rect x={10} y={2} width={100} height={8} rx={3} fill="#e2e8f0" />
      <rect x={57} y={8} width={6} height={6} rx={2} fill="#94a3b8" />

      {/* Animated pendulum arm */}
      <motion.g
        style={{ transformOrigin: "60px 14px" }}
        animate={{ rotate: [30, -30, 30] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* String */}
        <line
          x1={60}
          y1={14}
          x2={60}
          y2={95}
          stroke="#64748b"
          strokeWidth={1.5}
        />
        {/* Bob */}
        <circle
          cx={60}
          cy={100}
          r={14}
          fill="url(#pi-bob)"
          filter="url(#pi-glow)"
        />
        <circle cx={55} cy={95} r={4} fill="#c7d2fe" fillOpacity={0.5} />
      </motion.g>
    </svg>
  );
}

export default function PendulumIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-8 px-4 py-10 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <MiniPendulum />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-semibold mb-4">
          Physics · Simple Harmonic Motion
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          The Simple Pendulum
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          A pendulum is one of the most elegant instruments in physics. Galileo
          discovered that its period — the time for one full swing — depends
          almost entirely on its{" "}
          <strong className="text-foreground">length</strong>, not its mass or
          starting angle (for small swings).
        </p>
      </motion.div>

      {/* Formula card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 w-full max-w-md"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          The Formula
        </p>
        <p className="text-3xl font-extrabold font-heading text-indigo-600">
          T = 2π √(L/g)
        </p>
        <div className="flex justify-center gap-6 mt-3 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">T</strong> = Period (s)
          </span>
          <span>
            <strong className="text-foreground">L</strong> = Length (m)
          </span>
          <span>
            <strong className="text-foreground">g</strong> = 9.81 m/s²
          </span>
        </div>
      </motion.div>

      {/* Learning goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {[
          { Ic: Ruler, label: "Change length", desc: "Drag to adjust" },
          { Ic: Clock, label: "Measure period", desc: "Time the swing" },
          { Ic: TrendingDown, label: "Plot data", desc: "T² vs L graph" },
          { Ic: Target, label: "Find the pattern", desc: "Discover the law" },
        ].map(({ Ic, label, desc }) => (
          <div
            key={label}
            className="p-3 rounded-xl bg-card border border-border text-center"
          >
            <Ic className="w-5 h-5 text-indigo-500 mx-auto mb-1.5" />
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl border-0 font-semibold"
        >
          Start Experiment →
        </Button>
      </motion.div>
    </div>
  );
}
