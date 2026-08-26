import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface DoctorAnalyticsResponse {
  success: boolean;
  data: {
    financial: {
      totalEarned: number;
      availableBalance: number;
      pendingSettlement: number;
      totalWithdrawn: number;
      graphData: { name: string; revenue: number }[];
    };
    clinical: {
      totalAppointments: number;
      completedAppointments: number;
      cancelledAppointments: number;
      uniquePatients: number;
      graphData: { name: string; appointments: number; completed: number }[];
    };
  };
}

export const analyticsService = {
  getDoctorAnalytics: async (): Promise<DoctorAnalyticsResponse | null> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/analytics/doctor`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to fetch doctor analytics:", err);
      return null;
    }
  },
};
