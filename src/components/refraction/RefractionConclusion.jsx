import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    q: "A light ray passes from air (n=1) into crown glass (n=1.52) at 40°. What is the refracted angle?",
    options: ["40°", "24.5°", "56°", "15°"],
    correct: 1,
    explain: "sin θ₂ = sin(40°)/1.52 = 0.643/1.52 = 0.423 → θ₂ = 25.0°. Light bends toward the normal when entering a denser medium.",
    color: "text-sky-600", border: "border-sky-500/25", bg: "bg-sky-500/8",
  },
  {
    q: "What happens to the speed of light when it enters a glass block from air?",
    options: ["It increases", "It stays the same", "It decreases", "It reverses direction"],
    correct: 2,
    explain: "The refractive index n = c/v, so v = c/n. Since n > 1 for glass, the speed drops. That's exactly why the ray bends — wavefronts slow on one side first.",
    color: "text-indigo-600", border: "border-indigo-500/25", bg: "bg-indigo-500/8",
  },
  {
    q: "A ray exits the bottom of a parallel glass slab. How does it compare to the incident ray?",
    options: [
      "Parallel, no displacement",
      "Parallel, laterally displaced",
      "At a different angle",
      "It reflects back inside",
    ],
    correct: 1,
    explain: "At the exit face (glass→air) Snell's law reverses the bending. The emerging ray is parallel to the incident ray but shifted sideways. The lateral displacement grows with angle and slab thickness.",
    color: "text-teal-600", border: "border-teal-500/25", bg: "bg-teal-500/8",
  },
  {
    q: "Diamond has n = 2.42. What is its critical angle for total internal reflection (going from diamond to air)?",
    options: ["~24°", "~41°", "~68°", "~12°"],
    correct: 0,
    explain: "Critical angle θ_c = arcsin(1/n) = arcsin(1/2.42) = arcsin(0.413) ≈ 24.4°. Diamond's very high n gives a tiny critical angle — that's why cut diamonds sparkle so brilliantly (most light undergoes TIR).",
    color: "text-pink-600", border: "border-pink-500/25", bg: "bg-pink-500/8",
  },
];

function QuizCard({ item, index }) {
  const [chosen, setChosen] = useState(null);
  const answered = chosen !== null;
  const correct = chosen === item.correct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-2xl border transition-all ${answered && correct ? `${item.bg} ${item.border}` : "bg-card border-border"}`}
    >
      <p className={`text-sm font-semibold mb-3 ${answered && correct ? item.color : "text-foreground"}`}>
        {index + 1}. {item.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {item.options.map((opt, oi) => {
          let cls = "px-3 py-2 rounded-xl text-xs border text-left transition-all ";
          if (!answered) cls += "bg-muted/50 border-border hover:border-sky-300 hover:bg-sky-500/5 cursor-pointer";
          else if (oi === item.correct) cls += "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 font-semibold";
          else if (oi === chosen) cls += "bg-red-500/10 border-red-500/20 text-red-600";
          else cls += "bg-muted/30 border-border text-muted-foreground opacity-50";
          return (
            <button key={oi} disabled={answered} onClick={() => setChosen(oi)} className={cls}>
              {oi === item.correct && answered && (
                <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-600" />
              )}
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className={`mt-3 p-3 rounded-xl text-xs leading-relaxed overflow-hidden ${item.bg} ${item.color} border ${item.border}`}
          >
            {correct ? "✓ Correct! " : "✗ Not quite. "}
            {item.explain}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const REALWORLD = [
  { emoji: "🔭", title: "Optical Lenses", desc: "Camera lenses, eyeglasses, and microscopes all work by refracting light through curved glass surfaces." },
  { emoji: "💎", title: "Diamond Sparkle", desc: "n=2.42 gives a critical angle of only 24°, causing total internal reflection and the dazzling brilliance of cut diamonds." },
  { emoji: "🌈", title: "Rainbows", desc: "Light refracts entering and exiting water droplets, with different wavelengths bending by different amounts — splitting white light into colours." },
  { emoji: "🦆", title: "Apparent Depth", desc: "A fish underwater appears shallower than it is. Light refracts at the water surface, fooling our eye about the fish's true position." },
];

function AnimatedSnellDiagram() {
  const n = 1.52;
  const th1 = 40 * Math.PI / 180;
  const th2 = Math.asin(Math.sin(th1) / n);
  const W = 200, H = 140;
  const ex = 100, ey = 55;
  const glassH = 50;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 200 }}>
      <defs>
        <linearGradient id="cc-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.25" />
        </linearGradient>
        <filter id="cc-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={W} height={H} fill="#f0f9ff" />
      <rect x={30} y={ey} width={140} height={glassH} rx={3} fill="url(#cc-glass)" stroke="#7dd3fc" strokeWidth={1.2} />
      <text x={100} y={ey + glassH / 2 + 4} textAnchor="middle" fontSize={7} fill="#0369a1" fontFamily="sans-serif" fontWeight="bold">n = 1.52</text>
      <line x1={ex} y1={8} x2={ex} y2={ey - 2} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 2" />
      <line x1={ex + (glassH * Math.tan(th2))} y1={ey + glassH + 2} x2={ex + (glassH * Math.tan(th2)) + 5} y2={ey + glassH + 35} stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="3 2" />
      <motion.line
        x1={ex - 45 * Math.sin(th1)} y1={ey - 45 * Math.cos(th1)}
        x2={ex} y2={ey}
        stroke="#fcd34d" strokeWidth={2} strokeLinecap="round" filter="url(#cc-glow)"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.line
        x1={ex} y1={ey} x2={ex + glassH * Math.tan(th2)} y2={ey + glassH}
        stroke="#fb923c" strokeWidth={2} strokeLinecap="round" filter="url(#cc-glow)"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
      <motion.line
        x1={ex + glassH * Math.tan(th2)} y1={ey + glassH}
        x2={ex + glassH * Math.tan(th2) + 40 * Math.sin(th1)} y2={ey + glassH + 40 * Math.cos(th1)}
        stroke="#fcd34d" strokeWidth={2} strokeLinecap="round" filter="url(#cc-glow)"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      />
      <text x={4} y={H - 4} fontSize={6.5} fill="#64748b" fontFamily="sans-serif">θ₁=40° → θ₂=24.5°</text>
    </svg>
  );
}

export default function RefractionConclusion({ readings }) {
  return (
    <div className="min-h-full flex flex-col gap-7 items-center px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-3">
          Conclusion & Quiz
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-2">What did you discover?</h2>
        <p className="text-muted-foreground text-sm">Confirm your findings and test your understanding.</p>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-sky-500/8 to-indigo-500/8 border border-sky-500/20"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="shrink-0">
            <AnimatedSnellDiagram />
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-center sm:text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Snell's Law</p>
              <p className="text-2xl font-extrabold font-heading text-sky-600">n₁ sin θ₁ = n₂ sin θ₂</p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground mt-2">
              {[
                "Light bends toward the normal entering a denser medium (θ₂ < θ₁)",
                "Light bends away from the normal leaving a denser medium (θ₂ > θ₁)",
                "The ratio sin θ₁ / sin θ₂ = n₂ is constant for a given material",
                "A parallel glass slab produces lateral displacement, not angular deviation",
                "Total internal reflection occurs above the critical angle θ_c = arcsin(1/n)",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-sky-500 mt-0.5">▸</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Your results summary */}
      {readings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
        >
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Your Experimental Results</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Readings taken", value: readings.length },
              { label: "Materials tested", value: [...new Set(readings.map(r => r.material))].length },
              { label: "Avg n (measured)", value: (readings.reduce((s, r) => s + r.nMeasured, 0) / readings.length).toFixed(3) },
              { label: "Max θ₁ tested", value: `${Math.max(...readings.map(r => r.angle1)).toFixed(1)}°` },
            ].map(c => (
              <div key={c.label} className="text-center">
                <p className="text-lg font-extrabold font-heading text-emerald-600">{c.value}</p>
                <p className="text-[10px] text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-world applications */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {REALWORLD.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="p-3 rounded-xl bg-card border border-border text-center"
          >
            <span className="text-2xl">{r.emoji}</span>
            <p className="text-xs font-bold mt-1.5 mb-1">{r.title}</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Quiz */}
      <div className="w-full space-y-4">
        <p className="text-sm font-bold font-heading">Test Your Understanding</p>
        {QUESTIONS.map((q, i) => (
          <QuizCard key={i} item={q} index={i} />
        ))}
      </div>
    </div>
  );
}
