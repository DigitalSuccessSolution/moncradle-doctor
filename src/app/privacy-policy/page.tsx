"use client";

import React from "react";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      {/* Page Header */}
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-slate-700 leading-relaxed max-w-4xl">
        
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Introduction</h2>
          <p>
            Welcome to Moncradle Pediatric Care. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard the information you provide when using our Progressive Web App (PWA) and associated clinical services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and professional credentials of the doctors.</li>
            <li><strong>Patient Data:</strong> Health records, growth charts, prescriptions, and nutritional plans which are strictly managed under doctor-patient confidentiality.</li>
            <li><strong>Usage Data:</strong> Information on how the app is accessed and used to improve performance and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">3. How We Use Your Data</h2>
          <p>We use the collected data for various purposes, including:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>To provide and maintain our clinical services.</li>
            <li>To manage patient records securely.</li>
            <li>To notify you about changes to our service.</li>
            <li>To provide customer support and administrative updates.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">4. Data Security & Encryption</h2>
          <p>
            We take data security seriously. All patient health data (PHI) and clinical notes are stored using industry-standard encryption protocols. 
            Access to sensitive information is strictly restricted to authorized medical personnel through secure authentication tokens.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact our support team at:
            <br /><br />
            <strong>Email:</strong> privacy@moncradle.com<br />
            <strong>Phone:</strong> +91 99999-00000
          </p>
        </section>

      </div>
    </div>
  );
}
