"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check when component mounts
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOffline) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOffline]);

  if (!isOffline || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm px-6 text-center animate-fadeIn">
      <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl flex flex-col items-center justify-center max-w-sm w-full border border-slate-100 animate-slideUp relative z-10">
        <div className="relative w-40 h-12 mb-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          <img
            src="/complete-logo.png"
            alt="Moncradle Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-rose-200 rounded-full animate-ping opacity-60"></div>
          <div className="bg-rose-100 p-5 rounded-full relative z-10 border-4 border-white shadow-xl">
            <WifiOff className="w-10 h-10 text-rose-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">You are offline</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Please check your internet connection. The application will automatically reconnect when the network is restored.
        </p>
      </div>
    </div>,
    document.body
  );
}
