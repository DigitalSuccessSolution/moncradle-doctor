"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PlusCircle, Utensils, Search, Trash2, FileText, Save, CheckCircle2, X, Loader2, AlertTriangle } from "lucide-react";
import { Patient } from "@/types";
import { getPatientNutrientGoals, nutritionService } from "@/services/nutritionService";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface NutritionTabProps {
  patient: Patient;
  patientId: string;
  nutritionPlan: any;
  setNutritionPlan: (plan: any) => void;
  nutritionLoading: boolean;
  nutritionGuidelines: string;
  setNutritionGuidelines: (v: string) => void;
  nutritionSchedule: Array<{ day: string; title: string; desc: string; mealId?: string }>;
  setNutritionSchedule: (schedule: any[]) => void;
  savingNutrition: boolean;
  setSavingNutrition: (v: boolean) => void;
  plannerSelectedDay: string;
  setPlannerSelectedDay: (v: string) => void;
  allMeals: any[];
  mealsLoading: boolean;
  catalogSearchTerm: string;
  setCatalogSearchTerm: (v: string) => void;
  plannerSuccessMsg: string;
  setPlannerSuccessMsg: (v: string) => void;
  plannerErrorMsg: string;
  setPlannerErrorMsg: (v: string) => void;
  savingGuidelines: boolean;
  handleSaveGuidelines: () => void;
  handleRemoveMealFromDay: (index: number) => void;
}

export default function NutritionTab({
  patient,
  patientId,
  nutritionPlan,
  setNutritionPlan,
  nutritionLoading,
  nutritionGuidelines,
  setNutritionGuidelines,
  nutritionSchedule,
  setNutritionSchedule,
  savingNutrition,
  setSavingNutrition,
  plannerSelectedDay,
  setPlannerSelectedDay,
  allMeals,
  mealsLoading,
  catalogSearchTerm,
  setCatalogSearchTerm,
  plannerSuccessMsg,
  setPlannerSuccessMsg,
  plannerErrorMsg,
  setPlannerErrorMsg,
  savingGuidelines,
  handleSaveGuidelines,
  handleRemoveMealFromDay,
}: NutritionTabProps) {
  const [catalogFilterAge, setCatalogFilterAge] = useState<string>("All");
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>([]);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [mealToDelete, setMealToDelete] = useState<number | null>(null);

  // Calculate dynamic nutrient totals based on actual assigned meals
  const summary = (() => {
    const goals = getPatientNutrientGoals(patient);
    const activeMeals = nutritionSchedule.filter((s) => {
      if (!s.title || s.title.trim() === "") return false;
      if (plannerSelectedDay === "All Days") return true;
      return s.day.toLowerCase() === plannerSelectedDay.toLowerCase();
    });

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;

    activeMeals.forEach((s) => {
      const meal = allMeals.find((m) => (m._id || m.id) === s.mealId);
      if (meal && meal.nutritionalInfo) {
        totalCalories += Number(meal.nutritionalInfo.calories || 0);
        totalProtein += Number(meal.nutritionalInfo.protein || 0);
        totalFat += Number(meal.nutritionalInfo.fat || 0);
      } else {
        totalCalories += 140;
        totalProtein += 3.5;
        totalFat += 2.5;
      }
    });

    const factor = plannerSelectedDay === "All Days" ? 7 : 1;
    const avgCalories = Math.round(totalCalories / factor);
    const avgProtein = Math.round((totalProtein / factor) * 10) / 10;
    const avgFat = Math.round((totalFat / factor) * 10) / 10;

    const calPercent = Math.min(100, Math.round((avgCalories / goals.targetCalories) * 100));
    const proteinPercent = Math.min(100, Math.round((avgProtein / goals.targetProtein) * 100));
    const fatPercent = Math.min(100, Math.round((avgFat / 10) * 100));

    return {
      avgCalories,
      avgProtein,
      avgFat,
      calPercent,
      proteinPercent,
      fatPercent,
      targetCalories: goals.targetCalories,
      targetProtein: goals.targetProtein,
      targetFat: 10,
    };
  })();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Nutrient Targets & Weaning Catalog */}
      <div className="lg:col-span-4 space-y-4">
        {/* Dynamic WHO Nutrient Target Progress Card */}
        <div className="bg-[#1E4E70] text-white rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider">Nutrient Targets</h3>
              <p className="text-[10px] text-slate-300 font-medium">Assigned plan vs WHO Goals</p>
            </div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded border border-white/30">
              {plannerSelectedDay}
            </span>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Calories */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Daily Target Calories</span>
                <span>
                  {summary.avgCalories} / {summary.targetCalories} kcal
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${summary.calPercent}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Daily Target Protein</span>
                <span>
                  {summary.avgProtein} / {summary.targetProtein} g
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${summary.proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>Healthy Dietary Fats</span>
                <span>
                  {summary.avgFat} / {summary.targetFat} g
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${summary.fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Right Column: Planner & Weekly Active Board */}
      <div className="lg:col-span-8 space-y-6">
        {/* Unified Planner Card (Guidelines + Day-Wise Assigner) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs space-y-6">
          {/* Top Section: Special Diet Guidelines */}
          <div className="border-b border-slate-100 pb-5">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2 mb-1">
              <FileText className="w-4.5 h-4.5 text-[#1E4E70]" />
              <span>Special Diet Guidelines</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mb-3">
              This note applies to the entire plan and is shared directly on the parent's dashboard.
            </p>
            <textarea
              rows={2}
              value={nutritionGuidelines}
              onChange={(e) => setNutritionGuidelines(e.target.value)}
              placeholder="e.g. Focus on iron-rich foods. Introduce variety of pureed vegetables..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70] font-medium leading-relaxed"
            />
          </div>

          {/* Bottom Section: Day-Wise Meal Target */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                  <PlusCircle className="w-4.5 h-4.5 text-[#1E4E70]" />
                  <span>Configure Day-Wise Meal Target</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Select a week day below to assign meals</p>
              </div>
            </div>

          {/* Day selector button row */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Week Day</label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar text-[11px] font-bold">
              {["All Days", ...DAYS_OF_WEEK].map((day) => {
                const dayMealsCount = day === "All Days" 
                  ? nutritionSchedule.filter((s) => s.title && s.title.trim() !== "").length 
                  : nutritionSchedule.filter((s) => s.day.toLowerCase() === day.toLowerCase() && s.title && s.title.trim() !== "").length;
                const isSelected = plannerSelectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setPlannerSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#1E4E70] text-white border-[#1E4E70] shadow-2xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                    }`}
                  >
                    <span>{day}</span>
                    {dayMealsCount > 0 && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isSelected ? "bg-white text-[#1E4E70]" : "bg-[#1E4E70] text-white"
                        }`}
                      >
                        {dayMealsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of currently assigned meals for selected day */}
          <div className="space-y-2 border-t border-slate-100 pt-3.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {plannerSelectedDay === "All Days" ? "All Assigned Meals" : `Currently Assigned for ${plannerSelectedDay}`}
            </label>
            {(() => {
              const assigned = nutritionSchedule
                .map((s, idx) => ({ ...s, originalIdx: idx }))
                .filter((s) => {
                  if (!s.title || s.title.trim() === "") return false;
                  if (plannerSelectedDay === "All Days") return true;
                  return s.day.toLowerCase() === plannerSelectedDay.toLowerCase();
                });

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {assigned.map((s) => (
                    <div
                      key={s.originalIdx}
                      className="flex items-start justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 animate-fadeIn"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">{s.title}</span>
                        {plannerSelectedDay === "All Days" && (
                          <span className="inline-block text-[9px] font-bold text-[#1E4E70] bg-[#F0F7FF] border border-[#BEE0FF] px-1.5 py-0.5 rounded mt-0.5 mb-1">
                            {s.day}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 line-clamp-1 leading-normal font-sans block mt-0.5">
                          {s.desc || "Assigned weaning meal."}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMealToDelete(s.originalIdx)}
                        disabled={savingNutrition}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        title="Remove meal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Meal Button Card */}
                  {plannerSelectedDay !== "All Days" && (
                    <button
                      type="button"
                      onClick={() => setIsCatalogModalOpen(true)}
                      className="flex flex-col items-center justify-center gap-1.5 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#1E4E70] hover:bg-[#F0F7FF] text-slate-400 hover:text-[#1E4E70] p-3 rounded-xl transition-all cursor-pointer min-h-[60px]"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add Meal</span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
          </div>
        </div>

        {/* Master Save Button for the Entire Plan */}
        <div className="flex justify-end pt-2">
           <button
             type="button"
             onClick={handleSaveGuidelines}
             disabled={savingGuidelines}
             className="bg-[#1E4E70] hover:bg-[#153852] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50 w-full sm:w-auto"
           >
             {savingGuidelines ? (
               <Loader2 className="w-4.5 h-4.5 animate-spin" />
             ) : (
               <Save className="w-4.5 h-4.5" />
             )}
             <span>{savingGuidelines ? "Saving Nutrition Plan..." : "Save Entire Nutrition Plan"}</span>
           </button>
        </div>
         </div>
      </div>

      {/* Multi-Select Meal Catalog Modal */}
      {isCatalogModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => { setIsCatalogModalOpen(false); setSelectedMealIds([]); setExpandedMealId(null); }} />
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col font-sans max-h-[90vh] relative z-10" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#1E4E70]" />
                  <span>Weaning Foods Catalog</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Select meals to add to {plannerSelectedDay}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCatalogModalOpen(false);
                  setSelectedMealIds([]);
                  setExpandedMealId(null);
                }}
                className="bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 border-b border-slate-100 shrink-0 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog meals..."
                  value={catalogSearchTerm}
                  onChange={(e) => setCatalogSearchTerm(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
                />
              </div>
              <select
                value={catalogFilterAge}
                onChange={(e) => setCatalogFilterAge(e.target.value)}
                className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E4E70] cursor-pointer"
              >
                <option value="All">All Ages</option>
                {Array.from(new Set(allMeals.map((m) => m.suitableForAgeGroup || "6-12 Months"))).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Body: Meal List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {mealsLoading ? (
                <p className="text-center text-slate-400 text-sm py-8">Loading catalog...</p>
              ) : (() => {
                const filteredMeals = allMeals.filter(
                  (m) =>
                    m.name.toLowerCase().includes(catalogSearchTerm.toLowerCase()) &&
                    (catalogFilterAge === "All" || (m.suitableForAgeGroup || "6-12 Months") === catalogFilterAge)
                );

                if (filteredMeals.length === 0) {
                  return (
                    <p className="text-center text-slate-400 text-sm py-8 italic">
                      No matching catalog meals found.
                    </p>
                  );
                }

                return filteredMeals.map((m) => {
                  const mId = m._id || m.id;
                  const isSelected = selectedMealIds.includes(mId);
                  const isExpanded = expandedMealId === mId;

                  return (
                    <div
                      key={mId}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isSelected ? "border-[#1E4E70] bg-[#F0F7FF] shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Summary Row */}
                      <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpandedMealId(isExpanded ? null : mId)}>
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                            isSelected ? "bg-[#1E4E70] border-[#1E4E70] text-white" : "border-slate-300 bg-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              setSelectedMealIds((prev) => prev.filter((id) => id !== mId));
                            } else {
                              setSelectedMealIds((prev) => [...prev, mId]);
                            }
                          }}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>

                        {/* Title and Badge */}
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className={`font-bold text-sm block truncate ${isSelected ? "text-[#1E4E70]" : "text-slate-800"}`}>
                              {m.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">{m.description}</span>
                          </div>
                          <span className="text-[10px] font-extrabold text-[#1E4E70] bg-[#F0F7FF] px-2 py-0.5 rounded-lg border border-[#BEE0FF] shrink-0 capitalize">
                            {m.suitableForAgeGroup || "6-12m"}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="p-3 border-t border-slate-100 bg-white text-xs">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-24 sm:h-24 shrink-0 bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                              {m.imageUrl || m.image || (m.images && m.images[0]) ? (
                                <>
                                  <img
                                    src={m.imageUrl || m.image || (m.images && m.images[0])}
                                    alt={m.name}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="hidden absolute inset-0 flex items-center justify-center">
                                    <Utensils className="w-8 h-8 text-slate-300" />
                                  </div>
                                </>
                              ) : (
                                <Utensils className="w-8 h-8 text-slate-300" />
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              {/* Category */}
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {m.category && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                                    {m.category}
                                  </span>
                                )}
                              </div>

                              {/* Nutrition Grid */}
                              <div className="grid grid-cols-4 gap-2">
                                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Calories</span>
                                  <span className="font-bold text-slate-800">{m.nutritionalInfo?.calories || 120}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Protein</span>
                                  <span className="font-bold text-slate-800">{m.nutritionalInfo?.protein || 3.5}g</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Carbs</span>
                                  <span className="font-bold text-slate-800">{m.nutritionalInfo?.carbs || 15}g</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                  <span className="text-[9px] font-semibold text-slate-400 uppercase block">Fat</span>
                                  <span className="font-bold text-slate-800">{m.nutritionalInfo?.fat || 2.5}g</span>
                                </div>
                              </div>

                              {/* Ingredients */}
                              {m.ingredients && m.ingredients.length > 0 && (
                                <div>
                                  <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <FileText className="w-3 h-3 text-[#1E4E70]" /> Ingredients
                                  </h4>
                                  <p className="text-slate-600 leading-relaxed font-medium">
                                    {m.ingredients.join(", ")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500">
                {selectedMealIds.length} meal(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCatalogModalOpen(false);
                    setSelectedMealIds([]);
                    setExpandedMealId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                      // Prepare new schedule items from the selected IDs and add locally
                      const newScheduleItems = selectedMealIds.map((id) => {
                        const meal = allMeals.find(m => (m._id || m.id) === id);
                        return {
                          day: plannerSelectedDay,
                          mealId: id,
                          title: meal?.name || "Assigned Meal",
                          desc: meal?.description || ""
                        };
                      });
                      
                      setNutritionSchedule([...nutritionSchedule, ...newScheduleItems]);
                      setIsCatalogModalOpen(false);
                      setSelectedMealIds([]);
                      setExpandedMealId(null);
                  }}
                  className="bg-[#1E4E70] hover:bg-[#153852] text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {savingNutrition ? "Adding..." : `Add ${selectedMealIds.length} Meal(s)`}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Confirmation Modal for Meal Deletion */}
      {mealToDelete !== null && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setMealToDelete(null)} />
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden font-sans text-center p-6 space-y-4 relative z-10" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Remove Meal?</h3>
            <p className="text-sm text-slate-500 font-medium">
              Are you sure you want to remove this meal from the schedule? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setMealToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRemoveMealFromDay(mealToDelete);
                  setMealToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Success Popup Modal */}
      {plannerSuccessMsg && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setPlannerSuccessMsg("")} />
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden font-sans text-center p-6 space-y-4 relative z-10" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Success</h3>
            <p className="text-sm text-slate-500 font-medium">
              {plannerSuccessMsg}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPlannerSuccessMsg("")}
                className="w-full px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Okay
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Error Popup Modal */}
      {plannerErrorMsg && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setPlannerErrorMsg("")} />
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden font-sans text-center p-6 space-y-4 relative z-10" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Cannot Save Plan</h3>
            <p className="text-sm text-slate-500 font-medium">
              {plannerErrorMsg}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPlannerErrorMsg("")}
                className="w-full px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Okay
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
