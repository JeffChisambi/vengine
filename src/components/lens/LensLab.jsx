import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";

/* ── Physics constants (SCALE = 1 px/cm) ─────────────────────── */
const LENS_X  = 360;
const AXIS_Y  = 200;
const OBJ_H   = 58;   // fixed visual object height in SVG px
const SVG_W   = 720;
const SVG_H   = 400;
const LENS_TOP = AXIS_Y - 65;
const LENS_BOT = AXIS_Y + 65;
const NEAR_INFTY = 4000;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function computePhysics(objX, fCm, isConvex) {
  const do_px  = LENS_X - objX;                              // always > 0
  const f_sign = isConvex ? fCm : -fCm;                     // signed
  const denom  = do_px - f_sign;
  const v_px   = Math.abs(denom) < 3
    ? (denom >= 0 ? NEAR_INFTY : -NEAR_INFTY)
    : (do_px * f_sign) / denom;
  const isVirt = v_px < 0;
  const isInf  = Math.abs(v_px) >= NEAR_INFTY * 0.9;
  const m      = isInf ? 0 : -(v_px / do_px);
  const imgH   = clamp(m * OBJ_H, -130, 130);
  const imgX   = clamp(LENS_X + v_px, -500, 900);
  const r3y    = Math.abs(denom) > 1
    ? AXIS_Y + (f_sign * OBJ_H) / denom
    : AXIS_Y;
  return { do_px, f_sign, v_px, isVirt, isInf, m, imgH, imgX, r3y };
}

/* ── SVG helpers ──────────────────────────────────────────────── */
function Arrowhead({ x, y, dy, color, size = 5 }) {
  // points up if dy < 0, down if dy > 0
  const dir = dy <= 0 ? -1 : 1;
  return (
    <polygon
      points={`${x - size},${y + dir * size * 1.4} ${x + size},${y + dir * size * 1.4} ${x},${y}`}
      fill={color}
    />
  );
}

function FocalMarker({ cx, cy, label }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#facc15" fillOpacity={0.18} />
      <circle cx={cx} cy={cy} r={4} fill="#facc15" fillOpacity={0.75} />
      <circle cx={cx} cy={cy} r={2} fill="#fef08a" />
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={9}
        fill="#facc15" fontFamily="var(--font-heading)" fontWeight="bold">{label}</text>
    </g>
  );
}

/* ── Lens SVG path ────────────────────────────────────────────── */
function lensPath(isConvex, fCm) {
  const b = isConvex
    ? clamp(900 / fCm, 8, 30)
    : clamp(480 / fCm, 3, 12);
  const [lx, rx] = isConvex
    ? [LENS_X - b, LENS_X + b]
    : [LENS_X + b, LENS_X - b];
  const m1 = AXIS_Y - 32, m2 = AXIS_Y + 32;
  return `M ${LENS_X},${LENS_TOP} C ${lx},${m1} ${lx},${m2} ${LENS_X},${LENS_BOT} C ${rx},${m2} ${rx},${m1} ${LENS_X},${LENS_TOP} Z`;
}

/* ── Main component ───────────────────────────────────────────── */
export default function LensLab({ readings, setReadings }) {
  const [objX,     setObjX]     = useState(210);   // do = 150 cm
  const [fCm,      setFCm]      = useState(90);
  const [isConvex, setIsConvex] = useState(true);
  const [rayVis,   setRayVis]   = useState({ p: true, c: true, f: true });
  const [slowMo,   setSlowMo]   = useState(false);
  const [screenX,  setScreenX]  = useState(550);
  const [dragging, setDragging] = useState(null);  // null | 'obj' | 'screen'
  const [justAdded, setJustAdded] = useState(false);
  const [dashOff,  setDashOff]  = useState(0);
  const svgRef = useRef(null);

  // Slow-motion ray animation
  useEffect(() => {
    if (!slowMo) return;
    let raf;
    const tick = () => { setDashOff(d => d - 1.2); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slowMo]);

  // ── Physics
  const { do_px, f_sign, v_px, isVirt, isInf, m, imgH, imgX, r3y } =
    computePhysics(objX, fCm, isConvex);
  const objTipY = AXIS_Y - OBJ_H;
  const imgTipY = AXIS_Y - imgH;
  const nearFX  = LENS_X - fCm;
  const farFX   = LENS_X + fCm;

  // ── Ray 1 endpoints (parallel → refracted through far focal or diverges from near focal)
  const r1_afterDx = fCm;
  const r1_afterDy = isConvex ? OBJ_H : -OBJ_H;  // convex: bends down toward focal; concave: diverges up
  const r1_endT  = (710 - LENS_X) / r1_afterDx;
  const r1_end   = { x: LENS_X + r1_endT * r1_afterDx, y: objTipY + r1_endT * r1_afterDy };
  // Solid portion stops at image for real image:
  const r1_solidEnd = (!isVirt && !isInf)
    ? (() => {
        const t = (imgX - LENS_X) / r1_afterDx;
        return { x: imgX, y: objTipY + t * r1_afterDy };
      })()
    : r1_end;
  // Virtual backward extension:
  const r1_virtEnd = isVirt && imgX > -400
    ? { x: imgX, y: objTipY - ((LENS_X - imgX) / r1_afterDx) * r1_afterDy }
    : null;

  // ── Ray 2 (central, through lens center, undeviated)
  const r2_slope = OBJ_H / do_px;   // dy/dx going right from lens center
  const r2_endX  = isVirt ? 710 : clamp(imgX, LENS_X + 1, 710);
  const r2_endY  = AXIS_Y + (r2_endX - LENS_X) * r2_slope;
  const r2_virtEnd = isVirt && imgX > -400
    ? { x: imgX, y: AXIS_Y + (imgX - LENS_X) * r2_slope }
    : null;

  // ── Ray 3 (focal → exits parallel)
  const r3_endX    = isVirt ? 710 : clamp(imgX, LENS_X + 1, 710);
  const r3_virtEnd = isVirt && imgX > -400 ? { x: imgX, y: r3y } : null;

  // ── Screen
  const screenFocused  = Math.abs(screenX - clamp(imgX, 0, 800)) < 14;
  const screenOnRight  = screenX > LENS_X;

  // ── Pointer drag handling
  const getX = useCallback((e) => {
    const svg  = svgRef.current;
    const rect = svg.getBoundingClientRect();
    return (e.clientX - rect.left) * (SVG_W / rect.width);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const x = getX(e);
    if (dragging === 'obj')    setObjX(clamp(x, 60, 330));
    if (dragging === 'screen') setScreenX(clamp(x, 368, 700));
  }, [dragging, getX]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  // ── Record reading
  const handleRecord = () => {
    if (isInf || do_px < 5) return;
    const di = parseFloat((v_px).toFixed(2));
    const doV = parseFloat(do_px.toFixed(2));
    setReadings(r => [...r, {
      lensType: isConvex ? "Convex" : "Concave",
      f: isConvex ? fCm : -fCm,
      do: doV, di, m: parseFloat(m.toFixed(3)),
      isVirt, isInverted: m < 0,
      inv_do: parseFloat((1 / doV).toFixed(5)),
      inv_di: parseFloat((1 / di).toFixed(5)),
      inv_f:  parseFloat((1 / (isConvex ? fCm : -fCm)).toFixed(5)),
    }]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const rayStyle = (color) => ({
    stroke: color,
    strokeWidth: 1.8,
    ...(slowMo ? { strokeDasharray: "8 12", strokeDashoffset: dashOff } : {}),
    filter: "url(#ll-glow)",
  });

  const lPath = lensPath(isConvex, fCm);

  return (
    <div className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-6 max-w-6xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-2">
          Interactive Optical Bench
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">Virtual Lenses</h2>
        <p className="text-muted-foreground text-sm">
          Drag the object (amber arrow) to see how the image moves. Drag the screen to find focus.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">

        {/* ── SVG Optical Bench ── */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl w-full select-none">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full max-w-full block"
            style={{ touchAction: "none" }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <filter id="ll-glow" x="-30%" y="-60%" width="160%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="ll-softglow" x="-40%" y="-80%" width="180%" height="260%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="ll-lens" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="0.18" />
                <stop offset="50%"  stopColor="#bae6fd" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.18" />
              </linearGradient>
              <clipPath id="ll-scene">
                <rect x={-5} y={-5} width={SVG_W + 10} height={SVG_H + 10} />
              </clipPath>
            </defs>

            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill="#0f172a" />

            {/* Subtle grid */}
            {Array.from({ length: 15 }, (_, i) => (
              <line key={`gx${i}`} x1={i * 51} y1={0} x2={i * 51} y2={SVG_H}
                stroke="#1e293b" strokeWidth={0.8} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`gy${i}`} x1={0} y1={i * 57} x2={SVG_W} y2={i * 57}
                stroke="#1e293b" strokeWidth={0.8} />
            ))}

            {/* Optical axis */}
            <line x1={10} y1={AXIS_Y} x2={SVG_W - 10} y2={AXIS_Y}
              stroke="#334155" strokeWidth={1.2} strokeDasharray="6 5" />

            {/* Focal length markers */}
            <FocalMarker cx={nearFX} cy={AXIS_Y} label="F" />
            <FocalMarker cx={farFX}  cy={AXIS_Y} label="F′" />

            {/* dₒ measurement bracket */}
            {do_px > 20 && (
              <>
                <line x1={objX} y1={AXIS_Y + 32} x2={LENS_X} y2={AXIS_Y + 32}
                  stroke="#64748b" strokeWidth={0.8} />
                <line x1={objX}   y1={AXIS_Y + 28} x2={objX}   y2={AXIS_Y + 36} stroke="#64748b" strokeWidth={0.8} />
                <line x1={LENS_X} y1={AXIS_Y + 28} x2={LENS_X} y2={AXIS_Y + 36} stroke="#64748b" strokeWidth={0.8} />
                <text x={(objX + LENS_X) / 2} y={AXIS_Y + 46}
                  textAnchor="middle" fontSize={9} fill="#94a3b8"
                  fontFamily="var(--font-body)">
                  dₒ = {do_px.toFixed(0)} cm
                </text>
              </>
            )}

            {/* dᵢ measurement bracket (only if image is on screen) */}
            {!isInf && imgX > LENS_X && imgX < 710 && (
              <>
                <line x1={LENS_X} y1={AXIS_Y + 32} x2={imgX} y2={AXIS_Y + 32}
                  stroke={isVirt ? "#e879f9" : "#22d3ee"} strokeWidth={0.8} strokeDasharray={isVirt ? "4 3" : "0"} />
                <line x1={LENS_X} y1={AXIS_Y + 28} x2={LENS_X} y2={AXIS_Y + 36} stroke="#64748b" strokeWidth={0.8} />
                <line x1={imgX}   y1={AXIS_Y + 28} x2={imgX}   y2={AXIS_Y + 36} stroke="#64748b" strokeWidth={0.8} />
                <text x={(LENS_X + imgX) / 2} y={AXIS_Y + 46}
                  textAnchor="middle" fontSize={9} fill={isVirt ? "#e879f9" : "#22d3ee"}
                  fontFamily="var(--font-body)">
                  dᵢ = {v_px.toFixed(0)} cm
                </text>
              </>
            )}
            {!isInf && imgX < LENS_X && imgX > -100 && (
              <>
                <line x1={imgX} y1={AXIS_Y + 32} x2={LENS_X} y2={AXIS_Y + 32}
                  stroke="#e879f9" strokeWidth={0.8} strokeDasharray="4 3" />
                <line x1={imgX}   y1={AXIS_Y + 28} x2={imgX}   y2={AXIS_Y + 36} stroke="#64748b" strokeWidth={0.8} />
                <line x1={LENS_X} y1={AXIS_Y + 28} x2={LENS_X} y2={AXIS_Y + 36} stroke="#64748b" strokeWidth={0.8} />
                <text x={(imgX + LENS_X) / 2} y={AXIS_Y + 46}
                  textAnchor="middle" fontSize={9} fill="#e879f9"
                  fontFamily="var(--font-body)">
                  dᵢ = {v_px.toFixed(0)} cm (virtual)
                </text>
              </>
            )}

            <g clipPath="url(#ll-scene)">

              {/* ══ RAYS ══ */}

              {/* ── Ray 1 (parallel) ── */}
              {rayVis.p && (
                <g>
                  {/* Before lens: horizontal */}
                  <line x1={objX} y1={objTipY} x2={LENS_X} y2={objTipY}
                    {...rayStyle("#f97316")} />
                  {/* After lens: refracted */}
                  <line
                    x1={LENS_X} y1={objTipY}
                    x2={r1_solidEnd.x} y2={r1_solidEnd.y}
                    {...rayStyle("#f97316")}
                  />
                  {/* Virtual backward extension */}
                  {r1_virtEnd && (
                    <line
                      x1={LENS_X} y1={objTipY}
                      x2={r1_virtEnd.x} y2={r1_virtEnd.y}
                      stroke="#f97316" strokeWidth={1.2} strokeDasharray="5 4"
                      filter="url(#ll-glow)" opacity={0.55}
                    />
                  )}
                  {/* Arrowhead at far focal for convex */}
                  {isConvex && !isVirt && !isInf && (
                    <Arrowhead x={r1_solidEnd.x} y={r1_solidEnd.y}
                      dy={r1_afterDy} color="#f97316" size={4} />
                  )}
                  {/* Far focal point indicator for convex */}
                  {isConvex && (
                    <text x={55} y={objTipY - 6} fontSize={8} fill="#f97316"
                      fontFamily="var(--font-body)" opacity={0.8}>parallel ray</text>
                  )}
                </g>
              )}

              {/* ── Ray 2 (central) ── */}
              {rayVis.c && (
                <g>
                  {/* Before lens */}
                  <line x1={objX} y1={objTipY} x2={LENS_X} y2={AXIS_Y}
                    {...rayStyle("#4ade80")} />
                  {/* After lens */}
                  <line x1={LENS_X} y1={AXIS_Y} x2={r2_endX} y2={r2_endY}
                    {...rayStyle("#4ade80")} />
                  {/* Virtual backward extension */}
                  {r2_virtEnd && (
                    <line x1={LENS_X} y1={AXIS_Y}
                      x2={r2_virtEnd.x} y2={r2_virtEnd.y}
                      stroke="#4ade80" strokeWidth={1.2} strokeDasharray="5 4"
                      filter="url(#ll-glow)" opacity={0.55}
                    />
                  )}
                  {!isVirt && !isInf && (
                    <Arrowhead x={r2_endX} y={r2_endY} dy={r2_endY - AXIS_Y} color="#4ade80" size={4} />
                  )}
                  <text x={55} y={AXIS_Y - 6} fontSize={8} fill="#4ade80"
                    fontFamily="var(--font-body)" opacity={0.8}>central ray</text>
                </g>
              )}

              {/* ── Ray 3 (focal) ── */}
              {rayVis.f && (
                <g>
                  {/* Before lens: from object tip toward focal target */}
                  <line x1={objX} y1={objTipY} x2={LENS_X} y2={r3y}
                    {...rayStyle("#818cf8")} />
                  {/* After lens: horizontal (exits parallel) */}
                  <line x1={LENS_X} y1={r3y} x2={r3_endX} y2={r3y}
                    {...rayStyle("#818cf8")} />
                  {/* Virtual backward extension */}
                  {r3_virtEnd && (
                    <line x1={LENS_X} y1={r3y}
                      x2={r3_virtEnd.x} y2={r3_virtEnd.y}
                      stroke="#818cf8" strokeWidth={1.2} strokeDasharray="5 4"
                      filter="url(#ll-glow)" opacity={0.55}
                    />
                  )}
                  {!isVirt && !isInf && (
                    <Arrowhead x={r3_endX} y={r3y} dy={0.01} color="#818cf8" size={4} />
                  )}
                  <text x={55} y={AXIS_Y + 18} fontSize={8} fill="#818cf8"
                    fontFamily="var(--font-body)" opacity={0.8}>focal ray</text>
                </g>
              )}

              {/* ══ LENS ══ */}
              {/* Lens glow */}
              <path d={lPath} fill="#60a5fa" fillOpacity={0.04} filter="url(#ll-softglow)" />
              {/* Lens body */}
              <path d={lPath} fill="url(#ll-lens)" stroke="#7dd3fc" strokeWidth={1.8} />
              {/* Lens axis line */}
              <line x1={LENS_X} y1={LENS_TOP - 8} x2={LENS_X} y2={LENS_TOP}
                stroke="#7dd3fc" strokeWidth={1.5} />
              <line x1={LENS_X} y1={LENS_BOT} x2={LENS_X} y2={LENS_BOT + 8}
                stroke="#7dd3fc" strokeWidth={1.5} />

              {/* ══ OBJECT ARROW ══ */}
              <g
                onPointerDown={(e) => { e.preventDefault(); setDragging('obj'); }}
                style={{ cursor: "ew-resize" }}
              >
                {/* Drag highlight */}
                <rect x={objX - 12} y={objTipY - 4} width={24} height={OBJ_H + 8}
                  fill="transparent" />
                {/* Arrow shaft */}
                <line x1={objX} y1={AXIS_Y} x2={objX} y2={objTipY}
                  stroke="#fbbf24" strokeWidth={2.8} filter="url(#ll-glow)" />
                {/* Arrowhead */}
                <polygon
                  points={`${objX - 6},${objTipY + 10} ${objX + 6},${objTipY + 10} ${objX},${objTipY}`}
                  fill="#fbbf24" filter="url(#ll-glow)"
                />
                {/* Base dot */}
                <circle cx={objX} cy={AXIS_Y} r={3.5} fill="#fbbf24" />
                {/* Label */}
                <text x={objX} y={objTipY - 8}
                  textAnchor="middle" fontSize={10} fill="#fbbf24"
                  fontFamily="var(--font-heading)" fontWeight="bold">Object</text>
              </g>

              {/* ══ IMAGE ARROW ══ */}
              {!isInf && Math.abs(imgX) < 750 && Math.abs(imgX - LENS_X) > 5 && (
                <g opacity={0.9}>
                  {/* Image arrow */}
                  <line
                    x1={imgX} y1={AXIS_Y} x2={imgX} y2={imgTipY}
                    stroke={isVirt ? "#e879f9" : "#22d3ee"}
                    strokeWidth={2.2}
                    strokeDasharray={isVirt ? "6 3" : "0"}
                    filter="url(#ll-glow)"
                  />
                  <polygon
                    points={`${imgX - 5},${imgTipY + 8} ${imgX + 5},${imgTipY + 8} ${imgX},${imgTipY}`}
                    fill={isVirt ? "#e879f9" : "#22d3ee"}
                    filter="url(#ll-glow)"
                  />
                  <circle cx={imgX} cy={AXIS_Y} r={3} fill={isVirt ? "#e879f9" : "#22d3ee"} />
                  <text x={imgX} y={imgTipY - 8}
                    textAnchor="middle" fontSize={9}
                    fill={isVirt ? "#e879f9" : "#22d3ee"}
                    fontFamily="var(--font-heading)" fontWeight="bold">
                    {isVirt ? "Virtual" : "Real"} Image
                  </text>
                </g>
              )}
              {isInf && (
                <text x={620} y={AXIS_Y - 20}
                  textAnchor="middle" fontSize={11} fill="#facc15"
                  fontFamily="var(--font-heading)" fontWeight="bold">
                  Image at ∞
                </text>
              )}

              {/* ══ SCREEN ══ */}
              {screenOnRight && (
                <g onPointerDown={(e) => { e.preventDefault(); setDragging('screen'); }}
                  style={{ cursor: "ew-resize" }}>
                  <rect x={screenX - 8} y={60} width={16} height={SVG_H - 80} fill="transparent" />
                  <line x1={screenX} y1={60} x2={screenX} y2={SVG_H - 60}
                    stroke="#94a3b8" strokeWidth={2.5} strokeDasharray={screenFocused ? "0" : "0"}
                    opacity={screenFocused ? 1 : 0.45}
                    filter={screenFocused ? "url(#ll-softglow)" : undefined}
                  />
                  {/* Screen image projection (focused/blurred) */}
                  {!isInf && (
                    <g>
                      {screenFocused ? (
                        /* Focused image at screen */
                        <>
                          <rect x={screenX - 3} y={Math.min(AXIS_Y, AXIS_Y - Math.abs(imgH))}
                            width={6} height={Math.abs(imgH)}
                            fill={isVirt ? "#e879f9" : "#22d3ee"} fillOpacity={0.8}
                            filter="url(#ll-glow)" />
                        </>
                      ) : (
                        /* Blurred/unfocused indicator */
                        <circle cx={screenX} cy={AXIS_Y}
                          r={clamp(Math.abs(screenX - clamp(imgX, 365, 750)) / 8, 2, 20)}
                          fill="#94a3b8" fillOpacity={0.25}
                          filter="url(#ll-softglow)" />
                      )}
                    </g>
                  )}
                  <text x={screenX} y={52}
                    textAnchor="middle" fontSize={8} fill={screenFocused ? "#22d3ee" : "#475569"}
                    fontFamily="var(--font-body)">
                    {screenFocused ? "✓ FOCUSED" : "Screen"}
                  </text>
                </g>
              )}

            </g>{/* end clip */}

            {/* ══ Info overlay (top-left) ══ */}
            <rect x={8} y={8} width={110} height={50} rx={6}
              fill="#0f172a" fillOpacity={0.85} stroke="#1e293b" strokeWidth={1} />
            <text x={16} y={24} fontSize={9} fill="#94a3b8" fontFamily="var(--font-body)">
              {isConvex ? "Convex (converging)" : "Concave (diverging)"}
            </text>
            <text x={16} y={38} fontSize={10} fill="#7dd3fc"
              fontFamily="var(--font-heading)" fontWeight="bold">
              f = {isConvex ? "" : "−"}{fCm} cm
            </text>
            <text x={16} y={50} fontSize={8} fill={isVirt ? "#e879f9" : "#22d3ee"}
              fontFamily="var(--font-body)">
              Image: {isInf ? "∞" : (isVirt ? "Virtual, upright" : (m > 0 ? "Real, upright" : "Real, inverted"))}
            </text>

          </svg>
        </div>

        {/* ── Controls Panel ── */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[265px]">

          {/* Lens type */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Lens Type</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Convex", sub: "converging", val: true },
                { label: "Concave", sub: "diverging", val: false },
              ].map(({ label, sub, val }) => (
                <button key={label}
                  onClick={() => setIsConvex(val)}
                  className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    isConvex === val
                      ? "bg-violet-500/12 border-violet-400 text-violet-700"
                      : "bg-muted/40 border-border text-muted-foreground"
                  }`}
                >
                  {/* Tiny lens icon */}
                  <svg viewBox="0 0 30 20" width={30} height={20}>
                    <path d={val
                      ? "M 15,1 C 11,5 11,15 15,19 C 19,15 19,5 15,1 Z"
                      : "M 15,1 C 19,5 19,15 15,19 C 11,15 11,5 15,1 Z"}
                      fill="#7dd3fc" fillOpacity={0.4} stroke="#7dd3fc" strokeWidth={1.2}
                    />
                  </svg>
                  {label}
                  <span className="text-[9px] font-normal opacity-60">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Focal length */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Focal Length
              </p>
              <span className="text-sm font-bold text-violet-600 font-heading">{fCm} cm</span>
            </div>
            <input type="range" min={30} max={175} step={5} value={fCm}
              onChange={e => setFCm(+e.target.value)}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>30 cm (strong)</span><span>175 cm (weak)</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {[50, 80, 120, 160].map(f => (
                <button key={f} onClick={() => setFCm(f)}
                  className={`text-[10px] py-1 rounded-lg border transition-all ${
                    fCm === f ? "bg-violet-500 text-white border-violet-500" : "bg-muted text-muted-foreground border-border"
                  }`}>{f}</button>
              ))}
            </div>
          </div>

          {/* Ray toggles */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Principal Rays
            </p>
            {[
              { key: "p", label: "Parallel ray",  color: "bg-orange-500" },
              { key: "c", label: "Central ray",   color: "bg-green-500"  },
              { key: "f", label: "Focal ray",     color: "bg-indigo-400" },
            ].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer mb-2">
                <div onClick={() => setRayVis(r => ({ ...r, [key]: !r[key] }))}
                  className={`w-9 h-5 rounded-full relative shrink-0 transition-colors ${rayVis[key] ? color : "bg-muted"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${rayVis[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-muted-foreground">{label}</span>
              </label>
            ))}
            {/* Slow motion */}
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <div onClick={() => setSlowMo(s => !s)}
                className={`w-9 h-5 rounded-full relative shrink-0 transition-colors ${slowMo ? "bg-violet-500" : "bg-muted"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${slowMo ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              <span className="text-xs text-muted-foreground">Slow-motion light</span>
            </label>
          </div>

          {/* Live formula */}
          <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
            <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-2">
              Thin Lens Formula
            </p>
            <p className="text-base font-extrabold font-heading text-violet-600 mb-2">
              1/f = 1/dₒ + 1/dᵢ
            </p>
            <div className="space-y-1 text-xs">
              {[
                { label: "f", val: `${isConvex ? "" : "−"}${fCm} cm` },
                { label: "dₒ", val: `${do_px.toFixed(1)} cm` },
                { label: "dᵢ", val: isInf ? "∞" : `${v_px.toFixed(1)} cm ${isVirt ? "(virtual)" : ""}` },
                { label: "|m|", val: isInf ? "∞" : Math.abs(m).toFixed(3) },
              ].map(c => (
                <div key={c.label} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{c.label}</span>
                  <motion.span key={c.val}
                    initial={{ scale: 1.06 }} animate={{ scale: 1 }}
                    className="font-bold font-heading text-violet-600 text-xs">
                    {c.val}
                  </motion.span>
                </div>
              ))}
            </div>
            {/* Formula verification */}
            {!isInf && (
              <div className="mt-2 pt-2 border-t border-violet-500/15 text-[10px] text-muted-foreground">
                1/{isConvex ? "" : "−"}{fCm} ≈ 1/{do_px.toFixed(0)} + 1/{v_px.toFixed(0)}
              </div>
            )}
          </div>

          {/* Image properties */}
          <div className="p-3 rounded-2xl bg-card border border-border space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Image Properties
            </p>
            {[
              { label: "Type",        val: isInf ? "—" : (isVirt ? "Virtual" : "Real"),
                color: isVirt ? "text-fuchsia-600" : "text-cyan-600" },
              { label: "Orientation", val: isInf ? "—" : (m < 0 ? "Inverted" : "Upright"),
                color: m < 0 ? "text-orange-500" : "text-emerald-600" },
              { label: "Size",        val: isInf ? "—" : (Math.abs(m) > 1 ? "Magnified" : Math.abs(m) < 1 ? "Reduced" : "Same"),
                color: "text-foreground" },
              { label: "Magnification", val: isInf ? "∞" : `×${Math.abs(m).toFixed(2)}`,
                color: "text-violet-600" },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <span className={`text-xs font-bold ${c.color}`}>{c.val}</span>
              </div>
            ))}
          </div>

          {/* Reset + Record */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="w-9 h-9 shrink-0"
              onClick={() => { setObjX(210); setFCm(90); setIsConvex(true); setScreenX(550); }}>
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={handleRecord}
              disabled={isInf || do_px < 5}
              className={`flex-1 gap-2 text-sm border-0 ${
                justAdded
                  ? "bg-emerald-500 text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white"
              } disabled:opacity-40`}
            >
              <Plus className="w-4 h-4" />
              {justAdded ? "✓ Recorded!" : "Record Reading"}
            </Button>
          </div>

          {readings.length > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-xs text-muted-foreground">
              {readings.length} reading{readings.length !== 1 ? "s" : ""} recorded
            </motion.p>
          )}
        </div>
      </div>

      {readings.length >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="px-4 py-2 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold">
          Good data! Head to the Data tab to plot 1/dₒ vs 1/dᵢ →
        </motion.div>
      )}
    </div>
  );
}
