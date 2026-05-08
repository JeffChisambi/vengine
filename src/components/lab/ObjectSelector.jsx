import React from "react";
import { motion } from "framer-motion";

const OBJECTS = [
  {
    id: "rock",
    name: "Rock",
    color: "#78716c",
    mass: 85.3,
    volume: 32.0,
    icon: "M30 45 C25 30, 40 15, 55 20 C70 10, 85 25, 80 40 C90 50, 75 65, 60 60 C45 70, 25 60, 30 45Z",
  },
  {
    id: "metal",
    name: "Metal Bolt",
    color: "#64748b",
    mass: 124.6,
    volume: 15.8,
    icon: "M35 25 L65 25 L70 35 L70 55 L65 65 L35 65 L30 55 L30 35Z",
  },
  {
    id: "marble",
    name: "Glass Marble",
    color: "#6366f1",
    mass: 42.1,
    volume: 16.8,
    icon: "M50 20 A30 30 0 1 1 50 80 A30 30 0 1 1 50 20Z",
  },
  {
    id: "clay",
    name: "Clay Figure",
    color: "#d97706",
    mass: 67.8,
    volume: 38.5,
    icon: "M40 25 C35 20, 65 20, 60 25 L65 45 C70 55, 60 70, 50 70 C40 70, 30 55, 35 45Z",
  },
];

export default function ObjectSelector({ selectedObject, onSelect }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-heading">
        Choose an Object
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {OBJECTS.map((obj) => {
          const isSelected = selectedObject?.id === obj.id;
          return (
            <motion.button
              key={obj.id}
              onClick={() => onSelect(obj)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
                  <path d={obj.icon} fill={obj.color} fillOpacity="0.85" />
                  <path
                    d={obj.icon}
                    fill="none"
                    stroke={obj.color}
                    strokeWidth="2"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-sm font-heading text-foreground">
                    {obj.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Irregular shape
                  </p>
                </div>
              </div>
              {isSelected && (
                <motion.div
                  layoutId="selector"
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { OBJECTS };
