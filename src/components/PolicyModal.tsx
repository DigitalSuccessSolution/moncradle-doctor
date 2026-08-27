"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck, FileText, Users, HelpCircle, Star, BookOpen, Award } from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function PolicyModal() {
  const { activePolicy, setActivePolicy } = useDoctorData();

  useEffect(() => {
    if (activePolicy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activePolicy]);

  if (!activePolicy || typeof document === "undefined") return null;

  const titles: Record<string, string> = {
    privacy: "Privacy Policy & Clinical Data Protection",
    terms: "Terms & Conditions of Service",
    partner: "Register as a Doctor Partner",
    contact: "Contact MONCRADLE Clinical Desk",
    team: "Our Medical Advisory & Development Team",
    faq: "Frequently Asked Questions (FAQ)",
    rate: "Rate & Review MONCRADLE PWA",
    blogs: "Clinical Pediatrics & Growth Research Blogs",
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setActivePolicy(null)} />
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp flex flex-col max-h-[85vh] relative z-10" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#A5D8FF]/30 text-[#1E4E70] rounded-xl font-semibold">
              {activePolicy === "privacy" && <ShieldCheck className="w-5 h-5" />}
              {activePolicy === "terms" && <FileText className="w-5 h-5" />}
              {activePolicy === "team" && <Users className="w-5 h-5" />}
              {activePolicy === "faq" && <HelpCircle className="w-5 h-5" />}
              {activePolicy === "rate" && <Star className="w-5 h-5" />}
              {activePolicy === "blogs" && <BookOpen className="w-5 h-5" />}
              {!["privacy", "terms", "team", "faq", "rate", "blogs"].includes(activePolicy) && (
                <Award className="w-5 h-5" />
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-base leading-tight">
              {titles[activePolicy] || "MONCRADLE Information"}
            </h3>
          </div>
          <button
            onClick={() => setActivePolicy(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {activePolicy === "privacy" && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#1E4E70]">1. Pediatric Clinical Data Encrypted Storage</h4>
              <p>
                MONCRADLE Doctor PWA ensures all patient charts, WHO growth percentile records, and e-prescriptions are encrypted using AES-256 both in transit and at rest.
              </p>
              <h4 className="font-semibold text-sm text-[#1E4E70]">2. Offline IndexedDB & Local PWA Storage</h4>
              <p>
                Patient data cached offline on your mobile or desktop device is securely sandbox-isolated to your browser instance and synced when network connectivity is re-established.
              </p>
              <h4 className="font-semibold text-sm text-[#1E4E70]">3. Doctor Data Confidentiality</h4>
              <p>
                Medical licenses, prescriptions, and clinical observations are strictly owned by the consulting pediatrician. We do not sell or share patient health information (PHI) with third-party advertisers.
              </p>
            </div>
          )}

          {activePolicy === "terms" && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#1E4E70]">1. Clinical Responsibility</h4>
              <p>
                The MONCRADLE Doctor Portal provides growth velocity calculation and digital prescription tools to assist medical decisions. Final diagnosis remains the sole responsibility of the registered physician.
              </p>
              <h4 className="font-semibold text-sm text-[#1E4E70]">2. License Verification</h4>
              <p>
                Doctors registering on MONCRADLE must possess valid state medical council registration (MD/DCH/MBBS) for issuing e-prescriptions.
              </p>
            </div>
          )}

          {activePolicy === "partner" && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#1E4E70]">Partner with MONCRADLE Clinical Network</h4>
              <p>
                Join over 2,500+ pediatricians and child nutritionists utilizing automated WHO z-score growth tracking and instant parent notification tools.
              </p>
              <div className="bg-[#F8F9FA] p-4 rounded-lg border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">Partner Benefits:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Direct patient referrals from MONCRADLE Parent PWA</li>
                  <li>Integrated digital e-prescriptions & diet charts</li>
                  <li>PWA offline intake capabilities during clinic visits</li>
                </ul>
              </div>
            </div>
          )}

          {activePolicy === "faq" && (
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-slate-900 text-xs">Q: Is MONCRADLE Doctor PWA free to use?</h5>
                <p className="text-slate-600 mt-0.5">Yes, standard clinical intake, WHO growth curve charting, and e-prescriptions are complimentary for pediatric practitioners.</p>
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-xs">Q: Does the portal work without internet?</h5>
                <p className="text-slate-600 mt-0.5">Yes! As a Progressive Web App (PWA), you can log intake and notes offline. It automatically syncs when online.</p>
              </div>
              <div>
                <h5 className="font-semibold text-slate-900 text-xs">Q: Can parents view the digital prescriptions?</h5>
                <p className="text-slate-600 mt-0.5">Yes, signed prescriptions can be sent directly to the parent&apos;s phone via WhatsApp or PDF download.</p>
              </div>
            </div>
          )}

          {activePolicy === "contact" && (
            <div className="space-y-3">
              <p>For urgent clinical portal support or account onboarding assistance, contact our team:</p>
              <div className="bg-[#F8F9FA] p-4 rounded-lg border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800">MONCRADLE Doctor Support Desk</p>
                <p className="text-slate-600">Email: doctor-support@moncradle.com</p>
                <p className="text-slate-600">Phone: +91 1800-419-8800 (Mon-Sat, 9 AM - 8 PM)</p>
                <p className="text-slate-600">HQ: MONCRADLE Pediatric Health, Tech Park, New Delhi, India</p>
              </div>
            </div>
          )}

          {activePolicy === "team" && (
            <div className="space-y-3">
              <p>Designed in collaboration with leading pediatricians, clinical dietitians, and software engineers dedicated to early childhood growth surveillance.</p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-[#F8F9FA] p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">Dr. Sarah Chen, MD</p>
                  <p className="text-[11px] text-slate-500">Chief Pediatric Consultant</p>
                </div>
                <div className="bg-[#F8F9FA] p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">Dr. Rajesh Mehta, DCH</p>
                  <p className="text-[11px] text-slate-500">Growth Velocity Advisor</p>
                </div>
              </div>
            </div>
          )}

          {activePolicy === "rate" && (
            <div className="space-y-3 text-center py-2">
              <div className="flex justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-7 h-7 fill-amber-400" />
                ))}
              </div>
              <p className="font-semibold text-slate-900 text-sm">Rate MONCRADLE Doctor Portal</p>
              <p className="text-xs text-slate-500">Your feedback helps us refine clinical intake tools and growth charts.</p>
            </div>
          )}

          {activePolicy === "blogs" && (
            <div className="space-y-3">
              <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-slate-200">
                <p className="font-semibold text-[#1E4E70]">Understanding WHO z-Score Percentiles in 0-24m Infants</p>
                <p className="text-[11px] text-slate-500 mt-1">Clinical guide on evaluating length velocity and head circumference percentiles.</p>
              </div>
              <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-slate-200">
                <p className="font-semibold text-[#1E4E70]">Bioavailability of Iron Drops in Weaning Infants</p>
                <p className="text-[11px] text-slate-500 mt-1">Pediatric nutrition advisory on complementary feeding and iron supplementation.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F9FA] border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => setActivePolicy(null)}
            className="bg-[#1E4E70] text-white font-semibold text-xs px-5 py-2.5 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
