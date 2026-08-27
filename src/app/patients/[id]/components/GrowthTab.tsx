"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Scale, Trash2, Plus, X, Calendar, Activity } from "lucide-react";
import { Patient } from "@/data/mockData";
import { GrowthRecord } from "@/services/growthService";
import GrowthCurveChart from "@/components/GrowthCurveChart";

interface GrowthTabProps {
  patient: Patient;
  growthRecords: GrowthRecord[];
  growthLoading: boolean;
  logDate: string;
  setLogDate: (v: string) => void;
  logWeight: string;
  setLogWeight: (v: string) => void;
  logHeight: string;
  setLogHeight: (v: string) => void;
  logHead: string;
  setLogHead: (v: string) => void;
  logNotes: string;
  setLogNotes: (v: string) => void;
  savingGrowth: boolean;
  handleLogVitals: (e: React.FormEvent) => void;
  handleDeleteGrowth: (id: string) => void;
}

export default function GrowthTab({
  patient,
  growthRecords,
  growthLoading,
  logDate,
  setLogDate,
  logWeight,
  setLogWeight,
  logHeight,
  setLogHeight,
  logHead,
  setLogHead,
  logNotes,
  setLogNotes,
  savingGrowth,
  handleLogVitals,
  handleDeleteGrowth,
}: GrowthTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartType, setChartType] = useState<"weight" | "height">("weight");

  const onSubmit = (e: React.FormEvent) => {
    handleLogVitals(e);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#10B981]" />
          Growth Records
        </h2>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Chart Section */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm mb-6">Growth Chart</h3>

      {/* WHO Growth Curve Chart */}
      <div className="w-full">
        <GrowthCurveChart
          chartType={chartType}
          currentWeight={patient.weight !== undefined ? Number(patient.weight) : undefined}
          currentHeight={patient.height !== undefined ? Number(patient.height) : undefined}
          ageInMonths={patient.ageInMonths !== undefined ? Number(patient.ageInMonths) : undefined}
          records={growthRecords}
        />
      </div>
      </div>

      {/* Table of previous growth logs */}
      <div className="p-0">

          {growthLoading ? (
            <p className="text-center text-xs text-slate-400 py-6">Loading logs...</p>
          ) : growthRecords.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">No previous vitals records logged yet.</p>
          ) : (
            <div className="overflow-x-auto thin-scrollbar pb-2">
              <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                    <th className="py-2.5 px-3">Height (cm)</th>
                    <th className="py-2.5 px-3">Head Circ. (cm)</th>
                    <th className="py-2.5 px-3 min-w-[150px]">Notes</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {[...growthRecords]
                    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                    .map((rec) => (
                    <tr key={rec._id || rec.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3">
                        {rec.createdAt ? String(rec.createdAt).split("T")[0] : "N/A"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-900">{rec.weight} kg</td>
                      <td className="py-2.5 px-3">{rec.height} cm</td>
                      <td className="py-2.5 px-3">{rec.headCircumference ? `${rec.headCircumference} cm` : "—"}</td>
                      <td className="py-2.5 px-3 font-normal text-slate-500 max-w-[200px] truncate">
                        {rec.notes || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteGrowth(rec._id || rec.id!)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add New Entry Modal */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp border border-slate-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#1E3A8A] text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#818CF8]" />
                <span>Add New Entry</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto thin-scrollbar">
              <form onSubmit={onSubmit} className="space-y-5 text-sm">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Measurement</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      required
                      type="date"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" /> Weight (kg)
                    </label>
                    <input
                      required
                      type="text"
                      inputMode="decimal"
                      value={logWeight}
                      onChange={(e) => setLogWeight(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="e.g. 10.5"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" /> Height (cm)
                    </label>
                    <input
                      required
                      type="text"
                      inputMode="decimal"
                      value={logHeight}
                      onChange={(e) => setLogHeight(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="e.g. 78.5"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span>👦 Head (cm)</span>
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">Optional</span>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={logHead}
                    onChange={(e) => setLogHead(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="e.g. 46.2"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</label>
                  <textarea
                    rows={3}
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="Doctor's notes or observations..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#818CF8] focus:border-transparent resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-center pb-2">
                  <button
                    type="submit"
                    disabled={savingGrowth || !logWeight || !logHeight}
                    className="px-8 py-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 text-sm w-max mx-auto"
                  >
                    {savingGrowth ? "Saving..." : "Save Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
