"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

export default function PageTransitionLoader() {
  const [showLogoLoader, setShowLogoLoader] = useState(true);

  useEffect(() => {
    // Show the big logo loader ONLY on the initial app load for a smooth entry
    // Do NOT show it on every route change (which makes the app feel slow)
    const timer = setTimeout(() => {
      setShowLogoLoader(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!showLogoLoader) return null;

  return (
    // lg:hidden ensures loader ONLY shows on mobile/tablet phone screens
    <div className="lg:hidden fixed inset-0 z-[9999] flex items-center justify-center bg-white backdrop-blur-lg animate-fadeIn transition-all duration-300 font-sans pointer-events-none">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#0071E3]/12 animate-ping pointer-events-none" />
        <div className="w-32 h-32 sm:w-36 sm:h-36 relative z-10 flex items-center justify-center">
          <Image
            src="/moncradle-icon.png"
            alt="Moncradle"
            width={144}
            height={144}
            className="w-full h-full object-contain drop-shadow-sm"
            unoptimized
            priority
          />
        </div>
      </div>
    </div>
  );
}
