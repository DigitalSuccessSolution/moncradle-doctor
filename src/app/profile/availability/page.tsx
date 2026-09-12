"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  ToggleLeft,
  ToggleRight,
  Info,
  IndianRupee,
  Coffee
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { authService } from "@/services/authService";
import Swal from "sweetalert2";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

interface Shift {
  startTime: string;
  endTime: string;
  _id?: string;
}

interface DayAvailability {
  dayOfWeek: string;
  shifts: Shift[];
  isAvailable?: boolean;
}

interface DateException {
  date: string;
  status: "Leave" | "Custom Shifts";
  shifts: Shift[];
  reason?: string;
}

export default function AvailabilityManagerPage() {
  const router = useRouter();
  const { doctorProfile, updateDoctorProfile, isAuthenticated, setShowLoginModal } = useDoctorData();

  // Primary states
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([]);
  const [slotDuration, setSlotDuration] = useState<number>(30);
  const [consultationFee, setConsultationFee] = useState<number>(500);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<{ dIdx: number; sIdx: number; type: "start" | "end" } | null>(null);

  const format12Hour = (time24: string) => {
    if (!time24) return "";
    const [h, m] = time24.split(":");
    let hours = parseInt(h, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    if (hours > 12) hours -= 12;
    return `${hours}:${m} ${suffix}`;
  };

  // Initialize data from profile context
  useEffect(() => {
    if (doctorProfile) {
      // Map existing availability
      const existing = doctorProfile.availability || [];
      const initialized = DAYS_OF_WEEK.map((day) => {
        const found = existing.find(
          (d) => d.dayOfWeek.toLowerCase() === day.toLowerCase()
        );
        return {
          dayOfWeek: day,
          shifts: found && found.shifts.length > 0 ? found.shifts : [{ startTime: "09:00", endTime: "17:00" }],
          isAvailable: found ? found.shifts.length > 0 : false
        };
      });
      setWeeklyAvailability(initialized);
      
      if (doctorProfile.consultationFee) {
        setConsultationFee(doctorProfile.consultationFee);
      }
      if (doctorProfile.slotDuration) {
        setSlotDuration(doctorProfile.slotDuration);
      }
    }
  }, [doctorProfile]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl border border-slate-200 text-center space-y-4 font-sans animate-fadeIn my-12 shadow-sm">
        <div className="w-12 h-12 rounded-lg bg-[#A5D8FF]/30 text-[#1E4E70] mx-auto flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Login Required</h2>
        <p className="text-xs text-slate-500">
          Please sign in to your doctor account to configure your OPD timings.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="w-full bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs py-3 rounded-lg cursor-pointer transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Generate time options based on slot duration
  const generateTimeOptions = (interval: number) => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += interval) {
        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions(slotDuration);

  // Toggles day availability
  const handleToggleDay = (index: number) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, isAvailable: !day.isAvailable } : day
      )
    );
  };

  // Adds a shift to a day
  const handleAddShift = (dayIndex: number) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              shifts: [...day.shifts, { startTime: "09:00", endTime: "17:00" }]
            }
          : day
      )
    );
  };

  // Removes a shift from a day
  const handleRemoveShift = (dayIndex: number, shiftIndex: number) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const updatedShifts = day.shifts.filter((_, sIdx) => sIdx !== shiftIndex);
          return {
            ...day,
            shifts: updatedShifts.length > 0 ? updatedShifts : [{ startTime: "09:00", endTime: "12:00" }],
            isAvailable: updatedShifts.length > 0 ? day.isAvailable : false
          };
        }
        return day;
      })
    );
  };

  // Updates shift time
  const handleUpdateShiftTime = (
    dayIndex: number,
    shiftIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setWeeklyAvailability((prev) =>
      prev.map((day, i) => {
        if (i === dayIndex) {
          const updatedShifts = day.shifts.map((shift, sIdx) => {
            if (sIdx !== shiftIndex) return shift;
            
            const newShift = { ...shift, [field]: value };
            
            if (field === "startTime") {
              const startMins = parseInt(value.split(":")[0]) * 60 + parseInt(value.split(":")[1]);
              const endMins = parseInt(shift.endTime.split(":")[0]) * 60 + parseInt(shift.endTime.split(":")[1]);
              
              if (endMins <= startMins || endMins % slotDuration !== 0) {
                const newEnd = startMins + slotDuration;
                if (newEnd < 24 * 60) {
                  const hh = Math.floor(newEnd / 60).toString().padStart(2, "0");
                  const mm = (newEnd % 60).toString().padStart(2, "0");
                  newShift.endTime = `${hh}:${mm}`;
                }
              }
            }
            return newShift;
          });
          return { ...day, shifts: updatedShifts };
        }
        return day;
      })
    );
  };

  // Handles Slot Duration changes and auto-aligns all shifts
  const handleSlotDurationChange = (newDuration: number) => {
    setSlotDuration(newDuration);
    setWeeklyAvailability((prev) => 
      prev.map(day => ({
        ...day,
        shifts: day.shifts.map(shift => {
          let newStart = shift.startTime;
          let newEnd = shift.endTime;
          
          const startMins = parseInt(newStart.split(":")[0]) * 60 + parseInt(newStart.split(":")[1]);
          if (startMins % newDuration !== 0) {
             const snappedStart = Math.floor(startMins / newDuration) * newDuration;
             newStart = `${Math.floor(snappedStart / 60).toString().padStart(2, "0")}:${(snappedStart % 60).toString().padStart(2, "0")}`;
          }

          const endMins = parseInt(newEnd.split(":")[0]) * 60 + parseInt(newEnd.split(":")[1]);
          const newStartMins = parseInt(newStart.split(":")[0]) * 60 + parseInt(newStart.split(":")[1]);

          if (endMins <= newStartMins || endMins % newDuration !== 0) {
             const snappedEnd = newStartMins + newDuration;
             if (snappedEnd >= 24 * 60) {
               newEnd = "23:59";
             } else {
               newEnd = `${Math.floor(snappedEnd / 60).toString().padStart(2, "0")}:${(snappedEnd % 60).toString().padStart(2, "0")}`;
             }
          }
          
          return { ...shift, startTime: newStart, endTime: newEnd };
        })
      }))
    );
  };

  // Save timing data to backend & local context
  const handleSave = async () => {
    setIsSubmitting(true);

    // Build API-compliant availability array
    const formattedAvailability = weeklyAvailability
      .filter((day) => day.isAvailable && day.shifts.length > 0)
      .map((day) => ({
        dayOfWeek: day.dayOfWeek,
        shifts: day.shifts.map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime
        }))
      }));

    const updatePayload = {
      availability: formattedAvailability,
      consultationFee: Number(consultationFee),
      slotDuration: Number(slotDuration),
      // Custom exceptions stored locally or passed as metadata
      clinicName: doctorProfile?.hospital,
      clinicAddress: doctorProfile?.clinicAddress
    };

    try {
      await authService.updateProfile(updatePayload);
      updateDoctorProfile({
        availability: formattedAvailability,
        consultationFee: Number(consultationFee),
        slotDuration: Number(slotDuration),
        availableHours: formattedAvailability.length > 0 
          ? `${formattedAvailability[0].shifts[0].startTime} - ${formattedAvailability[0].shifts[0].endTime}`
          : "Not Available"
      });

      Swal.fire({
        icon: "success",
        title: "OPD Schedule Saved Successfully!",
        text: "Your availability rules and calendar configuration have been synchronized.",
        confirmButtonColor: "#1E4E70",
        timer: 3000,
        timerProgressBar: true
      });
    } catch (err) {
      console.warn("Failed to update profile timings:", err);
      
      updateDoctorProfile({
        availability: formattedAvailability,
        consultationFee: Number(consultationFee),
        slotDuration: Number(slotDuration)
      });

      Swal.fire({
        icon: "warning",
        title: "Saved Locally",
        text: "Failed to sync availability with backend. Saved changes locally.",
        confirmButtonColor: "#1E4E70",
        timer: 3000,
        timerProgressBar: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            OPD Availability & Slot Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Set weekly timings, slot duration, and date exceptions.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="hidden sm:flex bg-[#1E4E70] hover:bg-[#153852] disabled:bg-slate-300 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 shadow-sm"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isSubmitting ? "Saving..." : "Save Availability"}</span>
        </button>
      </div>

      {/* TWO PANEL COLUMNS: LEFT = WEEKLY TIMINGS, RIGHT = SLOTS & DATES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: WEEKLY DAY SCHEDULES (8 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4.5 h-4.5 text-[#1E4E70]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Weekly OPD Timings
              </h3>
            </div>

            <div className="space-y-4">
              {weeklyAvailability.map((day, dIdx) => {
                const isDayActive = activeDropdown?.dIdx === dIdx;
                return (
                <div key={day.dayOfWeek} className={`border-b border-slate-100 pb-5 last:border-0 last:pb-0 space-y-4 relative ${isDayActive ? "z-50" : "z-10"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-2.5">
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-bold text-slate-800">
                          {day.dayOfWeek}
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-500">
                          {day.isAvailable ? "Accepting appointments" : "Closed / Off duty"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleDay(dIdx)}
                        className="text-[#1E4E70] transition-colors focus:outline-none shrink-0"
                      >
                        {day.isAvailable ? (
                          <ToggleRight className="w-10 h-10 text-[#1E4E70] fill-[#1E4E70]/10" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-slate-400" />
                        )}
                      </button>
                    </div>

                    {day.isAvailable && (
                      <button
                        type="button"
                        onClick={() => handleAddShift(dIdx)}
                        className="w-full sm:w-auto text-xs sm:text-sm font-bold text-[#1E4E70] hover:text-[#153852] bg-[#A5D8FF]/30 border border-[#A5D8FF]/60 px-4 py-2 sm:py-1.5 rounded-xl flex items-center justify-center gap-1.5 hover:scale-95 transition-all mt-2 sm:mt-0"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add Shift</span>
                      </button>
                    )}
                  </div>

                  {/* SHIFTS CONFIGURATIONS */}
                  {day.isAvailable && (
                    <div className="bg-[#F8FAFC] p-3 sm:p-4 rounded-xl border border-slate-200/60 space-y-3">
                      {day.shifts.map((shift, sIdx) => {
                        const isShiftActive = isDayActive && activeDropdown?.sIdx === sIdx;
                        return (
                        <div key={sIdx} className={`flex items-center gap-1.5 sm:gap-3 w-full animate-fadeIn relative ${isShiftActive ? "z-50" : "z-10"}`}>
                          {/* Start Time */}
                          <div className={`relative flex-1 min-w-0 ${isShiftActive && activeDropdown?.type === "start" ? "z-50" : "z-10"}`}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown?.dIdx === dIdx && activeDropdown?.sIdx === sIdx && activeDropdown?.type === "start" ? null : { dIdx, sIdx, type: "start" });
                              }}
                              className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white px-2 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98] focus:outline-none"
                            >
                              <div className="hidden sm:flex w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 items-center justify-center shrink-0">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                              </div>
                              <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase tracking-wider">Start</span>
                              <span className="text-[11px] sm:text-sm font-bold text-slate-800 flex-1 text-center sm:text-left whitespace-nowrap">
                                {format12Hour(shift.startTime)}
                              </span>
                            </button>
                            
                            {activeDropdown?.dIdx === dIdx && activeDropdown?.sIdx === sIdx && activeDropdown?.type === "start" && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} />
                                <div className="absolute top-full left-0 mt-2 w-full max-h-48 overflow-y-auto overscroll-contain touch-pan-y bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-fadeIn">
                                  {!timeOptions.includes(shift.startTime) && (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateShiftTime(dIdx, sIdx, "startTime", shift.startTime);
                                        setActiveDropdown(null);
                                      }}
                                      className="px-3 py-2.5 text-xs sm:text-sm cursor-pointer bg-emerald-50 text-emerald-700 font-bold whitespace-nowrap"
                                    >
                                      {format12Hour(shift.startTime)}
                                    </div>
                                  )}
                                  {timeOptions.map((time) => (
                                    <div
                                      key={time}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateShiftTime(dIdx, sIdx, "startTime", time);
                                        setActiveDropdown(null);
                                      }}
                                      className={`px-3 py-2.5 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap ${shift.startTime === time ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-700 font-medium"}`}
                                    >
                                      {format12Hour(time)}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* End Time */}
                          <div className={`relative flex-1 min-w-0 ${isShiftActive && activeDropdown?.type === "end" ? "z-50" : "z-10"}`}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown?.dIdx === dIdx && activeDropdown?.sIdx === sIdx && activeDropdown?.type === "end" ? null : { dIdx, sIdx, type: "end" });
                              }}
                              className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-white px-2 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98] focus:outline-none"
                            >
                              <div className="hidden sm:flex w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-100 items-center justify-center shrink-0">
                                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-600" />
                              </div>
                              <span className="hidden sm:inline text-xs font-semibold text-slate-500 uppercase tracking-wider">End</span>
                              <span className="text-[11px] sm:text-sm font-bold text-slate-800 flex-1 text-center sm:text-left whitespace-nowrap">
                                {format12Hour(shift.endTime)}
                              </span>
                            </button>
                            
                            {activeDropdown?.dIdx === dIdx && activeDropdown?.sIdx === sIdx && activeDropdown?.type === "end" && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} />
                                <div className="absolute top-full left-0 mt-2 w-full max-h-48 overflow-y-auto overscroll-contain touch-pan-y bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-fadeIn">
                                  {!timeOptions.includes(shift.endTime) && (
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateShiftTime(dIdx, sIdx, "endTime", shift.endTime);
                                        setActiveDropdown(null);
                                      }}
                                      className="px-3 py-2.5 text-xs sm:text-sm cursor-pointer bg-rose-50 text-rose-700 font-bold whitespace-nowrap"
                                    >
                                      {format12Hour(shift.endTime)}
                                    </div>
                                  )}
                                  {timeOptions.map((time) => (
                                    <div
                                      key={time}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpdateShiftTime(dIdx, sIdx, "endTime", time);
                                        setActiveDropdown(null);
                                      }}
                                      className={`px-3 py-2.5 text-xs sm:text-sm cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap ${shift.endTime === time ? "bg-rose-50 text-rose-700 font-bold" : "text-slate-700 font-medium"}`}
                                    >
                                      {format12Hour(time)}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveShift(dIdx, sIdx)}
                            className="p-2 sm:p-3 bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl sm:rounded-2xl transition-colors shrink-0 active:scale-95 flex items-center justify-center"
                            title="Remove Shift"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLOT DURATIONS & CALENDAR DATE EXCEPTIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SLOT DURATION & CON-FEE CARD */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Info className="w-4.5 h-4.5 text-[#1E4E70]" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Slot Configuration
              </h3>
            </div>

            <div className="space-y-4">
              {/* Consultation Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Consultation Slot Duration*
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 30, 45].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleSlotDurationChange(mins)}
                      className={`text-xs py-2.5 rounded-xl border font-bold transition-all text-center cursor-pointer ${
                        slotDuration === mins
                          ? "bg-[#1E4E70] text-white border-[#1E4E70] shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#1E4E70]"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Consultation Fee (₹)*
                </label>
                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-3.5 py-3 rounded-lg focus-within:ring-2 focus-within:ring-[#1E4E70] focus-within:bg-white transition-all">
                  <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="number"
                    required
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(Number(e.target.value))}
                    placeholder="500"
                    className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR FOR SAVE BUTTON */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-40 pb-safe">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full bg-[#1E4E70] hover:bg-[#153852] disabled:bg-slate-300 text-white text-base font-bold px-5 py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-[#1E4E70]/20"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{isSubmitting ? "Saving..." : "Save Availability"}</span>
        </button>
      </div>

    </div>
  );
}
