"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Plus, Bell, X, AlertTriangle, Calendar, FileText, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert, LogIn, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setShowLoginModal, patients, notifications, setNotifications } = useDoctorData();

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isSubPage = pathname !== "/";
  const getSubPageTitle = () => {
    if (pathname === "/profile") return "My Profile";
    if (pathname === "/support") return "Support Desk";
    if (pathname === "/policies") return "Policies";
    if (pathname === "/policies/privacy") return "Privacy & Data Security";
    if (pathname === "/policies/terms") return "Terms of Service";
    if (pathname === "/policies/partner") return "Doctor Partner Program";
    if (pathname === "/policies/faq") return "Clinical FAQs";
    if (pathname === "/patients") return "Patients Directory";
    if (pathname.startsWith("/patients/")) return "Pediatric Patient File";
    if (pathname === "/appointments") return "Appointments";
    if (pathname === "/growth-analysis") return "WHO Growth Analysis";
    if (pathname === "/nutrition") return "Nutrition Recommendations";
    if (pathname === "/monthly-reviews") return "Monthly Reviews";
    if (pathname === "/prescriptions") return "Digital e-Prescriptions";
    if (pathname === "/medical-notes") return "Medical Notes";
    if (pathname === "/reports") return "Clinical Reports";
    if (pathname === "/notifications") return "Notifications & Alerts";
    return "Moncradle Doctor";
  };

  const filteredPatients = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.parentName && p.parentName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenQuickAdd = () => {
    window.dispatchEvent(new CustomEvent("open-quick-add"));
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleBack = () => {
    if (pathname.startsWith("/profile/")) {
      router.push("/profile");
    } else if (pathname.startsWith("/patients/")) {
      router.push("/patients");
    } else if (pathname.startsWith("/policies/")) {
      router.push("/policies");
    } else if (pathname === "/policies") {
      router.push("/profile");
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/60 px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
      {/* Mobile Sub-Page Native Top Header Bar */}
      {isSubPage ? (
        <div className="md:hidden flex items-center justify-between py-2.5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-800 font-bold text-base hover:text-[#1E4E70] cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800 stroke-[2.5]" />
            <span className="truncate max-w-[200px]">{getSubPageTitle()}</span>
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-[#1E4E70] hover:bg-[#153852] text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <LogIn className="w-3 h-3" />
              <span>LOGIN</span>
            </button>
          )}
        </div>
      ) : null}

      <div className={`max-w-7xl mx-auto items-center justify-between gap-2 sm:gap-4 ${isSubPage ? "hidden md:flex" : "flex"}`}>
        {/* Left: Single Moncradle Logo for Mobile View (Desktop uses Sidebar Logo) */}
        <div className="flex items-center gap-2 shrink-0 md:hidden">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/complete-logo.png"
              alt="Moncradle"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Center: Live Interactive Search Bar (Desktop) */}
        <div ref={searchRef} className="flex-1 max-w-md hidden md:block relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, ID or parent..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-9 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF] transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Live Search Dropdown */}
          {showSearchDropdown && searchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden z-50 animate-fadeIn">
              <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Matching Patients ({filteredPatients.length})</span>
                <span>Press ESC to close</span>
              </div>
              {filteredPatients.length > 0 ? (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {filteredPatients.map((p) => (
                    <Link
                      key={p.id}
                      href={`/patients/${p.id}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 shrink-0 relative">
                          <Image
                            src={p.avatar || "/child_care.png"}
                            alt={p.name}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs leading-tight group-hover:text-[#1E4E70]">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {p.age} • Parent: {p.parentName}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          p.status === "Attention"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching patients found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {!isAuthenticated ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-[#1E4E70] hover:bg-[#153852] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>LOGIN / SIGN UP</span>
            </button>
          ) : (
            <>
              {/* Raise Admin Request Ticket Button */}
              <button
                onClick={() => router.push("/support")}
                className="hidden sm:flex items-center gap-1.5 bg-[#1E4E70]/10 hover:bg-[#1E4E70]/20 border border-[#1E4E70]/30 text-[#1E4E70] text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
                title="Raise Ticket / Request to Super Admin"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#1E4E70]" />
                <span>Raise Admin Request</span>
              </button>

              {/* Mobile search toggle button */}
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Notifications Link to /notifications Page */}
              <Link
                href="/notifications"
                className="relative p-2 text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors block"
                title="View All Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E4E70]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile search bar overlay dropdown */}
      {showSearchInput && (
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#A5D8FF]"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
