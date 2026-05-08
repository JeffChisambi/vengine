import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";

const g = 9.81;
const SVG_W = 420;
const SVG_H = 380;
const PIVOT_X = SVG_W / 2;
const PIVOT_Y = 30;
const MIN_L = 0.1; // metres
const MAX_L = 1.5;
const PIXELS_PER_METRE = 200; // 1m = 200px

function theoreticalPeriod(L) {
  return 2 * Math.PI * Math.sqrt(L / g);
}

// Convert pendulum state to SVG bob position
function bobPos(angle, lengthM) {
  const px = PIXELS_PER_METRE * lengthM;
  return {
    x: PIVOT_X + px * Math.sin(angle),
    y: PIVOT_Y + px * Math.cos(angle),
  };
}

// Generate ghost trail positions
function trailArc(lengthM, amplitude) {
  const pts = [];
  const px = PIXELS_PER_METRE * lengthM;
  for (let a = -amplitude; a <= amplitude; a += amplitude / 12) {
    pts.push({ x: PIVOT_X + px * Math.sin(a), y: PIVOT_Y + px * Math.cos(a) });
  }
  return pts;
}

export default function PendulumLab({ readings, setReadings, onNext }) {
  const [lengthM, setLengthM] = useState(0.5);
  const [angle, setAngle] = useState(0.3); // radians, current position
  const [angVel, setAngVel] = useState(0);
  const [running, setRunning] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const [swingCount, setSwingCount] = useState(0); // half-swings
  const [timing, setTiming] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [measuredT, setMeasuredT] = useState(null);
  const [amplitude] = useState(0.3); // initial angle
  const [justAdded, setJustAdded] = useState(false);
  const rafRef = useRef(null);
  const lastT = useRef(null);
  const prevSign = useRef(Math.sign(amplitude));

  const theoreticalT = theoreticalPeriod(lengthM);

  const resetPendulum = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setAngle(amplitude);
    setAngVel(0);
    setRunning(false);
    setTiming(false);
    setStartTime(null);
    setMeasuredT(null);
    setSwingCount(0);
    prevSign.current = Math.sign(amplitude);
    lastT.current = null;
  }, [amplitude]);

  // Physics loop
  useEffect(() => {
    if (!running) {
      lastT.current = null;
      return;
    }
    const tick = (ts) => {
      if (lastT.current === null) {
        lastT.current = ts;
      }
      const dt = Math.min((ts - lastT.current) / 1000, 0.05);
      lastT.current = ts;

      setAngle((prev) => {
        const acc = -(g / lengthM) * Math.sin(prev);
        const newVel = angVel + acc * dt;
        setAngVel(newVel);
        const newAngle = prev + newVel * dt;

        // Count zero crossings (half-swings)
        const curSign = Math.sign(newAngle);
        if (curSign !== 0 && curSign !== prevSign.current) {
          prevSign.current = curSign;
          setSwingCount((c) => {
            const nc = c + 1;
            // After 10 half-swings = 5 full periods
            if (nc === 10 && timing && startTime !== null) {
              const elapsed = ts / 1000 - startTime;
              setMeasuredT(elapsed / 5);
              setTiming(false);
            }
            return nc;
          });
        }
        return newAngle;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, lengthM, angVel, timing, startTime]);

  const handleStartStop = () => {
    if (!running) {
      resetPendulum();
      setTimeout(() => setRunning(true), 50);
    } else {
      setRunning(false);
    }
  };

  const handleTime = () => {
    if (!running) return;
    setSwingCount(0);
    setMeasuredT(null);
    setTiming(true);
    setStartTime(performance.now() / 1000);
    prevSign.current = Math.sign(angle);
  };

  const handleRecord = () => {
    if (measuredT == null) return;
    setReadings((r) => [
      ...r,
      {
        length: parseFloat(lengthM.toFixed(2)),
        measured: parseFloat(measuredT.toFixed(3)),
        theoretical: parseFloat(theoreticalT.toFixed(3)),
      },
    ]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const bob = bobPos(angle, lengthM);
  const trail = showTrail ? trailArc(lengthM, amplitude) : [];
  const stringLen = PIXELS_PER_METRE * lengthM;

  return (
    <div className="min-h-full flex flex-col gap-5 items-center justify-center px-4 py-6 max-w-5xl mx-auto">
      <div className="text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-semibold mb-2">
          Interactive Lab
        </span>
        <h2 className="text-2xl font-extrabold font-heading mb-1">
          Measure the Period
        </h2>
        <p className="text-muted-foreground text-sm">
          Change the pendulum length, time 5 full swings, and record your
          results.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start justify-center">
        {/* ── SVG Pendulum ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg relative select-none w-full">
          <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="max-w-full w-full" style={{ display: "block" }}>
            <defs>
              <radialGradient id="lab-bob" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#a5b4fc" />
                <stop offset="60%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#312e81" />
              </radialGradient>
              <radialGradient id="lab-bob-shine" cx="30%" cy="25%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <filter id="lab-glow">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="lab-softshadow">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="6"
                  floodOpacity="0.15"
                />
              </filter>
            </defs>

            {/* Background grid */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={i}
                x1={0}
                y1={i * 40}
                x2={SVG_W}
                y2={i * 40}
                stroke="hsl(220,14%,89%)"
                strokeWidth={0.5}
              />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={i}
                x1={i * 42}
                y1={0}
                x2={i * 42}
                y2={SVG_H}
                stroke="hsl(220,14%,89%)"
                strokeWidth={0.5}
              />
            ))}

            {/* Ceiling mount */}
            <rect
              x={0}
              y={0}
              width={SVG_W}
              height={18}
              fill="hsl(220,14%,93%)"
            />
            <rect
              x={PIVOT_X - 14}
              y={8}
              width={28}
              height={20}
              rx={4}
              fill="#94a3b8"
            />
            <circle cx={PIVOT_X} cy={18} r={5} fill="#64748b" />

            {/* Trail arc */}
            {showTrail && trail.length > 1 && (
              <polyline
                points={trail.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#818cf8"
                strokeOpacity={0.2}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            )}

            {/* Length ruler on left */}
            <line
              x1={PIVOT_X - stringLen * 0.9 - 30}
              y1={PIVOT_Y}
              x2={PIVOT_X - stringLen * 0.9 - 30}
              y2={PIVOT_Y + stringLen}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <line
              x1={PIVOT_X - stringLen * 0.9 - 38}
              y1={PIVOT_Y}
              x2={PIVOT_X - stringLen * 0.9 - 22}
              y2={PIVOT_Y}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <line
              x1={PIVOT_X - stringLen * 0.9 - 38}
              y1={PIVOT_Y + stringLen}
              x2={PIVOT_X - stringLen * 0.9 - 22}
              y2={PIVOT_Y + stringLen}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <text
              x={PIVOT_X - stringLen * 0.9 - 44}
              y={PIVOT_Y + stringLen / 2 + 4}
              fontSize={11}
              fill="#64748b"
              textAnchor="middle"
              transform={`rotate(-90 ${PIVOT_X - stringLen * 0.9 - 44} ${PIVOT_Y + stringLen / 2 + 4})`}
              fontFamily="var(--font-body)"
            >
              {lengthM.toFixed(2)} m
            </text>

            {/* String */}
            <line
              x1={PIVOT_X}
              y1={PIVOT_Y}
              x2={bob.x}
              y2={bob.y}
              stroke="#475569"
              strokeWidth={1.8}
              strokeLinecap="round"
            />

            {/* Bob glow halo */}
            <circle
              cx={bob.x}
              cy={bob.y}
              r={22}
              fill="#4f46e5"
              fillOpacity={0.1}
              filter="url(#lab-glow)"
            />

            {/* Bob */}
            <circle
              cx={bob.x}
              cy={bob.y}
              r={16}
              fill="url(#lab-bob)"
              filter="url(#lab-softshadow)"
            />
            <circle cx={bob.x} cy={bob.y} r={16} fill="url(#lab-bob-shine)" />

            {/* Equilibrium line */}
            <line
              x1={PIVOT_X}
              y1={PIVOT_Y}
              x2={PIVOT_X}
              y2={SVG_H}
              stroke="#e2e8f0"
              strokeWidth={1}
              strokeDasharray="4 6"
            />

            {/* Angle indicator arc */}
            {running && (
              <path
                d={`M ${PIVOT_X} ${PIVOT_Y + 40} A 40 40 0 0 ${angle > 0 ? 1 : 0} ${PIVOT_X + 40 * Math.sin(angle)} ${PIVOT_Y + 40 + 40 * (Math.cos(angle) - 1)}`}
                fill="none"
                stroke="#818cf8"
                strokeWidth={1.5}
                strokeOpacity={0.5}
              />
            )}
          </svg>
        </div>

        {/* ── Controls Panel ── */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[260px]">
          {/* Length slider */}
          <div className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Pendulum Length
              </p>
              <span className="text-sm font-bold text-indigo-600 font-heading">
                {lengthM.toFixed(2)} m
              </span>
            </div>
            <input
              type="range"
              min={MIN_L * 100}
              max={MAX_L * 100}
              step={5}
              value={lengthM * 100}
              onChange={(e) => {
                resetPendulum();
                setLengthM(+e.target.value / 100);
              }}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{MIN_L} m</span>
              <span>{MAX_L} m</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[0.25, 0.5, 0.75, 1.0, 1.25, 1.5].map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    resetPendulum();
                    setLengthM(v);
                  }}
                  className={`text-xs py-1 rounded-lg border transition-all ${
                    lengthM === v
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-muted text-muted-foreground border-border hover:border-indigo-300"
                  }`}
                >
                  {v} m
                </button>
              ))}
            </div>
          </div>

          {/* Expected period */}
          <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">
              Theoretical Period
            </p>
            <p className="text-2xl font-extrabold font-heading text-indigo-600">
              {theoreticalT.toFixed(3)} s
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              T = 2π √(L/g)
            </p>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={handleStartStop}
              className={`flex-1 border-0 text-white text-xs gap-1.5 ${running ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {running ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetPendulum}
              className="w-9 h-9 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Trail toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setShowTrail((s) => !s)}
              className={`w-9 h-5 rounded-full transition-colors ${showTrail ? "bg-indigo-500" : "bg-muted"} relative shrink-0`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showTrail ? "translate-x-4" : "translate-x-0.5"}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              Show trail arc
            </span>
          </label>

          {/* Timing section */}
          <div className="p-3 rounded-2xl bg-card border border-border space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Stopwatch
            </p>
            <Button
              onClick={handleTime}
              disabled={!running || timing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-xs"
            >
              ⏱ Time 5 Full Swings
            </Button>
            {timing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-center text-muted-foreground"
              >
                Counting… {Math.floor(swingCount / 2)}/5 swings
              </motion.p>
            )}
            <AnimatePresence>
              {measuredT != null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                >
                  <p className="text-[10px] text-emerald-600 font-semibold">
                    Measured Period
                  </p>
                  <p className="text-xl font-extrabold font-heading text-emerald-600">
                    {measuredT.toFixed(3)} s
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    vs theoretical {theoreticalT.toFixed(3)} s
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Record reading */}
          <Button
            onClick={handleRecord}
            disabled={measuredT == null}
            className={`gap-2 text-sm border-0 ${justAdded ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"} disabled:opacity-40`}
          >
            <Plus className="w-4 h-4" />
            {justAdded ? "✓ Recorded!" : "Record Reading"}
          </Button>

          {readings.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-muted-foreground"
            >
              {readings.length} reading{readings.length !== 1 ? "s" : ""}{" "}
              recorded
            </motion.p>
          )}
        </div>
      </div>

      {readings.length >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-semibold"
        >
          Great work! Head to the Data tab to analyse your results →
        </motion.div>
      )}
    </div>
  );
}
