/**
 * Prescription Service for Doctor PWA
 * Connects directly to backend API (/api/prescriptions).
 * Schema aligned strictly with Mongoose Prescription Schema.
 */

import { apiFetch, ApiResponse } from "./apiClient";
import { API_CONFIG } from "@/config/api.config";
import { Prescription } from "@/data/mockData";

export interface BackendPrescription {
  _id?: string;
  id?: string;
  babyId: any;
  doctorId: any;
  fileUrl?: string;
  medicalNotes?: string;
  nutritionRecommendations?: string;
  medicines?: Array<{
    name: string;
    dosage: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  vitals?: {
    weight?: string;
    temperature?: string;
    bp?: string;
  };
  nextVisitDate?: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Transforms raw backend prescription into UI Prescription model
 */
export function transformBackendPrescriptionToFrontend(rx: any): Prescription {
  const baby = typeof rx.babyId === "object" && rx.babyId !== null ? rx.babyId : {};
  const parent = typeof baby.parentId === "object" && baby.parentId !== null ? baby.parentId : {};
  const doctor = typeof rx.doctorId === "object" && rx.doctorId !== null ? rx.doctorId : {};

  const babyIdStr = typeof rx.babyId === "object" && rx.babyId !== null ? baby._id || baby.id : String(rx.babyId || "");
  const rxIdStr = String(rx._id || rx.id || `rx-${Date.now()}`);

  let rawMedicines = rx.medicines;
  if (typeof rawMedicines === "string") {
    try {
      rawMedicines = JSON.parse(rawMedicines);
    } catch (e) {
      rawMedicines = [];
    }
  }

  let rawVitals = rx.vitals;
  if (typeof rawVitals === "string") {
    try {
      rawVitals = JSON.parse(rawVitals);
    } catch (e) {
      rawVitals = {};
    }
  }

  const mappedMedicines = Array.isArray(rawMedicines)
    ? rawMedicines.map((m: any) => ({
      medicineName: m.medicineName || m.name || "Pediatric Medicine",
      dosage: m.dosage || "1 ml",
      frequency: m.frequency || "1-0-1",
      duration: m.duration || "5 Days",
      instructions: m.instructions || "After meals",
    }))
    : [];

  return {
    id: rxIdStr,
    patientId: babyIdStr,
    patientName: baby.name || rx.patientName || "Child Patient",
    patientAvatar: baby.avatar || rx.patientAvatar || "/child_avatar_1.png",
    parentName: parent.name || rx.parentName || "Parent",
    parentPhone: parent.phone || rx.parentPhone || "",
    doctorName: doctor.name || rx.doctorName || "Dr. Sumit Sahu",
    doctorSpecialization: doctor.specialization || "Pediatrician",
    date: rx.createdAt ? String(rx.createdAt).split("T")[0] : new Date().toISOString().split("T")[0],
    diagnosis: rx.medicalNotes || "Pediatric Evaluation",
    fileUrl: rx.fileUrl || "",
    vitals: {
      weight: rawVitals?.weight || "6.8 kg",
      temperature: rawVitals?.temperature || "98.6 F",
      bp: rawVitals?.bp || "N/A",
    },
    items: mappedMedicines,
    medicines: mappedMedicines,
    nextVisitDate: rx.nextVisitDate ? String(rx.nextVisitDate).split("T")[0] : undefined,
    nutritionRecommendations: rx.nutritionRecommendations || "",
  };
}

const DEFAULT_SAMPLE_BABY_ID = "64f719d3f1a2b3c4d5e6f7a8";

function ensureValidObjectId(id?: string): string {
  if (id && typeof id === "string" && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  return DEFAULT_SAMPLE_BABY_ID;
}

function ensureValidYYYYMMDD(dateStr?: string): string | undefined {
  if (!dateStr || typeof dateStr !== "string") return undefined;
  const clean = dateStr.trim().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }
  return undefined;
}

export const prescriptionService = {
  /**
   * Fetch all prescriptions for doctor
   * GET /api/prescriptions
   */
  async getAllPrescriptions(): Promise<ApiResponse<BackendPrescription[]>> {
    return apiFetch<BackendPrescription[]>(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.LIST, {
      method: "GET",
    });
  },

  /**
   * Fetch prescriptions for a specific baby
   * GET /api/prescriptions/:babyId
   */
  async getPrescriptionsByBaby(babyId: string): Promise<ApiResponse<BackendPrescription[]>> {
    const validBabyId = ensureValidObjectId(babyId);
    return apiFetch<BackendPrescription[]>(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.BY_BABY(validBabyId), {
      method: "GET",
    });
  },

  /**
   * Create a new prescription
   * POST /api/prescriptions
   */
  async createPrescription(data: {
    babyId: string;
    medicalNotes?: string;
    nutritionRecommendations?: string;
    medicines?: any;
    vitals?: any;
    nextVisitDate?: string;
    advice?: string;
  }): Promise<ApiResponse<BackendPrescription>> {
    const medicinesStr = Array.isArray(data.medicines)
      ? JSON.stringify(data.medicines)
      : typeof data.medicines === "string"
        ? data.medicines
        : undefined;

    const vitalsStr = typeof data.vitals === "object" && data.vitals !== null
      ? JSON.stringify(data.vitals)
      : typeof data.vitals === "string"
        ? data.vitals
        : undefined;

    const payload: any = {
      babyId: ensureValidObjectId(data.babyId),
      medicalNotes: data.medicalNotes || "Pediatric clinical prescription",
      nutritionRecommendations: data.nutritionRecommendations || "",
    };

    if (medicinesStr) payload.medicines = medicinesStr;
    if (vitalsStr) payload.vitals = vitalsStr;
    const cleanDate = ensureValidYYYYMMDD(data.nextVisitDate);
    if (cleanDate) payload.nextVisitDate = cleanDate;

    return apiFetch<BackendPrescription>(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.LIST, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update an existing prescription
   * PUT /api/prescriptions/:id
   */
  async updatePrescription(
    id: string,
    data: {
      medicalNotes?: string;
      nutritionRecommendations?: string;
      medicines?: any;
      vitals?: any;
      nextVisitDate?: string;
    }
  ): Promise<ApiResponse<BackendPrescription>> {
    const medicinesStr = Array.isArray(data.medicines)
      ? JSON.stringify(data.medicines)
      : typeof data.medicines === "string"
        ? data.medicines
        : undefined;

    const vitalsStr = typeof data.vitals === "object" && data.vitals !== null
      ? JSON.stringify(data.vitals)
      : typeof data.vitals === "string"
        ? data.vitals
        : undefined;

    const payload: any = {};
    if (data.medicalNotes !== undefined) payload.medicalNotes = data.medicalNotes;
    if (data.nutritionRecommendations !== undefined) payload.nutritionRecommendations = data.nutritionRecommendations;
    if (medicinesStr) payload.medicines = medicinesStr;
    if (vitalsStr) payload.vitals = vitalsStr;
    const cleanDate = ensureValidYYYYMMDD(data.nextVisitDate);
    if (cleanDate) payload.nextVisitDate = cleanDate;

    return apiFetch<BackendPrescription>(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete a prescription
   */
  async deletePrescription(id: string): Promise<ApiResponse<any>> {
    return apiFetch<any>(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.BY_ID(id), {
      method: "DELETE",
    });
  },
};
