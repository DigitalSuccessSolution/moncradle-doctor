/**
 * Nutrition Service for Doctor PWA
 * Connects directly to backend API (/api/nutrition-plans).
 * Schema aligned strictly with Mongoose NutritionPlan Schema.
 */

import { apiFetch, ApiResponse } from "./apiClient";
import { API_CONFIG } from "@/config/api.config";
import { NutritionPlan } from "@/types";

export interface BackendNutritionPlan {
  _id?: string;
  id?: string;
  babyId: any;
  assignedBy: any;
  weeklySchedule?: Array<{
    day: string;
    mealId?: any;
  }>;
  guidelines?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Calculates WHO pediatric nutrient goals dynamically based on patient age in months/years
 */
export function getPatientNutrientGoals(patient?: { age?: string; weight?: string | number; ageInMonths?: number }) {
  let months = 6;
  if (patient?.ageInMonths) {
    months = patient.ageInMonths;
  } else if (patient?.age) {
    const match = patient.age.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (patient.age.toLowerCase().includes("year") || patient.age.toLowerCase().includes("yr")) {
        months = num * 12;
      } else {
        months = num;
      }
    }
  }

  if (months <= 6) {
    return {
      targetCalories: 550,
      targetProtein: 11,
      targetIron: 4,
      targetAchievementPercent: 94,
    };
  } else if (months <= 12) {
    return {
      targetCalories: 850,
      targetProtein: 15,
      targetIron: 11,
      targetAchievementPercent: 88,
    };
  } else if (months <= 36) {
    return {
      targetCalories: 1150,
      targetProtein: 24,
      targetIron: 13,
      targetAchievementPercent: 86,
    };
  } else {
    return {
      targetCalories: 1500,
      targetProtein: 45,
      targetIron: 16,
      targetAchievementPercent: 90,
    };
  }
}

/**
 * Transforms raw backend nutrition plan payload into UI NutritionPlan model
 */
export function transformBackendNutritionPlanToFrontend(plan: any, patientInfo?: any): NutritionPlan {
  const babyIdStr = typeof plan.babyId === "object" && plan.babyId !== null ? plan.babyId._id || plan.babyId.id : String(plan.babyId || "");
  const dynamicGoals = getPatientNutrientGoals(patientInfo || plan.babyId);

  return {
    patientId: babyIdStr,
    ...dynamicGoals,
    focusText: plan.guidelines || "Balanced nutrition and pediatric dietary support.",
    focusImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    meals: Array.isArray(plan.weeklySchedule)
      ? plan.weeklySchedule.map((item: any, idx: number) => ({
          id: `np-m-${idx}`,
          meal: item.day || "Daily Meal",
          time: "08:00 AM",
          title: item.mealId?.title || item.mealId?.name || `${item.day || "Daily"} Pediatric Meal`,
          description: item.mealId?.description || plan.guidelines || "Pediatric nutritional meal",
          tags: ["NUTRITION", "PEDIATRIC"],
          iconType: "sun" as const,
        }))
      : [],
  };
}

const VALID_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_SAMPLE_MEAL_ID = "6a7b113d4c971486e4fc4a48";

function ensureValidDay(day: string, idx: number): string {
  if (VALID_DAYS.includes(day)) return day;
  return VALID_DAYS[idx % 7];
}

function ensureValidMealId(id?: string): string {
  if (id && typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  return DEFAULT_SAMPLE_MEAL_ID;
}

export const nutritionService = {
  /**
   * Fetch all nutrition plans
   * GET /api/nutrition-plans
   */
  async getAllNutritionPlans(): Promise<ApiResponse<BackendNutritionPlan[]>> {
    return apiFetch<BackendNutritionPlan[]>(API_CONFIG.ENDPOINTS.NUTRITION_PLANS.LIST, {
      method: "GET",
    });
  },

  /**
   * Fetch nutrition plan for a specific baby
   * GET /api/nutrition-plans/:babyId
   */
  async getNutritionPlanByBaby(babyId: string): Promise<ApiResponse<BackendNutritionPlan>> {
    return apiFetch<BackendNutritionPlan>(API_CONFIG.ENDPOINTS.NUTRITION_PLANS.BY_BABY(babyId), {
      method: "GET",
    });
  },

  /**
   * Create a new nutrition plan for a baby
   * POST /api/nutrition-plans
   */
  async createNutritionPlan(data: {
    babyId: string;
    weeklySchedule?: Array<{ day: string; mealId?: string }>;
    guidelines?: string;
  }): Promise<ApiResponse<BackendNutritionPlan>> {
    const sanitizedSchedule = Array.isArray(data.weeklySchedule)
      ? data.weeklySchedule.map((item, idx) => ({
          day: ensureValidDay(item.day, idx),
          mealId: ensureValidMealId(item.mealId),
        }))
      : [];

    return apiFetch<BackendNutritionPlan>(API_CONFIG.ENDPOINTS.NUTRITION_PLANS.LIST, {
      method: "POST",
      body: JSON.stringify({
        babyId: data.babyId,
        weeklySchedule: sanitizedSchedule,
        guidelines: data.guidelines || "",
      }),
    });
  },

  /**
   * Update an existing nutrition plan
   * PUT /api/nutrition-plans/:id
   */
  async updateNutritionPlan(
    id: string,
    data: { babyId: string; weeklySchedule?: Array<{ day: string; mealId?: string }>; guidelines?: string }
  ): Promise<ApiResponse<BackendNutritionPlan>> {
    const sanitizedSchedule = Array.isArray(data.weeklySchedule)
      ? data.weeklySchedule.map((item, idx) => ({
          day: ensureValidDay(item.day, idx),
          mealId: ensureValidMealId(item.mealId),
        }))
      : undefined;

    return apiFetch<BackendNutritionPlan>(API_CONFIG.ENDPOINTS.NUTRITION_PLANS.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify({
        babyId: data.babyId,
        ...(sanitizedSchedule !== undefined ? { weeklySchedule: sanitizedSchedule } : {}),
        ...(data.guidelines !== undefined ? { guidelines: data.guidelines } : {}),
      }),
    });
  },
};
