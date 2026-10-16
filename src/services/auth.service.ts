import { apiClient, setAccessToken } from "@/lib/api-client";
import type { ApiResponse, AuthTokens, User } from "@/types/api.types";

export interface SendPhoneOtpPayload {
  phone: string;
}

export interface VerifyPhoneOtpPayload {
  phone: string;
  otp: string;
}

export interface SendEmailOtpPayload {
  email: string;
}

export interface VerifyEmailOtpPayload {
  email: string;
  otp: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export const authService = {
  // Phone OTP
  async sendPhoneOtp(payload: SendPhoneOtpPayload): Promise<ApiResponse<{ otp?: string } | null>> {
    const res = await apiClient.post<ApiResponse<{ otp?: string } | null>>("/auth/phone/send-otp", payload);
    return res.data;
  },

  async verifyPhoneOtp(payload: VerifyPhoneOtpPayload): Promise<ApiResponse<AuthTokens>> {
    const res = await apiClient.post<ApiResponse<AuthTokens>>("/auth/phone/verify-otp", payload);
    if (res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  async loginWithFirebasePhone(payload: { phone: string; idToken: string }): Promise<ApiResponse<AuthTokens>> {
    const res = await apiClient.post<ApiResponse<AuthTokens>>("/auth/phone/firebase-login", payload);
    if (res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },


  // Email OTP
  async sendEmailOtp(payload: SendEmailOtpPayload): Promise<ApiResponse<null>> {
    const res = await apiClient.post<ApiResponse<null>>("/auth/email/send-otp", payload);
    return res.data;
  },

  async verifyEmailOtp(payload: VerifyEmailOtpPayload): Promise<ApiResponse<AuthTokens>> {
    const res = await apiClient.post<ApiResponse<AuthTokens>>("/auth/email/verify-otp", payload);
    if (res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  // Admin Login
  async adminLogin(payload: AdminLoginPayload): Promise<ApiResponse<AuthTokens>> {
    const res = await apiClient.post<ApiResponse<AuthTokens>>("/auth/admin/login", payload);
    if (res.data.data?.accessToken) {
      setAccessToken(res.data.data.accessToken);
    }
    return res.data;
  },

  // Get Current Authenticated Profile
  async getMe(): Promise<ApiResponse<User>> {
    const res = await apiClient.get<ApiResponse<User>>("/auth/me");
    return res.data;
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    try {
      const res = await apiClient.post<ApiResponse<null>>("/auth/logout");
      setAccessToken(null);
      return res.data;
    } catch {
      setAccessToken(null);
      return { success: true, message: "Logged out locally", data: null };
    }
  },

  // Google OAuth URL helper
  getGoogleAuthUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    return `${baseUrl}/auth/google`;
  },
};
