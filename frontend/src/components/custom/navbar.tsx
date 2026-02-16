import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">
            TaskTrack
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Documentation Link */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-secondary/50"
            >
              Docs
            </Link>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button>
            <ThemeToggle />
          </motion.button>

          {/* Login Button */}
          <Link to="/login">
            <Button variant="ghost" className="text-sm">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
