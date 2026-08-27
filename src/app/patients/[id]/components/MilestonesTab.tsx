"use client";

import { Award, CheckCircle2 } from "lucide-react";
import { BabyMilestone } from "@/services/milestoneService";

interface MilestonesTabProps {
  babyMilestones: BabyMilestone[];
  milestonesLoading: boolean;
}

export default function MilestonesTab({ babyMilestones, milestonesLoading }: MilestonesTabProps) {
  return (
    <div className="w-full">
      {/* Developmental Logs */}
      <div className="w-full space-y-6">
        {/* Baby Milestones Logs */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider font-sans">
            Developmental Achievements Log
          </h3>

          {milestonesLoading ? (
            <p className="text-center text-xs text-slate-400 py-6 font-sans">Loading achievements...</p>
          ) : babyMilestones.length === 0 ? (
            <div className="py-6 text-center space-y-1.5 font-sans">
              <Award className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
              <p className="text-xs text-slate-400">No milestones achieved or recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {[...babyMilestones]
                .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                .map((m) => (
                <div key={m._id || m.id} className="flex items-center justify-between p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs font-sans">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-800 block">{m.title || m.milestoneName}</span>
                      {m.notes && <span className="text-[10px] text-slate-400 font-medium font-sans">{m.notes}</span>}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    {m.status || "VERIFIED"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
