import React from "react";
import { motion } from "framer-motion";

const W = 400, H = 280, CX = 200, CY = 140, ATOM_R = 90;

function AtomDiagram() {
  const electrons = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { x: CX + ATOM_R * Math.cos(angle), y: CY + ATOM_R * Math.sin(angle) };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
      <defs>
        <radialGradient id="nucleus-grad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0.7" />
        </radialGradient>
        <filter id="intro-glow">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx={CX} cy={CY} rx={ATOM_R} ry={ATOM_R * 0.35} fill="none" stroke="#0ea5e9" strokeOpacity="0.25" strokeWidth="1" />
      <ellipse cx={CX} cy={CY} rx={ATOM_R} ry={ATOM_R * 0.35} fill="none" stroke="#0ea5e9" strokeOpacity="0.25" strokeWidth="1" transform={`rotate(60 ${CX} ${CY})`} />
      <ellipse cx={CX} cy={CY} rx={ATOM_R} ry={ATOM_R * 0.35} fill="none" stroke="#0ea5e9" strokeOpacity="0.25" strokeWidth="1" transform={`rotate(120 ${CX} ${CY})`} />
      <circle cx={CX} cy={CY} r={18} fill="url(#nucleus-grad)" filter="url(#intro-glow)" />
      {electrons.map((e, i) => (
        <motion.circle
          key={i} cx={e.x} cy={e.y} r={5} fill="#0ea5e9" filter="url(#intro-glow)"
          animate={{
            cx: [e.x, CX + ATOM_R * Math.cos((i / 8) * Math.PI * 2 + 0.3), e.x],
            cy: [e.y, CY + ATOM_R * Math.sin((i / 8) * Math.PI * 2 + 0.3), e.y],
          }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <text x={CX} y={CY + 5} textAnchor="middle" fontSize="11" fill="#fb923c" fontWeight="700" fontFamily="monospace">+</text>
    </svg>
  );
}

export default function StageIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-8 px-4 py-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-4 border border-sky-500/20">
          🔬 Historical Chemistry
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          Rutherford's<br />Gold Foil Experiment
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          In 1909, Ernest Rutherford changed our understanding of the atom forever.
          This experiment reveals the inner structure of matter.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AtomDiagram />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
      >
        {[
          { icon: "⚡", title: "Alpha Particles",   desc: "High-energy helium nuclei fired at thin gold foil" },
          { icon: "🥇", title: "Gold Foil",          desc: "Only 0.00004 cm thick — a few atoms across" },
          { icon: "✨", title: "Zinc Sulfide Screen", desc: "Glows where particles strike, revealing their paths" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-4"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-xs font-bold font-heading mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {onNext && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
        >
          Begin the Journey →
        </motion.button>
      )}
    </div>
  );
}
