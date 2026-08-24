// Forced refresh
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Calendar,
  FileText,
  CheckCircle2,
  Volume2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  X,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { playIOSNotificationSound } from "@/utils/audio";
import { notificationService } from "@/services/notificationService";

export interface DoctorNotification {
  id: string;
  patientName?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: string;
  priority?: "normal" | "high";
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedNotification, setSelectedNotification] = useState<DoctorNotification | null>(null);
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && Array.isArray(res.data)) {
        const mapped: DoctorNotification[] = res.data.map((n: any, idx: number) => ({
          id: n._id || n.id || String(idx),
          patientName: n.title || "Clinical Notification",
          title: n.title || "Notification",
          message: n.message || "No message body",
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today",
          read: !!n.isRead,
          type: n.type || "system",
          priority: n.priority || "normal",
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to fetch notifications from backend:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedNotification) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedNotification]);

  const markAllRead = () => {
    playIOSNotificationSound();
    notifications.forEach((n) => {
      if (n.id) notificationService.markAsRead(n.id).catch(() => {});
    });
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id).catch(() => {});
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };


  const handleBulkDeleteModeToggle = () => {
    if (isBulkDeleteMode) {
      setIsBulkDeleteMode(false);
      setSelectedIds([]);
    } else {
      setIsBulkDeleteMode(true);
      setSelectedIds(notifications.map(n => n.id)); // auto select all
    }
  };

  const executeBulkDelete = () => {
    playIOSNotificationSound();
    selectedIds.forEach((id) => {
      notificationService.deleteNotification(id).catch(() => {});
    });
    setNotifications((prev) => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    setIsBulkDeleteMode(false);
    setShowConfirmDelete(false);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans w-full max-w-full overflow-hidden">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Doctor Notifications
            </h1>
            <span className="bg-[#1E4E70] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {notifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time clinical alerts, growth updates, and consultation reminders
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={fetchNotifications}
            className="p-2.5 text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
            title="Refresh Notifications"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {isBulkDeleteMode ? (
                <>
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={selectedIds.length === 0}
                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Delete ({selectedIds.length})</span>
                  </button>
                  <button
                    onClick={handleBulkDeleteModeToggle}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleBulkDeleteModeToggle}
                  className="bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">Bulk Delete</span>
                  <span className="sm:hidden">Select</span>
                </button>
              )}
            </div>
          )}
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllRead}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
        {[
          { id: "all", label: `All Alerts (${notifications.length})` },
          { id: "unread", label: `Unread (${notifications.filter((n) => !n.read).length})` },
          { id: "read", label: `Read (${notifications.filter((n) => n.read).length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playIOSNotificationSound();
              setFilter(tab.id as any);
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              filter === tab.id
                ? "bg-[#1E4E70] text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Notifications List or Clean Empty State */}
      <div className="space-y-3.5 w-full max-w-full min-w-0">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 font-medium">Fetching live notifications...</div>
        ) : filteredNotifs.length === 0 ? (
          <div className="py-14 text-center space-y-3 border border-dashed border-slate-200 rounded-xl bg-white p-8">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">No Notifications Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You are all caught up! Real-time alerts and patient updates will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          filteredNotifs.map((n) => {
            const isHigh = n.priority === "high";
            const Icon =
              n.type === "growth_alert"
                ? AlertTriangle
                : n.type === "appointment"
                ? Calendar
                : Bell;

            return (
              <div
                key={n.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button, a, input[type='checkbox']")) return;
                  if (isBulkDeleteMode) {
                    setSelectedIds(prev => prev.includes(n.id) ? prev.filter(id => id !== n.id) : [...prev, n.id]);
                    return;
                  }
                  if (!n.read && n.id) {
                    notificationService.markAsRead(n.id).catch(() => {});
                    setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, read: true } : item));
                  }
                  setSelectedNotification(n);
                }}
                className={`rounded-lg p-4 sm:p-5 border transition-all duration-300 flex items-start gap-3.5 w-full max-w-full min-w-0 overflow-hidden cursor-pointer ${
                  isHigh
                    ? "bg-rose-50/90 border-rose-200/80 shadow-xs hover:bg-rose-100"
                    : !n.read
                    ? "bg-white border-[#A5D8FF] shadow-xs ring-1 ring-[#A5D8FF]/40 hover:bg-sky-50/30"
                    : "bg-white border-slate-200/80 opacity-85 hover:bg-slate-50"
                }`}
              >
                {isBulkDeleteMode && (
                  <div className="flex items-center justify-center h-10 shrink-0">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(n.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(prev => [...prev, n.id]);
                        else setSelectedIds(prev => prev.filter(id => id !== n.id));
                      }}
                      className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>
                )}
                
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${
                    isHigh
                      ? "bg-rose-500 text-white"
                      : !n.read
                      ? "bg-[#1E4E70] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {n.title || n.patientName}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                      {!isBulkDeleteMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (n.id) handleDeleteNotification(n.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs font-medium leading-relaxed line-clamp-2 ${
                      isHigh ? "text-rose-700" : "text-slate-600"
                    }`}
                  >
                    {n.message}
                  </p>

                  {isHigh && (
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href="/patients/2"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                      >
                        <span>Review Patient Chart</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. DETAILS BOTTOM SHEET / MODAL */}
      {selectedNotification && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-fadeIn sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedNotification(null)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-slideUp transform transition-transform max-h-[85vh] flex flex-col font-sans" onClick={e => e.stopPropagation()}>
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Notification Details</h2>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  selectedNotification.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-[#1E4E70]/10 text-[#1E4E70]'
                }`}>
                  {selectedNotification.type === 'growth_alert' ? <AlertTriangle className="w-6 h-6" /> : 
                   selectedNotification.type === 'appointment' ? <Calendar className="w-6 h-6" /> : 
                   <Bell className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">{selectedNotification.title || selectedNotification.patientName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedNotification.timestamp}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedNotification.message}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (selectedNotification.id) handleDeleteNotification(selectedNotification.id);
                  setSelectedNotification(null);
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={() => setSelectedNotification(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 5. BULK DELETE CONFIRMATION MODAL */}
      {showConfirmDelete && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-fadeIn p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setShowConfirmDelete(false)} />
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-slideUp p-6 flex flex-col font-sans space-y-4 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Delete Notifications</h3>
              <p className="text-slate-500 text-sm mt-1">
                Are you sure you want to permanently delete {selectedIds.length} selected notification(s)? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
