export interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  preferred_role?: string | null;
  experience?: string | null;
  education?: string | null;
  work_preference?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  // user is only present if the backend returns it (e.g. after register in some implementations)
  user?: UserResponse;
  // legacy alias used by some endpoints
  token?: string;
  success?: boolean;
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
