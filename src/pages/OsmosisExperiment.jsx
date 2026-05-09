import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, Play, Pause, Timer, CheckCircle2 } from "lucide-react";
import { useExperimentNav } from "@/hooks/useExperimentNav";
import ExperimentShell from "@/components/lab/ExperimentShell";
import {
  OsmosisIntroSVG, SolutionSetupSVG, PotatoCutSVG, StripInsertSVG,
  OsmosisActiveSVG, MeasureResultsSVG, OsmosisGraphSVG, ConclusionCellsSVG,
  OSMOSIS_RESULTS,
} from "@/components/osmosis/OsmosisSVG";

const STEPS = [
  { id:0, label:"Intro"     },
  { id:1, label:"Solutions" },
  { id:2, label:"Cut Strips"},
  { id:3, label:"Insert"    },
  { id:4, label:"Osmosis"   },
  { id:5, label:"Results"   },
  { id:6, label:"Data"      },
  { id:7, label:"Graph"     },
  { id:8, label:"Conclusion"},
];
const TOTAL_STEPS = STEPS.length;

const THEME = {
  iconBg:    "bg-emerald-500/10",
  iconColor: "text-emerald-600",
  done:      "bg-emerald-400",
  current:   "bg-emerald-500",
  label:     "text-emerald-600",
  dot:       "hsl(152,76%,36%)",
  button:    "bg-emerald-600 hover:bg-emerald-700 text-white border-0",
};

const DISCOVERY_QS = [
  {
    q: "Why did the strip in distilled water gain mass?",
    a: "Distilled water (0 M) is hypotonic relative to potato cell sap (~0.45 M). Water moves by osmosis from high water potential (dilute solution) into the cells, increasing turgor pressure. The strip swells and gains length and mass.",
    color:"text-blue-700", bg:"bg-blue-500/8", border:"border-blue-500/25",
  },
  {
    q: "Why did the strip in 1.0 M NaCl shrink and go limp?",
    a: "The 1.0 M NaCl solution is hypertonic — its water potential is much lower than the potato cells'. Water leaves the cells by osmosis into the surrounding solution, the vacuoles shrink, cells lose turgor, and the strip becomes flaccid and shorter.",
    color:"text-orange-700", bg:"bg-orange-500/8", border:"border-orange-500/25",
  },
  {
    q: "What concentration is approximately isotonic for potato cells?",
    a: "The isotonic point is where % mass change = 0, found from the x-intercept of your graph. For potato it is approximately 0.45–0.5 M NaCl, corresponding to a water potential of around −1.1 MPa — equal to the cell sap.",
    color:"text-green-700", bg:"bg-green-500/8", border:"border-green-500/25",
  },
  {
    q: "How do you find the isotonic point precisely from the graph?",
    a: "Plot % mass change (y-axis) against NaCl concentration (x-axis). Draw a best-fit line through the data points. The x-intercept — where the line crosses 0% — gives the isotonic concentration for the potato tissue.",
    color:"text-violet-700", bg:"bg-violet-500/8", border:"border-violet-500/25",
  },
  {
    q: "Why must you blot the strips dry before measuring?",
    a: "Surface water clinging to the strip would add mass unrelated to osmosis, making the results inaccurate. Gentle blotting removes free water without squeezing out cell contents, so the mass change reflects only water that crossed the cell membranes.",
    color:"text-teal-700", bg:"bg-teal-500/8", border:"border-teal-500/25",
  },
];

const slideVariants = {
  enter: d => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  d => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
};

export default function OsmosisExperiment() {
  const [autoPlay,     setAutoPlay]     = useState(false);
  const [solPhase,     setSolPhase]     = useState(-1);
  const [cuts,         setCuts]         = useState(0);
  const [elapsed,      setElapsed]      = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [revealedQs,   setRevealedQs]   = useState([]);
  const timerRef = useRef(null);

  const resetExperimentState = () => {
    setAutoPlay(false);
    setSolPhase(-1);
    setCuts(0);
    setElapsed(0);
    setTimerRunning(false);
    setRevealedQs([]);
    clearInterval(timerRef.current);
  };

  const { step, dir, goTo, next, back, reset } =
    useExperimentNav(TOTAL_STEPS, resetExperimentState);

  const addSolution = () => setSolPhase(p => Math.min(p + 1, 3));
  const cutStrip    = () => setCuts(c => Math.min(c + 1, 4));

  const startTimer = () => {
    if (elapsed >= 30 || timerRunning) return;
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e >= 30) { clearInterval(timerRef.current); setTimerRunning(false); return 30; }
        return e + 1;
      });
    }, 1000);
  };

  const skipTimer = () => {
    clearInterval(timerRef.current);
    setElapsed(30);
    setTimerRunning(false);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    if (!autoPlay) return;
    if (step >= TOTAL_STEPS - 1) { setAutoPlay(false); return; }
    const interactive = new Set([1, 2]);
    if (interactive.has(step)) { setAutoPlay(false); return; }
    if (step === 4 && elapsed < 30) { skipTimer(); return; }
    const t = setTimeout(() => goTo(step + 1), 4200);
    return () => clearTimeout(t);
  }, [autoPlay, step, elapsed]);

  const canAdvance = (() => {
    if (step === 1) return solPhase >= 3;
    if (step === 2) return cuts >= 4;
    return true;
  })();

  const toggleQ = i =>
    setRevealedQs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const autoPlayButton = (
    <Button variant="outline" size="sm"
      onClick={() => setAutoPlay(!autoPlay)}
      className={`gap-1.5 text-xs ${autoPlay ? "border-emerald-500 text-emerald-600" : ""}`}>
      {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      {autoPlay ? "Pause" : "Auto"}
    </Button>
  );

  return (
    <ExperimentShell
      title="Effects of Concentration on Osmosis"
      subject="Biology · Transport in Cells"
      icon={Droplets}
      theme={THEME}
      stages={STEPS}
      step={step}
      dir={dir}
      onGoTo={goTo}
      onNext={next}
      onBack={back}
      onReset={reset}
      canAdvance={canAdvance}
      extraHeaderControls={autoPlayButton}
    >
      <div className="flex flex-col items-center gap-6 w-full">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div key={step} custom={dir}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col items-center gap-5">

            {/* ══════════ STEP 0: INTRO ══════════════════════════ */}
            {step === 0 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Biology · Osmosis
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">
                    Effects of Concentration on Osmosis
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    Osmosis is the net movement of water molecules through a semi-permeable membrane,
                    from a region of <strong>high water potential</strong> (dilute solution) to
                    <strong> low water potential</strong> (concentrated solution). We will place
                    potato strips into NaCl solutions of increasing concentration and measure the
                    change in length after 30 minutes.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <OsmosisIntroSVG />
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto w-full">
                  {[
                    { label:"Variable",  value:"NaCl concentration",   icon:"🧂" },
                    { label:"Subject",   value:"Potato strips",         icon:"🥔" },
                    { label:"Measure",   value:"% length change",       icon:"📏" },
                  ].map(card => (
                    <div key={card.label} className="p-3 rounded-2xl border bg-card text-center">
                      <p className="text-2xl mb-1">{card.icon}</p>
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                      <p className="font-bold text-xs mt-0.5">{card.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 max-w-lg mx-auto w-full">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Hypothesis</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    As NaCl concentration increases, osmotic pressure will cause more water to leave
                    the potato cells — so strips in dilute solutions will gain length, while strips
                    in concentrated solutions will lose length and become flaccid.
                  </p>
                </div>
              </div>
            )}

            {/* ══════════ STEP 1: PREPARE SOLUTIONS ═══════════════ */}
            {step === 1 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 1 of 8 — Prepare Solutions
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Set Up the Beakers</h2>
                  <p className="text-sm text-muted-foreground">
                    Prepare four 250 mL beakers with increasing NaCl concentrations. Click each step to fill the next beaker.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <SolutionSetupSVG phase={solPhase} />
                </div>
                <div className="flex flex-col gap-2 max-w-sm mx-auto w-full">
                  {[
                    "Fill beaker A with 0 M (distilled water)",
                    "Fill beaker B with 0.2 M NaCl solution",
                    "Fill beaker C with 0.5 M NaCl solution",
                    "Fill beaker D with 1.0 M NaCl solution",
                  ].map((label, i) => (
                    <motion.button key={i}
                      onClick={() => { if (solPhase === i - 1) addSolution(); }}
                      disabled={solPhase >= i}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left text-sm font-medium ${
                        solPhase >= i
                          ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-700"
                          : solPhase === i - 1
                          ? "border-emerald-500 bg-white hover:bg-emerald-50 cursor-pointer text-foreground"
                          : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:i*0.08 }}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        solPhase >= i ? "bg-emerald-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                      }`}>
                        {solPhase >= i ? "✓" : i + 1}
                      </span>
                      {label}
                    </motion.button>
                  ))}
                </div>
                {solPhase >= 3 && (
                  <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    className="p-3 rounded-2xl bg-emerald-500/8 border border-emerald-500/25 text-center max-w-sm mx-auto">
                    <p className="text-sm font-bold text-emerald-700">✓ All 4 solutions ready — proceed to cut potato strips!</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* ══════════ STEP 2: CUT POTATO STRIPS ═══════════════ */}
            {step === 2 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 2 of 8 — Prepare Strips
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Cut and Measure Potato Strips</h2>
                  <p className="text-sm text-muted-foreground">
                    Cut 4 strips from the same potato using a cork borer or scalpel. Each strip must be exactly 5.0 cm.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <PotatoCutSVG cuts={cuts} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Button onClick={cutStrip} disabled={cuts >= 4}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-8 py-2">
                    {cuts >= 4 ? "✓ All 4 strips ready!" : `✂  Cut strip ${cuts + 1} of 4`}
                  </Button>
                  <div className="flex gap-2">
                    {[0,1,2,3].map(i => (
                      <motion.div key={i}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          cuts > i ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                        }`}
                        animate={{ scale: cuts > i ? [1.2, 1] : 1 }}>
                        {cuts > i ? "✓" : i + 1}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 max-w-md mx-auto w-full">
                  <p className="text-xs font-bold text-amber-700 mb-1">⚠ Control variables</p>
                  <p className="text-xs text-muted-foreground">Use strips from the same potato. Cut strips at the same width using a cork borer so that surface area is identical for all four samples.</p>
                </div>
              </div>
            )}

            {/* ══════════ STEP 3: INSERT STRIPS ════════════════════ */}
            {step === 3 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 3 of 8 — Begin Experiment
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Place Strips in Solutions</h2>
                  <p className="text-sm text-muted-foreground">
                    Submerge one strip into each beaker. Ensure each strip is completely covered and the experiment starts at the same time.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <StripInsertSVG />
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto w-full">
                  {[
                    "Record initial length (5.0 cm) before inserting",
                    "Ensure strips are fully submerged in solution",
                    "Keep all beakers at the same temperature (20°C)",
                    "Leave undisturbed for exactly 30 minutes",
                  ].map((tip, i) => (
                    <motion.div key={i} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.1 }}
                      className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ STEP 4: OSMOSIS IN ACTION ════════════════ */}
            {step === 4 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 4 of 8 — Osmosis in Progress
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Osmosis is Happening!</h2>
                  <p className="text-sm text-muted-foreground">
                    Water molecules are crossing cell membranes driven by water potential gradients. Watch how each strip responds to its solution.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <OsmosisActiveSVG elapsed={elapsed} running={timerRunning} />
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={startTimer} disabled={timerRunning || elapsed >= 30}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Timer className="w-4 h-4" />
                    {elapsed === 0 ? "Start 30-min timer"
                     : elapsed >= 30 ? "✓ Time complete!"
                     : `Running… ${elapsed}/30 min`}
                  </Button>
                  {elapsed < 30 && (
                    <Button variant="outline" onClick={skipTimer} className="text-xs gap-1.5">
                      Skip to results
                    </Button>
                  )}
                </div>
                {elapsed > 0 && elapsed < 30 && (
                  <div className="max-w-sm mx-auto w-full space-y-1.5">
                    {[
                      { conc:"0 M",   pct:"+"+((elapsed/30)*8).toFixed(1),   color:"text-blue-600"  },
                      { conc:"0.2 M", pct:"+"+((elapsed/30)*3).toFixed(1),   color:"text-indigo-600"},
                      { conc:"0.5 M", pct:   ((elapsed/30)*-1).toFixed(1),   color:"text-green-600" },
                      { conc:"1.0 M", pct:   ((elapsed/30)*-12).toFixed(1),  color:"text-orange-600"},
                    ].map(r => (
                      <div key={r.conc} className="flex justify-between text-xs px-2">
                        <span className="text-muted-foreground">{r.conc} NaCl</span>
                        <span className={`font-bold ${r.color}`}>{r.pct}% change so far</span>
                      </div>
                    ))}
                  </div>
                )}
                {elapsed >= 30 && (
                  <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                    className="p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/25 text-center max-w-md mx-auto">
                    <p className="font-bold text-emerald-700 text-sm">✓ 30 minutes complete!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Remove each strip, blot gently with tissue, and measure its new length.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* ══════════ STEP 5: MEASURE RESULTS ══════════════════ */}
            {step === 5 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 5 of 8 — Measure Results
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Before vs After</h2>
                  <p className="text-sm text-muted-foreground">
                    Remove each strip, blot dry, and measure its new length. Compare with the original 5.0 cm.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <MeasureResultsSVG />
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto w-full">
                  {OSMOSIS_RESULTS.map((r,i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay:i*0.1 }}
                      className="p-3 rounded-xl border-2" style={{ borderColor: r.color+"60" }}>
                      <p className="font-bold text-xs" style={{ color:r.tc }}>{r.conc} NaCl — {r.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.initial} cm → {r.final} cm</p>
                      <p className="font-extrabold text-sm mt-1" style={{ color:r.tc }}>
                        {r.pct > 0 ? "+" : ""}{r.pct}% {r.pct > 0.5 ? "↑" : r.pct < -0.5 ? "↓" : "≈"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════════ STEP 6: DATA TABLE ═══════════════════════ */}
            {step === 6 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 6 of 8 — Data Table
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Record Your Results</h2>
                  <p className="text-sm text-muted-foreground">
                    Organise measurements in a results table. % change = (final − initial) ÷ initial × 100.
                  </p>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-border w-full max-w-xl mx-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-emerald-500/5">
                        <th className="text-left p-3 text-xs font-bold text-emerald-700">Concentration</th>
                        <th className="p-3 text-xs font-bold text-emerald-700">Initial (cm)</th>
                        <th className="p-3 text-xs font-bold text-emerald-700">Final (cm)</th>
                        <th className="p-3 text-xs font-bold text-emerald-700">Change (cm)</th>
                        <th className="p-3 text-xs font-bold text-emerald-700">% Change</th>
                        <th className="p-3 text-xs font-bold text-emerald-700">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OSMOSIS_RESULTS.map((r, i) => (
                        <motion.tr key={i}
                          initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay:i*0.12 }}
                          className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-semibold text-xs" style={{ color:r.tc }}>{r.conc}</td>
                          <td className="p-3 text-center text-xs text-muted-foreground">{r.initial.toFixed(1)}</td>
                          <td className="p-3 text-center text-xs font-medium">{r.final.toFixed(2)}</td>
                          <td className="p-3 text-center text-xs" style={{ color:r.tc }}>
                            {(r.final-r.initial)>0?"+":""}{(r.final-r.initial).toFixed(2)}
                          </td>
                          <td className="p-3 text-center text-xs font-bold" style={{ color:r.tc }}>
                            {r.pct>0?"+":""}{r.pct.toFixed(1)}%
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              r.type==="Hypotonic"  ? "bg-blue-100 text-blue-700"
                            : r.type==="Isotonic"   ? "bg-green-100 text-green-700"
                            :                         "bg-orange-100 text-orange-700"
                            }`}>{r.type}</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
                  className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 max-w-xl mx-auto w-full">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Key formula</p>
                  <p className="text-sm font-mono text-center py-1">
                    % change = (final − initial) ÷ initial × 100
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Positive = water entered cells (hypotonic). Negative = water left cells (hypertonic).
                  </p>
                </motion.div>
              </div>
            )}

            {/* ══════════ STEP 7: GRAPH + DISCOVERY QUESTIONS ══════ */}
            {step === 7 && (
              <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    Step 7 of 8 — Graph & Discovery
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Think Like a Biologist</h2>
                  <p className="text-sm text-muted-foreground">
                    Study the concentration–mass change graph, then reason through each question before revealing the answer.
                  </p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <OsmosisGraphSVG />
                </div>
                <div className="space-y-3 max-w-lg mx-auto w-full">
                  {DISCOVERY_QS.map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.07 }}>
                      <button onClick={() => toggleQ(i)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          revealedQs.includes(i)
                            ? `${item.border} ${item.bg}`
                            : "border-border bg-card hover:border-emerald-300"
                        }`}>
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 text-lg font-extrabold font-heading shrink-0 ${item.color}`}>{i+1}.</span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-foreground">{item.q}</p>
                            <AnimatePresence>
                              {revealedQs.includes(i) && (
                                <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                                  exit={{ opacity:0, height:0 }}
                                  className={`text-xs mt-2 leading-relaxed ${item.color}`}>{item.a}</motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                          <span className={`text-xs font-medium shrink-0 ${item.color}`}>
                            {revealedQs.includes(i) ? "▲ Hide" : "▼ Reveal"}
                          </span>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
                {revealedQs.length === DISCOVERY_QS.length && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="p-4 rounded-2xl bg-emerald-500/8 border border-emerald-500/25 text-center max-w-lg mx-auto w-full">
                    <p className="text-sm font-bold text-emerald-700">All questions explored — proceed to the conclusion!</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* ══════════ STEP 8: CONCLUSION ════════════════════════ */}
            {step === 8 && (
              <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-3">
                    ✅ Experiment Complete
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading mb-2">Conclusion</h2>
                  <p className="text-sm text-muted-foreground">What this experiment proved about osmosis and water potential in plant cells.</p>
                </div>
                <div className="w-full max-w-sm mx-auto aspect-[4/3]">
                  <ConclusionCellsSVG />
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border max-w-lg mx-auto w-full">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Experimental Procedure</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {[
                      { label:"Prepare 4 solutions",   c:"bg-slate-100 text-slate-800 border-slate-200" },
                      { label:"→",  c:"text-muted-foreground border-transparent" },
                      { label:"Cut 4 potato strips",   c:"bg-amber-100 text-amber-800 border-amber-200" },
                      { label:"→",  c:"text-muted-foreground border-transparent" },
                      { label:"Record initial length", c:"bg-blue-100 text-blue-800 border-blue-200" },
                      { label:"→",  c:"text-muted-foreground border-transparent" },
                      { label:"30-min osmosis",        c:"bg-green-100 text-green-800 border-green-200" },
                      { label:"→",  c:"text-muted-foreground border-transparent" },
                      { label:"Measure & calculate ✓", c:"bg-emerald-100 text-emerald-800 border-emerald-200" },
                    ].map((item,i) => (
                      <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${item.c}`}>{item.label}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto w-full">
                  {[
                    { title:"Osmosis",          detail:"Net water movement through a semi-permeable membrane from high to low water potential.",           icon:"💧", color:"border-blue-500/25 bg-blue-500/5"    },
                    { title:"Hypotonic",         detail:"Solution more dilute than cell sap — water enters by osmosis, cells become turgid.",              icon:"🫧", color:"border-sky-500/25 bg-sky-500/5"     },
                    { title:"Hypertonic",        detail:"Solution more concentrated than cell sap — water leaves cells, causing plasmolysis and wilting.",  icon:"🌵", color:"border-orange-500/25 bg-orange-500/5"},
                    { title:"Isotonic point",    detail:"Where % mass change = 0. Found at the x-intercept of the graph — equal water potentials.",        icon:"⚖️", color:"border-emerald-500/25 bg-emerald-500/5"},
                  ].map(card => (
                    <motion.div key={card.title}
                      initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                      className={`rounded-2xl border p-3 ${card.color}`}>
                      <p className="text-xl mb-1">{card.icon}</p>
                      <p className="font-bold text-sm font-heading text-foreground">{card.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{card.detail}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
                  className="p-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 text-center max-w-lg mx-auto w-full">
                  <p className="text-lg font-extrabold font-heading text-emerald-700 mb-2">
                    "Higher external NaCl concentration → greater water loss from potato cells."
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    As NaCl concentration increases, % mass change decreases from positive (hypotonic) through zero
                    (isotonic, ≈ 0.45 M) to negative (hypertonic). This linear relationship demonstrates
                    that water potential gradients drive osmosis in living plant cells.
                  </p>
                </motion.div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </ExperimentShell>
  );
}
