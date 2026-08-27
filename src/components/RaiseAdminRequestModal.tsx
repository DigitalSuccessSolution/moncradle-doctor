"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send, ShieldAlert, CheckCircle2, FileText, AlertCircle, Paperclip } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function RaiseAdminRequestModal() {
  const { addNotification } = useDoctorData();
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("Assign New Parent / Child Patient Account");
  const [priority, setPriority] = useState<"Low" | "Medium" | "Urgent">("Medium");
  const [parentOrChildId, setParentOrChildId] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
    };
    window.addEventListener("open-raise-request", handleOpen);
    return () => window.removeEventListener("open-raise-request", handleOpen);
  }, []);

  if (!isOpen || typeof document === "undefined") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

      // Notify in Doctor Panel
      addNotification({
        title: `Admin Ticket #${ticketId} Submitted`,
        message: `Priority ${priority}: ${category} request dispatched to Super Admin support.`,
        timestamp: "Just now",
        read: false,
        type: "system",
        priority: priority === "Urgent" ? "high" : "normal",
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsOpen(false);
        setCategory("Assign New Parent / Child Patient Account");
        setParentOrChildId("");
        setDescription("");
        setPriority("Medium");
      }, 2000);
    }, 1000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 shadow-2xl overflow-hidden space-y-0 relative z-10" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#1E4E70] to-[#153852] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldAlert className="w-5 h-5 text-[#A5D8FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Raise Admin Request Ticket</h3>
              <p className="text-xs text-[#A5D8FF]">Report issues or request parent/child assignments to Super Admin</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Ticket Submitted to Super Admin!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your request ticket has been dispatched to Moncradle Super Admin support. Priority: <strong className="text-[#1E4E70]">{priority}</strong>. Support team will resolve it within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Category Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Request Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
              >
                <option value="Assign New Parent / Child Patient Account">Assign New Parent / Child Patient Account</option>
                <option value="Patient Data / Growth Percentile Discrepancy">Patient Data / Growth Percentile Discrepancy</option>
                <option value="Prescription & Medicine Catalog Request">Prescription & Medicine Catalog Request</option>
                <option value="Account Verification / Access Issues">Account Verification / Access Issues</option>
                <option value="Other Inquiry">Other Support Inquiry</option>
              </select>
            </div>

            {/* Priority Pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Priority Level</label>
              <div className="flex items-center gap-2">
                {(["Low", "Medium", "Urgent"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                      priority === p
                        ? p === "Urgent"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-[#1E4E70] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Parent ID / Patient ID Reference Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Referenced Parent ID or Patient Code <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Parent ID: PAR-9021 or Child Patient #2842-B"
                value={parentOrChildId}
                onChange={(e) => setParentOrChildId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Issue Description & Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain the issue or patient assignment details clearly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
              />
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="bg-[#1E4E70] hover:bg-[#153852] disabled:opacity-50 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit to Admin"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
