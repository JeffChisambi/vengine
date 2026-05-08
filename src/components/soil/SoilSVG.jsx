import React from "react";
import { motion } from "framer-motion";

/* ─── Helper ──────────────────────────────────────────────────── */
function GlassSheen({ x, y, w, h, rx = 4 }) {
  return (
    <rect x={x + 4} y={y + 6} width={w * 0.28} height={h - 12} rx={rx}
      fill="white" fillOpacity={0.22} />
  );
}

/* ─── Soil composition data (exported for use in page) ─────────── */
export const SOIL_DATA = {
  sandy: {
    sand: 70, silt: 20, clay: 10,
    label: "Sandy Soil", color: "#b45309",
    accent: "amber", textureType: "Sandy",
    desc: "Mostly large, coarse sand grains — drains quickly",
  },
  clay: {
    sand: 15, silt: 20, clay: 65,
    label: "Clay Soil", color: "#7c3aed",
    accent: "violet", textureType: "Clayey",
    desc: "Mostly fine, sticky clay particles — retains water",
  },
  loamy: {
    sand: 40, silt: 40, clay: 20,
    label: "Loamy Soil", color: "#15803d",
    accent: "emerald", textureType: "Loamy",
    desc: "Balanced mix of sand, silt & clay — ideal for farming",
  },
  silty: {
    sand: 20, silt: 65, clay: 15,
    label: "Silty Soil", color: "#0891b2",
    accent: "cyan", textureType: "Silty",
    desc: "Mostly medium-sized silt particles — smooth texture",
  },
};

/* ─── Jar interior geometry (constant, used in all SVGs) ───────── */
const J = { x: 76, y: 55, w: 188, bot: 312 };
const SOIL_ZONE_H = 154; // bottom 60% of 257 px interior

/* ─── Pre-seeded particle positions (x in [76,264], y in [55,312]) */
const SAND_PARTICLES = [
  { x: 92,  y: 195, r: 4.5 }, { x: 118, y: 152, r: 3.8 },
  { x: 142, y: 228, r: 5.0 }, { x: 165, y: 178, r: 4.2 },
  { x: 188, y: 210, r: 4.8 }, { x: 212, y: 162, r: 3.5 },
  { x: 235, y: 198, r: 4.5 }, { x: 102, y: 272, r: 4.0 },
  { x: 148, y: 258, r: 5.0 }, { x: 178, y: 282, r: 3.8 },
  { x: 218, y: 252, r: 4.2 }, { x: 248, y: 270, r: 4.5 },
];
const SILT_PARTICLES = [
  { x: 86,  y: 158, r: 2.8 }, { x: 110, y: 112, r: 2.5 },
  { x: 134, y: 182, r: 3.0 }, { x: 158, y: 138, r: 2.6 },
  { x: 180, y: 165, r: 2.8 }, { x: 204, y: 118, r: 2.4 },
  { x: 228, y: 148, r: 2.9 }, { x: 246, y: 178, r: 2.5 },
  { x: 125, y: 242, r: 2.7 }, { x: 195, y: 232, r: 2.8 },
];
const CLAY_PARTICLES = [
  { x: 90,  y: 82,  r: 1.8 }, { x: 120, y: 108, r: 1.5 },
  { x: 150, y: 76,  r: 2.0 }, { x: 180, y: 98,  r: 1.7 },
  { x: 210, y: 85,  r: 1.8 }, { x: 240, y: 112, r: 1.5 },
  { x: 108, y: 142, r: 1.9 }, { x: 190, y: 135, r: 1.6 },
];

/* ══════════════════════════════════════════════════════════════
   SVG 0 — INTRO (settled loamy jar with labels)
══════════════════════════════════════════════════════════════ */
export function SoilIntroSVG() {
  const soil  = SOIL_DATA.loamy;
  const sandH = (soil.sand / 100) * SOIL_ZONE_H;
  const siltH = (soil.silt / 100) * SOIL_ZONE_H;
  const clayH = (soil.clay / 100) * SOIL_ZONE_H;
  const sandY = J.bot - sandH;
  const siltY = sandY - siltH;
  const clayY = siltY - clayH;

  return (
    <svg viewBox="0 0 340 370" className="w-full h-full">
      <defs>
        <linearGradient id="iBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="iGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="iSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a76a" /><stop offset="100%" stopColor="#b8956a" />
        </linearGradient>
        <linearGradient id="iSilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6250" /><stop offset="100%" stopColor="#6d4c3d" />
        </linearGradient>
        <linearGradient id="iClay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C1440E" /><stop offset="100%" stopColor="#a03808" />
        </linearGradient>
        <clipPath id="iJarClip">
          <rect x={J.x} y={J.y} width={J.w} height={J.bot - J.y} rx="3" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="340" height="370" rx="14" fill="url(#iBg)" />
      <rect x="0" y="338" width="340" height="32" fill="#e2e8f0" />
      <rect x="0" y="334" width="340" height="6"  fill="#cbd5e1" />

      {/* Jar outer */}
      <rect x={J.x - 8} y={J.y - 8} width={J.w + 16} height={J.bot - J.y + 16} rx="6"
        fill="url(#iGlass)" stroke="#7dd3fc" strokeWidth="2" />

      <g clipPath="url(#iJarClip)">
        {/* Clear water zone */}
        <rect x={J.x} y={J.y} width={J.w} height={clayY - J.y}
          fill="#bae6fd" fillOpacity={0.55} />
        <motion.ellipse cx={J.x + J.w / 2} cy={J.y + 6} rx={J.w / 2 - 8} ry={5}
          fill="#7dd3fc" fillOpacity={0.45}
          animate={{ scaleX: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
        {/* Clay layer */}
        <rect x={J.x} y={clayY} width={J.w} height={clayH} fill="url(#iClay)" />
        {/* Silt layer */}
        <rect x={J.x} y={siltY} width={J.w} height={siltH} fill="url(#iSilt)" />
        {/* Sand layer */}
        <rect x={J.x} y={sandY} width={J.w} height={sandH} fill="url(#iSand)" />
        {/* Layer dividers */}
        <line x1={J.x} y1={siltY} x2={J.x + J.w} y2={siltY} stroke="white" strokeOpacity={0.35} strokeWidth={1} />
        <line x1={J.x} y1={clayY} x2={J.x + J.w} y2={clayY} stroke="white" strokeOpacity={0.35} strokeWidth={1} />
      </g>

      <GlassSheen x={J.x - 8} y={J.y - 8} w={J.w + 16} h={J.bot - J.y + 16} />

      {/* Jar rim */}
      <rect x={J.x - 12} y={J.y - 14} width={J.w + 24} height={12} rx="5"
        fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />

      {/* Layer labels — right side */}
      <line x1={J.x + J.w + 2} y1={J.y + 28} x2={J.x + J.w + 26} y2={J.y + 28} stroke="#0891b2" strokeWidth="1.3" />
      <text x={J.x + J.w + 30} y={J.y + 32} fontSize={9} fill="#0891b2" fontWeight="700">Clear water</text>

      <line x1={J.x + J.w + 2} y1={clayY + clayH / 2} x2={J.x + J.w + 26} y2={clayY + clayH / 2} stroke="#C1440E" strokeWidth="1.3" />
      <text x={J.x + J.w + 30} y={clayY + clayH / 2 + 4} fontSize={9} fill="#C1440E" fontWeight="700">Clay</text>
      <text x={J.x + J.w + 30} y={clayY + clayH / 2 + 15} fontSize={7.5} fill="#9a3412">{soil.clay}%</text>

      <line x1={J.x + J.w + 2} y1={siltY + siltH / 2} x2={J.x + J.w + 26} y2={siltY + siltH / 2} stroke="#8B6250" strokeWidth="1.3" />
      <text x={J.x + J.w + 30} y={siltY + siltH / 2 + 4} fontSize={9} fill="#78503c" fontWeight="700">Silt</text>
      <text x={J.x + J.w + 30} y={siltY + siltH / 2 + 15} fontSize={7.5} fill="#78503c">{soil.silt}%</text>

      <line x1={J.x + J.w + 2} y1={sandY + sandH / 2} x2={J.x + J.w + 26} y2={sandY + sandH / 2} stroke="#b45309" strokeWidth="1.3" />
      <text x={J.x + J.w + 30} y={sandY + sandH / 2 + 4} fontSize={9} fill="#b45309" fontWeight="700">Sand</text>
      <text x={J.x + J.w + 30} y={sandY + sandH / 2 + 15} fontSize={7.5} fill="#b45309">{soil.sand}%</text>

      {/* Settle order arrows — left side */}
      <text x={J.x - 14} y={clayY + clayH / 2 + 4} textAnchor="end" fontSize={8} fill="#C1440E">③ last</text>
      <text x={J.x - 14} y={siltY + siltH / 2 + 4} textAnchor="end" fontSize={8} fill="#78503c">② mid</text>
      <text x={J.x - 14} y={sandY + sandH / 2 + 4} textAnchor="end" fontSize={8} fill="#b45309">① first</text>

      <text x="170" y="355" textAnchor="middle" fontSize={10} fontWeight="700" fill="#166534">
        Sedimentation — Loamy Soil Sample
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SVG 1 — MAIN JAR (interactive)
   Props: soilType, stage (0–4), settleProgress (0–1), shaking
══════════════════════════════════════════════════════════════ */
export function SoilJarSVG({
  soilType       = "loamy",
  stage          = 0,
  settleProgress = 0,
  shaking        = false,
}) {
  const soil = SOIL_DATA[soilType] || SOIL_DATA.loamy;

  const sandH_full = (soil.sand / 100) * SOIL_ZONE_H;
  const siltH_full = (soil.silt / 100) * SOIL_ZONE_H;
  const clayH_full = (soil.clay / 100) * SOIL_ZONE_H;

  /* Settle timing: sand first, clay last */
  const sandSettle = Math.min(1, settleProgress / 0.40);
  const siltSettle = Math.min(1, Math.max(0, (settleProgress - 0.28) / 0.47));
  const claySettle = Math.min(1, Math.max(0, (settleProgress - 0.62) / 0.38));

  const curSandH = sandH_full * sandSettle;
  const curSiltH = siltH_full * siltSettle;
  const curClayH = clayH_full * claySettle;

  /* Y positions (computed bottom-up) */
  const sandY = J.bot - curSandH;
  const siltY = sandY - curSiltH;
  const clayY = siltY - curClayH;

  const hasLiquid    = stage >= 2;
  const turbidity    = hasLiquid ? Math.max(0, 1 - settleProgress * 1.4) : 0;

  /* Floating particle opacity — fades as each layer settles */
  const sandPOp = stage >= 1 ? Math.max(0, 1 - sandSettle * 2.2) : 0;
  const siltPOp = stage >= 1 ? Math.max(0, 1 - siltSettle * 2.2) : 0;
  const clayPOp = stage >= 1 ? Math.max(0, 1 - claySettle * 2.2) : 0;

  const statusText =
    stage === 0 ? "Empty jar — ready" :
    stage === 1 ? `${soil.label} added to jar` :
    stage === 2 ? "Water added — solution mixed" :
    stage === 3 ? (shaking ? "Shaking vigorously…" : "Shaken — ready to settle") :
    settleProgress < 1 ? `Settling… ${Math.round(settleProgress * 100)}%` :
    "Settling complete!";

  return (
    <svg viewBox="0 0 340 370" className="w-full h-full">
      <defs>
        <linearGradient id="sjBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="sjGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="sjSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a76a" /><stop offset="100%" stopColor="#b8956a" />
        </linearGradient>
        <linearGradient id="sjSilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6250" /><stop offset="100%" stopColor="#6d4c3d" />
        </linearGradient>
        <linearGradient id="sjClay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C1440E" /><stop offset="100%" stopColor="#a03808" />
        </linearGradient>
        <clipPath id="sjJarClip">
          <rect x={J.x} y={J.y} width={J.w} height={J.bot - J.y} rx="3" />
        </clipPath>
        <filter id="sjGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="340" height="370" rx="14" fill="url(#sjBg)" />
      <rect x="0" y="340" width="340" height="30" fill="#e2e8f0" />
      <rect x="0" y="336" width="340" height="6"  fill="#cbd5e1" />

      {/* ── Jar (shakes when shaking=true) ── */}
      <motion.g
        animate={shaking ? { x: [-8, 8, -6, 6, -4, 4, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={shaking
          ? { duration: 0.42, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.25 }}>

        {/* Outer jar body */}
        <rect x={J.x - 8} y={J.y - 8} width={J.w + 16} height={J.bot - J.y + 16} rx="6"
          fill="url(#sjGlass)" stroke="#7dd3fc" strokeWidth="2" />

        {/* Contents (clipped) */}
        <g clipPath="url(#sjJarClip)">

          {/* Stage 1: dry soil pile */}
          {stage === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={J.x} y={J.bot - 110} width={J.w} height={110} fill="#92400e" />
              {SAND_PARTICLES.slice(0, 6).map((p, i) => (
                <circle key={i} cx={p.x} cy={J.bot - 25 - i * 14} r={p.r * 0.8}
                  fill="#d4a76a" fillOpacity={0.65} />
              ))}
              {SILT_PARTICLES.slice(0, 4).map((p, i) => (
                <circle key={i} cx={p.x + 20} cy={J.bot - 55 - i * 12} r={p.r}
                  fill="#8B6250" fillOpacity={0.6} />
              ))}
            </motion.g>
          )}

          {/* Stage 2+: water fill */}
          {stage >= 2 && (
            <motion.rect x={J.x} y={J.y} width={J.w} height={J.bot - J.y}
              fill="#bae6fd" fillOpacity={0.38}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} />
          )}

          {/* Sand layer */}
          {stage >= 4 && curSandH > 0.5 && (
            <rect x={J.x} y={sandY} width={J.w} height={curSandH} fill="url(#sjSand)" />
          )}
          {/* Silt layer */}
          {stage >= 4 && curSiltH > 0.5 && (
            <rect x={J.x} y={siltY} width={J.w} height={curSiltH} fill="url(#sjSilt)" />
          )}
          {/* Clay layer */}
          {stage >= 4 && curClayH > 0.5 && (
            <rect x={J.x} y={clayY} width={J.w} height={curClayH} fill="url(#sjClay)" />
          )}

          {/* Layer boundary lines */}
          {stage >= 4 && curSandH > 2 && curSiltH > 2 && (
            <line x1={J.x} y1={sandY} x2={J.x + J.w} y2={sandY}
              stroke="white" strokeOpacity={0.4} strokeWidth={1} />
          )}
          {stage >= 4 && curSiltH > 2 && curClayH > 2 && (
            <line x1={J.x} y1={siltY} x2={J.x + J.w} y2={siltY}
              stroke="white" strokeOpacity={0.4} strokeWidth={1} />
          )}

          {/* Turbid suspension overlay */}
          {hasLiquid && turbidity > 0.02 && (
            <rect x={J.x} y={stage >= 4 ? Math.min(clayY, J.bot) : J.y}
              width={J.w}
              height={stage >= 4 ? Math.max(0, clayY - J.y) : J.bot - J.y}
              fill="#7c3d12" fillOpacity={turbidity * 0.58} />
          )}

          {/* Floating sand particles */}
          {sandPOp > 0.01 && SAND_PARTICLES.map((p, i) => (
            <circle key={`sp${i}`} cx={p.x} cy={p.y} r={p.r}
              fill="#d4a76a" fillOpacity={sandPOp} />
          ))}
          {/* Floating silt particles */}
          {siltPOp > 0.01 && SILT_PARTICLES.map((p, i) => (
            <circle key={`sip${i}`} cx={p.x} cy={p.y} r={p.r}
              fill="#8B6250" fillOpacity={siltPOp} />
          ))}
          {/* Floating clay particles */}
          {clayPOp > 0.01 && CLAY_PARTICLES.map((p, i) => (
            <circle key={`cp${i}`} cx={p.x} cy={p.y} r={p.r}
              fill="#C1440E" fillOpacity={clayPOp} />
          ))}

          {/* Water surface ripple */}
          {stage >= 2 && (
            <motion.ellipse cx={J.x + J.w / 2} cy={J.y + 7} rx={J.w / 2 - 6} ry={5}
              fill="#7dd3fc" fillOpacity={0.5}
              animate={{ scaleX: shaking ? [1, 1.1, 0.9, 1] : [1, 1.03, 1] }}
              transition={{ duration: shaking ? 0.28 : 2.2, repeat: Infinity }} />
          )}
        </g>

        {/* Glass sheen */}
        <GlassSheen x={J.x - 8} y={J.y - 8} w={J.w + 16} h={J.bot - J.y + 16} />

        {/* Jar rim */}
        <rect x={J.x - 12} y={J.y - 14} width={J.w + 24} height={12} rx="5"
          fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.2" />

        {/* Layer labels (appear progressively) */}
        {stage >= 4 && curSandH > 10 && settleProgress > 0.15 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={J.x + J.w + 2} y1={sandY + curSandH / 2}
              x2={J.x + J.w + 22} y2={sandY + curSandH / 2} stroke="#b45309" strokeWidth="1.4" />
            <text x={J.x + J.w + 26} y={sandY + curSandH / 2 + 4}
              fontSize={8.5} fill="#b45309" fontWeight="700">Sand</text>
          </motion.g>
        )}
        {stage >= 4 && curSiltH > 10 && settleProgress > 0.48 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={J.x + J.w + 2} y1={siltY + curSiltH / 2}
              x2={J.x + J.w + 22} y2={siltY + curSiltH / 2} stroke="#8B6250" strokeWidth="1.4" />
            <text x={J.x + J.w + 26} y={siltY + curSiltH / 2 + 4}
              fontSize={8.5} fill="#6d4c3d" fontWeight="700">Silt</text>
          </motion.g>
        )}
        {stage >= 4 && curClayH > 10 && settleProgress > 0.78 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <line x1={J.x + J.w + 2} y1={clayY + curClayH / 2}
              x2={J.x + J.w + 22} y2={clayY + curClayH / 2} stroke="#C1440E" strokeWidth="1.4" />
            <text x={J.x + J.w + 26} y={clayY + curClayH / 2 + 4}
              fontSize={8.5} fill="#a03808" fontWeight="700">Clay</text>
          </motion.g>
        )}

        {/* Ruler on left side at full settle */}
        {stage >= 4 && settleProgress >= 1 && (
          <g>
            <line x1={J.x - 22} y1={J.bot} x2={J.x - 22} y2={J.bot - SOIL_ZONE_H}
              stroke="#64748b" strokeWidth="1.5" />
            {[0, 25, 50, 75, 100].map(pct => (
              <g key={pct}>
                <line x1={J.x - 28} y1={J.bot - SOIL_ZONE_H * pct / 100}
                  x2={J.x - 16} y2={J.bot - SOIL_ZONE_H * pct / 100}
                  stroke="#64748b" strokeWidth="1.2" />
                <text x={J.x - 32} y={J.bot - SOIL_ZONE_H * pct / 100 + 4}
                  textAnchor="end" fontSize={6.5} fill="#64748b">{pct}%</text>
              </g>
            ))}
          </g>
        )}
      </motion.g>

      {/* Status label */}
      <text x="170" y="358" textAnchor="middle" fontSize={9.5} fontWeight="600" fill="#475569">
        {statusText}
      </text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   SVG 2 — OBSERVATION (4-panel side-by-side comparison)
══════════════════════════════════════════════════════════════ */
export function SoilObservationSVG() {
  const types   = ["sandy", "clay", "loamy", "silty"];
  const panelW  = 62;
  const panelH  = 155;
  const soilH   = 93;  // 60% of panelH
  const waterH  = panelH - soilH;

  return (
    <svg viewBox="0 0 340 260" className="w-full h-full">
      <defs>
        <linearGradient id="obBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="obSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a76a" /><stop offset="100%" stopColor="#b8956a" />
        </linearGradient>
        <linearGradient id="obSilt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6250" /><stop offset="100%" stopColor="#6d4c3d" />
        </linearGradient>
        <linearGradient id="obClay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C1440E" /><stop offset="100%" stopColor="#a03808" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="340" height="260" rx="12" fill="url(#obBg)" />

      {types.map((type, ti) => {
        const soil  = SOIL_DATA[type];
        const jarX  = 16 + ti * 81;
        const jarY  = 32;
        const jarBot = jarY + panelH;
        const sandH  = (soil.sand / 100) * soilH;
        const siltH  = (soil.silt / 100) * soilH;
        const clayH  = (soil.clay / 100) * soilH;
        const sandY  = jarBot - sandH;
        const siltY  = sandY - siltH;
        const clayY  = siltY - clayH;

        return (
          <g key={type}>
            {/* Jar outline */}
            <rect x={jarX} y={jarY} width={panelW} height={panelH} rx="4"
              fill="#e0f2fe" fillOpacity="0.4" stroke="#7dd3fc" strokeWidth="1.5" />

            {/* Water zone */}
            <rect x={jarX + 2} y={jarY + 2} width={panelW - 4} height={waterH - 2}
              fill="#bae6fd" fillOpacity={0.6} />
            {/* Clay */}
            <rect x={jarX + 2} y={clayY} width={panelW - 4} height={clayH} fill="url(#obClay)" />
            {/* Silt */}
            <rect x={jarX + 2} y={siltY} width={panelW - 4} height={siltH} fill="url(#obSilt)" />
            {/* Sand */}
            <rect x={jarX + 2} y={sandY} width={panelW - 4} height={sandH} fill="url(#obSand)" />

            {/* Layer dividers */}
            {siltH > 2 && sandH > 2 && (
              <line x1={jarX + 2} y1={sandY} x2={jarX + panelW - 2} y2={sandY}
                stroke="white" strokeOpacity={0.35} strokeWidth={0.8} />
            )}
            {siltH > 2 && clayH > 2 && (
              <line x1={jarX + 2} y1={siltY} x2={jarX + panelW - 2} y2={siltY}
                stroke="white" strokeOpacity={0.35} strokeWidth={0.8} />
            )}

            {/* Percentage text in each layer */}
            {sandH > 14 && (
              <text x={jarX + panelW / 2} y={sandY + sandH / 2 + 4}
                textAnchor="middle" fontSize={7.5} fill="white" fontWeight="700">{soil.sand}%</text>
            )}
            {siltH > 14 && (
              <text x={jarX + panelW / 2} y={siltY + siltH / 2 + 4}
                textAnchor="middle" fontSize={7.5} fill="white" fontWeight="700">{soil.silt}%</text>
            )}
            {clayH > 14 && (
              <text x={jarX + panelW / 2} y={clayY + clayH / 2 + 4}
                textAnchor="middle" fontSize={7.5} fill="white" fontWeight="700">{soil.clay}%</text>
            )}

            {/* Soil name above jar */}
            <text x={jarX + panelW / 2} y={jarY - 10} textAnchor="middle"
              fontSize={8} fontWeight="700" fill={soil.color}>{soil.label}</text>

            {/* Texture type badge below */}
            <rect x={jarX} y={jarY + panelH + 5} width={panelW} height={16} rx="4"
              fill={soil.color} fillOpacity={0.14} stroke={soil.color} strokeWidth={0.8} />
            <text x={jarX + panelW / 2} y={jarY + panelH + 16} textAnchor="middle"
              fontSize={8} fill={soil.color} fontWeight="700">{soil.textureType}</text>
          </g>
        );
      })}

      {/* Legend */}
      <g>
        <rect x={12}  y={228} width={10} height={10} rx="2" fill="url(#obSand)" />
        <text x={25}  y={238} fontSize={8} fill="#b45309">Sand (large)</text>
        <rect x={90}  y={228} width={10} height={10} rx="2" fill="url(#obSilt)" />
        <text x={103} y={238} fontSize={8} fill="#6d4c3d">Silt (medium)</text>
        <rect x={178} y={228} width={10} height={10} rx="2" fill="url(#obClay)" />
        <text x={191} y={238} fontSize={8} fill="#a03808">Clay (fine)</text>
        <rect x={250} y={228} width={10} height={10} rx="2" fill="#bae6fd" />
        <text x={263} y={238} fontSize={8} fill="#0891b2">Water</text>
      </g>
    </svg>
  );
}
