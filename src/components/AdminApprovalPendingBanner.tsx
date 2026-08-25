"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Clock, CheckCircle2, Edit, Sparkles } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function AdminApprovalPendingBanner() {
  const { isAuthenticated, isProfileComplete, approvalStatus, setApprovalStatus } = useDoctorData();

  if (!isAuthenticated || !isProfileComplete || approvalStatus === "approved") {
    return null;
  }

  return (
    <div className="bg-amber-500/10 border-2 border-amber-400/40 rounded-xl p-5 sm:p-6 mb-6 font-sans animate-fadeIn relative overflow-hidden shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 border border-amber-400/30">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-amber-900 text-sm sm:text-base">
                Account Verification Pending
              </h3>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Under Admin Review
              </span>
            </div>

            <p className="text-xs text-amber-800 font-medium leading-relaxed max-w-2xl">
              Your Doctor Profile & Medical Credentials have been submitted successfully! Your account is currently under review by the MONCRADLE Medical Verification Board. Full clinical access will be activated upon admin approval.
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto shrink-0 pt-2 sm:pt-0">
          <Link
            href="/profile/edit"
            className="flex-1 sm:flex-initial bg-white hover:bg-amber-50 text-amber-900 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5 text-amber-700" />
            <span>Edit Credentials</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
