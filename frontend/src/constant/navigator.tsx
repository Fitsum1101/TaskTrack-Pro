import { Users, Settings, Home, Shield, UserCog, Key } from "lucide-react";

export interface DashbordNavigationLink {
  name: string;
  href: string;
  icon: any;
}

export const dashbordNavigationLinks: DashbordNavigationLink[] = [
  { name: "Dashboard", href: "/dashboard/", icon: Home },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Permissions", href: "/dashboard/permissions", icon: Key },
  { name: "Roles", href: "/dashboard/roles", icon: Shield },
  { name: "Users", href: "/dashboard/users", icon: UserCog },
];
