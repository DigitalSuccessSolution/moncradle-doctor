import { getStoredToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface SupportTicket {
  _id?: string;
  id?: string;
  issueType?: string;
  subject?: string;
  description?: string;
  message?: string;
  priority?: "low" | "medium" | "high";
  status?: "open" | "in_progress" | "resolved" | "closed";
  replies?: Array<{
    sender?: string;
    senderRole?: string;
    message: string;
    createdAt?: string;
  }>;
  createdAt?: string;
}

export const supportService = {
  getTickets: async (): Promise<{ success: boolean; data: SupportTicket[] }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/support`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const rawList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      const mapped = rawList.map((t: any) => {
        let subj = t.subject || "Doctor Support Inquiry";
        let msg = t.description || t.message || "";

        // Extract subject if packed inside description format [Category] Description
        if (msg.startsWith("[") && msg.includes("]")) {
          const closingIdx = msg.indexOf("]");
          subj = msg.substring(1, closingIdx);
          msg = msg.substring(closingIdx + 1).trim();
        }

        return {
          ...t,
          subject: subj,
          description: msg || "Support inquiry submitted to Admin",
          message: msg || "Support inquiry submitted to Admin",
        };
      });
      return {
        success: data.success ?? res.ok,
        data: mapped,
      };
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
      return { success: false, data: [] };
    }
  },

  createTicket: async (ticket: {
    subject: string;
    message: string;
    priority?: string;
  }): Promise<{ success: boolean; data?: SupportTicket; message?: string }> => {
    try {
      const token = getStoredToken();
      
      // Backend Zod validator requires issueType to be one of ['delivery_issue', 'payment_issue', 'food_quality', 'other']
      const payload = {
        issueType: "other",
        description: `[${ticket.subject}] ${ticket.message}`,
        priority: ticket.priority || "medium",
      };

      const res = await fetch(`${API_URL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return {
        success: data.success ?? res.ok,
        data: data.data || data,
        message: data.message,
      };
    } catch (err) {
      console.error("Failed to create support ticket:", err);
      return { success: false, message: "Network connection error" };
    }
  },

  replyToTicket: async (id: string, message: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_URL}/support/${id}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      return {
        success: data.success ?? res.ok,
        message: data.message,
      };
    } catch (err) {
      console.error("Failed to reply to ticket:", err);
      return { success: false, message: "Network connection error" };
    }
  },
};
