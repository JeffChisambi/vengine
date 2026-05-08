import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  Star,
  CheckCircle2,
  BookOpen,
  Users,
  Lightbulb,
  BarChart3,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── Experiment data ─────────────────────────────────────────────────── */
const ALL_EXPERIMENTS = [
  {
    title: "Simple Pendulum",
    description: "Investigate how length affects the period. Plot T² vs L and calculate g experimentally.",
    icon: Activity,
    path: "/experiment/pendulum",
    accentColor: "#2d7d52",
    accentBg: "from-emerald-500 to-teal-600",
    subject: "Physics",
    difficulty: "Easy",
    available: true,
  },
  {
    title: "Measuring Density",
    description: "Determine the density of irregular objects using the water displacement method.",
    icon: FlaskConical,
    path: "/experiment/density",
    accentColor: "#1e6b4a",
    accentBg: "from-green-600 to-emerald-700",
    subject: "Physics",
    difficulty: "Easy",
    available: true,
  },
  {
    title: "Pressure in Liquids",
    description: "Probe how pressure changes with depth in water, oil, and mercury.",
    icon: Waves,
    path: "/experiment/pressure",
    accentColor: "#1a6494",
    accentBg: "from-blue-500 to-cyan-600",
    subject: "Physics",
    difficulty: "Easy",
    available: true,
  },
  {
    title: "Circuit Builder",
    description: "Build and test electrical circuits with resistors, LEDs, and batteries.",
    icon: Zap,
    path: "#",
    accentColor: "#c27c1a",
    accentBg: "from-amber-400 to-orange-500",
    subject: "Physics",
    difficulty: "Medium",
    available: false,
  },
  {
    title: "Wave Properties",
    description: "Visualize transverse and longitudinal waves; control frequency and amplitude.",
    icon: Waves,
    path: "#",
    accentColor: "#7c3aed",
    accentBg: "from-violet-500 to-fuchsia-600",
    subject: "Physics",
    difficulty: "Medium",
    available: false,
  },
  {
    title: "Atomic Structure",
    description: "Fire alpha particles at gold foil and discover Rutherford's atomic model.",
    icon: Atom,
    path: "/experiment/atomic-structure",
    accentColor: "#0369a1",
    accentBg: "from-cyan-500 to-blue-600",
    subject: "Chemistry",
    difficulty: "Easy",
    available: true,
  },
  {
    title: "Exothermic Reactions",
    description: "Measure temperature changes during chemical reactions in a virtual calorimeter.",
    icon: Flame,
    path: "#",
    accentColor: "#be123c",
    accentBg: "from-red-500 to-pink-600",
    subject: "Chemistry",
    difficulty: "Medium",
    available: false,
  },
  {
    title: "Cell Division",
    description: "Watch mitosis unfold step by step through animated microscope visuals.",
    icon: Microscope,
    path: "/experiment/cell-division",
    accentColor: "#166534",
    accentBg: "from-green-500 to-emerald-700",
    subject: "Biology",
    difficulty: "Hard",
    available: true,
  },
  {
    title: "Plant Growth Factors",
    description: "Investigate how light, water, and soil nutrients affect plant growth rates.",
    icon: Leaf,
    path: "#",
    accentColor: "#3f6212",
    accentBg: "from-lime-500 to-green-600",
    subject: "Agriculture",
    difficulty: "Easy",
    available: false,
  },
];

const SUBJECTS = ["All", "Physics", "Chemistry", "Biology", "Agriculture"];

const FEATURES = [
  {
    icon: Lightbulb,
    title: "Interactive Simulations",
    desc: "Hands-on virtual labs that respond in real time — adjust variables and see results instantly without any equipment.",
    color: "#2d7d52",
    bg: "#2d7d5215",
  },
  {
    icon: BookOpen,
    title: "Step-by-Step Guidance",
    desc: "Every experiment includes structured stages with theory, procedure, data collection, and conclusion writing.",
    color: "#c27c1a",
    bg: "#c27c1a15",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    desc: "Log observations, generate graphs, and review your results to build real scientific reasoning skills.",
    color: "#0369a1",
    bg: "#0369a115",
  },
];

const availableCount = ALL_EXPERIMENTS.filter((e) => e.available).length;
const subjectCount = SUBJECTS.length - 1;

/* ─── Nav links ───────────────────────────────────────────────────────── */
const NAV_LINKS = ["Home", "About", "Experiments", "Subjects", "Contact"];

/* ─── Difficulty badge ────────────────────────────────────────────────── */
function DiffBadge({ level }) {
  const map = {
    Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50   text-amber-700   border-amber-200",
    Hard:   "bg-red-50     text-red-700     border-red-200",
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
  const locked = !exp.available;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.04 * index }}
      className={`group flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 h-full
        ${locked
          ? "border-border opacity-60 cursor-not-allowed"
          : "border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 cursor-pointer"
        }`}
    >
      {/* Coloured header */}
      <div className={`relative h-32 bg-gradient-to-br ${exp.accentBg} ${locked ? "opacity-60" : ""} flex items-center justify-center`}>
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Icon className="w-7 h-7 text-white" />
        </div>
        {locked && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 text-white text-[10px] font-semibold backdrop-blur-sm">
            <Lock className="w-2.5 h-2.5" /> Coming Soon
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <DiffBadge level={exp.difficulty} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: exp.accentColor }}>
          {exp.subject}
        </span>
        <h4 className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-snug">
          {exp.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {exp.description}
        </p>
        {!locked && (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
            Open Lab <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </motion.div>
  );

  return locked ? inner : <Link to={exp.path} className="flex flex-col h-full">{inner}</Link>;
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState("All");

  const filtered =
    activeSubject === "All"
      ? ALL_EXPERIMENTS
      : ALL_EXPERIMENTS.filter((e) => e.subject === activeSubject);

  return (
    <div className="min-h-screen bg-background font-body">

      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold font-heading text-foreground text-base tracking-tight">
              VirtualSciLab
            </span>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={link === "Experiments" ? "#experiments" : link === "Home" ? "#" : "#"}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {availableCount} labs open
            </span>
            <a
              href="#experiments"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              EXPLORE FREE <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white px-6 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="block text-sm text-muted-foreground hover:text-foreground font-medium py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(160 40% 96%) 0%, hsl(40 60% 98%) 100%)" }}>
        {/* Blob decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(160 63% 32% / 0.12) 0%, transparent 70%)", transform: "translate(20%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(36 95% 54% / 0.15) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left: Text ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65 }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                <FlaskConical className="w-3.5 h-3.5" />
                Interactive Science Experiments
              </div>

              {/* Headline */}
              <h1 className="font-heading font-extrabold text-foreground leading-[1.08] tracking-tight mb-5"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>
                Explore Science the Way{" "}
                <br className="hidden sm:block" />
                It's Meant to Be{" "}
                <span className="text-primary">Experienced</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                The ultimate virtual lab for physics, chemistry, biology, and
                agriculture. Run controlled experiments, collect real data, and
                discover how the world works — completely free.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3 flex-wrap mb-8">
                <a
                  href="#experiments"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg"
                  style={{ boxShadow: "0 8px 24px hsl(160 63% 32% / 0.35)" }}
                >
                  GET STARTED
                </a>
                <a
                  href="#experiments"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border-2 border-primary/25 text-foreground font-bold text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-primary text-primary ml-0.5" />
                  </span>
                  VIEW LABS
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm font-bold text-foreground ml-1">5.0 Rating</span>
                </div>
                <div className="w-px h-5 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["#2d7d52","#0369a1","#c27c1a","#7c3aed"].map((c, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ backgroundColor: c }}>
                        {["P","C","B","A"][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">Students experiment daily on our platform</span>
                </div>
              </div>
            </motion.div>

            {/* ── Right: Visual ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="relative flex items-center justify-center min-h-[400px] lg:min-h-[480px]"
            >
              {/* Main illustration card */}
              <div
                className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl"
                style={{ background: "linear-gradient(145deg, hsl(160 63% 32%), hsl(160 55% 22%))" }}
              >
                {/* Inner grid pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "repeating-linear-gradient(0deg,white 0,white 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,white 0,white 1px,transparent 1px,transparent 40px)" }} />
                {/* Center icon cluster */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <FlaskConical className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex gap-3">
                    {[Atom, Microscope, Leaf].map((Icon, i) => (
                      <div key={i} className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                        <Icon className="w-5 h-5 text-white/80" />
                      </div>
                    ))}
                  </div>
                  <div className="text-white/70 text-xs font-medium tracking-wider uppercase mt-2">Virtual Science Lab</div>
                </div>
                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20"
                  style={{ background: "linear-gradient(to top, hsl(36 95% 54%), transparent)" }} />
              </div>

              {/* Floating card — top left */}
              <motion.div
                className="absolute top-4 -left-4 sm:-left-10 bg-white rounded-2xl shadow-xl border border-border px-4 py-3 w-44"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Open Labs</div>
                <div className="text-2xl font-extrabold font-heading text-foreground leading-none">{availableCount}+</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">experiments available now</div>
              </motion.div>

              {/* Floating card — bottom right */}
              <motion.div
                className="absolute bottom-6 -right-4 sm:-right-10 bg-white rounded-2xl shadow-xl border border-border px-4 py-3 w-48"
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "hsl(160 63% 32% / 0.12)" }}>
                    <Activity className="w-4 h-4" style={{ color: "hsl(160 63% 32%)" }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Simple Pendulum</div>
                    <div className="text-[10px] text-muted-foreground">Physics · Easy</div>
                  </div>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-8">
                  {[45, 60, 50, 80, 70, 95, 75].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all"
                      style={{ height: `${h}%`, background: i === 5 ? "hsl(36 95% 54%)" : "hsl(160 63% 32% / 0.2)" }} />
                  ))}
                </div>
              </motion.div>

              {/* Floating subject pill — top right */}
              <motion.div
                className="absolute top-1/3 -right-2 sm:-right-6 bg-white rounded-full shadow-lg border border-border px-3.5 py-2 flex items-center gap-2"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/15 flex items-center justify-center">
                  <Atom className="w-3.5 h-3.5 text-cyan-600" />
                </div>
                <span className="text-xs font-bold text-foreground">Chemistry</span>
              </motion.div>

              {/* Floating subject pill — bottom left */}
              <motion.div
                className="absolute bottom-1/3 -left-2 sm:-left-8 bg-white rounded-full shadow-lg border border-border px-3.5 py-2 flex items-center gap-2"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <div className="w-6 h-6 rounded-full bg-lime-500/15 flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-lime-600" />
                </div>
                <span className="text-xs font-bold text-foreground">Agriculture</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Core Features</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
              Interactive Virtual Labs —{" "}
              <span className="text-primary">Key Features &amp; Benefits</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-base font-bold font-heading text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]"
              style={{ background: "linear-gradient(145deg, hsl(160 63% 28%), hsl(160 55% 18%))" }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 28px)" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                <div className="flex gap-4">
                  {[
                    { icon: Activity, label: "Physics",    color: "#2d7d52" },
                    { icon: Atom,     label: "Chemistry",  color: "#0369a1" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-sm text-center">
                      <Icon className="w-7 h-7 text-white mx-auto mb-2" />
                      <div className="text-white text-xs font-semibold">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  {[
                    { icon: Microscope, label: "Biology",     color: "#166534" },
                    { icon: Leaf,       label: "Agriculture", color: "#3f6212" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex-1 bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-sm text-center">
                      <Icon className="w-7 h-7 text-white mx-auto mb-2" />
                      <div className="text-white text-xs font-semibold">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10"
              style={{ background: "hsl(36 95% 54% / 0.2)" }} />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full -z-10"
              style={{ background: "hsl(160 63% 32% / 0.15)" }} />
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">About Us</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground leading-snug mb-4">
              Who We Are — A Modern Virtual Science Platform
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Virtual Science Lab is built for students, teachers, and curious
              learners who want real scientific understanding. Our simulations
              are designed around actual school curricula, with step-by-step
              guided experiments that build genuine scientific reasoning.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Innovative learning with real-time interactive simulations",
                "Curriculum-aligned experiments across 4 science subjects",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mb-8">
              <div>
                <div className="text-4xl font-extrabold font-heading text-primary leading-none">
                  {ALL_EXPERIMENTS.length}+
                </div>
                <div className="text-xs text-muted-foreground mt-1">Experiments &amp; Growing</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-4xl font-extrabold font-heading text-primary leading-none">
                  {subjectCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Science Subjects</div>
              </div>
            </div>

            <a
              href="#experiments"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md"
            >
              Explore Labs <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden py-4" style={{ background: "hsl(160 63% 28%)" }}>
        <motion.div
          className="flex items-center gap-0 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex items-center gap-0 flex-shrink-0">
              {["PHYSICS", "CHEMISTRY", "BIOLOGY", "AGRICULTURE", "FREE ACCESS", "LEARN BY DOING", "INTERACTIVE LABS", "REAL SCIENCE"].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-3 px-6 text-sm font-bold text-white/90 tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          EXPERIMENTS GRID
      ══════════════════════════════════════════════════════════════════ */}
      <section id="experiments" className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Our Experiments</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Comprehensive Experiments —{" "}
            <span className="text-primary">Available for All Students</span>
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-8">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSubject(s)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeSubject === s
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((exp, i) => (
            <ExpCard key={exp.title} exp={exp} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
