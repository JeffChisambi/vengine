import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";

const MATERIALS = [
  { id: "crown",   label: "Crown Glass",  n: 1.52, color: "#7dd3fc", dark: "#0369a1" },
  { id: "flint",   label: "Flint Glass",  n: 1.62, color: "#a5b4fc", dark: "#4338ca" },
  { id: "acrylic", label: "Acrylic",      n: 1.49, color: "#86efac", dark: "#166534" },
  { id: "water",   label: "Water",        n: 1.33, color: "#93c5fd", dark: "#1d4ed8" },
  { id: "diamond", label: "Diamond",      n: 2.42, color: "#f9a8d4", dark: "#9d174d" },
];

const SVG_W = 500;
const SVG_H = 420;
const GLASS_X = 140;
const GLASS_Y = 170;
const GLASS_W = 220;
const GLASS_H = 110;
const ENTRY_X = GLASS_X + GLASS_W / 2; // 250
const ENTRY_Y = GLASS_Y;               // 170
const EXIT_BASE_Y = GLASS_Y + GLASS_H; // 280
const MAX_ANGLE = 65;

function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

export default function RefractionLab({ readings, setReadings }) {
  const [angle1Deg, setAngle1Deg] = useState(40);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [showNormal, setShowNormal] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const theta1 = toRad(angle1Deg);
  const sinTheta2 = Math.sin(theta1) / material.n;
  const theta2 = Math.asin(Math.min(sinTheta2, 1));
  const angle2Deg = toDeg(theta2);

  // Geometry
  const incStartX = ENTRY_X - 110 * Math.sin(theta1);
  const incStartY = ENTRY_Y - 110 * Math.cos(theta1);

  const exitX = ENTRY_X + GLASS_H * Math.tan(theta2);
  const exitY = EXIT_BASE_Y;

  const transEndX = exitX + 90 * Math.sin(theta1);
  const transEndY = exitY + 90 * Math.cos(theta1);

  // Lateral displacement
  const lateralDisp = GLASS_H * Math.sin(theta1 - theta2) / Math.cos(theta2);

  // Drag the laser source along an arc
  const handleSvgMouseMove = useCallback((e) => {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W;
    const svgY = ((clientY - rect.top) / rect.height) * SVG_H;
    const dx = ENTRY_X - svgX;
    const dy = ENTRY_Y - svgY;
    if (dy < 5) return;
    const angleDeg = toDeg(Math.atan2(dx, dy));
    setAngle1Deg(Math.max(5, Math.min(MAX_ANGLE, angleDeg)));
  }, []);

  const handleSvgMouseUp = () => { dragging.current = false; };

  const handleRecord = () => {
    setReadings(r => [...r, {
      material: material.label,
      n: material.n,
      angle1: parseFloat(angle1Deg.toFixed(1)),
      angle2: parseFloat(angle2Deg.toFixed(1)),
      sinTheta1: parseFloat(Math.sin(theta1).toFixed(4)),
      sinTheta2: parseFloat(Math.sin(theta2).toFixed(4)),
      nMeasured: parseFloat((Math.sin(theta1) / Math.sin(theta2)).toFixed(3)),
    }]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Arc helper
  function arcPath(cx, cy, r, startAngle, endAngle, flip = false) {
    const s = flip
      ? { x: cx + r * Math.sin(startAngle), y: cy + r * Math.cos(startAngle) }
      : { x: cx - r * Math.sin(startAngle), y: cy - r * Math.cos(startAngle) };
    const eA = flip
      ? { x: cx + r * Math.sin(endAngle), y: cy + r * Math.cos(endAngle) }
      : { x: cx, y: cy - r };
    if (flip) {
      return `M ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx + r * Math.sin(endAngle)} ${cy + r * Math.cos(endAngle)}`;
    }
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r * Math.sin(startAngle)} ${cy - r * Math.cos(startAngle)}`;
  }

  return (
    <div
      className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-6 max-w-5xl mx-auto"
      onMouseMove={handleSvgMouseMove}
      onMouseUp={handleSvgMouseUp}
      onTouchMove={handleSvgMouseMove}
      onTouchEnd={handleSvgMouseUp}
    >
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-2">
          Interactive Lab
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Refraction Through a Glass Block
        </h2>
        <p className="text-muted-foreground text-sm">
          Drag the laser source or use the slider to set the angle of incidence, then record your readings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* ── SVG Scene ── */}
        <div
          className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden select-none w-full"
          style={{ cursor: dragging.current ? "crosshair" : "default" }}
        >
          <svg
            ref={svgRef}
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="max-w-full w-full"
            style={{ display: "block" }}
            onMouseDown={() => { dragging.current = true; }}
            onTouchStart={() => { dragging.current = true; }}
          >
            <defs>
              {/* Glass gradient */}
              <linearGradient id="rf-glass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={material.color} stopOpacity="0.45" />
                <stop offset="50%" stopColor="#f0f9ff" stopOpacity="0.1" />
                <stop offset="100%" stopColor={material.color} stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="rf-glass-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={material.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={material.color} stopOpacity="0.5" />
              </linearGradient>
              {/* Laser glow */}
              <filter id="rf-laserGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="rf-softGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="rf-glassSheen">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Clip glass interior */}
              <clipPath id="rf-glassClip">
                <rect x={GLASS_X} y={GLASS_Y} width={GLASS_W} height={GLASS_H} rx={6} />
              </clipPath>
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="#f8fafc" />

            {/* Fine grid */}
            {Array.from({ length: 12 }, (_, i) => (
              <line key={`gx${i}`} x1={i * 45} y1={0} x2={i * 45} y2={SVG_H}
                stroke="#e2e8f0" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`gy${i}`} x1={0} y1={i * 46} x2={SVG_W} y2={i * 46}
                stroke="#e2e8f0" strokeWidth={0.5} />
            ))}

            {/* ── Normal lines ── */}
            {showNormal && (
              <>
                <line x1={ENTRY_X} y1={20} x2={ENTRY_X} y2={ENTRY_Y - 2}
                  stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 4" />
                <line x1={exitX} y1={exitY + 2} x2={exitX} y2={exitY + 65}
                  stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 4" />
                <text x={ENTRY_X + 5} y={30} fontSize={9} fill="#94a3b8" fontFamily="var(--font-body)">Normal</text>
              </>
            )}

            {/* ── Glass block ── */}
            {/* Shadow */}
            <rect x={GLASS_X + 4} y={GLASS_Y + 4} width={GLASS_W} height={GLASS_H}
              rx={7} fill="#94a3b8" fillOpacity={0.12} />

            {/* Body */}
            <rect x={GLASS_X} y={GLASS_Y} width={GLASS_W} height={GLASS_H}
              rx={6} fill="url(#rf-glass)"
              stroke={material.dark} strokeWidth={1.5} strokeOpacity={0.6} />

            {/* Sheen stripe */}
            <rect x={GLASS_X + 10} y={GLASS_Y + 8} width={30} height={GLASS_H - 16}
              rx={3} fill="white" fillOpacity={0.18} />

            {/* Top surface highlight */}
            <motion.rect
              x={GLASS_X + 2} y={GLASS_Y + 1} width={GLASS_W - 4} height={8} rx={4}
              fill={material.color} fillOpacity={0.4}
              animate={{ fillOpacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            {/* Glass label */}
            <text x={GLASS_X + GLASS_W / 2} y={GLASS_Y + GLASS_H / 2 + 4}
              textAnchor="middle" fontSize={11} fill={material.dark}
              fontWeight="bold" fontFamily="var(--font-heading)" fillOpacity={0.7}>
              {material.label}  ·  n = {material.n}
            </text>

            {/* ── Laser beam — incident ── */}
            {/* Glow layer */}
            <line x1={incStartX} y1={incStartY} x2={ENTRY_X} y2={ENTRY_Y}
              stroke="#fbbf24" strokeWidth={7} strokeLinecap="round"
              filter="url(#rf-softGlow)" opacity={0.3} />
            {/* Core */}
            <motion.line
              x1={incStartX} y1={incStartY}
              x2={ENTRY_X} y2={ENTRY_Y}
              stroke="#fcd34d" strokeWidth={2.5} strokeLinecap="round"
              filter="url(#rf-laserGlow)"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />

            {/* ── Laser beam — refracted inside glass ── */}
            <line x1={ENTRY_X} y1={ENTRY_Y} x2={exitX} y2={exitY}
              stroke="#f97316" strokeWidth={7} strokeLinecap="round"
              filter="url(#rf-softGlow)" opacity={0.25} />
            <motion.line
              x1={ENTRY_X} y1={ENTRY_Y}
              x2={exitX} y2={exitY}
              stroke="#fb923c" strokeWidth={2.5} strokeLinecap="round"
              filter="url(#rf-laserGlow)"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
            />

            {/* ── Laser beam — transmitted ── */}
            <line x1={exitX} y1={exitY} x2={transEndX} y2={transEndY}
              stroke="#fbbf24" strokeWidth={7} strokeLinecap="round"
              filter="url(#rf-softGlow)" opacity={0.3} />
            <motion.line
              x1={exitX} y1={exitY}
              x2={transEndX} y2={transEndY}
              stroke="#fcd34d" strokeWidth={2.5} strokeLinecap="round"
              filter="url(#rf-laserGlow)"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
            />

            {/* ── Entry point dot ── */}
            <motion.circle
              cx={ENTRY_X} cy={ENTRY_Y} r={5}
              fill="#fbbf24" filter="url(#rf-laserGlow)"
              animate={{ r: [4, 6, 4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* ── Exit point dot ── */}
            <motion.circle
              cx={exitX} cy={exitY} r={4.5}
              fill="#fb923c" filter="url(#rf-laserGlow)"
              animate={{ r: [3.5, 5.5, 3.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />

            {/* ── Angle arcs & labels ── */}
            {showAngles && (
              <>
                {/* θ₁ arc above entry */}
                <path
                  d={`M ${ENTRY_X} ${ENTRY_Y - 32} A 32 32 0 0 1 ${ENTRY_X + 32 * Math.sin(theta1)} ${ENTRY_Y - 32 * Math.cos(theta1)}`}
                  fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeOpacity={0.8}
                />
                <text
                  x={ENTRY_X + 36 * Math.sin(theta1 / 2) + 2}
                  y={ENTRY_Y - 36 * Math.cos(theta1 / 2) + 3}
                  fontSize={10} fill="#b45309" fontWeight="bold" fontFamily="var(--font-heading)">
                  θ₁
                </text>

                {/* θ₂ arc below entry (inside glass) */}
                <path
                  d={`M ${ENTRY_X} ${ENTRY_Y + 28} A 28 28 0 0 1 ${ENTRY_X + 28 * Math.sin(theta2)} ${ENTRY_Y + 28 * Math.cos(theta2)}`}
                  fill="none" stroke="#f97316" strokeWidth={1.5} strokeOpacity={0.8}
                />
                <text
                  x={ENTRY_X + 32 * Math.sin(theta2 / 2) + 2}
                  y={ENTRY_Y + 32 * Math.cos(theta2 / 2) + 3}
                  fontSize={10} fill="#c2410c" fontWeight="bold" fontFamily="var(--font-heading)">
                  θ₂
                </text>

                {/* Angle values */}
                <rect x={GLASS_X - 120} y={GLASS_Y + 20} width={108} height={50} rx={6}
                  fill="white" fillOpacity={0.9} stroke="#e2e8f0" strokeWidth={1} />
                <text x={GLASS_X - 66} y={GLASS_Y + 38}
                  textAnchor="middle" fontSize={10} fill="#b45309"
                  fontWeight="bold" fontFamily="var(--font-heading)">
                  θ₁ = {angle1Deg.toFixed(1)}°
                </text>
                <text x={GLASS_X - 66} y={GLASS_Y + 54}
                  textAnchor="middle" fontSize={10} fill="#c2410c"
                  fontWeight="bold" fontFamily="var(--font-heading)">
                  θ₂ = {angle2Deg.toFixed(1)}°
                </text>
              </>
            )}

            {/* ── Lateral displacement indicator ── */}
            {angle1Deg > 8 && (
              <>
                {/* dashed guide: incident ray extended */}
                <line
                  x1={ENTRY_X} y1={ENTRY_Y}
                  x2={ENTRY_X + (exitY - ENTRY_Y) * Math.tan(theta1)}
                  y2={exitY}
                  stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" strokeOpacity={0.5}
                />
                {/* displacement bracket */}
                <line
                  x1={exitX} y1={exitY - 10}
                  x2={ENTRY_X + (exitY - ENTRY_Y) * Math.tan(theta1)} y2={exitY - 10}
                  stroke="#6366f1" strokeWidth={1.2} markerEnd="url(#arr)"
                />
                <text
                  x={(exitX + ENTRY_X + (exitY - ENTRY_Y) * Math.tan(theta1)) / 2}
                  y={exitY - 15}
                  textAnchor="middle" fontSize={9} fill="#6366f1"
                  fontFamily="var(--font-body)">
                  d = {lateralDisp.toFixed(1)} px
                </text>
              </>
            )}

            {/* ── Laser source handle ── */}
            <g
              style={{ cursor: "grab" }}
              onMouseDown={(e) => { e.stopPropagation(); dragging.current = true; }}
              onTouchStart={(e) => { e.stopPropagation(); dragging.current = true; }}
            >
              {/* Source glow halo */}
              <motion.circle
                cx={incStartX} cy={incStartY} r={18}
                fill="#fbbf24" fillOpacity={0.15}
                animate={{ r: [16, 22, 16], fillOpacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Source body */}
              <circle cx={incStartX} cy={incStartY} r={12}
                fill="#1e293b" stroke="#fbbf24" strokeWidth={2} />
              <circle cx={incStartX} cy={incStartY} r={7}
                fill="#fbbf24" filter="url(#rf-laserGlow)" />
              <text x={incStartX} y={incStartY - 17}
                textAnchor="middle" fontSize={8} fill="#64748b"
                fontFamily="var(--font-body)" fontWeight="bold">Laser</text>
            </g>

            {/* ── Info panel top-right ── */}
            <rect x={SVG_W - 135} y={15} width={122} height={90} rx={8}
              fill="white" fillOpacity={0.95} stroke="#e2e8f0" strokeWidth={1} />
            <text x={SVG_W - 74} y={32}
              textAnchor="middle" fontSize={9} fill="#64748b"
              fontFamily="var(--font-heading)" fontWeight="bold">
              Live Readings
            </text>
            <text x={SVG_W - 74} y={48}
              textAnchor="middle" fontSize={10} fill="#b45309"
              fontFamily="var(--font-heading)" fontWeight="bold">
              sin θ₁ = {Math.sin(theta1).toFixed(4)}
            </text>
            <text x={SVG_W - 74} y={63}
              textAnchor="middle" fontSize={10} fill="#c2410c"
              fontFamily="var(--font-heading)" fontWeight="bold">
              sin θ₂ = {Math.sin(theta2).toFixed(4)}
            </text>
            <text x={SVG_W - 74} y={78}
              textAnchor="middle" fontSize={10} fill={material.dark}
              fontFamily="var(--font-heading)" fontWeight="bold">
              n = {(Math.sin(theta1) / Math.sin(theta2)).toFixed(3)}
            </text>
            <text x={SVG_W - 74} y={95}
              textAnchor="middle" fontSize={8} fill="#94a3b8"
              fontFamily="var(--font-body)">
              theory: {material.n}
            </text>

            {/* ── Labels: Air regions ── */}
            <text x={20} y={GLASS_Y - 15}
              fontSize={10} fill="#64748b" fontFamily="var(--font-body)" fontWeight="bold">
              Air  (n₁ = 1.00)
            </text>
            <text x={20} y={exitY + 40}
              fontSize={10} fill="#64748b" fontFamily="var(--font-body)" fontWeight="bold">
              Air  (n₁ = 1.00)
            </text>
          </svg>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[250px]">

          {/* Material selector */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Glass Material
            </p>
            <div className="space-y-2">
              {MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setMaterial(mat)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    material.id === mat.id
                      ? "border-sky-400 bg-sky-500/8 text-sky-700"
                      : "border-border bg-muted/40 text-muted-foreground hover:border-sky-200"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full shrink-0 border border-white/50"
                    style={{ background: mat.color }} />
                  <span className="flex-1 text-left">{mat.label}</span>
                  <span className="text-[10px] font-mono opacity-70">n={mat.n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Angle slider */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Angle of Incidence
              </p>
              <span className="text-sm font-bold text-amber-600 font-heading">
                {angle1Deg.toFixed(1)}°
              </span>
            </div>
            <input
              type="range" min={5} max={MAX_ANGLE} step={0.5}
              value={angle1Deg}
              onChange={(e) => setAngle1Deg(+e.target.value)}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>5°</span><span>{MAX_ANGLE}°</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {[15, 30, 45, 60].map((a) => (
                <button key={a}
                  onClick={() => setAngle1Deg(a)}
                  className={`text-[10px] py-1 rounded-lg border transition-all ${
                    Math.abs(angle1Deg - a) < 0.6
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >{a}°</button>
              ))}
            </div>
          </div>

          {/* Live readout */}
          <div className="p-3 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-2">
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">
              Live Snell's Law
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">θ₁</span>
              <motion.span
                key={angle1Deg.toFixed(1)}
                initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                className="text-sm font-bold font-heading text-amber-600">
                {angle1Deg.toFixed(1)}°
              </motion.span>
              <span className="text-xs text-muted-foreground ml-auto">θ₂</span>
              <motion.span
                key={angle2Deg.toFixed(2)}
                initial={{ scale: 1.15 }} animate={{ scale: 1 }}
                className="text-sm font-bold font-heading text-orange-600">
                {angle2Deg.toFixed(1)}°
              </motion.span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Measured n</span>
              <span className="text-sm font-bold font-heading" style={{ color: material.dark }}>
                {(Math.sin(theta1) / Math.sin(theta2)).toFixed(3)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Theoretical n</span>
              <span className="text-sm font-bold font-heading text-sky-600">{material.n}</span>
            </div>
          </div>

          {/* Display toggles */}
          <div className="p-3 rounded-2xl bg-card border border-border space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Display</p>
            {[
              { label: "Normal line", val: showNormal, set: setShowNormal },
              { label: "Angle labels", val: showAngles, set: setShowAngles },
            ].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => set(v => !v)}
                  className={`w-9 h-5 rounded-full transition-colors ${val ? "bg-sky-500" : "bg-muted"} relative shrink-0`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${val ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </label>
            ))}
          </div>

          {/* Record */}
          <Button
            onClick={handleRecord}
            className={`gap-2 text-sm border-0 ${justAdded ? "bg-emerald-500 text-white" : "bg-sky-600 hover:bg-sky-700 text-white"}`}
          >
            <Plus className="w-4 h-4" />
            {justAdded ? "✓ Recorded!" : "Record Reading"}
          </Button>

          {readings.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-xs text-muted-foreground">
              {readings.length} reading{readings.length !== 1 ? "s" : ""} recorded
            </motion.p>
          )}
        </div>
      </div>

      {readings.length >= 3 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="px-4 py-2 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold">
          Great work! Head to Data &amp; Graph to verify Snell's Law →
        </motion.div>
      )}
    </div>
  );
}
