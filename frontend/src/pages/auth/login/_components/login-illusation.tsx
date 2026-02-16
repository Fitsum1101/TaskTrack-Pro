import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoginIllustration() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full h-full relative overflow-hidden flex items-center justify-center bg-background"
    >
      {/* Adaptive Background Gradient - Using theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {/* Abstract Pattern - Left */}
      <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full blur-3xl bg-primary/10 dark:bg-primary/20" />

      {/* Abstract Pattern - Right */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl bg-accent/10 dark:bg-accent/20" />

      {/* Center Content */}
      <div className="relative z-10 max-w-md text-center px-6">
        {/* Icon Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: "📊", label: "Analytics" },
            { icon: "👥", label: "Teams" },
            { icon: "✓", label: "Tasks" },
            { icon: "🎯", label: "Goals" },
            { icon: "📅", label: "Schedule" },
            { icon: "🔄", label: "Progress" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg backdrop-blur-md bg-card/50 border border-border dark:bg-card/40"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-xs font-medium text-muted-foreground">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold mb-3 text-foreground">
          Manage projects with ease
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Collaborate with your team, track progress, and deliver projects on
          time with TaskTrack's powerful project management tools.
        </p>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/50" />
    </motion.div>
  );
}
