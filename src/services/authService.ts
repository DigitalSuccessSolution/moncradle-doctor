/**
 * Authentication Service for Doctor PWA
 * Wraps phone + OTP authentication endpoints specified in Postman collection.
 */

import { apiFetch, ApiResponse } from "./apiClient";
import { API_CONFIG } from "@/config/api.config";

export interface SendOtpRequest {
  phone: string;
  role?: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface DoctorUser {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  role?: string;
  specialization?: string;
  hospital?: string;
  experience?: string;
  regNumber?: string;
}

export interface VerifyOtpResponseData {
  token?: string;
  accessToken?: string;
  user?: DoctorUser;
  doctor?: DoctorUser;
  message?: string;
}

export const authService = {
  /**
   * Helper to ensure clean 10-digit mobile number format
   */
  formatPhone(phone: string): string {
    let clean = (phone || "").replace(/\D/g, "");
    if (clean.startsWith("91") && clean.length > 10) {
      clean = clean.slice(2);
    }
    if (clean.startsWith("0") && clean.length > 10) {
      clean = clean.slice(1);
    }
    return clean.slice(0, 10);
  },

  /**
   * Request OTP sent to mobile number
   * POST /api/auth/send-otp
   */
  async sendOtp(phone: string, role: string = "doctor"): Promise<ApiResponse> {
    const cleanPhone = this.formatPhone(phone);

    return apiFetch(API_CONFIG.ENDPOINTS.AUTH.SEND_OTP, {
      method: "POST",
      body: JSON.stringify({
        phone: cleanPhone,
        role: role,
      }),
    });
  },

  /**
   * Verify OTP and receive JWT authentication token
   * POST /api/auth/verify-otp
   */
  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<VerifyOtpResponseData>> {
    const cleanPhone = this.formatPhone(phone);

    return apiFetch<VerifyOtpResponseData>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP, {
      method: "POST",
      body: JSON.stringify({
        phone: cleanPhone,
        otp: otp.trim(),
      }),
    });
  },

  /**
   * Request OTP sent to email for Doctor Registration
   * POST /api/auth/send-register-otp
   */
  async sendRegisterOtp(email: string): Promise<ApiResponse> {
    return apiFetch(API_CONFIG.ENDPOINTS.AUTH.SEND_REGISTER_OTP, {
      method: "POST",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
      }),
    });
  },

  /**
   * Register a new user/doctor
   * POST /api/auth/register
   */
  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: string;
    otp?: string;
  }): Promise<ApiResponse<VerifyOtpResponseData>> {
    const cleanPhone = this.formatPhone(data.phone || "");
    return apiFetch<VerifyOtpResponseData>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password || "password123",
        phone: cleanPhone || "9876543210",
        role: "doctor",
        otp: (data.otp || "").trim(),
      }),
    });
  },

  /**
   * Login via Email & Password
   * POST /api/auth/login
   */
  async login(email: string, password: string): Promise<ApiResponse<VerifyOtpResponseData>> {
    return apiFetch<VerifyOtpResponseData>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password,
      }),
    });
  },

  /**
   * Fetch authenticated user/doctor profile
   * GET /api/users/profile
   */
  async fetchProfile(): Promise<ApiResponse<DoctorUser>> {
    return apiFetch<DoctorUser>(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
      method: "GET",
    });
  },

  /**
   * Update authenticated doctor profile
   * PUT /api/users/profile
   */
  async updateProfile(data: any): Promise<ApiResponse> {
    const isFormData = data instanceof FormData;
    return apiFetch(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
      ...(isFormData ? {
        headers: {
          // fetch will automatically set Content-Type to multipart/form-data with the correct boundary when body is FormData
        }
      } : {})
    });
  },

  /**
   * Request password reset OTP & Token to Email
   * POST /api/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ resetToken?: string; otp?: string }>> {
    return apiFetch(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
      }),
    });
  },

  /**
   * Reset Password with token, OTP, new password, and confirmPassword
   * POST /api/auth/reset-password
   */
  async resetPassword(data: {
    token: string;
    otp: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse> {
    return apiFetch(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: "POST",
      body: JSON.stringify({
        token: data.token,
        otp: data.otp.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });
  },
};

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("moncradle_doctor_token") || localStorage.getItem("moncradle_auth_token") || null;
}
