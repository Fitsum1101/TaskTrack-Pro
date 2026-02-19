import type { AuthUserProfile } from "./user";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// -------------------------
// Auth/Login Response Types
// -------------------------

export interface LoginResponse {
  statusCode: number;
  data: LoginResponseData;
  message: string;
  success: boolean;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: AuthUserProfile;
}
