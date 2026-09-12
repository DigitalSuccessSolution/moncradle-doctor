"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Save,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  Award,
  Clock,
  FileText,
  Camera,
  UserCheck,
  Upload,
  CreditCard,
  Languages,
  IndianRupee,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Check,
  MapPin,
  Stethoscope,
  Briefcase,
  Calendar,
  Loader2,
  X,
} from "lucide-react";
import { useDoctorData } from "@/context/DoctorDataContext";
import { authService } from "@/services/authService";
import { DoctorProfile } from "@/types";

const STEPS = [
  { id: 1, title: "Identity & Photo", icon: Camera, subtitle: "Doctor photo & display name" },
  { id: 2, title: "Credentials", icon: Award, subtitle: "Medical license & degrees" },
  { id: 3, title: "Clinic & OPD", icon: Building, subtitle: "Practice location & OPD hours" },
  { id: 4, title: "Bank Details", icon: CreditCard, subtitle: "Bank account for payouts" },
  { id: 5, title: "Bio & Summary", icon: FileText, subtitle: "Clinical bio & overview" },
];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Chandigarh",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry"
];

export default function EditDoctorProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const { doctorProfile, updateDoctorProfile, isAuthenticated, isProfileComplete, approvalStatus, setShowLoginModal, setApprovalStatus } = useDoctorData();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DoctorProfile>({ ...doctorProfile, gender: doctorProfile?.gender || "Female" });
  const [degreesText, setDegreesText] = useState(doctorProfile?.title || "");
  const [qualificationsText, setQualificationsText] = useState(doctorProfile?.specialization || "");
  const [languagesText, setLanguagesText] = useState(doctorProfile?.languagesSpoken?.join(", ") || "");
  const [consultationFee, setConsultationFee] = useState<number | "">(doctorProfile?.consultationFee || "");

  // Bank details matching Postman PUT /api/users/profile
  const [bankAccountName, setBankAccountName] = useState(doctorProfile?.fullName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfscCode, setBankIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [selectedAvatar, setSelectedAvatar] = useState(doctorProfile?.avatar || "/doctor_female.png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        ...doctorProfile,
        gender: doctorProfile.gender || "Female",
        city: doctorProfile.city || "",
        state: doctorProfile.state || "",
        pincode: doctorProfile.pincode || "",
        clinicAddress: doctorProfile.clinicAddress || "",
        bio: doctorProfile.bio || doctorProfile.about || ""
      });
      setSelectedAvatar(doctorProfile.avatar || "/doctor_female.png");
      if (doctorProfile.degrees && Array.isArray(doctorProfile.degrees) && doctorProfile.degrees.length > 0) {
        setDegreesText(doctorProfile.degrees.join(", "));
      }
      if (doctorProfile.qualifications && Array.isArray(doctorProfile.qualifications) && doctorProfile.qualifications.length > 0) {
        setQualificationsText(doctorProfile.qualifications.join(", "));
      }
      if (doctorProfile.languagesSpoken && Array.isArray(doctorProfile.languagesSpoken) && doctorProfile.languagesSpoken.length > 0) {
        setLanguagesText(doctorProfile.languagesSpoken.join(", "));
      }
      if (doctorProfile.consultationFee) {
        setConsultationFee(doctorProfile.consultationFee);
      }

      if (doctorProfile.bankDetails) {
        if (doctorProfile.bankDetails.accountName) setBankAccountName(doctorProfile.bankDetails.accountName);
        if (doctorProfile.bankDetails.accountNumber) setBankAccountNumber(doctorProfile.bankDetails.accountNumber);
        if (doctorProfile.bankDetails.ifscCode) setBankIfscCode(doctorProfile.bankDetails.ifscCode);
        if (doctorProfile.bankDetails.bankName) setBankName(doctorProfile.bankDetails.bankName);
      }
    }
  }, [doctorProfile]);

  // Prevent background scrolling when error modal is open
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fieldErrors]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setSelectedAvatar(compressedDataUrl);
          setFormData((prev) => ({ ...prev, avatar: compressedDataUrl }));
          setHasNewPhoto(true);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [currentStep]);

  const handleSubmit = async (e?: React.FormEvent, shouldRedirect: boolean = true) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    const degreesArr = degreesText.split(",").map((s) => s.trim()).filter(Boolean);
    const qualificationsArr = qualificationsText.split(",").map((s) => s.trim()).filter(Boolean);
    const languagesArr = languagesText.split(",").map((s) => s.trim()).filter(Boolean);

    const postmanPayload = {
      name: formData.fullName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      avatar: selectedAvatar || formData.avatar,
      gender: formData.gender || "",
      specialization: formData.specialization || "",
      experienceYears: parseInt(formData.experience) || 0,
      clinicName: formData.hospital || "",
      clinicAddress: formData.clinicAddress || formData.hospital || "",
      city: formData.city || "",
      state: formData.state || "",
      pincode: formData.pincode || "",
      registrationNumber: formData.licenseNumber || "",
      degrees: degreesArr,
      qualifications: qualificationsArr,
      languagesSpoken: languagesArr,
      consultationFee: Number(consultationFee) || 0,
      isAvailable: true,
      about: formData.bio || formData.about || "",
      bankDetails: {
        accountName: bankAccountName || formData.fullName || "",
        accountNumber: bankAccountNumber || "",
        ifscCode: bankIfscCode || "",
        bankName: bankName || "",
      },
    };

    const isFirstTimeSubmission = !isProfileComplete || approvalStatus !== "approved";

    const updatedProfileObj = {
      ...formData,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      avatar: selectedAvatar || formData.avatar,
      gender: formData.gender,
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      hospital: formData.hospital,
      clinicAddress: formData.clinicAddress || formData.hospital,
      city: formData.city || "",
      state: formData.state || "",
      pincode: formData.pincode || "",
      experience: formData.experience,
      consultationFee: Number(consultationFee),
      degrees: degreesArr,
      qualifications: qualificationsArr,
      languagesSpoken: languagesArr,
      bankDetails: postmanPayload.bankDetails,
      about: formData.bio || formData.about || "",
      bio: formData.bio || formData.about || "",
    };

    try {
      const res: any = await authService.updateProfile(postmanPayload);
      if (isFirstTimeSubmission) {
        updateDoctorProfile(updatedProfileObj, true);
        setApprovalStatus("pending");
      } else {
        updateDoctorProfile(updatedProfileObj, true);
        setApprovalStatus("approved");
      }

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        if (shouldRedirect) {
          router.push("/profile");
        }
      }, 1500);

    } catch (err: any) {
      console.warn("Backend update API failed:", err);
      let newFieldErrors: Record<string, string> = {};

      if (err.response?.data) {
        if (Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
          err.response.data.errors.forEach((e: any) => {
            if (e.path && e.path[0]) {
              newFieldErrors[e.path[0]] = e.message;
            }
          });
        } else if (err.response.data.message) {
          newFieldErrors["general"] = err.response.data.message;
        }
      } else if (err.message) {
        newFieldErrors["general"] = err.message;
      }

      if (Object.keys(newFieldErrors).length === 0) {
        newFieldErrors["general"] = "Failed to update profile. Please try again.";
      }

      setFieldErrors(newFieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl border border-slate-200 text-center space-y-4 font-sans animate-fadeIn my-12 shadow-sm">
        <div className="w-12 h-12 rounded-lg bg-[#A5D8FF]/30 text-[#1E4E70] mx-auto flex items-center justify-center">
          <UserCheck className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Login Required</h2>
        <p className="text-xs text-slate-500">
          Please sign in to your doctor account to edit your professional profile and credentials.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="w-full bg-[#1E4E70] hover:bg-[#153852] text-white font-semibold text-xs py-3 rounded-lg cursor-pointer transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const progressPercent = isProfileComplete ? 100 : (currentStep / STEPS.length) * 100;

  return (
    <div className="space-y-4 animate-fadeIn pb-16 sm:pb-20 font-sans">

      {/* FIRST TIME ONBOARDING INCOMPLETE BANNER */}
      {!isProfileComplete && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-lg flex items-center gap-3 animate-fadeIn shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-xs font-bold">Mandatory Doctor Onboarding</p>
            <p className="text-[11px] text-amber-800 font-normal">
              Complete all steps to submit your profile for admin verification.
            </p>
          </div>
        </div>
      )}

      {/* SAVE SUCCESS BANNER TOAST / POPUP */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-lg flex items-start gap-3 animate-fadeIn shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-emerald-900">
              {approvalStatus === "pending"
                ? "Initial Profile Submitted for Admin Verification!"
                : "Profile Details Updated Successfully!"}
            </p>
            <p className="text-[11px] sm:text-xs text-emerald-700">
              {approvalStatus === "pending"
                ? "Your initial registration is pending admin approval. Redirecting..."
                : "Your changes have been saved. You can continue using your doctor panel."}
            </p>
          </div>
        </div>
      )}

      {/* ERROR MODAL / POPUP */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-red-100 overflow-hidden">
            <div className="bg-red-50 border-b border-red-100 p-4 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <h3 className="text-sm font-bold text-red-900">Action Required</h3>
              </div>
              <button
                onClick={() => setFieldErrors({})}
                className="text-red-400 hover:text-red-700 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 bg-white space-y-3">
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                Please fix the following errors to save your profile:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-red-600 font-medium">
                {Object.entries(fieldErrors).map(([field, msg], idx) => {
                  const displayField = field === "general" ? "" : field.charAt(0).toUpperCase() + field.slice(1) + ": ";
                  return <li key={idx}>{displayField}{msg}</li>;
                })}
              </ul>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setFieldErrors({})}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start mt-2">
        {/* LEFT SIDEBAR (Desktop Tabs / Mobile Horizontal Scroll) */}
        <div className="w-full lg:w-72 shrink-0 space-y-3 lg:sticky lg:top-24 z-10">
          <h2 className="hidden lg:block text-lg font-bold text-slate-800 mb-4 px-1">Edit Profile</h2>

          <div ref={tabsContainerRef} className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 thin-scrollbar w-full">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id || isProfileComplete;
              return (
                <button
                  key={step.id}
                  data-step={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  disabled={!isProfileComplete && currentStep < step.id}
                  className={`flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left transition-all shrink-0 lg:w-full border cursor-pointer ${isActive
                      ? "bg-[#1E4E70] text-white border-[#1E4E70] shadow-md"
                      : isPast
                        ? "bg-white text-slate-700 hover:bg-slate-50 border-slate-200/80 shadow-xs"
                        : "bg-slate-50 text-slate-400 border-slate-100 opacity-60"
                    }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/20 text-white" : isPast ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    }`}>
                    {isPast && !isActive ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="hidden lg:block min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-slate-900"}`}>{step.title}</p>
                    <p className={`text-[10px] truncate ${isActive ? "text-sky-100" : "text-slate-500"}`}>{step.subtitle}</p>
                  </div>
                  <div className="lg:hidden">
                    <p className="text-xs font-bold">{step.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* MOBILE ONLY PROGRESS BAR */}
          <div className="lg:hidden bg-white rounded-xl p-3 sm:p-4 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500">Step {currentStep} of {STEPS.length}</span>
              <span className="text-[#1E4E70]">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1E4E70] h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* MAIN DETAILS CONTAINER (RIGHT COLUMN) */}
        <div className="flex-1 w-full min-w-0 space-y-4">

          {/* STEP 1: DOCTOR PHOTO & IDENTITY */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1E4E70]" />
                  <span>Doctor Photo & Identity</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Upload a professional photo and confirm your full display name.
                </p>
              </div>

              {/* PHOTO UPLOAD CONTAINER CARD */}
              <div className="bg-[#F8FAFC] p-5 sm:p-6 rounded-lg border border-slate-200/70 flex flex-col md:flex-row items-center justify-between gap-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {/* MAIN AVATAR & GENDER SELECTOR */}
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#1E4E70] shadow-md relative bg-white">
                      <Image
                        src={selectedAvatar}
                        alt="Doctor Profile Photo"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-[#1E4E70] text-white rounded-full border-2 border-white shadow-md hover:bg-[#153852] transition-transform active:scale-90 cursor-pointer"
                      title="Change Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender</span>
                    <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg shadow-xs">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${formData.gender === g
                              ? 'bg-[#1E4E70] text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* UPLOAD CUSTOM BUTTON */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">Custom Doctor Photo</h4>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Visible to parents on prescriptions, charts & chat. (Max 5MB)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      if (hasNewPhoto) {
                        handleSubmit(e, false);
                        setHasNewPhoto(false);
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${hasNewPhoto ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#1E4E70] hover:bg-[#153852]"}`}
                  >
                    {hasNewPhoto ? <Check className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{hasNewPhoto ? (isSubmitting ? "Saving..." : "Save New Photo") : "Upload Custom Photo"}</span>
                  </button>
                </div>
              </div>

              {/* FORM INPUT FIELDS */}
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Full Name (with Prefix)*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName || ""}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Dr. Sumit Sahu"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>Email Address*</span>
                    </label>
                    <input
                      type="email"
                      required
                      readOnly
                      value={formData.email || ""}
                      placeholder="dr.sumitsahu@moncradle.com"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none text-slate-500 cursor-not-allowed opacity-90"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>Mobile / Phone Number*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border ${fieldErrors.phone ? 'border-red-400' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Primary Specialization*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specialization || ""}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Pediatric Nutrition & Neonatal Care"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MEDICAL CREDENTIALS */}
          {currentStep === 2 && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1E4E70]" />
                  <span>Medical Credentials & Registration</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Medical council registration and academic degrees for verification.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Medical Council Registration Number*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber || ""}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="MCI-123456 / MED-884920"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Medical Degrees (comma-separated)*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={degreesText}
                    onChange={(e) => setDegreesText(e.target.value)}
                    placeholder="MBBS, MD Pediatrics"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Additional Qualifications</span>
                  </label>
                  <input
                    type="text"
                    value={qualificationsText}
                    onChange={(e) => setQualificationsText(e.target.value)}
                    placeholder="Child Nutrition Specialist, Fellowship in Neonatology"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Clinical Experience (Years)*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.experience || ""}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="10"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CLINIC & OPD SCHEDULE */}
          {currentStep === 3 && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#1E4E70]" />
                  <span>Clinic & OPD Schedule</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Your practice location, fee, and daily availability hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Clinic / Hospital Name*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hospital || ""}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="Moncradle Pediatric Care Hub"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                {/* DEDICATED STATE & CITY FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>State / Union Territory*</span>
                    </label>
                    <select
                      value={formData.state || ""}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900 cursor-pointer"
                    >
                      <option value="">Select State / UT</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>City*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai, Indore, Jaipur"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* PIN CODE & STREET ADDRESS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>PIN Code</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={formData.pincode || ""}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="e.g. 400050"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>Street Address / OPD Wing</span>
                    </label>
                    <input
                      type="text"
                      value={formData.clinicAddress || ""}
                      onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                      placeholder="e.g. Suite 402, Care Hub, Bandra West"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-normal">
                  Tip: Selecting your exact State & City ensures parents in your region can easily find you.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>Languages Spoken</span>
                    </label>
                    <input
                      type="text"
                      value={languagesText}
                      onChange={(e) => setLanguagesText(e.target.value)}
                      placeholder="Hindi, English"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>Consultation Fee (₹)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={consultationFee || ""}
                      onChange={(e) => setConsultationFee(Number(e.target.value.replace(/[^0-9]/g, '')) || "")}
                      placeholder="500"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BANK ACCOUNT & PAYOUTS */}
          {currentStep === 4 && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#1E4E70]" />
                  <span>Bank Account Details (For Payouts)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Enter payout account for consultation settlement transfers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Account Holder Name</span>
                  </label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    placeholder="Dr. Sarah Chen"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>Account Number</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456789012"
                    className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>IFSC Code</span>
                    </label>
                    <input
                      type="text"
                      value={bankIfscCode}
                      onChange={(e) => setBankIfscCode(e.target.value)}
                      placeholder="SBIN0001234"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white uppercase text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#1E4E70]" />
                      <span>Bank Name</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="State Bank of India"
                      className="w-full text-xs sm:text-sm font-medium px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CLINICAL BIO & OVERVIEW SUMMARY */}
          {currentStep === 5 && (
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 animate-fadeIn">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1E4E70]" />
                  <span>Clinical Bio & Profile Overview</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Write your doctor summary and preview final profile details.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#1E4E70]" />
                    <span>About Doctor / Clinical Bio</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio || ""}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Specialized in pediatric growth tracking, infant nutrition diets, WHO growth curve evaluation..."
                    className="w-full text-xs sm:text-sm font-medium p-4 bg-[#F8FAFC] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4E70] focus:bg-white text-slate-900 resize-none"
                  />
                </div>

                {/* PROFILE SUMMARY OVERVIEW CARD */}
                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1E4E70] relative bg-white shrink-0">
                      <Image
                        src={selectedAvatar}
                        alt={formData.fullName || "Doctor"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{formData.fullName || "Name pending..."}</h4>
                      <p className="text-[11px] font-semibold text-[#1E4E70]">{formData.specialization || "-"}</p>
                    </div>
                  </div>

                  {/* DETAILS GRID */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Email Address</span>
                      <span className="font-semibold text-slate-800 truncate block">{formData.email || "-"}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Mobile Number</span>
                      <span className="font-semibold text-slate-800 truncate block">{formData.phone || "-"}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Reg. Number</span>
                      <span className="font-semibold text-slate-800 truncate block">{formData.licenseNumber || "-"}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Degrees</span>
                      <span className="font-semibold text-slate-800 truncate block">{degreesText || "-"}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Hospital / Clinic</span>
                      <span className="font-semibold text-slate-800 truncate block">{formData.hospital || "-"}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Location</span>
                      <span className="font-semibold text-slate-800 truncate block">{[formData.city, formData.state].filter(Boolean).join(", ") || "-"}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-100 col-span-2">
                      <span className="text-[10px] text-slate-400 font-semibold block">Consultation Fee</span>
                      <span className="font-semibold text-slate-800 truncate block">₹{consultationFee || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION CONTROL BAR (STATIC INLINE) */}
          <div className="w-full bg-white border border-slate-200/80 p-3.5 shadow-xs rounded-2xl mt-6">
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">

              {/* BACK BUTTON */}
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-5 py-3.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${currentStep === 1
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95"
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* SAVE CHANGES BUTTON (Available on all steps if profile is already complete) */}
              {isProfileComplete && approvalStatus === "approved" && (
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-semibold py-3.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{isSubmitting ? "Saving..." : "Save Changes"}</span>
                  <span className="sm:hidden">{isSubmitting ? "..." : "Save"}</span>
                </button>
              )}

              {/* NEXT STEP / SUBMIT BUTTON */}
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-[#1E4E70] hover:bg-[#153852] text-white text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, true)}
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : !isProfileComplete || approvalStatus !== "approved"
                        ? "Submit Profile"
                        : "Save & Exit"}
                  </span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
