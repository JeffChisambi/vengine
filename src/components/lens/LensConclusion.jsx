import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    q: "An object is placed 30 cm from a convex lens with focal length 20 cm. Where does the image form?",
    options: ["10 cm on object side (virtual)", "60 cm on image side (real)", "20 cm on image side", "Image at infinity"],
    correct: 1,
    explain: "Using 1/f = 1/do + 1/di → 1/20 = 1/30 + 1/di → 1/di = 1/20 – 1/30 = 1/60 → di = 60 cm. Real, inverted image on the far side.",
    color: "text-violet-600", border: "border-violet-500/25", bg: "bg-violet-500/8",
  },
  {
    q: "A concave (diverging) lens always produces images that are...",
    options: [
      "Real, inverted, and magnified",
      "Real, inverted, and reduced",
      "Virtual, upright, and reduced",
      "Virtual, upright, and magnified",
    ],
    correct: 2,
    explain: "Concave lenses diverge rays so they never converge. The image is always virtual (same side as object), upright, and smaller than the object — regardless of where the object is placed.",
    color: "text-indigo-600", border: "border-indigo-500/25", bg: "bg-indigo-500/8",
  },
  {
    q: "When the object is placed at the focal point of a convex lens, where is the image?",
    options: ["At twice the focal length", "At the centre of the lens", "At infinity", "At the same position as the object"],
    correct: 2,
    explain: "At do = f: 1/di = 1/f – 1/f = 0, so di → ∞. Rays exit the lens perfectly parallel and never converge. This is how collimator beams and parallel searchlights work.",
    color: "text-sky-600", border: "border-sky-500/25", bg: "bg-sky-500/8",
  },
  {
    q: "What does a steeper gradient on a 1/di vs 1/do graph tell you?",
    options: ["Longer focal length", "Shorter focal length", "Stronger divergence", "No change in focal length"],
    correct: 1,
    explain: "From 1/f = 1/do + 1/di, the intercept on the 1/di axis equals 1/f. A steeper slope (more curved line) means a larger 1/f value, i.e. a shorter focal length and a stronger (more curved) lens.",
    color: "text-emerald-600", border: "border-emerald-500/25", bg: "bg-emerald-500/8",
  },
];

function QuizCard({ item, index }) {
  const [chosen, setChosen] = useState(null);
  const answered = chosen !== null;
  const correct = chosen === item.correct;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`p-4 rounded-2xl border transition-all ${answered && correct ? `${item.bg} ${item.border}` : "bg-card border-border"}`}
    >
      <p className={`text-sm font-semibold mb-3 ${answered && correct ? item.color : "text-foreground"}`}>
        {index + 1}. {item.q}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {item.options.map((opt, oi) => {
          let cls = "px-3 py-2 rounded-xl text-xs border text-left transition-all ";
          if (!answered) cls += "bg-muted/50 border-border hover:border-violet-300 hover:bg-violet-500/5 cursor-pointer";
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
  { emoji: "📷", title: "Camera Lens",   desc: "A camera focuses real, inverted images of distant objects onto the sensor by adjusting the lens-to-sensor distance (di)." },
  { emoji: "🔍", title: "Magnifying Glass", desc: "Object placed inside focal length → virtual, upright, magnified image. di is behind lens, on same side as object." },
  { emoji: "👓", title: "Corrective Lenses", desc: "Concave lenses correct short-sightedness (diverge rays before eye); convex correct long-sightedness (converge them sooner)." },
  { emoji: "🔭", title: "Telescope",     desc: "Objective lens forms real image of distant object; eyepiece then magnifies that image like a magnifying glass." },
];

function AnimatedRayDemo() {
  const [t, setT] = useState(0);
  React.useEffect(() => {
    let d = 1;
    const iv = setInterval(() => {
      setT(p => { const n = p + 0.005 * d; if (n >= 1) { d = -1; return 1; } if (n <= 0) { d = 1; return 0; } return n; });
    }, 20);
    return () => clearInterval(iv);
  }, []);

  const W = 200, H = 120, LX = 100, AY = 60;
  const fPx = 30 + t * 25;
  const doPx = 75;
  const vPx = doPx * fPx / (doPx - fPx);
  const OBJ_H = 30;
  const imgH = -(vPx / doPx) * OBJ_H;
  const objTipY = AY - OBJ_H;
  const imgTipY = AY - imgH;
  const imgX = Math.min(W - 10, LX + vPx);
  const bulge = Math.max(5, 18 - t * 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 200 }}>
      <defs>
        <filter id="lc-glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="#0f172a" rx={8} />
      <line x1={5} y1={AY} x2={W - 5} y2={AY} stroke="#334155" strokeWidth={0.8} strokeDasharray="4 3" />
      <circle cx={LX + fPx} cy={AY} r={4} fill="#facc15" filter="url(#lc-glow)" />
      <line x1={LX - doPx} y1={objTipY} x2={LX} y2={objTipY} stroke="#f97316" strokeWidth={1.5} filter="url(#lc-glow)" />
      <line x1={LX} y1={objTipY} x2={imgX} y2={AY} stroke="#f97316" strokeWidth={1.5} filter="url(#lc-glow)" />
      <line x1={LX - doPx} y1={objTipY} x2={LX} y2={AY} stroke="#4ade80" strokeWidth={1.5} filter="url(#lc-glow)" />
      <line x1={LX} y1={AY} x2={imgX} y2={imgTipY} stroke="#4ade80" strokeWidth={1.5} filter="url(#lc-glow)" />
      <path d={`M ${LX},${AY - 45} C ${LX - bulge},${AY - 22} ${LX - bulge},${AY + 22} ${LX},${AY + 45} C ${LX + bulge},${AY + 22} ${LX + bulge},${AY - 22} ${LX},${AY - 45} Z`}
        fill="#bae6fd" fillOpacity={0.3} stroke="#7dd3fc" strokeWidth={1.2} />
      <line x1={LX - doPx} y1={AY} x2={LX - doPx} y2={objTipY} stroke="#fbbf24" strokeWidth={2} />
      <polygon points={`${LX - doPx - 4},${objTipY + 7} ${LX - doPx + 4},${objTipY + 7} ${LX - doPx},${objTipY}`} fill="#fbbf24" />
      {imgX < W && <><line x1={imgX} y1={AY} x2={imgX} y2={imgTipY} stroke="#22d3ee" strokeWidth={1.8} />
        <polygon points={`${imgX - 4},${imgTipY + 6} ${imgX + 4},${imgTipY + 6} ${imgX},${imgTipY}`} fill="#22d3ee" /></>}
      <text x={LX} y={H - 5} textAnchor="middle" fontSize={8} fill="#94a3b8" fontFamily="sans-serif">f = {fPx.toFixed(0)} cm</text>
    </svg>
  );
}

export default function LensConclusion({ readings }) {
  return (
    <div className="min-h-full flex flex-col gap-7 items-center px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-3">
          Conclusion &amp; Quiz
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-2">What did you discover?</h2>
        <p className="text-muted-foreground text-sm">Review your findings and test your understanding of optics.</p>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full p-5 rounded-2xl bg-gradient-to-br from-violet-500/8 to-indigo-500/8 border border-violet-500/20"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="shrink-0 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
            <AnimatedRayDemo />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">The Law</p>
              <p className="text-2xl font-extrabold font-heading text-violet-600">1/f = 1/dₒ + 1/dᵢ</p>
            </div>
            {[
              "Convex lenses converge rays → real or virtual images",
              "Concave lenses diverge rays → always virtual, upright, reduced",
              "do > f: real, inverted image; do < f: virtual, upright image",
              "Shorter focal length = more curved lens = stronger refraction",
              "Magnification m = −dᵢ/dₒ (negative = inverted)",
              "Graph of 1/dᵢ vs 1/dₒ is a straight line with intercept 1/f",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <span className="text-violet-500 mt-0.5 shrink-0">▸</span><span>{t}</span>
              </div>
            ))}
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
              { label: "Lens types tested", value: [...new Set(readings.map(r => r.lensType))].length },
              { label: "Avg magnification", value: `×${(readings.reduce((s, r) => s + Math.abs(r.m), 0) / readings.length).toFixed(2)}` },
              { label: "Formula verified", value: readings.filter(r => Math.abs((1 / r.f) - (1 / r.do) - (1 / r.di)).toFixed(4) < 0.01).length + "/" + readings.length },
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
