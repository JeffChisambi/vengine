/**
 * OxygenSVG.jsx — All SVG scenes for the "Preparation and Testing of Oxygen" experiment.
 *
 * Named exports
 * ─────────────
 * OxygenMoleculeSVG      Animated O₂ molecule (intro)
 * OxygenApparatusSVG     Full lab apparatus, built phase-by-phase
 * OxygenTestSVG          Glowing-splint and burning tests
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── helpers ──────────────────────────────────────────────── */
function Flame({ cx, cy, h = 38, on = true }) {
  if (!on) return null;
  return (
    <g>
      <motion.path
        d={`M${cx} ${cy - h} Q${cx - 14} ${cy - h * 0.5} ${cx - 9} ${cy}
            Q${cx} ${cy - 4} ${cx + 9} ${cy}
            Q${cx + 14} ${cy - h * 0.5} ${cx} ${cy - h} Z`}
        fill="#fb923c" fillOpacity={0.85}
        animate={{ d: [
          `M${cx} ${cy-h} Q${cx-14} ${cy-h*.5} ${cx-9} ${cy} Q${cx} ${cy-4} ${cx+9} ${cy} Q${cx+14} ${cy-h*.5} ${cx} ${cy-h} Z`,
          `M${cx} ${cy-h-6} Q${cx-12} ${cy-h*.5} ${cx-8} ${cy} Q${cx} ${cy-3} ${cx+8} ${cy} Q${cx+12} ${cy-h*.5} ${cx} ${cy-h-6} Z`,
          `M${cx} ${cy-h} Q${cx-14} ${cy-h*.5} ${cx-9} ${cy} Q${cx} ${cy-4} ${cx+9} ${cy} Q${cx+14} ${cy-h*.5} ${cx} ${cy-h} Z`,
        ]}}
        transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d={`M${cx} ${cy-h*.6} Q${cx-6} ${cy-h*.3} ${cx-4} ${cy} L${cx+4} ${cy} Q${cx+6} ${cy-h*.3} ${cx} ${cy-h*.6} Z`}
        fill="#fef3c7" fillOpacity={0.9}
        animate={{ scaleY: [1, 1.12, 1] }}
        transition={{ duration: 0.45, repeat: Infinity }}
      />
    </g>
  );
}

function GlassRect({ x, y, w, h, rx = 4, style }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={rx}
      fill="none" fillOpacity={0}
      style={{ filter: "url(#oa-sheen)", ...style }}
      stroke="#94a3b8" strokeWidth={2.2}
    />
  );
}

/* ── OxygenMoleculeSVG ────────────────────────────────────── */
export function OxygenMoleculeSVG({ size = 200 }) {
  return (
    <svg viewBox="0 0 200 130" width={size} height={size * 0.65}>
      <defs>
        <radialGradient id="om-atom" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
        <filter id="om-glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Electron cloud hint */}
      <ellipse cx={100} cy={60} rx={65} ry={28} fill="#d1fae5" fillOpacity={0.35} />

      {/* Double bond */}
      <line x1={72} y1={56} x2={128} y2={56} stroke="#34d399" strokeWidth={2.8} />
      <line x1={72} y1={64} x2={128} y2={64} stroke="#34d399" strokeWidth={2.8} />

      {/* Atoms */}
      <motion.circle cx={54} cy={60} r={24}
        fill="url(#om-atom)" filter="url(#om-glow)"
        animate={{ r: [24, 26, 24] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x={54} y={65} textAnchor="middle" fontSize={14}
        fill="white" fontWeight="bold" fontFamily="var(--font-heading)">O</text>

      <motion.circle cx={146} cy={60} r={24}
        fill="url(#om-atom)" filter="url(#om-glow)"
        animate={{ r: [24, 26, 24] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      <text x={146} y={65} textAnchor="middle" fontSize={14}
        fill="white" fontWeight="bold" fontFamily="var(--font-heading)">O</text>

      {/* Label */}
      <text x={100} y={108} textAnchor="middle" fontSize={12}
        fill="#065f46" fontWeight="bold" fontFamily="var(--font-heading)">
        O₂ — Oxygen Molecule
      </text>
      <text x={100} y={122} textAnchor="middle" fontSize={9}
        fill="#6b7280" fontFamily="var(--font-body)">
        Molar mass: 32 g/mol · Double covalent bond
      </text>
    </svg>
  );
}

/* ── OxygenApparatusSVG ───────────────────────────────────── */
/**
 * phase: 0 = burner + tripod + stand  1 = + flask  2 = + stopper + delivery tube
 *        3 = + trough + jar           4 = full labelled apparatus
 * heating: animate flame + bubbles
 * progress: 0‒1  →  how full the gas jar is with O₂
 * method: 'kmno4' | 'h2o2'
 */
export function OxygenApparatusSVG({ phase = 4, heating = false, progress = 0, method = "kmno4" }) {
  const liqColor = method === "kmno4" ? "#7c3aed" : "#bae6fd";
  const liqColorDark = method === "kmno4" ? "#4c1d95" : "#7dd3fc";
  const liqLabel = method === "kmno4" ? "KMnO₄" : "H₂O₂ + MnO₂";

  /* Gas-jar fill geometry */
  const JAR_X = 381, JAR_TOP = 88, JAR_W = 74, JAR_H = 196, JAR_BOT = JAR_TOP + JAR_H;
  const gasH   = JAR_H * progress;           // gas occupies top portion
  const gasTopY = JAR_TOP;                   // gas always at top (closed end)
  const waterTopY = JAR_TOP + gasH;          // water-gas interface

  /* Flask liquid level */
  const liqLevel = Math.max(0.18, 0.42 - progress * 0.12);
  const FC = { x: 175, y: 218, r: 66 };     // flask centre
  const liquidY = FC.y + FC.r - FC.r * 2 * liqLevel;

  return (
    <svg viewBox="0 0 540 418" className="w-full h-full max-h-[418px]"
      style={{ background: "#f8fafc", borderRadius: 10 }}>
      <defs>
        <linearGradient id="oa-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#e0e7ff" stopOpacity="0.42" />
          <stop offset="50%"  stopColor="#ffffff"  stopOpacity="0.08" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id="oa-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#64748b" />
          <stop offset="40%"  stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="oa-liq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={liqColor}     stopOpacity="0.7" />
          <stop offset="100%" stopColor={liqColorDark} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="oa-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="oa-gas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d1fae5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id="oa-flask-clip">
          <path d={`M ${FC.x - 16} ${FC.y - FC.r + 32} L ${FC.x - 16} ${FC.y - FC.r + 65}
                    A ${FC.r} ${FC.r} 0 1 0 ${FC.x + 16} ${FC.y - FC.r + 65}
                    L ${FC.x + 16} ${FC.y - FC.r + 32} Z`} />
        </clipPath>
        <clipPath id="oa-jar-clip">
          <rect x={JAR_X} y={JAR_TOP} width={JAR_W} height={JAR_H} rx={4} />
        </clipPath>
      </defs>

      {/* ── RETORT STAND ──────────────────────────────── */}
      <rect x={260} y={368} width={80} height={16} rx={4}
        fill="url(#oa-metal)" stroke="#475569" strokeWidth={1.5} />
      <rect x={296} y={42} width={10} height={328} rx={3}
        fill="url(#oa-metal)" stroke="#475569" strokeWidth={1} />
      <ellipse cx={301} cy={42} rx={6} ry={4} fill="#94a3b8" />

      {/* Clamp arm + ring (only when flask is placed) */}
      {phase >= 1 && (
        <g>
          <rect x={FC.x} y={125} width={106} height={7} rx={3}
            fill="url(#oa-metal)" stroke="#475569" strokeWidth={1} />
          <circle cx={FC.x} cy={128} r={16} fill="none" stroke="#64748b" strokeWidth={4} />
          <circle cx={FC.x} cy={128} r={9}  fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
        </g>
      )}

      {/* ── BUNSEN BURNER ─────────────────────────────── */}
      {/* Base */}
      <rect x={143} y={355} width={56} height={22} rx={5}
        fill="url(#oa-metal)" stroke="#475569" strokeWidth={1.5} />
      {/* Gas inlet */}
      <path d="M 143 368 L 118 368 Q 112 368 112 362 L 112 354"
        fill="none" stroke="#64748b" strokeWidth={5} strokeLinecap="round" />
      {/* Barrel */}
      <rect x={158} y={292} width={26} height={65} rx={3}
        fill="url(#oa-metal)" stroke="#64748b" strokeWidth={1.5} />
      <rect x={152} y={338} width={38} height={14} rx={4}
        fill="#94a3b8" stroke="#64748b" strokeWidth={1.2} />
      <ellipse cx={161} cy={345} rx={3} ry={5} fill="#1e293b" />
      <ellipse cx={183} cy={345} rx={3} ry={5} fill="#1e293b" />
      <ellipse cx={171} cy={292} rx={14} ry={4.5}
        fill="#475569" stroke="#64748b" strokeWidth={1.5} />
      {/* Flame */}
      <Flame cx={171} cy={292} h={42} on={heating} />
      <text x={171} y={408} textAnchor="middle" fontSize={9}
        fill="#64748b" fontFamily="var(--font-body)">Bunsen Burner</text>

      {/* ── TRIPOD STAND ──────────────────────────────── */}
      {[[171,291,115,368],[171,291,171,374],[171,291,227,368]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#64748b" strokeWidth={4} strokeLinecap="round" />
      ))}
      <ellipse cx={171} cy={290} rx={55} ry={8}
        fill="none" stroke="#94a3b8" strokeWidth={3} />

      {/* ── WIRE GAUZE ────────────────────────────────── */}
      <rect x={126} y={283} width={90} height={10} rx={2}
        fill="#d1d5db" stroke="#9ca3af" strokeWidth={1.2} />
      {[10,20,30,40,50,60,70,80].map(dx => (
        <line key={dx} x1={126+dx} y1={283} x2={126+dx} y2={293}
          stroke="#9ca3af" strokeWidth={0.8} />
      ))}
      {[0,1].map(i => (
        <line key={i} x1={126} y1={286+i*4} x2={216} y2={286+i*4}
          stroke="#9ca3af" strokeWidth={0.8} />
      ))}
      <text x={96} y={290} textAnchor="middle" fontSize={8}
        fill="#64748b" fontFamily="var(--font-body)">Wire Gauze</text>

      {/* ── ROUND-BOTTOM FLASK ────────────────────────── */}
      {phase >= 1 && (
        <g>
          {/* Neck */}
          <rect x={FC.x-14} y={143} width={28} height={62} rx={3}
            fill="url(#oa-glass)" stroke="#94a3b8" strokeWidth={2.5} />

          {/* Liquid (clipped to flask body) */}
          <g clipPath="url(#oa-flask-clip)">
            <motion.rect x={FC.x - FC.r} width={FC.r * 2 + 2}
              fill="url(#oa-liq)"
              animate={{ y: liquidY, height: FC.r * 2 * liqLevel }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Liquid surface */}
            <motion.ellipse cx={FC.x} rx={50} ry={6}
              fill={liqColor} fillOpacity={0.4}
              animate={{ cy: liquidY + 3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            {/* Bubbles */}
            {heating && [0,1,2,3].map(i => (
              <motion.circle key={i} cx={FC.x - 20 + i * 14} r={2.5 + i % 2}
                fill="#c4b5fd" fillOpacity={0.75}
                initial={{ cy: FC.y + FC.r - 10, opacity: 0 }}
                animate={{ cy: liquidY + 6, opacity: [0, 0.9, 0] }}
                transition={{ duration: 1.4, delay: i * 0.28, repeat: Infinity }}
              />
            ))}
          </g>

          {/* Flask body outline */}
          <path d={`M ${FC.x-16} ${FC.y-FC.r+32} L ${FC.x-16} ${FC.y-FC.r+65}
                    A ${FC.r} ${FC.r} 0 1 0 ${FC.x+16} ${FC.y-FC.r+65}
                    L ${FC.x+16} ${FC.y-FC.r+32} Z`}
            fill="url(#oa-glass)" stroke="#94a3b8" strokeWidth={2.5} fillOpacity={0.55} />
          {/* Glass sheen */}
          <path d={`M ${FC.x-FC.r+12} ${FC.y-FC.r+50} Q ${FC.x-FC.r+2} ${FC.y} ${FC.x-FC.r+16} ${FC.y+FC.r-10}`}
            stroke="#ffffff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.2} />

          {/* Labels */}
          {phase >= 4 && <>
            <text x={FC.x - FC.r - 12} y={FC.y + 10}
              textAnchor="end" fontSize={9} fill="#7c3aed" fontFamily="var(--font-body)" fontWeight="bold">
              {liqLabel}
            </text>
            <text x={FC.x - FC.r - 12} y={FC.y + 24}
              textAnchor="end" fontSize={8} fill="#64748b" fontFamily="var(--font-body)">
              Round-bottom flask
            </text>
          </>}
        </g>
      )}

      {/* ── RUBBER STOPPER ────────────────────────────── */}
      {phase >= 1 && (
        <g>
          <path d={`M ${FC.x-18} 140 L ${FC.x-14} 148 L ${FC.x+14} 148 L ${FC.x+18} 140 Z`}
            fill="#78716c" stroke="#57534e" strokeWidth={1.5} />
          <rect x={FC.x-14} y={148} width={28} height={6} rx={2} fill="#a8a29e" />
          {phase >= 4 && <text x={FC.x - 24} y={134} textAnchor="end" fontSize={8}
            fill="#64748b" fontFamily="var(--font-body)">Stopper</text>}
        </g>
      )}

      {/* ── DELIVERY TUBE ─────────────────────────────── */}
      {phase >= 2 && (
        <g>
          {/* Horizontal glass tube from stopper to stand */}
          <rect x={FC.x+14} y={138} width={282-FC.x-14} height={13} rx={4}
            fill="url(#oa-glass)" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.6} />
          {/* Elbow */}
          <path d="M 280 138 Q 295 138 295 152" fill="none" stroke="#94a3b8" strokeWidth={13} strokeLinecap="round" />
          <path d="M 280 142 Q 291 142 291 152" fill="none" stroke="#e0f2fe" strokeWidth={7} strokeLinecap="round" opacity={0.4} />
          {/* Vertical segment down to trough */}
          <rect x={288} y={150} width={13} height={134} rx={4}
            fill="url(#oa-glass)" stroke="#94a3b8" strokeWidth={2} fillOpacity={0.6} />
          {/* Glass sheen */}
          <line x1={291} y1={152} x2={291} y2={282} stroke="#ffffff" strokeWidth={3}
            strokeLinecap="round" opacity={0.25} />

          {/* Rubber tubing from vertical tube into trough */}
          {phase >= 3 && (
            <path d="M 294 282 Q 294 295 310 295 Q 325 296 340 292 L 418 292"
              fill="none" stroke="#4b5563" strokeWidth={7} strokeLinecap="round" />
          )}

          {/* Gas-flow arrows */}
          {heating && <>
            {[0, 1, 2].map(i => (
              <motion.text key={i} x={210 + i * 28} y={148} fontSize={10}
                fill="#7c3aed" fillOpacity={0.8} fontFamily="sans-serif"
                animate={{ opacity: [0, 0.9, 0], x: [210+i*28, 222+i*28, 222+i*28] }}
                transition={{ duration: 1.2, delay: i * 0.35, repeat: Infinity }}
              >›</motion.text>
            ))}
            <motion.text x={295} y={230} fontSize={10} fill="#7c3aed" fillOpacity={0.8}
              fontFamily="sans-serif"
              animate={{ opacity: [0, 0.9, 0], y: [225, 255, 255] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >↓</motion.text>
          </>}

          {phase >= 4 && <text x={FC.x+14+40} y={130} textAnchor="middle" fontSize={8}
            fill="#64748b" fontFamily="var(--font-body)">Delivery tube</text>}
        </g>
      )}

      {/* ── PNEUMATIC TROUGH ──────────────────────────── */}
      {phase >= 3 && (
        <g>
          {/* Trough outer walls */}
          <rect x={308} y={270} width={222} height={108} rx={6}
            fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2.5} />
          {/* Water fill */}
          <rect x={311} y={283} width={216} height={92} rx={4}
            fill="url(#oa-water)" />
          {/* Water surface shimmer */}
          <motion.ellipse cx={420} cy={283} rx={106} ry={3}
            fill="#bae6fd" fillOpacity={0.65}
            animate={{ ry: [3, 5, 3] }} transition={{ duration: 2, repeat: Infinity }} />
          <text x={354} y={305} textAnchor="middle" fontSize={9}
            fill="#0369a1" fontFamily="var(--font-body)">Water</text>
          {phase >= 4 && <text x={420} y={392} textAnchor="middle" fontSize={9}
            fill="#64748b" fontFamily="var(--font-body)">Pneumatic Trough</text>}

          {/* ── INVERTED GAS JAR ─── */}
          <g clipPath="url(#oa-jar-clip)">
            {/* O₂ gas — fills from TOP of inverted jar downward */}
            {progress > 0.01 && (
              <motion.rect x={JAR_X} y={JAR_TOP}
                width={JAR_W} fill="url(#oa-gas)"
                animate={{ height: gasH }}
                initial={{ height: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
            {/* Water inside jar — fills remaining bottom */}
            <motion.rect x={JAR_X} width={JAR_W}
              fill="url(#oa-water)" fillOpacity={0.55}
              animate={{ y: waterTopY, height: Math.max(0, JAR_H - gasH) }}
              initial={{ y: JAR_TOP, height: JAR_H }}
              transition={{ duration: 0.8 }}
            />
            {/* Bubbles rising in jar */}
            {heating && progress < 0.98 && [0,1,2].map(i => (
              <motion.circle key={i} cx={JAR_X + 15 + i * 22} r={3 + i % 2}
                fill="#a7f3d0" fillOpacity={0.85}
                initial={{ cy: JAR_BOT - 8, opacity: 0 }}
                animate={{ cy: waterTopY + 12, opacity: [0, 0.85, 0] }}
                transition={{ duration: 1.6, delay: i * 0.45, repeat: Infinity }}
              />
            ))}
          </g>
          {/* Jar body outline */}
          <rect x={JAR_X} y={JAR_TOP} width={JAR_W} height={JAR_H} rx={4}
            fill="none" stroke="#94a3b8" strokeWidth={2.5} />
          {/* Jar closed bottom (top in SVG — the actual bottom of the inverted jar) */}
          <rect x={JAR_X - 6} y={JAR_TOP - 12} width={JAR_W + 12} height={16} rx={4}
            fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.5} />
          {/* Glass sheen */}
          <line x1={JAR_X + 8} y1={JAR_TOP + 12} x2={JAR_X + 8} y2={JAR_BOT - 20}
            stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.2} />
          {/* O₂ label inside jar */}
          {progress > 0.25 && (
            <motion.text x={JAR_X + JAR_W / 2} y={JAR_TOP + gasH / 2 + 8}
              textAnchor="middle" fontSize={13} fontWeight="700"
              fill="#059669" fontFamily="var(--font-heading)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              O₂
            </motion.text>
          )}
          {phase >= 4 && <text x={JAR_X + JAR_W / 2} y={JAR_TOP - 20}
            textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="var(--font-body)">
            Gas jar (inverted)
          </text>}
        </g>
      )}

      {/* ── Heat glow ── */}
      {heating && phase >= 1 && (
        <motion.circle cx={FC.x} cy={FC.y + 20} r={70}
          fill="#f97316" fillOpacity={0}
          animate={{ fillOpacity: [0, 0.05, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}

      {/* ── Title ── */}
      <text x={10} y={18} fontSize={10} fill="#334155"
        fontFamily="var(--font-heading)" fontWeight="bold">
        Laboratory Preparation of Oxygen
      </text>
    </svg>
  );
}

/* ── OxygenTestSVG ────────────────────────────────────────── */
/**
 * testType: 'splint' | 'charcoal' | 'magnesium'
 * relighting: show the relighting / burning result
 */
export function OxygenTestSVG({ testType = "splint", relighting = false }) {
  /* ── Shared gas jar ── */
  const Jar = ({ children }) => (
    <g>
      <rect x={70} y={38} width={100} height={210} rx={4}
        fill="#d1fae5" fillOpacity={0.5} stroke="#94a3b8" strokeWidth={2.5} />
      <rect x={66} y={28} width={108} height={16} rx={4}
        fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.5} />
      {/* Lid handle */}
      <rect x={104} y={12} width={32} height={18} rx={5}
        fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.2} />
      {/* Glass sheen */}
      <line x1={82} y1={50} x2={82} y2={230}
        stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.2} />
      {/* O₂ text inside */}
      <text x={120} y={165} textAnchor="middle" fontSize={24} fontWeight="700"
        fill="#059669" fontFamily="var(--font-heading)" opacity={0.5}>O₂</text>
      {children}
    </g>
  );

  /* ── GLOWING SPLINT TEST ── */
  if (testType === "splint") {
    return (
      <svg viewBox="0 0 240 310" className="w-full h-full max-h-[310px]">
        <defs>
          <radialGradient id="ot-glow" cx="50%" cy="70%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <filter id="ot-glow-f">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <Jar />

        {/* Wooden splint — diagonal */}
        <g transform="rotate(-18, 120, 90)">
          {/* Stick */}
          <rect x={116} y={-5} width={8} height={168} rx={2} fill="#d97706" />
          {/* Char at tip */}
          <rect x={115} y={156} width={10} height={10} rx={2} fill="#1c1917" />

          {!relighting && (
            /* Glowing ember */
            <>
              <motion.ellipse cx={120} cy={155} rx={9} ry={5.5}
                fill="#fbbf24" fillOpacity={0.9} filter="url(#ot-glow-f)"
                animate={{ rx: [9, 13, 9], fillOpacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.75, repeat: Infinity }} />
              <motion.ellipse cx={120} cy={155} rx={18} ry={10}
                fill="url(#ot-glow)" fillOpacity={0.4}
                animate={{ rx: [14, 22, 14] }}
                transition={{ duration: 0.75, repeat: Infinity }} />
            </>
          )}
          {relighting && (
            /* Relighted flame */
            <>
              <motion.path
                d={`M 120 155 Q 108 138 111 124 Q 120 128 120 132 Q 130 118 126 124 Q 130 136 120 155 Z`}
                fill="#fb923c"
                initial={{ scale: 0.3, opacity: 0, originX: "120px", originY: "155px" }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.path
                d={`M 120 152 Q 115 142 117 135 L 123 135 Q 125 142 120 152 Z`}
                fill="#fef3c7" fillOpacity={0.9}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              {/* Flash ring */}
              <motion.circle cx={120} cy={140} r={5}
                fill="#fef08a" fillOpacity={0}
                animate={{ r: [5, 30], fillOpacity: [0.5, 0] }}
                transition={{ duration: 0.4 }}
              />
            </>
          )}
        </g>

        {/* Result badge */}
        <AnimatePresence>
          {relighting && (
            <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={20} y={248} width={200} height={30} rx={8}
                fill="#d1fae5" stroke="#059669" strokeWidth={1.5} />
              <text x={120} y={267} textAnchor="middle" fontSize={11}
                fill="#065f46" fontWeight="bold" fontFamily="var(--font-heading)">
                ✓ Splint RELIGHTS — Oxygen confirmed!
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Labels */}
        <text x={120} y={290} textAnchor="middle" fontSize={11}
          fill="#334155" fontWeight="bold" fontFamily="var(--font-heading)">
          {relighting ? "Positive Test for O₂" : "Glowing Splint Test"}
        </text>
        {!relighting && (
          <text x={120} y={305} textAnchor="middle" fontSize={9}
            fill="#6b7280" fontFamily="var(--font-body)">
            Insert glowing (not burning) splint
          </text>
        )}
      </svg>
    );
  }

  /* ── BURNING CHARCOAL ── */
  if (testType === "charcoal") {
    return (
      <svg viewBox="0 0 240 300" className="w-full h-full max-h-[300px]">
        <Jar />
        {/* Tongs */}
        <line x1={100} y1={5}  x2={112} y2={148} stroke="#475569" strokeWidth={4} strokeLinecap="round" />
        <line x1={140} y1={5}  x2={128} y2={148} stroke="#475569" strokeWidth={4} strokeLinecap="round" />
        {/* Charcoal */}
        <ellipse cx={120} cy={152} rx={14} ry={9} fill="#1c1917" />
        <ellipse cx={120} cy={150} rx={11} ry={6} fill="#292524" />
        {relighting && (
          <>
            <motion.ellipse cx={120} cy={140} rx={12} ry={7}
              fill="#f97316" fillOpacity={0.9}
              animate={{ ry: [7, 11, 7] }} transition={{ duration: 0.45, repeat: Infinity }} />
            <motion.path
              d={`M 120 140 Q 106 118 110 104 Q 120 108 120 112 Q 130 98 126 104 Q 130 118 120 140 Z`}
              fill="#fbbf24"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            <text x={120} y={98} textAnchor="middle" fontSize={10}
              fill="#92400e" fontFamily="var(--font-heading)" fontWeight="bold">
              Burns brightly in O₂!
            </text>
          </>
        )}
        <text x={120} y={280} textAnchor="middle" fontSize={11}
          fill="#334155" fontWeight="bold" fontFamily="var(--font-heading)">
          {relighting ? "Vigorous combustion!" : "Burning Charcoal Test"}
        </text>
      </svg>
    );
  }

  /* ── BURNING MAGNESIUM ── */
  if (testType === "magnesium") {
    return (
      <svg viewBox="0 0 240 300" className="w-full h-full max-h-[300px]">
        <defs>
          <radialGradient id="ot-mg-flash" cx="50%" cy="50%">
            <stop offset="0%"   stopColor="#fef9c3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff"  stopOpacity="0" />
          </radialGradient>
        </defs>
        <Jar />
        {/* Tongs */}
        <line x1={100} y1={5}  x2={112} y2={140} stroke="#475569" strokeWidth={4} strokeLinecap="round" />
        <line x1={140} y1={5}  x2={128} y2={140} stroke="#475569" strokeWidth={4} strokeLinecap="round" />
        {/* Mg ribbon */}
        <path d="M 112 140 Q 120 130 128 140 L 128 158 Q 120 150 112 158 Z"
          fill="#d1d5db" stroke="#9ca3af" strokeWidth={1} />
        {relighting && (
          <>
            {/* Intense white flash */}
            <motion.circle cx={120} cy={135} r={15}
              fill="url(#ot-mg-flash)"
              animate={{ r: [15, 40, 15], fillOpacity: [0.8, 0, 0.8] }}
              transition={{ duration: 0.6, repeat: Infinity }} />
            <motion.ellipse cx={120} cy={138} rx={10} ry={6}
              fill="#ffffff"
              animate={{ rx: [10, 16, 10] }} transition={{ duration: 0.3, repeat: Infinity }} />
            <text x={120} y={100} textAnchor="middle" fontSize={10}
              fill="#78350f" fontFamily="var(--font-heading)" fontWeight="bold">
              Dazzling white flame!
            </text>
          </>
        )}
        <text x={120} y={280} textAnchor="middle" fontSize={11}
          fill="#334155" fontWeight="bold" fontFamily="var(--font-heading)">
          {relighting ? "Mg burns brilliantly in O₂!" : "Burning Magnesium Test"}
        </text>
      </svg>
    );
  }

  return null;
}
