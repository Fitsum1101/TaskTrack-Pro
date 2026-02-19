import { Navbar } from "@/components/custom/navbar";
import Sidebar from "@/components/custom/sidbar/SideBar";
import {
  BarChart3,
  CheckSquare,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

const sidebarItems = [
  { icon: LayoutDashboard, name: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, name: "Projects", href: "projects" },
  { icon: CheckSquare, name: "Tasks", href: "#" },
  { icon: Users, name: "Teams", href: "teams" },
  { icon: BarChart3, name: "Reports", href: "#" },
  { icon: Settings, name: "Settings", href: "#" },
];

const DashboardPage = () => {
  const [openSidbar, setOpenSidbar] = useState(true);
  return (
    <div className="flex h-[calc(100vh-67px)] bg-background">
      <Sidebar
        isOpen={openSidbar}
        onToggle={() => setOpenSidbar(!openSidbar)}
        navigation={sidebarItems}
      />
      <div className="flex flex-1 flex-col overflow-y-scroll">
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
