import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Colour helpers ────────────────────────────────────────────────── */

export function getFlaskColor(neutralization, indicator, flash = 0) {
  if (indicator === "phenolphthalein") {
    if (neutralization >= 1.0) {
      const excess = Math.min((neutralization - 1.0) * 8, 1);
      return `rgba(255,${Math.round(130 - excess * 30)},${Math.round(170 - excess * 30)},0.7)`;
    }
    const baseA = 0.08 + neutralization * 0.12;
    const flashA = flash * 0.55;
    const g = Math.round(255 - flash * 100);
    const b = Math.round(255 - flash * 80);
    return `rgba(255,${g},${b},${Math.min(baseA + flashA, 0.65)})`;
  } else {
    // methyl orange: orange in acid → yellow in base
    if (neutralization >= 1.0) return `rgba(255,220,80,0.55)`;
    const g = Math.round(140 + neutralization * 70);
    return `rgba(255,${g},0,0.55)`;
  }
}

export function getPH(v, vEnd = 23.5) {
  if (v <= 0) return 1.0;
  const f = v / vEnd;
  if (f < 0.9) return 1.0 + f * 5.5;
  if (f < 1.0) return 6.5 + ((f - 0.9) / 0.1) * 1.5;
  return 8.0 + Math.min((f - 1.0) * 6, 4);
}

/* ─── Reusable: glass reflection ────────────────────────────────────── */
function GlassSheen({ x, y, w, h, rx = 3 }) {
  return (
    <rect x={x + 2} y={y + 3} width={w * 0.35} height={h - 6} rx={rx}
      fill="white" fillOpacity={0.18} />
  );
}

/* ─── Bubble inside flask ───────────────────────────────────────────── */
function Bubble({ cx, baseY, delay = 0 }) {
  return (
    <motion.circle cx={cx} r={2.5} fill="white" fillOpacity={0}
      initial={{ cy: baseY }}
      animate={{ cy: [baseY, baseY - 35], fillOpacity: [0, 0.35, 0] }}
      transition={{ duration: 1.4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ─── Swirl line ─────────────────────────────────────────────────────── */
function Swirl({ cx, cy, r = 14, delay = 0, opacity = 0.25 }) {
  return (
    <motion.circle cx={cx} cy={cy} r={r} fill="none"
      stroke="white" strokeWidth={1.5} strokeOpacity={opacity}
      animate={{ scale: [0.7, 1.2, 0.7], opacity: [opacity, 0, opacity] }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── SVG 0: Intro overview ─────────────────────────────────────────── */
export function TitrationIntroSVG() {
  return (
    <svg viewBox="0 0 320 290" className="w-full h-full">
      <defs>
        <linearGradient id="tiLabBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <linearGradient id="tiGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="tiEndpoint" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.4" />
        </radialGradient>
        <filter id="tiGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="tiFlaskClip">
          <path d="M148,145 L152,145 L165,175 Q198,188 198,222 Q198,238 160,238 Q122,238 122,222 Q122,188 135,175 Z" />
        </clipPath>
      </defs>

      {/* Lab bench */}
      <rect x="0" y="0" width="320" height="290" rx="12" fill="url(#tiLabBg)" />
      <rect x="0" y="252" width="320" height="38" rx="0" fill="#e2e8f0" />
      <rect x="0" y="248" width="320" height="6" rx="0" fill="#cbd5e1" />

      {/* Retort stand */}
      <rect x="30" y="30" width="6" height="220" rx="3" fill="#64748b" />
      <rect x="12" y="248" width="42" height="6" rx="3" fill="#475569" />
      {/* Clamp arm */}
      <rect x="36" y="60" width="60" height="6" rx="3" fill="#94a3b8" />
      <rect x="88" y="52" width="14" height="22" rx="4" fill="#64748b" />

      {/* ── Burette (intro overview) ── */}
      {(() => {
        const cx=103, bl=93, br=113, by=18, bbh=178, bscY=196, bscH=14, tapBot=222, tipBot=230;
        return (
          <g>
            {/* Tube body */}
            <path d={`M${bl},${by+5} Q${bl},${by} ${bl+5},${by} L${br-5},${by} Q${br},${by} ${br},${by+5} L${br},${bscY} L${bl},${bscY} Z`}
              fill="url(#tiGlass)" stroke="#7dd3fc" strokeWidth="1.5" />
            {/* Top elliptical rim */}
            <ellipse cx={cx} cy={by} rx={11} ry={3.5} fill="#dbeafe" fillOpacity={0.55} stroke="#7dd3fc" strokeWidth="1.2" />
            {/* Liquid */}
            <rect x={bl+1.5} y={by+2} width={br-bl-3} height={160} rx="2" fill="#bae6fd" fillOpacity={0.5} />
            {/* Liquid surface ellipse */}
            <ellipse cx={cx} cy={by+2} rx={9} ry={2.8} fill="#38bdf8" fillOpacity={0.6} />
            {/* Highlight */}
            <path d={`M${bl+2},${by+8} L${bl+2},${bscY-3}`} stroke="white" strokeWidth="2.5" strokeOpacity={0.18} strokeLinecap="round" />
            {/* Grad marks */}
            {[0,0.2,0.4,0.6,0.8,1].map((t,i) => (
              <g key={i}>
                <line x1={bl-7} y1={by+2+t*155} x2={bl-1} y2={by+2+t*155} stroke="#475569" strokeWidth={1.1} />
                <text x={bl-9} y={by+5+t*155} textAnchor="end" fontSize="6" fill="#64748b">{i*10}</text>
              </g>
            ))}
            {/* Stopcock barrel */}
            <path d={`M${bl},${bscY} Q${bl-7},${bscY} ${bl-8},${bscY+bscH/2} Q${bl-7},${bscY+bscH} ${bl},${bscY+bscH} L${br},${bscY+bscH} Q${br+7},${bscY+bscH} ${br+8},${bscY+bscH/2} Q${br+7},${bscY} ${br},${bscY} Z`}
              fill="#dbeafe" fillOpacity={0.85} stroke="#7dd3fc" strokeWidth="1.4" />
            {/* Key handles */}
            <rect x={bl-22} y={bscY+3} width={17} height={6} rx="3" fill="#64748b" />
            <rect x={br+5}  y={bscY+3} width={17} height={6} rx="3" fill="#64748b" />
            {/* Centre disk */}
            <circle cx={cx} cy={bscY+bscH/2} r={6.5} fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
            <circle cx={cx} cy={bscY+bscH/2} r={2.5} fill="#22c55e" />
            {/* Taper */}
            <path d={`M${bl+3},${bscY+bscH} L${cx-3},${tapBot} L${cx+3},${tapBot} L${br-3},${bscY+bscH} Z`}
              fill="#dbeafe" fillOpacity={0.75} stroke="#7dd3fc" strokeWidth="1.2" />
            {/* Fine tip */}
            <rect x={cx-3} y={tapBot} width={6} height={tipBot-tapBot} rx="3"
              fill="#bae6fd" fillOpacity={0.9} stroke="#38bdf8" strokeWidth="1" />
          </g>
        );
      })()}

      {/* Erlenmeyer flask */}
      <path d="M148,145 L152,145 L165,175 Q198,188 198,222 Q198,238 160,238 Q122,238 122,222 Q122,188 135,175 Z"
        fill="url(#tiGlass)" stroke="#7dd3fc" strokeWidth="1.5" />
      {/* Liquid in flask — endpoint pink */}
      <motion.path d="M148,145 L152,145 L165,175 Q198,188 198,222 Q198,238 160,238 Q122,238 122,222 Q122,188 135,175 Z"
        fill="url(#tiEndpoint)"
        animate={{ fillOpacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#tiGlow)"
      />
      {/* Flask neck */}
      <rect x="145" y="128" width="30" height="18" rx="3" fill="url(#tiGlass)" stroke="#7dd3fc" strokeWidth="1.5" />
      <GlassSheen x={145} y={128} w={30} h={18} />
      {/* Swirls in flask */}
      <Swirl cx={150} cy={212} r={18} opacity={0.3} />
      <Swirl cx={150} cy={212} r={10} delay={0.8} opacity={0.2} />

      {/* Endpoint label */}
      <motion.text x={160} y={200} fontSize="7.5" fontWeight="700" fill="#be185d"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
        Endpoint!
      </motion.text>

      {/* Dropper bottle (indicator) */}
      <rect x="218" y="80" width="32" height="80" rx="6" fill="#fef9c3" stroke="#fbbf24" strokeWidth="1.5" />
      <ellipse cx="234" cy="80" rx="16" ry="8" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.5" />
      <rect x="228" y="68" width="12" height="16" rx="4" fill="#f59e0b" />
      <text x="234" y="123" textAnchor="middle" fontSize="7" fontWeight="700" fill="#92400e">indicator</text>

      {/* Beaker */}
      <rect x="252" y="175" width="48" height="55" rx="4" fill="url(#tiGlass)" stroke="#7dd3fc" strokeWidth="1.5" />
      <rect x="255" y="205" width="42" height="25" rx="2" fill="#bae6fd" fillOpacity={0.4} />
      <text x="276" y="245" textAnchor="middle" fontSize="7" fill="#0369a1">NaOH</text>

      {/* pH readout */}
      <rect x="235" y="30" width="70" height="38" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
      <text x="270" y="46" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="monospace">pH</text>
      <motion.text x="270" y="62" textAnchor="middle" fontSize="14" fontWeight="700" fill="#4ade80" fontFamily="monospace"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
        7.00
      </motion.text>

      <text x="160" y="270" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0e7490" fontFamily="var(--font-heading)">
        Acid–Base Titration Lab
      </text>
    </svg>
  );
}

/* ─── SVG 1: Apparatus setup ────────────────────────────────────────── */
export function SetupSVG({ phase = 0 }) {
  // phase 0: clamp burette | 1: fill burette | 2: pipette into flask | 3: ready

  const labels = ["Clamp the burette to the stand", "Fill burette with NaOH", "Pipette 25 mL HCl into flask", "Apparatus ready!"];
  const phaseColors = ["#7dd3fc", "#bae6fd", "#86efac", "#4ade80"];

  return (
    <svg viewBox="0 0 280 300" className="w-full h-full">
      <defs>
        <linearGradient id="setupBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" /><stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="setupGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.7" /><stop offset="100%" stopColor="#bae6fd" stopOpacity="0.3" />
        </linearGradient>
        <clipPath id="setupBuretteLiqClip">
          <rect x="116" y="25" width="18" height="175" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="280" height="300" rx="12" fill="url(#setupBg)" />
      <rect x="0" y="264" width="280" height="36" fill="#e2e8f0" />
      <rect x="0" y="260" width="280" height="6" fill="#cbd5e1" />

      {/* Stand */}
      <rect x="28" y="28" width="6" height="234" rx="3" fill="#64748b" />
      <rect x="12" y="258" width="44" height="6" rx="3" fill="#475569" />

      {/* Clamp arm — appears at phase >= 0 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: phase >= 0 ? 1 : 0, x: phase >= 0 ? 0 : -10 }}
        transition={{ duration: 0.5 }}>
        <rect x="34" y="58" width="80" height="7" rx="3.5" fill="#94a3b8" />
        <rect x="106" y="50" width="16" height="22" rx="5" fill="#64748b" />
      </motion.g>

      {/* Burette */}
      <motion.g initial={{ opacity: 0, y: -15 }} animate={{ opacity: phase >= 0 ? 1 : 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        {/* ── Realistic burette (setup SVG) ── */}
        {(() => {
          const cx=125, bl=113, br=139, by=20, bbh=183, bscY=203, bscH=15, tapBot=228, tipBot=238;
          const sc = phaseColors[phase];
          const sw = phase === 3 ? 2 : 1.5;
          return (
            <g>
              {/* Tube body */}
              <path d={`M${bl},${by+6} Q${bl},${by} ${bl+6},${by} L${br-6},${by} Q${br},${by} ${br},${by+6} L${br},${bscY} L${bl},${bscY} Z`}
                fill="url(#setupGlass)" stroke={sc} strokeWidth={sw} />
              {/* Top rim */}
              <ellipse cx={cx} cy={by} rx={13} ry={4} fill="#dbeafe" fillOpacity={0.5} stroke={sc} strokeWidth={sw*0.8} />
              <ellipse cx={cx} cy={by} rx={9.5} ry={2.8} fill="#0ea5e9" fillOpacity={0.15} />
              {/* Liquid fill (phase ≥ 1) */}
              {phase >= 1 && (
                <motion.rect x={bl+2} y={by+2} width={br-bl-4}
                  fill="#bae6fd" fillOpacity={0.55} rx="2"
                  initial={{ height: 0 }} animate={{ height: bbh - 4 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}
              {/* Liquid surface ellipse */}
              {phase >= 1 && (
                <motion.ellipse cx={cx} rx={10} ry={3}
                  fill="#38bdf8" fillOpacity={0.65}
                  initial={{ cy: by + 2 }} animate={{ cy: by + 2 + (bbh - 4) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              )}
              {/* Glass highlight */}
              <path d={`M${bl+2},${by+8} L${bl+2},${bscY-3}`} stroke="white" strokeWidth="3" strokeOpacity={0.18} strokeLinecap="round" />
              {/* Graduation marks */}
              {[0,0.25,0.5,0.75,1].map((t,i) => (
                <g key={i}>
                  <line x1={bl-8} y1={by+2+t*(bbh-4)} x2={bl-1} y2={by+2+t*(bbh-4)} stroke="#475569" strokeWidth={1.1} />
                  <text x={bl-10} y={by+5+t*(bbh-4)} textAnchor="end" fontSize="6" fill="#64748b">{i*12}</text>
                </g>
              ))}
              {/* Stopcock barrel */}
              <path d={`M${bl},${bscY} Q${bl-8},${bscY} ${bl-9},${bscY+bscH/2} Q${bl-8},${bscY+bscH} ${bl},${bscY+bscH} L${br},${bscY+bscH} Q${br+8},${bscY+bscH} ${br+9},${bscY+bscH/2} Q${br+8},${bscY} ${br},${bscY} Z`}
                fill="#dbeafe" fillOpacity={0.88} stroke={sc} strokeWidth={sw} />
              {/* Key handles */}
              <rect x={bl-26} y={bscY+4} width={20} height={7} rx="3.5" fill="#64748b" />
              <rect x={br+6}  y={bscY+4} width={20} height={7} rx="3.5" fill="#64748b" />
              {/* Centre disk */}
              <circle cx={cx} cy={bscY+bscH/2} r={7.5} fill="#94a3b8" stroke="#64748b" strokeWidth="1.1" />
              <circle cx={cx} cy={bscY+bscH/2} r={3}   fill="#22c55e" />
              {/* Taper */}
              <path d={`M${bl+4},${bscY+bscH} L${cx-3.5},${tapBot} L${cx+3.5},${tapBot} L${br-4},${bscY+bscH} Z`}
                fill="#dbeafe" fillOpacity={0.78} stroke={sc} strokeWidth={sw*0.85} />
              {/* Fine tip */}
              <rect x={cx-3.5} y={tapBot} width={7} height={tipBot-tapBot} rx="3.5"
                fill="#bae6fd" fillOpacity={0.92} stroke="#38bdf8" strokeWidth="1" />
            </g>
          );
        })()}
      </motion.g>

      {/* Pipette (visible at phase >= 2) */}
      {phase >= 2 && (
        <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <rect x="165" y="55" width="12" height="100" rx="4" fill="url(#setupGlass)" stroke="#86efac" strokeWidth="1.5" />
          <GlassSheen x={165} y={55} w={12} h={100} />
          <ellipse cx="171" cy="55" rx="10" ry="7" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
          <line x1="171" y1="155" x2="171" y2="180" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
          {/* Liquid in pipette */}
          <rect x="167" y="57" width="8" height="70" rx="2" fill="#86efac" fillOpacity={0.45} />
          <text x="171" y="200" textAnchor="middle" fontSize="7" fill="#15803d" fontWeight="700">25 mL</text>
        </motion.g>
      )}

      {/* Flask */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: phase >= 0 ? 1 : 0, scale: 1 }}
        style={{ transformOrigin: "170px 260px" }} transition={{ duration: 0.5, delay: 0.3 }}>
        <path d="M155,218 L168,218 L182,250 Q208,264 208,286 Q208,296 170,296 Q132,296 132,286 Q132,264 158,250 Z"
          fill="url(#setupGlass)" stroke={phaseColors[phase]} strokeWidth="1.5" />
        {/* HCl liquid in flask (from phase 2) */}
        {phase >= 2 && (
          <motion.path d="M155,218 L168,218 L182,250 Q208,264 208,286 Q208,296 170,296 Q132,296 132,286 Q132,264 158,250 Z"
            fill="#86efac" fillOpacity={0}
            animate={{ fillOpacity: [0, 0.3] }} transition={{ duration: 1 }}
          />
        )}
        <rect x="155" y="200" width="30" height="20" rx="3" fill="url(#setupGlass)" stroke={phaseColors[phase]} strokeWidth="1.5" />
        <GlassSheen x={155} y={200} w={30} h={20} />
      </motion.g>

      {/* Filling animation — NaOH pouring into burette */}
      {phase === 1 && (
        <motion.rect x="119" y="22" width="12" height={0}
          fill="#7dd3fc" fillOpacity={0.6}
          animate={{ height: [0, 165] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      )}

      {/* Phase label */}
      <motion.rect x="40" y="20" width="66" height="24" rx="8" fill={phaseColors[phase]} fillOpacity={0.25}
        stroke={phaseColors[phase]} strokeWidth="1"
        key={phase} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
      />
      <text x="73" y="35" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#0e7490">{`Step ${phase + 1}/4`}</text>

      <text x="140" y="275" textAnchor="middle" fontSize="9" fontWeight="600" fill="#0369a1" fontFamily="var(--font-heading)">
        {labels[phase]}
      </text>
    </svg>
  );
}

/* ─── SVG 2: Indicator drop ─────────────────────────────────────────── */
export function IndicatorDropSVG({ dropped = false, indicator = "phenolphthalein" }) {
  const indicatorColor = indicator === "phenolphthalein" ? "#fce7f3" : "#fde68a";
  const dropColor = indicator === "phenolphthalein" ? "#ec4899" : "#f59e0b";
  const flaskColor = dropped
    ? indicator === "phenolphthalein" ? "rgba(252,231,243,0.35)" : "rgba(253,230,138,0.35)"
    : "rgba(220,252,231,0.3)";

  return (
    <svg viewBox="0 0 260 310" className="w-full h-full">
      <defs>
        <linearGradient id="indGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.25" />
        </linearGradient>
        <clipPath id="indFlaskClip">
          <path d="M104,188 L124,188 L144,225 Q180,240 180,272 Q180,288 130,288 Q80,288 80,272 Q80,240 116,225 Z" />
        </clipPath>
      </defs>

      {/* Indicator bottle */}
      <rect x="152" y="55" width="50" height="105" rx="8" fill={indicatorColor} stroke={dropColor} strokeWidth="1.8" />
      <GlassSheen x={152} y={55} w={50} h={105} />
      <ellipse cx="177" cy="55" rx="25" ry="14" fill={indicatorColor} stroke={dropColor} strokeWidth="1.8" />
      <rect x="168" y="36" width="18" height="24" rx="6" fill={dropColor} fillOpacity={0.8} />
      <text x="177" y="112" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">Indicator</text>
      <text x="177" y="124" textAnchor="middle" fontSize="7" fill="#78350f">
        {indicator === "phenolphthalein" ? "phenolphthalein" : "methyl orange"}
      </text>

      {/* Tilted bottle */}
      {dropped && (
        <motion.g initial={{ rotate: 0, x: 0, y: 0 }} animate={{ rotate: -35, x: -22, y: -12 }}
          style={{ transformOrigin: "177px 100px" }} transition={{ duration: 0.5, type: "spring" }}>
          <rect x="152" y="55" width="50" height="105" rx="8" fill={indicatorColor} stroke={dropColor} strokeWidth="1.8" />
          <text x="177" y="112" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">Indicator</text>
        </motion.g>
      )}

      {/* Drops falling */}
      {dropped && [0, 1, 2].map((i) => (
        <motion.circle key={i} cx={130} r={4} fill={dropColor} fillOpacity={0.85}
          initial={{ cy: 100, opacity: 0 }}
          animate={{ cy: [100, 170, 190], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.8, delay: i * 0.3, repeat: 2 }}
        />
      ))}

      {/* Flask */}
      <path d="M104,188 L124,188 L144,225 Q180,240 180,272 Q180,288 130,288 Q80,288 80,272 Q80,240 116,225 Z"
        fill="url(#indGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <rect x="104" y="170" width="42" height="20" rx="4" fill="url(#indGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <GlassSheen x={104} y={170} w={42} h={20} />

      {/* HCl liquid */}
      <g clipPath="url(#indFlaskClip)">
        <motion.rect x="80" width="100" fill={flaskColor}
          animate={{ y: dropped ? [400, 238] : [400, 258] }}
          initial={{ y: 400 }}
          transition={{ duration: 0.8 }}
          height="150"
        />
        {dropped && (
          <>
            {/* Color swirl effect */}
            <motion.circle cx={130} cy={265} r={0} fill={dropColor} fillOpacity={0.35}
              animate={{ r: [0, 40], fillOpacity: [0.45, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <Swirl cx={130} cy={265} r={20} opacity={0.25} />
          </>
        )}
      </g>

      {dropped && (
        <motion.text x={130} y={305} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#0369a1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          Indicator added — ready to titrate!
        </motion.text>
      )}
    </svg>
  );
}

/* ─── SVG 3: Main titration apparatus ───────────────────────────────── */
export function TitrationViewSVG({
  neutralization = 0,
  dropKey = 0,
  volumeAdded = 0,
  flashIntensity = 0,
  indicator = "phenolphthalein",
  endpointReached = false,
}) {
  const buretteFull = 50; // mL
  const remaining = Math.max(0, buretteFull - volumeAdded);
  const liquidFrac = remaining / buretteFull;

  // ── Burette anatomy ───────────────────────────────────────────────
  const BCX     = 150;              // center x — aligned over flask neck
  const BL      = 133;              // tube left edge
  const BR      = 167;              // tube right edge
  const BW      = BR - BL;         // 34 px tube width
  const BY      = 12;              // top of tube
  const BBH     = 190;             // tube body height → tube bottom y = 202
  const BSC_Y   = BY + BBH;        // 202 — stopcock housing top
  const BSC_H   = 18;              // stopcock housing height
  const BTAPER_Y   = BSC_Y + BSC_H;  // 220 — top of glass taper
  const BTAPER_BOT = 237;           // bottom of taper
  const BTIP_BOT   = 247;           // fine tip end (just above flask neck)

  const liquidH        = liquidFrac * (BBH - 4);
  const liquidSurfaceY = BY + 2 + liquidH;

  // Flask clip path
  const FLASK_PATH = "M138,258 L162,258 L180,296 Q218,312 218,352 Q218,370 150,370 Q82,370 82,352 Q82,312 120,296 Z";
  const NECK_PATH = "M136,238 L164,238 L164,260 L136,260 Z";

  const flaskColor = getFlaskColor(neutralization, indicator, flashIntensity);

  return (
    <svg viewBox="0 0 300 388" className="w-full h-full">
      <defs>
        <linearGradient id="tvGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="tvBuretteGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0f9ff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="tvLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id="tvFlaskClip">
          <path d={FLASK_PATH} />
        </clipPath>
        <clipPath id="tvNeckClip">
          <rect x={BX - 2} y={BY - 2} width={BW + 4} height={BH + 4} />
        </clipPath>
        <filter id="tvEndpointGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tvDropGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Lab bench */}
      <rect x="0" y="370" width="300" height="18" rx="0" fill="#e2e8f0" />
      <rect x="0" y="366" width="300" height="6" fill="#cbd5e1" />

      {/* Retort stand */}
      <rect x="32" y="18" width="7" height="348" rx="3.5" fill="#475569" />
      <rect x="14" y="366" width="44" height="6" rx="3" fill="#334155" />
      {/* Clamp arm — extends from stand to burette */}
      <rect x="39" y="52" width={BL - 12 - 39} height="8" rx="4" fill="#64748b" />
      {/* Clamp block gripping left side of burette */}
      <rect x={BL - 13} y="44" width="14" height="26" rx="4" fill="#475569" />
      <rect x={BL - 13} y="50" width="14" height="12" rx="2" fill="#334155" fillOpacity={0.5} />

      {/* ── BURETTE BODY ─────────────────────────────────────────── */}

      {/* Glass tube — slightly rounded top corners */}
      <path d={`M${BL},${BY+7} Q${BL},${BY} ${BL+7},${BY} L${BR-7},${BY} Q${BR},${BY} ${BR},${BY+7} L${BR},${BSC_Y} L${BL},${BSC_Y} Z`}
        fill="url(#tvBuretteGlass)" stroke="#7dd3fc" strokeWidth="1.8" />

      {/* Top elliptical rim — 3-D perspective */}
      <ellipse cx={BCX} cy={BY} rx={17} ry={5.5}
        fill="#dbeafe" fillOpacity={0.5} stroke="#7dd3fc" strokeWidth="1.5" />
      <ellipse cx={BCX} cy={BY} rx={12.5} ry={3.8}
        fill="#0ea5e9" fillOpacity={0.15} />

      {/* NaOH liquid column */}
      <motion.rect x={BL + 2} y={BY + 2} width={BW - 4}
        fill="url(#tvLiquid)" rx="2"
        animate={{ height: liquidH }}
        transition={{ duration: 0.4 }}
      />
      {/* Liquid surface — 3-D ellipse */}
      <motion.ellipse cx={BCX} rx={14} ry={4}
        fill="#38bdf8" fillOpacity={0.65}
        animate={{ cy: liquidSurfaceY }}
        transition={{ duration: 0.4 }}
      />

      {/* Glass highlight stripe */}
      <path d={`M${BL+3},${BY+10} L${BL+3},${BSC_Y-4}`}
        stroke="white" strokeWidth="4" strokeOpacity={0.15} strokeLinecap="round" />
      <path d={`M${BL+5},${BY+10} L${BL+5},${BSC_Y-4}`}
        stroke="white" strokeWidth="1.5" strokeOpacity={0.18} strokeLinecap="round" />

      {/* Graduation marks — major every 10 mL, minor every 2 mL */}
      {Array.from({ length: 26 }, (_, i) => i * 2).map((vol) => {
        const isMajor = vol % 10 === 0;
        const gy = BY + 2 + (vol / 50) * (BBH - 4);
        return (
          <g key={vol}>
            <line
              x1={BL - (isMajor ? 10 : 5)} y1={gy}
              x2={BL - 1}                  y2={gy}
              stroke={isMajor ? "#334155" : "#94a3b8"}
              strokeWidth={isMajor ? 1.3 : 0.7}
            />
            {isMajor && (
              <text x={BL - 13} y={gy + 3} textAnchor="end"
                fontSize="7" fill="#475569" fontFamily="monospace">{vol}</text>
            )}
          </g>
        );
      })}

      {/* ── STOPCOCK HOUSING ─────────────────────────────────────── */}

      {/* Barrel-shaped glass housing (wider than tube on both sides) */}
      <path d={`
        M${BL},${BSC_Y}
        Q${BL-10},${BSC_Y}   ${BL-11},${BSC_Y + BSC_H/2}
        Q${BL-10},${BSC_Y+BSC_H} ${BL},${BSC_Y+BSC_H}
        L${BR},${BSC_Y+BSC_H}
        Q${BR+10},${BSC_Y+BSC_H} ${BR+11},${BSC_Y + BSC_H/2}
        Q${BR+10},${BSC_Y}   ${BR},${BSC_Y}
        Z`}
        fill="#dbeafe" fillOpacity={0.85} stroke="#7dd3fc" strokeWidth="1.8" />
      {/* Shine on housing */}
      <ellipse cx={BCX - 5} cy={BSC_Y + 5} rx={5} ry={2.5}
        fill="white" fillOpacity={0.28} />

      {/* PTFE key handle — left bar */}
      <rect x={BL - 38} y={BSC_Y + 5} width={30} height={8} rx="4"
        fill="#64748b" stroke="#475569" strokeWidth="0.8" />
      {/* PTFE key handle — right bar */}
      <rect x={BR + 8}  y={BSC_Y + 5} width={30} height={8} rx="4"
        fill="#64748b" stroke="#475569" strokeWidth="0.8" />
      {/* Centre disk (the rotating plug) */}
      <circle cx={BCX} cy={BSC_Y + BSC_H/2} r={9.5}
        fill="#94a3b8" stroke="#64748b" strokeWidth="1.2" />
      {/* Bore indicator — green = open */}
      <circle cx={BCX} cy={BSC_Y + BSC_H/2} r={3.5} fill="#22c55e" />
      <circle cx={BCX} cy={BSC_Y + BSC_H/2} r={1.5} fill="#16a34a" />

      {/* ── TAPERED TIP SECTION ──────────────────────────────────── */}

      {/* Glass taper — symmetric trapezoid */}
      <path d={`M${BL+5},${BTAPER_Y} L${BCX-4},${BTAPER_BOT} L${BCX+4},${BTAPER_BOT} L${BR-5},${BTAPER_Y} Z`}
        fill="#dbeafe" fillOpacity={0.78} stroke="#7dd3fc" strokeWidth="1.5" />
      {/* Taper highlight */}
      <path d={`M${BL+6},${BTAPER_Y} L${BCX-5},${BTAPER_BOT}`}
        stroke="white" strokeWidth="1.5" strokeOpacity={0.22} strokeLinecap="round" />

      {/* Fine glass tip */}
      <rect x={BCX - 4} y={BTAPER_BOT} width={8} height={BTIP_BOT - BTAPER_BOT} rx="4"
        fill="#bae6fd" fillOpacity={0.92} stroke="#38bdf8" strokeWidth="1.2" />
      {/* Tip highlight */}
      <line x1={BCX - 2} y1={BTAPER_BOT + 2} x2={BCX - 2} y2={BTIP_BOT - 2}
        stroke="white" strokeWidth="1" strokeOpacity={0.3} strokeLinecap="round" />

      {/* Animated Drop — falls from fine tip into flask */}
      <AnimatePresence>
        <motion.g key={dropKey}>
          <motion.ellipse cx={BCX} rx={5} ry={7} fill="#7dd3fc" fillOpacity={0.9}
            filter="url(#tvDropGlow)"
            initial={{ cy: BTIP_BOT + 1, scaleX: 1, scaleY: 1, opacity: 0 }}
            animate={{
              cy: [BTIP_BOT + 1, BTIP_BOT + 18, 258],
              scaleX: [1, 0.7, 1],
              scaleY: [1, 1.6, 0.6],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.75, ease: "easeIn", times: [0, 0.15, 0.9, 1] }}
          />
        </motion.g>
      </AnimatePresence>

      {/* Ripple in flask on drop */}
      <AnimatePresence>
        <motion.ellipse key={`r-${dropKey}`} cx={150} ry={3} fill="none"
          stroke="#7dd3fc" strokeWidth="1.5"
          initial={{ cx: 150, cy: 305, rx: 0, opacity: 0.8 }}
          animate={{ rx: [0, 28], opacity: [0.7, 0] }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
      </AnimatePresence>

      {/* Flask neck */}
      <path d={NECK_PATH} fill="url(#tvGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <GlassSheen x={136} y={238} w={28} h={22} />

      {/* Flask body */}
      <path d={FLASK_PATH} fill="url(#tvGlass)" stroke="#7dd3fc" strokeWidth="1.8" />
      <GlassSheen x={82} y={258} w={136} h={112} rx={20} />

      {/* Liquid in flask */}
      <g clipPath="url(#tvFlaskClip)">
        <motion.rect x={82} width={136} height={370}
          animate={{ y: neutralization > 0 ? 282 : 310, fill: flaskColor }}
          transition={{ duration: 0.4 }}
        />

        {/* Flash ring */}
        {flashIntensity > 0.05 && (
          <motion.circle cx={150} cy={335}
            fill="white" fillOpacity={0}
            animate={{ r: [0, 50], fillOpacity: [flashIntensity * 0.25, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}

        {/* Swirls */}
        <Swirl cx={148} cy={338} r={22} opacity={0.2} />
        <Swirl cx={148} cy={338} r={12} delay={0.7} opacity={0.15} />

        {/* Bubbles */}
        {[115, 140, 165].map((cx, i) => (
          <Bubble key={i} cx={cx} baseY={360} delay={i * 0.4} />
        ))}
      </g>

      {/* Endpoint glow */}
      {endpointReached && (
        <motion.path d={FLASK_PATH}
          fill="rgba(249,168,212,0.3)"
          stroke="#f472b6" strokeWidth="2.5"
          filter="url(#tvEndpointGlow)"
          animate={{ stroke: ["#f472b6", "#db2777", "#f472b6"] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Volume readout */}
      <rect x="196" y="100" width="92" height="80" rx="10" fill="#0f172a" fillOpacity={0.92} stroke="#1e293b" strokeWidth="1" />
      <text x="242" y="120" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="monospace">BURETTE</text>
      <motion.text x="242" y="142" textAnchor="middle" fontSize="15" fontWeight="700" fill="#38bdf8" fontFamily="monospace"
        animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 1.5, repeat: Infinity }}>
        {remaining.toFixed(2)}
      </motion.text>
      <text x="242" y="157" textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="monospace">mL remaining</text>

      <line x1="200" y1="164" x2="284" y2="164" stroke="#1e293b" strokeWidth="1" />
      <text x="242" y="176" textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontFamily="monospace">
        vol added: {volumeAdded.toFixed(2)} mL
      </text>

      {/* pH indicator badge */}
      <rect x="196" y="190" width="92" height="42" rx="10" fill="#0f172a" fillOpacity={0.92} />
      <text x="242" y="207" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="monospace">pH</text>
      <motion.text x="242" y="226" textAnchor="middle" fontSize="16" fontWeight="700" fontFamily="monospace"
        animate={{ fill: endpointReached ? "#4ade80" : getPH(volumeAdded) < 4 ? "#f87171" : "#fbbf24" }}>
        {getPH(volumeAdded).toFixed(2)}
      </motion.text>

      {/* Endpoint badge */}
      {endpointReached && (
        <motion.g initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ transformOrigin: "150px 380px" }}>
          <rect x="72" y="375" width="156" height="24" rx="10" fill="#db2777" />
          <text x="150" y="391" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="var(--font-heading)">
            ✦ ENDPOINT REACHED ✦
          </text>
        </motion.g>
      )}
    </svg>
  );
}

/* ─── SVG 4: Molecular particle view ───────────────────────────────── */
const POSITIONS = [
  [30,30],[70,22],[110,35],[145,28],[175,38],[210,25],
  [20,65],[55,72],[90,60],[128,68],[162,58],[196,70],[228,58],
  [35,100],[72,108],[108,98],[143,104],[178,92],[215,100],
  [48,135],[85,140],[120,130],[155,138],[188,130],[220,140],
];

export function MolecularSVG({ neutralization = 0 }) {
  const n = neutralization;
  const totalPositions = POSITIONS.length; // 24
  const acidCount = Math.max(0, Math.round((1 - Math.min(n, 1)) * 12));
  const baseCount = Math.min(12, Math.round(n * 12));
  const waterCount = Math.min(Math.round(n * 10), 10);

  // Assign particle types to positions
  const particles = POSITIONS.map((_, i) => {
    if (i < acidCount) return "acid";
    if (i < acidCount + baseCount) return "base";
    if (i < acidCount + baseCount + waterCount) return "water";
    return "none";
  });

  const colors = { acid: "#f87171", base: "#60a5fa", water: "#7dd3fc", none: "transparent" };
  const labels = { acid: "H⁺", base: "OH⁻", water: "H₂O", none: "" };
  const strokes = { acid: "#ef4444", base: "#3b82f6", water: "#38bdf8", none: "transparent" };

  return (
    <svg viewBox="0 0 260 168" className="w-full h-full">
      <defs>
        <radialGradient id="molBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" stopOpacity="1" />
        </radialGradient>
        <filter id="molGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="260" height="168" rx="10" fill="url(#molBg)" />
      <text x="130" y="14" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">
        MOLECULAR VIEW
      </text>

      {POSITIONS.map(([px, py], i) => {
        const type = particles[i];
        if (type === "none") return null;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: "spring" }}
          >
            <motion.circle cx={px} cy={py + 18} r={8}
              fill={colors[type]} fillOpacity={0.85}
              stroke={strokes[type]} strokeWidth="1"
              filter="url(#molGlow)"
              animate={{
                cx: [px, px + (Math.sin(i * 1.3) * 5), px],
                cy: [py + 18, py + 18 + (Math.cos(i * 0.9) * 4), py + 18],
              }}
              transition={{ duration: 2 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
            />
            <text x={px} y={py + 22} textAnchor="middle" fontSize="5.5" fontWeight="700" fill="white">
              {labels[type]}
            </text>
          </motion.g>
        );
      })}

      {/* Collision sparks near endpoint */}
      {n > 0.8 && n < 1.05 && [0, 1, 2].map((i) => (
        <motion.circle key={`s-${i}`}
          cx={80 + i * 50} cy={90}
          r={3} fill="#fbbf24" fillOpacity={0}
          animate={{ r: [2, 8], fillOpacity: [0, 0.7, 0] }}
          transition={{ duration: 0.8, delay: i * 0.3, repeat: Infinity }}
          filter="url(#molGlow)"
        />
      ))}

      {/* Legend */}
      {[
        { c: "#f87171", label: `H⁺ (acid) ×${acidCount}` },
        { c: "#60a5fa", label: `OH⁻ (base) ×${baseCount}` },
        { c: "#7dd3fc", label: `H₂O ×${waterCount}` },
      ].map(({ c, label }, i) => (
        <g key={i}>
          <circle cx={16} cy={152 - (2 - i) * 12} r={4} fill={c} />
          <text x={24} y={155 - (2 - i) * 12} fontSize="7.5" fill="#94a3b8">{label}</text>
        </g>
      ))}

      {/* Equation */}
      <text x="210" y="155" textAnchor="middle" fontSize="7" fill="#475569">H⁺ + OH⁻ → H₂O</text>
    </svg>
  );
}

/* ─── SVG 5: pH Curve graph ─────────────────────────────────────────── */
export function PHCurveSVG({ dataPoints = [], endpointV = 23.5, currentV = 0 }) {
  const W = 240, H = 140;
  const PAD = { l: 36, r: 16, t: 16, b: 30 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const maxV = 30;
  const minPH = 0, maxPH = 14;

  const toX = (v) => PAD.l + (v / maxV) * plotW;
  const toY = (ph) => PAD.t + plotH - ((ph - minPH) / (maxPH - minPH)) * plotH;

  const points = dataPoints.map(({ v, pH }) => `${toX(v)},${toY(pH)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="phBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} rx="10" fill="url(#phBg)" />
      <text x={W / 2} y="12" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">
        pH CURVE
      </text>

      {/* Grid lines */}
      {[2, 4, 6, 7, 8, 10, 12].map((ph) => (
        <g key={ph}>
          <line x1={PAD.l} y1={toY(ph)} x2={PAD.l + plotW} y2={toY(ph)}
            stroke={ph === 7 ? "#4ade80" : "#1e293b"} strokeWidth={ph === 7 ? 1.2 : 0.8}
            strokeDasharray={ph === 7 ? "4 3" : "none"}
          />
          <text x={PAD.l - 4} y={toY(ph) + 3} textAnchor="end" fontSize="6.5" fill={ph === 7 ? "#4ade80" : "#475569"}
            fontFamily="monospace">{ph}</text>
        </g>
      ))}
      {/* Axes */}
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH} stroke="#334155" strokeWidth="1.5" />
      <line x1={PAD.l} y1={PAD.t + plotH} x2={PAD.l + plotW} y2={PAD.t + plotH} stroke="#334155" strokeWidth="1.5" />

      {/* X axis labels */}
      {[0, 10, 20, 30].map((v) => (
        <text key={v} x={toX(v)} y={PAD.t + plotH + 12} textAnchor="middle" fontSize="6.5" fill="#475569" fontFamily="monospace">{v}</text>
      ))}
      <text x={PAD.l + plotW / 2} y={H - 2} textAnchor="middle" fontSize="7" fill="#64748b">Volume NaOH (mL)</text>
      <text x="8" y={PAD.t + plotH / 2} textAnchor="middle" fontSize="7" fill="#64748b"
        transform={`rotate(-90, 8, ${PAD.t + plotH / 2})`}>pH</text>

      {/* Endpoint vertical line */}
      <line x1={toX(endpointV)} y1={PAD.t} x2={toX(endpointV)} y2={PAD.t + plotH}
        stroke="#db2777" strokeWidth="1" strokeDasharray="3 3" />
      <text x={toX(endpointV) + 2} y={PAD.t + 8} fontSize="6" fill="#db2777">EP</text>

      {/* pH curve polyline */}
      {points.length > 1 && (
        <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* Current point marker */}
      {currentV > 0 && (
        <motion.circle
          cx={toX(currentV)} cy={toY(getPH(currentV))} r={4}
          fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"
          animate={{ r: [3.5, 5, 3.5] }} transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

/* ─── SVG 6: Endpoint celebration ───────────────────────────────────── */
export function EndpointSVG({ concentration = 0 }) {
  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <radialGradient id="epBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="100%" stopColor="#fce7f3" stopOpacity="0.6" />
        </radialGradient>
        <filter id="epGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="300" height="280" rx="14" fill="url(#epBg)" />

      {/* Confetti-style particles */}
      {[[40,40],[260,35],[80,80],[220,75],[150,30],[50,130],[250,120]].map(([px, py], i) => (
        <motion.circle key={i} cx={px} cy={py} r={4}
          fill={["#f472b6","#818cf8","#34d399","#fbbf24","#60a5fa"][i % 5]}
          animate={{ cy: [py, py + 20, py], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Flask with pink endpoint color */}
      <path d="M118,100 L132,100 L152,140 Q190,155 190,188 Q190,204 150,204 Q110,204 110,188 Q110,155 148,140 Z"
        fill="rgba(249,168,212,0.7)" stroke="#f472b6" strokeWidth="2"
        filter="url(#epGlow)"
      />
      <path d="M118,85 L132,85 L132,102 L118,102 Z" fill="rgba(249,168,212,0.4)" stroke="#f472b6" strokeWidth="1.8" />
      <Swirl cx={150} cy={184} r={18} opacity={0.4} />

      {/* ✓ badge */}
      <motion.circle cx={150} cy={150} r={0} fill="#db2777" fillOpacity={0}
        animate={{ r: [0, 50], fillOpacity: [0, 0.12, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <motion.text x={150} y={158} textAnchor="middle" fontSize="36"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
        🎯
      </motion.text>

      <text x="150" y="225" textAnchor="middle" fontSize="15" fontWeight="800" fill="#be185d" fontFamily="var(--font-heading)">
        ENDPOINT REACHED!
      </text>
      <text x="150" y="243" textAnchor="middle" fontSize="9.5" fill="#6b7280">
        The solution turned permanently pale pink.
      </text>

      {concentration > 0 && (
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <rect x="60" y="252" width="180" height="24" rx="10" fill="#db2777" fillOpacity={0.15} stroke="#db2777" strokeWidth="1" />
          <text x="150" y="268" textAnchor="middle" fontSize="10" fontWeight="700" fill="#be185d">
            [HCl] = {concentration.toFixed(3)} mol L⁻¹
          </text>
        </motion.g>
      )}
    </svg>
  );
}
