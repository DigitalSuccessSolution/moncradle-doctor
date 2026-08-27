"use client";

import { useState } from "react";
import { X, Smartphone, Download, CheckCircle2 } from "lucide-react";

export default function AppDownloadBanner({ onOpenDownloadModal }: { onOpenDownloadModal: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#1D1D1F] text-white px-4 py-2.5 text-xs flex items-center justify-between z-50 sticky top-0 transition-all border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E4E70] to-[#0071E3] text-white flex items-center justify-center font-semibold shrink-0 shadow-xs">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="min-w-0 truncate">
          <p className="font-semibold text-white text-xs truncate">Download MONCRADLE Doctor App</p>
          <p className="text-[10px] text-slate-400 truncate hidden sm:block">
            For exclusive clinical features, instant WHO alerts & offline intake
          </p>
          <p className="text-[10px] text-slate-400 truncate sm:hidden">
            Instant clinical intake & WHO alerts
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenDownloadModal}
          className="bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold text-[11px] px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Get App</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
