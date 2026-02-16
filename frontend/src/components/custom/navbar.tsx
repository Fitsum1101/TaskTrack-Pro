import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ProfileDropdown } from "./profile-dropdown";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  onSidebarToggle: () => void;
}

export function Navbar({ onSidebarToggle }: NavbarProps) {
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        {/* Left section - Search and toggle */}
        <div className="flex flex-1 items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="md:hidden"
          >
            <Menu className="size-5" />
          </Button>
          <div className="hidden flex-1 max-w-sm md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects, tasks..."
                className="pl-9 rounded-lg bg-secondary/50 text-foreground placeholder:text-muted-foreground border-border transition-colors focus:bg-background"
              />
            </div>
          </div>
        </div>

        {/* Right section - Notifications, Theme toggle, and Profile */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative transition-colors hover:bg-accent"
              title="Notifications"
            >
              <Bell className="size-5" />
              {hasNotifications && (
                <motion.span
                  className="absolute right-2 top-2 size-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ThemeToggle />
          </motion.div>

          {true && <ProfileDropdown />}
        </div>
      </div>

      {/* Mobile search */}
      <div className="block px-6 pb-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 rounded-lg bg-secondary/50 text-foreground placeholder:text-muted-foreground border-border transition-colors focus:bg-background"
          />
        </div>
      </div>
    </header>
  );
}
