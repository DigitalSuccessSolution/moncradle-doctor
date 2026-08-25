"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, Smartphone, Laptop, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function ApkDownloadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleDownloadApk = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      // Trigger dummy download trigger
      const element = document.createElement("a");
      const file = new Blob(
        ["MONCRADLE Doctor PWA Package - Android APK & Standalone Manifest\nVersion 2.4.0\nPackage: com.moncradle.doctor.pwa"],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = "MONCRADLE-Doctor-v2.4.0.apk";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp flex flex-col relative z-10">
        {/* Header */}
        <div className="p-6 bg-gradient-to-tr from-[#1E4E70] to-[#0071E3] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-semibold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">MONCRADLE Doctor App</h3>
              <p className="text-xs opacity-80">Official Android APK Package</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p><strong className="text-slate-900">Direct Doctor Clinic Sync:</strong> Child patient directory, WHO z-score charts, and e-prescriptions.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p><strong className="text-slate-900">Offline Engine:</strong> Works uninterrupted during hospital Wi-Fi drops.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p><strong className="text-slate-900">Push Notifications:</strong> Instant alerts when a baby&apos;s weight drops below WHO 15th percentile.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleDownloadApk}
              disabled={downloading}
              className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm py-3.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? "Downloading APK..." : downloadComplete ? "APK Downloaded! Install Now" : "Download Android APK (v2.4.0)"}</span>
            </button>

            <button
              onClick={() => {
                alert("To add app shortcut: Open in browser menu and select 'Add to Home Screen'!");
                onClose();
              }}
              className="w-full bg-[#F5F5F7] hover:bg-slate-200 text-slate-800 font-semibold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Add Shortcut to Home Screen</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Verified safe & encrypted • Compatible with Android 8.0+ and iOS Safari
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
