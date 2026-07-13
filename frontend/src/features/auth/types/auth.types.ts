export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  is_active: boolean;
}

export interface AuthResponse {
  success: boolean;
  access_token?: string; // from login
  token?: string; // from register (standardizing both could be good but we map it in the store)
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}
