import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashbordNavigationLink } from "@/constant/navigator";
import { Link } from "react-router-dom";
import { useCurrentRouteSegment } from "@/hooks/useCurrentRouteSegment";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  navigation: DashbordNavigationLink[];
}

function Sidebar({ isOpen, onToggle, navigation }: SidebarProps) {
  const pathname = useCurrentRouteSegment();

  return (
    <div
      className={cn(
        "relative left-0 h-full bottom-0 z-40 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-64" : "w-20",
      )}
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-20 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={onToggle}
          className="h-7 w-7 rounded-full border-2 border-background bg-sidebar-background shadow-lg hover:bg-sidebar-accent transition-all"
        >
          {isOpen ? (
            <ChevronLeft className="h-3.5 w-3.5 text-sidebar-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground" />
          )}
        </Button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href.replace(/^\/+/, "");
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    !isOpen && "justify-center",
                  )}
                >
                  {/* Subtle active background glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                  )}
                  <item.icon
                    className={cn(
                      "h-5 w-5 relative z-10 transition-transform",
                      !isOpen ? "mx-auto" : "mr-3",
                      isActive && "text-primary-foreground",
                      isActive ? "scale-110" : "group-hover:scale-105",
                    )}
                  />

                  <p className="text-sm text-green-500">{isActive}</p>

                  {isOpen && (
                    <span className="relative z-10 font-medium transition-all">
                      {item.name}
                    </span>
                  )}

                  {/* Hover tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg">
                      {isActive} {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-background/50">
        <div
          className={cn(
            "flex items-center transition-all duration-200",
            isOpen ? "gap-3" : "justify-center",
          )}
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-primary-foreground">
                BA
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-sidebar-background" />
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                Boss Admin
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Administrator
              </p>
            </div>
          )}

          {isOpen && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mini user info for collapsed state */}
        {!isOpen && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="relative group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md cursor-pointer">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>

              {/* User tooltip for collapsed state */}
              <div className="absolute left-full ml-2 bottom-0 px-2 py-1 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg min-w-32">
                <div className="font-semibold">Boss Admin</div>
                <div className="text-background/80 text-[11px]">
                  Administrator
                </div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
