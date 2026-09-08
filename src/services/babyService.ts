/**
 * Baby Service for Doctor PWA
 * Handles fetching patient babies and parent details from backend API (/api/babies).
 */

import { apiFetch, ApiResponse } from "./apiClient";
import { API_CONFIG } from "@/config/api.config";
import { Patient } from "@/types";

/**
 * Transforms raw backend Baby payload into frontend Patient model
 */
export function transformBackendBabyToPatient(baby: any): Patient {
  const parent = typeof baby.parentId === "object" && baby.parentId !== null ? baby.parentId : {};
  const parentIdStr =
    typeof baby.parentId === "object" && baby.parentId !== null
      ? parent._id || parent.id
      : String(baby.parentId || "");
  const babyIdStr = String(baby._id || baby.id);

  return {
    id: babyIdStr,
    name: baby.name || "Child",
    gender: baby.gender || "boy",
    dateOfBirth: baby.dateOfBirth ? String(baby.dateOfBirth).split("T")[0] : "2025-01-01",
    ageInMonths: baby.ageInMonths || 0,
    prematureDays: baby.prematureDays || 0,
    weight: baby.weight || 0,
    height: baby.height || 0,
    weightKg: baby.weight || 0,
    heightCm: baby.height || 0,
    medicalCondition: baby.medicalCondition || "",
    diet: baby.diet || "",
    bloodType: baby.bloodType || "O+",
    allergies: Array.isArray(baby.allergies) ? baby.allergies : [],
    parentId: parentIdStr,
    parentName: parent.name || baby.parentName || "Parent Account",
    parentPhone: parent.phone || baby.parentPhone || "N/A",
    parentEmail: parent.email || baby.parentEmail || "",
    parentAddress: parent.address || baby.parentAddress || "",
    avatar: baby.avatar || "/child_avatar_1.png",
    
    // UI Helpers
    code: baby.code || "",
    age: baby.ageInMonths ? `${baby.ageInMonths} Months` : "N/A",
    dob: baby.dateOfBirth ? `Born ${String(baby.dateOfBirth).split("T")[0]}` : "",
    status: baby.status || "Stable",
  };
}

export const babyService = {
  /**
   * Fetch babies list from backend
   * GET /api/babies
   */
  async fetchBabies(): Promise<ApiResponse<any[]>> {
    return apiFetch<any[]>(API_CONFIG.ENDPOINTS.BABIES.LIST, {
      method: "GET",
    });
  },

  /**
   * Fetch single baby by ID from backend
   * GET /api/babies/:id
   */
  async fetchBabyById(id: string): Promise<ApiResponse<any>> {
    return apiFetch<any>(API_CONFIG.ENDPOINTS.BABIES.BY_ID(id), {
      method: "GET",
    });
  },

  /**
   * Create/register new baby patient
   * POST /api/babies
   */
  async createBaby(payload: any): Promise<ApiResponse<any>> {
    return apiFetch<any>(API_CONFIG.ENDPOINTS.BABIES.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
