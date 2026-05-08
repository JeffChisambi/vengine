import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

const W = 520, H = 400, CX = 260, CY = 200;

function buildPath(b) {
  const sign = b >= 0 ? 1 : -1;
  const absB = Math.abs(b);
  if (absB < 6)  return { type: "reflect", startY: CY + b, pts: [[0, CY + b],[CX - 35, CY + b],[CX - 10, CY + b * 0.2],[CX - 35, CY - b * 0.2 - sign * 15],[0, CY - sign * 40]] };
  if (absB < 22) { const deflect = sign * (55 + (22 - absB) * 4); return { type: "large",   startY: CY + b, pts: [[0, CY + b],[CX - 30, CY + b * 0.9],[CX + 10, CY + b * 0.3 + deflect * 0.5],[W, CY + deflect]] }; }
  if (absB < 55) { const deflect = sign * (b * 0.25);              return { type: "medium",  startY: CY + b, pts: [[0, CY + b],[CX, CY + b * 0.85],[W, CY + b * 0.85 + deflect]] }; }
  return { type: "straight", startY: CY + b, pts: [[0, CY + b],[W, CY + b]] };
}

function ptsToD(pts) {
  if (pts.length === 2) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  if (pts.length === 3) return `M${pts[0][0]},${pts[0][1]} Q${pts[1][0]},${pts[1][1]} ${pts[2][0]},${pts[2][1]}`;
  return `M${pts[0][0]},${pts[0][1]} C${pts[1][0]},${pts[1][1]} ${pts[2][0]},${pts[2][1]} ${pts[3][0]},${pts[3][1]}`;
}

const COLOR = { straight: "#fbbf24", medium: "#fb923c", large: "#f43f5e", reflect: "#e879f9" };
const LABEL = { straight: "Straight", medium: "Slight deflect", large: "Large deflect", reflect: "Back-scatter" };

const BURST = [70,40,-40,-70,110,-110,150,-150,25,-25,8,-8,55,-55,95,-95,3,-3,130,-130].map((b, i) => ({ b, id: i, delay: i * 220 }));

export default function StageObservations({ onNext }) {
  const [particles, setParticles] = useState([]);
  const [trails,    setTrails]    = useState([]);
  const [running,   setRunning]   = useState(false);
  const [slow,      setSlow]      = useState(false);
  const [stats,     setStats]     = useState({ straight: 0, medium: 0, large: 0, reflect: 0 });
  const timersRef = useRef([]);

  const clear = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setParticles([]); setTrails([]); setStats({ straight: 0, medium: 0, large: 0, reflect: 0 }); setRunning(false);
  };

  const launch = useCallback(() => {
    clear(); setRunning(true);
    BURST.forEach(({ b, id, delay }) => {
      const t = setTimeout(() => {
        const path = buildPath(b);
        setParticles((ps) => [...ps, { ...path, id }]);
        setTimeout(() => {
          setTrails((ts) => [...ts, { ...path, id }]);
          setStats((s) => ({ ...s, [path.type]: s[path.type] + 1 }));
          setParticles((ps) => ps.filter((p) => p.id !== id));
        }, slow ? 2800 : 1000);
      }, delay * (slow ? 1.8 : 1));
      timersRef.current.push(t);
    });
    const endT = setTimeout(() => setRunning(false), (BURST[BURST.length - 1].delay + 2000) * (slow ? 1.8 : 1));
    timersRef.current.push(endT);
  }, [slow]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-3 border border-sky-500/20">
          Stage 2 — Rutherford's Results
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">The Unexpected Results</h2>
        <p className="text-muted-foreground text-sm">Watch what actually happened when Rutherford fired alpha particles at gold foil.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 w-full items-start justify-center">
        {/* Canvas */}
        <div className="rounded-2xl border border-border bg-slate-50 overflow-hidden relative">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="max-w-full">
            <defs>
              <radialGradient id="obs-nucleus" cx="50%" cy="50%">
                <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
              </radialGradient>
              <filter id="obs-glow">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="obs-glow2">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Gold foil */}
            <rect x={CX - 4} y={20} width={8} height={H - 40} rx={4} fill="#fde68a" fillOpacity={0.3} stroke="#fbbf24" strokeOpacity={0.6} strokeWidth={1} />

            {/* Nucleus */}
            <circle cx={CX} cy={CY} r={5} fill="url(#obs-nucleus)" filter="url(#obs-glow)" />

            {/* Detector arc */}
            <path d={`M ${CX - 4} 30 A 220 220 0 0 0 ${CX - 4} ${H - 30}`} fill="none" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 6" />

            {/* Trails */}
            {trails.map((t) => (
              <motion.path key={`trail-${t.id}`} d={ptsToD(t.pts)} fill="none"
                stroke={COLOR[t.type]}
                strokeWidth={t.type === "large" || t.type === "reflect" ? 1.5 : 1}
                strokeOpacity={t.type === "large" || t.type === "reflect" ? 0.7 : 0.35}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
              />
            ))}

            {/* Moving particles */}
            {particles.map((p) => (
              <motion.circle key={`p-${p.id}`} r={5} fill={COLOR[p.type]} filter="url(#obs-glow2)"
                cx={p.pts[0][0]} cy={p.pts[0][1]}
                animate={{ cx: p.pts[p.pts.length - 1][0], cy: p.pts[p.pts.length - 1][1] }}
                transition={{ duration: slow ? 2.8 : 0.9, ease: "linear" }}
              />
            ))}

            <text x={24} y={CY - 8} fontSize={10} fill="#94a3b8" fontFamily="var(--font-body)">α source</text>
            <polygon points={`8,${CY} 28,${CY - 8} 28,${CY + 8}`} fill="#94a3b8" fillOpacity={0.5} />
          </svg>

          {trails.filter((t) => t.type === "reflect" || t.type === "large").length > 0 && (
            <motion.div
              className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-700 font-semibold"
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7] }} transition={{ duration: 0.5 }}
            >
              ⚡ Detector Flash!
            </motion.div>
          )}
        </div>

        {/* Controls + Stats */}
        <div className="flex flex-col gap-3 w-full sm:max-w-[220px]">
          <div className="flex gap-2">
            <Button onClick={launch} disabled={running} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white border-0 text-xs gap-1.5">
              <Play className="w-3.5 h-3.5" /> {running ? "Firing…" : "Fire Burst"}
            </Button>
            <Button variant="outline" size="icon" onClick={clear} className="w-9 h-9">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div onClick={() => setSlow((s) => !s)} className={`w-9 h-5 rounded-full transition-colors ${slow ? "bg-sky-500" : "bg-muted"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${slow ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-muted-foreground">Slow motion</span>
          </label>

          {/* Legend */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Particle Types</p>
            {Object.entries(COLOR).map(([k, c]) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c }} />
                <span className="text-xs text-foreground/70">{LABEL[k]}</span>
                <span className="ml-auto text-xs font-bold">{stats[k] > 0 ? stats[k] : "—"}</span>
              </div>
            ))}
          </div>

          {total > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1.5">
              <p className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Results</p>
              <p className="text-foreground/80">Straight through: <strong className="text-yellow-600">{((stats.straight / total) * 100).toFixed(0)}%</strong></p>
              <p className="text-foreground/80">Small deflection: <strong className="text-orange-500">{((stats.medium / total) * 100).toFixed(0)}%</strong></p>
              <p className="text-foreground/80">Large deflection: <strong className="text-rose-500">{((stats.large / total) * 100).toFixed(0)}%</strong></p>
              <p className="text-foreground/80">Back-scattered:  <strong className="text-fuchsia-600">{((stats.reflect / total) * 100).toFixed(0)}%</strong></p>
            </motion.div>
          )}

          {total >= 15 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <p className="text-xs text-amber-700 font-semibold mb-1">🤔 What do you notice?</p>
              <p className="text-[11px] text-muted-foreground">Most particles pass straight through. But a tiny fraction bounce back violently. Why?</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
