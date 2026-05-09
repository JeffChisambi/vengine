import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Shared data ─────────────────────────────────────────── */
export const OSMOSIS_RESULTS = [
  { conc:"0 M",   molar:0,   label:"Distilled water", initial:5.0, final:5.40, pct:+8.0,  color:"#38bdf8", tc:"#0369a1", type:"Hypotonic"  },
  { conc:"0.2 M", molar:0.2, label:"0.2 M NaCl",      initial:5.0, final:5.15, pct:+3.0,  color:"#818cf8", tc:"#4338ca", type:"Hypotonic"  },
  { conc:"0.5 M", molar:0.5, label:"0.5 M NaCl",      initial:5.0, final:4.95, pct:-1.0,  color:"#4ade80", tc:"#15803d", type:"Isotonic"   },
  { conc:"1.0 M", molar:1.0, label:"1.0 M NaCl",      initial:5.0, final:4.40, pct:-12.0, color:"#fb923c", tc:"#c2410c", type:"Hypertonic" },
];

/* ─── Pre-computed NaCl particle positions per beaker ─────── */
const NaCl_PTS = [
  [],
  [[8,22],[20,38],[36,16],[46,34]],
  [[6,18],[14,36],[22,50],[32,26],[42,44],[16,54],[38,16],[48,56],[24,8],[10,62]],
  [[5,16],[12,32],[20,48],[28,20],[36,38],[44,54],[48,28],[10,56],[24,12],[40,64],
   [15,44],[32,8],[52,40],[6,70],[38,68],[22,66],[45,14],[18,24],[50,58],[30,50],
   [8,40],[42,24],[16,60],[36,28],[52,16]],
];

/* ─── SVG 0: Intro — semi-permeable membrane diagram ─────── */
export function OsmosisIntroSVG() {
  const leftW  = [[36,92],[54,128],[70,100],[40,158],[92,115],[24,143],[82,172],[110,97],[46,188],[120,154],[30,170],[90,202],[114,80],[58,208],[98,178],[72,150]];
  const rightW = [[198,110],[240,140],[275,94],[220,178],[260,165],[284,130],[205,195],[268,90]];
  const leftS  = [[74,130],[106,175]];
  const rightS = [[180,94],[214,134],[255,112],[185,164],[235,185],[270,150],[200,195],[278,94],[222,60]];

  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <linearGradient id="oiL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#eff6ff" /><stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        <linearGradient id="oiR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef9c3" /><stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <filter id="oiGlow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      <rect width="300" height="280" rx="12" fill="#f8fafc" />
      <rect x="15" y="55" width="135" height="185" rx="4" fill="url(#oiL)" />
      <rect x="150" y="55" width="135" height="185" rx="4" fill="url(#oiR)" />
      <rect x="15" y="55" width="270" height="185" rx="4" fill="none" stroke="#94a3b8" strokeWidth="1.8" />

      {/* Membrane segments */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x="146" y={59+i*26} width="8" height="18" rx="2" fill="#64748b" />
      ))}
      {/* Pores */}
      {[85,140,195].map(y => (
        <ellipse key={y} cx="150" cy={y} rx="5" ry="7.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      ))}
      <text x="150" y="252" textAnchor="middle" fontSize="7.5" fill="#64748b" fontWeight="600">Semi-permeable membrane</text>

      <text x="82" y="70" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#1d4ed8">Dilute Solution</text>
      <text x="82" y="81" textAnchor="middle" fontSize="7" fill="#3b82f6">High water potential (ψ)</text>
      <text x="218" y="70" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#b45309">Concentrated Solution</text>
      <text x="218" y="81" textAnchor="middle" fontSize="7" fill="#d97706">Low water potential (ψ)</text>

      {leftW.map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r={3.5} fill="#60a5fa" fillOpacity={0.8}
          animate={{ cy:[y,y-3,y] }}
          transition={{ duration:1.4+i*0.13, delay:i*0.08, repeat:Infinity, ease:"easeInOut" }} />
      ))}
      {rightW.map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r={3.5} fill="#60a5fa" fillOpacity={0.7}
          animate={{ cy:[y,y-3,y] }}
          transition={{ duration:1.7+i*0.2, delay:i*0.12, repeat:Infinity, ease:"easeInOut" }} />
      ))}
      {leftS.map(([x,y],i)  => <circle key={i} cx={x} cy={y} r={5.5} fill="#f472b6" fillOpacity={0.75} />)}
      {rightS.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={5.5} fill="#f472b6" fillOpacity={0.75} />)}

      <motion.circle r={4.5} fill="#0ea5e9" filter="url(#oiGlow)"
        animate={{ cx:[80,144,156,215], cy:[142,140,140,142], opacity:[0.9,0.9,0.9,0] }}
        transition={{ duration:2.8, repeat:Infinity, ease:"linear", times:[0,0.43,0.57,1] }} />
      <motion.circle r={4.5} fill="#0ea5e9" filter="url(#oiGlow)"
        animate={{ cx:[50,144,156,250], cy:[175,172,172,178], opacity:[0,0.9,0.9,0] }}
        transition={{ duration:2.8, repeat:Infinity, ease:"linear", delay:1.4, times:[0,0.43,0.57,1] }} />

      <motion.g animate={{ x:[0,6,0] }} transition={{ duration:1.4, repeat:Infinity, ease:"easeInOut" }}>
        <line x1={115} y1={222} x2={175} y2={222} stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="175,217 186,222 175,227" fill="#0284c7" />
      </motion.g>
      <text x="150" y="240" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0284c7">Net water movement (osmosis)</text>

      <circle cx={20} cy={265} r={3.5} fill="#60a5fa" fillOpacity={0.8} />
      <text x="26" y="269" fontSize="7.5" fill="#475569">H₂O molecule</text>
      <circle cx={110} cy={265} r={5.5} fill="#f472b6" fillOpacity={0.75} />
      <text x="118" y="269" fontSize="7.5" fill="#475569">Solute particle</text>
      <rect x="200" y="261" width="8" height="8" rx="1" fill="#64748b" />
      <text x="212" y="269" fontSize="7.5" fill="#475569">Membrane</text>
    </svg>
  );
}

/* ─── SVG 1: Solution setup ──────────────────────────────── */
export function SolutionSetupSVG({ phase = -1 }) {
  const W=55, H=115, GAP=16, SX=17;
  const concs  = ["0 M",  "0.2 M","0.5 M","1.0 M"];
  const colors = ["#bfdbfe","#c7d2fe","#d8b4fe","#fca5a5"];

  return (
    <svg viewBox="0 0 300 270" className="w-full h-full">
      <defs>
        <linearGradient id="osBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0fdf4" /><stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
      </defs>
      <rect width="300" height="270" rx="12" fill="url(#osBg)" />
      <rect x="0" y="235" width="300" height="35" fill="#e2e8f0" />
      <rect x="0" y="231" width="300" height="6" fill="#cbd5e1" />

      <line x1={SX} y1={34} x2={SX+4*(W+GAP)-GAP} y2={34} stroke="#94a3b8" strokeWidth="1.5" />
      <polygon points={`${SX+4*(W+GAP)-GAP},30 ${SX+4*(W+GAP)-GAP+8},34 ${SX+4*(W+GAP)-GAP},38`} fill="#94a3b8" />
      <text x="148" y="26" textAnchor="middle" fontSize="7.5" fill="#64748b">Increasing NaCl concentration →</text>

      {concs.map((c, i) => {
        const x = SX + i*(W+GAP);
        const y = 55;
        const active = i <= phase;
        const liqH = H * 0.68;
        const liqY = y + H - liqH;
        const pts = NaCl_PTS[i];
        return (
          <motion.g key={i} initial={{ opacity:0, y:-8 }} animate={{ opacity:active?1:0.22, y:0 }}
            transition={{ duration:0.5, delay:i*0.12 }}>
            <rect x={x+1.5} y={liqY} width={W-3} height={liqH} fill={colors[i]} fillOpacity={0.38} />
            <path d={`M${x},${y} L${x},${y+H} Q${x},${y+H+4} ${x+4},${y+H+4} L${x+W-4},${y+H+4} Q${x+W},${y+H+4} ${x+W},${y+H} L${x+W},${y}`}
              fill="none" stroke={active?"#22c55e":"#94a3b8"} strokeWidth={active?2:1.5} />
            <line x1={x-3} y1={y} x2={x+W+3} y2={y} stroke={active?"#22c55e":"#94a3b8"} strokeWidth={active?2:1.5} strokeLinecap="round" />
            {active && pts.map(([px,py],pi) => (
              <motion.circle key={pi} cx={x+px} cy={liqY+4+py} r={2.8} fill="#fb923c" fillOpacity={0.82}
                initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:pi*0.04 }} />
            ))}
            {active && [0,1,2,3].map(wi => (
              <motion.circle key={wi} cx={x+7+wi*12} cy={liqY+liqH-12-wi*8} r={2}
                fill="#60a5fa" fillOpacity={0.65}
                animate={{ cy:[liqY+liqH-12-wi*8, liqY+liqH-16-wi*8, liqY+liqH-12-wi*8] }}
                transition={{ duration:2, repeat:Infinity, delay:wi*0.4 }} />
            ))}
            <text x={x+W/2} y={y-10} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={active?"#166534":"#94a3b8"}>{c}</text>
            {active && <text x={x+W/2} y={y+H+18} textAnchor="middle" fontSize="7" fill="#64748b">{i===0?"H₂O only":"NaCl"}</text>}
            {active && (
              <motion.circle cx={x+W/2} cy={y-24} r={4} fill="#22c55e"
                animate={{ scale:[1,1.25,1] }} transition={{ duration:1.1, repeat:Infinity }} />
            )}
          </motion.g>
        );
      })}
      <text x="150" y="254" textAnchor="middle" fontSize="9" fontWeight="600" fill="#166534">
        {phase < 0 ? "Ready to prepare first solution" : phase < 3 ? `Solution ${phase+1}/4 prepared` : "All 4 solutions ready!"}
      </text>
    </svg>
  );
}

/* ─── SVG 2: Potato cutting ──────────────────────────────── */
export function PotatoCutSVG({ cuts = 0 }) {
  const SW=40, SH=11, SY=178;
  const sColors = ["#d97706","#b45309","#92400e","#78350f"];
  const scale = 220/10; // ruler: 10 cm in 220px
  return (
    <svg viewBox="0 0 300 270" className="w-full h-full">
      <defs>
        <linearGradient id="pcBg"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fefce8" /><stop offset="100%" stopColor="#fff7ed" /></linearGradient>
        <linearGradient id="pcPot"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#92400e" /></linearGradient>
      </defs>
      <rect width="300" height="270" rx="12" fill="url(#pcBg)" />

      {/* Ruler */}
      <rect x="30" y="195" width="240" height="26" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      {[0,1,2,3,4,5,6,7,8,9,10].map(n => {
        const rx = 30 + n*24;
        return (
          <g key={n}>
            <line x1={rx} y1={195} x2={rx} y2={n%5===0?207:202} stroke="#b45309" strokeWidth={n%5===0?1.5:1} />
            {n%5===0 && <text x={rx} y={216} textAnchor="middle" fontSize="7" fill="#92400e">{n}</text>}
          </g>
        );
      })}
      <text x="278" y="228" textAnchor="end" fontSize="7" fill="#b45309">cm</text>

      {/* Potato body */}
      <ellipse cx={76} cy={120} rx={56} ry={38} fill="url(#pcPot)" />
      <ellipse cx={66} cy={109} rx={18} ry={10} fill="#fbbf24" fillOpacity={0.25} />
      {[[64,113,3],[87,131,2],[52,129,2.5]].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#92400e" fillOpacity={0.4} />
      ))}
      <text x="76" y="170" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400e">Potato</text>

      {/* Cut lines */}
      {Array.from({length:Math.min(cuts,4)},(_,i) => (
        <motion.line key={i} x1={102+i*7} y1={84} x2={102+i*7} y2={156}
          stroke="#fef9c3" strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.3 }} />
      ))}

      {/* Cut strips */}
      {Array.from({length:Math.min(cuts,4)},(_,i) => (
        <motion.g key={i} initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.4 }}>
          <rect x={150+i*(SW+8)} y={SY} width={SW} height={SH} rx="3" fill={sColors[i]} />
          <text x={150+i*(SW+8)+SW/2} y={SY+8.5} textAnchor="middle" fontSize="6.5" fill="#fef3c7" fontWeight="600">5.0 cm</text>
          <line x1={150+i*(SW+8)} y1={SY+SH+4} x2={150+i*(SW+8)+SW} y2={SY+SH+4} stroke="#d97706" strokeWidth="1" />
          <polygon points="0,0 4,3 0,6" fill="#d97706" transform={`translate(${150+i*(SW+8)},${SY+SH+1})`} />
          <polygon points="0,0 -4,3 0,6" fill="#d97706" transform={`translate(${150+i*(SW+8)+SW},${SY+SH+1})`} />
        </motion.g>
      ))}

      <text x="150" y="240" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#92400e">
        {cuts===0 ? "Click to cut the first strip"
         : cuts<4  ? `${cuts}/4 strips cut — 5.0 cm each`
                   : "All 4 strips cut and measured!"}
      </text>
      <text x="150" y="254" textAnchor="middle" fontSize="8" fill="#b45309">Each strip: 5.0 cm initial length</text>
    </svg>
  );
}

/* ─── SVG 3: Strip insertion ─────────────────────────────── */
export function StripInsertSVG() {
  const W=55, H=115, GAP=16, SX=17;
  const concs  = ["0 M","0.2 M","0.5 M","1.0 M"];
  const colors = ["#bfdbfe","#c7d2fe","#d8b4fe","#fca5a5"];

  return (
    <svg viewBox="0 0 300 270" className="w-full h-full">
      <defs>
        <linearGradient id="osInsBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0fdf4" /><stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
      </defs>
      <rect width="300" height="270" rx="12" fill="url(#osInsBg)" />
      <rect x="0" y="235" width="300" height="35" fill="#e2e8f0" />
      <rect x="0" y="231" width="300" height="6" fill="#cbd5e1" />

      {concs.map((c, i) => {
        const x = SX + i*(W+GAP);
        const y = 55;
        const liqH = H*0.68;
        const liqY = y + H - liqH;
        return (
          <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:i*0.18 }}>
            <rect x={x+1.5} y={liqY} width={W-3} height={liqH} fill={colors[i]} fillOpacity={0.4} />
            <path d={`M${x},${y} L${x},${y+H} Q${x},${y+H+4} ${x+4},${y+H+4} L${x+W-4},${y+H+4} Q${x+W},${y+H+4} ${x+W},${y+H} L${x+W},${y}`}
              fill="none" stroke="#22c55e" strokeWidth="2" />
            <line x1={x-3} y1={y} x2={x+W+3} y2={y} stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            {NaCl_PTS[i].map(([px,py],pi) => (
              <circle key={pi} cx={x+px} cy={liqY+4+py} r={2.8} fill="#fb923c" fillOpacity={0.75} />
            ))}
            {/* Strip dropping in */}
            <motion.g initial={{ y:-52 }} animate={{ y:0 }}
              transition={{ duration:0.7, delay:i*0.22, type:"spring", stiffness:70 }}>
              <rect x={x+8} y={liqY+10} width={W-16} height={9} rx="3" fill="#d97706" />
              <text x={x+W/2} y={liqY+18} textAnchor="middle" fontSize="6" fill="#fef3c7">5.0 cm</text>
            </motion.g>
            <motion.ellipse cx={x+W/2} cy={liqY+5} rx={0} ry={2} fill="none"
              stroke={colors[i]} strokeWidth="1.5"
              animate={{ rx:[0,22], opacity:[0.9,0] }}
              transition={{ duration:0.55, delay:i*0.22+0.55 }} />
            <text x={x+W/2} y={y-10} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#166534">{c}</text>
            <text x={x+W/2} y={y+H+18} textAnchor="middle" fontSize="7" fill="#64748b">NaCl</text>
          </motion.g>
        );
      })}
      <text x="150" y="254" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#166534">
        Strips submerged — osmosis begins immediately
      </text>
    </svg>
  );
}

/* ─── SVG 4: Osmosis in action (4-panel) ─────────────────── */
export function OsmosisActiveSVG({ elapsed = 0, running = false }) {
  const panels = [
    { conc:"0 M",   label:"Hypotonic",  dir:+1, color:"#bfdbfe", dW: (elapsed/30)*0.08 },
    { conc:"0.2 M", label:"Hypotonic",  dir:+1, color:"#c7d2fe", dW: (elapsed/30)*0.03 },
    { conc:"0.5 M", label:"Isotonic",   dir: 0, color:"#bbf7d0", dW:-(elapsed/30)*0.01 },
    { conc:"1.0 M", label:"Hypertonic", dir:-1, color:"#fca5a5", dW:-(elapsed/30)*0.12 },
  ];
  const PW=118, PH=95;
  const positions = [[16,28],[158,28],[16,132],[158,132]];

  return (
    <svg viewBox="0 0 300 250" className="w-full h-full">
      <rect width="300" height="250" rx="12" fill="#f8fafc" />

      {panels.map(({ conc, label, dir, color, dW }, i) => {
        const [px,py] = positions[i];
        const cx = px + PW/2;
        const midY = py + PH*0.54;
        const baseW = 44;
        const curW  = baseW * (1 + dW);
        return (
          <g key={i}>
            <rect x={px} y={py} width={PW} height={PH} rx="8" fill={color} fillOpacity={0.28} stroke={color} strokeWidth="1.5" />
            <text x={cx} y={py+13} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#1e293b">{conc} NaCl</text>
            <text x={cx} y={py+23} textAnchor="middle" fontSize="6.5" fill="#64748b">{label}</text>
            <rect x={px+4} y={py+26} width={PW-8} height={PH-29} rx="4" fill={color} fillOpacity={0.4} />
            {/* Potato strip — width animated with osmosis */}
            <motion.rect y={midY-5} height={10} rx="3" fill="#d97706"
              animate={{ width:curW, x:cx-curW/2 }} transition={{ duration:0.5 }} />
            {/* Water arrows moving in or out */}
            {dir !== 0 && running && [0,1,2].map(j => (
              <motion.circle key={j} r={3} fill="#38bdf8"
                animate={dir > 0
                  ? { cx:[cx-32-j*5, cx-14], cy:[midY+j*5-4, midY], opacity:[0,0.9,0] }
                  : { cx:[cx+14, cx+32+j*5], cy:[midY, midY+j*5-4], opacity:[0,0.9,0] }}
                transition={{ duration:1.2, delay:j*0.4, repeat:Infinity }} />
            ))}
            {dir===0 && running && [-1,1].map((d,j) => (
              <motion.circle key={j} r={2.5} fill="#94a3b8"
                animate={{ cx:[cx+d*16, cx+d*24], cy:[midY, midY+2], opacity:[0,0.6,0] }}
                transition={{ duration:1.5, delay:j*0.75, repeat:Infinity }} />
            ))}
            <text x={cx} y={py+PH-5} textAnchor="middle" fontSize="6.5" fill="#0f172a" fontWeight="600">
              {dir>0 ? "Water entering →" : dir<0 ? "← Water leaving" : "Equilibrium ⇌"}
            </text>
          </g>
        );
      })}

      <rect x="40" y="236" width="220" height="5" rx="2.5" fill="#e2e8f0" />
      <motion.rect x="40" y="236" height="5" rx="2.5" fill="#22c55e"
        animate={{ width:(elapsed/30)*220 }} transition={{ duration:0.3 }} />
      <text x="150" y="250" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="600">
        {elapsed} / 30 min elapsed
      </text>
    </svg>
  );
}

/* ─── SVG 5: Measure results ─────────────────────────────── */
export function MeasureResultsSVG() {
  const SX=22, SH=12, scale=220/6;
  const initY=62, finalY=148;
  return (
    <svg viewBox="0 0 300 275" className="w-full h-full">
      <defs>
        <linearGradient id="mrBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fefce8" /><stop offset="100%" stopColor="#fff7ed" />
        </linearGradient>
      </defs>
      <rect width="300" height="275" rx="12" fill="url(#mrBg)" />

      {[initY, finalY].map(sy => (
        <g key={sy}>
          <rect x={SX} y={sy+SH+5} width={222} height={18} rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
          {[0,1,2,3,4,5,6].map(n => {
            const rx = SX + n*scale;
            return (
              <g key={n}>
                <line x1={rx} y1={sy+SH+5} x2={rx} y2={n%2===0?sy+SH+15:sy+SH+11} stroke="#b45309" strokeWidth={n%2===0?1.2:0.8} />
                {n%2===0 && <text x={rx} y={sy+SH+24} textAnchor="middle" fontSize="6.5" fill="#92400e">{n}</text>}
              </g>
            );
          })}
          <text x={SX+226} y={sy+SH+19} fontSize="7" fill="#b45309">cm</text>
        </g>
      ))}

      <text x="150" y="52" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400e">Before (5.0 cm each)</text>
      <text x="150" y="138" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">After 30 minutes</text>

      {OSMOSIS_RESULTS.map((r,i) => {
        const yOff = i*(SH+4);
        const beforeW = 5.0 * scale;
        const afterW  = r.final * scale;
        const gain = r.pct > 0;
        const stripColor = gain ? "#38bdf8" : r.pct < -5 ? "#f97316" : "#4ade80";
        return (
          <g key={i}>
            <rect x={SX} y={initY+yOff} width={beforeW} height={SH} rx="3" fill="#d97706" fillOpacity={0.8} />
            <text x={SX+beforeW+5} y={initY+yOff+9} fontSize="7" fill="#92400e">{r.conc}</text>
            <motion.rect x={SX} y={finalY+yOff} height={SH} rx="3"
              fill={stripColor} fillOpacity={0.88}
              initial={{ width:0 }} animate={{ width:afterW }}
              transition={{ duration:0.85, delay:i*0.14 }} />
            <motion.text x={SX+afterW+5} y={finalY+yOff+9}
              fontSize="7" fontWeight="700"
              fill={gain ? "#0369a1" : r.pct<-5 ? "#c2410c" : "#15803d"}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.14+0.8 }}>
              {r.final} cm ({r.pct>0?"+":""}{r.pct}%)
            </motion.text>
          </g>
        );
      })}

      <rect x={20}  y={242} width={12} height={8} rx="2" fill="#38bdf8" fillOpacity={0.88} />
      <text x={35}  y={250} fontSize="7.5" fill="#475569">Gained mass</text>
      <rect x={120} y={242} width={12} height={8} rx="2" fill="#4ade80" fillOpacity={0.88} />
      <text x={135} y={250} fontSize="7.5" fill="#475569">≈ Isotonic</text>
      <rect x={210} y={242} width={12} height={8} rx="2" fill="#f97316" fillOpacity={0.88} />
      <text x={225} y={250} fontSize="7.5" fill="#475569">Lost mass</text>
    </svg>
  );
}

/* ─── SVG 7: Concentration–mass change graph ─────────────── */
export function OsmosisGraphSVG() {
  const GX=52, GY=18, GW=214, GH=182;
  const yTop=10, yBot=-15, yRange=yTop-yBot;
  const xScale = GW / 1.0;
  const yScale = GH / yRange;
  const yZero  = GY + (yTop/yRange)*GH;

  const pts = OSMOSIS_RESULTS.map(r => ({
    x: GX + r.molar*xScale,
    y: yZero - r.pct*yScale,
    ...r,
  }));

  const curve = `M${pts[0].x},${pts[0].y} C${pts[0].x+42},${pts[0].y} ${pts[1].x-20},${pts[1].y} ${pts[1].x},${pts[1].y} C${pts[1].x+22},${pts[1].y} ${pts[2].x-18},${pts[2].y} ${pts[2].x},${pts[2].y} C${pts[2].x+18},${pts[2].y} ${pts[3].x-32},${pts[3].y} ${pts[3].x},${pts[3].y}`;

  return (
    <svg viewBox="0 0 300 235" className="w-full h-full">
      <rect width="300" height="235" rx="12" fill="#f8fafc" />

      {[-15,-10,-5,0,5,10].map(v => {
        const gy = yZero - v*yScale;
        return (
          <g key={v}>
            <line x1={GX} y1={gy} x2={GX+GW} y2={gy} stroke={v===0?"#22c55e":"#e2e8f0"} strokeWidth={v===0?2:1} strokeDasharray={v===0?"":"4 3"} />
            <text x={GX-4} y={gy+3.5} textAnchor="end" fontSize="7.5" fill={v===0?"#166534":"#94a3b8"} fontWeight={v===0?"700":"400"}>{v}%</text>
          </g>
        );
      })}
      <line x1={GX} y1={GY+GH} x2={GX+GW} y2={GY+GH} stroke="#94a3b8" strokeWidth="1.5" />
      <line x1={GX} y1={GY}    x2={GX}    y2={GY+GH} stroke="#94a3b8" strokeWidth="1.5" />
      {[0,0.2,0.5,1.0].map(v => {
        const gx = GX + v*xScale;
        return (
          <g key={v}>
            <line x1={gx} y1={GY+GH} x2={gx} y2={GY+GH+5} stroke="#94a3b8" strokeWidth="1.2" />
            <text x={gx} y={GY+GH+13} textAnchor="middle" fontSize="7.5" fill="#64748b">{v}</text>
          </g>
        );
      })}

      <text x={GX+GW/2} y={GY+GH+26} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">NaCl concentration (mol L⁻¹)</text>
      <text x="12" y="115" textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569" transform="rotate(-90,12,115)">% mass change</text>

      <text x={GX+22}   y={GY+11} fontSize="8" fill="#0369a1" fontWeight="600">Hypotonic</text>
      <text x={GX+GW-4} y={GY+GH-7} textAnchor="end" fontSize="8" fill="#c2410c" fontWeight="600">Hypertonic</text>
      <text x={GX+GW+4} y={yZero+4} fontSize="8" fill="#166534" fontWeight="700">Isotonic</text>

      <motion.path d={curve} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }}
        transition={{ duration:1.5, ease:"easeOut" }} />

      {pts.map((p,i) => (
        <motion.g key={i} initial={{ scale:0 }} animate={{ scale:1 }}
          style={{ transformOrigin:`${p.x}px ${p.y}px` }}
          transition={{ delay:1.5+i*0.1, type:"spring" }}>
          <circle cx={p.x} cy={p.y} r={6} fill={p.color} stroke="white" strokeWidth="1.8" />
          <text x={p.x} y={p.y-9} textAnchor="middle" fontSize="7.5" fontWeight="700" fill={p.tc}>
            {p.pct>0?"+":""}{p.pct}%
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ─── SVG 8: Conclusion — three cell states ──────────────── */
export function ConclusionCellsSVG() {
  const cells = [
    { label:"Hypotonic (0 M)",   type:"Turgid",       dir:+1, wc:"#38bdf8", fc:"#bfdbfe", cW:68, cH:58, wallW:72, wallH:62 },
    { label:"Isotonic (~0.5 M)", type:"Normal",        dir: 0, wc:"#4ade80", fc:"#bbf7d0", cW:56, cH:46, wallW:64, wallH:54 },
    { label:"Hypertonic (1 M)",  type:"Plasmolysed",   dir:-1, wc:"#fb923c", fc:"#fed7aa", cW:36, cH:28, wallW:64, wallH:54 },
  ];
  const cellY = 68;
  const cxPos = [52, 150, 248];

  return (
    <svg viewBox="0 0 300 258" className="w-full h-full">
      <rect width="300" height="258" rx="12" fill="#f8fafc" />

      {cells.map((c,i) => {
        const cx = cxPos[i], cy = cellY+35;
        const tc = c.wc==="#38bdf8"?"#0369a1":c.wc==="#4ade80"?"#15803d":"#c2410c";
        return (
          <g key={i}>
            <rect x={cx-c.wallW/2} y={cy-c.wallH/2} width={c.wallW} height={c.wallH} rx="6"
              fill="none" stroke={c.wc} strokeWidth="3" />
            <motion.rect y={cy-c.cH/2} height={c.cH} rx="5" fill={c.fc} fillOpacity={0.72}
              initial={{ width:0, x:cx }} animate={{ width:c.cW, x:cx-c.cW/2 }}
              transition={{ duration:0.8, delay:i*0.2 }} />
            <motion.ellipse cx={cx} cy={cy} fill={c.wc} fillOpacity={0.38}
              initial={{ rx:0, ry:0 }}
              animate={{ rx:c.cW*0.35, ry:c.cH*0.35 }}
              transition={{ duration:0.8, delay:i*0.2+0.3 }} />
            {c.dir!==0 && [0,1].map(j => {
              const ax = c.dir>0 ? cx-c.wallW/2-14 : cx+c.wallW/2+14;
              const bx = c.dir>0 ? cx-c.wallW/2+4  : cx+c.wallW/2-4;
              return (
                <motion.g key={j}>
                  <motion.line x1={ax} y1={cy-7+j*14} x2={bx} y2={cy-7+j*14}
                    stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"
                    animate={{ opacity:[0.4,1,0.4] }}
                    transition={{ duration:1.5, repeat:Infinity, delay:j*0.5 }} />
                  <motion.polygon
                    points={c.dir>0
                      ? `${bx},${cy-11+j*14} ${bx+7},${cy-7+j*14} ${bx},${cy-3+j*14}`
                      : `${bx},${cy-11+j*14} ${bx-7},${cy-7+j*14} ${bx},${cy-3+j*14}`}
                    fill="#60a5fa"
                    animate={{ opacity:[0.4,1,0.4] }}
                    transition={{ duration:1.5, repeat:Infinity, delay:j*0.5 }} />
                </motion.g>
              );
            })}
            {c.dir===0 && [-1,1].map((d,j) => (
              <motion.line key={j}
                x1={cx+d*(c.wallW/2-4)} y1={cy}
                x2={cx+d*(c.wallW/2+13)} y2={cy}
                stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3"
                animate={{ opacity:[0.3,0.8,0.3] }}
                transition={{ duration:2, repeat:Infinity, delay:j }} />
            ))}
            <text x={cx} y={cy+c.wallH/2+15} textAnchor="middle" fontSize="9" fontWeight="700" fill={tc}>{c.type}</text>
            <text x={cx} y={cy+c.wallH/2+26} textAnchor="middle" fontSize="6.5" fill="#64748b">{c.label}</text>
            <text x={cx} y={cellY-10}         textAnchor="middle" fontSize="6.5" fill="#94a3b8">Cell wall</text>
          </g>
        );
      })}

      <rect x={14}  y={215} width={12} height={8} rx="2" fill="#bfdbfe" />
      <text x={29}  y={223} fontSize="7.5" fill="#475569">Cytoplasm</text>
      <line x1={95} y1={219} x2={107} y2={219} stroke="#60a5fa" strokeWidth="2" />
      <text x={110} y={223} fontSize="7.5" fill="#475569">H₂O movement</text>
      <rect x={185} y={215} width={12} height={8} rx="2" fill="none" stroke="#94a3b8" strokeWidth="2" />
      <text x={200} y={223} fontSize="7.5" fill="#475569">Cell wall</text>

      <text x="150" y="242" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">
        Osmosis controls plant cell turgor and wilting
      </text>
      <text x="150" y="254" textAnchor="middle" fontSize="7.5" fill="#64748b">
        Potato is isotonic with ≈ 0.45 M NaCl (ψ ≈ −1.1 MPa)
      </text>
    </svg>
  );
}
