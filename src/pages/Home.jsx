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
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Experiment data ─────────────────────────────────────────────── */
const GROUPS = [
  {
    label: "Physics",
    icon: Activity,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
    experiments: [
      {
        title: "Simple Pendulum",
        description: "Investigate how pendulum length affects its period. Plot T² vs L and calculate g experimentally.",
        icon: Activity,
        path: "/experiment/pendulum",
        accentColor: "#2d7d52",
        accentBg: "from-emerald-600 to-teal-700",
        tag: "Physics",
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
        tag: "Physics",
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
        tag: "Physics",
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
        tag: "Physics",
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
        tag: "Physics",
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
    dot: "bg-cyan-500",
    experiments: [
      {
        title: "Atomic Structure",
        description: "Fire alpha particles at gold foil and discover Rutherford's model of the atom.",
        icon: Atom,
        path: "/experiment/atomic-structure",
        accentColor: "#0369a1",
        accentBg: "from-cyan-600 to-blue-700",
        tag: "Chemistry",
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
        tag: "Chemistry",
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
    dot: "bg-emerald-500",
    experiments: [
      {
        title: "Cell Division",
        description: "Watch mitosis unfold step by step through animated phase-by-phase microscope visuals.",
        icon: Microscope,
        path: "/experiment/cell-division",
        accentColor: "#166534",
        accentBg: "from-green-600 to-emerald-700",
        tag: "Biology",
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
    dot: "bg-lime-500",
    experiments: [
      {
        title: "Plant Growth Factors",
        description: "Investigate how light, water, and soil nutrients affect plant growth in a simulation.",
        icon: Leaf,
        path: "#",
        accentColor: "#3f6212",
        accentBg: "from-lime-600 to-green-700",
        tag: "Agriculture",
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

/* ─── Difficulty badge ──────────────────────────────────────────────── */
function DifficultyBadge({ level }) {
  const map = {
    Easy: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border border-amber-200",
    Hard: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[level]}`}>
      {level}
    </span>
  );
}

/* ─── Single experiment card ─────────────────────────────────────────── */
function ExpCard({ exp, index }) {
  const Icon = exp.icon;
  const isLocked = !exp.available;

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300
        ${isLocked
          ? "border-border opacity-70 cursor-not-allowed"
          : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-0.5 cursor-pointer"
        }`}
    >
      {/* Top colour strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${exp.accentBg} ${isLocked ? "opacity-40" : ""}`} />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: exp.accentColor + "18" }}
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

        {/* Text */}
        <div className="flex-1">
          <h4 className="text-sm font-bold font-heading text-foreground mb-1 group-hover:text-primary transition-colors leading-snug">
            {exp.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {exp.description}
          </p>
        </div>

        {/* Footer */}
        {!isLocked && (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity pt-1 border-t border-border">
            Start Experiment <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </motion.div>
  );

  return isLocked ? card : <Link to={exp.path}>{card}</Link>;
}

/* ─── Stats item ─────────────────────────────────────────────────────── */
function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-extrabold font-heading text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold font-heading text-foreground text-sm tracking-tight">
              Virtual Science Lab
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {availableCount} labs open
            </span>
            <a
              href="#experiments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Browse Labs <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        {/* Floating decorations */}
        <motion.div
          className="absolute top-20 right-[12%] hidden lg:block"
          animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="64" height="84" viewBox="0 0 64 84" fill="none">
            <rect x="12" y="10" width="40" height="58" rx="5" stroke="hsl(160,63%,32%)" strokeWidth="2" strokeOpacity="0.25" fill="hsl(160,63%,32%)" fillOpacity="0.06" />
            <rect x="14" y="42" width="36" height="24" rx="3" fill="hsl(36,95%,54%)" fillOpacity="0.18" />
            <path d="M12 10 L7 5 M52 10 L57 5" stroke="hsl(160,63%,32%)" strokeWidth="2" strokeOpacity="0.25" strokeLinecap="round" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute top-28 left-[10%] hidden lg:block"
          animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="22" stroke="hsl(36,95%,54%)" strokeWidth="2" strokeOpacity="0.25" fill="hsl(36,95%,54%)" fillOpacity="0.06" />
            <circle cx="26" cy="26" r="9" stroke="hsl(36,95%,54%)" strokeWidth="1.5" strokeOpacity="0.2" />
            <circle cx="26" cy="26" r="3.5" fill="hsl(36,95%,54%)" fillOpacity="0.35" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute bottom-16 left-[18%] hidden lg:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <polygon points="20,4 36,32 4,32" stroke="hsl(160,63%,32%)" strokeWidth="1.5" strokeOpacity="0.2" fill="hsl(160,63%,32%)" fillOpacity="0.05" />
          </svg>
        </motion.div>

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <FlaskConical className="w-3.5 h-3.5" />
              Interactive Virtual Experiments
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-foreground mb-5 leading-[1.1]">
              Learn Science{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  by Doing
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-accent/25 rounded -z-0" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
              Virtual labs for physics, chemistry, biology &amp; agriculture.
              Run real experiments — no equipment, no mess, no limits.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
              <a
                href="#experiments"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5"
              >
                Start Experimenting <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#experiments"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/25 text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
              >
                <BookOpen className="w-4 h-4" /> Browse All Labs
              </a>
            </div>

            {/* Stats row */}
            <div className="inline-flex items-center gap-6 sm:gap-10 px-8 py-5 rounded-2xl bg-card border border-border shadow-sm">
              <Stat value={`${availableCount}`} label="Open Labs" />
              <div className="w-px h-8 bg-border" />
              <Stat value={`${GROUPS.length}`} label="Subjects" />
              <div className="w-px h-8 bg-border" />
              <Stat value={`${totalExperiments}`} label="Experiments" />
              <div className="w-px h-8 bg-border" />
              <Stat value="Free" label="Always" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Subject sections ── */}
      <section id="experiments" className="max-w-6xl mx-auto px-4 py-14 space-y-14">

        {/* Section header */}
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

        {/* Groups */}
        {GROUPS.map((group, gi) => {
          const GroupIcon = group.icon;
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + gi * 0.1 }}
            >
              {/* Group header */}
              <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full ${group.bg} border ${group.border} mb-5`}>
                <GroupIcon className={`w-4 h-4 ${group.color}`} />
                <span className={`text-sm font-bold font-heading ${group.color}`}>
                  {group.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  · {group.experiments.filter(e => e.available).length}/{group.experiments.length} available
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

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <FlaskConical className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold font-heading text-sm text-foreground">Virtual Science Lab</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Interactive experiments for curious minds.
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
