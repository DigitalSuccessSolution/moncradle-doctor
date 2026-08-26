import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface WithdrawalItem {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface WithdrawalResponse {
  success: boolean;
  message?: string;
  data: WithdrawalItem | WithdrawalItem[];
}

export const withdrawalService = {
  requestWithdrawal: async (amount: number): Promise<WithdrawalResponse | null> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to submit withdrawal request:", err);
      return null;
    }
  },

  getWithdrawalHistory: async (): Promise<WithdrawalItem[]> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/withdrawals`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch withdrawal history:", err);
      return [];
    }
  },
};
