"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Patient,
  Appointment,
  MedicalNote,
  Prescription,
  NutritionPlan,
  NotificationItem,
  DoctorProfile,
  DEFAULT_DOCTOR_PROFILE,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTES,
  INITIAL_NOTIFICATIONS,
  SAMPLE_NUTRITION_PLAN,
  maskPhoneNumber,
} from "@/data/mockData";
import { getStoredToken, setStoredToken } from "@/services/apiClient";
import { authService } from "@/services/authService";
import { babyService, transformBackendBabyToPatient } from "@/services/babyService";
import { appointmentService, transformBackendAppointmentToFrontend } from "@/services/appointmentService";
import { prescriptionService, transformBackendPrescriptionToFrontend } from "@/services/prescriptionService";
import { nutritionService, transformBackendNutritionPlanToFrontend } from "@/services/nutritionService";
import { requestForToken, setupMessageListener } from "@/lib/firebase";
import { useRouter } from "next/navigation";


interface DoctorDataContextType {
  doctorProfile: DoctorProfile;
  updateDoctorProfile: (profile: Partial<DoctorProfile>, markComplete?: boolean) => void;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  notes: MedicalNote[];
  prescriptions: Prescription[];
  nutritionPlans: Record<string, NutritionPlan>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  addPatient: (data: Partial<Patient> & { name: string }) => Patient;
  addAppointment: (data: Partial<Appointment> & { patientId: string; patientName: string; time: string; type: Appointment["type"] }) => Appointment;
  addMedicalNote: (data: Partial<MedicalNote> & { patientId: string; patientName: string; assessment: string }) => MedicalNote;
  addPrescription: (data: Partial<Prescription> & { patientId: string; patientName: string; diagnosis: string }) => Prescription;
  removePrescription: (id: string) => void;
  updateNutritionPlan: (patientId: string, plan: Partial<NutritionPlan>) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  addNotification: (notif: Omit<NotificationItem, "id">) => void;
  isAuthenticated: boolean;
  authToken: string | null;
  isProfileComplete: boolean;
  setIsProfileComplete: (complete: boolean) => void;
  approvalStatus: "approved" | "pending";
  setApprovalStatus: (status: "approved" | "pending") => void;
  login: (mobileOrEmail?: string, token?: string, userData?: any, isNewUser?: boolean) => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  activePolicy: string | null;
  setActivePolicy: (policy: string | null) => void;
  showWelcomeScreen: boolean;
  setShowWelcomeScreen: (show: boolean) => void;
  isHydrated: boolean;
  isDataLoading: boolean;
}

const DEFAULT_PRESCRIPTIONS: Prescription[] = [
  {
    id: "rx-1",
    patientId: "1",
    patientName: "Leo Henderson",
    date: "2026-07-20",
    diagnosis: "Mild upper respiratory tract congestion & iron deficiency",
    doctorName: "Dr. Sarah Chen",
    items: [
      {
        medicineName: "Pediatric Iron Drops (Ferrous Ascorbate)",
        dosage: "1 ml (15 mg)",
        frequency: "Once daily after morning feed",
        duration: "30 Days",
        instructions: "Do not give with milk; give with citrus fruit juice for absorption.",
      },
      {
        medicineName: "Vitamin D3 Oral Drops (400 IU)",
        dosage: "0.5 ml (400 IU)",
        frequency: "Once daily",
        duration: "60 Days",
        instructions: "Direct oral administration.",
      },
    ],
  },
  {
    id: "rx-2",
    patientId: "2",
    patientName: "Maya Chen",
    date: "2026-07-28",
    diagnosis: "Feeding intolerance & low weight velocity",
    doctorName: "Dr. Sharma",
    items: [
      {
        medicineName: "Hydrolyzed Infant Formula Supplement",
        dosage: "30 ml per feed",
        frequency: "Every 3 hours",
        duration: "14 Days",
        instructions: "Mix thoroughly with warm sterilized water.",
      },
      {
        medicineName: "Pediatric Probiotic Oral Drops",
        dosage: "5 drops",
        frequency: "Once daily",
        duration: "10 Days",
        instructions: "Administer before morning feed.",
      },
    ],
  },
];

const DoctorDataContext = createContext<DoctorDataContextType | undefined>(undefined);

export function DoctorDataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<MedicalNote[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("1");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(DEFAULT_DOCTOR_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "pending">("approved");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(true);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  
  const router = useRouter();

  // Listen for foreground push notifications
  useEffect(() => {
    let unsubscribe: any;
    
    if (isAuthenticated) {
      setupMessageListener((payload) => {
        const title = payload.notification?.title || "New Notification";
        const options = {
          body: payload.notification?.body || "",
          icon: '/moncradle-icon.png',
        };
        
        // Show native browser notification even when app is open
        if ('Notification' in window && Notification.permission === 'granted') {
          const notification = new Notification(title, options);
          
          notification.onclick = function() {
            window.focus();
            if (payload.data?.url) {
              router.push(payload.data.url);
            }
            this.close();
          };
        }
      }).then((unsub: any) => {
        unsubscribe = unsub;
      });
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [isAuthenticated, router]);

  const updateDoctorProfile = (updated: Partial<DoctorProfile>, markComplete: boolean = false) => {
    setDoctorProfile((prev) => {
      const next = { ...prev, ...updated };
      saveToStorage("moncradle_doctor_profile", next);
      return next;
    });
    if (markComplete) {
      setIsProfileComplete(true);
      // Only set approval status to pending if account was not already approved
      if (approvalStatus !== "approved") {
        setApprovalStatus("pending");
        try {
          localStorage.setItem("moncradle_doctor_profile_complete", "true");
          localStorage.setItem("moncradle_doctor_approval_status", "pending");
        } catch (e) {}
      } else {
        try {
          localStorage.setItem("moncradle_doctor_profile_complete", "true");
          localStorage.setItem("moncradle_doctor_approval_status", "approved");
        } catch (e) {}
      }
    }
    // Sync profile to backend API
    authService.updateProfile(updated).catch(() => {});
  };

  const [nutritionPlans, setNutritionPlans] = useState<Record<string, NutritionPlan>>({
    "1": SAMPLE_NUTRITION_PLAN,
    "2": {
      patientId: "2",
      targetCalories: 1400,
      targetProtein: 45,
      targetIron: 15,
      targetAchievementPercent: 62,
      focusText: "High calorie density and hydrolyzed protein support for rapid catch-up growth.",
      focusImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
      meals: [
        {
          id: "m2-1",
          meal: "Breakfast",
          time: "07:30 AM",
          title: "Hydrolyzed Formula & Rice Cereal",
          description: "Warm formula with 1 tbsp iron-fortified rice cereal.",
          tags: ["CATCH-UP", "IRON+"],
          iconType: "sun",
        },
        {
          id: "m2-2",
          meal: "Lunch",
          time: "12:00 PM",
          title: "Mashed Avocado & Pumpkin Purée",
          description: "High healthy fat blend for calorie density.",
          tags: ["HEALTHY FATS", "EASY DIGEST"],
          iconType: "utensils",
        },
      ],
    },
    "3": {
      patientId: "3",
      targetCalories: 2100,
      targetProtein: 75,
      targetIron: 14,
      targetAchievementPercent: 92,
      focusText: "Active growth phase diet with varied vegetables and legume proteins.",
      focusImage: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=800",
      meals: [
        {
          id: "m3-1",
          meal: "Breakfast",
          time: "08:00 AM",
          title: "Banana & Oat Smoothie",
          description: "Whole milk blend with oats and chia seeds.",
          tags: ["PROTEIN", "ENERGY"],
          iconType: "sun",
        },
      ],
    },
  });

  // Hydrate from localStorage on client side
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem("moncradle_doctor_patients");
      if (storedPatients) setPatients(JSON.parse(storedPatients));

      const storedApts = localStorage.getItem("moncradle_doctor_apts");
      if (storedApts) {
        const parsed: Appointment[] = JSON.parse(storedApts);
        const sanitized = parsed.map((a) => ({
          ...a,
          type: a.type === ("General Checkup" as any) ? "OPD Checkup" : a.type === ("Nutrition Consultation" as any) ? "Diet Plan" : a.type,
        }));
        setAppointments(sanitized);
      }

      const storedNotes = localStorage.getItem("moncradle_doctor_notes");
      if (storedNotes) setNotes(JSON.parse(storedNotes));

      const storedRx = localStorage.getItem("moncradle_doctor_rx");
      if (storedRx) setPrescriptions(JSON.parse(storedRx));

      const storedProfile = localStorage.getItem("moncradle_doctor_profile");
      if (storedProfile) setDoctorProfile(JSON.parse(storedProfile));

      const storedToken = getStoredToken();
      if (storedToken) {
        setAuthToken(storedToken);
        setIsAuthenticated(true);
        // Sync doctor profile from backend API GET /api/users/profile
        authService.fetchProfile().then((res: any) => {
          if (res.success || res.user || res.profile) {
            const user = res.user || res.data?.user;
            const profile = res.profile || res.data?.profile || res.data;

            // Check profile.verificationStatus from backend payload
            const vStatus = profile?.verificationStatus || user?.verificationStatus || user?.approvalStatus;
            const isApproved = vStatus === "approved" || vStatus === "verified";

            setApprovalStatus(isApproved ? "approved" : "pending");
            try {
              localStorage.setItem("moncradle_doctor_approval_status", isApproved ? "approved" : "pending");
            } catch (e) {}

            updateDoctorProfile({
              fullName: user?.name || doctorProfile.fullName,
              email: user?.email || doctorProfile.email,
              phone: user?.phone || doctorProfile.phone,
              avatar: user?.avatar || doctorProfile.avatar,
              specialization: profile?.specialization || doctorProfile.specialization,
              licenseNumber: profile?.registrationNumber || doctorProfile.licenseNumber,
              hospital: profile?.clinicName || doctorProfile.hospital,
              clinicAddress: profile?.clinicAddress || doctorProfile.clinicAddress,
              experience: profile?.experienceYears ? `${profile.experienceYears} Years` : doctorProfile.experience,
              consultationFee: profile?.consultationFee || doctorProfile.consultationFee,
              degrees: profile?.degrees || doctorProfile.degrees,
              qualifications: profile?.qualifications || doctorProfile.qualifications,
              languagesSpoken: profile?.languagesSpoken || doctorProfile.languagesSpoken,
              bankDetails: profile?.bankDetails || doctorProfile.bankDetails,
              about: profile?.about || doctorProfile.about,
              availability: profile?.availability || doctorProfile.availability,
            });
            
            // Prompt for notification permission automatically on load
            if ('Notification' in window) {
              requestForToken().then(fcmToken => {
                if (fcmToken) {
                  authService.updateProfile({ fcmToken }).catch(console.error);
                }
              }).catch(console.error);
            }
          }
        }).catch(() => {});

        // Fetch real patients/babies from backend API GET /api/babies
        babyService.fetchBabies().then((res: any) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const apiPatients = res.data.map(transformBackendBabyToPatient);
            setPatients(apiPatients);
            saveToStorage("moncradle_doctor_patients", apiPatients);
          }
        }).catch(() => {});

        // Fetch real appointments from backend API GET /api/appointments
        appointmentService.fetchAppointments().then((res: any) => {
          if (res.success && Array.isArray(res.data)) {
            const apiAppointments = res.data.map(transformBackendAppointmentToFrontend);
            setAppointments(apiAppointments);
            saveToStorage("moncradle_doctor_apts", apiAppointments);
          }
        }).catch(() => {});

        // Fetch real prescriptions from backend API GET /api/prescriptions
        prescriptionService.getAllPrescriptions().then((res: any) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const apiRx = res.data.map(transformBackendPrescriptionToFrontend);
            setPrescriptions(apiRx);
            saveToStorage("moncradle_doctor_rx", apiRx);
          }
        }).catch(() => {});

        // Fetch real nutrition plans from backend API GET /api/nutrition-plans
        nutritionService.getAllNutritionPlans().then((res: any) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const plansMap: Record<string, NutritionPlan> = {};
            res.data.forEach((p: any) => {
              const mapped = transformBackendNutritionPlanToFrontend(p);
              if (mapped.patientId) {
                plansMap[mapped.patientId] = mapped;
              }
            });
            if (Object.keys(plansMap).length > 0) {
              setNutritionPlans((prev) => ({ ...prev, ...plansMap }));
            }
          }
        }).catch(() => {});
      } else {
        const storedAuth = localStorage.getItem("moncradle_doctor_auth");
        if (storedAuth === "true") setIsAuthenticated(true);
      }

      const storedComplete = localStorage.getItem("moncradle_doctor_profile_complete");
      if (storedComplete !== null) {
        setIsProfileComplete(storedComplete === "true");
      }

      const storedApproval = localStorage.getItem("moncradle_doctor_approval_status");
      if (storedApproval === "pending" || storedApproval === "approved") {
        setApprovalStatus(storedApproval as "approved" | "pending");
      }

      const welcomeDone = sessionStorage.getItem("moncradle_doctor_welcome_done");
      if (welcomeDone === "true") setShowWelcomeScreen(false);
    } catch (e) {
      console.error("Failed to load local storage state", e);
    } finally {
      setIsHydrated(true);
      // Give a slight delay to ensure all async fetches are initialized before hiding loader
      setTimeout(() => setIsDataLoading(false), 1500);
    }
  }, []);

  const login = (mobileOrEmail?: string, token?: string, userData?: any, isNewUser?: boolean) => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    if (token) {
      setAuthToken(token);
      setStoredToken(token);
    }
    if (userData) {
      updateDoctorProfile({
        fullName: userData.name || userData.fullName || doctorProfile.fullName,
        phone: userData.phone || mobileOrEmail || doctorProfile.phone,
        specialization: userData.specialization || doctorProfile.specialization,
        hospital: userData.hospital || doctorProfile.hospital,
      });
    } else if (mobileOrEmail) {
      updateDoctorProfile({
        phone: mobileOrEmail,
      });
    }

    if (isNewUser) {
      setIsProfileComplete(false);
      setApprovalStatus("pending");
      try {
        localStorage.setItem("moncradle_doctor_profile_complete", "false");
        localStorage.setItem("moncradle_doctor_approval_status", "pending");
      } catch (e) {}
    } else {
      const vStatus = userData?.verificationStatus || userData?.approvalStatus || "pending";
      const isApproved = vStatus === "approved" || vStatus === "verified";
      setIsProfileComplete(true);
      setApprovalStatus(isApproved ? "approved" : "pending");
      try {
        localStorage.setItem("moncradle_doctor_profile_complete", "true");
        localStorage.setItem("moncradle_doctor_approval_status", isApproved ? "approved" : "pending");
      } catch (e) {}
    }

    try {
      localStorage.setItem("moncradle_doctor_auth", "true");
    } catch (e) {}

    // Fetch babies from backend API GET /api/babies after login
    babyService.fetchBabies().then((res: any) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const apiPatients = res.data.map(transformBackendBabyToPatient);
        setPatients(apiPatients);
        saveToStorage("moncradle_doctor_patients", apiPatients);
      }
    }).catch(() => {});

    // Fetch appointments from backend API GET /api/appointments after login
    appointmentService.fetchAppointments().then((res: any) => {
      if (res.success && Array.isArray(res.data)) {
        const apiAppointments = res.data.map(transformBackendAppointmentToFrontend);
        setAppointments(apiAppointments);
        saveToStorage("moncradle_doctor_apts", apiAppointments);
      }
    }).catch(() => {});
    
    // Prompt for notification permission automatically after login
    if ('Notification' in window) {
      requestForToken().then(fcmToken => {
        if (fcmToken) {
          authService.updateProfile({ fcmToken }).catch(console.error);
        }
      }).catch(console.error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    setStoredToken(null);
    setIsProfileComplete(true);
    setShowWelcomeScreen(true);
    try {
      localStorage.setItem("moncradle_doctor_auth", "false");
      localStorage.removeItem("moncradle_doctor_profile_complete");
      sessionStorage.removeItem("moncradle_doctor_welcome_done");
    } catch (e) {}
    window.location.href = "/";
  };

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Storage save failed", e);
    }
  };

  const addPatient = (data: Partial<Patient> & { name: string }): Patient => {
    const newId = String(Date.now());
    const newPatient: Patient = {
      id: newId,
      name: data.name,
      gender: data.gender || "boy",
      dateOfBirth: data.dateOfBirth || new Date().toISOString().split("T")[0],
      ageInMonths: data.ageInMonths || 3,
      prematureDays: data.prematureDays || 0,
      weight: data.weight || 5.8,
      height: data.height || 60,
      medicalCondition: data.medicalCondition || "Routine health check",
      diet: data.diet || "Standard infant nutrition",
      bloodType: data.bloodType || "O+",
      allergies: data.allergies || ["None"],
      parentId: data.parentId || "67a0010189ab123456789001",
      parentName: data.parentName || "Parent Account",
      parentPhone: data.parentPhone || "+91 98765 43210",
      parentEmail: data.parentEmail || "parent@example.com",
      avatar: data.avatar || "/child_avatar_1.png",
    };

    const updated = [newPatient, ...patients];
    setPatients(updated);
    saveToStorage("moncradle_doctor_patients", updated);
    return newPatient;
  };

  const addAppointment = (
    data: Partial<Appointment> & { patientId: string; patientName: string; time: string; type: Appointment["type"] }
  ): Appointment => {
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      patientAvatar:
        data.patientAvatar ||
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=200",
      parentName: data.parentName || "Parent",
      time: data.time,
      date: data.date || "2026-07-31",
      type: data.type,
      status: data.status || "Upcoming",
      notes: data.notes || "Routine clinical visit",
    };

    const updated = [newApt, ...appointments];
    setAppointments(updated);
    saveToStorage("moncradle_doctor_apts", updated);
    return newApt;
  };

  const addMedicalNote = (
    data: Partial<MedicalNote> & { patientId: string; patientName: string; assessment: string }
  ): MedicalNote => {
    const newNote: MedicalNote = {
      id: `note-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      date: data.date || new Date().toISOString().split("T")[0],
      category: data.category || "SOAP Note",
      subjective: data.subjective || "Patient reports standard feeding & sleep routine.",
      objective: data.objective || "Vitals within normal limits for age.",
      assessment: data.assessment,
      plan: data.plan || "Continue current nutrition & schedule routine follow-up.",
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveToStorage("moncradle_doctor_notes", updated);
    return newNote;
  };

  const addPrescription = (
    data: Partial<Prescription> & { patientId: string; patientName: string; diagnosis: string }
  ): Prescription => {
    if (data.id) {
      // Update existing prescription in-place
      const updated = prescriptions.map((p) => {
        if (p.id === data.id) {
          return {
            ...p,
            patientId: data.patientId || p.patientId,
            patientName: data.patientName || p.patientName,
            diagnosis: data.diagnosis !== undefined ? data.diagnosis : p.diagnosis,
            items: data.items || p.items,
            medicines: data.medicines || p.medicines,
            vitals: data.vitals || p.vitals,
            nutritionRecommendations: data.nutritionRecommendations !== undefined ? data.nutritionRecommendations : p.nutritionRecommendations,
            nextVisitDate: data.nextVisitDate !== undefined ? data.nextVisitDate : p.nextVisitDate,
          };
        }
        return p;
      });

      setPrescriptions(updated);
      saveToStorage("moncradle_doctor_rx", updated);
      return updated.find((p) => p.id === data.id)!;
    }

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: data.patientId,
      patientName: data.patientName,
      date: data.date || new Date().toISOString().split("T")[0],
      diagnosis: data.diagnosis,
      doctorName: doctorProfile.fullName || "Dr. Sumit Sahu",
      items: data.items || [],
      medicines: data.medicines || [],
      vitals: data.vitals,
      nutritionRecommendations: data.nutritionRecommendations,
      nextVisitDate: data.nextVisitDate,
    };

    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    saveToStorage("moncradle_doctor_rx", updated);

    // Sync to backend API POST /api/prescriptions
    prescriptionService.createPrescription({
      babyId: data.patientId,
      medicalNotes: data.diagnosis,
      nutritionRecommendations: data.nutritionRecommendations,
      medicines: (data.items || data.medicines || []).map((m: any) => ({
        name: m.medicineName || m.name || "Medicine",
        dosage: m.dosage || "1 ml",
        frequency: m.frequency || "1-0-1",
        duration: m.duration || "5 Days",
        instructions: m.instructions || "After meal",
      })),
      vitals: data.vitals,
      nextVisitDate: data.nextVisitDate,
    }).catch(() => {});

    return newRx;
  };

  const removePrescription = (id: string) => {
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    saveToStorage("moncradle_doctor_rx", updated);
  };

  const updateNutritionPlan = (patientId: string, plan: Partial<NutritionPlan>) => {
    const existing = nutritionPlans[patientId] || {
      patientId,
      targetCalories: 1800,
      targetProtein: 60,
      targetIron: 12,
      targetAchievementPercent: 80,
      focusText: "Custom clinical nutrition plan",
      focusImage: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=800",
      meals: [],
    };

    const nextPlan = { ...existing, ...plan };
    setNutritionPlans((prev) => ({
      ...prev,
      [patientId]: nextPlan,
    }));

    const VALID_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Sync to backend API POST /api/nutrition-plans
    nutritionService.createNutritionPlan({
      babyId: patientId,
      guidelines: nextPlan.focusText,
      weeklySchedule: nextPlan.meals?.map((m, idx) => ({
        day: VALID_DAYS.includes(m.meal) ? m.meal : VALID_DAYS[idx % 7],
      })),
    }).catch(() => {});
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    const updated = appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt));
    setAppointments(updated);
    saveToStorage("moncradle_doctor_apts", updated);

    // Sync status to backend API PATCH /api/appointments/:id/status
    const backendStatus = status === "Completed" ? "completed" : status === "Cancelled" ? "cancelled" : "scheduled";
    appointmentService.updateStatus(id, backendStatus).catch(() => {});
  };

  const addNotification = (notif: Omit<NotificationItem, "id">) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <DoctorDataContext.Provider
      value={{
        doctorProfile,
        updateDoctorProfile,
        patients,
        setPatients,
        appointments,
        setAppointments,
        notes,
        prescriptions,
        nutritionPlans,
        notifications,
        setNotifications,
        selectedPatientId,
        setSelectedPatientId,
        addPatient,
        addAppointment,
        addMedicalNote,
        addPrescription,
        removePrescription,
        updateNutritionPlan,
        updateAppointmentStatus,
        addNotification,
        isAuthenticated,
        authToken,
        isProfileComplete,
        setIsProfileComplete,
        approvalStatus,
        setApprovalStatus,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        activePolicy,
        setActivePolicy,
        showWelcomeScreen,
        setShowWelcomeScreen,
        isHydrated,
        isDataLoading,
      }}
    >
      {children}
    </DoctorDataContext.Provider>
  );
}

export function useDoctorData() {
  const context = useContext(DoctorDataContext);
  if (!context) {
    throw new Error("useDoctorData must be used within a DoctorDataProvider");
  }
  return context;
}
