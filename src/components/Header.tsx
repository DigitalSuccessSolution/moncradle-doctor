"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Plus, Bell, X, AlertTriangle, Calendar, FileText, CheckCircle2, ChevronRight, ChevronLeft, ShieldAlert, LogIn, User, Headset } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setShowLoginModal, patients, notifications, setNotifications } = useDoctorData();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-auto">
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
              {/* Support Button */}
              <button
                onClick={() => router.push("/support")}
                className="relative p-2 text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors hidden sm:block"
                title="Support"
              >
                <Headset className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E4E70]" />
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

    </header>
  );
}
