import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FACTS = [
  { value: "99.9999999999%", label: "of an atom is empty space", color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/6" },
  { value: "100,000×", label: "larger — atom vs nucleus", color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/6" },
  { value: "~10⁻¹⁵ m", label: "diameter of the nucleus", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/6" },
  { value: "~10⁻¹⁰ m", label: "diameter of the atom", color: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/6" },
];

function EmptySpaceViz() {
  return (
    <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto">
      <defs>
        <radialGradient id="atom-outer" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.05" />
          <stop offset="80%" stopColor="#22d3ee" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nucleus-core" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
        </radialGradient>
        <filter id="nuc-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Atom boundary */}
      <circle cx="180" cy="100" r="90" fill="url(#atom-outer)" stroke="#22d3ee" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />

      {/* Label: atom */}
      <text x="180" y="12" textAnchor="middle" fontSize="9" fill="#22d3ee" fillOpacity="0.5" fontFamily="monospace">← atom (~10⁻¹⁰ m) →</text>

      {/* Electrons scattered far from center */}
      {[
        { cx: 110, cy: 55 }, { cx: 260, cy: 80 }, { cx: 140, cy: 170 },
        { cx: 230, cy: 155 }, { cx: 95, cy: 135 }, { cx: 270, cy: 135 },
      ].map((e, i) => (
        <motion.circle
          key={i}
          cx={e.cx} cy={e.cy} r={3}
          fill="#22d3ee"
          filter="url(#nuc-glow)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* Nucleus — tiny dot in center */}
      <motion.circle
        cx="180" cy="100" r="4"
        fill="url(#nucleus-core)"
        filter="url(#nuc-glow)"
        animate={{ r: [4, 5, 4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Label: nucleus */}
      <line x1="190" y1="95" x2="220" y2="75" stroke="#f97316" strokeOpacity="0.4" strokeWidth="0.8" />
      <text x="222" y="73" fontSize="8" fill="#f97316" fillOpacity="0.7" fontFamily="monospace">nucleus</text>

      {/* Empty space annotation */}
      <text x="180" y="105" textAnchor="middle" fontSize="7" fill="#ffffff" fillOpacity="0.08" fontFamily="monospace">mostly empty</text>
    </svg>
  );
}

export default function StageEmptySpace({ onNext }) {
  const [revealed, setRevealed] = useState([]);

  const toggle = (i) =>
    setRevealed((r) => r.includes(i) ? r.filter((x) => x !== i) : [...r, i]);

  return (
    <div className="min-h-full flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3 border border-cyan-500/20">
          🌌 Stage 4 — Empty Space
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2 text-white">
          Atoms Are Mostly Nothing
        </h2>
        <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
          Rutherford's most astonishing conclusion: the atom is almost entirely empty space,
          with a tiny, dense nucleus at the centre.
        </p>
      </motion.div>

      <EmptySpaceViz />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FACTS.map((f, i) => (
          <motion.button
            key={i}
            onClick={() => toggle(i)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`text-left p-4 rounded-xl border ${f.border} ${f.bg} transition-all duration-200 hover:brightness-110`}
          >
            <AnimatePresence mode="wait">
              {revealed.includes(i) ? (
                <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className={`text-xl font-extrabold font-heading ${f.color} mb-1`}>{f.value}</p>
                  <p className="text-xs text-white/50">{f.label}</p>
                </motion.div>
              ) : (
                <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs text-white/30 mb-1">Tap to reveal fact {i + 1}</p>
                  <div className="h-5 w-24 rounded bg-white/5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-white/8 bg-white/3 p-4"
      >
        <p className="text-xs text-white/40 leading-relaxed">
          <span className="text-white/70 font-semibold">Analogy:</span> If the nucleus were the size of a marble (1 cm),
          the atom would be about 1 km wide. Everything in between is empty space with
          electrons orbiting at vast distances.
        </p>
      </motion.div>

      {onNext && revealed.length === FACTS.length && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          className="self-center px-6 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-sm font-semibold border border-cyan-500/20 transition-colors"
        >
          Continue to Summary →
        </motion.button>
      )}
    </div>
  );
}
