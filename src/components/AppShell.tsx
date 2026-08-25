"use client";

import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import QuickAddModal from "@/components/QuickAddModal";
import LandingPage from "@/components/LandingPage";
import LoginModal from "@/components/LoginModal";
import MobileWelcomeModal from "@/components/MobileWelcomeModal";
import PageTransitionLoader from "@/components/PageTransitionLoader";
import AccountVerificationLockPage from "@/components/AccountVerificationLockPage";
import { useDoctorData } from "@/context/DoctorDataContext";
import { HeartPulse, LogOut } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, isProfileComplete, approvalStatus, logout } = useDoctorData();
  const pathname = usePathname();
  const router = useRouter();

  // Enforce mandatory profile completion onboarding for new doctors
  useEffect(() => {
    if (isHydrated && isAuthenticated && !isProfileComplete) {
      if (pathname !== "/profile/edit") {
        router.replace("/profile/edit");
      }
    }
  }, [isHydrated, isAuthenticated, isProfileComplete, pathname, router]);

  // Render clean background shell until client-side hydration completes
  if (!isHydrated) {
    return <div className="min-h-screen bg-[#F8F9FA]" />;
  }

  // List of protected clinical doctor routes requiring verification
  const protectedRoutes = [
    "/patients",
    "/appointments",
    "/growth-analysis",
    "/nutrition",
    "/monthly-reviews",
    "/prescriptions",
    "/medical-notes",
    "/reports",
    "/notifications",
    "/profile",
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // 1. Unauthenticated user -> Landing Page + Login Modal
  if (!isAuthenticated && (pathname === "/" || isProtectedRoute)) {
    return (
      <>
        <MobileWelcomeModal />
        <LandingPage />
        <LoginModal />
      </>
    );
  }

  // 2. Mandatory Profile Onboarding View (Zero Flicker, No Panel Widgets, No Navigation)
  if (isAuthenticated && !isProfileComplete) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-6 py-3.5 items-center justify-between shadow-2xs sticky top-0 z-30">
          <Link href="/" className="flex items-center">
            <Image
              src="/complete-logo.png"
              alt="Moncradle"
              width={150}
              height={41}
              className="h-9 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Step 2: Profile Credentials Required
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full">
          {children}
        </main>
      </div>
    );
  }

  // 3. Account Verification Lock Screen (Profile complete, but pending Admin Approval)
  if (
    isAuthenticated &&
    isProfileComplete &&
    approvalStatus !== "approved" &&
    pathname !== "/profile/edit"
  ) {
    return <AccountVerificationLockPage />;
  }

  // 4. Fully Approved Doctor / Authorized Portal View
  return (
    <>
      <MobileWelcomeModal />
      {/* Doctor Portal Shell */}
      <div className="flex min-h-screen w-full bg-[#F8F9FA]">
        {/* Desktop Navigation Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-0 h-screen">
          <Navigation mode="desktop" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-8">
          <Header />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <div className="lg:hidden">
        <Navigation mode="mobile" />
      </div>

      {/* Global Modals & Page Transition Loader */}
      <Suspense fallback={null}>
        <PageTransitionLoader />
      </Suspense>
      <QuickAddModal />
      <LoginModal />
    </>
  );
}
