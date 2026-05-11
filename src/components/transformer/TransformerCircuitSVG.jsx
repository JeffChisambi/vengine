import React from "react";
import { motion } from "framer-motion";

/* ── Shared mini symbols ─────────────────────────────── */
function ACSourceSymbol({ x, y, r = 18, color = "#6366f1" }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="2" />
      <motion.path
        d={`M ${x - r + 5} ${y} Q ${x - r / 2} ${y - 10} ${x} ${y} Q ${x + r / 2} ${y + 10} ${x + r - 5} ${y}`}
        fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <text x={x} y={y + r + 12} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">AC</text>
    </g>
  );
}

function LampSymbol({ x, y, on = false, r = 10 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={on ? "#fef3c7" : "#f1f5f9"} stroke={on ? "#f59e0b" : "#94a3b8"} strokeWidth="1.8" />
      <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} stroke={on ? "#f59e0b" : "#94a3b8"} strokeWidth="1.5" strokeLinecap="round" />
      <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} stroke={on ? "#f59e0b" : "#94a3b8"} strokeWidth="1.5" strokeLinecap="round" />
      {on && (
        <motion.circle cx={x} cy={y} r={r + 4} fill="#fef3c7" fillOpacity="0"
          stroke="#f59e0b" strokeWidth="1"
          animate={{ r: [r + 3, r + 7, r + 3], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }} />
      )}
    </g>
  );
}

function VmSymbol({ x, y, label = "V", color = "#16a34a", reading = null }) {
  return (
    <g>
      <circle cx={x} cy={y} r={14} fill="white" stroke={color} strokeWidth="1.8" />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{label}</text>
      {reading !== null && (
        <text x={x} y={y + 22} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={color}>{reading}V</text>
      )}
    </g>
  );
}

function AmSymbol({ x, y, reading = null }) {
  return (
    <g>
      <circle cx={x} cy={y} r={14} fill="white" stroke="#ef4444" strokeWidth="1.8" />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="11" fontWeight="800" fill="#ef4444">A</text>
      {reading !== null && (
        <text x={x} y={y + 22} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#ef4444">{reading}A</text>
      )}
    </g>
  );
}

function CoreTransformer({ x, y, np = 5, ns = 5, fluxActive = false }) {
  const coreW = 80, coreH = 70;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Core top & bottom */}
      <rect x="0"  y="0"  width={coreW} height="12" rx="2" fill="#475569" stroke="#334155" strokeWidth="1.2" />
      <rect x="0"  y={coreH - 12} width={coreW} height="12" rx="2" fill="#475569" stroke="#334155" strokeWidth="1.2" />
      {/* Core legs */}
      <rect x="0"  y="0" width="14" height={coreH} rx="2" fill="#475569" stroke="#334155" strokeWidth="1.2" />
      <rect x={coreW / 2 - 7} y="0" width="14" height={coreH} rx="2" fill="#475569" stroke="#334155" strokeWidth="1.2" />
      <rect x={coreW - 14} y="0" width="14" height={coreH} rx="2" fill="#475569" stroke="#334155" strokeWidth="1.2" />
      {/* Primary coil turns (left window) */}
      {Array.from({ length: np }, (_, i) => {
        const y0 = 14 + i * ((coreH - 28) / np);
        return (
          <path key={`p${i}`}
            d={`M 14 ${y0} A 7 3.5 0 0 0 14 ${y0 + (coreH - 28) / np}`}
            fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        );
      })}
      {/* Secondary coil turns (right window) */}
      {Array.from({ length: ns }, (_, i) => {
        const y0 = 14 + i * ((coreH - 28) / ns);
        return (
          <path key={`s${i}`}
            d={`M ${coreW - 14} ${y0} A 7 3.5 0 0 1 ${coreW - 14} ${y0 + (coreH - 28) / ns}`}
            fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        );
      })}
      {/* Flux arrows in center leg */}
      <motion.g animate={{ opacity: fluxActive ? [0.2, 0.7, 0.2] : [0.1, 0.15, 0.1] }}
        transition={{ duration: 1.4, repeat: Infinity }}>
        <polygon points={`${coreW/2-1},16 ${coreW/2+1},16 ${coreW/2},10`} fill="#818cf8" />
        <polygon points={`${coreW/2-1},${coreH-16} ${coreW/2+1},${coreH-16} ${coreW/2},${coreH-10}`} fill="#818cf8" />
      </motion.g>
      {/* Primary leads */}
      <line x1="14"  y1="14"        x2="0"  y2="14"        stroke="#b45309" strokeWidth="2" />
      <line x1="14"  y1={coreH - 14} x2="0"  y2={coreH - 14} stroke="#b45309" strokeWidth="2" />
      {/* Secondary leads */}
      <line x1={coreW - 14} y1="14"         x2={coreW} y2="14"         stroke="#b45309" strokeWidth="2" />
      <line x1={coreW - 14} y1={coreH - 14} x2={coreW} y2={coreH - 14} stroke="#b45309" strokeWidth="2" />
      {/* Labels */}
      <text x="-4"   y={coreH / 2 + 4} textAnchor="end"   fontSize="9" fill="#64748b" fontWeight="700">P</text>
      <text x={coreW + 4} y={coreH / 2 + 4} textAnchor="start" fontSize="9" fill="#64748b" fontWeight="700">S</text>
    </g>
  );
}

/* ── Intro animated concept SVG ─────────────────────── */
export function TransformerIntroSVG() {
  const W = 380, H = 220;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-sm mx-auto">
      {/* Primary coil (left) */}
      <text x="40" y="30" textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="700">PRIMARY</text>
      <text x="40" y="42" textAnchor="middle" fontSize="8" fill="#94a3b8">Np turns</text>
      {/* AC source */}
      <ACSourceSymbol x={40} y={100} r={20} color="#6366f1" />
      {/* Left circuit lines */}
      <line x1={40} y1={80}  x2={40} y2={52} stroke="#6366f1" strokeWidth="2" />
      <line x1={40} y1={52}  x2={110} y2={52} stroke="#6366f1" strokeWidth="2" />
      <line x1={40} y1={120} x2={40} y2={168} stroke="#6366f1" strokeWidth="2" />
      <line x1={40} y1={168} x2={110} y2={168} stroke="#6366f1" strokeWidth="2" />

      {/* Transformer core */}
      <CoreTransformer x={110} y={75} np={4} ns={6} fluxActive />

      {/* Flux label */}
      <text x={192} y={112} textAnchor="middle" fontSize="8" fill="#818cf8" fontWeight="700">Φ</text>
      <motion.text x={192} y={122} textAnchor="middle" fontSize="7" fill="#818cf8"
        animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }}>
        flux
      </motion.text>

      {/* Right circuit */}
      <text x={340} y={30} textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="700">SECONDARY</text>
      <text x={340} y={42} textAnchor="middle" fontSize="8" fill="#94a3b8">Ns turns</text>
      <line x1={190} y1={89}  x2={290} y2={89}  stroke="#22c55e" strokeWidth="2" />
      <line x1={290} y1={89}  x2={290} y2={52}  stroke="#22c55e" strokeWidth="2" />
      <line x1={290} y1={52}  x2={340} y2={52}  stroke="#22c55e" strokeWidth="2" />
      <line x1={190} y1={145} x2={290} y2={145} stroke="#22c55e" strokeWidth="2" />
      <line x1={290} y1={145} x2={290} y2={168} stroke="#22c55e" strokeWidth="2" />
      <line x1={290} y1={168} x2={340} y2={168} stroke="#22c55e" strokeWidth="2" />
      {/* Lamp on secondary */}
      <LampSymbol x={340} y={110} on r={18} />
      <line x1={340} y1={52}  x2={340} y2={92}  stroke="#22c55e" strokeWidth="2" />
      <line x1={340} y1={128} x2={340} y2={168} stroke="#22c55e" strokeWidth="2" />

      {/* Current arrows on primary */}
      <motion.path d="M 40 52 L 80 52"
        fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 8"
        animate={{ strokeDashoffset: [0, -14] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
      {/* Current arrows on secondary */}
      <motion.path d="M 190 89 L 250 89"
        fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 8"
        animate={{ strokeDashoffset: [0, -14] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />

      {/* Labels Vp / Vs */}
      <text x={75} y={100} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="700">Vp</text>
      <text x={305} y={120} textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="700">Vs</text>
    </svg>
  );
}

/* ── Full circuit diagram ─────────────────────────── */
export function TransformerCircuitSVG({ np = 4, ns = 4, vp = 240, running = false, showReadings = false }) {
  const W = 540, H = 280;
  const vs = vp * (ns / np);
  const rl = 100; // load resistance
  const is = vs / rl;
  const ip = is * (ns / np);
  const lampBrightness = Math.min(1, vs / 240);
  const lampOn = running && vs > 20;

  /* circuit box corners */
  const TL_X = 55, TL_Y = 40;
  const TR_X = 490, TR_Y = 40;
  const BL_X = 55, BL_Y = 240;
  const BR_X = 490, BR_Y = 240;
  const MID_X = 270;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 200 }}>
      <defs>
        <marker id="arrowI" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="#6366f1" />
        </marker>
        <marker id="arrowIs" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill="#22c55e" />
        </marker>
      </defs>

      {/* Grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="hsl(220,14%,96%)" strokeWidth={0.5} />
      ))}

      {/* Primary loop lines */}
      <polyline points={`${TL_X},${TL_Y} ${MID_X - 45},${TL_Y}`} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={`${TL_X},${TL_Y} ${TL_X},${BL_Y} ${MID_X - 45},${BL_Y}`} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Secondary loop lines */}
      <polyline points={`${MID_X + 45},${TL_Y} ${TR_X},${TL_Y} ${TR_X},${TR_Y}`} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />
      <polyline points={`${MID_X + 45},${BL_Y} ${BR_X},${BL_Y} ${BR_X},${BR_Y}`} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinejoin="round" />

      {/* AC Source */}
      <ACSourceSymbol x={TL_X} y={(TL_Y + BL_Y) / 2} r={20} color="#6366f1" />

      {/* Voltmeter Vp (parallel with primary) */}
      <VmSymbol x={115} y={(TL_Y + BL_Y) / 2} color="#6366f1" label="Vp"
        reading={showReadings ? vp.toFixed(0) : null} />
      <line x1={115} y1={(TL_Y + BL_Y) / 2 - 14} x2={115} y2={TL_Y} stroke="#6366f1" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={115} y1={(TL_Y + BL_Y) / 2 + 14} x2={115} y2={BL_Y} stroke="#6366f1" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Ammeter Ip (series on top wire) */}
      <AmSymbol x={175} y={TL_Y} reading={showReadings ? ip.toFixed(3) : null} />
      <line x1={TL_X}  y1={TL_Y} x2={161} y2={TL_Y} stroke="#6366f1" strokeWidth="2.5" />
      <line x1={189} y1={TL_Y} x2={MID_X - 45} y2={TL_Y} stroke="#6366f1" strokeWidth="2.5" />

      {/* Transformer */}
      <CoreTransformer x={MID_X - 40} y={(TL_Y + BL_Y) / 2 - 35} np={np} ns={ns} fluxActive={running} />

      {/* Connect transformer to circuit lines */}
      <line x1={MID_X - 40} y1={(TL_Y + BL_Y) / 2 - 21} x2={MID_X - 45} y2={TL_Y} stroke="#6366f1" strokeWidth="2" />
      <line x1={MID_X - 40} y1={(TL_Y + BL_Y) / 2 + 21} x2={MID_X - 45} y2={BL_Y} stroke="#6366f1" strokeWidth="2" />
      <line x1={MID_X + 40} y1={(TL_Y + BL_Y) / 2 - 21} x2={MID_X + 45} y2={TL_Y} stroke="#22c55e" strokeWidth="2" />
      <line x1={MID_X + 40} y1={(TL_Y + BL_Y) / 2 + 21} x2={MID_X + 45} y2={BL_Y} stroke="#22c55e" strokeWidth="2" />

      {/* Voltmeter Vs (parallel with secondary) */}
      <VmSymbol x={400} y={(TL_Y + BL_Y) / 2} color="#22c55e" label="Vs"
        reading={showReadings ? vs.toFixed(1) : null} />
      <line x1={400} y1={(TL_Y + BL_Y) / 2 - 14} x2={400} y2={TL_Y} stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={400} y1={(TL_Y + BL_Y) / 2 + 14} x2={400} y2={BL_Y} stroke="#22c55e" strokeWidth="1.2" strokeDasharray="3 3" />

      {/* Lamp (load) */}
      <LampSymbol x={TR_X} y={(TL_Y + BR_Y) / 2} on={lampOn} r={16} />
      <line x1={TR_X} y1={TL_Y}          x2={TR_X} y2={(TL_Y + BR_Y) / 2 - 16} stroke="#22c55e" strokeWidth="2.5" />
      <line x1={TR_X} y1={(TL_Y + BR_Y) / 2 + 16} x2={TR_X} y2={BR_Y} stroke="#22c55e" strokeWidth="2.5" />

      {/* Animated current on primary */}
      {running && (
        <>
          <motion.path d={`M ${TL_X} ${TL_Y} L ${MID_X - 45} ${TL_Y}`}
            fill="none" stroke="#6366f188" strokeWidth="3" strokeDasharray="8 12"
            animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
          <motion.path d={`M ${MID_X + 45} ${TL_Y} L ${TR_X} ${TL_Y}`}
            fill="none" stroke="#22c55e88" strokeWidth="3" strokeDasharray="8 12"
            animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
        </>
      )}

      {/* Primary / Secondary labels */}
      <text x={(TL_X + MID_X - 45) / 2} y={TL_Y - 10} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="700">PRIMARY</text>
      <text x={(MID_X + 45 + TR_X) / 2} y={TL_Y - 10} textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="700">SECONDARY</text>

      {/* Turns ratio label */}
      {showReadings && (
        <motion.text x={MID_X} y={BL_Y + 22} textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="800"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Np:Ns = {np}:{ns} → Vp:Vs = {vp}:{vs.toFixed(0)}V
        </motion.text>
      )}
    </svg>
  );
}

/* ── Magnetic flux / induction concept diagram ─────── */
export function FluxDiagramSVG({ active = false }) {
  const W = 400, H = 180;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Primary coil label */}
      <text x={60} y={20} textAnchor="middle" fontSize="10" fill="#6366f1" fontWeight="700">Primary coil</text>
      {/* AC arrow */}
      <motion.path d="M 20 90 Q 40 70 60 90 Q 80 110 100 90"
        fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: active ? [0.5, 1, 0.5] : [0.2, 0.3, 0.2] }}
        transition={{ duration: 1.0, repeat: Infinity }} />
      <text x={60} y={130} textAnchor="middle" fontSize="9" fill="#6366f1">changing current</text>

      {/* Flux arrows */}
      {[-30, -15, 0, 15, 30].map((dy, i) => (
        <motion.line key={i}
          x1={155} y1={90 + dy} x2={245} y2={90 + dy}
          stroke="#818cf8" strokeWidth={i === 2 ? 2.5 : 1.5}
          strokeLinecap="round"
          animate={{ opacity: active ? [0.3, 0.8, 0.3] : [0.1, 0.15, 0.1] }}
          transition={{ duration: 1.0, delay: i * 0.08, repeat: Infinity }} />
      ))}
      <motion.polygon points="240,85 248,90 240,95" fill="#818cf8"
        animate={{ opacity: active ? [0.4, 1, 0.4] : 0.1 }}
        transition={{ duration: 1.0, repeat: Infinity }} />
      <text x={200} y={20} textAnchor="middle" fontSize="10" fill="#818cf8" fontWeight="700">magnetic flux Φ</text>
      <text x={200} y={155} textAnchor="middle" fontSize="9" fill="#818cf8">through iron core</text>

      {/* Secondary */}
      <text x={340} y={20} textAnchor="middle" fontSize="10" fill="#22c55e" fontWeight="700">Secondary coil</text>
      <motion.path d="M 300 90 Q 320 70 340 90 Q 360 110 380 90"
        fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"
        animate={{ opacity: active ? [0.5, 1, 0.5] : [0.1, 0.2, 0.1] }}
        transition={{ duration: 1.0, delay: 0.25, repeat: Infinity }} />
      <text x={340} y={130} textAnchor="middle" fontSize="9" fill="#22c55e">induced EMF (Vs)</text>

      {/* Faraday formula */}
      <text x={200} y={170} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
        Vs = −Ns · dΦ/dt  (Faraday's law)
      </text>
    </svg>
  );
}
