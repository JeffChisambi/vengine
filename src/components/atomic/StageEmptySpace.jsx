import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FACTS = [
  { value: "99.9999999999%", label: "of an atom is empty space",   color: "text-emerald-600", border: "border-emerald-500/20", bg: "bg-emerald-500/8"  },
  { value: "100,000×",       label: "larger — atom vs nucleus",    color: "text-violet-600",  border: "border-violet-500/20",  bg: "bg-violet-500/8"  },
  { value: "~10⁻¹⁵ m",      label: "diameter of the nucleus",     color: "text-amber-600",   border: "border-amber-500/20",   bg: "bg-amber-500/8"   },
  { value: "~10⁻¹⁰ m",      label: "diameter of the atom",        color: "text-rose-500",    border: "border-rose-500/20",    bg: "bg-rose-500/8"    },
];

function EmptySpaceViz() {
  return (
    <svg viewBox="0 0 360 200" className="w-full max-w-sm mx-auto">
      <defs>
        <radialGradient id="atom-outer" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.08" />
          <stop offset="80%"  stopColor="#0ea5e9" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nucleus-core" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#f97316" stopOpacity="1" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
        </radialGradient>
        <filter id="nuc-glow2">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Atom boundary */}
      <circle cx="180" cy="100" r="90" fill="url(#atom-outer)" stroke="#0ea5e9" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" />
      <text x="180" y="12" textAnchor="middle" fontSize="9" fill="#0ea5e9" fillOpacity="0.7" fontFamily="monospace">← atom (~10⁻¹⁰ m) →</text>

      {/* Electrons */}
      {[{cx:110,cy:55},{cx:260,cy:80},{cx:140,cy:170},{cx:230,cy:155},{cx:95,cy:135},{cx:270,cy:135}].map((e, i) => (
        <motion.circle key={i} cx={e.cx} cy={e.cy} r={3} fill="#0ea5e9" filter="url(#nuc-glow2)"
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* Nucleus */}
      <motion.circle cx="180" cy="100" r="4" fill="url(#nucleus-core)" filter="url(#nuc-glow2)"
        animate={{ r: [4, 5, 4] }} transition={{ duration: 1.5, repeat: Infinity }}
      />
      <line x1="190" y1="95" x2="220" y2="75" stroke="#f97316" strokeOpacity="0.4" strokeWidth="0.8" />
      <text x="222" y="73" fontSize="8" fill="#f97316" fillOpacity="0.8" fontFamily="monospace">nucleus</text>
      <text x="180" y="105" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="monospace">mostly empty</text>
    </svg>
  );
}

export default function StageEmptySpace({ onNext }) {
  const [revealed, setRevealed] = useState([]);
  const toggle = (i) => setRevealed((r) => r.includes(i) ? r.filter((x) => x !== i) : [...r, i]);

  return (
    <div className="min-h-full flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-3 border border-sky-500/20">
          🌌 Stage 4 — Empty Space
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Atoms Are Mostly Nothing</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
          Rutherford's most astonishing conclusion: the atom is almost entirely empty space, with a tiny, dense nucleus at the centre.
        </p>
      </motion.div>

      <EmptySpaceViz />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FACTS.map((f, i) => (
          <motion.button key={i} onClick={() => toggle(i)}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
            className={`text-left p-4 rounded-xl border ${f.border} ${f.bg} transition-all duration-200 hover:brightness-95`}
          >
            <AnimatePresence mode="wait">
              {revealed.includes(i) ? (
                <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className={`text-xl font-extrabold font-heading ${f.color} mb-1`}>{f.value}</p>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                </motion.div>
              ) : (
                <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs text-muted-foreground/60 mb-1">Tap to reveal fact {i + 1}</p>
                  <div className="h-5 w-24 rounded bg-muted/60" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-4"
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Analogy:</span> If the nucleus were the size of a marble (1 cm),
          the atom would be about 1 km wide. Everything in between is empty space with electrons orbiting at vast distances.
        </p>
      </motion.div>

      {onNext && revealed.length === FACTS.length && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={onNext}
          className="self-center px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
        >
          Continue to Summary →
        </motion.button>
      )}
    </div>
  );
}
