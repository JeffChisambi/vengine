import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const W = 480,
  H = 380,
  CX = 240,
  CY = 190,
  ATOM_R = 110;

function randomThomsonPath() {
  // Small random deflection in Thomson model
  const startY = 80 + Math.random() * 220;
  const deflect = (Math.random() - 0.5) * 14;
  const endY = startY + deflect;
  return { startY, endY, id: Math.random() };
}

function ThomsonAtom() {
  const electrons = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const r = 30 + (i % 3) * 30;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  });
  return (
    <g>
      {/* Diffuse positive charge cloud */}
      <defs>
        <radialGradient id="thomson-cloud" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#fb923c" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fdba74" stopOpacity="0.04" />
        </radialGradient>
        <filter id="t-glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={CX}
        cy={CY}
        r={ATOM_R}
        fill="url(#thomson-cloud)"
        stroke="#f97316"
        strokeWidth="1.5"
        strokeOpacity={0.3}
      />
      <circle
        cx={CX}
        cy={CY}
        r={ATOM_R * 0.75}
        fill="#f97316"
        fillOpacity={0.06}
      />
      {/* Electrons embedded */}
      {electrons.map((e, i) => (
        <circle
          key={i}
          cx={e.x}
          cy={e.y}
          r={5}
          fill="#818cf8"
          fillOpacity={0.85}
          filter="url(#t-glow)"
        />
      ))}
      <text
        x={CX}
        y={CY + ATOM_R + 22}
        textAnchor="middle"
        fontSize="11"
        fill="#f97316"
        fillOpacity={0.7}
        fontFamily="var(--font-heading)"
      >
        Thomson "Plum Pudding" Atom
      </text>
    </g>
  );
}

export default function StageThomson({ onNext }) {
  const [particles, setParticles] = useState([]);
  const [answered, setAnswered] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);

  const fireParticle = useCallback(() => {
    const p = randomThomsonPath();
    setParticles((ps) => [...ps.slice(-18), p]);
    timerRef.current = setTimeout(fireParticle, 400);
  }, []);

  const startFiring = () => {
    clearTimeout(timerRef.current);
    setParticles([]);
    setAnswered(null);
    setShowHint(false);
    fireParticle();
    setTimeout(() => {
      clearTimeout(timerRef.current);
      setShowHint(true);
    }, 6000);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="min-h-full flex flex-col gap-6 items-center justify-center px-4 py-8 max-w-4xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-3">
          Stage 1 — Thomson Model
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mb-2">
          The Plum Pudding Atom
        </h2>
        <p className="text-white/50 text-sm">
          In 1904, J.J. Thomson proposed atoms were a diffuse positive cloud
          with electrons embedded throughout.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-center justify-center">
        {/* Simulation */}
        <div className="relative rounded-2xl border border-white/10 bg-[#070d1a] overflow-hidden">
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            className="max-w-full"
          >
            <ThomsonAtom />
            {/* Particles */}
            {particles.map((p) => (
              <motion.g
                key={p.id}
                initial={{ x: -20 }}
                animate={{ x: W + 20 }}
                transition={{ duration: 1.1, ease: "linear" }}
              >
                {/* Trail */}
                <line
                  x1={-30}
                  y1={p.startY}
                  x2={0}
                  y2={p.startY}
                  stroke="#fbbf24"
                  strokeOpacity={0.25}
                  strokeWidth={1}
                />
                {/* Particle */}
                <circle
                  cx={0}
                  cy={p.startY}
                  r={5}
                  fill="#fbbf24"
                  fillOpacity={0.9}
                />
                <circle
                  cx={0}
                  cy={p.startY}
                  r={8}
                  fill="#fbbf24"
                  fillOpacity={0.2}
                />
              </motion.g>
            ))}
            {/* Detector ring right */}
            <rect
              x={W - 12}
              y={40}
              width={10}
              height={H - 80}
              rx={4}
              fill="#1e293b"
              stroke="#334155"
              strokeWidth={1}
            />
          </svg>
        </div>

        {/* Controls + question */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="p-4 rounded-xl bg-white/4 border border-white/8">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Observation
            </p>
            <p className="text-sm text-white leading-relaxed">
              Alpha particles are fired through a Thomson atom. What do you
              notice about their paths?
            </p>
          </div>

          <Button
            onClick={startFiring}
            className="bg-orange-600 hover:bg-orange-500 text-white border-0 rounded-xl"
          >
            🔫 Fire Alpha Particles
          </Button>

          <AnimatePresence>
            {showHint && !answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25"
              >
                <p className="text-sm font-semibold text-amber-300 mb-3">
                  ❓ Would this model explain <em>large</em> deflections?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setAnswered("yes")}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs"
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setAnswered("no")}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 text-xs"
                  >
                    No
                  </Button>
                </div>
              </motion.div>
            )}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-sm ${answered === "no" ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300" : "bg-red-500/10 border-red-500/25 text-red-300"}`}
              >
                {answered === "no"
                  ? "✓ Correct! The diffuse positive charge can only cause tiny deflections. Large deflections are impossible in this model."
                  : "✗ Actually no — the charge is too spread out to deflect particles sharply. Something was missing from this model..."}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
