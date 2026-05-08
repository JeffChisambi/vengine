import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const CONCLUSIONS = [
  {
    q: "Why did most particles pass straight through?",
    a: "Atoms are mostly empty space — there's almost nothing to stop a particle from passing through.",
    color: "text-sky-600", border: "border-sky-500/25", bg: "bg-sky-500/8",
  },
  {
    q: "What caused the rare large deflections?",
    a: "A tiny, dense, positively charged nucleus at the center repels alpha particles that come close to it.",
    color: "text-amber-600", border: "border-amber-500/25", bg: "bg-amber-500/8",
  },
  {
    q: "Why is the nucleus so small?",
    a: "Only a tiny fraction of particles deflect strongly, meaning the chance of hitting the nucleus is very small — so it must be very small.",
    color: "text-rose-500", border: "border-rose-500/25", bg: "bg-rose-500/8",
  },
  {
    q: "What did Rutherford conclude?",
    a: "The atom has a tiny dense nucleus containing almost all its mass. Electrons orbit at great distances in mostly empty space.",
    color: "text-violet-600", border: "border-violet-500/25", bg: "bg-violet-500/8",
  },
];

const FACTS = [
  { value: "99.9999999999%", label: "of an atom is empty space" },
  { value: "100,000×",       label: "smaller — nucleus vs atom" },
  { value: "99.97%",         label: "of mass in the nucleus" },
  { value: "1 in 8,000",     label: "alpha particles deflect >90°" },
];

export default function StageSummary() {
  const [revealed, setRevealed] = useState([]);
  const toggle  = (i) => setRevealed((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i]));
  const allDone = revealed.length === CONCLUSIONS.length;

  return (
    <div className="min-h-full flex flex-col gap-7 items-center justify-center px-4 py-10 max-w-3xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-3 border border-sky-500/20">
          {allDone ? "✓ Experiment Complete" : "Stage 5 — Discovery Summary"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
          {allDone ? "You've made Rutherford's discovery!" : "What did Rutherford discover?"}
        </h2>
        <p className="text-muted-foreground text-sm">Tap each question to reveal the conclusion you discovered.</p>
      </div>

      {/* Q&A reveal cards */}
      <div className="space-y-3 w-full">
        {CONCLUSIONS.map((c, i) => {
          const open = revealed.includes(i);
          return (
            <motion.button key={i} onClick={() => toggle(i)}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`w-full text-left rounded-2xl border p-4 transition-all duration-300 ${open ? `${c.bg} ${c.border}` : "bg-muted/40 border-border"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${open ? `${c.border} ${c.color}` : "border-border"}`}>
                  {open ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs text-muted-foreground">{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${open ? c.color : "text-foreground/70"}`}>{c.q}</p>
                  <AnimatePresence>
                    {open && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                        className="text-sm text-muted-foreground mt-2 leading-relaxed overflow-hidden"
                      >
                        {c.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Key numbers */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {FACTS.map((f, i) => (
          <div key={i} className="p-3 rounded-xl bg-sky-500/8 border border-sky-500/15 text-center">
            <p className="text-base font-extrabold font-heading text-sky-600">{f.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{f.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Final reveal */}
      <AnimatePresence>
        {allDone && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-amber-500/10 border border-sky-500/25 text-center"
          >
            <p className="text-lg font-extrabold font-heading mb-1">🏆 Rutherford's Nuclear Model</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The atom is mostly empty space with a tiny dense nucleus at its center.
              Electrons orbit at huge distances. This model replaced Thomson's "plum pudding" —
              and it came from a simple experiment with gold foil.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
