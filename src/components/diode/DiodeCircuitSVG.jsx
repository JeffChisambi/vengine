import React from "react";
import { motion } from "framer-motion";

/* ── Shared sub-shapes ─────────────────────────────────────────── */
function BatterySymbol({ x, y, voltage = 9, flipped = false }) {
  const sign = flipped ? -1 : 1;
  return (
    <g>
      <line x1={x} y1={y - 22 * sign} x2={x} y2={y - 10 * sign} stroke="#64748b" strokeWidth={2} />
      <line x1={x - 14} y1={y - 10 * sign} x2={x + 14} y2={y - 10 * sign} stroke="#10b981" strokeWidth={2.5} />
      <line x1={x - 9} y1={y - 2 * sign} x2={x + 9} y2={y - 2 * sign} stroke="#475569" strokeWidth={4} />
      <line x1={x} y1={y - 2 * sign} x2={x} y2={y + 10 * sign} stroke="#64748b" strokeWidth={2} />
      <line x1={x - 14} y1={y + 10 * sign} x2={x + 14} y2={y + 10 * sign} stroke="#10b981" strokeWidth={2.5} />
      <line x1={x - 9} y1={y + 18 * sign} x2={x + 9} y2={y + 18 * sign} stroke="#475569" strokeWidth={4} />
      <line x1={x} y1={y + 18 * sign} x2={x} y2={y + 28 * sign} stroke="#64748b" strokeWidth={2} />
      <text x={x + 22} y={y - 6 * sign} fontSize={10} fill="#10b981" fontWeight="800">+</text>
      <text x={x + 22} y={y + 22 * sign} fontSize={10} fill="#64748b" fontWeight="800">−</text>
      <text x={x - 22} y={y + 5} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight="700">{voltage}V</text>
    </g>
  );
}

function DiodeSymbol({ x, y, horizontal = true, blocked = false, color = "#8b5cf6" }) {
  if (horizontal) {
    return (
      <g>
        {/* Triangle pointing right */}
        <polygon points={`${x - 14},${y - 12} ${x - 14},${y + 12} ${x + 8},${y}`}
          fill={color} fillOpacity="0.7" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Cathode bar */}
        <line x1={x + 8} y1={y - 13} x2={x + 8} y2={y + 13} stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Lead lines */}
        <line x1={x - 22} y1={y} x2={x - 14} y2={y} stroke="#94a3b8" strokeWidth="2.5" />
        <line x1={x + 8} y1={y} x2={x + 18} y2={y} stroke="#94a3b8" strokeWidth="2.5" />
        {/* Labels */}
        <text x={x - 22} y={y + 20} textAnchor="middle" fontSize="8" fill="#94a3b8">A</text>
        <text x={x + 20} y={y + 20} textAnchor="middle" fontSize="8" fill="#94a3b8">K</text>
        {blocked && (
          <>
            <line x1={x - 10} y1={y - 14} x2={x + 12} y2={y + 14} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <line x1={x + 12} y1={y - 14} x2={x - 10} y2={y + 14} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          </>
        )}
      </g>
    );
  }
  return null;
}

function ResistorSymbol({ x, y, horizontal = true, label = "1kΩ", color = "#f59e0b" }) {
  if (horizontal) {
    return (
      <g>
        <rect x={x - 24} y={y - 9} width={48} height={18} rx={3} fill="white" stroke={color} strokeWidth={1.8} />
        <polyline
          points={`${x - 17},${y} ${x - 11},${y - 7} ${x - 4},${y + 7} ${x + 3},${y - 7} ${x + 10},${y + 7} ${x + 17},${y - 7} ${x + 21},${y}`}
          fill="none" stroke={color} strokeWidth={1.4} />
        <text x={x} y={y - 16} textAnchor="middle" fontSize={9} fill="#94a3b8">{label}</text>
      </g>
    );
  }
  return (
    <g>
      <rect x={x - 9} y={y - 24} width={18} height={48} rx={3} fill="white" stroke={color} strokeWidth={1.8} />
      <polyline
        points={`${x},${y - 17} ${x - 7},${y - 11} ${x + 7},${y - 4} ${x - 7},${y + 3} ${x + 7},${y + 10} ${x - 7},${y + 17} ${x},${y + 21}`}
        fill="none" stroke={color} strokeWidth={1.4} />
      <text x={x + 16} y={y + 4} textAnchor="start" fontSize={9} fill="#94a3b8">{label}</text>
    </g>
  );
}

function LEDSymbol({ cx, cy, on = false }) {
  const ledColor = on ? "#22c55e" : "#94a3b8";
  return (
    <g>
      <polygon points={`${cx - 10},${cy - 10} ${cx - 10},${cy + 10} ${cx + 6},${cy}`}
        fill={ledColor} fillOpacity="0.75" stroke={ledColor} strokeWidth="1.5" strokeLinejoin="round" />
      <line x1={cx + 6} y1={cy - 11} x2={cx + 6} y2={cy + 11} stroke={ledColor} strokeWidth="2.5" strokeLinecap="round" />
      {on && (
        <>
          <motion.line x1={cx + 10} y1={cy - 10} x2={cx + 18} y2={cy - 18}
            stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"
            animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />
          <motion.line x1={cx + 14} y1={cy - 5} x2={cx + 22} y2={cy - 10}
            stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"
            animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.2, delay: 0.3, repeat: Infinity }} />
        </>
      )}
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="8" fill={on ? "#22c55e" : "#94a3b8"} fontWeight="600">LED</text>
    </g>
  );
}

function CurrentDot({ path, speed = 1, color = "#22c55e", delay = 0 }) {
  return (
    <motion.circle
      r={4.5}
      fill={color}
      opacity={0.85}
      style={{ offsetPath: `path("${path}")`, offsetDistance: "0%" }}
      animate={{ offsetDistance: ["0%", "100%"] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear", delay }}
    />
  );
}

function CurrentArrow({ d, color = "#22c55e", speed = 1 }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeDasharray="8 14"
      strokeLinecap="round"
      animate={{ strokeDashoffset: [0, -22] }}
      transition={{ duration: 22 / (speed * 18), repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Complete Setup SVG (snapshot shown before experiment) ─── */
export function DiodeSetupSVG({ phase = 0 }) {
  const W = 500, H = 320;
  const showBreadboard = phase >= 0;
  const showDiode = phase >= 1;
  const showResistor = phase >= 2;
  const showLED = phase >= 3;
  const showBattery = phase >= 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 200 }}>
      {/* Grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}

      {/* Breadboard base */}
      {showBreadboard && (
        <g>
          <rect x={60} y={140} width={380} height={100} rx={8}
            fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} />
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={80 + i * 12} cy={175} r={2.5} fill="#94a3b8" opacity={0.6} />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <circle key={i} cx={80 + i * 12} cy={205} r={2.5} fill="#94a3b8" opacity={0.6} />
          ))}
          <text x={250} y={256} textAnchor="middle" fontSize={9} fill="#94a3b8" fontWeight="600">BREADBOARD</text>
        </g>
      )}

      {/* Diode on breadboard */}
      {showDiode && (
        <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <rect x={155} y={148} width={80} height={24} rx={10} fill="#1e293b" stroke="#0f172a" strokeWidth={1.5} />
          <rect x={220} y={148} width={16} height={24} rx={0} fill="#e2e8f0" opacity={0.9} />
          <rect x={234} y={148} width={2} height={24} rx={10} fill="#1e293b" />
          <polygon points="172,160 196,152 196,168" fill="#8b5cf6" fillOpacity="0.8" stroke="#8b5cf6" strokeWidth="1.5" />
          <line x1={196} y1={151} x2={196} y2={169} stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={155} y1={160} x2={155} y2={175} stroke="#94a3b8" strokeWidth={3} />
          <line x1={235} y1={160} x2={235} y2={175} stroke="#94a3b8" strokeWidth={3} />
          <text x={195} y={140} textAnchor="middle" fontSize={9} fill="#8b5cf6" fontWeight="700">DIODE</text>
          <text x={145} y={170} textAnchor="middle" fontSize={8} fill="#64748b">A</text>
          <text x={245} y={170} textAnchor="middle" fontSize={8} fill="#64748b">K</text>
        </motion.g>
      )}

      {/* Resistor on breadboard */}
      {showResistor && (
        <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <rect x={270} y={151} width={60} height={18} rx={5}
            fill="#c8956a" stroke="#8b5e3c" strokeWidth={1.5} />
          <rect x={270} y={151} width={10} height={18} rx={5} fill="#c0c0c0" stroke="#94a3b8" strokeWidth={1} />
          <rect x={320} y={151} width={10} height={18} rx={5} fill="#c0c0c0" stroke="#94a3b8" strokeWidth={1} />
          <rect x={281} y={151} width={6} height={18} fill="#ef4444" opacity={0.85} />
          <rect x={292} y={151} width={6} height={18} fill="#ef4444" opacity={0.85} />
          <rect x={303} y={151} width={6} height={18} fill="#fbbf24" opacity={0.85} />
          <line x1={275} y1={160} x2={275} y2={175} stroke="#94a3b8" strokeWidth={3} />
          <line x1={325} y1={160} x2={325} y2={175} stroke="#94a3b8" strokeWidth={3} />
          <text x={300} y={140} textAnchor="middle" fontSize={9} fill="#d97706" fontWeight="700">1kΩ</text>
        </motion.g>
      )}

      {/* LED on breadboard */}
      {showLED && (
        <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <ellipse cx={380} cy={155} rx={14} ry={18} fill="#bbf7d0" stroke="#86efac" strokeWidth={1.5} opacity={0.85} />
          <rect x={376} y={163} width={4} height={10} rx={1} fill="#64748b" />
          <line x1={374} y1={170} x2={374} y2={175} stroke="#94a3b8" strokeWidth={3} />
          <line x1={384} y1={173} x2={384} y2={175} stroke="#94a3b8" strokeWidth={3} />
          <text x={380} y={140} textAnchor="middle" fontSize={9} fill="#22c55e" fontWeight="700">LED</text>
        </motion.g>
      )}

      {/* Battery / wires */}
      {showBattery && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          {/* Battery block */}
          <rect x={70} y={50} width={50} height={72} rx={6} fill="#1e293b" stroke="#0f172a" strokeWidth={2} />
          <rect x={72} y={72} width={46} height={40} fill="#dc2626" />
          <text x={95} y={98} textAnchor="middle" fontSize={8} fill="#fbbf24" fontWeight="700" transform="rotate(-90,95,98)">9V</text>
          <rect x={88} y={38} width={14} height={14} rx={4} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1.5} />
          <text x={95} y={49} textAnchor="middle" fontSize={10} fill="#dc2626" fontWeight="700">+</text>
          <rect x={78} y={120} width={34} height={8} rx={3} fill="#94a3b8" stroke="#64748b" strokeWidth={1.5} />
          {/* Red wire + */}
          <path d="M 95 38 L 95 20 L 155 20 L 155 140" fill="none" stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
          {/* Black wire − */}
          <path d="M 95 128 L 95 270 L 384 270 L 384 175" fill="none" stroke="#1e293b" strokeWidth={3} strokeLinecap="round" />
          {/* Connecting wires between components */}
          <line x1={235} y1={175} x2={275} y2={175} stroke="#22c55e" strokeWidth={3} strokeLinecap="round" />
          <line x1={325} y1={175} x2={366} y2={175} stroke="#22c55e" strokeWidth={3} strokeLinecap="round" />
          <text x={95} y={30} textAnchor="middle" fontSize={8} fill="#ef4444" fontWeight="600">9V+</text>
          <text x={200} y={170} textAnchor="middle" fontSize={8} fill="#22c55e" fontWeight="600" transform="translate(0,-6)">→</text>
          <text x={344} y={170} textAnchor="middle" fontSize={8} fill="#22c55e" fontWeight="600" transform="translate(0,-6)">→</text>
        </motion.g>
      )}
    </svg>
  );
}

/* ── Forward Bias Circuit ─────────────────────────────────── */
export function ForwardBiasSVG({ running = false, voltage = 9 }) {
  const W = 500, H = 300;
  const LX = 55, RX = 460, TY = 50, BY = 260;
  const BATT_MID_Y = 155;
  const circuitPath = `M${LX},${TY} L${RX},${TY} L${RX},${BY} L${LX},${BY} L${LX},${TY}`;
  const current = voltage / 1000 * 0.85;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 200 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}

      {/* Base wire */}
      <polyline points={`${LX},${TY} ${RX},${TY} ${RX},${BY} ${LX},${BY} ${LX},${TY}`}
        fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Animated current */}
      {running && (
        <CurrentArrow d={circuitPath} color="#22c55e" speed={2.5} />
      )}

      {/* Battery on left */}
      <BatterySymbol x={LX} y={BATT_MID_Y} voltage={voltage} />

      {/* Diode on top wire */}
      <DiodeSymbol x={200} y={TY} horizontal blocked={false} color="#8b5cf6" />

      {/* Resistor on top wire */}
      <ResistorSymbol x={340} y={TY} horizontal label="1kΩ" color="#f59e0b" />

      {/* LED on right wire */}
      <LEDSymbol cx={RX} cy={155} on={running} />

      {/* Voltage labels */}
      {running && (
        <>
          <rect x={158} y={TY + 18} width={72} height={16} rx={8} fill="#8b5cf620" />
          <text x={194} y={TY + 30} textAnchor="middle" fontSize={9} fill="#8b5cf6" fontWeight="700">0.7V drop</text>
          <rect x={298} y={TY + 18} width={60} height={16} rx={8} fill="#f59e0b20" />
          <text x={328} y={TY + 30} textAnchor="middle" fontSize={9} fill="#d97706" fontWeight="700">{(current * 1000).toFixed(1)}mA</text>
        </>
      )}

      {/* Direction label */}
      <text x={200} y={TY - 20} textAnchor="middle" fontSize={10} fill="#22c55e" fontWeight="700">
        {running ? "✓ Current flows freely" : "Forward Bias — Anode(+) → Cathode(−)"}
      </text>
    </svg>
  );
}

/* ── Reverse Bias Circuit ─────────────────────────────────── */
export function ReverseBiasSVG({ running = false }) {
  const W = 500, H = 300;
  const LX = 55, RX = 460, TY = 50, BY = 260;
  const BATT_MID_Y = 155;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 200 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke="hsl(220,14%,95%)" strokeWidth={0.5} />
      ))}

      {/* Base wire */}
      <polyline points={`${LX},${TY} ${RX},${TY} ${RX},${BY} ${LX},${BY} ${LX},${TY}`}
        fill="none" stroke="#cbd5e1" strokeWidth={2.5} strokeLinejoin="round" />

      {/* Battery on left */}
      <BatterySymbol x={LX} y={BATT_MID_Y} voltage={9} />

      {/* Diode REVERSED on top wire — triangle pointing left = blocked */}
      <g>
        <polygon points={`${214},${TY} ${214},${TY + 24} ${192},${TY + 12}`}
          fill="#ef4444" fillOpacity="0.7" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1={192} y1={TY - 1} x2={192} y2={TY + 25} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
        <line x1={174} y1={TY + 12} x2={192} y2={TY + 12} stroke="#94a3b8" strokeWidth="2.5" />
        <line x1={214} y1={TY + 12} x2={232} y2={TY + 12} stroke="#94a3b8" strokeWidth="2.5" />
        <text x={174} y={TY + 32} textAnchor="middle" fontSize="8" fill="#94a3b8">K</text>
        <text x={234} y={TY + 32} textAnchor="middle" fontSize="8" fill="#94a3b8">A</text>
        {/* Block X */}
        <line x1={182} y1={TY + 2} x2={218} y2={TY + 22} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <line x1={218} y1={TY + 2} x2={182} y2={TY + 22} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      </g>

      {/* Resistor */}
      <ResistorSymbol x={340} y={TY} horizontal label="1kΩ" color="#94a3b8" />

      {/* LED — off */}
      <LEDSymbol cx={RX} cy={155} on={false} />

      {/* Blocking barrier effect */}
      {running && (
        <motion.g
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <rect x={170} y={TY + 36} width={80} height={20} rx={10} fill="#ef444420" />
          <text x={210} y={TY + 50} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight="700">BLOCKED ✗</text>
          <text x={RX} y={190} textAnchor="middle" fontSize={9} fill="#94a3b8">LED off</text>
          <text x={RX} y={200} textAnchor="middle" fontSize={8} fill="#94a3b8">no current</text>
        </motion.g>
      )}

      <text x={200} y={TY - 20} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight="700">
        Reverse Bias — Cathode(+) → Anode(−) — current blocked
      </text>
    </svg>
  );
}

/* ── Half-wave Rectification SVG ──────────────────────────── */
export function HalfWaveSVG({ time = 0, running = false }) {
  const W = 500, H = 300;
  const GRAPH_X = 60, GRAPH_Y = 60, GRAPH_W = 400, GRAPH_H = 190;
  const points = 200;
  const freq = 1.5;

  // Generate AC input waveform
  const acPoints = Array.from({ length: points }, (_, i) => {
    const t = (i / points) * 4 * Math.PI * freq;
    const x = GRAPH_X + (i / points) * GRAPH_W;
    const y = GRAPH_Y + GRAPH_H / 2 - Math.sin(t + time * freq * 2) * (GRAPH_H * 0.38);
    return `${x},${y}`;
  }).join(" ");

  // Generate rectified (half-wave) output
  const rectPoints = Array.from({ length: points }, (_, i) => {
    const t = (i / points) * 4 * Math.PI * freq;
    const raw = Math.sin(t + time * freq * 2);
    const val = Math.max(0, raw);
    const x = GRAPH_X + (i / points) * GRAPH_W;
    const y = GRAPH_Y + GRAPH_H / 2 - val * (GRAPH_H * 0.38);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minHeight: 200 }}>
      {/* Panel background */}
      <rect x={GRAPH_X - 10} y={GRAPH_Y - 10} width={GRAPH_W + 20} height={GRAPH_H + 20}
        rx={10} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1.5} />

      {/* Grid lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={i}
          x1={GRAPH_X} y1={GRAPH_Y + (i / 4) * GRAPH_H}
          x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + (i / 4) * GRAPH_H}
          stroke="#e2e8f0" strokeWidth={1} />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i}
          x1={GRAPH_X + (i / 8) * GRAPH_W} y1={GRAPH_Y}
          x2={GRAPH_X + (i / 8) * GRAPH_W} y2={GRAPH_Y + GRAPH_H}
          stroke="#e2e8f0" strokeWidth={1} />
      ))}

      {/* Zero line */}
      <line x1={GRAPH_X} y1={GRAPH_Y + GRAPH_H / 2}
        x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + GRAPH_H / 2}
        stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" />

      {/* AC input waveform */}
      <polyline points={acPoints} fill="none" stroke="#3b82f6" strokeWidth={2} opacity={0.6} />

      {/* Rectified output */}
      <polyline points={rectPoints} fill="none" stroke="#22c55e" strokeWidth={2.5} />

      {/* Shaded rectified area */}
      {Array.from({ length: points - 1 }, (_, i) => {
        const t = (i / points) * 4 * Math.PI * freq;
        const raw = Math.sin(t + time * freq * 2);
        if (raw <= 0) return null;
        const x = GRAPH_X + (i / points) * GRAPH_W;
        const y = GRAPH_Y + GRAPH_H / 2 - raw * (GRAPH_H * 0.38);
        const midY = GRAPH_Y + GRAPH_H / 2;
        return <line key={i} x1={x} y1={y} x2={x} y2={midY} stroke="#22c55e" strokeWidth={1.5} opacity={0.15} />;
      })}

      {/* Axes */}
      <line x1={GRAPH_X} y1={GRAPH_Y} x2={GRAPH_X} y2={GRAPH_Y + GRAPH_H} stroke="#94a3b8" strokeWidth={1.5} />
      <line x1={GRAPH_X} y1={GRAPH_Y + GRAPH_H} x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + GRAPH_H} stroke="#94a3b8" strokeWidth={1.5} />

      {/* Labels */}
      <text x={GRAPH_X - 8} y={GRAPH_Y + 4} textAnchor="end" fontSize={9} fill="#64748b">+V</text>
      <text x={GRAPH_X - 8} y={GRAPH_Y + GRAPH_H + 4} textAnchor="end" fontSize={9} fill="#64748b">−V</text>
      <text x={GRAPH_X - 8} y={GRAPH_Y + GRAPH_H / 2 + 4} textAnchor="end" fontSize={9} fill="#94a3b8">0</text>
      <text x={GRAPH_X + GRAPH_W + 4} y={GRAPH_Y + GRAPH_H + 14} fontSize={9} fill="#64748b">time →</text>

      {/* Legend */}
      <line x1={GRAPH_X + 10} y1={GRAPH_Y + GRAPH_H + 36} x2={GRAPH_X + 30} y2={GRAPH_Y + GRAPH_H + 36} stroke="#3b82f6" strokeWidth={2} opacity={0.6} />
      <text x={GRAPH_X + 35} y={GRAPH_Y + GRAPH_H + 40} fontSize={9} fill="#3b82f6">AC input (sine wave)</text>
      <line x1={GRAPH_X + 170} y1={GRAPH_Y + GRAPH_H + 36} x2={GRAPH_X + 190} y2={GRAPH_Y + GRAPH_H + 36} stroke="#22c55e" strokeWidth={2.5} />
      <text x={GRAPH_X + 195} y={GRAPH_Y + GRAPH_H + 40} fontSize={9} fill="#22c55e">DC output (rectified)</text>

      {/* Diode symbol in top corner */}
      <g transform="translate(440, 30)">
        <polygon points="-10,8 -10,-8 6,0" fill="#8b5cf6" fillOpacity="0.8" stroke="#8b5cf6" strokeWidth="1" />
        <line x1={6} y1={-9} x2={6} y2={9} stroke="#8b5cf6" strokeWidth="2" />
        <text x={0} y={22} textAnchor="middle" fontSize={8} fill="#8b5cf6" fontWeight="600">Diode</text>
      </g>
    </svg>
  );
}

/* ── Intro animated circuit ───────────────────────────────── */
export function DiodeIntroSVG() {
  const W = 320, H = 220;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
      {/* Circuit rectangle */}
      <rect x={30} y={30} width={260} height={160} rx={6} fill="none" stroke="#e2e8f0" strokeWidth={2} />
      {/* Animated current */}
      <motion.rect x={30} y={30} width={260} height={160} rx={6}
        fill="none" stroke="#8b5cf6" strokeWidth={2.5}
        strokeDasharray="10 16"
        animate={{ strokeDashoffset: [0, -26] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Battery left */}
      <line x1={30} y1={80} x2={30} y2={68} stroke="#64748b" strokeWidth={2} />
      <line x1={20} y1={68} x2={40} y2={68} stroke="#10b981" strokeWidth={2.5} />
      <line x1={23} y1={76} x2={37} y2={76} stroke="#475569" strokeWidth={4} />
      <line x1={30} y1={76} x2={30} y2={94} stroke="#64748b" strokeWidth={2} />
      <line x1={20} y1={94} x2={40} y2={94} stroke="#10b981" strokeWidth={2.5} />
      <line x1={23} y1={102} x2={37} y2={102} stroke="#475569" strokeWidth={4} />
      <line x1={30} y1={102} x2={30} y2={120} stroke="#64748b" strokeWidth={2} />
      <text x={48} y={74} fontSize={9} fill="#10b981" fontWeight="800">+</text>
      <text x={48} y={106} fontSize={9} fill="#64748b" fontWeight="800">−</text>
      <text x={22} y={24} fontSize={10} fill="#f59e0b" fontWeight="700">9V</text>

      {/* Diode on top */}
      <polygon points={`130,30 130,50 152,40`} fill="#8b5cf6" fillOpacity="0.8" stroke="#8b5cf6" strokeWidth="1.5" />
      <line x1={152} y1={29} x2={152} y2={51} stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
      <text x={141} y={20} textAnchor="middle" fontSize={9} fill="#8b5cf6" fontWeight="700">Diode</text>

      {/* Resistor right side */}
      <rect x={272} y={80} width={16} height={40} rx={3} fill="white" stroke="#f59e0b" strokeWidth={1.8} />
      <polyline points={`280,84 273,90 287,96 273,102 287,108 273,114 280,118`}
        fill="none" stroke="#f59e0b" strokeWidth={1.4} />
      <text x={296} y={104} fontSize={9} fill="#f59e0b" fontWeight="700">1kΩ</text>

      {/* LED bottom */}
      <polygon points={`130,190 130,170 152,180`} fill="#22c55e" fillOpacity="0.8" stroke="#22c55e" strokeWidth="1.5" />
      <line x1={152} y1={169} x2={152} y2={191} stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
      <motion.line x1={158} y1={172} x2={166} y2={164} stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"
        animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
      <motion.line x1={162} y1={178} x2={170} y2={173} stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"
        animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1, delay: 0.3, repeat: Infinity }} />
      <text x={141} y={208} textAnchor="middle" fontSize={9} fill="#22c55e" fontWeight="700">LED</text>
    </svg>
  );
}
