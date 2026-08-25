/**
 * API Client Utility for Moncradle Doctor PWA
 * Handles HTTP requests, authorization headers, and error formatting systematically.
 */

import { API_CONFIG } from "@/config/api.config";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
  doctor?: any;
  otp?: string;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieves the persisted auth token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("moncradle_doctor_token");
  } catch (e) {
    return null;
  }
}

/**
 * Persists or removes the auth token in localStorage
 */
export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem("moncradle_doctor_token", token);
    } else {
      localStorage.removeItem("moncradle_doctor_token");
    }
  } catch (e) {
    console.error("Failed to save auth token to localStorage", e);
  }
}

/**
 * Standard fetch wrapper for API calls
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const cleanBaseUrl = (API_BASE_URL || "").replace(/\/$/, "");
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Anti-conflict logic: prevent double /api/api/ if BASE_URL already includes /api
  if (cleanBaseUrl.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.replace(/^\/api/, "");
  }

  const url = `${cleanBaseUrl}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  // If body is FormData, let the browser set the Content-Type with correct boundary
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const token = getStoredToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = {};
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      json = await response.json();
    } else {
      const text = await response.text();
      json = { message: text };
    }

    if (!response.ok) {
      const errorMessage =
        json.message || json.error || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, json);
    }

    return {
      success: true,
      data: json.data !== undefined ? json.data : json,
      message: json.message,
      token: json.token || json.accessToken,
      user: json.user || json.doctor,
      doctor: json.doctor || json.user,
      otp: json.otp,
      ...json,
    };
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Handle network errors / connection refused (e.g. backend server offline)
    const isNetworkErr = err?.name === "TypeError" || err?.message?.includes("fetch");
    const formattedMsg = isNetworkErr
      ? "Unable to connect to server. Please check backend API server running at " + API_BASE_URL
      : err?.message || "An unexpected network error occurred.";

    throw new ApiError(formattedMsg, 0);
  }
}
