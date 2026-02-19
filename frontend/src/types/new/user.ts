export type UserRole = "ADMIN" | "USER" | "MANAGER"; // match your backend enum
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AuthUserProfile {
  id: number;
  username: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: number;
  status: UserStatus;
  isActive: boolean;
}
