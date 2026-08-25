"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Calendar,
  Utensils,
  TrendingUp,
  FileText,
  Edit3,
  BarChart3,
  Bell,
  User,
  Activity,
  HeartPulse,
  Headphones,
  ShieldCheck,
  Home,
  LogIn,
  Baby,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

interface NavigationProps {
  mode: "desktop" | "mobile";
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  onClick?: () => void;
}

export default function Navigation({ mode }: NavigationProps) {
  const pathname = usePathname();
  const { isAuthenticated, setShowLoginModal } = useDoctorData();

  // Authenticated Full Doctor Portal Navigation Items
  const primaryNavItems: NavItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Nutrition", href: "/nutrition", icon: Utensils },
  ];

  const secondaryNavItems: NavItem[] = [
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "OPD Availability", href: "/profile/availability", icon: Calendar },
    { name: "Prescriptions", href: "/prescriptions", icon: FileText },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Support Desk", href: "/support", icon: Headphones },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const mobileNavItems: NavItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Patients", href: "/patients", icon: Users },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Plan", href: "/nutrition", icon: Utensils },
    { name: "Profile", href: "/profile", icon: User },
  ];

  // Constant 4 Unauthenticated Mobile Tabs (Home, Children, Portal, Account)
  const unauthMobileNavItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home, onClick: undefined },
    { name: "Children", href: "#", icon: Baby, onClick: () => setShowLoginModal(true) },
    { name: "Portal", href: "#", icon: ShieldCheck, onClick: () => setShowLoginModal(true) },
    { name: "Account", href: "/profile", icon: User, onClick: undefined },
  ];

  // Unauthenticated Desktop Sidebar Nav Items
  const unauthDesktopNavItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Support Desk", href: "/support", icon: Headphones },
    { name: "Profile / Account", href: "/profile", icon: User },
  ];

  if (mode === "desktop") {
    if (!isAuthenticated) {
      return (
        <aside className="h-full bg-white border-r border-slate-200/80 flex flex-col p-4 justify-between">
          <div className="space-y-6">
            <Link href="/" className="flex items-center px-3 py-2">
              <Image
                src="/complete-logo.png"
                alt="Moncradle"
                width={160}
                height={44}
                className="h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            <div className="space-y-1">
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Public Navigation
              </p>
              {unauthDesktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#A5D8FF]/40 text-[#1E4E70] font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#1E4E70]" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 mt-auto">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs py-3 rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>LOG IN / SIGN UP</span>
            </button>


          </div>
        </aside>
      );
    }

    return (
      <aside className="h-full bg-white border-r border-slate-200/80 flex flex-col p-4 overflow-y-auto space-y-6 select-none">
        <Link href="/" className="flex items-center px-3 py-2 shrink-0">
          <Image
            src="/complete-logo.png"
            alt="Moncradle"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Clinical Modules
          </p>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A5D8FF]/40 text-[#1E4E70] font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#1E4E70]" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1 pt-4 border-t border-slate-100 pb-4">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Records & Tools
          </p>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.name === "Profile" && (pathname === "/profile" || pathname === "/profile/edit"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#A5D8FF]/40 text-[#1E4E70] font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#1E4E70]" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>


      </aside>
    );
  }

  // Check if current route is a main tab route (Dashboard, Patients, Appointments, Profile)
  const isMainTabRoute = ["/", "/patients", "/appointments", "/profile"].includes(pathname);

  // In mobile view after login, hide bottom navigation bar on sub/detail pages
  if (mode === "mobile" && isAuthenticated && !isMainTabRoute) {
    return null;
  }

  // Mobile Bottom Navigation Bar
  const activeNavItems = isAuthenticated ? mobileNavItems : unauthMobileNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 sm:px-6 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href !== "#" &&
            (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));

          if (item.onClick) {
            return (
              <button
                key={item.name}
                onClick={item.onClick}
                className="flex flex-col items-center gap-1 group py-1 px-1 cursor-pointer"
              >
                <div className="w-10 h-8 rounded-full flex items-center justify-center transition-all text-slate-500 group-hover:text-slate-900">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <span className="text-[11px] sm:text-xs font-medium transition-colors text-slate-500">
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 group py-1 px-1 cursor-pointer"
            >
              <div
                className={`w-10 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#A5D8FF] text-[#1E4E70] shadow-xs scale-105"
                    : "text-slate-500 group-hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-medium transition-colors ${
                  isActive ? "text-[#1E4E70] font-semibold" : "text-slate-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
