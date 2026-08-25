"use client";

import React from "react";

export default function PartnerProgramPage() {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      {/* Page Header */}
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Doctor Partner Program
          </h1>
          <p className="text-sm text-slate-500 mt-1">Join the Moncradle Network</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-slate-700 leading-relaxed max-w-4xl">
        
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Overview</h2>
          <p>
            The Moncradle Doctor Partner Program is designed for forward-thinking pediatricians who want to elevate their clinical practice using our state-of-the-art digital tools. By joining the program, you gain exclusive access to advanced analytics, priority support, and a network of top pediatric professionals.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Benefits of Partnering</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Advanced Growth Tracking:</strong> Unlock premium WHO percentiles and CDC growth charts with automated anomaly detection.</li>
            <li><strong>Automated Nutrition Plans:</strong> Generate tailored weaning and dietary plans for infants and toddlers with one click.</li>
            <li><strong>Priority Support:</strong> Get 24/7 dedicated technical and clinical onboarding support for your entire staff.</li>
            <li><strong>Custom Branding:</strong> Print prescriptions and clinical summaries with your own clinic's logo and branding.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">3. Eligibility</h2>
          <p>To be eligible for the Partner Program, practitioners must:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Hold a valid medical license with a specialization in Pediatrics or General Medicine.</li>
            <li>Be actively practicing in a recognized clinic or hospital setting.</li>
            <li>Commit to maintaining the highest standards of data privacy and patient confidentiality.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">4. How to Apply</h2>
          <p>
            Applying is simple. Reach out to our partner success team via email at <strong>partners@moncradle.com</strong> with your credentials and clinic details. Our team will review your application and schedule a personalized demo within 48 hours.
          </p>
        </section>

      </div>
    </div>
  );
}
