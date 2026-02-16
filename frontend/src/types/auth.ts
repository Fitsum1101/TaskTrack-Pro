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
}
