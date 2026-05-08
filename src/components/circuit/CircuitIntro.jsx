import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, GitBranch, Minus, Activity, BookOpen } from "lucide-react";

function MiniSeriesCircuit() {
  return (
    <svg viewBox="0 0 220 160" width={220} height={160}>
      <defs>
        <filter id="ci-glow-s">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="ci-bulb-s" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* Outer rectangle */}
      <rect x={20} y={20} width={180} height={120} rx={4}
        fill="none" stroke="#e2e8f0" strokeWidth={1.5} />

      {/* Animated current flow */}
      <motion.rect x={20} y={20} width={180} height={120} rx={4}
        fill="none" stroke="#f59e0b" strokeWidth={2.5}
        strokeDasharray="8 14"
        animate={{ strokeDashoffset: [0, -22] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Battery (left side) */}
      <line x1={20} y1={70} x2={20} y2={55} stroke="#94a3b8" strokeWidth={1.5} />
      <line x1={12} y1={55} x2={28} y2={55} stroke="#10b981" strokeWidth={2} />
      <line x1={15} y1={62} x2={25} y2={62} stroke="#64748b" strokeWidth={3} />
      <line x1={20} y1={62} x2={20} y2={90} stroke="#94a3b8" strokeWidth={1.5} />
      <line x1={12} y1={78} x2={28} y2={78} stroke="#10b981" strokeWidth={2} />
      <line x1={15} y1={85} x2={25} y2={85} stroke="#64748b" strokeWidth={3} />
      <line x1={20} y1={90} x2={20} y2={100} stroke="#94a3b8" strokeWidth={1.5} />
      <text x={32} y={59} fontSize={8} fill="#10b981" fontWeight="bold">+</text>
      <text x={32} y={88} fontSize={8} fill="#64748b" fontWeight="bold">−</text>

      {/* R1 (top wire) */}
      <rect x={62} y={13} width={38} height={14} rx={2}
        fill="white" stroke="#f59e0b" strokeWidth={1.5} />
      <polyline points="66,20 70,14 76,26 82,14 88,26 94,14 98,20"
        fill="none" stroke="#f59e0b" strokeWidth={1.2} />
      <text x={81} y={11} textAnchor="middle" fontSize={7} fill="#94a3b8">R1</text>

      {/* R2 (top wire) */}
      <rect x={118} y={13} width={38} height={14} rx={2}
        fill="white" stroke="#f59e0b" strokeWidth={1.5} />
      <polyline points="122,20 126,14 132,26 138,14 144,26 150,14 154,20"
        fill="none" stroke="#f59e0b" strokeWidth={1.2} />
      <text x={137} y={11} textAnchor="middle" fontSize={7} fill="#94a3b8">R2</text>

      {/* Bulb (right side) */}
      <circle cx={200} cy={80} r={13} fill="url(#ci-bulb-s)"
        filter="url(#ci-glow-s)" opacity={0.9} />
      <line x1={195} y1={75} x2={205} y2={85} stroke="#92400e" strokeWidth={1.2} />
      <line x1={205} y1={75} x2={195} y2={85} stroke="#92400e" strokeWidth={1.2} />

      {/* Label */}
      <text x={110} y={152} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight="600">SERIES</text>
    </svg>
  );
}

function MiniParallelCircuit() {
  return (
    <svg viewBox="0 0 220 180" width={220} height={180}>
      <defs>
        <filter id="ci-glow-p">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="ci-bulb-p" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* Outer wires */}
      <line x1={20} y1={20} x2={200} y2={20} stroke="#e2e8f0" strokeWidth={1.5} />
      <line x1={20} y1={160} x2={200} y2={160} stroke="#e2e8f0" strokeWidth={1.5} />
      <line x1={20} y1={20} x2={20} y2={160} stroke="#e2e8f0" strokeWidth={1.5} />
      <line x1={200} y1={20} x2={200} y2={160} stroke="#e2e8f0" strokeWidth={1.5} />

      {/* Animated main path */}
      <motion.path d="M20,20 L85,20 M145,20 L200,20 L200,160 L20,160 L20,20"
        fill="none" stroke="#f59e0b" strokeWidth={2.5}
        strokeDasharray="8 14"
        animate={{ strokeDashoffset: [0, -22] }}
        transition={{ duration: 1.0, repeat: Infinity, ease: "linear" }}
      />
      {/* R1 branch animation */}
      <motion.path d="M85,20 L85,75 L145,75 L145,20"
        fill="none" stroke="#f59e0b" strokeWidth={2}
        strokeDasharray="6 12"
        animate={{ strokeDashoffset: [0, -18] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
      {/* R2 branch animation */}
      <motion.path d="M85,20 L85,115 L145,115 L145,20"
        fill="none" stroke="#fbbf24" strokeWidth={2}
        strokeDasharray="6 12"
        animate={{ strokeDashoffset: [0, -18] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />

      {/* Battery */}
      <line x1={20} y1={70} x2={20} y2={55} stroke="#94a3b8" strokeWidth={1.5} />
      <line x1={12} y1={55} x2={28} y2={55} stroke="#10b981" strokeWidth={2} />
      <line x1={15} y1={63} x2={25} y2={63} stroke="#64748b" strokeWidth={3} />
      <line x1={20} y1={63} x2={20} y2={95} stroke="#94a3b8" strokeWidth={1.5} />
      <line x1={12} y1={82} x2={28} y2={82} stroke="#10b981" strokeWidth={2} />
      <line x1={15} y1={90} x2={25} y2={90} stroke="#64748b" strokeWidth={3} />
      <line x1={20} y1={90} x2={20} y2={105} stroke="#94a3b8" strokeWidth={1.5} />
      <text x={32} y={60} fontSize={8} fill="#10b981" fontWeight="bold">+</text>
      <text x={32} y={92} fontSize={8} fill="#64748b" fontWeight="bold">−</text>

      {/* Junction dots */}
      <circle cx={85} cy={20} r={3.5} fill="#f59e0b" />
      <circle cx={145} cy={20} r={3.5} fill="#f59e0b" />

      {/* R1 */}
      <rect x={96} y={68} width={38} height={14} rx={2}
        fill="white" stroke="#f59e0b" strokeWidth={1.5} />
      <polyline points="100,75 104,69 110,81 116,69 122,81 128,69 132,75"
        fill="none" stroke="#f59e0b" strokeWidth={1.2} />
      <text x={115} y={66} textAnchor="middle" fontSize={7} fill="#94a3b8">R1</text>

      {/* R2 */}
      <rect x={96} y={108} width={38} height={14} rx={2}
        fill="white" stroke="#fbbf24" strokeWidth={1.5} />
      <polyline points="100,115 104,109 110,121 116,109 122,121 128,109 132,115"
        fill="none" stroke="#fbbf24" strokeWidth={1.2} />
      <text x={115} y={106} textAnchor="middle" fontSize={7} fill="#94a3b8">R2</text>

      {/* Bulb */}
      <circle cx={200} cy={90} r={13} fill="url(#ci-bulb-p)"
        filter="url(#ci-glow-p)" opacity={0.9} />
      <line x1={195} y1={85} x2={205} y2={95} stroke="#92400e" strokeWidth={1.2} />
      <line x1={205} y1={85} x2={195} y2={95} stroke="#92400e" strokeWidth={1.2} />

      <text x={110} y={174} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight="600">PARALLEL</text>
    </svg>
  );
}

export default function CircuitIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-8 px-4 py-10 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold mb-4">
          Physics · Electricity &amp; Circuits
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          Simple Electric Circuits
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
          Discover how current, voltage, and resistance interact in two fundamental
          circuit configurations. Build intuition for Ohm's Law and see how changing
          one value ripples through the whole circuit.
        </p>
      </motion.div>

      {/* Mini circuit previews */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap justify-center gap-6"
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-500/5 p-4 flex flex-col items-center gap-2">
          <MiniSeriesCircuit />
          <p className="text-xs font-semibold text-amber-700">One path for current</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-500/5 p-4 flex flex-col items-center gap-2">
          <MiniParallelCircuit />
          <p className="text-xs font-semibold text-amber-700">Current splits between branches</p>
        </div>
      </motion.div>

      {/* Key equations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          { label: "Ohm's Law", eq: "V = I × R", color: "text-amber-600", bg: "bg-amber-500/8 border-amber-500/20" },
          { label: "Series R", eq: "R = R₁ + R₂", color: "text-orange-600", bg: "bg-orange-500/8 border-orange-500/20" },
          { label: "Parallel R", eq: "1/R = 1/R₁ + 1/R₂", color: "text-yellow-600", bg: "bg-yellow-500/8 border-yellow-500/20" },
        ].map(({ label, eq, color, bg }) => (
          <div key={label} className={`p-3 rounded-xl border ${bg} text-center`}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-base font-extrabold font-heading ${color}`}>{eq}</p>
          </div>
        ))}
      </motion.div>

      {/* Learning goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {[
          { Ic: Zap, label: "Apply Ohm's Law", desc: "V = I × R" },
          { Ic: Minus, label: "Series circuits", desc: "R adds up" },
          { Ic: GitBranch, label: "Parallel circuits", desc: "Current splits" },
          { Ic: Activity, label: "Compare them", desc: "Record & analyse" },
        ].map(({ Ic, label, desc }) => (
          <div key={label} className="p-3 rounded-xl bg-card border border-border text-center">
            <Ic className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold">{label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <Button
          onClick={onNext}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl border-0 font-semibold"
        >
          Start Experiment →
        </Button>
      </motion.div>
    </div>
  );
}
