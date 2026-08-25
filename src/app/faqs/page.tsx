"use client";

import React from "react";

export default function ClinicalFAQsPage() {
  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans">
      {/* Page Header */}
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Clinical FAQs
          </h1>
          <p className="text-sm text-slate-500 mt-1">Frequently Asked Questions for Practitioners</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 text-slate-700 leading-relaxed max-w-4xl">
        
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. How are the WHO Growth Charts calculated?</h2>
          <p>
            Moncradle uses the exact datasets published by the World Health Organization (WHO) for children aged 0-5 years, and CDC data for older children. Our algorithms map the patient's weight, height, and head circumference against the standardized standard deviation (Z-score) tables to plot the percentiles accurately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Is the data stored securely?</h2>
          <p>
            Yes. All Protected Health Information (PHI) is encrypted both in transit (using TLS 1.2+) and at rest (using AES-256 encryption). We strictly adhere to standard data privacy guidelines to ensure patient records remain confidential and secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">3. Can I customize the weaning food catalog?</h2>
          <p>
            The built-in catalog provides a comprehensive list of pediatrician-approved meals. While you cannot delete the master catalog items, you can create customized combinations and add custom notes to any patient's nutrition plan before printing or sharing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">4. How do I generate an e-prescription (eRx)?</h2>
          <p>
            Navigate to the patient's profile and click on the <strong>Prescriptions</strong> module. From there, you can select standard drug dosages, add clinical notes, and generate a printable or shareable PDF prescription directly from your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">5. What if the app works offline?</h2>
          <p>
            As a Progressive Web App (PWA), Moncradle caches critical UI components and recent patient data so you can continue viewing profiles even during network drops. However, saving new clinical data requires an active internet connection, and the app will queue changes or warn you if you are offline.
          </p>
        </section>

      </div>
    </div>
  );
}
