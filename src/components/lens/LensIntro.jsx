import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eye, Ruler, BarChart3, Layers } from "lucide-react";

/* ── Animated optics demo ─────────────────────────────────────── */
function OpticsDemo() {
  const [phase, setPhase] = useState(0); // 0..1 oscillates

  useEffect(() => {
    let dir = 1;
    const iv = setInterval(() => {
      setPhase(p => {
        const n = p + 0.003 * dir;
        if (n >= 1) { dir = -1; return 1; }
        if (n <= 0) { dir = 1; return 0; }
        return n;
      });
    }, 20);
    return () => clearInterval(iv);
  }, []);

  const W = 340, H = 210;
  const LX = 170, AY = 105; // lens center x, axis y

  // fCm oscillates between 40 and 100 (showing different focal lengths)
  const fCm = 40 + phase * 60;
  const fPx = fCm * 0.7; // scale
  const doObj = 120; // fixed object distance in px
  const objX = LX - doObj;
  const vPx = doObj * fPx / (doObj - fPx);
  const imgX = LX + Math.min(280, Math.max(-200, vPx));
  const m = -vPx / doObj;
  const OBJ_H = 38;
  const IMG_H = Math.max(-90, Math.min(90, m * OBJ_H));

  const objTipY = AY - OBJ_H;
  const imgTipY = AY - IMG_H;
  const bulge = Math.max(6, Math.min(24, 600 / fCm));

  // Ray 1: parallel → far focal
  const r1AfterEndX = Math.min(W + 50, imgX);
  const r1AfterDx = fPx, r1AfterDy = AY - objTipY;
  const r1t = (r1AfterEndX - LX) / r1AfterDx;
  const r1EndY = objTipY + r1t * r1AfterDy;

  // Ray 2: central
  const r2EndX = Math.min(W + 50, imgX);
  const r2t = (r2EndX - objX) / (LX - objX + (r2EndX - LX));
  const r2EndY = AY + (r2EndX - LX) * OBJ_H / doObj;

  // Ray 3: through near focal → parallel
  const nearFX = LX - fPx;
  const r3LensY = AY + fPx * OBJ_H / (doObj - fPx);
  const r3EndX = Math.min(W + 50, imgX);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", maxWidth: 340 }}>
      <defs>
        <filter id="li-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="li-lens" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="li-fp" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dark background */}
      <rect width={W} height={H} fill="#0f172a" rx={10} />

      {/* Axis */}
      <line x1={5} y1={AY} x2={W - 5} y2={AY}
        stroke="#334155" strokeWidth={1} strokeDasharray="5 4" />

      {/* Focal point marker */}
      <circle cx={LX + fPx} cy={AY} r={5}
        fill="url(#li-fp)" filter="url(#li-glow)" opacity={0.9} />
      <circle cx={LX - fPx} cy={AY} r={4}
        fill="url(#li-fp)" opacity={0.7} />
      <text x={LX + fPx} y={AY + 14}
        textAnchor="middle" fontSize={8} fill="#facc15" fontFamily="sans-serif">F</text>

      {/* ── Rays ── */}
      {/* Ray 1 before lens */}
      <line x1={objX} y1={objTipY} x2={LX} y2={objTipY}
        stroke="#f97316" strokeWidth={1.5} filter="url(#li-glow)" opacity={0.9} />
      {/* Ray 1 after lens */}
      <motion.line x1={LX} y1={objTipY} x2={r1AfterEndX} y2={r1EndY}
        stroke="#f97316" strokeWidth={1.5} filter="url(#li-glow)" opacity={0.9} />

      {/* Ray 2 before lens */}
      <line x1={objX} y1={objTipY} x2={LX} y2={AY}
        stroke="#4ade80" strokeWidth={1.5} filter="url(#li-glow)" opacity={0.9} />
      {/* Ray 2 after lens */}
      <motion.line x1={LX} y1={AY} x2={r2EndX} y2={r2EndY}
        stroke="#4ade80" strokeWidth={1.5} filter="url(#li-glow)" opacity={0.9} />

      {/* Ray 3 before lens */}
      <line x1={objX} y1={objTipY} x2={LX} y2={r3LensY}
        stroke="#60a5fa" strokeWidth={1.5} filter="url(#li-glow)" opacity={0.9} />
      {/* Ray 3 after lens (parallel) */}
      <motion.line x1={LX} y1={r3LensY} x2={r3EndX} y2={r3LensY}
        stroke="#60a5fa" strokeWidth={1.5} filter="url(#li-glow)" opacity={0.9} />

      {/* ── Lens ── */}
      <path
        d={`M ${LX},${AY - 55} C ${LX - bulge},${AY - 28} ${LX - bulge},${AY + 28} ${LX},${AY + 55}
            C ${LX + bulge},${AY + 28} ${LX + bulge},${AY - 28} ${LX},${AY - 55} Z`}
        fill="url(#li-lens)" stroke="#7dd3fc" strokeWidth={1.5} />

      {/* ── Object arrow ── */}
      <line x1={objX} y1={AY} x2={objX} y2={objTipY}
        stroke="#fbbf24" strokeWidth={2.5} />
      <polygon points={`${objX - 5},${objTipY + 8} ${objX + 5},${objTipY + 8} ${objX},${objTipY}`}
        fill="#fbbf24" />

      {/* ── Image arrow (if real) ── */}
      {vPx > 0 && imgX < W + 20 && (
        <>
          <line x1={imgX} y1={AY} x2={imgX} y2={imgTipY}
            stroke="#22d3ee" strokeWidth={2} strokeDasharray={vPx < 0 ? "4 2" : "0"} />
          <polygon
            points={`${imgX - 4},${imgTipY + 6} ${imgX + 4},${imgTipY + 6} ${imgX},${imgTipY}`}
            fill="#22d3ee" />
        </>
      )}

      {/* f label */}
      <text x={LX} y={H - 8}
        textAnchor="middle" fontSize={9}
        fill="#94a3b8" fontFamily="sans-serif">
        f = {fCm.toFixed(0)} cm
      </text>
    </svg>
  );
}

export default function LensIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-7 px-4 py-10 max-w-3xl mx-auto text-center">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-900 w-full max-w-sm"
      >
        <OpticsDemo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-4">
          Physics · Optics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          Virtual Lenses &amp; Focal Length
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          Lenses bend light rays by <strong className="text-foreground">refraction</strong> to form images.
          The <em>focal length</em> determines how strongly the lens bends light — a shorter focal
          length means a stronger, more curved lens.
        </p>
      </motion.div>

      {/* Thin lens formula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20 w-full max-w-md"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">The Thin Lens Formula</p>
        <p className="text-3xl font-extrabold font-heading text-violet-600">
          1/f = 1/d<sub>o</sub> + 1/d<sub>i</sub>
        </p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          <span><strong className="text-foreground">f</strong> = focal length (cm)</span>
          <span><strong className="text-foreground">d<sub>o</sub></strong> = object distance</span>
          <span><strong className="text-foreground">d<sub>i</sub></strong> = image distance</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Magnification: <strong className="text-violet-600">m = −d<sub>i</sub>/d<sub>o</sub></strong>
        </p>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {[
          { Ic: Eye,     label: "Drag the object",  desc: "Watch image move" },
          { Ic: Layers,  label: "Convex & concave", desc: "Switch lens types" },
          { Ic: Ruler,   label: "Adjust focal f",   desc: "See curvature change" },
          { Ic: BarChart3, label: "Plot dₒ vs dᵢ", desc: "Verify the formula" },
        ].map(({ Ic, label, desc }) => (
          <div key={label} className="p-3 rounded-xl bg-card border border-border text-center">
            <Ic className="w-5 h-5 text-violet-500 mx-auto mb-1.5" />
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
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl border-0 font-semibold"
        >
          Enter the Lab →
        </Button>
      </motion.div>
    </div>
  );
}
