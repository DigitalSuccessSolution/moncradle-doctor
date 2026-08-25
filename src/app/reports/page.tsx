"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  IndianRupee,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Receipt,
  FileText,
  TrendingUp,
  Wallet,
  Activity,
  CalendarCheck,
  Ban
} from "lucide-react";
import { earningService, EarningApiResponse, EarningItem } from "@/services/earningService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"financial" | "clinical">("financial");
  const [earningsData, setEarningsData] = useState<EarningApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Withdrawal Modal State (Mock)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const res = await earningService.getEarnings();
      setEarningsData(res);
    } catch (err) {
      console.error("Error fetching earnings report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  // --- MOCK LOGIC BASED ON NEW WITHDRAWAL SYSTEM ---
  // Once backend is updated, these will come from the API.
  const totalEarned = earningsData?.totalEarned ?? 0;
  const availableBalance = Math.floor(totalEarned * 0.5); 
  const pendingSettlement = Math.floor(totalEarned * 0.2);
  const totalWithdrawn = totalEarned - availableBalance - pendingSettlement;
  const earningsList: EarningItem[] = earningsData?.data || [];

  // Mock Graph Data
  const financialGraphData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 1900 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2200 },
    { name: 'Fri', revenue: 1000 },
    { name: 'Sat', revenue: 2800 },
    { name: 'Sun', revenue: 2400 },
  ];

  const clinicalGraphData = [
    { name: 'Mon', appointments: 12, completed: 10 },
    { name: 'Tue', appointments: 19, completed: 18 },
    { name: 'Wed', appointments: 15, completed: 12 },
    { name: 'Thu', appointments: 22, completed: 21 },
    { name: 'Fri', appointments: 10, completed: 9 },
    { name: 'Sat', appointments: 28, completed: 25 },
    { name: 'Sun', appointments: 24, completed: 24 },
  ];

  const handleExportCSV = () => {
    alert("Exporting CSV...");
  };

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount)) || Number(withdrawalAmount) > availableBalance) {
      alert("Please enter a valid amount within your available balance.");
      return;
    }
    alert(`Withdrawal request for ₹${withdrawalAmount} submitted successfully! (Mock)`);
    setShowWithdrawalModal(false);
    setWithdrawalAmount("");
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 font-sans overflow-hidden reports-printable-area">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .reports-printable-area, .reports-printable-area * { visibility: visible; }
          .reports-printable-area {
            position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px;
            background: white !important; -webkit-print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          @page { size: auto; margin: 0mm; }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time insights on your clinical performance and financial earnings.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full no-print">
        <button
          onClick={() => setActiveTab("financial")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "financial" ? "bg-[#1E4E70] text-white shadow-xs" : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Earnings & Payouts</span>
        </button>
        <button
          onClick={() => setActiveTab("clinical")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "clinical" ? "bg-[#1E4E70] text-white shadow-xs" : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Clinical Reports</span>
        </button>
      </div>

      {activeTab === "financial" ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Top 4 Financial Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5">
                <Wallet className="w-24 h-24 text-sky-600" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider relative z-10">
                <span>Available Balance</span>
                <Wallet className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#1E4E70] relative z-10">₹{availableBalance.toLocaleString()}</p>
              <div className="flex items-center justify-between relative z-10">
                <p className="text-xs font-medium text-slate-500">Ready to withdraw</p>
                <button 
                  onClick={() => setShowWithdrawalModal(true)}
                  className="text-[10px] font-bold text-white bg-[#1E4E70] hover:bg-[#153852] px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Pending Settlement</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-700">₹{pendingSettlement.toLocaleString()}</p>
              <p className="text-xs font-medium text-amber-600">Withdrawal requested</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Total Withdrawn</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700">₹{totalWithdrawn.toLocaleString()}</p>
              <p className="text-xs font-medium text-emerald-600">Successfully settled</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Total Lifetime Earned</span>
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">₹{totalEarned.toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-500">Gross revenue</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Graph */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Weekly Revenue</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Earnings growth over the last 7 days</p>
                </div>
                <IndianRupee className="w-5 h-5 text-slate-300" />
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E4E70" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1E4E70" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 600, color: '#1E4E70' }}
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#1E4E70" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">Quick Actions</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Download summaries and manage payouts.</p>
              
              <div className="space-y-3">
                <div onClick={handleExportCSV} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Download Ledger</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Export all transactions to CSV</p>
                    </div>
                  </div>
                </div>

                <div onClick={() => setShowWithdrawalModal(true)} className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between gap-3 hover:border-sky-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-sky-200">
                      <Wallet className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-900 text-sm">Request Payout</h4>
                      <p className="text-[11px] text-sky-700 font-medium">Withdraw to bank account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backend Earnings Payout Table */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Withdrawal & Payout History</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Track your requests and settled bank transfers</p>
              </div>
              <button
                onClick={fetchEarnings}
                className="p-2 text-[#1E4E70] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium">Fetching records...</div>
            ) : earningsList.length === 0 ? (
              <div className="py-12 text-center space-y-3 border border-dashed border-slate-200 rounded-lg">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">No Withdrawal History</h4>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Your withdrawal requests and payouts will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Request Date</th>
                      <th className="pb-3">Transaction ID</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {/* Mock mapping for UI demonstration */}
                    {[1, 2].map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 text-slate-500">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="py-3.5 text-slate-600 font-mono text-[11px]">TXN-9823{idx}812</td>
                        <td className="py-3.5 font-bold text-slate-900">₹{totalEarned > 0 ? (totalEarned / 4) : 500}</td>
                        <td className="py-3.5 text-right">
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                              idx === 0
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {idx === 0 ? "Pending Approval" : "Settled to Bank"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Clinical Reports Tab */
        <div className="space-y-6 animate-fadeIn">
          {/* Clinical Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Total Appointments</span>
                <CalendarCheck className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">124</p>
              <p className="text-xs font-medium text-slate-500">Lifetime scheduled</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-700">112</p>
              <p className="text-xs font-medium text-emerald-600">Successfully consulted</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Cancelled</span>
                <Ban className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-rose-700">12</p>
              <p className="text-xs font-medium text-slate-500">No-shows or cancelled</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Unique Patients</span>
                <Users className="w-4 h-4 text-[#1E4E70]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#1E4E70]">86</p>
              <p className="text-xs font-medium text-[#1E4E70]/70">Distinct babies seen</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real Bar Chart */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Weekly Consultations</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Appointments completed vs scheduled</p>
                </div>
                <Activity className="w-5 h-5 text-slate-300" />
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clinicalGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="appointments" name="Scheduled" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#1E4E70" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Clinical Data */}
            <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">Export Clinical Data</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                Download detailed pediatric growth summaries, z-scores, and consultation notes for offline analysis.
              </p>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Consultation History</h4>
                      <p className="text-[11px] text-slate-500 font-medium">All completed appointments & notes (CSV)</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
                      <BarChart3 className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Growth Z-Scores Report</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Anonymized pediatric growth data (CSV)</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Request Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#1E4E70]" />
                Request Withdrawal
              </h2>
              <button 
                onClick={() => setShowWithdrawalModal(false)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleRequestWithdrawal} className="p-5 space-y-5">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-800">Available to Withdraw</span>
                <span className="text-lg font-bold text-sky-900">₹{availableBalance.toLocaleString()}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max={availableBalance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full bg-white border border-slate-200 text-sm font-semibold text-slate-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#1E4E70] transition-colors"
                />
                <p className="text-[10px] text-slate-500">Minimum withdrawal amount is ₹100.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#1E4E70] text-white font-bold text-sm rounded-xl hover:bg-[#153852] transition-colors shadow-md shadow-sky-900/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
