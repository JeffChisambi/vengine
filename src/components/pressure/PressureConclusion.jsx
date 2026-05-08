import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    q: "What happens to liquid pressure as depth increases?",
    options: [
      "It stays constant",
      "It decreases",
      "It increases linearly",
      "It increases exponentially",
    ],
    correct: 2,
    explain:
      "P = ρgh — pressure is directly proportional to depth h. Double the depth, double the pressure.",
    color: "text-blue-600",
    border: "border-blue-500/25",
    bg: "bg-blue-500/8",
  },
  {
    q: "A diver descends from 5 m to 10 m in seawater (ρ = 1025 kg/m³). How does pressure change?",
    options: [
      "Increases by ~50 kPa",
      "Increases by ~50 Pa",
      "Doubles to ~100 kPa",
      "Halves",
    ],
    correct: 2,
    explain:
      "P₅ = 1025×9.81×5 ≈ 50.3 kPa. P₁₀ = 1025×9.81×10 ≈ 100.6 kPa. It doubles — confirming P ∝ h.",
    color: "text-cyan-600",
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/8",
  },
  {
    q: "Why does liquid pressure act equally in all directions at a given depth?",
    options: [
      "Because liquids flow",
      "Pascal's Principle — pressure transmits uniformly",
      "Due to surface tension",
      "Gravity only pulls downward",
    ],
    correct: 1,
    explain:
      "Pascal's Principle: pressure applied to a confined liquid is transmitted undiminished in all directions. This is why submarine hulls must withstand pressure from every angle.",
    color: "text-indigo-600",
    border: "border-indigo-500/25",
    bg: "bg-indigo-500/8",
  },
  {
    q: "Mercury (ρ=13,600 kg/m³) produces the same pressure as 13.6 m of water at just 1 m depth. Why is this useful?",
    options: [
      "It's cheaper",
      "A mercury manometer can be much shorter than a water one",
      "Mercury is transparent",
      "Mercury doesn't evaporate",
    ],
    correct: 1,
    explain:
      "Because mercury is 13.6× denser than water, a mercury barometer only needs ~76 cm to balance atmospheric pressure — vs ~10.3 m of water. Compact and practical!",
    color: "text-slate-600",
    border: "border-slate-500/25",
    bg: "bg-slate-500/8",
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
      <p
        className={`text-sm font-semibold mb-3 ${answered && correct ? item.color : "text-foreground"}`}
      >
        {index + 1}. {item.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {item.options.map((opt, oi) => {
          let cls =
            "px-3 py-2 rounded-xl text-xs border text-left transition-all ";
          if (!answered)
            cls +=
              "bg-muted/50 border-border hover:border-blue-300 hover:bg-blue-500/5 cursor-pointer";
          else if (oi === item.correct)
            cls +=
              "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 font-semibold";
          else if (oi === chosen)
            cls += "bg-red-500/10 border-red-500/20 text-red-600";
          else
            cls += "bg-muted/30 border-border text-muted-foreground opacity-50";
          return (
            <button
              key={oi}
              disabled={answered}
              onClick={() => setChosen(oi)}
              className={cls}
            >
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
  {
    emoji: "🤿",
    title: "Scuba Diving",
    desc: "Every 10 m adds ~100 kPa. At 40 m divers breathe pressurised air to avoid lung collapse.",
  },
  {
    emoji: "🚢",
    title: "Submarine Design",
    desc: "Hulls are built to withstand enormous pressures — 600 atm at full ocean depth.",
  },
  {
    emoji: "🏗️",
    title: "Dam Engineering",
    desc: "Dam walls are thicker at the base because water pressure is greatest there.",
  },
  {
    emoji: "🩺",
    title: "Blood Pressure",
    desc: "Doctors measure BP at heart level — pressure differs at head vs feet due to blood column height.",
  },
];

export default function PressureConclusion({ readings }) {
  return (
    <div className="min-h-full flex flex-col gap-7 items-center px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-3">
          Conclusion & Quiz
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-2">
          What did you discover?
        </h2>
        <p className="text-muted-foreground text-sm">
          Confirm your findings and test your understanding.
        </p>
      </div>

      {/* Summary formula box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-blue-500/8 to-cyan-500/8 border border-blue-500/20"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              The Law
            </p>
            <p className="text-3xl font-extrabold font-heading text-blue-600">
              P = ρgh
            </p>
          </div>
          <div className="w-px h-16 bg-blue-500/20 hidden sm:block" />
          <div className="flex-1 space-y-1.5 text-xs text-muted-foreground">
            {[
              "Pressure increases linearly with depth",
              "Denser liquids produce higher pressure at the same depth",
              "Pressure is independent of horizontal area",
              "At the surface (h=0), gauge pressure = 0",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-blue-500 mt-0.5">▸</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Real world */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {REALWORLD.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="p-3 rounded-xl bg-card border border-border text-center"
          >
            <span className="text-2xl">{r.emoji}</span>
            <p className="text-xs font-bold mt-1.5 mb-1">{r.title}</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {r.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quiz */}
      <div className="w-full space-y-4">
        <p className="text-sm font-bold font-heading">
          Test Your Understanding
        </p>
        {QUESTIONS.map((q, i) => (
          <QuizCard key={i} item={q} index={i} />
        ))}
      </div>
    </div>
  );
}
