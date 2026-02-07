import { MenuItem } from "@/types/MenuItem";
import {
  Users,
  Shield,
  User,
  FileText,
  Wallet,
  MapPin,
  Phone,
} from "lucide-react";

export const MENU_CONFIG: MenuItem[] = [
  {
    label: "Employees",
    icon: Users,
    href: "/dashboard/employees",
    requiredPermissions: ["employee_read"],
  },
  {
    label: "Roles & Permissions",
    icon: Shield,
    href: "/dashboard/roles",
    requiredPermissions: ["role_read"],
    children: [
      {
        label: "Roles",
        href: "/dashboard/roles",
        requiredPermissions: ["role_read"],
      },
      {
        label: "Permissions",
        href: "/dashboard/permissions",
        requiredPermissions: ["permission_read"],
      },
    ],
  },
  {
    label: "Users",
    icon: User,
    href: "/dashboard/users",
    requiredPermissions: ["user_read"],
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/dashboard/documents",
    requiredPermissions: ["document_read"],
  },
  {
    label: "Allowances",
    icon: Wallet,
    href: "/dashboard/allowances",
    requiredPermissions: ["allowance_read"],
  },
  {
    label: "Addresses",
    icon: MapPin,
    href: "/dashboard/addresses",
    requiredPermissions: ["address_read"],
  },
  {
    label: "Emergency Contacts",
    icon: Phone,
    href: "/dashboard/emergency-contacts",
    requiredPermissions: ["emergency_contact_read"],
  },
];
