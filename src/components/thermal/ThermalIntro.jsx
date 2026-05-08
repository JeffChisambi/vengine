import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Thermometer, Ruler, BarChart3, RefreshCw } from "lucide-react";

function AnimatedRodPreview() {
  const [t, setT] = useState(0); // 0..1

  useEffect(() => {
    let dir = 1;
    const iv = setInterval(() => {
      setT(prev => {
        const next = prev + 0.004 * dir;
        if (next >= 1) { dir = -1; return 1; }
        if (next <= 0) { dir = 1; return 0; }
        return next;
      });
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const W = 260, H = 180;
  const BASE_X = 40, BASE_W = 180, ROD_Y = 90, ROD_H = 28;
  const expansion = t * 28;
  const rodX = BASE_X - expansion / 2;
  const rodW = BASE_W + expansion;
  const temp = Math.round(20 + t * 480);
  const heat = t;

  // Rod color: cool blue-grey → warm orange-red
  const r = Math.round(100 + heat * 155);
  const g = Math.round(130 - heat * 80);
  const b = Math.round(160 - heat * 130);
  const rodColor = `rgb(${r},${g},${b})`;

  // Particle positions (pre-calculated)
  const particles = [
    { bx: 0.15 }, { bx: 0.3 }, { bx: 0.45 }, { bx: 0.6 }, { bx: 0.75 }, { bx: 0.9 },
    { bx: 0.22 }, { bx: 0.5 }, { bx: 0.78 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={260} height={180}>
      <defs>
        <linearGradient id="ti-rod" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={0.25 + heat * 0.1} />
          <stop offset="40%" stopColor={rodColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={rodColor} stopOpacity="1" />
        </linearGradient>
        <radialGradient id="ti-glow" cx="50%" cy="100%">
          <stop offset="0%" stopColor="#f97316" stopOpacity={0.6 * heat} />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <filter id="ti-blur">
          <feGaussianBlur stdDeviation={1 + heat * 3} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="ti-clip">
          <rect x={rodX} y={ROD_Y} width={rodW} height={ROD_H} rx={4} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="#fafafa" />

      {/* Glow halo */}
      <ellipse cx={BASE_X + BASE_W / 2} cy={ROD_Y + ROD_H + 20} rx={rodW * 0.55} ry={22}
        fill="url(#ti-glow)" />

      {/* Original length dashed */}
      <line x1={BASE_X} y1={ROD_Y - 8} x2={BASE_X + BASE_W} y2={ROD_Y - 8}
        stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="4 3" />
      <line x1={BASE_X} y1={ROD_Y - 13} x2={BASE_X} y2={ROD_Y - 3} stroke="#94a3b8" strokeWidth={0.8} />
      <line x1={BASE_X + BASE_W} y1={ROD_Y - 13} x2={BASE_X + BASE_W} y2={ROD_Y - 3} stroke="#94a3b8" strokeWidth={0.8} />

      {/* Expansion indicators */}
      {expansion > 1 && (
        <>
          <motion.line x1={rodX} y1={ROD_Y - 8} x2={BASE_X} y2={ROD_Y - 8}
            stroke="#f97316" strokeWidth={1.2} />
          <motion.line x1={BASE_X + BASE_W} y1={ROD_Y - 8} x2={rodX + rodW} y2={ROD_Y - 8}
            stroke="#f97316" strokeWidth={1.2} />
        </>
      )}

      {/* Rod body */}
      <rect x={rodX} y={ROD_Y} width={rodW} height={ROD_H} rx={5}
        fill="url(#ti-rod)" stroke={rodColor} strokeWidth={1.5} />

      {/* Particles inside rod */}
      {particles.map((p, i) => {
        const px = rodX + p.bx * rodW;
        const py = ROD_Y + ROD_H / 2;
        const amp = heat * 5;
        return (
          <motion.circle
            key={i} cx={px} cy={py} r={2.2}
            fill="white" fillOpacity={0.55 + heat * 0.25}
            animate={{
              cy: [py - amp, py + amp, py - amp],
              cx: [px - amp * 0.4, px + amp * 0.4, px - amp * 0.4],
            }}
            transition={{ duration: 0.3 + (1 - heat) * 0.7, repeat: Infinity, delay: i * 0.07 }}
          />
        );
      })}

      {/* Flame below */}
      {heat > 0.05 && (
        <g opacity={Math.min(1, heat * 1.5)}>
          <motion.path
            d={`M${BASE_X + BASE_W / 2 - 12},${ROD_Y + ROD_H + 2}
               Q${BASE_X + BASE_W / 2 - 6},${ROD_Y + ROD_H - 16 * heat}
               ${BASE_X + BASE_W / 2},${ROD_Y + ROD_H + 2}
               Q${BASE_X + BASE_W / 2 + 6},${ROD_Y + ROD_H - 16 * heat}
               ${BASE_X + BASE_W / 2 + 12},${ROD_Y + ROD_H + 2}`}
            fill="#f97316" fillOpacity={0.7}
            animate={{ scaleY: [0.9, 1.1, 0.9] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </g>
      )}

      {/* Temperature label */}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={10}
        fill={heat > 0.3 ? "#f97316" : "#64748b"} fontFamily="sans-serif" fontWeight="bold">
        T = {temp}°C
      </text>

      {/* ΔL label */}
      {expansion > 2 && (
        <text x={W / 2} y={ROD_Y - 18} textAnchor="middle" fontSize={8}
          fill="#f97316" fontFamily="sans-serif" fontWeight="bold">
          ΔL = {(expansion / 180 * 1000 * 0.012 * (temp - 20)).toFixed(2)} mm
        </text>
      )}
    </svg>
  );
}

export default function ThermalIntro({ onNext }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-7 px-4 py-10 max-w-3xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="p-5 rounded-2xl bg-orange-50 border border-orange-200 shadow-sm"
      >
        <AnimatedRodPreview />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-4">
          Physics · Thermodynamics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading mb-3">
          Thermal Expansion of Metals
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
          When a metal is heated, its atoms vibrate faster and push each other further apart —
          making the entire object <strong className="text-foreground">expand</strong>.
          This is why bridges have expansion joints, and train tracks are laid with small gaps.
        </p>
      </motion.div>

      {/* Formula */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20 w-full max-w-md"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          The Formula
        </p>
        <p className="text-3xl font-extrabold font-heading text-orange-600">
          ΔL = α · L₀ · ΔT
        </p>
        <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          <span><strong className="text-foreground">ΔL</strong> = extension (m)</span>
          <span><strong className="text-foreground">α</strong> = expansion coeff. (°C⁻¹)</span>
          <span><strong className="text-foreground">L₀</strong> = original length (m)</span>
          <span><strong className="text-foreground">ΔT</strong> = temp. change (°C)</span>
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {[
          { Ic: Thermometer, label: "Control heat", desc: "20°C to 500°C" },
          { Ic: RefreshCw,   label: "3 materials",   desc: "Iron, Copper, Al" },
          { Ic: Ruler,       label: "Measure ΔL",    desc: "Live expansion" },
          { Ic: BarChart3,   label: "Plot ΔL vs ΔT", desc: "Straight line!" },
        ].map(({ Ic, label, desc }) => (
          <div key={label} className="p-3 rounded-xl bg-card border border-border text-center">
            <Ic className="w-5 h-5 text-orange-500 mx-auto mb-1.5" />
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
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl border-0 font-semibold"
        >
          Start Experiment →
        </Button>
      </motion.div>
    </div>
  );
}
