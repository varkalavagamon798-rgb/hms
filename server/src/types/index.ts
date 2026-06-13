export interface User {
  user_id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: UserRole;
  hospital_id: string;
  department_id?: string;
  is_mfa_enabled: boolean;
  mfa_secret?: string;
  avatar_url?: string;
  last_login_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  login_attempts: number;
  locked_until?: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'PHARMACIST'
  | 'LAB_TECHNICIAN'
  | 'BILLING_OFFICER'
  | 'INVENTORY_MANAGER';

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResponse {
  user: Omit<User, 'password_hash' | 'mfa_secret'>;
  tokens: AuthTokens;
  requires_mfa: boolean;
  mfa_session_token?: string;
}

export interface MfaVerifyPayload {
  mfa_session_token: string;
  otp_code: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}
