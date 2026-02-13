import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="glass bg-transparent">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="glass hover:glow transition-all duration-300 bg-transparent"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform hover:rotate-90 duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600 transition-transform hover:-rotate-12 duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
