import React from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Atom,
  Zap,
  Flame,
  Microscope,
  Waves,
  Leaf,
  Activity,
  Lock,
  ChevronRight,
  Play,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Data ───────────────────────────────────────────────────────────── */
const GROUPS = [
  {
    label: "Physics",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    subjectColor: "#2d7d52",
    experiments: [
      {
        title: "Simple Pendulum",
        description: "Investigate how pendulum length affects its period. Plot T² vs L and calculate g experimentally.",
        icon: Activity,
        path: "/experiment/pendulum",
        accentColor: "#2d7d52",
        accentBg: "from-emerald-600 to-teal-700",
        difficulty: "Easy",
        available: true,
      },
      {
        title: "Measuring Density",
        description: "Determine the density of irregular objects using the water displacement method.",
        icon: FlaskConical,
        path: "/experiment/density",
        accentColor: "#1e6b4a",
        accentBg: "from-green-700 to-emerald-800",
        difficulty: "Easy",
        available: true,
      },
      {
        title: "Pressure in Liquids",
        description: "Probe how pressure changes with depth in different liquids using a virtual sensor.",
        icon: Waves,
        path: "/experiment/pressure",
        accentColor: "#1a6494",
        accentBg: "from-blue-600 to-cyan-700",
        difficulty: "Easy",
        available: true,
      },
      {
        title: "Circuit Builder",
        description: "Build and test electrical circuits with resistors, LEDs, and batteries in a virtual breadboard.",
        icon: Zap,
        path: "#",
        accentColor: "#c27c1a",
        accentBg: "from-amber-500 to-orange-600",
        difficulty: "Medium",
        available: false,
      },
      {
        title: "Wave Properties",
        description: "Visualize transverse and longitudinal waves to understand frequency and amplitude.",
        icon: Waves,
        path: "#",
        accentColor: "#7c3aed",
        accentBg: "from-violet-500 to-fuchsia-600",
        difficulty: "Medium",
        available: false,
      },
    ],
  },
  {
    label: "Chemistry",
    icon: Atom,
    color: "text-cyan-700",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    subjectColor: "#0369a1",
    experiments: [
      {
        title: "Atomic Structure",
        description: "Fire alpha particles at gold foil and discover Rutherford's model of the atom.",
        icon: Atom,
        path: "/experiment/atomic-structure",
        accentColor: "#0369a1",
        accentBg: "from-cyan-600 to-blue-700",
        difficulty: "Easy",
        available: true,
      },
      {
        title: "Exothermic Reactions",
        description: "Observe and measure temperature changes during chemical reactions in a virtual calorimeter.",
        icon: Flame,
        path: "#",
        accentColor: "#be123c",
        accentBg: "from-red-500 to-pink-600",
        difficulty: "Medium",
        available: false,
      },
    ],
  },
  {
    label: "Biology",
    icon: Microscope,
    color: "text-emerald-700",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    subjectColor: "#166534",
    experiments: [
      {
        title: "Cell Division",
        description: "Watch mitosis unfold step by step through animated phase-by-phase microscope visuals.",
        icon: Microscope,
        path: "/experiment/cell-division",
        accentColor: "#166534",
        accentBg: "from-green-600 to-emerald-700",
        difficulty: "Hard",
        available: true,
      },
    ],
  },
  {
    label: "Agriculture",
    icon: Leaf,
    color: "text-lime-700",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    subjectColor: "#3f6212",
    experiments: [
      {
        title: "Plant Growth Factors",
        description: "Investigate how light, water, and soil nutrients affect plant growth in a simulation.",
        icon: Leaf,
        path: "#",
        accentColor: "#3f6212",
        accentBg: "from-lime-600 to-green-700",
        difficulty: "Easy",
        available: false,
      },
    ],
  },
];

const totalExperiments = GROUPS.reduce((s, g) => s + g.experiments.length, 0);
const availableCount = GROUPS.reduce(
  (s, g) => s + g.experiments.filter((e) => e.available).length,
  0
);

/* ─── Subject avatar dots (like the CAMT+ card in the reference) ─────── */
const SUBJECT_DOTS = [
  { label: "P", color: "#2d7d52", title: "Physics" },
  { label: "C", color: "#0369a1", title: "Chemistry" },
  { label: "B", color: "#166534", title: "Biology" },
  { label: "A", color: "#3f6212", title: "Agriculture" },
];

/* ─── Difficulty badge ────────────────────────────────────────────────── */
function DifficultyBadge({ level }) {
  const map = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[level]}`}>
      {level}
    </span>
  );
}

/* ─── Experiment card ─────────────────────────────────────────────────── */
function ExpCard({ exp, index }) {
  const Icon = exp.icon;
  const isLocked = !exp.available;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
        isLocked
          ? "border-border opacity-65 cursor-not-allowed"
          : "border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 cursor-pointer"
      }`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${exp.accentBg} ${isLocked ? "opacity-40" : ""}`} />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: exp.accentColor + "15" }}
          >
            <Icon className="w-5 h-5" style={{ color: exp.accentColor }} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <DifficultyBadge level={exp.difficulty} />
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                <Lock className="w-2.5 h-2.5" /> Soon
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold font-heading text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
            {exp.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {exp.description}
          </p>
        </div>
        {!isLocked && (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border">
            Open Lab <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </motion.div>
  );

  return isLocked ? card : <Link to={exp.path}>{card}</Link>;
}

/* ─── Main page ───────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/92 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold font-heading text-foreground text-sm">
              VirtualSciLab
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {availableCount} labs open
            </span>
            <a
              href="#experiments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              Explore Labs <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "hsl(160 30% 96%)" }}>
        {/* Subtle radial tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 65% 50%, hsl(36 95% 54% / 0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 70% at 10% 80%, hsl(160 63% 32% / 0.07) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: Copy ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Big headline — brand pill embedded in last line */}
              <h1 className="font-heading font-extrabold text-foreground leading-[1.08] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
                Run Real Experiments —{" "}
                <br className="hidden sm:block" />
                Learn Science Hands-On with
                <br />
                <span
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-2xl text-white mt-3"
                  style={{ background: "hsl(160 63% 32%)", fontSize: "0.92em" }}
                >
                  <FlaskConical className="w-6 h-6 flex-shrink-0" />
                  Virtual Science Lab
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
                Physics, chemistry, biology &amp; agriculture experiments —
                interactive, guided, and completely free. No equipment needed.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-wrap mb-10">
                <a
                  href="#experiments"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
                  style={{ boxShadow: "0 8px 24px hsl(160 63% 32% / 0.3)" }}
                >
                  Get Started
                </a>
                <a
                  href="#experiments"
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center">
                    <Play className="w-4 h-4 fill-primary text-primary ml-0.5" />
                  </span>
                  Browse Experiments
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 sm:gap-10">
                <div>
                  <div className="text-3xl font-extrabold font-heading text-foreground leading-none">{totalExperiments}</div>
                  <div className="text-xs text-muted-foreground mt-1">Experiments</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="text-3xl font-extrabold font-heading text-foreground leading-none">{GROUPS.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Subjects</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="text-3xl font-extrabold font-heading text-foreground leading-none">100%</div>
                  <div className="text-xs text-muted-foreground mt-1">Free</div>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Floating cards ──────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex flex-col items-end gap-4"
            >
              {/* App icon card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-xl border border-border p-4 w-24 h-24 flex items-center justify-center self-end mr-8"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(160 63% 32%), hsl(160 55% 48%))" }}
                >
                  <FlaskConical className="w-7 h-7 text-white" />
                </div>
              </motion.div>

              {/* Main preview card */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-border p-6 w-72"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(160 63% 32% / 0.12)" }}
                  >
                    <FlaskConical className="w-5 h-5" style={{ color: "hsl(160 63% 32%)" }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold font-heading text-foreground">Simple Pendulum</div>
                    <div className="text-xs text-muted-foreground">Physics · Easy</div>
                  </div>
                </div>
                {/* Fake chart bars */}
                <div className="flex items-end gap-1.5 h-16 mb-3">
                  {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: i === 5
                          ? "hsl(36 95% 54%)"
                          : "hsl(160 63% 32% / 0.2)",
                      }}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">T² vs. Length — 7 data points collected</div>
              </motion.div>

              {/* Social proof card */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="bg-white rounded-2xl shadow-lg border border-border px-5 py-3.5 flex items-center gap-4 self-start ml-8"
              >
                <div className="flex -space-x-2">
                  {SUBJECT_DOTS.map((s) => (
                    <div
                      key={s.label}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                      title={s.title}
                    >
                      {s.label}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
                    +
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{availableCount} labs open now</div>
                  <div className="text-[11px] text-muted-foreground">across {GROUPS.length} subjects</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Experiment sections ─────────────────────────────────────────── */}
      <section id="experiments" className="max-w-6xl mx-auto px-6 py-14 space-y-14">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Curriculum</p>
            <h2 className="text-2xl font-extrabold font-heading text-foreground">Explore Experiments</h2>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:block">
            {availableCount} of {totalExperiments} available
          </span>
        </motion.div>

        {GROUPS.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + gi * 0.1 }}
            >
              <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full ${group.bg} border ${group.border} mb-5`}>
                <GroupIcon className={`w-4 h-4 ${group.color}`} />
                <span className={`text-sm font-bold font-heading ${group.color}`}>
                  {group.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {group.experiments.filter((e) => e.available).length}/{group.experiments.length} available
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.experiments.map((exp, i) => (
                  <ExpCard key={exp.title} exp={exp} index={gi * 5 + i} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-secondary/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold font-heading text-sm text-foreground">Virtual Science Lab</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Interactive experiments for curious minds. Always free.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {availableCount} labs live
          </div>
        </div>
      </footer>
    </div>
  );
}
