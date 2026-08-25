"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  CheckCircle2,
  Edit3,
  LogOut,
  RefreshCw,
  HeartPulse,
  Award,
  FileCheck,
  Mail,
  ShieldAlert,
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
   * Check Approval Status by calling GET /api/users/profile
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
        setStatusMessage("🎉 Congratulations! Your doctor verification is approved by Admin! Unlocking panel...");
      } else {
        setStatusMessage(`Verification Status: "${vStatus || "pending"}". Account is under review by Admin.`);
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
      <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center font-sans">
        <RefreshCw className="w-10 h-10 text-[#1E4E70] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Verifying Credentials...</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Checking live status with Admin Desk</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#F0F7FF] flex flex-col justify-between font-sans relative">
      {/* Top App Header */}
      <header className="w-full bg-white md:bg-white/90 backdrop-blur-md border-b border-blue-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <Link href="/" className="flex items-center">
          <Image
            src="/complete-logo.png"
            alt="Moncradle"
            width={150}
            height={41}
            className="h-9 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md md:max-w-4xl mx-auto md:px-4 md:py-10 flex flex-col justify-start md:justify-center bg-white md:bg-transparent">
        <div className="bg-white md:rounded-[32px] overflow-hidden md:border border-blue-100/80 md:shadow-2xl flex flex-col md:flex-row items-stretch md:animate-scaleUp h-full">
          
          {/* Left Side (Visuals) */}
          <div className="md:w-5/12 bg-gradient-to-b from-slate-50 to-[#E8F3FF] border-b md:border-b-0 md:border-r border-blue-100/50 p-8 md:p-10 flex flex-col items-center justify-center text-center relative">
            <div className="relative mx-auto w-32 h-32 md:w-48 md:h-48 shrink-0 mb-6 rounded-xl overflow-hidden shadow-lg border-[4px] border-white ring-4 ring-blue-50/50">
              <Image
                src="/verification-illustration.jpg"
                alt="Verification in Progress"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Pending Approval</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
              Under Review
            </h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-3 hidden md:block">
              Your credentials are being verified by our medical board to ensure a trusted clinical environment.
            </p>
          </div>

          {/* Right Side (Content & Actions) */}
          <div className="md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-6">
            
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Account Verification in Progress
              </h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Your Doctor Profile & Medical Credentials have been submitted successfully. Your account is currently under review by the MONCRADLE Medical Verification Board.
              </p>
            </div>

            {/* Submitted Clinical Credentials Summary Box */}
            <div className="bg-[#F8F9FA] rounded-lg p-5 border border-slate-200/80 text-left space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Award className="w-5 h-5 text-[#1E4E70] shrink-0" />
                <h4 className="font-bold text-slate-800 text-sm">
                  Submitted Clinical Credentials
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
                    Doctor Name
                  </span>
                  <span className="font-semibold text-slate-900 text-sm block break-words">
                    {doctorProfile.fullName || "Dr. Johns Doe"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
                    Medical License
                  </span>
                  <span className="font-semibold text-slate-900 text-sm block break-words">
                    {doctorProfile.licenseNumber || "MED-884920"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
                    Specialization
                  </span>
                  <span className="font-semibold text-slate-900 text-sm block break-words">
                    {doctorProfile.specialization || "Pediatrician"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider block">
                    Clinic / Hospital
                  </span>
                  <span className="font-semibold text-slate-900 text-sm block break-words">
                    {doctorProfile.hospital || "Moncradle Care Hub"}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Status Message Notification Banner */}
            {statusMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-4 rounded-xl animate-fadeIn font-medium text-left shadow-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Action CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleCheckStatus}
                disabled={checking}
                className="w-full bg-[#1E4E70] hover:bg-[#153852] text-white font-bold text-sm sm:text-base py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <RefreshCw className={`w-5 h-5 ${checking ? "animate-spin" : ""}`} />
                <span>{checking ? "Checking Approval Status..." : "CHECK APPROVAL STATUS"}</span>
              </button>

              <Link
                href="/profile/edit"
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm py-3 px-4 rounded-xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Edit3 className="w-4 h-4 text-[#1E4E70] shrink-0" />
                <span>Edit Credentials</span>
              </Link>
            </div>

            {/* Support Email Notice */}
            <p className="text-xs sm:text-sm text-slate-500 font-medium pt-2 text-center md:text-left">
              Need urgent assistance? Contact board at{" "}
              <a href="mailto:support@moncradle.com" className="text-[#1E4E70] font-bold hover:underline">
                support@moncradle.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 text-center text-[11px] text-slate-400 font-medium border-t border-slate-200/60 bg-white/50">
        © {new Date().getFullYear()} MONCRADLE Pediatrics • Verified Clinical Environment
      </footer>
    </div>
  );
}
