"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Utensils,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { maskPhoneNumber } from "@/data/mockData";

export default function NutritionPage() {
  const router = useRouter();
  const { patients } = useDoctorData();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(term) ||
      (patient.parentName && patient.parentName.toLowerCase().includes(term)) ||
      (patient.parentPhone && patient.parentPhone.includes(term)) ||
      (patient.medicalCondition && patient.medicalCondition.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));
  const currentPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Nutrition Plans
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Browse patients to create, edit, or view their customized pediatric feeding schedules.
          </p>
        </div>
      </div>

      {/* 2. Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Baby Name, Parent Name, Phone, or Medical Condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200/80 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E4E70] transition-colors"
        />
      </div>

      {/* 3. Patient Table Layout (Desktop) & List Card Layout (Mobile) */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
        
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient (Baby)</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Age & Gender</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parent Contact</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Health Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPatients.map((child) => (
                <tr 
                  key={child.id} 
                  onClick={() => router.push(`/patients/${child.id}?tab=nutrition`)}
                  className="hover:bg-slate-50/50 transition-colors text-xs cursor-pointer"
                >
                  {/* Column 1: Patient (Baby) */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-200 shrink-0 bg-slate-50">
                        <Image
                          src={child.avatar || "/child_care.png"}
                          alt={child.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-sm">{child.name}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Age & Gender */}
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-700 block">
                        {child.ageInMonths ? `${child.ageInMonths} Months` : child.age || "N/A"}
                      </span>
                      <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded-md capitalize ${
                        child.gender?.toLowerCase() === "female"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-sky-50 text-[#1E4E70] border border-sky-100"
                      }`}>
                        {child.gender}
                      </span>
                    </div>
                  </td>

                  {/* Column 3: Parent Contact */}
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block">{child.parentName}</span>
                      <span className="text-slate-500 block">Ph: {maskPhoneNumber(child.parentPhone)}</span>
                    </div>
                  </td>

                  {/* Column 4: Health Status */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        child.status === "Attention"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${child.status === "Attention" ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`}></span>
                        {child.status === "Attention" ? "Growth Review Required" : "Normal Growth"}
                      </span>
                      {child.medicalCondition && (
                        <span className="block text-[10px] text-slate-500 font-medium truncate max-w-[150px]" title={child.medicalCondition}>
                          {child.medicalCondition}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Column 5: Actions */}
                  <td className="p-4 text-right">
                    <Link
                      href={`/patients/${child.id}?tab=nutrition`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Open Nutrition</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS LIST VIEW */}
        <div className="block md:hidden divide-y divide-slate-100">
          {currentPatients.map((child) => (
            <div 
              key={child.id} 
              onClick={() => router.push(`/patients/${child.id}?tab=nutrition`)}
              className="p-4 space-y-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden relative border border-slate-200 bg-slate-50 shrink-0">
                    <Image
                      src={child.avatar || "/child_care.png"}
                      alt={child.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block leading-tight">{child.name}</span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                  child.status === "Attention"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {child.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Age & Gender</span>
                  <span className="font-semibold text-slate-700">{child.ageInMonths ? `${child.ageInMonths} Months` : child.age} • {child.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Parent Contact</span>
                  <span className="font-semibold text-slate-700 block truncate">{child.parentName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                {child.medicalCondition ? (
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">
                    Condition: <strong className="text-slate-700 font-semibold">{child.medicalCondition}</strong>
                  </span>
                ) : (
                  <span></span>
                )}
                
                <Link
                  href={`/patients/${child.id}?tab=nutrition`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Nutrition</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            No matching patient records found.
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
