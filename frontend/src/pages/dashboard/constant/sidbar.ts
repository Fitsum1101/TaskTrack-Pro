import {
	BarChart3,
	CheckSquare,
	FolderOpen,
	LayoutDashboard,
	Settings,
	Users,
} from 'lucide-react';

export const sidebarItems = [
	{ icon: LayoutDashboard, name: 'Dashboard', href: '/dashboard' },
	{ icon: FolderOpen, name: 'Projects', href: 'projects' },
	{ icon: CheckSquare, name: 'Tasks', href: '#' },
	{ icon: Users, name: 'Teams', href: 'teams' },
	{ icon: BarChart3, name: 'Reports', href: '#' },
	{ icon: Settings, name: 'Settings', href: '#' },
	{ icon: Settings, name: 'Employees', href: 'employees' },
];
