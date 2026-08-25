"use client";

import React from "react";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      {/* Page Header */}
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 mt-1">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-slate-700 leading-relaxed max-w-4xl">
        
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Moncradle Pediatric Care App, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by these terms, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
          <p>
            Moncradle provides clinical management tools, growth tracking, nutrition planning, and electronic prescription (eRx) features intended 
            for authorized pediatricians and clinic staff. The service is provided "as is" and "as available".
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">3. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Medical Disclaimer:</strong> This app is a clinical aid and does not replace professional medical judgment. Doctors are solely responsible for the diagnosis, prescriptions, and treatments provided to patients.</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
            <li><strong>Compliance:</strong> You agree to use the service in compliance with all applicable local, state, and national laws regarding health data and telemedicine.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">4. Intellectual Property</h2>
          <p>
            All content, features, and functionality (including but not limited to all information, software, text, displays, images, and the design) 
            are owned by Moncradle and are protected by copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
          <p>
            In no event shall Moncradle, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising out of your access to, or use of, the application and its clinical tools.
          </p>
        </section>

      </div>
    </div>
  );
}
