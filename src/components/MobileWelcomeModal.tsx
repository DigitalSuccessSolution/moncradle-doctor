"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Stethoscope,
  Activity,
  Sparkles,
  TrendingUp,
  FileText,
  Utensils,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";

export default function MobileWelcomeModal() {
  const { showWelcomeScreen, setShowWelcomeScreen, isAuthenticated, isHydrated, setShowLoginModal } = useDoctorData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isHydrated && showWelcomeScreen && !isAuthenticated) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isHydrated, showWelcomeScreen, isAuthenticated]);

  if (!isHydrated || !showWelcomeScreen || isAuthenticated) return null;

  const onboardingSlides = [
    {
      image: "/phone-view7.png",
      badge: "Pediatric OPD Suite",
      badgeIcon: Stethoscope,
      title: "Doctor Right Now!",
      description: "Streamline pediatric consultations, WHO growth charts & e-prescriptions effortlessly.",
      chips: [
        { title: "WHO Velocity", subtitle: "Growth Charts", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
        { title: "e-Prescription", subtitle: "Instant PDF", icon: FileText, color: "bg-indigo-50 text-indigo-600" },
      ],
    },
    {
      image: "/phone-view9.png",
      badge: "Clinical Analytics",
      badgeIcon: Activity,
      title: "Smart Growth Velocity",
      description: "Automatic WHO z-score calculations, percentile curves & milestone tracking.",
      chips: [
        { title: "WHO Percentiles", subtitle: "Length & Weight", icon: Activity, color: "bg-sky-50 text-sky-600" },
        { title: "Diet Generator", subtitle: "Weaning Plans", icon: Utensils, color: "bg-[#FFD1DC] text-rose-700" },
      ],
    },
    {
      image: "/phone-view10.png",
      badge: "OPD Automation",
      badgeIcon: Sparkles,
      title: "Instant e-Prescriptions",
      description: "Create SOAP clinical notes, prescribe medications & share WhatsApp PDFs instantly.",
      chips: [
        { title: "SOAP Notes", subtitle: "Clinical Records", icon: ShieldCheck, color: "bg-purple-50 text-purple-600" },
        { title: "PDF Export", subtitle: "WhatsApp Ready", icon: FileText, color: "bg-emerald-50 text-emerald-600" },
      ],
    },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    setShowWelcomeScreen(false);
    try {
      sessionStorage.setItem("moncradle_doctor_welcome_done", "true");
    } catch (e) {}
  };

  return (
    <div className="lg:hidden">
      <div
        className="fixed inset-0 z-[100] bg-[#F1F4F8] flex flex-col justify-between overflow-hidden font-sans animate-fadeIn select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Bar: Step Counter */}
        <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-start">
          <span className="bg-slate-900/50 backdrop-blur-md text-white font-semibold text-[11px] px-3.5 py-1 rounded-full border border-white/20 shadow-xs">
            Step {currentSlide + 1} of {onboardingSlides.length}
          </span>
        </div>

        {/* Top Doctor Image Container */}
        <div className="relative flex-1 w-full overflow-hidden">
          <Image
            key={currentSlide}
            src={onboardingSlides[currentSlide].image}
            alt={onboardingSlides[currentSlide].title}
            fill
            className="object-cover object-top transition-all duration-500 animate-fadeIn"
            priority
            unoptimized
          />
        </div>

        {/* Bottom Curved White Card Container With Slide Content */}
        <div className="bg-white rounded-t-[36px] -mt-6 p-6 sm:p-8 pt-7 pb-8 flex flex-col items-center text-center space-y-4 shadow-2xl relative z-20 border-t border-slate-100 max-w-md mx-auto w-full">
          {/* Badge Tag */}
          {(() => {
            const BadgeIcon = onboardingSlides[currentSlide].badgeIcon;
            return (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A5D8FF]/30 border border-[#A5D8FF] text-[#1E4E70] text-[11px] font-semibold tracking-wide uppercase">
                <BadgeIcon className="w-3.5 h-3.5" />
                <span>{onboardingSlides[currentSlide].badge}</span>
              </div>
            );
          })()}

          {/* Title & Subtitle */}
          <div className="space-y-1.5 max-w-xs transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight leading-tight">
              {onboardingSlides[currentSlide].title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed min-h-[36px]">
              {onboardingSlides[currentSlide].description}
            </p>
          </div>

          {/* Feature Chips Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm pt-1">
            {onboardingSlides[currentSlide].chips.map((chip, idx) => {
              const ChipIcon = chip.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80 flex items-center gap-2 text-left transition-all hover:border-slate-300 shadow-2xs overflow-hidden"
                >
                  <div className={`w-7 h-7 rounded-xl ${chip.color} flex items-center justify-center shrink-0`}>
                    <ChipIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-tight tracking-tight break-words">{chip.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 truncate">{chip.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots (Clickable & Active Pill Indicator) */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {onboardingSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlide === index
                    ? "w-7 h-2 rounded-full bg-[#1E4E70]"
                    : "w-2 h-2 rounded-full bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Action Button: Stepwise NEXT -> NEXT -> GET STARTED */}
          <button
            onClick={() => {
              if (currentSlide < onboardingSlides.length - 1) {
                setCurrentSlide((prev) => prev + 1);
              } else {
                setShowLoginModal(true);
              }
            }}
            className="w-full max-w-xs bg-[#1E4E70] hover:bg-[#153852] active:scale-95 text-white font-semibold text-sm sm:text-base py-3.5 rounded-full shadow-lg transition-all cursor-pointer tracking-wider uppercase flex items-center justify-center gap-2 mt-1"
          >
            <span>
              {currentSlide === onboardingSlides.length - 1
                ? "Login / Register"
                : "NEXT"}
            </span>
            <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
