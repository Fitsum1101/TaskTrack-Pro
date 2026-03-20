// types/user.ts

// ------------------------------------------------------
// Enum for User Role Types
// ------------------------------------------------------
export type UserRoleType = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

// Optional: Create a constants object for type safety
export const UserRoleValues = {
	ADMIN: 'ADMIN' as const,
	MANAGER: 'MANAGER' as const,
	EMPLOYEE: 'EMPLOYEE' as const,
} as const;
// ------------------------------------------------------
// Base User type (matches Prisma model exactly)
// ------------------------------------------------------
export interface User {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string | null;
	profile_picture: string | null;
	role_type: UserRoleType;
	is_active: boolean;
	last_login: Date | null;
	updatedAt: Date;
}

// ------------------------------------------------------
// User with basic info (without sensitive data)
// ------------------------------------------------------
export interface UserBasicInfo {
	id: string;
	first_name: string;
	last_name: string;
	phone: string | null;
	email: string;
	role_type: UserRoleType;
	profile_picture: string | null;
	is_active: boolean;
}
