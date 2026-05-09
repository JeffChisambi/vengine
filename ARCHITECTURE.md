# VirtualSciLab — Architecture Documentation

## Overview

VirtualSciLab is an interactive educational science platform built with **React + Vite + Tailwind CSS**.
It provides 12 virtual lab experiments spanning Biology, Chemistry, and Physics, each designed to guide
students through a multi-step interactive simulation.

---

## Technology Stack

| Layer         | Technology                              |
|---------------|-----------------------------------------|
| Framework     | React 18 (functional components, hooks) |
| Build tool    | Vite 6                                  |
| Styling       | Tailwind CSS v3 + shadcn/ui components  |
| Animation     | Framer Motion                           |
| Routing       | React Router DOM v6                     |
| Icons         | Lucide React                            |

---

## Project Structure

```
src/
├── components/
│   ├── lab/
│   │   └── ExperimentShell.jsx       ← Shared abstract experiment shell (Abstraction)
│   ├── ui/                           ← shadcn/ui primitives (Button, etc.)
│   ├── titration/TitrationSVG.jsx    ← Titration SVG components + helpers
│   ├── electrolysis/ElectrolysisSVG.jsx
│   ├── starch/StarchSVG.jsx
│   ├── photosynthesis/PhotosynthesisSVG.jsx
│   ├── soil/SoilSVG.jsx
│   └── [per-experiment SVG components]
├── hooks/
│   └── useExperimentNav.js           ← Navigation hook (Encapsulation)
├── pages/
│   ├── Home.jsx                      ← Lab dashboard
│   ├── TitrationExperiment.jsx       ← Chemistry: acid-base titration
│   ├── ElectrolysisExperiment.jsx    ← Chemistry: copper sulfate electrolysis
│   ├── StarchExperiment.jsx          ← Biology: starch test in leaves
│   ├── PhotosynthesisExperiment.jsx  ← Biology: photosynthesis & starch
│   ├── SoilTextureExperiment.jsx     ← Agriculture: jar sedimentation
│   ├── DensityExperiment.jsx         ← Physics: density comparison
│   ├── CellDivisionExperiment.jsx    ← Biology: mitosis stages
│   ├── PendulumExperiment.jsx        ← Physics: pendulum motion
│   ├── CircuitExperiment.jsx         ← Physics: electrical circuits
│   ├── PressureExperiment.jsx        ← Physics: fluid pressure
│   ├── RefractionExperiment.jsx      ← Physics: light refraction
│   ├── LensExperiment.jsx            ← Physics: lens optics
│   ├── ThermalExperiment.jsx         ← Physics: thermal expansion
│   └── AtomicStructureExperiment.jsx ← Chemistry: atomic models
└── App.jsx                           ← Route definitions
```

---

## Core OOP Principles Applied

### 1. Encapsulation — `useExperimentNav`

**File:** `src/hooks/useExperimentNav.js`

Encapsulates all step-navigation state and logic into a single reusable hook.
Consumers receive a clean interface; the internal step/direction tracking is hidden.

```js
const { step, dir, goTo, next, back, reset } = useExperimentNav(totalSteps, resetCallback);
```

**Encapsulated state:**
- `step` — current slide index (0-based)
- `dir` — animation direction (`1` = forward, `-1` = backward)

**Encapsulated behaviour:**
- `next()` — advance with bounds check
- `back()` — retreat with bounds check
- `goTo(i)` — direct jump with correct direction inference
- `reset()` — calls `resetCallback()` then returns to step 0

No experiment needs to manage `useState` for navigation — this concern is fully encapsulated.

---

### 2. Abstraction — `ExperimentShell`

**File:** `src/components/lab/ExperimentShell.jsx`

An abstract shell component that owns the **entire chrome** of every experiment:
header, progress bar, animated slide area, and footer navigation.
Experiments provide only their unique step content as `children`.

**Props contract (the abstraction interface):**

| Prop               | Type       | Description                                                  |
|--------------------|------------|--------------------------------------------------------------|
| `title`            | string     | Experiment name shown in the header                          |
| `subject`          | string     | Subject label (e.g. "Chemistry · Titration")                 |
| `icon`             | Component  | Lucide icon for the header badge                             |
| `theme`            | object     | Colour tokens: `iconBg`, `iconColor`, `done`, `current`, `label`, `dot`, `button` |
| `stages`           | array      | `[{ id, label }]` — steps for the progress bar              |
| `step`             | number     | Current step index (from `useExperimentNav`)                 |
| `dir`              | number     | Animation direction (from `useExperimentNav`)                |
| `onGoTo`           | function   | Direct-jump handler (from `useExperimentNav`)                |
| `onNext`           | function   | Advance handler (from `useExperimentNav`)                    |
| `onBack`           | function   | Retreat handler (from `useExperimentNav`)                    |
| `onReset`          | function   | Full reset handler (from `useExperimentNav`)                 |
| `canAdvance`       | boolean    | Gate: disables Next until the step's requirement is met      |
| `maxWidth`         | string     | Tailwind max-width class (default `"max-w-5xl"`)             |
| `progressVariant`  | string     | `"full"` (all steps) or `"middle"` (inner steps only)       |
| `extraHeaderControls` | ReactNode | Optional slot for per-experiment header controls (Auto/Pause) |
| `children`         | ReactNode  | The experiment's step content                                |

**What ExperimentShell renders:**
1. Top header — back button, icon/title, progress bar, `extraHeaderControls`
2. Animated slide area — `AnimatePresence` + `motion.div` for enter/exit transitions
3. Bottom footer — Back · step dots · Next/Restart buttons

Experiments are completely unaware of navigation chrome — they render only their step JSX.

---

### 3. Polymorphism — Per-experiment `canAdvance` logic

Each experiment passes a different `canAdvance` boolean that gates the Next button,
implementing polymorphic gating behaviour without any conditional logic inside the shell.

| Experiment          | Gate condition                                                |
|---------------------|---------------------------------------------------------------|
| TitrationExperiment | step1→`setupPhase≥3`, step2→`indicatorDropped`, step3→`endpointReached` |
| ElectrolysisExperiment | step1→`setupPhase≥3`, step2→`hasRun`                     |
| StarchExperiment    | step1→`selectedLeaf !== null`; all others `true`              |
| PhotosynthesisExperiment | step1→`destarchProg ≥ 1`; all others `true`             |
| SoilTextureExperiment | step1→`selectedSoil && stage≥1`, step2→`hasShaken`, step3→`settleProgress≥0.9` |
| Simple experiments  | Always `true` (free navigation)                               |

---

### 4. Single Responsibility Principle

Each layer has a single, clearly scoped job:

| Layer                  | Responsibility                              |
|------------------------|---------------------------------------------|
| `useExperimentNav`     | Navigation state only                       |
| `ExperimentShell`      | Chrome (header, progress, transitions, footer) |
| Experiment page        | Domain logic + interactive step content     |
| SVG components         | Visual simulation rendering                 |
| `shadcn/ui` primitives | Base interactive components                 |

---

## Data Flow

```
App.jsx (routes)
  └─► ExperimentPage
        ├─ useExperimentNav()          ← navigation state/logic
        ├─ local useState()            ← experiment-specific state
        └─► ExperimentShell            ← chrome, layout, animation
              ├─ props: step, dir, theme, stages, canAdvance, ...
              └─► children             ← step-specific JSX (renders conditionally on step)
```

---

## Experiment Inventory

| # | File                          | Subject     | Steps | Theme  | Key Interaction             |
|---|-------------------------------|-------------|-------|--------|------------------------------|
| 1 | TitrationExperiment.jsx       | Chemistry   | 9     | Cyan   | Drip NaOH, detect endpoint   |
| 2 | ElectrolysisExperiment.jsx    | Chemistry   | 7     | Cyan   | Run electrolysis, reveal equations |
| 3 | StarchExperiment.jsx          | Biology     | 7     | Green  | Choose leaf, apply iodine    |
| 4 | PhotosynthesisExperiment.jsx  | Biology     | 9     | Green  | Destarch, run timelapse, apply iodine |
| 5 | SoilTextureExperiment.jsx     | Agriculture | 7     | Amber  | Add soil, shake, settle, classify |
| 6 | DensityExperiment.jsx         | Physics     | —     | Blue   | Add objects to water column  |
| 7 | CellDivisionExperiment.jsx    | Biology     | —     | Purple | Step through mitosis stages  |
| 8 | PendulumExperiment.jsx        | Physics     | —     | Indigo | Adjust length/mass/gravity   |
| 9 | CircuitExperiment.jsx         | Physics     | —     | Yellow | Build and close circuits     |
|10 | PressureExperiment.jsx        | Physics     | —     | Teal   | Add fluid layers, measure pressure |
|11 | RefractionExperiment.jsx      | Physics     | —     | Violet | Change medium, observe angle |
|12 | LensExperiment.jsx            | Physics     | —     | Orange | Adjust focal length          |
|13 | ThermalExperiment.jsx         | Physics     | —     | Red    | Heat materials, measure expansion |
|14 | AtomicStructureExperiment.jsx | Chemistry   | —     | Slate  | Select elements, build Bohr model |

---

## Theme System

Each experiment declares a `THEME` constant that maps semantic names to Tailwind/CSS values:

```js
const THEME = {
  iconBg:    "bg-cyan-500/10",    // header icon background
  iconColor: "text-cyan-600",     // header icon colour
  done:      "bg-cyan-400",       // completed progress step dot
  current:   "bg-cyan-500",       // active progress step dot
  label:     "text-cyan-600",     // progress step label
  dot:       "hsl(186,85%,38%)",  // footer dot active colour (CSS value for motion.div)
  button:    "bg-cyan-600 hover:bg-cyan-700 text-white border-0", // Next/Restart button
};
```

Themes used across the app:

| Colour | Experiments                         |
|--------|-------------------------------------|
| Cyan   | Titration, Electrolysis             |
| Green  | Starch, Photosynthesis              |
| Amber  | Soil Texture                        |
| Blue   | Density                             |
| Purple | Cell Division                       |

---

## Key Design Decisions

### Progressive Disclosure
Experiments use `canAdvance` to enforce sequential interaction — students cannot skip steps that
require action (e.g., they must actually drip the burette to see the endpoint, must choose a leaf
before advancing, must shake the jar before settling begins).

### Auto-play Mode
Complex multi-step experiments include an `extraHeaderControls` slot with an Auto/Pause button.
Auto-play advances non-interactive steps on a timer and pauses automatically when it reaches
an interactive step, nudging students to engage with the simulation.

### Animation Direction
`useExperimentNav` tracks `dir` (+1 or −1) so `ExperimentShell` can play the correct enter/exit
animation — content slides right-to-left going forward, left-to-right going backward.

### Reset Safety
Each experiment passes a `resetCallback` to `useExperimentNav`. This callback clears all
experiment-specific state (intervals, timeouts, interaction flags) before navigation resets to step 0.
This prevents stale timers running after a reset.

---

## Adding a New Experiment

1. **Create** `src/pages/MyExperiment.jsx`
2. **Define** `STEPS`, `TOTAL_STEPS`, and `THEME` constants
3. **Use** `useExperimentNav(TOTAL_STEPS, resetCallback)` for navigation state
4. **Wrap** content in `<ExperimentShell>` with all required props
5. **Render** step content as `children` using `{step === N && (...)}` conditionals
6. **Register** the route in `src/App.jsx`

No changes to any existing file are required.
