import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ExperimentCard({
  title,
  description,
  icon: Icon,
  path,
  gradient,
  delay = 0,
  tag,
  difficulty,
}) {
  const difficultyColors = {
    Easy: "bg-green-500/10 text-green-600",
    Medium: "bg-yellow-500/10 text-yellow-600",
    Hard: "bg-red-500/10 text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={path} className="block group">
        <div
          className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1`}
        >
          {/* Gradient accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${gradient}`} />

          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex gap-2">
              {tag && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {tag}
                </span>
              )}
              {difficulty && (
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${difficultyColors[difficulty]}`}
                >
                  {difficulty}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold font-heading mb-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            Start Experiment <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
