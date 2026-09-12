"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Check,
  X,
  FileText,
  Activity,
  Video,
  Edit3,
  Search,
  User,
  Phone,
  Filter,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { appointmentService, transformBackendAppointmentToFrontend } from "@/services/appointmentService";
import { babyService } from "@/services/babyService";

export default function AppointmentsPage() {
  const { appointments, setAppointments, patients } = useDoctorData();

  const [localAppointments, setLocalAppointments] = useState<any[]>([]);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Selected Patient Profile Drawer / Modal state
  const [selectedPatientModal, setSelectedPatientModal] = useState<any | null>(null);

  // Status Modal state
  const [statusModalApt, setStatusModalApt] = useState<any | null>(null);
  const [statusSelection, setStatusSelection] = useState<string>("scheduled");
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [isSubmittingStatus, setIsSubmittingStatus] = useState<boolean>(false);

  // Edit Notes / Meeting Link Modal state
  const [editModalApt, setEditModalApt] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  // Mobile Bottom Sheet Modal state
  const [selectedMobileApt, setSelectedMobileApt] = useState<any | null>(null);
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "upcoming" | "past">("upcoming");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 10;

  const fetchLiveAppointments = async () => {
    setLoading(true);
    try {
      let status_in = undefined;
      let date = undefined;
      const todayDate = new Date().toISOString().split("T")[0];

      if (timeFilter === "upcoming") {
        status_in = ["scheduled"];
      } else if (timeFilter === "past") {
        status_in = ["completed", "cancelled"];
      } else if (timeFilter === "today") {
        date = todayDate;
      }

      const queryParams: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
      };

      if (status_in) queryParams.status_in = status_in;
      if (date) queryParams.date = date;

      const res = await appointmentService.fetchAppointments(queryParams);

      if (res.success && Array.isArray(res.data)) {
        const list = res.data.map((app: any) => {
          const transformed = transformBackendAppointmentToFrontend(app);
          const baby = typeof app.babyId === "object" && app.babyId !== null ? app.babyId : {};
          const parent = typeof app.parentId === "object" && app.parentId !== null ? app.parentId : {};
          const doctor = typeof app.doctorId === "object" && app.doctorId !== null ? app.doctorId : {};

          return {
            ...transformed,
            fee: doctor.consultationFee || 500,
            patientAge: baby.ageInMonths ? `${baby.ageInMonths} Months` : "Pediatric",
            parentPhone: parent.phone || app.parentPhone || "N/A",
            rawBabyData: baby,
            rawParentData: parent,
          };
        });
        setLocalAppointments(list);
        setTotalAppointmentsCount((res as any).total || list.length);
      }
    } catch (err) {
      console.warn("Failed to fetch live appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAppointments();
  }, [currentPage, timeFilter]);

  const previousSearch = useRef(searchQuery);

  // Debounce search
  useEffect(() => {
    if (previousSearch.current === searchQuery) {
      return; // Skip on initial mount and strict mode re-runs
    }
    previousSearch.current = searchQuery;
    
    const delayDebounceFn = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to page 1 on new search, which will trigger fetch
      } else {
        fetchLiveAppointments();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Lock body scroll when any modal/drawer is open
  useEffect(() => {
    if (selectedMobileApt || selectedPatientModal || statusModalApt || editModalApt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMobileApt, selectedPatientModal, statusModalApt, editModalApt]);

  const handleOpenQuickAdd = () => {
    window.dispatchEvent(new CustomEvent("open-quick-add", { detail: { tab: "consultation" } }));
  };

  // Submit Status Change with reason
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalApt) return;
    if (statusSelection === "cancelled" && !cancellationReason.trim()) return;

    setIsSubmittingStatus(true);
    try {
      const extra = statusSelection === "cancelled" ? { cancellationReason: cancellationReason.trim() } : {};
      const res = await appointmentService.updateStatus(statusModalApt.id, statusSelection as any, extra);

      if (res.success || res.data) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === statusModalApt.id
              ? { ...a, status: (statusSelection.charAt(0).toUpperCase() + statusSelection.slice(1)) as any, ...extra }
              : a
          )
        );
        setLocalAppointments((prev) =>
          prev.map((a) =>
            a.id === statusModalApt.id
              ? { ...a, status: (statusSelection.charAt(0).toUpperCase() + statusSelection.slice(1)) as any, ...extra }
              : a
          )
        );
        setStatusModalApt(null);
        setCancellationReason("");
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Submit Edit Notes & Video Link
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalApt) return;

    setIsSubmittingEdit(true);
    try {
      const res = await appointmentService.updateAppointment(editModalApt.id, {
        doctorId: editModalApt.doctorId,
        babyId: editModalApt.patientId, // In frontend it's mapped to patientId
        date: editModalApt.date,
        time: editModalApt.time,
        doctorNotes: editNotes.trim(),
      });

      if (res.success || res.data) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === editModalApt.id
              ? { ...a, doctorNotes: editNotes.trim() }
              : a
          )
        );
        setLocalAppointments((prev) =>
          prev.map((a) =>
            a.id === editModalApt.id
              ? { ...a, doctorNotes: editNotes.trim() }
              : a
          )
        );
        setEditModalApt(null);
      }
    } catch (err) {
      console.error("Error saving appointment notes:", err);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Open Patient Profile Drawer
  const handleOpenPatientProfile = (apt: any) => {
    const fullPatient = patients.find((p) => p.id === apt.patientId) || {
      name: apt.patientName,
      avatar: apt.patientAvatar,
      age: apt.patientAge || "N/A",
      parentName: apt.parentName,
      phone: apt.parentPhone,
      gender: "Not specified",
      growthScore: "N/A",
    };
    setSelectedPatientModal(fullPatient);
  };

  // Server-side paginated appointments
  const paginatedAppointments = localAppointments;
  const totalPages = Math.max(1, Math.ceil(totalAppointmentsCount / ITEMS_PER_PAGE));

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      {/* 1. Page Header & Booking Trigger */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Appointments
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">
            <span className="hidden sm:inline">Real-time OPD & tele-consultation queue management dashboard</span>
            <span className="sm:hidden">Manage your appointments & queue</span>
          </p>
        </div>
      </div>

      {/* 2. Top Filter Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Time Filter Dropdown */}
        <div className="shrink-0 w-full sm:w-auto">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="w-full sm:min-w-[130px] pl-4 pr-9 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-sm focus:outline-none focus:border-[#1E4E70] cursor-pointer outline-none appearance-none transition-all"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.25em 1.25em',
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:max-w-xs md:max-w-sm shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or parent..."
            className="w-full bg-[#F8FAFC] border border-slate-200/80 text-xs font-medium text-slate-900 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-[#1E4E70] transition-colors"
          />
        </div>
      </div>

      {/* 3. Dashboard Table View (Matching Screenshot 1) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium space-y-2">
            <RefreshCw className="w-6 h-6 text-[#1E4E70] animate-spin mx-auto" />
            <p>Syncing appointment records from backend API...</p>
          </div>
        ) : paginatedAppointments.length === 0 ? (
          <div className="py-16 text-center space-y-3 p-6">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No appointments matching your current search and filter criteria.
            </p>
          </div>
        ) : (
          <>
          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Patient & Parent Profile</th>
                  <th className="py-4 px-4">Date & Time Slot</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Consultation Fee</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {paginatedAppointments.map((apt) => {
                  const rawStatus = (apt.status || "scheduled").toLowerCase();
                  let statusBadgeClass = "bg-sky-50 text-[#1E4E70] border-sky-200";
                  let statusText = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

                  if (rawStatus === "completed") {
                    statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
                  } else if (rawStatus === "cancelled") {
                    statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                  }

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Patient & Profile Click */}
                      <td className="py-3.5 px-5">
                        <Link
                          href={`/patients/${apt.patientId}?tab=profile`}
                          className="flex items-center gap-3 text-left group cursor-pointer"
                          title="Click to view complete patient profile file"
                        >
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200/80 relative shrink-0 bg-slate-100 group-hover:scale-105 transition-transform">
                            <Image
                              src={apt.patientAvatar || "/child_avatar_1.png"}
                              alt={apt.patientName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs group-hover:text-[#1E4E70] transition-colors flex items-center gap-1">
                              {apt.patientName}
                              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            <span className="text-[11px] text-slate-400 block font-normal">
                              Parent: {apt.parentName}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                          <Clock className="w-3.5 h-3.5 text-[#1E4E70] shrink-0" />
                          <span>{apt.date} • {apt.time}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {apt.parentPhone ? apt.parentPhone.slice(0, -4) + "XXXX" : "N/A"}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusBadgeClass}`}>
                          {statusText}
                        </span>
                      </td>

                      {/* Price / Fee */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{(apt as any).fee || 500}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedMobileApt(apt)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm shrink-0"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              setStatusModalApt(apt);
                              setStatusSelection(rawStatus);
                              setCancellationReason("");
                            }}
                            disabled={rawStatus === "cancelled"}
                            className="bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 shrink-0"
                          >
                            Modify Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col gap-4">
            {paginatedAppointments.map((apt) => {
              const rawStatus = (apt.status || "scheduled").toLowerCase();
              let statusBadgeClass = "bg-sky-50 text-[#1E4E70] border-sky-200";
              let statusText = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

              if (rawStatus === "completed") {
                statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
              } else if (rawStatus === "cancelled") {
                statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
              }

              return (
                <div key={apt.id} className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 p-4 transition-all">
                  {/* Top: Profile Info & Status */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex gap-3.5">
                      {/* Avatar with subtle ring */}
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shrink-0 ring-2 ring-slate-50">
                        <Image
                          src={apt.patientAvatar || "/child_avatar_1.png"}
                          alt={apt.patientName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      
                      {/* Patient Name & Parent Info */}
                      <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-slate-800 text-[15px] leading-tight mb-0.5 max-w-[140px] truncate">{apt.patientName}</h3>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> {apt.parentName}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusBadgeClass}`}>
                      {statusText}
                    </span>
                  </div>

                  {/* Appointment Details - Sleek horizontal row */}
                  <div className="flex items-center gap-3 bg-slate-50/80 rounded-xl p-3 mb-4 border border-slate-100">
                     <div className="flex-1 flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 rounded-full bg-blue-100/50 flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Schedule</span>
                          <span className="text-[11px] font-bold text-slate-700 truncate">{apt.date}, {apt.time}</span>
                        </div>
                     </div>
                     
                     <div className="w-px h-8 bg-slate-200 shrink-0"></div> {/* Divider */}
                     
                     <div className="flex items-center gap-2.5 shrink-0 pl-1">
                        <div className="w-7 h-7 rounded-full bg-emerald-100/50 flex items-center justify-center shrink-0">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="flex flex-col pr-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fee</span>
                          <span className="text-[11px] font-bold text-slate-700">{(apt as any).fee || 500}</span>
                        </div>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setSelectedMobileApt(apt)}
                      className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setStatusModalApt(apt);
                        setStatusSelection(rawStatus);
                        setCancellationReason("");
                      }}
                      disabled={rawStatus === "cancelled"}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:bg-slate-50"
                    >
                      Status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200/80 bg-slate-50/50 mt-4 rounded-b-xl">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {/* 4. PATIENT PROFILE SIDE DRAWER / MODAL */}
      {selectedPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between font-sans">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#A5D8FF] relative shrink-0 bg-slate-100">
                    <Image
                      src={selectedPatientModal.avatar || "/child_avatar_1.png"}
                      alt={selectedPatientModal.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedPatientModal.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Child Patient File</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPatientModal(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Basic Details Grid */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Patient Health Details
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Age</span>
                    <span className="font-bold text-slate-900">{selectedPatientModal.age || "1 Months"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Gender</span>
                    <span className="font-bold text-slate-900 capitalize">{selectedPatientModal.gender || "girl"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Parent Name</span>
                    <span className="font-bold text-slate-900">{selectedPatientModal.parentName || "Parent Account"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Phone Number</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedPatientModal.phone || "N/A"}</span>
                  </div>
                </div>

                {/* Additional Clinical Info */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1 text-xs">
                  <span className="font-bold text-emerald-900 block">Growth Score & WHO Status</span>
                  <p className="text-emerald-800 font-medium">
                    Growth Velocity: <span className="font-bold">{selectedPatientModal.growthScore || 90}/100</span> (WHO 50th Percentile Normal)
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPatientModal(null)}
              className="w-full bg-[#1E4E70] text-white font-semibold text-xs py-3 rounded-lg cursor-pointer hover:bg-[#153852] transition-colors"
            >
              Close Patient Profile
            </button>
          </div>
        </div>
      )}

      {/* 5. STATUS MODAL */}
      {statusModalApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setStatusModalApt(null)} />
          <form
            onSubmit={handleStatusSubmit}
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 font-sans relative z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#1E4E70]" />
                <h3 className="font-bold text-slate-900 text-sm">Modify Appointment Status</h3>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalApt(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Update status for <span className="font-bold text-slate-900">{statusModalApt.patientName}</span>.
            </p>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">Select Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["scheduled", "completed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusSelection(status)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border capitalize transition-colors cursor-pointer ${
                      statusSelection === status
                        ? "bg-[#1E4E70] text-white border-[#1E4E70]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {statusSelection === "cancelled" && (
              <div className="space-y-1.5 animate-fadeIn">
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
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStatusModalApt(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingStatus || (statusSelection === "cancelled" && !cancellationReason.trim())}
                className="px-4 py-2.5 text-xs font-semibold bg-[#1E4E70] hover:bg-[#153852] text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingStatus ? "Saving..." : "Save Status"}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* 6. EDIT NOTES MODAL */}
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

      {/* 7. MOBILE BOTTOM SHEET FOR APPOINTMENT DETAILS */}
      {selectedMobileApt && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center animate-fadeIn sm:p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedMobileApt(null)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-slideUp transform transition-transform max-h-[85vh] flex flex-col font-sans" onClick={e => e.stopPropagation()}>
            {/* Grab handle for bottom sheet effect */}
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
              {/* Patient Banner */}
              <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white relative shrink-0 ring-2 ring-slate-50">
                    <Image
                      src={selectedMobileApt.patientAvatar || "/child_avatar_1.png"}
                      alt={selectedMobileApt.patientName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-slate-900 text-[15px]">{selectedMobileApt.patientName}</h3>
                    <Link
                      href={`/patients/${selectedMobileApt.patientId}?tab=profile`}
                      className="text-[11px] text-[#1E4E70] font-bold hover:underline flex items-center gap-0.5 mt-0.5"
                    >
                      View Full File <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                {/* Status Badge moved to the top right of the banner */}
                <span className={`capitalize px-2.5 py-1 rounded-lg border text-[10px] font-bold shrink-0 ${
                  (selectedMobileApt.status || '').toLowerCase() === 'completed' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : (selectedMobileApt.status || '').toLowerCase() === 'cancelled'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-sky-50 text-[#1E4E70] border-sky-200'
                }`}>
                  {selectedMobileApt.status}
                </span>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date & Time */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-1.5 text-slate-400">
                     <Calendar className="w-3.5 h-3.5" />
                     <span className="text-[9px] font-bold uppercase tracking-wider">Schedule</span>
                  </div>
                  <div className="font-bold text-slate-800 text-[13px] leading-tight">
                    {selectedMobileApt.date}<br/>
                    <span className="text-[#1E4E70]">{selectedMobileApt.time}</span>
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 hover:border-slate-200 transition-colors flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-slate-400">
                     <IndianRupee className="w-3.5 h-3.5" />
                     <span className="text-[9px] font-bold uppercase tracking-wider">Consultation Fee</span>
                  </div>
                  <div className="font-bold text-emerald-600 text-[16px] leading-tight">
                    ₹{selectedMobileApt.fee || 500}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Parent & Phone */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100/50 flex items-center justify-center shrink-0">
                         <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Parent</span>
                        <span className="text-[13px] font-bold text-slate-800">{selectedMobileApt.parentName}</span>
                      </div>
                   </div>
                   {selectedMobileApt.parentPhone && (
                     <a href={`tel:${selectedMobileApt.parentPhone}`} className="w-9 h-9 rounded-full bg-emerald-100/50 flex items-center justify-center shrink-0 hover:bg-emerald-200/50 transition-colors" title="Call Parent">
                        <Phone className="w-4 h-4 text-emerald-600" />
                     </a>
                   )}
                </div>
                
                {/* Cancellation Reason */}
                {selectedMobileApt.status?.toLowerCase() === "cancelled" && selectedMobileApt.cancellationReason && (
                  <div className="flex flex-col p-3.5 bg-rose-50/50 rounded-2xl border border-rose-100 gap-1">
                     <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Cancellation Reason</span>
                     <span className="text-[13px] font-bold text-rose-700">{selectedMobileApt.cancellationReason}</span>
                  </div>
                )}
              </div>
              
              {selectedMobileApt.notes && (
                <div className="p-4 bg-[#FFFBEB]/50 border border-amber-100 rounded-2xl space-y-1.5">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5"><FileText className="w-3 h-3"/> Patient's Notes</span>
                  <p className="text-xs italic text-amber-900/80 font-medium leading-relaxed">{selectedMobileApt.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setSelectedMobileApt(null);
                    setStatusModalApt(selectedMobileApt);
                    setStatusSelection((selectedMobileApt.status || "scheduled").toLowerCase());
                    setCancellationReason("");
                  }}
                  disabled={(selectedMobileApt.status || "scheduled").toLowerCase() === "cancelled"}
                  className="w-full bg-slate-900 text-white font-bold text-[13px] py-3.5 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setSelectedMobileApt(null);
                    setEditModalApt(selectedMobileApt);
                    setEditNotes(selectedMobileApt.doctorNotes || "");
                  }}
                  className="w-full bg-white border border-slate-200/80 text-slate-700 font-bold text-[13px] py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-50"
                >
                  <Edit3 className="w-4 h-4 text-slate-500" /> Doctor Notes
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
