"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Printer, Download, CheckCircle, HeartPulse, FileText } from "lucide-react";
import { Patient, PrescriptionItem } from "@/data/mockData";
import { useDoctorData } from "@/context/DoctorDataContext";

interface PrintableMedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  prescription?: any;
}

export default function PrintableMedicalModal({
  isOpen,
  onClose,
  patient,
  prescription,
}: PrintableMedicalModalProps) {
  const diagnosis = prescription?.diagnosis || prescription?.medicalNotes || "No active diagnosis or clinical notes found.";
  const medicines = prescription?.medicines || prescription?.items || [];
  const rxDate = prescription?.date ? new Date(prescription.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const vitalsWeight = prescription?.vitals?.weight || patient.weight || 'N/A';
  const vitalsHeight = prescription?.vitals?.height || patient.height || 'N/A';
  const vitalsTemp = prescription?.vitals?.temperature || 'N/A';
  const { doctorProfile } = useDoctorData();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div id="print-modal-root" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn print:static print:block print:p-0 print:bg-white print:backdrop-blur-none">
      <div className="absolute inset-0 print:hidden" onClick={onClose} />
      <style>{`
        @media print {
          @page { size: auto; margin: 10mm; }
          
          /* Hide the entire background app to prevent blank pages */
          body > *:not(#print-modal-root) {
            display: none !important;
          }
          
          /* We don't need visibility: hidden anymore because everything else is display: none */
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col relative z-10 print:max-w-none print:shadow-none print:border-none print:max-h-none print:static print:block print:overflow-visible" onClick={e => e.stopPropagation()}>
        {/* Modal Action Top Bar */}
        <div className="bg-[#1E4E70] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Printer className="w-5 h-5 text-[#A5D8FF] shrink-0" />
            <h3 className="font-semibold text-sm sm:text-base truncate">
              Clinical File & eRx
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="bg-[#A5D8FF] hover:bg-sky-300 text-[#1E4E70] font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-2xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6 text-slate-800 printable-area">
          {/* Clinic Letterhead */}
          <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 border-b-2 border-[#1E4E70] pb-4">
            <div className="flex flex-col gap-1">
              <img src="/complete-logo.png" alt="Moncradle Logo" className="w-40 h-12 object-contain object-left" />
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Pediatric Care & Child Growth Clinic
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
              <p className="font-semibold text-slate-900">{doctorProfile.fullName}, MD (Pediatrics)</p>
              <p className="text-[11px] text-slate-500">Reg No: {doctorProfile.licenseNumber}</p>
              <p className="text-[11px] text-slate-500">Date: {rxDate}</p>
            </div>
          </div>

          {/* Patient Details Table */}
          <div className="bg-[#F8FAFC] rounded-lg p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4 text-xs">
            <div>
              <span className="text-[#1E4E70] font-semibold block">Patient Name</span>
              <span className="font-semibold text-slate-900 text-sm">{patient.name}</span>
            </div>
            <div>
              <span className="text-[#1E4E70] font-semibold block">Gender</span>
              <span className="font-semibold text-slate-900 capitalize">{patient.gender}</span>
            </div>
            <div>
              <span className="text-[#1E4E70] font-semibold block">Age / DOB</span>
              <span className="font-semibold text-slate-900">{patient.ageInMonths ? `${patient.ageInMonths} Months` : 'N/A'} / {patient.dateOfBirth || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#1E4E70] font-semibold block">Vitals (Wt / Ht / Temp)</span>
              <span className="font-semibold text-slate-900">{vitalsWeight} • {vitalsHeight} • {vitalsTemp}</span>
            </div>
            
            <div className="col-span-2">
              <span className="text-[#1E4E70] font-semibold block">Parent / Guardian (Contact)</span>
              <span className="font-semibold text-slate-900">
                {patient.parentName || "N/A"} ({patient.parentPhone || "N/A"})
              </span>
            </div>
            <div>
              <span className="text-[#1E4E70] font-semibold block">Blood Group</span>
              <span className="font-semibold text-slate-900">{patient.bloodType || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#1E4E70] font-semibold block">Allergies</span>
              <span className="font-semibold text-slate-900">
                {patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(", ") : "None Known"}
              </span>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="space-y-1">
            <h4 className="font-semibold text-[#1E4E70] text-xs uppercase tracking-wider">
              Diagnosis & Clinical Summary
            </h4>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              {diagnosis}
            </p>
          </div>

          {/* Prescribed Medications Table */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#1E4E70] text-xs uppercase tracking-wider">
              Rx - Prescribed Medications
            </h4>
            <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#1E4E70] text-white font-semibold">
                    <th className="p-2.5 rounded-tl-xl">#</th>
                    <th className="p-2.5">Medicine Name</th>
                    <th className="p-2.5">Dosage</th>
                    <th className="p-2.5">Frequency</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5 rounded-tr-xl">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-500 font-medium">No medicines prescribed</td>
                    </tr>
                  ) : medicines.map((m: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{m.medicineName || m.name}</td>
                      <td className="p-2.5 text-slate-700">{m.dosage}</td>
                      <td className="p-2.5 text-slate-700">{m.frequency}</td>
                      <td className="p-2.5 font-semibold text-[#1E4E70]">{m.duration}</td>
                      <td className="p-2.5 text-slate-700 italic text-[11px]">{m.instructions || "As directed"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Nutrition & Next Visit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prescription?.nutritionRecommendations && (
              <div className="space-y-1">
                <h4 className="font-semibold text-[#1E4E70] text-xs uppercase tracking-wider">
                  Nutrition / Lifestyle Advice
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {prescription.nutritionRecommendations}
                </p>
              </div>
            )}
            
            {prescription?.nextVisitDate && (
              <div className="space-y-1">
                <h4 className="font-semibold text-[#1E4E70] text-xs uppercase tracking-wider">
                  Next Follow-up Visit
                </h4>
                <p className="text-xs text-slate-700 font-semibold bg-sky-50 p-3 rounded-xl border border-sky-100 flex items-center gap-2">
                  📅 {new Date(prescription.nextVisitDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>

          {/* Digital Signature & Doctor Stamp Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                Digitally Verified & Encrypted
              </span>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif italic font-semibold text-[#1E4E70] text-base">
                {doctorProfile.fullName}
              </div>
              <p className="text-[11px] text-slate-500">Authorized Pediatric Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
