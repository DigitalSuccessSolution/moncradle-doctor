"use client";

import { User, Phone, Mail, MapPin, HeartPulse } from "lucide-react";
import { Patient, maskPhoneNumber } from "@/types";

interface ProfileTabProps {
  patient: Patient;
}

export default function ProfileTab({ patient }: ProfileTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Key stats cards */}
      <div className="lg:col-span-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50/50 p-5 sm:p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E4E70]/10 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-[#1E4E70]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
                  Clinical Health Summary
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Comprehensive overview of patient's physical metrics and conditions</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Primary Health Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Medical Condition
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {patient.medicalCondition || "Healthy growth & progress"}
                </p>
              </div>
              <div className="sm:border-l sm:border-slate-100 sm:pl-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Dietary Plan
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {patient.diet || "Standard feeding routine"}
                </p>
              </div>
              <div className="sm:border-l sm:border-slate-100 sm:pl-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  Allergies
                </p>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {patient.allergies.map((allergy, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-rose-50 text-rose-700 text-xs font-semibold">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-500">None reported</p>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-violet-50/80 hover:bg-violet-100/80 transition-colors rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-violet-500/80 uppercase tracking-wider">Gender</p>
                <p className="text-lg sm:text-xl font-extrabold text-violet-900 tracking-tight capitalize">
                  {patient.gender || "N/A"}
                </p>
              </div>
              
              <div className="bg-sky-50/80 hover:bg-sky-100/80 transition-colors rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-sky-500/80 uppercase tracking-wider">Age</p>
                <p className="text-lg sm:text-xl font-extrabold text-sky-900 tracking-tight">
                  {patient.ageInMonths !== undefined ? `${patient.ageInMonths} Mo` : "N/A"}
                </p>
              </div>

              <div className="bg-[#A5D8FF]/20 hover:bg-[#A5D8FF]/30 transition-colors rounded-xl p-4 space-y-1 md:col-span-2">
                <p className="text-[10px] font-bold text-[#1E4E70]/70 uppercase tracking-wider">DOB</p>
                <p className="text-lg sm:text-xl font-extrabold text-[#1E4E70] tracking-tight">
                  {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                </p>
              </div>

              <div className="bg-emerald-50/80 hover:bg-emerald-100/80 transition-colors rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-wider">Weight</p>
                <p className="text-lg sm:text-xl font-extrabold text-emerald-900 tracking-tight">
                  {patient.weight ? `${patient.weight} kg` : "N/A"}
                </p>
              </div>

              <div className="bg-teal-50/80 hover:bg-teal-100/80 transition-colors rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-teal-500/80 uppercase tracking-wider">Height</p>
                <p className="text-lg sm:text-xl font-extrabold text-teal-900 tracking-tight">
                  {patient.height ? `${patient.height} cm` : "N/A"}
                </p>
              </div>

              <div className="bg-[#FDF9F3] hover:bg-[#FDF5E6] transition-colors rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider">Premature Days</p>
                <p className="text-lg sm:text-xl font-extrabold text-amber-600 tracking-tight">
                  {patient.prematureDays || 0} Days
                </p>
              </div>

              <div className="bg-[#FFF5F5] hover:bg-[#FFEBEB] transition-colors rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider">Blood Type</p>
                <p className="text-lg sm:text-xl font-extrabold text-rose-600 tracking-tight">
                  {patient.bloodType || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
