import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    q: "A steel rod (α = 11×10⁻⁶ °C⁻¹) is 2 m long at 20°C. How much does it expand when heated to 120°C?",
    options: ["0.22 mm", "2.2 mm", "22 mm", "0.022 mm"],
    correct: 1,
    explain: "ΔL = α × L₀ × ΔT = 11×10⁻⁶ × 2 × 100 = 0.0022 m = 2.2 mm. The rod expands by just over 2 mm — enough to buckle a railway track if no gap is left!",
    color: "text-orange-600", border: "border-orange-500/25", bg: "bg-orange-500/8",
  },
  {
    q: "Which metal expands the most for the same temperature rise?",
    options: ["Steel (11×10⁻⁶)", "Iron (12×10⁻⁶)", "Copper (17×10⁻⁶)", "Aluminum (23×10⁻⁶)"],
    correct: 3,
    explain: "Aluminum has the highest linear expansion coefficient (α = 23×10⁻⁶ °C⁻¹) of common structural metals. It expands roughly twice as much as steel for the same temperature rise.",
    color: "text-amber-600", border: "border-amber-500/25", bg: "bg-amber-500/8",
  },
  {
    q: "Why do engineers leave expansion gaps in bridges and railway tracks?",
    options: [
      "To save on material costs",
      "To allow thermal expansion without buckling or cracking",
      "To reduce the weight of the structure",
      "To absorb vibrations from traffic",
    ],
    correct: 1,
    explain: "Without expansion gaps, metal expands in summer heat and has nowhere to go — so it buckles. Gaps allow the metal to expand freely. Railway tracks have always included small gaps between rail sections for this reason.",
    color: "text-red-600", border: "border-red-500/25", bg: "bg-red-500/8",
  },
  {
    q: "On a graph of ΔL vs ΔT for a given material, what does the gradient represent?",
    options: ["The original length L₀", "The temperature T", "The product α × L₀", "The density of the metal"],
    correct: 2,
    explain: "From ΔL = α·L₀·ΔT, if we plot ΔL on y and ΔT on x, the gradient = α × L₀. Knowing L₀, you can calculate the expansion coefficient α directly from the slope of your graph.",
    color: "text-indigo-600", border: "border-indigo-500/25", bg: "bg-indigo-500/8",
  },
];

function QuizCard({ item, index }) {
  const [chosen, setChosen] = useState(null);
  const answered = chosen !== null;
  const correct = chosen === item.correct;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-2xl border transition-all ${answered && correct ? `${item.bg} ${item.border}` : "bg-card border-border"}`}
    >
      <p className={`text-sm font-semibold mb-3 ${answered && correct ? item.color : "text-foreground"}`}>
        {index + 1}. {item.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {item.options.map((opt, oi) => {
          let cls = "px-3 py-2 rounded-xl text-xs border text-left transition-all ";
          if (!answered) cls += "bg-muted/50 border-border hover:border-orange-300 hover:bg-orange-500/5 cursor-pointer";
          else if (oi === item.correct) cls += "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 font-semibold";
          else if (oi === chosen) cls += "bg-red-500/10 border-red-500/20 text-red-600";
          else cls += "bg-muted/30 border-border text-muted-foreground opacity-50";
          return (
            <button key={oi} disabled={answered} onClick={() => setChosen(oi)} className={cls}>
              {oi === item.correct && answered && <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-600" />}
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            className={`mt-3 p-3 rounded-xl text-xs leading-relaxed overflow-hidden ${item.bg} ${item.color} border ${item.border}`}
          >
            {correct ? "✓ Correct! " : "✗ Not quite. "}{item.explain}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const REALWORLD = [
  { emoji: "🌉", title: "Bridge Gaps", desc: "Expansion joints in bridges allow metal decks to lengthen by several centimetres in summer without buckling." },
  { emoji: "🚂", title: "Railway Tracks", desc: "Traditional rail joints leave a small gap between sections. Modern welded rail uses stressed track designed for a specific temperature range." },
  { emoji: "🌡️", title: "Thermostats", desc: "Bimetallic strips bend when heated because two metals bond together but expand at different rates — powering thermostats and circuit breakers." },
  { emoji: "🏗️", title: "Power Lines", desc: "Electrical cables are strung looser in summer and tighter in winter to account for thermal contraction." },
];

function AnimatedBimetal() {
  const [t, setT] = useState(0);
  React.useEffect(() => {
    let dir = 1;
    const iv = setInterval(() => {
      setT(p => { const n = p + 0.006 * dir; if (n >= 1) { dir = -1; return 1; } if (n <= 0) { dir = 1; return 0; } return n; });
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const bend = t * 22;
  return (
    <svg viewBox="0 0 200 120" width="100%" style={{ maxWidth: 200 }}>
      <defs>
        <filter id="tc-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={200} height={120} fill="#f8fafc" />
      {/* Flame */}
      {t > 0.1 && (
        <motion.path
          d={`M80,100 Q90,${100 - 20 * t} 100,${100 - 30 * t} Q110,${100 - 20 * t} 120,100 Z`}
          fill="#f97316" fillOpacity={0.7}
          animate={{ scaleY: [0.9, 1.1, 0.9] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
      {/* Bimetal strip — top layer (high α) */}
      <path
        d={`M30,55 Q100,${55 - bend * 0.6} 170,${55 - bend}`}
        fill="none" stroke="#cd7f32" strokeWidth={8} strokeLinecap="round"
      />
      {/* Bimetal strip — bottom layer (low α) */}
      <path
        d={`M30,63 Q100,${63 - bend * 0.25} 170,${63 - bend * 0.5}`}
        fill="none" stroke="#6b7280" strokeWidth={8} strokeLinecap="round"
      />
      {/* Labels */}
      <text x={6} y={57} fontSize={7} fill="#cd7f32" fontFamily="sans-serif" fontWeight="bold">Cu</text>
      <text x={6} y={66} fontSize={7} fill="#6b7280" fontFamily="sans-serif" fontWeight="bold">Fe</text>
      <text x={100} y={115} textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily="sans-serif">
        T = {Math.round(20 + t * 480)}°C
      </text>
    </svg>
  );
}

export default function ThermalConclusion({ readings }) {
  return (
    <div className="min-h-full flex flex-col gap-7 items-center px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-3">
          Conclusion & Quiz
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-2">What did you discover?</h2>
        <p className="text-muted-foreground text-sm">Confirm your findings and test your understanding.</p>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-orange-500/8 to-amber-500/8 border border-orange-500/20"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="shrink-0 p-3 rounded-xl bg-orange-50 border border-orange-200">
            <AnimatedBimetal />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">The Law</p>
              <p className="text-2xl font-extrabold font-heading text-orange-600">ΔL = α · L₀ · ΔT</p>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground mt-2">
              {[
                "Extension is directly proportional to temperature rise (ΔL ∝ ΔT)",
                "Extension is directly proportional to original length (ΔL ∝ L₀)",
                "Each material has a unique expansion coefficient α",
                "Aluminum expands most; steel expands least of common metals",
                "Bimetallic strips exploit different α values to create mechanical motion",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-orange-500 mt-0.5">▸</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Experimental results */}
      {readings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
        >
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Your Results</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Readings taken", value: readings.length },
              { label: "Materials tested", value: [...new Set(readings.map(r => r.material))].length },
              { label: "Max ΔT", value: `${Math.max(...readings.map(r => r.deltaT)).toFixed(0)} °C` },
              { label: "Max ΔL", value: `${Math.max(...readings.map(r => r.deltaL_mm)).toFixed(3)} mm` },
            ].map(c => (
              <div key={c.label} className="text-center">
                <p className="text-lg font-extrabold font-heading text-emerald-600">{c.value}</p>
                <p className="text-[10px] text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real world */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {REALWORLD.map((r, i) => (
          <motion.div key={i}
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
        {QUESTIONS.map((q, i) => <QuizCard key={i} item={q} index={i} />)}
      </div>
    </div>
  );
}
