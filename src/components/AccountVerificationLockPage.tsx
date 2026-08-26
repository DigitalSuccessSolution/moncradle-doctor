"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  RefreshCw,
  ShieldCheck,
  Building,
  User,
  BriefcaseMedical,
  Mail,
  ChevronRight,
  Loader2,
  Clock
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { authService } from "@/services/authService";

export default function AccountVerificationLockPage() {
  const {
    doctorProfile,
    approvalStatus,
    setApprovalStatus,
    logout,
  } = useDoctorData();

  const [checking, setChecking] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  /**
   * Check Approval Status
   */
  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMessage(null);

    try {
      const res: any = await authService.fetchProfile();
      setChecking(false);

      const user = res.user || res.data?.user;
      const profile = res.profile || res.data?.profile || res.data;
      const vStatus = profile?.verificationStatus || user?.verificationStatus || user?.approvalStatus;

      const approved = vStatus === "approved" || vStatus === "verified";

      if (approved) {
        setApprovalStatus("approved");
        try {
          localStorage.setItem("moncradle_doctor_approval_status", "approved");
        } catch (e) {}
        setStatusMessage("🎉 Congratulations! Your doctor verification is approved! Unlocking panel...");
      } else {
        setStatusMessage(`Verification Status: ${vStatus || "pending"}. Account is currently under review.`);
      }
    } catch (err) {
      setChecking(false);
      setStatusMessage("Verification Status: pending (Under Review by Admin).");
    }
  };

  React.useEffect(() => {
    handleCheckStatus();
  }, []);

  if (checking && !statusMessage) {
    return (
      <div className="h-[100dvh] w-full bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-[#1E4E70] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Verifying Credentials</h2>
        <p className="text-sm text-slate-500 mt-2">Please wait a moment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#E0F2FE] font-sans flex flex-col selection:bg-blue-100 overflow-x-hidden overflow-y-auto relative">
      
      {/* Premium Background Glows */}
      <div className="absolute top-[-10%] right-[10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[40vw] h-[40vw] bg-sky-300/20 rounded-full blur-[120px] pointer-events-none" />
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      {/* Top Header */}
      <header className="w-full bg-white/30 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 relative z-20 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/complete-logo.png"
            alt="Moncradle"
            width={180}
            height={48}
            className="h-9 sm:h-11 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 font-semibold text-[10px] sm:text-sm rounded-full border border-slate-200 shadow-sm transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-start text-center pt-2 pb-4 sm:py-6 relative z-10">
        
        {/* Shield Icon with glowing rings */}
        <div className="relative mb-3 sm:mb-4">
          <div className="absolute inset-0 bg-blue-300 rounded-full animate-ping opacity-30" style={{ animationDuration: '3s' }}></div>
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-[#1E4E70] rounded-full flex items-center justify-center relative z-10 border-[3px] sm:border-4 border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] mx-auto">
            <ShieldCheck className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-sm" strokeWidth={2} />
          </div>
        </div>

        {/* Pending Approval Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-50/90 backdrop-blur-sm border border-amber-200/60 text-amber-700 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3 shadow-sm">
          <Clock className="w-3 h-3 text-amber-500" />
          Under Review
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-[#1E4E70]">
          Verification in Progress
        </h1>
        
        <p className="text-slate-500 text-xs sm:text-[14px] max-w-md mx-auto leading-relaxed mb-5 sm:mb-6 px-2">
          Our medical board is currently reviewing your profile to ensure a trusted clinical environment.
        </p>

        {/* Unified Premium Dashboard Card */}
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgb(0,0,0,0.06)] flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Submitted Details */}
          <div className="flex-1 p-4 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200/50 bg-white/50 text-left flex flex-col justify-center">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E4E70]" />
                Submitted Details
              </h3>
              <span className="text-[9px] sm:text-[10px] font-bold bg-white border border-slate-200 shadow-sm text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">Read Only</span>
            </div>

            <div className="grid grid-cols-2 gap-y-5 sm:gap-y-6 gap-x-4 sm:gap-x-8">
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" /> Name
                </span>
                <span className="font-bold text-slate-800 text-[13px] sm:text-[15px] truncate">
                  {doctorProfile.fullName || "Dr. John Doe"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" /> License
                </span>
                <span className="font-bold text-slate-800 text-[13px] sm:text-[15px] truncate">
                  {doctorProfile.licenseNumber || "MED-XXXX"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <BriefcaseMedical className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" /> Specialty
                </span>
                <span className="font-bold text-slate-800 text-[13px] sm:text-[15px] truncate">
                  {doctorProfile.specialization || "Pediatrician"}
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 sm:gap-1.5">
                  <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" /> Clinic
                </span>
                <span className="font-bold text-slate-800 text-[13px] sm:text-[15px] truncate">
                  {doctorProfile.hospital || "Moncradle Care Hub"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Next Steps & Actions */}
          <div className="w-full md:w-[340px] lg:w-[380px] p-4 sm:p-8 flex flex-col justify-between bg-slate-50/50">
            
            {/* Timeline */}
            <div className="text-left mb-4 sm:mb-8">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3 sm:mb-5">What happens next?</h4>
              <div className="relative pl-3 border-l-2 border-slate-200 space-y-3 sm:space-y-5">
                <div className="relative">
                  <div className="absolute -left-[17px] sm:-left-[18px] top-0.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 ring-2 sm:ring-4 ring-[#F8FAFC]"></div>
                  <h5 className="text-[10px] sm:text-xs font-bold text-slate-800 leading-none">Profile Submitted</h5>
                </div>
                <div className="relative">
                  <div className="absolute -left-[17px] sm:-left-[18px] top-0.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400 ring-2 sm:ring-4 ring-[#F8FAFC] animate-pulse"></div>
                  <h5 className="text-[10px] sm:text-xs font-bold text-amber-700 leading-none">Under Review</h5>
                </div>
                <div className="relative">
                  <div className="absolute -left-[17px] sm:-left-[18px] top-0.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-300 ring-2 sm:ring-4 ring-[#F8FAFC]"></div>
                  <h5 className="text-[10px] sm:text-xs font-bold text-slate-400 leading-none">Access Granted</h5>
                </div>
              </div>
            </div>

            {/* Actions Box */}
            <div className="mt-auto">
              {statusMessage && (
                <div className="w-full bg-white border border-amber-200/50 text-amber-800 text-[11px] sm:text-xs px-3 py-2.5 rounded-xl mb-3 sm:mb-4 font-medium flex items-start gap-1.5 sm:gap-2 text-left shadow-sm">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                  <span className="leading-snug">{statusMessage}</span>
                </div>
              )}

              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
                <button
                  onClick={handleCheckStatus}
                  disabled={checking}
                  className="flex-1 bg-gradient-to-b from-[#1E4E70] to-[#153852] hover:from-[#153852] hover:to-[#0f293e] text-white font-semibold text-[11px] sm:text-xs py-2.5 sm:py-3 px-2 rounded-xl shadow-[0_4px_12px_rgba(30,78,112,0.25)] transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
                  <span>{checking ? "Checking" : "Refresh"}</span>
                </button>

                <Link
                  href="/profile/edit"
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] sm:text-xs py-2.5 sm:py-3 px-2 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 group"
                >
                  <span>Edit Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-3 sm:py-4 shrink-0 text-center text-[9px] sm:text-xs font-medium text-slate-400 flex justify-center items-center gap-1 z-20 relative">
        <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        Help? Contact <a href="mailto:support@moncradle.com" className="text-slate-500 hover:text-[#1E4E70] transition-colors">support@moncradle.com</a>
      </footer>

    </div>
  );
}
