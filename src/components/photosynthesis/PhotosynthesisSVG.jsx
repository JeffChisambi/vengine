import React from "react";
import { motion } from "framer-motion";

/* ─── Shared helpers ────────────────────────────────────────────────── */

function Steam({ x, y, delay = 0 }) {
  return (
    <motion.path
      d={`M${x},${y} Q${x - 5},${y - 12} ${x},${y - 24} Q${x + 5},${y - 36} ${x},${y - 48}`}
      fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.6, 0], y: [0, -6] }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function Bubble({ cx, baseY, delay = 0, size = 2.5 }) {
  return (
    <motion.circle cx={cx} r={size} fill="#bae6fd" fillOpacity={0.7}
      initial={{ cy: baseY, opacity: 0 }}
      animate={{ cy: [baseY, baseY - 28], opacity: [0, 0.8, 0] }}
      transition={{ duration: 1.3, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ─── Leaf shape helper ─────────────────────────────────────────────── */
function leafPath(cx, cy, w = 52, h = 80) {
  return `M${cx},${cy - h / 2} C${cx + w / 2},${cy - h / 2} ${cx + w / 2},${cy + h / 2} ${cx},${cy + h / 2} C${cx - w / 2},${cy + h / 2} ${cx - w / 2},${cy - h / 2} ${cx},${cy - h / 2}Z`;
}

function LeafVeins({ cx, cy, color = "#14532d", opacity = 0.4 }) {
  return (
    <g stroke={color} strokeWidth="1" strokeOpacity={opacity} fill="none" strokeLinecap="round">
      <line x1={cx} y1={cy - 34} x2={cx} y2={cy + 34} />
      <line x1={cx} y1={cy - 15} x2={cx - 18} y2={cy - 24} />
      <line x1={cx} y1={cy - 15} x2={cx + 18} y2={cy - 24} />
      <line x1={cx} y1={cy} x2={cx - 20} y2={cy - 7} />
      <line x1={cx} y1={cy} x2={cx + 20} y2={cy - 7} />
      <line x1={cx} y1={cy + 15} x2={cx - 18} y2={cy + 8} />
      <line x1={cx} y1={cy + 15} x2={cx + 18} y2={cy + 8} />
    </g>
  );
}

/* ─── Starch granule cluster ────────────────────────────────────────── */
function StarchGranule({ cx, cy, size = 4, opacity = 0.8 }) {
  return (
    <ellipse cx={cx} cy={cy} rx={size} ry={size * 0.7}
      fill="#312e81" fillOpacity={opacity}
      stroke="#4338ca" strokeWidth="0.5" strokeOpacity={opacity * 0.6}
    />
  );
}

/* ─── SVG 0: Intro overview ─────────────────────────────────────────── */
export function PhotoIntroSVG() {
  return (
    <svg viewBox="0 0 320 270" className="w-full h-full">
      <defs>
        <radialGradient id="piSun" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fef08a" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="piDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Light side */}
      <rect x="0" y="0" width="160" height="240" rx="12" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
      <text x="80" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#15803d" fontFamily="var(--font-heading)">LIGHT</text>

      {/* Sun */}
      <motion.circle cx={80} cy={50} r={22} fill="url(#piSun)"
        animate={{ r: [22, 25, 22] }} transition={{ duration: 2.5, repeat: Infinity }} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={80 + 26 * Math.cos(rad)} y1={50 + 26 * Math.sin(rad)}
            x2={80 + 35 * Math.cos(rad)} y2={50 + 35 * Math.sin(rad)}
            stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
          />
        );
      })}
      {/* Light rays down */}
      {[65, 80, 95].map((x, i) => (
        <motion.line key={i} x1={x} y1={73} x2={x} y2={115}
          stroke="#fbbf24" strokeWidth="1.5" strokeOpacity={0.5} strokeLinecap="round"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}

      {/* Light leaf */}
      <path d={leafPath(80, 150, 50, 70)} fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
      <LeafVeins cx={80} cy={150} color="#14532d" opacity={0.35} />
      {/* Starch granules forming */}
      {[[72, 145], [83, 140], [76, 155], [86, 152]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={3.5} fill="#312e81"
          animate={{ opacity: [0, 0.7, 0.7], r: [0, 3.5, 3.5] }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.35, repeat: Infinity, repeatDelay: 1.5 }}
        />
      ))}
      {/* Pot */}
      <path d="M58,195 L62,220 L98,220 L102,195 Z" fill="#a16207" />
      <rect x="55" y="192" width="50" height="6" rx="3" fill="#ca8a04" />

      {/* Label */}
      <motion.text x={80} y={238} textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d"
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
        Starch FORMS ✓
      </motion.text>

      {/* Dark side */}
      <rect x="162" y="0" width="156" height="240" rx="12" fill="url(#piDark)" stroke="#334155" strokeWidth="1.5" />
      <text x="240" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily="var(--font-heading)">DARKNESS</text>

      {/* Dark box */}
      <rect x="196" y="60" width="88" height="110" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
      {/* Dark leaf */}
      <path d={leafPath(240, 120, 46, 64)} fill="#166534" stroke="#14532d" strokeWidth="1.5" opacity={0.7} />
      <LeafVeins cx={240} cy={120} color="#052e16" opacity={0.4} />
      {/* No starch granules */}
      <text x={240} y={180} textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="var(--font-body)">No starch production</text>

      {/* Pot */}
      <path d="M218,178 L222,198 L258,198 L262,178 Z" fill="#7c2d12" />
      <rect x="215" y="175" width="50" height="5" rx="2.5" fill="#92400e" />

      <text x={240} y={225} textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b">No Starch ✗</text>

      {/* Iodine bottles */}
      <text x={160} y={255} textAnchor="middle" fontSize="10" fill="#92400e" fontFamily="var(--font-heading)">↓ Iodine Test ↓</text>
    </svg>
  );
}

/* ─── SVG 1: Destarching in darkness ───────────────────────────────── */
export function DestarchSVG({ progress = 0 }) {
  const granuleOpacity = Math.max(0, 1 - progress);
  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <radialGradient id="dsDark" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="dsCellGrad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#166534" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="0.3" />
        </radialGradient>
        <filter id="dsGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Dark box */}
      <rect x="20" y="20" width="260" height="200" rx="14" fill="url(#dsDark)" stroke="#334155" strokeWidth="2.5" />
      {/* Box lid hint */}
      <rect x="15" y="14" width="270" height="14" rx="6" fill="#334155" />
      <text x="150" y="24" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600" fontFamily="var(--font-heading)">DARK CUPBOARD — 48 HOURS</text>

      {/* Stars / dark atmosphere */}
      {[[50, 50], [210, 60], [80, 140], [240, 130], [155, 80]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={1.5} fill="#e2e8f0"
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2 + i * 0.4, delay: i * 0.3, repeat: Infinity }}
        />
      ))}

      {/* Potted plant silhouette */}
      <path d="M110,175 L116,195 L184,195 L190,175 Z" fill="#7c2d12" />
      <rect x="106" y="172" width="88" height="7" rx="3.5" fill="#92400e" />

      {/* Leaf */}
      <path d={leafPath(150, 125, 62, 88)} fill="#166534" stroke="#15803d" strokeWidth="1.5" strokeOpacity={0.6} />
      <LeafVeins cx={150} cy={125} color="#052e16" opacity={0.5} />

      {/* Starch granules shrinking with progress */}
      {[[137, 118], [152, 112], [160, 126], [143, 132], [158, 138], [132, 126]].map(([x, y], i) => (
        <motion.ellipse key={i} cx={x} cy={y}
          rx={4.5 * (1 - progress * 0.9)}
          ry={3 * (1 - progress * 0.9)}
          fill="#312e81" fillOpacity={granuleOpacity * 0.9}
          stroke="#4338ca" strokeWidth="0.5" strokeOpacity={granuleOpacity * 0.6}
        />
      ))}

      {/* Moon / time indicator */}
      <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }}>
        <path d="M248,45 A16,16 0 1 1 248,77 A10,10 0 1 0 248,45Z" fill="#fef9c3" />
      </motion.g>

      {/* Progress bar */}
      <rect x="40" y="210" width="220" height="10" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <motion.rect x="40" y="210" height="10" rx="5" fill="#7c3aed"
        initial={{ width: 0 }}
        animate={{ width: 220 * progress }}
        transition={{ duration: 0.5 }}
      />
      <text x={150} y={235} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="var(--font-body)">
        Destarching: {Math.round(progress * 100)}% complete
      </text>

      {progress > 0.6 && (
        <motion.text x={150} y={252} textAnchor="middle" fontSize="10" fontWeight="700" fill="#7c3aed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Starch reserves depleted ✓
        </motion.text>
      )}
    </svg>
  );
}

/* ─── SVG 2: Setup — Light vs Dark ─────────────────────────────────── */
export function SetupSVG() {
  return (
    <svg viewBox="0 0 320 280" className="w-full h-full">
      <defs>
        <radialGradient id="setupSun" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fef08a" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0.5" />
        </radialGradient>
        <linearGradient id="setupLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0fdf4" /><stop offset="100%" stopColor="#dcfce7" />
        </linearGradient>
        <linearGradient id="setupDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Light chamber */}
      <rect x="4" y="30" width="148" height="220" rx="12" fill="url(#setupLight)" stroke="#86efac" strokeWidth="2" />
      <text x="78" y="50" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" fontFamily="var(--font-heading)">LIGHT PLANT</text>

      {/* Sun */}
      <motion.circle cx={78} cy={80} r={22} fill="url(#setupSun)"
        animate={{ r: [22, 25, 22] }} transition={{ duration: 2, repeat: Infinity }} />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.line key={i}
            x1={78 + 26 * Math.cos(rad)} y1={80 + 26 * Math.sin(rad)}
            x2={78 + 38 * Math.cos(rad)} y2={80 + 38 * Math.sin(rad)}
            stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
          />
        );
      })}

      {/* Energy rays reaching leaf */}
      {[60, 78, 96].map((x, i) => (
        <motion.line key={i} x1={x} y1={103} x2={x + (i - 1) * 5} y2={148}
          stroke="#fbbf24" strokeWidth="1.5" strokeOpacity={0.5} strokeLinecap="round"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
        />
      ))}

      {/* Light leaf — active, swaying */}
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "78px 190px" }}
      >
        <path d={leafPath(78, 165, 54, 76)} fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />
        <LeafVeins cx={78} cy={165} color="#14532d" opacity={0.35} />
      </motion.g>

      {/* Chloroplast activity glow */}
      {[[68, 158], [82, 152], [75, 168], [86, 164]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={4}
          fill="#4ade80" fillOpacity={0}
          animate={{ fillOpacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      {/* Light pot */}
      <path d="M56,205 L60,225 L96,225 L100,205 Z" fill="#a16207" />
      <rect x="53" y="202" width="50" height="6" rx="3" fill="#ca8a04" />

      {/* Divider */}
      <line x1="160" y1="30" x2="160" y2="250" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />

      {/* Dark chamber */}
      <rect x="166" y="30" width="148" height="220" rx="12" fill="url(#setupDark)" stroke="#334155" strokeWidth="2" />
      <text x="240" y="50" textAnchor="middle" fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily="var(--font-heading)">DARK PLANT</text>

      {/* Dark box around plant */}
      <rect x="196" y="95" width="88" height="100" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
      <text x="240" y="90" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="var(--font-body)">dark chamber</text>

      {/* Dark leaf — still, muted */}
      <path d={leafPath(240, 145, 50, 68)} fill="#166534" stroke="#14532d" strokeWidth="1.5" strokeOpacity={0.7} />
      <LeafVeins cx={240} cy={145} color="#052e16" opacity={0.4} />

      {/* Dark pot */}
      <path d="M218,203 L222,222 L258,222 L262,203 Z" fill="#7c2d12" />
      <rect x="215" y="200" width="50" height="6" rx="3" fill="#92400e" />

      {/* Labels */}
      <text x={78} y={248} textAnchor="middle" fontSize="9" fontWeight="700" fill="#22c55e">Active photosynthesis</text>
      <text x={240} y={248} textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569">No photosynthesis</text>
    </svg>
  );
}

/* ─── SVG 3: Timelapse — Cellular view ─────────────────────────────── */
export function TimelapseSVG({ side = "light", intensity = 0 }) {
  const isLight = side === "light";

  return (
    <svg viewBox="0 0 300 280" className="w-full h-full">
      <defs>
        <radialGradient id={`tlCellGrad${side}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={isLight ? "#dcfce7" : "#1e293b"} stopOpacity="0.8" />
          <stop offset="100%" stopColor={isLight ? "#bbf7d0" : "#0f172a"} stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id={`tlChloroGrad${side}`} cx="40%" cy="40%">
          <stop offset="0%" stopColor={isLight ? "#4ade80" : "#166534"} stopOpacity="0.8" />
          <stop offset="100%" stopColor={isLight ? "#16a34a" : "#14532d"} stopOpacity="0.5" />
        </radialGradient>
        <filter id="tlGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Cell background */}
      <ellipse cx={150} cy={140} rx={125} ry={110}
        fill={`url(#tlCellGrad${side})`}
        stroke={isLight ? "#86efac" : "#334155"}
        strokeWidth="2.5"
      />

      {/* Cell wall */}
      <ellipse cx={150} cy={140} rx={125} ry={110}
        fill="none" stroke={isLight ? "#4ade80" : "#475569"} strokeWidth="1" strokeOpacity={0.3}
        strokeDasharray="6 4"
      />

      {/* Chloroplasts */}
      {[[95, 110], [160, 98], [195, 130], [175, 165], [115, 158], [140, 130]].map(([cx, cy], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={18} ry={11}
            fill={`url(#tlChloroGrad${side})`}
            stroke={isLight ? "#4ade80" : "#166534"}
            strokeWidth="1.5"
          />
          {/* Thylakoid lines */}
          {[-5, 0, 5].map((offset, j) => (
            <line key={j}
              x1={cx - 10} y1={cy + offset * 0.8}
              x2={cx + 10} y2={cy + offset * 0.8}
              stroke={isLight ? "#22c55e" : "#166534"}
              strokeWidth="1" strokeOpacity="0.5"
            />
          ))}
          {/* Active glow */}
          {isLight && (
            <motion.ellipse cx={cx} cy={cy} rx={18} ry={11}
              fill="#4ade80" fillOpacity={0}
              animate={{ fillOpacity: [0, 0.4 * intensity, 0] }}
              transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity }}
              filter="url(#tlGlow)"
            />
          )}
        </g>
      ))}

      {/* Energy/photon particles (light only) */}
      {isLight && intensity > 0.1 && [0, 1, 2, 3, 4].map((i) => (
        <motion.circle key={i}
          r={3} fill="#fbbf24" fillOpacity={0.9}
          filter="url(#tlGlow)"
          initial={{ cx: 50 + i * 15, cy: 30, opacity: 0 }}
          animate={{
            cx: [50 + i * 15, 90 + i * 18, 140 + i * 5],
            cy: [30, 80, 130],
            opacity: [0, 0.9 * intensity, 0],
          }}
          transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: "easeIn" }}
        />
      ))}

      {/* Glucose molecules forming (light) */}
      {isLight && intensity > 0.2 && [[120, 130], [155, 120], [170, 150], [130, 155]].map(([x, y], i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: intensity > 0.3 ? 0.8 : 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <circle cx={x} cy={y} r={5} fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="700">G</text>
        </motion.g>
      ))}

      {/* Starch granules accumulating */}
      {isLight && [[108, 118], [145, 108], [165, 138], [130, 148], [158, 158]].map(([x, y], i) => (
        <motion.ellipse key={i} cx={x} cy={y}
          rx={4.5 * intensity} ry={3 * intensity}
          fill="#312e81" fillOpacity={0.85 * intensity}
          stroke="#4338ca" strokeWidth="0.5"
        />
      ))}

      {/* Dark state — inactive note */}
      {!isLight && (
        <motion.text x={150} y={200} textAnchor="middle" fontSize="11" fill="#475569" fontFamily="var(--font-body)"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}>
          No activity in darkness
        </motion.text>
      )}

      {/* Label */}
      <text x={150} y={268} textAnchor="middle" fontSize="11" fontWeight="700"
        fill={isLight ? "#15803d" : "#64748b"} fontFamily="var(--font-heading)">
        {isLight ? "Chloroplasts ACTIVE" : "Chloroplasts INACTIVE"}
      </text>
    </svg>
  );
}

/* ─── SVG 4: Dual starch test — side by side ───────────────────────── */
export function DualBoilSVG() {
  return (
    <svg viewBox="0 0 320 280" className="w-full h-full">
      <defs>
        <linearGradient id="dbWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="dbGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.3" />
        </linearGradient>
        <clipPath id="dbClip1"><rect x="25" y="80" width="110" height="155" rx="5" /></clipPath>
        <clipPath id="dbClip2"><rect x="183" y="80" width="110" height="155" rx="5" /></clipPath>
      </defs>

      {/* Labels */}
      <text x={80} y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" fontFamily="var(--font-heading)">LIGHT LEAF</text>
      <text x={238} y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">DARK LEAF</text>

      {/* Divider */}
      <line x1="160" y1="15" x2="160" y2="265" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Beaker 1 */}
      <rect x="25" y="80" width="110" height="155" rx="5" fill="url(#dbGlass)" stroke="#94a3b8" strokeWidth="2" />
      <g clipPath="url(#dbClip1)">
        <rect x="26" y="150" width="108" height="85" fill="url(#dbWater)" />
        {[40, 60, 80, 100, 115].map((cx, i) => (
          <Bubble key={i} cx={cx} baseY={228} delay={i * 0.2} size={2} />
        ))}
        <motion.path d="M26,150 Q80,144 134,150" fill="none" stroke="#bae6fd" strokeWidth="2"
          animate={{ d: ["M26,150 Q80,144 134,150", "M26,150 Q80,156 134,150", "M26,150 Q80,144 134,150"] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {/* Green leaf */}
        <motion.path d={leafPath(80, 185, 46, 60)} fill="#22c55e" stroke="#16a34a" strokeWidth="1.2"
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
        />
        <LeafVeins cx={80} cy={185} color="#14532d" opacity={0.3} />
      </g>
      <Steam x={60} y={78} delay={0} />
      <Steam x={100} y={78} delay={0.8} />

      {/* Flame 1 */}
      <rect x="55" y="238" width="50" height="8" rx="3" fill="#64748b" />
      <motion.ellipse cx={80} cy={236} rx={9} ry={6} fill="#f97316"
        animate={{ ry: [6, 9, 6] }} transition={{ duration: 0.5, repeat: Infinity }} />
      <motion.ellipse cx={80} cy={233} rx={5} ry={4} fill="#fbbf24"
        animate={{ ry: [4, 6, 4] }} transition={{ duration: 0.4, repeat: Infinity }} />

      {/* Beaker 2 */}
      <rect x="183" y="80" width="110" height="155" rx="5" fill="url(#dbGlass)" stroke="#94a3b8" strokeWidth="2" />
      <g clipPath="url(#dbClip2)">
        <rect x="184" y="150" width="108" height="85" fill="url(#dbWater)" />
        {[198, 218, 238, 258, 275].map((cx, i) => (
          <Bubble key={i} cx={cx} baseY={228} delay={i * 0.25} size={2} />
        ))}
        <motion.path d="M184,150 Q238,144 292,150" fill="none" stroke="#bae6fd" strokeWidth="2"
          animate={{ d: ["M184,150 Q238,144 292,150", "M184,150 Q238,156 292,150", "M184,150 Q238,144 292,150"] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {/* Dark leaf */}
        <motion.path d={leafPath(238, 185, 44, 58)} fill="#166534" stroke="#14532d" strokeWidth="1.2"
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeIn", delay: 0.2 }}
        />
        <LeafVeins cx={238} cy={185} color="#052e16" opacity={0.3} />
      </g>
      <Steam x={215} y={78} delay={0.4} />
      <Steam x={255} y={78} delay={1.1} />

      {/* Flame 2 */}
      <rect x="213" y="238" width="50" height="8" rx="3" fill="#64748b" />
      <motion.ellipse cx={238} cy={236} rx={9} ry={6} fill="#f97316"
        animate={{ ry: [6, 9, 6] }} transition={{ duration: 0.5, repeat: Infinity }} />
      <motion.ellipse cx={238} cy={233} rx={5} ry={4} fill="#fbbf24"
        animate={{ ry: [4, 6, 4] }} transition={{ duration: 0.4, repeat: Infinity }} />

      <text x={160} y={270} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="var(--font-body)">Boiling both leaves simultaneously</text>
    </svg>
  );
}

/* ─── SVG 5: Dual ethanol decolorization ───────────────────────────── */
export function DualEthanolSVG() {
  return (
    <svg viewBox="0 0 320 280" className="w-full h-full">
      <defs>
        <linearGradient id="deEth1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="deEth2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="deClip1"><rect x="25" y="75" width="110" height="160" rx="5" /></clipPath>
        <clipPath id="deClip2"><rect x="183" y="75" width="110" height="160" rx="5" /></clipPath>
      </defs>

      <text x={80} y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" fontFamily="var(--font-heading)">LIGHT LEAF</text>
      <text x={238} y="20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">DARK LEAF</text>
      <line x1="160" y1="15" x2="160" y2="265" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Tube 1 */}
      <rect x="25" y="75" width="110" height="160" rx="5" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <g clipPath="url(#deClip1)">
        <rect x="26" y="145" width="108" height="90" fill="url(#deEth1)" />
        {/* Green swirling out */}
        {[0, 1, 2].map((i) => (
          <motion.circle key={i} cx={60 + i * 18} cy={155 + i * 8} r={0}
            fill="#22c55e"
            animate={{ r: [0, 14 + i * 4], opacity: [0, 0.5, 0], cy: [155 + i * 8, 175 + i * 5, 200] }}
            transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        {/* Pale leaf */}
        <path d={leafPath(80, 182, 44, 58)} fill="#fef9c3" stroke="#fde047" strokeWidth="1.2" />
        <LeafVeins cx={80} cy={182} color="#92400e" opacity={0.2} />
      </g>
      <Steam x={55} y={73} delay={0.2} />
      <Steam x={95} y={73} delay={1} />

      {/* Outer hot water bath 1 */}
      <rect x="15" y="238" width="130" height="28" rx="5" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1.5" />
      <text x={80} y={256} textAnchor="middle" fontSize="8" fill="#0369a1">Hot Water Bath</text>

      {/* Tube 2 */}
      <rect x="183" y="75" width="110" height="160" rx="5" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <g clipPath="url(#deClip2)">
        <rect x="184" y="145" width="108" height="90" fill="url(#deEth2)" />
        {[0, 1, 2].map((i) => (
          <motion.circle key={i} cx={218 + i * 18} cy={158 + i * 6} r={0}
            fill="#86efac"
            animate={{ r: [0, 10 + i * 3], opacity: [0, 0.35, 0], cy: [158 + i * 6, 178 + i * 5, 200] }}
            transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
        {/* Already-pale dark leaf */}
        <path d={leafPath(238, 182, 42, 56)} fill="#fef3c7" stroke="#fde68a" strokeWidth="1.2" />
        <LeafVeins cx={238} cy={182} color="#92400e" opacity={0.18} />
      </g>
      <Steam x={213} y={73} delay={0.5} />
      <Steam x={253} y={73} delay={1.3} />

      <rect x="173" y="238" width="130" height="28" rx="5" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1.5" />
      <text x={238} y={256} textAnchor="middle" fontSize="8" fill="#0369a1">Hot Water Bath</text>

      <text x={160} y={275} textAnchor="middle" fontSize="10" fill="#15803d" fontWeight="600" fontFamily="var(--font-heading)">Chlorophyll dissolving into ethanol</text>
    </svg>
  );
}

/* ─── SVG 6: Dual iodine test (the payoff!) ────────────────────────── */
export function DualIodineSVG({ revealed = false }) {
  return (
    <svg viewBox="0 0 320 290" className="w-full h-full">
      <defs>
        <radialGradient id="diStarch" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.98" />
          <stop offset="60%" stopColor="#312e81" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="diNoStarch" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#92400e" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
        </radialGradient>
        <filter id="diGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Labels */}
      <text x={80} y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" fontFamily="var(--font-heading)">LIGHT LEAF</text>
      <text x={240} y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill="#64748b" fontFamily="var(--font-heading)">DARK LEAF</text>
      <line x1="160" y1="12" x2="160" y2="270" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Petri dish 1 */}
      <ellipse cx={80} cy={168} rx={72} ry={13} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx={80} cy={160} rx={72} ry={13} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Light leaf — pale before test */}
      <path d={leafPath(80, 148, 76, 104)} fill="#fef9c3" stroke="#fde047" strokeWidth="1.3" />
      <LeafVeins cx={80} cy={148} color="#92400e" opacity={0.18} />

      {/* Blue-black starch reveal */}
      {revealed && (
        <>
          <motion.path d={leafPath(80, 148, 76, 104)} fill="url(#diStarch)"
            filter="url(#diGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ transformOrigin: "80px 148px" }}
          />
          <LeafVeins cx={80} cy={148} color="#c7d2fe" opacity={0.25} />
          {/* Spreading rings */}
          {[0, 1, 2, 3].map((i) => (
            <motion.circle key={i} cx={72 + i * 5} cy={144 + i * 4} r={0} fill="#312e81" fillOpacity={0}
              animate={{ r: [0, 10 + i * 8], fillOpacity: [0, 0.35, 0] }}
              transition={{ duration: 1.8, delay: 0.3 + i * 0.3, ease: "easeOut" }}
            />
          ))}
        </>
      )}

      {/* Iodine dropper 1 */}
      <rect x="120" y="40" width="16" height="50" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
      <ellipse cx="128" cy="40" rx="8" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.8" />
      <path d="M124,90 L128,104 L132,90" fill="#d97706" />
      <text x="128" y="68" textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="700">I₂</text>
      {revealed && (
        <motion.ellipse cx={128} rx={2.5} ry={4.5} fill="#92400e" fillOpacity={0.9}
          initial={{ cy: 106, opacity: 0 }}
          animate={{ cy: [106, 130], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, repeat: 3, delay: 0.1 }}
        />
      )}

      {/* Result badge 1 */}
      {revealed && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: "spring" }}>
          <rect x="18" y="188" width="124" height="28" rx="8" fill="#1e1b4b" fillOpacity={0.95} />
          <text x="80" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="var(--font-heading)">
            ✓ STARCH PRESENT
          </text>
        </motion.g>
      )}

      {/* Petri dish 2 */}
      <ellipse cx={240} cy={168} rx={72} ry={13} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx={240} cy={160} rx={72} ry={13} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Dark leaf */}
      <path d={leafPath(240, 148, 74, 102)} fill="#fef9c3" stroke="#fde047" strokeWidth="1.3" />
      <LeafVeins cx={240} cy={148} color="#92400e" opacity={0.18} />

      {/* Stays brown — no starch */}
      {revealed && (
        <motion.path d={leafPath(240, 148, 74, 102)} fill="url(#diNoStarch)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}

      {/* Iodine dropper 2 */}
      <rect x="278" y="40" width="16" height="50" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
      <ellipse cx="286" cy="40" rx="8" ry="6" fill="#fde68a" stroke="#d97706" strokeWidth="1.8" />
      <path d="M282,90 L286,104 L290,90" fill="#d97706" />
      <text x="286" y="68" textAnchor="middle" fontSize="6" fill="#92400e" fontWeight="700">I₂</text>
      {revealed && (
        <motion.ellipse cx={286} rx={2.5} ry={4.5} fill="#92400e" fillOpacity={0.9}
          initial={{ cy: 106, opacity: 0 }}
          animate={{ cy: [106, 130], opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, repeat: 3, delay: 0.3 }}
        />
      )}

      {/* Result badge 2 */}
      {revealed && (
        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: "spring" }}>
          <rect x="176" y="188" width="128" height="28" rx="8" fill="#78350f" fillOpacity={0.9} />
          <text x="240" y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" fontFamily="var(--font-heading)">
            ✗ NO STARCH
          </text>
        </motion.g>
      )}

      {/* Dramatic difference label */}
      {revealed && (
        <motion.text x={160} y={278} textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c3aed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          fontFamily="var(--font-heading)">
          Photosynthesis proven! Light = Starch
        </motion.text>
      )}
    </svg>
  );
}
