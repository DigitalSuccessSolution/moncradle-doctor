/**
 * Central API Configuration for Moncradle Doctor PWA
 * Single Source of Truth for API Endpoints and Base URL configuration.
 * 
 * To point to a new IP or server (e.g., local network IP, staging, or production),
 * update NEXT_PUBLIC_API_BASE_URL in your `.env.local` file or update the fallback below.
 */

export const API_CONFIG = {
  // Base URL for backend server
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : "http://localhost:5000"),
  
  // API Timeout in milliseconds
  TIMEOUT_MS: 15000,

  // Auth Endpoints
  ENDPOINTS: {
    AUTH: {
      SEND_REGISTER_OTP: "/api/auth/send-register-otp",
      SEND_OTP: "/api/auth/send-otp",
      VERIFY_OTP: "/api/auth/verify-otp",
      REGISTER: "/api/auth/register",
      LOGIN: "/api/auth/login",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
    },
    USERS: {
      PROFILE: "/api/users/profile",
    },
    BABIES: {
      LIST: "/api/babies",
      BY_ID: (id: string) => `/api/babies/${id}`,
    },
    APPOINTMENTS: {
      LIST: "/api/appointments",
      CREATE: "/api/appointments",
      BY_ID: (id: string) => `/api/appointments/${id}`,
      UPDATE_STATUS: (id: string) => `/api/appointments/${id}/status`,
      STATUS: (id: string) => `/api/appointments/${id}/status`,
    },
    PRESCRIPTIONS: {
      LIST: "/api/prescriptions",
      BY_BABY: (babyId: string) => `/api/prescriptions/baby/${babyId}`,
      BY_ID: (id: string) => `/api/prescriptions/${id}`,
    },
    NUTRITION_PLANS: {
      LIST: "/api/nutrition-plans",
      BY_BABY: (babyId: string) => `/api/nutrition-plans/${babyId}`,
      BY_ID: (id: string) => `/api/nutrition-plans/${id}`,
    },
    GROWTH: {
      LIST: "/api/growth",
      BY_BABY: (babyId: string) => `/api/growth/${babyId}`,
    },
    SUPPORT: {
      LIST: "/api/support",
    },
    EARNINGS: {
      GET: "/api/earnings",
    },
  },
};
