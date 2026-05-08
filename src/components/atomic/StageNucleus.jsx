import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const W = 480, H = 400, CX = 240, CY = 200;

function buildRepulsionPath(b) {
  const sign = Math.sign(b) || 1;
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    const x = t * W;
    const dx = x - CX;
    const dy = CY + b;
    const dist = Math.sqrt(dx * dx + (dy - CY) * (dy - CY));
    const repulsion = dist > 8 ? (180 / (dist * dist)) * sign * 35 : 0;
    pts.push([x, CY + b + (x > CX - 100 && x < CX + 80 ? repulsion * Math.exp(-Math.abs(dx) / 60) : 0)]);
  }
  return pts;
}

function ptsToPath(pts) {
  return pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
}

const DEMO_PARTICLES = [
  { b: 140 },{ b: 90 },{ b: 50 },{ b: 20 },{ b: 5 },
  { b: -140 },{ b: -90 },{ b: -50 },{ b: -20 },{ b: -5 },
];

function NucleusAtom({ charge }) {
  const r = 6 + charge * 1.5;
  return (
    <g>
      <defs>
        <radialGradient id="nuc-grad" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#fde68a" stopOpacity="1" />
          <stop offset="60%"  stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
        </radialGradient>
        <filter id="nuc-glow">
          <feGaussianBlur stdDeviation={4 + charge} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="field-glow"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      {/* Force field rings */}
      {[40, 70, 100, 135].map((fr, i) => (
        <motion.circle key={i} cx={CX} cy={CY} r={fr} fill="none"
          stroke="#f59e0b" strokeOpacity={0.06 + (3 - i) * 0.03} strokeWidth={1}
          animate={{ r: [fr, fr + 5, fr], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
      <circle cx={CX} cy={CY} r={130} fill="#f59e0b" fillOpacity={0.03} filter="url(#field-glow)" />
      <circle cx={CX} cy={CY} r={r * 2.5} fill="#f59e0b" fillOpacity={0.12} filter="url(#nuc-glow)" />
      <circle cx={CX} cy={CY} r={r} fill="url(#nuc-grad)" filter="url(#nuc-glow)" />
      <circle cx={CX - r * 0.3} cy={CY - r * 0.3} r={r * 0.3} fill="#fff" fillOpacity={0.4} />
      {/* Orbiting electrons — brand green */}
      {[0, 120, 240].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        return (
          <motion.circle key={i} r={3.5} fill="#4ade80" fillOpacity={0.8}
            animate={{
              cx: [CX + 160 * Math.cos(angle), CX + 160 * Math.cos(angle + Math.PI), CX + 160 * Math.cos(angle + 2 * Math.PI)],
              cy: [CY + 60  * Math.sin(angle), CY + 60  * Math.sin(angle + Math.PI), CY + 60  * Math.sin(angle + 2 * Math.PI)],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </g>
  );
}

export default function StageNucleus({ onNext }) {
  const [charge,    setCharge]    = useState(3);
  const [fired,     setFired]     = useState(false);
  const [showPaths, setShowPaths] = useState([]);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const fire = () => {
    if (animating) return;
    setFired(true); setAnimating(true); setShowPaths([]);
    DEMO_PARTICLES.forEach((p, i) => {
      timerRef.current = setTimeout(() => {
        const path = buildRepulsionPath(p.b * (1 + charge * 0.05));
        setShowPaths((ps) => [...ps, { pts: path, id: i, b: p.b }]);
        if (i === DEMO_PARTICLES.length - 1) setAnimating(false);
      }, i * 180);
    });
  };

  return (
    <div className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
          Stage 3 — The Nucleus
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">A Tiny, Dense, Powerful Core</h2>
        <p className="text-white/50 text-sm">Rutherford concluded a dense positive nucleus must exist. Watch how it deflects particles.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 w-full items-center justify-center">
        {/* Simulation */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1f17] overflow-hidden">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="max-w-full">
            <NucleusAtom charge={charge} />
            {/* Electron orbit ellipse — brand green */}
            <ellipse cx={CX} cy={CY} rx={160} ry={60} fill="none" stroke="#4ade80" strokeOpacity={0.12} strokeWidth={1} />
            {showPaths.map((p) => {
              const color = Math.abs(p.b) < 15 ? "#e879f9" : Math.abs(p.b) < 60 ? "#f43f5e" : "#fbbf24";
              return (
                <motion.path key={p.id} d={ptsToPath(p.pts)} fill="none"
                  stroke={color} strokeWidth={Math.abs(p.b) < 30 ? 1.8 : 1} strokeOpacity={Math.abs(p.b) < 30 ? 0.7 : 0.35}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeOut" }}
                />
              );
            })}
            <text x={18} y={CY - 8} fontSize={10} fill="#94a3b8" fontFamily="var(--font-body)">α source</text>
            <polygon points={`6,${CY} 26,${CY - 8} 26,${CY + 8}`} fill="#94a3b8" fillOpacity={0.4} />
            <text x={CX + 12} y={CY - 14} fontSize={9} fill="#fbbf24" fillOpacity={0.8} fontFamily="var(--font-heading)">Nucleus</text>
          </svg>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 min-w-[200px] w-full max-w-[220px]">
          <Button onClick={fire} disabled={animating} className="bg-green-700 hover:bg-green-600 text-white border-0 rounded-xl text-sm">
            ⚡ Fire Particles
          </Button>

          <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-3">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Nucleus Charge</p>
            <input type="range" min={1} max={6} value={charge} onChange={(e) => setCharge(+e.target.value)} className="w-full accent-green-400" />
            <div className="flex justify-between text-[10px] text-white/40">
              <span>Weak</span>
              <span className="text-green-400 font-bold">×{charge}</span>
              <span>Strong</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-2 text-xs">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Path Colors</p>
            {[["#fbbf24","Far — straight through"],["#f43f5e","Near — deflected"],["#e879f9","Close — back-scattered"]].map(([c,l]) => (
              <div key={l} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c }} />
                <span className="text-white/60">{l}</span>
              </div>
            ))}
          </div>

          {fired && showPaths.length > 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-green-500/10 border border-green-500/25 text-xs space-y-1">
              <p className="text-green-300 font-semibold">💡 Key insight</p>
              <p className="text-white/60">The nucleus must be <em>very tiny</em> — most particles miss it entirely. But when one gets close, the intense positive charge repels it sharply.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
