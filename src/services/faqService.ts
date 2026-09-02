import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export const faqService = {
  getFaqs: async (): Promise<Faq[]> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/faqs?targetApp=doctor`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data.filter((f: Faq) => f.isActive);
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      return [];
    }
  },
};
