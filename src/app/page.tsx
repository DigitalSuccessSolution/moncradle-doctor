"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Calendar,
  TrendingUp,
  Briefcase,
  Edit3,
  ClipboardList,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Clock,
  Stethoscope,
  Activity,
  ArrowUpRight,
  Phone,
  X,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { appointmentService } from "@/services/appointmentService";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Dashboard() {
  const { doctorProfile, patients, appointments, setAppointments, isDataLoading } = useDoctorData();

  // Cancel / Reject Modal state
  const [cancelModalApt, setCancelModalApt] = useState<any | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState<boolean>(false);

  // Mobile Bottom Sheet / Centered Modal state
  const [selectedMobileApt, setSelectedMobileApt] = useState<any | null>(null);

  // Edit Notes Modal state
  const [editModalApt, setEditModalApt] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedMobileApt || cancelModalApt || editModalApt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMobileApt, cancelModalApt, editModalApt]);

  // Submit Rejection / Cancellation with reason
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt || !cancellationReason.trim()) return;

    setIsSubmittingCancel(true);
    try {
      const res = await appointmentService.updateStatus(cancelModalApt.id, "cancelled", {
        cancellationReason: cancellationReason.trim(),
      });

      if (res.success || res.data) {
        if (setAppointments) {
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === cancelModalApt.id
                ? { ...a, status: "Cancelled" as any, cancellationReason: cancellationReason.trim() }
                : a
            )
          );
        }
        setCancelModalApt(null);
        setCancellationReason("");
        setSelectedMobileApt(null); // Close details modal if open
      } else {
        alert(res.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  // Submit Edit Notes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalApt) return;

    setIsSubmittingEdit(true);
    try {
      const res = await appointmentService.updateAppointment(editModalApt.id, {
        doctorNotes: editNotes.trim(),
      });

      if (res.success || res.data) {
        if (setAppointments) {
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === editModalApt.id
                ? { ...a, doctorNotes: editNotes.trim() }
                : a
            )
          );
        }
        setEditModalApt(null);
      }
    } catch (err) {
      console.error("Error saving appointment notes:", err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleOpenQuickAddTab = (tabName: string) => {
    window.dispatchEvent(
      new CustomEvent("open-quick-add", { detail: { tab: tabName } })
    );
  };

  const todayAppointments = appointments.filter(
    (apt) => apt.date === "2026-07-31" || apt.status === "Upcoming"
  );
  const attentionPatient = patients.find((p) => p.status === "Attention");

  if (isDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#1E4E70] border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing patient data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-6 font-sans">
      {/* 1. Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
            Good Morning, {doctorProfile.fullName || "Doctor"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            You have{" "}
            <span className="font-semibold text-[#1E4E70]">
              {todayAppointments.length}
            </span>{" "}
            appointments scheduled for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Sync Active
          </span>
        </div>
      </div>

      {/* 2. Quick Action Cards (Distinct Soft Baby Pastel Themes - Border-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Appointments Card - Soft Baby Sky Blue */}
        <Link
          href="/appointments"
          className="bg-gradient-to-br from-sky-100 to-blue-100 hover:from-sky-200 hover:to-blue-200 text-left p-5 rounded-3xl transition-all group cursor-pointer flex flex-col justify-between min-h-[140px] border border-sky-200 block"
        >
          <div className="mb-4">
            <Image
              src="/pediatric_consultation.png"
              alt="Appointments"
              width={56}
              height={56}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#1E4E70] text-sm sm:text-base leading-tight">
              Appointments
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              View your schedule
            </p>
          </div>
        </Link>

        {/* Add Notes Card - Soft Baby Lavender */}
        <Link
          href="/prescriptions"
          className="bg-gradient-to-br from-purple-100 to-fuchsia-100 hover:from-purple-200 hover:to-fuchsia-200 text-left p-5 rounded-3xl transition-all group cursor-pointer flex flex-col justify-between min-h-[140px] border border-purple-200 block"
        >
          <div className="mb-4">
            <Image
              src="/pediatric_notes.png"
              alt="Add Notes"
              width={56}
              height={56}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#5B21B6] text-sm sm:text-base leading-tight">
              Add Notes
            </h3>
            <p className="text-xs text-purple-900/60 font-medium mt-1">
              Update clinical records
            </p>
          </div>
        </Link>

        {/* Create Plan Card - Soft Baby Fresh Mint */}
        <Link
          href="/nutrition"
          className="bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 text-left p-5 rounded-3xl transition-all group cursor-pointer flex flex-col justify-between min-h-[140px] border border-emerald-200 block"
        >
          <div className="mb-4">
            <Image
              src="/pediatric_diet.png"
              alt="Create Plan"
              width={56}
              height={56}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#166534] text-sm sm:text-base leading-tight">
              Create Plan
            </h3>
            <p className="text-xs text-emerald-950/60 font-medium mt-1">
              Pediatric diet & nutrition roadmap
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Patient Statistics Grid (Distinct Soft Baby Pastel Themes - Border-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Patients - Soft Baby Warm Peach */}
        <Link
          href="/patients"
          className="bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-all group min-h-[160px] border border-orange-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Image
                src="/icon_patients_3d.png"
                alt="Total Patients"
                width={56}
                height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                unoptimized
              />
            </div>
            <span className="text-[10px] font-bold text-orange-800 bg-orange-100/60 px-2 py-0.5 rounded-lg border border-orange-200/60">
              Active Directory
            </span>
          </div>
          <div>
            <p className="text-xs text-orange-950/60 font-semibold uppercase tracking-wider">Total Patients</p>
            <p className="text-2xl font-extrabold text-[#9A3412] tracking-tight mt-1">
              {patients.length} Active
            </p>
          </div>
        </Link>

        {/* Today's Appts - Soft Baby Turquoise / Sky */}
        <Link
          href="/appointments"
          className="bg-gradient-to-br from-cyan-100 to-sky-100 hover:from-cyan-200 hover:to-sky-200 rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-all group min-h-[160px] border border-cyan-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Image
                src="/icon_appointments_3d.png"
                alt="Today's Appointments"
                width={56}
                height={56}
                className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
                unoptimized
              />
            </div>
            <span className="text-[10px] font-bold text-[#0369A1] bg-sky-100/60 px-2 py-0.5 rounded-lg border border-sky-200/60">
              Today's Queue
            </span>
          </div>
          <div>
            <p className="text-xs text-sky-950/60 font-semibold uppercase tracking-wider">Today's Appts</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#0369A1] tracking-tight">
                {todayAppointments.length}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-200">
                ↑20%
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Critical Alert Banner (Flat Solid Color, No Shadows) */}
      {attentionPatient && (
        <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 rounded-r-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 max-w-full overflow-hidden">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-rose-900 text-xs sm:text-sm truncate">
                  Growth Alert: {attentionPatient.name}
                </span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                  Score: {attentionPatient.growthScore}/100
                </span>
              </div>
              <p className="text-xs text-rose-800 font-medium leading-relaxed">
                Weight dropped to {attentionPatient.weight}. Immediate pediatric nutrition & diet review advised.
              </p>
            </div>
          </div>
          <Link
            href={`/patients/${attentionPatient.id}`}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap text-center self-end sm:self-auto flex items-center gap-1"
          >
            <span>Review Chart</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. Upcoming Appointments Section (Flat Solid Color, No Gradients, No Shadows) */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">
            Upcoming Appointments
          </h2>
          <Link
            href="/appointments"
            className="text-xs font-semibold text-[#1E4E70] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {todayAppointments.length === 0 ? (
            <div className="col-span-full py-8 md:py-12 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Appointments Today</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">You have no scheduled consultations for today. Enjoy your day or review patient files.</p>
            </div>
          ) : (
            todayAppointments.slice(0, 2).map((apt) => {
              const rawStatus = (apt.status || "scheduled").toLowerCase();
              let statusBadgeClass = "bg-sky-50 text-[#1E4E70] border-sky-200";
              let statusText = "Active";

              if (rawStatus === "completed") {
                statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
                statusText = "Completed";
              } else if (rawStatus === "cancelled") {
                statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                statusText = "Cancelled";
              }

              return (
                <div key={apt.id} className="bg-white border border-slate-200/80 rounded-xl p-5 space-y-4 hover:border-slate-300 transition-colors">
                  {/* Top: Profile Info & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200/80 relative shrink-0 bg-slate-100">
                        <Image
                          src={
                            apt.patientAvatar ||
                            `/child_avatar_${(parseInt(apt.id.replace(/\D/g, "") || "1") % 5) + 1}.png`
                          }
                          alt={apt.patientName}
                          fill
                          className="object-cover object-center"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{apt.patientName}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Parent: {apt.parentName}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusBadgeClass}`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Date, Time & Quick Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-[#1E4E70] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] leading-tight text-slate-500 font-medium">{apt.date || "Today"}</span>
                        <span className="text-xs leading-tight">{apt.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{(apt as any).fee || 500}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedMobileApt(apt)}
                      className="bg-[#1E4E70] text-white hover:bg-[#153852] font-semibold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer flex-1 text-center shadow-xs"
                    >
                      Details
                    </button>
                    {(!apt.status || apt.status.toLowerCase() !== "cancelled") && (
                      <button
                        onClick={() => {
                          setCancelModalApt(apt);
                          setCancellationReason("");
                        }}
                        className="text-rose-600 font-semibold text-xs py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 text-center"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {todayAppointments.length > 2 && (
          <div className="mt-4 text-center">
            <Link 
              href="/appointments"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200/80 text-[#1E4E70] hover:bg-slate-50 font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              View All {todayAppointments.length} Appointments
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* REJECTION / CANCELLATION MODAL */}
      {cancelModalApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setCancelModalApt(null)} />
          <form
            onSubmit={handleConfirmReject}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans relative z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Reject / Cancel Appointment</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Please enter the cancellation reason for <span className="font-bold text-slate-900">{cancelModalApt.patientName}</span>. This reason will be logged into backend API.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Cancellation Reason *</label>
              <textarea
                required
                rows={3}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Doctor emergency OPD duty at requested time slot..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingCancel || !cancellationReason.trim()}
                className="px-4 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingCancel ? "Cancelling..." : "Confirm Rejection"}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* MOBILE BOTTOM SHEET / DESKTOP MODAL FOR APPOINTMENT DETAILS */}
      {selectedMobileApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-fadeIn sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedMobileApt(null)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-slideUp transform transition-transform max-h-[85vh] flex flex-col font-sans" onClick={e => e.stopPropagation()}>
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Appointment Details</h2>
              <button
                onClick={() => setSelectedMobileApt(null)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs relative shrink-0">
                  <Image
                    src={selectedMobileApt.patientAvatar || "/child_avatar_1.png"}
                    alt={selectedMobileApt.patientName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-base">{selectedMobileApt.patientName}</h3>
                  <Link
                    href={`/patients/${selectedMobileApt.patientId}?tab=profile`}
                    className="text-xs text-[#1E4E70] font-semibold hover:underline flex items-center gap-1 mt-0.5"
                  >
                    View Full File <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</span>
                  <span className="text-sm font-bold text-slate-800">{selectedMobileApt.date} • {selectedMobileApt.time}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parent</span>
                  <span className="text-sm font-bold text-slate-800">{selectedMobileApt.parentName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</span>
                  <a href={`tel:${selectedMobileApt.parentPhone}`} className="text-sm font-bold text-[#1E4E70] flex items-center gap-1.5 bg-[#A5D8FF]/20 px-3 py-1 rounded-lg">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedMobileApt.parentPhone ? selectedMobileApt.parentPhone.slice(0, -4) + "XXXX" : "N/A"}
                  </a>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100/60">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                  <span className="text-sm font-bold text-slate-800 capitalize">{selectedMobileApt.status}</span>
                </div>
                
                {selectedMobileApt.status?.toLowerCase() === "cancelled" && selectedMobileApt.cancellationReason && (
                  <div className="flex justify-between items-start py-2 border-b border-slate-100/60">
                    <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider mt-0.5">Reason</span>
                    <span className="text-sm font-bold text-rose-600 text-right max-w-[200px]">{selectedMobileApt.cancellationReason}</span>
                  </div>
                )}
                
                {selectedMobileApt.notes && (
                  <div className="flex flex-col py-2 border-b border-slate-100/60 gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient's Notes</span>
                    <span className="text-xs italic text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{selectedMobileApt.notes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedMobileApt(null);
                    setEditModalApt(selectedMobileApt);
                    setEditNotes(selectedMobileApt.doctorNotes || "");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-4 h-4" /> Doctor Notes
                </button>
                {(!selectedMobileApt.status || selectedMobileApt.status.toLowerCase() !== "cancelled") && (
                  <button
                    onClick={() => {
                      setSelectedMobileApt(null);
                      setCancelModalApt(selectedMobileApt);
                      setCancellationReason("");
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-rose-200"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* EDIT NOTES MODAL */}
      {editModalApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setEditModalApt(null)} />
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans relative z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Edit Appointment Details</h3>
              <button
                type="button"
                onClick={() => setEditModalApt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Patient's Booking Notes</label>
              <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-500 italic">
                {editModalApt.notes || "No notes provided by patient."}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Doctor Notes</label>
              <textarea
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Clinical consultation observations..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditModalApt(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingEdit}
                className="px-4 py-2.5 text-xs font-semibold bg-[#1E4E70] hover:bg-[#153852] text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
}
