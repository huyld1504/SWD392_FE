import axiosInstance from './axiosInstance';
import type { ApiResponse, User } from '@/types';

// ==================== REQUEST TYPES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'STUDENT' | 'LECTURE';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// ==================== API CALLS ====================
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login',
      data,
    );
    return res.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/register',
      data,
    );
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await axiosInstance.get<ApiResponse<User>>('/api/v1/auth/me');
    return res.data.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post('/api/v1/users/change-password', data);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post('/api/v1/users/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await axiosInstance.post('/api/v1/users/reset-password', data);
  },
};

