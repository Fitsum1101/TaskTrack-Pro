// components/ThemeToggle.tsx
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="glass hover:glow transition-all duration-300 bg-transparent"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform hover:rotate-90 duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600 transition-transform hover:-rotate-12 duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
