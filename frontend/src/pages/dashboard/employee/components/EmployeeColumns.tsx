import { motion } from 'framer-motion';

// ------------------------------------------------------
// Columns definition
import type { User } from '../types';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { ColumnDefinition } from '@/types/table';

// ------------------------------------------------------
// Get initials from first and last name
// ------------------------------------------------------
const getInitials = (firstName: string, lastName: string) => {
	return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// ------------------------------------------------------
// Type for table row
type UserRow = User;

// ------------------------------------------------------
export const userColumns: ColumnDefinition<UserRow>[] = [
	{
		id: 'profile_picture',
		accessorKey: 'profile_picture',
		header: 'Avatar',
		cell: (user) => (
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<Avatar className="w-10 h-10">
					<AvatarImage
						src={user.profile_picture || '/default/default-avatar.png'}
						alt={`${user.first_name} ${user.last_name}`}
					/>
					<AvatarFallback className="bg-primary/10 text-primary text-sm">
						{getInitials(user.first_name, user.last_name)}
					</AvatarFallback>
				</Avatar>
			</motion.div>
		),
	},
	{
		id: 'name',
		accessorKey: 'first_name',
		header: 'Name',
		sortable: true,
		filterable: true,
		cell: (user) => (
			<motion.div
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
			>
				<span className="font-medium text-foreground/90">
					{user.first_name} {user.last_name}
				</span>
			</motion.div>
		),
	},
	{
		id: 'email',
		accessorKey: 'email',
		header: 'Email',
		sortable: true,
		filterable: true,
		cell: (user) => (
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="text-sm text-foreground/80 truncate max-w-[200px]"
			>
				{user.email}
			</motion.span>
		),
	},
	{
		id: 'phone',
		accessorKey: 'phone',
		header: 'Phone',
		sortable: true,
		filterable: true,
		cell: (user) => (
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="text-sm text-foreground/60"
			>
				{user.phone || '-'}
			</motion.span>
		),
	},
	{
		id: 'role_type',
		accessorKey: 'role_type',
		header: 'Role',
		sortable: true,
		filterable: true,
		cell: (user) => {
			const role = user.role_type;
			let badgeColor = 'bg-gray-200 text-gray-800';

			if (role === 'ADMIN') badgeColor = 'bg-purple-100 text-purple-800';
			else if (role === 'MANAGER')
				badgeColor = 'bg-orange-100 text-orange-800';
			else if (role === 'EMPLOYEE') badgeColor = 'bg-blue-100 text-blue-800';

			return (
				<Badge
					className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColor}`}
				>
					{role}
				</Badge>
			);
		},
	},
	{
		id: 'is_active',
		accessorKey: 'is_active',
		header: 'Status',
		sortable: true,
		filterable: true,
		cell: (user) => (
			<motion.div
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
			>
				<Badge
					className={`px-3 py-1 rounded-full text-xs font-semibold ${
						user.is_active
							? 'bg-green-100 text-green-800 border border-green-200'
							: 'bg-gray-100 text-gray-600 border border-gray-200'
					}`}
				>
					{user.is_active ? 'Active' : 'Inactive'}
				</Badge>
			</motion.div>
		),
	},
];
