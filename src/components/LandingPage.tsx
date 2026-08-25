"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  HeartPulse,
  Stethoscope,
  Activity,
  TrendingUp,
  FileText,
  Utensils,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Star,
  User,
  PhoneCall,
  Lock,
  Sparkles,
  HelpCircle,
  Users,
  BookOpen,
  Download,
  Baby,
  Calendar,
  Layers,
  ChefHat,
  Truck,
  QrCode,
  Check,
  Home,
  Zap,
  LineChart,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import ApkDownloadModal from "@/components/ApkDownloadModal";
import MobileHeroSlider from "@/components/MobileHeroSlider";

export default function LandingPage() {
  const { setShowLoginModal } = useDoctorData();
  const [mobileTab, setMobileTab] = useState<"account" | "home" | "patients" | "features">("home");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans selection:bg-[#A5D8FF] selection:text-[#1E4E70]">
      {/* APK / PWA Download Modal */}
      <ApkDownloadModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />

      {/* ========================================================================= */}
      {/* 1. DESKTOP LANDING PAGE VIEW */}
      {/* ========================================================================= */}
      <div className="hidden lg:block flex-1 pb-0">
        {/* Clean Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center cursor-pointer">
              <Image
                src="/complete-logo.png"
                alt="Moncradle"
                width={170}
                height={47}
                className="h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-8 text-sm font-semibold text-slate-600">
              <button
                onClick={() => scrollToSection("features")}
                className="hover:text-[#1E4E70] transition-colors cursor-pointer"
              >
                Why Moncradle
              </button>

              <button
                onClick={() => scrollToSection("built-for-doctors")}
                className="hover:text-[#1E4E70] transition-colors cursor-pointer"
              >
                For Doctors
              </button>

              <button
                onClick={() => scrollToSection("our-platform")}
                className="hover:text-[#1E4E70] transition-colors cursor-pointer"
              >
                Platform
              </button>

              <button
                onClick={() => scrollToSection("reviews")}
                className="hover:text-[#1E4E70] transition-colors cursor-pointer"
              >
                Resources
              </button>

              <button
                onClick={() => scrollToSection("footer")}
                className="hover:text-[#1E4E70] transition-colors cursor-pointer"
              >
                Contact
              </button>
            </nav>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-slate-700 hover:text-slate-900 font-semibold text-xs px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setShowApkModal(true)}
                className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs px-6 py-2.5 rounded-full shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                Download App
              </button>
            </div>
          </div>
        </header>

        {/* HERO SECTION - FULL SCREEN EDGE-TO-EDGE SITTING CLEANLY BELOW NAVBAR */}
        <section className="w-full relative min-h-[580px] xl:min-h-[640px] flex items-center bg-white overflow-hidden">
          {/* Full Bleed Background Image with object-[right_top] so the top is never cut off */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/herobg.png"
              alt="Moncradle Full Edge-to-Edge Hero Banner"
              fill
              className="object-cover object-[right_top]"
              priority
            />
            {/* Colorful Soft Gradient Overlay on Left */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-sky-50/80 to-transparent w-full md:w-[65%]" />
            
            {/* Playful Pediatric Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-sky-300/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-[30%] right-[30%] w-72 h-72 bg-emerald-200/20 rounded-full blur-[90px] pointer-events-none hidden md:block" />
          </div>

          {/* Aligned Inner Overlay Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full py-12">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-sky-100 text-[#1E4E70] font-semibold text-xs px-4 py-1.5 rounded-full border border-sky-200 shadow-sm">
                👶 For Pediatricians & Nutritionists
              </span>

              <h1 className="text-5xl xl:text-6xl font-semibold text-slate-800 tracking-tight leading-[1.1]">
                Better Nutrition. <br />
                <span className="text-[#1E4E70]">Stronger Future.</span>
              </h1>

              <p className="text-base text-slate-700 leading-relaxed font-medium max-w-lg">
                Moncradle empowers doctors and nutritionists to monitor child growth, deliver personalized nutrition plans, and build lasting relationships with parents.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setShowApkModal(true)}
                  className="bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#1E4E70]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4.5 h-4.5" />
                  <span>Download Doctor App</span>
                </button>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-white/90 backdrop-blur-md border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-sm px-7 py-3.5 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <User className="w-4.5 h-4.5 text-[#1E4E70]" />
                  <span>Doctor Login</span>
                </button>
              </div>

              {/* Doctor Trust Social Proof */}
              <div className="pt-4 flex items-center gap-4 text-xs font-semibold text-slate-700">
                <div className="flex -space-x-2">
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                    alt="Doctor"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100"
                    alt="Doctor"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100"
                    alt="Doctor"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                </div>

                <span>Trusted by 500+ Doctors</span>
                <span className="text-slate-400">|</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-semibold text-slate-900">4.8/5</span>
                  <span className="text-slate-600 font-normal">from 500+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED BY THOUSANDS OF PARENTS & PEDIATRICIANS BAR */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="py-10 border-y border-slate-200/80 bg-white"
        >
          <div className="max-w-7xl mx-auto px-8 space-y-8 text-center">
            <p className="text-xs font-semibold text-[#1E4E70] uppercase tracking-widest">
              Trusted by Thousands of Parents & Leading Pediatricians
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-100 shadow-2xs space-y-1 hover:shadow-md hover:border-indigo-300 transition-all transform hover:-translate-y-1">
                <p className="text-3xl font-bold text-indigo-600">50k+</p>
                <p className="text-xs font-semibold text-indigo-800">Happy Parents</p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100 shadow-2xs space-y-1 hover:shadow-md hover:border-emerald-300 transition-all transform hover:-translate-y-1">
                <p className="text-3xl font-bold text-emerald-600">2,500+</p>
                <p className="text-xs font-semibold text-emerald-800">Verified Doctors</p>
              </div>

              <div className="p-5 rounded-xl bg-sky-50 border border-sky-100 shadow-2xs space-y-1 hover:shadow-md hover:border-sky-300 transition-all transform hover:-translate-y-1">
                <p className="text-3xl font-bold text-sky-600">99.4%</p>
                <p className="text-xs font-semibold text-sky-800">Growth Precision</p>
              </div>

              <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 shadow-2xs space-y-1 hover:shadow-md hover:border-amber-300 transition-all transform hover:-translate-y-1">
                <p className="text-3xl font-bold text-amber-500">4.9 ★</p>
                <p className="text-xs font-semibold text-amber-800">App Rating</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION: WHY DOCTORS CHOOSE MONCRADLE (6 FEATURE CARDS GRID) */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="features" 
          className="py-20 max-w-5xl mx-auto px-8 space-y-12"
        >
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#1E4E70] uppercase tracking-widest">WHY DOCTORS CHOOSE MONCRADLE</span>
            <h2 className="text-3xl xl:text-4xl font-semibold text-slate-800 tracking-tight">
              Everything You Need to Care Better
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Patient Management */}
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1682089159103-d09b46d1cce8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8UGF0aWVudCUyME1hbmFnZW1lbnQlMjBtZWRpY2FsfGVufDB8fDB8fHww"
                  alt="Patient Management"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-[#1E4E70] shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-base">Patient Management</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Organize & manage all pediatric patient records effortlessly.
                </p>
              </div>
            </div>

            {/* Card 2: Growth Analytics */}
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="https://media.istockphoto.com/id/1806607482/photo/child-at-doctors-appointment-measuring-height.webp?a=1&b=1&s=612x612&w=0&k=20&c=CnZiAVc-22IvLxhWz4z1DEj7frYKc2itmH5NXPXfRJ4="
                  alt="Growth Analytics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-emerald-600 shadow-xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-base">WHO Growth Analytics</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time WHO Z-Score percentiles & growth velocity curves.
                </p>
              </div>
            </div>

            {/* Card 3: Nutrition Plans */}
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="/2.png"
                  alt="Nutrition Plans"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-rose-600 shadow-xs">
                  <Utensils className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-base">Nutrition & Weaning Plans</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Customized pediatric meal & calorie density roadmaps.
                </p>
              </div>
            </div>

            {/* Card 4: Prescriptions */}
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGlnaXRhbCUyMGUtUHJlc2NyaXB0aW9ucyUyMG1lZGljYWx8ZW58MHx8MHx8fDA%3D"
                  alt="Prescriptions"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-[#1E4E70] shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-base">Digital e-Prescriptions</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Signed liquid medicine dosage instructions & PDF exports.
                </p>
              </div>
            </div>

            {/* Card 5: Appointments */}
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1673953510197-0950d951c6d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T1BEJTIwQXBwb2ludG1lbnRzJTIwbWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Appointments OPD"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-purple-600 shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-base">OPD Appointments</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Streamlined clinical consultations & appointment queue.
                </p>
              </div>
            </div>

            {/* Card 6: Medical Notes */}
            <div className="bg-white rounded-xl border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1726769176212-1ab1fd60f42a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFNPQVAlMjBNZWRpY2FsJTIwTm90ZXMlMjBtZWRpY2FsfGVufDB8fDB8fHww"
                  alt="Medical Notes"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md p-2 rounded-xl text-amber-600 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="font-semibold text-slate-800 text-base">SOAP Medical Notes</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Secure clinical notes, vitals & pediatric patient history.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION: BUILT FOR DOCTORS */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="built-for-doctors" 
          className="py-16 bg-white border-y border-slate-200/80"
        >
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-12 gap-12 items-center">
            {/* Left Graphic: Female Doctor */}
            <div className="col-span-12 lg:col-span-6 relative flex justify-center items-end min-h-[480px]">
              {/* Colorful Background Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-sky-200 to-indigo-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#1E4E70]/5 rounded-full border border-sky-200 shadow-inner pointer-events-none" />
              
              <div className="relative w-full max-w-md h-full min-h-[480px]">
                <Image
                  src="/doctor_female.png"
                  alt="Moncradle Pediatrician"
                  fill
                  className="object-contain object-bottom drop-shadow-lg"
                  unoptimized
                />

                {/* Floating Card 1: BMI 16.2 Normal */}
                <div className="absolute top-12 right-2 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xl border border-slate-100 text-center w-28 z-10">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">BMI</p>
                  <p className="text-lg font-semibold text-slate-900">16.2</p>
                  <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">Normal</p>
                </div>

                {/* Floating Card 2: Upcoming Consultation */}
                <div className="absolute bottom-10 left-2 bg-white/95 backdrop-blur-md rounded-lg p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-xl bg-[#A5D8FF]/30 text-[#1E4E70] flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Upcoming Consultation</p>
                    <p className="text-xs font-semibold text-slate-900">Today, 11:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Content */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold text-[#1E4E70] uppercase tracking-widest">BUILT FOR DOCTORS</span>
              <h2 className="text-3xl xl:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
                Focus on Your Patients, <br />
                We Handle the Rest
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Moncradle brings together growth tracking, nutrition recommendations, consultations, and follow-ups in one powerful platform so you can focus on what matters most — your patients.
              </p>

              {/* 4 Checkmark Bullets */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1E4E70] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    ✓
                  </div>
                  <span className="text-sm text-slate-600">Save time with automation</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1E4E70] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    ✓
                  </div>
                  <span className="text-sm text-slate-600">Make data-driven decisions</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1E4E70] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    ✓
                  </div>
                  <span className="text-sm  text-slate-600">Improve growth outcomes</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1E4E70] text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    ✓
                  </div>
                  <span className="text-sm  text-slate-600">Build parent trust</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION: DOCTOR GROWTH & FEATURES */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="our-platform" 
          className="py-20 max-w-7xl mx-auto px-8 space-y-12"
        >
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold text-[#1E4E70] uppercase tracking-widest">GROW YOUR PRACTICE</span>
            <h2 className="text-3xl xl:text-4xl font-semibold text-slate-800 tracking-tight">
              Scale Your Clinic with Smart Tech
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: 10x Practice Growth */}
            <div className="bg-[#A5D8FF]/20 p-8 rounded-2xl border border-[#A5D8FF]/40 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white text-[#1E4E70] flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">10x Practice Growth</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Attract more parents with a premium digital clinic experience and modern health tools.
                </p>
              </div>
            </div>

            {/* Card 2: Clinical Efficiency */}
            <div className="bg-emerald-50/80 p-8 rounded-2xl border border-emerald-100 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">Clinical Efficiency</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Save hours daily with automated WHO growth calculations and instant e-prescriptions.
                </p>
              </div>
            </div>

            {/* Card 3: Patient Retention */}
            <div className="bg-purple-50/80 p-8 rounded-2xl border border-purple-100 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">Patient Retention</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Build lasting trust through automated follow-ups, vaccine reminders, and nutrition plans.
                </p>
              </div>
            </div>

            {/* Card 4: Data-Driven Care */}
            <div className="bg-amber-50/80 p-8 rounded-2xl border border-amber-100 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-sm">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">Data-Driven Care</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Make informed clinical decisions backed by comprehensive pediatric health records.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FOOTER CTA BANNER */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          whileInView={{ opacity: 1, scale: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="px-8 max-w-7xl mx-auto my-8"
        >
          <div className="bg-[#5B61F4] rounded-xl p-8 xl:p-10 text-white shadow-2xl flex items-center justify-between relative overflow-hidden">
            {/* Background Heart Watermark Accents */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-around pointer-events-none">
              <HeartPulse className="w-48 h-48" />
              <HeartPulse className="w-64 h-64" />
            </div>

            {/* Left Column: iPhone Mockup Screen */}
            <div className="relative z-10 hidden md:block">
              <div className="w-48 h-80 bg-white border-4 border-slate-900 rounded-[32px] shadow-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                <Image
                  src="/complete-logo.png"
                  alt="Moncradle"
                  width={150}
                  height={41}
                  className="w-36 h-auto object-contain my-2"
                  priority
                  unoptimized
                />
                <p className="text-[10px] text-slate-500 font-semibold">
                  Better Nutrition. <br /> Stronger Future.
                </p>
              </div>
            </div>

            {/* Center Column: Text & Buttons */}
            <div className="space-y-5 max-w-lg relative z-10">
              <h2 className="text-3xl font-semibold tracking-tight leading-tight text-white">
                Join Hundreds of Doctors Using Moncradle
              </h2>
              <p className="text-xs text-white/90 leading-relaxed">
                Download the PWA and start delivering better care today.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setShowApkModal(true)}
                  className="bg-white text-[#5B61F4] hover:bg-slate-50 font-semibold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#5B61F4]" />
                  <span>Download Doctor App</span>
                </button>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-transparent hover:bg-white/10 border border-white/80 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-white" />
                  <span>Doctor Login</span>
                </button>
              </div>
            </div>

            {/* Right Column: Scan QR Code with Arrow */}
            <div className="relative z-10 hidden lg:flex items-center gap-4">
              <div className="text-right space-y-1 text-xs">
                <p className="font-semibold text-white leading-tight">Scan to Install</p>
                <p className="text-[11px] text-white/80">the PWA</p>
                <svg className="w-16 h-8 text-white/80 fill-none stroke-current stroke-2 ml-auto" viewBox="0 0 60 30">
                  <path d="M 5 5 Q 30 25 55 10" />
                  <path d="M 45 5 L 55 10 L 50 20" />
                </svg>
              </div>

              <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-xl flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}
        <footer id="footer" className="bg-[#1D1D1F] text-slate-300 pt-16 pb-12 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 pb-12 border-b border-slate-800 text-xs">
            <div className="col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-sm inline-flex items-center">
                  <Image
                    src="/complete-logo.png"
                    alt="Moncradle"
                    width={150}
                    height={42}
                    className="h-8 w-auto object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Empowering pediatricians with WHO growth tracking, digital prescriptions, and personalized child nutrition plans.
              </p>
            </div>

            <div className="col-span-3 space-y-2.5">
              <h4 className="font-semibold text-xs text-white uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white cursor-pointer">Patient Management</button></li>
                <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white cursor-pointer">Growth Analytics</button></li>
                <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white cursor-pointer">Digital Prescriptions</button></li>
              </ul>
            </div>

            <div className="col-span-3 space-y-2.5">
              <h4 className="font-semibold text-xs text-white uppercase tracking-wider">Policies</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/policies?tab=privacy" className="hover:text-white cursor-pointer">Privacy Policy</Link></li>
                <li><Link href="/policies?tab=terms" className="hover:text-white cursor-pointer">Terms & Conditions</Link></li>
                <li><Link href="/policies?tab=partner" className="hover:text-white cursor-pointer">Doctor Registration</Link></li>
              </ul>
            </div>

            <div className="col-span-2 space-y-2.5">
              <h4 className="font-semibold text-xs text-white uppercase tracking-wider">Support Desk</h4>
              <Link href="/support" className="text-[#A5D8FF] hover:underline block font-semibold">Visit Support Desk →</Link>
              <p className="text-slate-400">doctor-support@moncradle.com</p>
              <p className="text-slate-400">+91 1800-419-8800</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-6 flex items-center justify-between text-[11px] text-slate-500">
            <p>© 2026 Moncradle Pediatric Health. All rights reserved.</p>
            <p>Designed with Apple HIG Aesthetics</p>
          </div>
        </footer>
      </div>

      {/* Mobile view removed */}
    </div>
  );
}
