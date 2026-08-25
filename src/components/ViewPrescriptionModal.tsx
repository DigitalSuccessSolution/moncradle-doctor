"use client";

import React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Printer, CheckCircle, Pill, Calendar, Activity, Utensils, User, FileText } from "lucide-react";

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  prescription: any;
  doctorProfile: any;
  onClose: () => void;
}

export default function ViewPrescriptionModal({
  isOpen,
  prescription,
  doctorProfile,
  onClose,
}: ViewPrescriptionModalProps) {
  if (!isOpen || !prescription || typeof document === "undefined") return null;

  const medicines = prescription.items || prescription.medicines || [];
  const vitals = prescription.vitals || {};
  const doctorName = prescription.doctorName || doctorProfile?.fullName || "Dr. Sumit Sahu";
  const doctorSpec = prescription.doctorSpecialization || doctorProfile?.specialization || "Pediatrician & Neonatologist";

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn font-sans">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-scaleUp relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Action Bar */}
        <div className="bg-[#1E4E70] px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#A5D8FF]" />
            <h3 className="font-semibold text-base tracking-tight">Digital Prescription Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#A5D8FF]/20 hover:bg-[#A5D8FF]/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Medical Letterhead Pad */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0">
          {/* Clinic Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-[#1E4E70]/20 pb-5 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E4E70] tracking-tight">{doctorName}</h2>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{doctorSpec}</p>
              <p className="text-[11px] text-slate-500 mt-1">Reg No: KMC-98724 • MONCRADLE Pediatric Health Clinic</p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-block bg-[#E0F2FE] text-[#1E4E70] font-bold text-xs px-3 py-1 rounded-lg border border-[#BAE6FD]">
                E-Prescription
              </span>
              <p className="text-xs font-semibold text-slate-500 mt-1.5">Date: {prescription.date || new Date().toISOString().split("T")[0]}</p>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Patient Name</span>
                <p className="font-bold text-slate-900">{prescription.patientName || "Child Patient"}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Parent / Guardian</span>
                <p className="font-semibold text-slate-700">{prescription.parentName || "Parent"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Clinical Observations</span>
                <p className="font-semibold text-[#1E4E70] truncate">{prescription.diagnosis || "Pediatric Consultation"}</p>
              </div>
            </div>

            {/* Vitals Badges */}
            {vitals && (vitals.weight || vitals.temperature || vitals.bp) && (
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-2 text-xs">
                {vitals.weight && (
                  <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200/80">
                    Weight: {vitals.weight}
                  </span>
                )}
                {vitals.temperature && (
                  <span className="bg-rose-50 text-rose-800 font-semibold px-2.5 py-1 rounded-lg border border-rose-200/80">
                    Temp: {vitals.temperature}
                  </span>
                )}
                {vitals.bp && vitals.bp !== "N/A" && (
                  <span className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                    BP: {vitals.bp}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Rx Symbol & Prescribed Medicines Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#1E4E70] font-serif italic">Rx</span>
              <h4 className="font-semibold text-slate-900 text-sm">Prescribed Medicines ({medicines.length})</h4>
            </div>

            {medicines.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-lg text-center text-xs text-slate-500 italic border border-slate-200">
                No medicines listed in this prescription.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Medicine Name</th>
                      <th className="p-3">Dosage</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {medicines.map((m: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-400 font-semibold">{idx + 1}</td>
                        <td className="p-3 font-semibold text-slate-900">{m.medicineName || m.name}</td>
                        <td className="p-3 text-slate-700">{m.dosage || "As directed"}</td>
                        <td className="p-3 text-slate-700">{m.frequency || "Once daily"}</td>
                        <td className="p-3 text-[#1E4E70] font-semibold">{m.duration || "5 Days"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Dietary Advice & Follow-Up Date Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {prescription.nutritionRecommendations && (
              <div className="bg-amber-50/80 rounded-lg p-3.5 border border-amber-200/80 space-y-1">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Nutrition Advice</span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {prescription.nutritionRecommendations}
                </p>
              </div>
            )}

            {prescription.nextVisitDate && (
              <div className="bg-sky-50/80 rounded-lg p-3.5 border border-sky-200/80 space-y-1">
                <span className="text-[10px] text-[#1E4E70] font-bold uppercase tracking-wider block">Next Follow-Up Visit</span>
                <p className="text-xs font-bold text-[#1E4E70]">
                  {String(prescription.nextVisitDate).split("T")[0]}
                </p>
              </div>
            )}
          </div>

          {/* Doctor Digital Stamp Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-bold text-[#1E4E70]">{doctorName}</p>
              <p className="text-[11px]">{doctorSpec}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              Digitally Signed & Stamp Verified
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
