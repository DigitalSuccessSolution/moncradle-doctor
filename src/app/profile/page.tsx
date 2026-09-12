"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Utensils,
  Activity,
  FileText,
  Edit3,
  BarChart3,
  ShieldAlert,
  ChevronRight,
  Contact,
  Shield,
  HelpCircle,
  LogOut,
  FileCode,
  Lock,
  LogIn,
  Stethoscope,
  Pencil,
  UserCheck,
  Building,
  Phone,
  Mail,
  Award,
  Star,
  Calendar,
  LayoutDashboard,
  Users,
  CalendarDays,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function ProfilePage() {
  const { isAuthenticated, logout, setShowLoginModal, login, doctorProfile, isProfileComplete } = useDoctorData();
  const [ratingInfo, setRatingInfo] = useState({ average: 5.0, count: 0 });
  const router = useRouter();


  useEffect(() => {
    if (isAuthenticated) {
      reviewService.getReviews().then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const total = res.data.reduce((acc, r) => acc + (r.rating || 5), 0);
          setRatingInfo({
            average: parseFloat((total / res.data.length).toFixed(1)),
            count: res.data.length
          });
        }
      }).catch(() => { });
    }
  }, [isAuthenticated]);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-24 font-sans">
      <div className="space-y-6">
        {/* HEADER SECTION: GUEST VS LOGGED IN */}
        {!isAuthenticated ? (
          <div className="bg-gradient-to-br from-[#1E4E70] via-[#163B54] to-[#0F2A3D] text-white rounded-xl p-6 sm:p-7 shadow-lg border border-sky-400/20 relative overflow-hidden space-y-5">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#A5D8FF]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-md text-[#A5D8FF] flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                <Stethoscope className="w-6 h-6 text-[#A5D8FF]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug">
                  Guest Doctor Portal Access
                </h2>
                <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-normal">
                  Sign in to access patient charts, WHO growth analytics & e-prescriptions.
                </p>
              </div>
            </div>

            <div className="pt-1 relative z-10">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm py-3.5 px-5 rounded-lg shadow-md uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>LOG IN / SIGN UP</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-slate-900 to-[#1E4E70] text-white rounded-xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#A5D8FF] shadow-xs relative shrink-0 bg-slate-100 flex items-center justify-center">
                  <Image
                    src={doctorProfile.avatar || "/doctor_female.png"}
                    alt={doctorProfile.fullName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white truncate">
                      {doctorProfile.fullName}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-[#A5D8FF] shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-sky-200 truncate">
                    {doctorProfile.title}
                  </p>
                  <p className="text-[11px] text-slate-300 truncate">
                    License: <span className="font-semibold text-white">{doctorProfile.licenseNumber}</span> • {doctorProfile.experience}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= Math.round(ratingInfo.average) ? "fill-amber-400 text-amber-400" : "text-slate-500"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-white ml-0.5">{ratingInfo.average}</span>
                    <span className="text-slate-300 font-normal">({ratingInfo.count} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A5D8FF]/20 hover:bg-[#A5D8FF]/35 text-[#A5D8FF] text-xs font-semibold transition-all cursor-pointer border border-[#A5D8FF]/40 shadow-2xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-semibold transition-all cursor-pointer border border-white/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Quick Profile Info Pills */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              <div className="flex items-center gap-2 truncate">
                <Building className="w-3.5 h-3.5 text-[#A5D8FF] shrink-0" />
                <span className="truncate">{doctorProfile.hospital}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Phone className="w-3.5 h-3.5 text-[#A5D8FF] shrink-0" />
                <span className="truncate">{doctorProfile.phone} • {doctorProfile.availableHours}</span>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="pt-3 border-t border-white/10">
              {(() => {
                const fieldsToCheck = [
                  doctorProfile.fullName,
                  doctorProfile.email,
                  doctorProfile.phone,
                  doctorProfile.specialization,
                  doctorProfile.licenseNumber,
                  doctorProfile.hospital,
                  doctorProfile.clinicAddress,
                  doctorProfile.city,
                  doctorProfile.experience,
                  doctorProfile.consultationFee,
                  doctorProfile.about,
                ];
                const filled = fieldsToCheck.filter(f => f && String(f).trim() !== '' && f !== 0).length;
                const percent = Math.round((filled / fieldsToCheck.length) * 100);
                const isComplete = percent === 100;

                return isComplete ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-[#34C759] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Profile Complete</span>
                      <span className="text-white">100%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-[#34C759] h-1.5 rounded-full w-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-amber-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Profile Incomplete</span>
                      <span className="text-white">{percent}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* UNIFIED MENU LIST */}
        <div className="pt-2">
          <div className="divide-y divide-slate-200/60">
            {isAuthenticated ? (
              <>
                <Link
                  href="/notifications"
                  className="p-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 hover:text-[#1E4E70] hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#FF3B30] flex items-center justify-center shrink-0 shadow-2xs">
                      <Bell className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="truncate font-semibold text-slate-800">Notifications</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4E70] shrink-0" />
                </Link>

                <Link
                  href="/prescriptions"
                  className="p-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 hover:text-[#1E4E70] hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#AF52DE] flex items-center justify-center shrink-0 shadow-2xs">
                      <FileText className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="truncate font-semibold text-slate-800">Prescriptions</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4E70] shrink-0" />
                </Link>
                <Link
                  href="/reports"
                  className="p-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 hover:text-[#1E4E70] hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#30B0C7] flex items-center justify-center shrink-0 shadow-2xs">
                      <BarChart3 className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="truncate font-semibold text-slate-800">Reports</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4E70] shrink-0" />
                </Link>

                <Link
                  href="/profile/availability"
                  className="p-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 hover:text-[#1E4E70] hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-amber-500 flex items-center justify-center shrink-0 shadow-2xs">
                      <Calendar className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="truncate font-semibold text-slate-800">OPD Availability</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4E70] shrink-0" />
                </Link>

                <Link
                  href="/support"
                  className="p-3.5 flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-[#1E4E70] hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#007AFF] flex items-center justify-center shrink-0 shadow-2xs">
                      <Contact className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                    </div>
                    <span className="truncate font-semibold text-slate-800">Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4E70] shrink-0" />
                </Link>
              </>
            ) : (
              [
                { title: "Notifications", icon: Bell, bg: "bg-[#FF3B30]" },
                { title: "Prescriptions", icon: FileText, bg: "bg-[#AF52DE]" },
                { title: "Reports", icon: BarChart3, bg: "bg-[#30B0C7]" },
                { title: "OPD Availability", icon: Calendar, bg: "bg-amber-500" },
                { title: "Support", icon: Contact, bg: "bg-[#007AFF]" }
              ].map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={i}
                    onClick={() => setShowLoginModal(true)}
                    className="w-full p-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 hover:text-[#1E4E70] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-[9px] ${item.bg} flex items-center justify-center shrink-0 shadow-2xs`}>
                        <IconComponent className="w-4.5 h-4.5 text-white stroke-[2.2]" />
                      </div>
                      <span className="truncate font-semibold text-slate-800">{item.title}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1E4E70] bg-[#A5D8FF]/30 px-2.5 py-0.5 rounded-full border border-[#A5D8FF]/60 flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Lock className="w-3 h-3 text-[#1E4E70]" />
                      <span>Unlock</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col items-center justify-center gap-4 pt-12 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-medium text-slate-400">
          <Link href="/privacy-policy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <span className="text-slate-300">•</span>
          <Link href="/terms-of-service" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <span className="text-slate-300">•</span>
          <Link href="/partner-program" className="hover:text-slate-600 transition-colors">Doctor Partner Program</Link>
          <span className="text-slate-300">•</span>
          <Link href="/faqs" className="hover:text-slate-600 transition-colors">Clinical FAQs</Link>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Designed and developed by <a href="https://digitalsuccesssolutions.in/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">Digital Success Solutions</a>
        </div>
      </div>
    </div>
  );
}
