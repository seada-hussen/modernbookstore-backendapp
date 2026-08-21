// User role type
export type UserRole = 'admin' | 'user';

// User profile interface
export interface UserProfile {
  name: string;           // Full user name
  role: UserRole;         // Access level (admin/user)
  token?: string;         // JWT authentication token
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}