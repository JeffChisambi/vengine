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
} from "lucide-react";
import ExperimentCard from "@/components/lab/ExperimentCard";

const GROUPS = [
  {
    label: "Physics",
    color: "text-indigo-600",
    dot: "bg-indigo-500",
    experiments: [
      {
        title: "Simple Pendulum",
        description:
          "Investigate how pendulum length affects its period. Collect data, plot T² vs L, and calculate g experimentally.",
        icon: Activity,
        path: "/experiment/pendulum",
        gradient: "bg-gradient-to-br from-indigo-500 to-violet-600",
        tag: "Physics",
        difficulty: "Easy",
      },
      {
        title: "Measuring Density",
        description:
          "Determine the density of irregular objects using the water displacement method and a digital scale.",
        icon: FlaskConical,
        path: "/experiment/density",
        gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
        tag: "Physics",
        difficulty: "Easy",
      },
      {
        title: "Circuit Builder",
        description:
          "Build and test electrical circuits with resistors, LEDs, and batteries in a virtual breadboard.",
        icon: Zap,
        path: "#",
        gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
        tag: "Physics",
        difficulty: "Medium",
      },
      {
        title: "Pressure in Liquids",
        description:
          "Drag a pressure probe through a tank of liquid to see how pressure increases with depth. Compare water, oil, mercury and more.",
        icon: Waves,
        path: "/experiment/pressure",
        gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
        tag: "Physics",
        difficulty: "Easy",
      },
      {
        title: "Wave Properties",
        description:
          "Visualize and manipulate transverse and longitudinal waves to understand frequency and amplitude.",
        icon: Waves,
        path: "#",
        gradient: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
        tag: "Physics",
        difficulty: "Medium",
      },
    ],
  },
  {
    label: "Chemistry",
    color: "text-cyan-600",
    dot: "bg-cyan-500",
    experiments: [
      {
        title: "Atomic Structure",
        description:
          "Fire alpha particles at gold foil and discover why atoms are mostly empty space — Rutherford's experiment.",
        icon: Atom,
        path: "/experiment/atomic-structure",
        gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
        tag: "Chemistry",
        difficulty: "Easy",
      },
      {
        title: "Exothermic Reactions",
        description:
          "Observe and measure temperature changes during chemical reactions in a virtual calorimeter.",
        icon: Flame,
        path: "#",
        gradient: "bg-gradient-to-br from-red-500 to-pink-600",
        tag: "Chemistry",
        difficulty: "Medium",
      },
    ],
  },
  {
    label: "Biology",
    color: "text-emerald-600",
    dot: "bg-emerald-500",
    experiments: [
      {
        title: "Cell Division",
        description:
          "Watch mitosis unfold step by step through animated phase-by-phase microscope visuals.",
        icon: Microscope,
        path: "/experiment/cell-division",
        gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
        tag: "Biology",
        difficulty: "Hard",
      },
    ],
  },
  {
    label: "Agriculture",
    color: "text-lime-600",
    dot: "bg-lime-500",
    experiments: [
      {
        title: "Plant Growth Factors",
        description:
          "Investigate how light, water, and soil nutrients affect plant growth rates in a controlled simulation.",
        icon: Leaf,
        path: "#",
        gradient: "bg-gradient-to-br from-lime-500 to-green-600",
        tag: "Agriculture",
        difficulty: "Easy",
      },
    ],
  },
];

const totalExperiments = GROUPS.reduce(
  (sum, g) => sum + g.experiments.length,
  0,
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <FlaskConical className="w-4 h-4" />
              Virtual Science Lab
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight text-foreground mb-4">
              Learn Science by{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Doing
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Interactive virtual experiments that make physics, chemistry,
              biology and agriculture come alive. No lab coat required.
            </p>
          </motion.div>

          {/* Floating SVG decorations */}
          <motion.div
            className="absolute top-24 right-[15%] hidden lg:block"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
              <rect
                x="10"
                y="10"
                width="40"
                height="55"
                rx="4"
                stroke="hsl(245, 58%, 51%)"
                strokeWidth="2"
                strokeOpacity="0.3"
                fill="hsl(245, 58%, 51%)"
                fillOpacity="0.05"
              />
              <rect
                x="12"
                y="40"
                width="36"
                height="23"
                rx="2"
                fill="hsl(200, 98%, 60%)"
                fillOpacity="0.2"
              />
              <path
                d="M10 10 L5 5 M50 10 L55 5"
                stroke="hsl(245, 58%, 51%)"
                strokeWidth="2"
                strokeOpacity="0.3"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-32 left-[12%] hidden lg:block"
            animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="hsl(172, 66%, 50%)"
                strokeWidth="2"
                strokeOpacity="0.3"
                fill="hsl(172, 66%, 50%)"
                fillOpacity="0.05"
              />
              <circle
                cx="25"
                cy="25"
                r="8"
                stroke="hsl(172, 66%, 50%)"
                strokeWidth="1.5"
                strokeOpacity="0.2"
              />
              <circle
                cx="25"
                cy="25"
                r="3"
                fill="hsl(172, 66%, 50%)"
                fillOpacity="0.3"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Grouped Experiments */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <h2 className="text-xl font-bold font-heading">Experiments</h2>
          <span className="text-sm text-muted-foreground">
            {totalExperiments} available
          </span>
        </motion.div>

        {GROUPS.map((group, gi) => (
          <motion.section
            key={group.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + gi * 0.1 }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className={`w-2.5 h-2.5 rounded-full ${group.dot}`} />
              <h3 className={`text-base font-bold font-heading ${group.color}`}>
                {group.label}
              </h3>
              <span className="text-xs text-muted-foreground">
                · {group.experiments.length} experiment
                {group.experiments.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.experiments.map((exp, i) => (
                <ExperimentCard
                  key={exp.title}
                  {...exp}
                  delay={0.05 + i * 0.06}
                />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
