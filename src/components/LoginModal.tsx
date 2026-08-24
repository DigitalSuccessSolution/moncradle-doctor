"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Phone,
  UserPlus,
  LogIn,
  RefreshCw,
  Eye,
  EyeOff,
  KeyRound,
  Check,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { authService } from "@/services/authService";

export default function LoginModal() {
  const router = useRouter();
  const { showLoginModal, setShowLoginModal, login } = useDoctorData();

  // Mode Tabs: "register" | "login" | "forgot_password"
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot_password">("login");

  // Registration steps: "details" | "otp"
  const [step, setStep] = useState<"details" | "otp">("details");

  // Registration Form Fields
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  // Sign In Form Fields
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Forgot / Reset Password 3-Step Flow: "request_email" -> "verify_otp" -> "set_password"
  const [forgotStep, setForgotStep] = useState<"request_email" | "verify_otp" | "set_password">("request_email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [serverResetOtp, setServerResetOtp] = useState("");
  const [resetOtp, setResetOtp] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Visibility Toggles
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Resend OTP Countdown Timer (30s)
  const [resendTimer, setResendTimer] = useState(30);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timer effect for OTP Resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Scroll Lock effect to freeze background scrolling when Login Modal is open
  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoginModal]);

  if (!showLoginModal || typeof document === "undefined") return null;

  const handleMobileChange = (val: string) => {
    let numeric = val.replace(/\D/g, "");
    if (numeric.startsWith("91") && numeric.length > 10) {
      numeric = numeric.slice(2);
    }
    if (numeric.startsWith("0") && numeric.length > 10) {
      numeric = numeric.slice(1);
    }
    numeric = numeric.slice(0, 10);
    setMobileNumber(numeric);
    if (errorMessage) setErrorMessage(null);
  };

  /**
   * STEP 1: Send Registration OTP to Email
   * POST /api/auth/send-register-otp { email: doctorEmail }
   */
  const handleSendRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorEmail.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!doctorName.trim()) {
      setErrorMessage("Please enter Doctor Full Name.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.sendRegisterOtp(doctorEmail.trim());
      setLoading(false);

      if (res.success || res.message) {
        setSuccessMessage(`OTP sent to email ${doctorEmail.trim()}`);
        setStep("otp");
        setResendTimer(30);
      } else {
        const errorMsg = res.message || "Failed to send OTP to email.";
        setErrorMessage(errorMsg);

        if (errorMsg.toLowerCase().includes("already exists")) {
          setSignInEmail(doctorEmail.trim());
        }
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || "User with this email already exists or Network error.";
      
      if (errMsg.toLowerCase().includes("already exists") || errMsg.includes("User with this email")) {
        setErrorMessage("User with this email already exists. Please Sign In to access your doctor account.");
        setSignInEmail(doctorEmail.trim());
      } else {
        setErrorMessage(errMsg);
      }
    }
  };

  /**
   * Resend OTP Handler
   */
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (activeTab === "register") {
        await authService.sendRegisterOtp(doctorEmail.trim());
        setSuccessMessage(`New OTP resent to email ${doctorEmail.trim()}`);
      } else if (activeTab === "forgot_password") {
        const res = await authService.forgotPassword(forgotEmail.trim());
        if ((res as any)?.otp) setServerResetOtp((res as any).otp);
        setSuccessMessage(`New Reset OTP resent to ${forgotEmail.trim()}`);
      }
      setResendTimer(30);
      setOtp(["", "", "", ""]);
      setResetOtp(["", "", "", ""]);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to resend OTP. Please try again.");
      setResendTimer(30);
      setOtp(["", "", "", ""]);
      setResetOtp(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * STEP 2: Verify OTP & Complete Doctor Account Registration
   * POST /api/auth/register
   */
  const handleCompleteRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      setErrorMessage("Please enter complete 4-digit OTP.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.register({
        name: doctorName.trim(),
        email: doctorEmail.trim(),
        password: doctorPassword,
        phone: mobileNumber || "",
        role: "doctor",
        otp: otpCode,
      });

      setLoading(false);

      if (res.success || res.token || (res as any)._id) {
        const token = res.token || (res.data as any)?.token || "jwt-token";
        const user = res.user || res.doctor || (res.data as any)?.user || {
          name: doctorName.trim(),
          email: doctorEmail.trim(),
          phone: `+91 ${mobileNumber}`,
          role: "doctor",
        };

        login(
          mobileNumber ? `+91 ${mobileNumber}` : "",
          token,
          user,
          true
        );

        router.replace("/profile/edit");
        setShowLoginModal(false);
        setSuccessMessage("Doctor account registered successfully! Redirecting to complete profile...");
      } else {
        setErrorMessage(res.message || "Invalid OTP code. Doctor registration failed.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Invalid OTP code or Network Error. Registration failed.");
    }
  };

  /**
   * Sign In via Email & Password
   * POST /api/auth/login
   */
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.login(signInEmail.trim(), signInPassword.trim());
      setLoading(false);

      if (res.success || res.token || (res as any)._id) {
        const token = res.token || (res.data as any)?.token || (res as any).accessToken || "jwt-token";
        const user = res.user || res.doctor || (res.data as any)?.user || {
          email: signInEmail.trim(),
          role: "doctor",
        };

        login(signInEmail.trim(), token, user, false);
        setShowLoginModal(false);
        router.push("/");
      } else {
        setErrorMessage(res.message || "Sign In failed. Invalid email or password.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Sign In failed. Invalid email or password.");
    }
  };

  /**
   * FORGOT PASSWORD - STEP 1: Request OTP & Token
   * POST /api/auth/forgot-password { email }
   */
  const handleSendForgotPasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.forgotPassword(forgotEmail.trim());
      setLoading(false);

      if (res.success || (res as any).resetToken || (res as any).otp) {
        const token = (res as any).resetToken || (res as any).token || "";
        const devOtp = (res as any).otp || "";
        setResetToken(token);
        setServerResetOtp(devOtp);
        setForgotStep("verify_otp");
        setResendTimer(30);
        setSuccessMessage(`OTP sent to email ${forgotEmail.trim()}`);
      } else {
        setErrorMessage(res.message || "User with this email address not found.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "User with this email address not found.");
    }
  };

  /**
   * FORGOT PASSWORD - STEP 2: Verify OTP
   */
  const handleVerifyResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = resetOtp.join("");
    if (otpCode.length < 4) {
      setErrorMessage("Please enter complete 4-digit OTP code.");
      return;
    }

    // Verify OTP first! If server returned OTP or if checking against server, reject if invalid!
    if (serverResetOtp && otpCode !== serverResetOtp) {
      setErrorMessage("Invalid OTP code. Please check your email and enter the correct OTP.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage("OTP verified successfully! Please set your new password below.");
    setForgotStep("set_password");
  };

  /**
   * FORGOT PASSWORD - STEP 3: Submit Reset Password Payload
   * POST /api/auth/reset-password { token, otp, email, password, confirmPassword }
   */
  const handleCompleteResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = resetOtp.join("");
    if (otpCode.length < 4) {
      setErrorMessage("Please enter complete 4-digit OTP code.");
      setForgotStep("verify_otp");
      return;
    }
    if (!newPassword.trim()) {
      setErrorMessage("Please enter a new password.");
      return;
    }
    if (newPassword.trim().length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (confirmPassword.trim() && newPassword.trim() !== confirmPassword.trim()) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    const finalConfirmPassword = confirmPassword.trim() || newPassword.trim();

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authService.resetPassword({
        token: resetToken,
        otp: otpCode,
        email: forgotEmail.trim(),
        password: newPassword.trim(),
        confirmPassword: finalConfirmPassword,
      });

      setLoading(false);

      if (res.success) {
        setSuccessMessage("🎉 Password reset successfully! Please Sign In with your new password.");
        setSignInEmail(forgotEmail.trim());
        setSignInPassword(newPassword.trim());
        setActiveTab("login");
        setForgotStep("request_email");
        setResetOtp(["", "", "", ""]);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(res.message || "Password reset failed. Invalid or expired OTP code.");
        setForgotStep("verify_otp");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Password reset failed. Invalid or expired OTP code.");
      setForgotStep("verify_otp");
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    const numericVal = val.replace(/[^0-9]/g, '');
    const digit = numericVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (errorMessage) setErrorMessage(null);

    if (digit && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResetOtpChange = (val: string, index: number) => {
    const numericVal = val.replace(/[^0-9]/g, '');
    const digit = numericVal.slice(-1);
    const newOtp = [...resetOtp];
    newOtp[index] = digit;
    setResetOtp(newOtp);
    if (errorMessage) setErrorMessage(null);

    if (digit && index < 3) {
      const nextInput = document.getElementById(`reset-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleResetOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !resetOtp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resetState = () => {
    setShowLoginModal(false);
    setStep("details");
    setForgotStep("request_email");
    setErrorMessage(null);
    setSuccessMessage(null);
    setOtp(["", "", "", ""]);
    setResetOtp(["", "", "", ""]);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn font-sans">
      <div className="absolute inset-0" onClick={resetState} />
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-xl shadow-2xl overflow-hidden border border-white/80 animate-slideUp sm:animate-scaleUp flex flex-col relative max-h-[95vh] z-10" onClick={e => e.stopPropagation()}>
        
        {/* Header with Close Button and Brand Logo */}
        <div className="p-5 pb-3 bg-white border-b border-slate-100 relative">
          <button
            onClick={resetState}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pt-2 pb-1 text-center flex flex-col items-center justify-center">
            <Image
              src="/complete-logo.png"
              alt="Moncradel Logo"
              width={160}
              height={44}
              className="h-9 sm:h-10 w-auto object-contain mx-auto"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-5 pt-3 overflow-y-auto space-y-3">

          {/* Global Alert Messages */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-start gap-2 animate-fadeIn font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{errorMessage}</p>
                {errorMessage.includes("already exists") && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMessage(null);
                    }}
                    className="mt-1.5 bg-[#1E4E70] text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-2xs hover:bg-[#153852] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Switch to Sign In Mode</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2 animate-fadeIn font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: DOCTOR REGISTRATION FORM */}
          {activeTab === "register" && (
            <div>
              {step === "details" ? (
                /* Step 1: Basic Info & Send OTP to Email */
                <form onSubmit={handleSendRegisterOtp} className="space-y-3.5 sm:space-y-4 animate-fadeIn">
                  <div className="text-center pb-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Doctor Registration
                    </h3>
                  </div>

                  {/* Doctor Full Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">Doctor Full Name*</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="e.g. Dr. Sumit Sahu"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">Email Address*</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        placeholder="dr.sumitsahu@moncradel.com"
                        value={doctorEmail}
                        onChange={(e) => setDoctorEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">Mobile Number*</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        maxLength={15}
                        placeholder="98765 43210"
                        value={mobileNumber}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input with Show/Hide Toggle */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">Password*</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                        title={showRegPassword ? "Hide password" : "Show password"}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  {/* SEND OTP TO EMAIL BUTTON */}
                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={loading || !doctorName.trim() || !doctorEmail.trim()}
                      className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
                        doctorName.trim() && doctorEmail.trim()
                          ? "bg-[#1E4E70] hover:bg-[#153852] text-white cursor-pointer active:scale-[0.98]"
                          : "bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <span>Sending OTP to Email...</span>
                      ) : (
                        <>
                          <span>SEND OTP TO EMAIL</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Switch to Sign In Footer Option */}
                  <div className="pt-1.5 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-600 font-medium">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("login");
                          setStep("details");
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="font-bold text-[#1E4E70] hover:underline cursor-pointer ml-1"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* Step 2: Email OTP Input & Complete Register */
                <form onSubmit={handleCompleteRegister} className="space-y-4 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-500 font-medium">
                      Enter the 4-digit OTP sent to <span className="font-bold text-slate-800">{doctorEmail}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 py-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-12 h-12 bg-[#F5F5F7] border border-slate-200 rounded-lg text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 4}
                    className={`w-full py-3.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                      otp.join("").length === 4
                        ? "bg-[#1E4E70] hover:bg-[#153852] text-white cursor-pointer active:scale-[0.98]"
                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <span>Registering Doctor Account...</span>
                    ) : (
                      <span>VERIFY OTP & REGISTER</span>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="text-slate-500 hover:text-slate-800 font-medium"
                    >
                      ← Back to Details
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleResendOtp}
                      className={`font-semibold transition-colors flex items-center gap-1 ${
                        resendTimer > 0
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-[#1E4E70] hover:underline cursor-pointer"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      <span>
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CLEAN EMAIL & PASSWORD SIGN IN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-3.5 sm:space-y-4 animate-fadeIn">
              <div className="text-center pb-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Doctor Sign In
                </h3>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 block">Email Address*</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    placeholder="dr.sumitsahu@moncradel.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 block">Password*</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                    title={showSignInPassword ? "Hide password" : "Show password"}
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgot_password");
                    setForgotStep("request_email");
                    setForgotEmail(signInEmail || "");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-semibold text-[#1E4E70] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#1E4E70]" />
                  <span>Forgot Password?</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !signInEmail.trim() || !signInPassword.trim()}
                className={`w-full py-3.5 sm:py-4 rounded-xl font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
                  signInEmail.trim() && signInPassword.trim()
                    ? "bg-[#1E4E70] hover:bg-[#153852] text-white cursor-pointer active:scale-[0.98]"
                    : "bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>SIGN IN WITH EMAIL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Switch to Register Footer Option */}
              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-xs text-slate-600 font-medium">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("register");
                      setStep("details");
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="font-bold text-[#1E4E70] hover:underline cursor-pointer ml-1"
                  >
                    Register Now
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 3: 3-STEP FORGOT & RESET PASSWORD FLOW */}
          {activeTab === "forgot_password" && (
            <div className="space-y-4 animate-fadeIn">
              {forgotStep === "request_email" && (
                /* FORGOT STEP 1: Enter Registered Email Address */
                <form onSubmit={handleSendForgotPasswordOtp} className="space-y-3.5">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-[#1E4E70]" />
                      <span>Forgot Password?</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Enter your registered email address below. We will send you a 4-digit OTP code to verify and reset your password.
                    </p>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">Email Address*</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        placeholder="dr.sumitsahu@moncradel.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !forgotEmail.trim()}
                    className={`w-full py-3.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                      forgotEmail.trim()
                        ? "bg-[#1E4E70] hover:bg-[#153852] text-white cursor-pointer active:scale-[0.98]"
                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <span>Sending Reset OTP...</span>
                    ) : (
                      <>
                        <span>SEND RESET OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("login");
                        setErrorMessage(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === "verify_otp" && (
                /* FORGOT STEP 2: Verify 4-Digit OTP BEFORE Password Creation */
                <form onSubmit={handleVerifyResetOtp} className="space-y-4 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-slate-800">
                      Verify Reset OTP
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Enter the 4-digit OTP sent to <span className="font-bold text-slate-800">{forgotEmail}</span>
                    </p>
                  </div>

                  {/* 4-Digit OTP Code Input */}
                  <div className="flex justify-center gap-3 py-2">
                    {resetOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`reset-otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleResetOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleResetOtpKeyDown(e, idx)}
                        className="w-12 h-12 bg-[#F5F5F7] border border-slate-200 rounded-lg text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E4E70]"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || resetOtp.join("").length < 4}
                    className={`w-full py-3.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                      resetOtp.join("").length === 4
                        ? "bg-[#1E4E70] hover:bg-[#153852] text-white cursor-pointer active:scale-[0.98]"
                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                    }`}
                  >
                    <span>VERIFY OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep("request_email")}
                      className="text-slate-500 hover:text-slate-800 font-medium"
                    >
                      ← Change Email
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || loading}
                      onClick={handleResendOtp}
                      className={`font-semibold transition-colors flex items-center gap-1 ${
                        resendTimer > 0
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-[#1E4E70] hover:underline cursor-pointer"
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      <span>
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {forgotStep === "set_password" && (
                /* FORGOT STEP 3: Create New Password (ONLY Shown After Valid OTP Verification) */
                <form onSubmit={handleCompleteResetPassword} className="space-y-3.5 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>OTP Verified! Set New Password</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Enter your new password for account <span className="font-bold text-slate-800">{forgotEmail}</span>
                    </p>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">New Password*</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                        title={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 block">Confirm New Password*</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-slate-400 shrink-0" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className="w-full bg-[#F8FAFC] focus:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E4E70] focus:border-[#1E4E70] transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newPassword.trim()}
                    className={`w-full py-3.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                      newPassword.trim()
                        ? "bg-[#1E4E70] hover:bg-[#153852] text-white cursor-pointer active:scale-[0.98]"
                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <span>Resetting Password...</span>
                    ) : (
                      <span>RESET PASSWORD & SIGN IN</span>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep("verify_otp")}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to OTP Verification</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
