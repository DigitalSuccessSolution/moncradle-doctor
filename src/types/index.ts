export function maskPhoneNumber(phone?: string): string {
  if (!phone) return "+91 98765-XXXX";
  const trimmed = phone.trim();
  let count = 0;
  const chars = trimmed.split("");
  for (let i = chars.length - 1; i >= 0; i--) {
    if (/\d/.test(chars[i])) {
      chars[i] = "X";
      count++;
      if (count === 4) break;
    }
  }
  return chars.join("");
}

export interface Shift {
  startTime: string;
  endTime: string;
  _id?: string;
}

export interface DayAvailability {
  dayOfWeek: string;
  shifts: Shift[];
  _id?: string;
}

export interface DoctorProfile {
  fullName: string;
  title: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
  hospital: string;
  phone: string;
  email: string;
  bio: string;
  avatar: string;
  gender?: string;
  availableDays: string;
  availableHours: string;
  consultationFee?: number;
  slotDuration?: number;
  clinicAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  degrees?: string[];
  qualifications?: string[];
  languagesSpoken?: string[];
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
  };
  about?: string;
  availability?: DayAvailability[];
}

export const DEFAULT_DOCTOR_PROFILE: DoctorProfile = {
  fullName: "",
  title: "",
  specialization: "",
  licenseNumber: "",
  experience: "",
  hospital: "",
  phone: "",
  email: "",
  bio: "",
  avatar: "/doctor_female.png",
  gender: "Female",
  availableDays: "Mon - Sat",
  availableHours: "09:00 AM - 05:00 PM",
  clinicAddress: "",
  city: "",
  state: "",
  pincode: "",
  availability: []
};

export interface Patient {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'private' | 'Boy' | 'Girl';
  dateOfBirth: string;
  ageInMonths?: number;
  prematureDays?: number;
  weight?: number | string;
  height?: number | string;
  medicalCondition?: string;
  diet?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | string;
  allergies?: string[];
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentAddress?: string;
  assignedDoctorId?: string;
  avatar?: string;
  code?: string;
  age?: string;
  status?: string;
  statusText?: string;
  growthScore?: number;
  growthTrend?: string;
  bmi?: number;
  heightCm?: number;
  weightKg?: number;
  dob?: string;
  doctorName?: string;
  lastVisit?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  parentId?: string;
  parentName: string;
  parentPhone?: string;
  doctorId?: string;
  doctorName?: string;
  time: string;
  date: string;
  type: 'OPD Checkup' | 'Vaccination' | 'Follow-up' | 'Diet Plan' | 'Emergency' | string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'In-Progress' | string;
  notes?: string;
  doctorNotes?: string;
  meetingLink?: string;
  cancellationReason?: string;
}

export interface MealItem {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  time: string;
  title: string;
  description: string;
  tags: string[];
  iconType: 'sun' | 'utensils' | 'moon' | 'apple';
}

export interface NutritionPlan {
  patientId: string;
  targetCalories: number;
  targetProtein: number;
  targetIron: number;
  targetAchievementPercent: number;
  focusText: string;
  focusImage: string;
  meals: MealItem[];
}

export interface GrowthDataPoint {
  month: number;
  monthLabel: string;
  medianWeight: number;
  p3Weight: number;
  p97Weight: number;
  patientWeight?: number;
  medianHeight: number;
  p3Height: number;
  p97Height: number;
  patientHeight?: number;
}

export interface Milestone {
  id: string;
  title: string;
  achievedAge?: string;
  expectedAge: string;
  status: 'achieved' | 'pending' | 'delayed';
}

export interface MedicalNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  category: 'SOAP Note' | 'Follow-up' | 'Vaccination' | 'Dietary Advisory';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  parentName?: string;
  parentPhone?: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  medicines?: PrescriptionItem[];
  doctorName: string;
  doctorSpecialization?: string;
  fileUrl?: string;
  vitals?: {
    weight?: string;
    temperature?: string;
    bp?: string;
  };
  nextVisitDate?: string;
  nutritionRecommendations?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'growth_alert' | 'report' | 'system';
  read: boolean;
  priority: 'high' | 'normal';
}

export const INITIAL_PATIENTS: Patient[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const WHO_GROWTH_DATA: GrowthDataPoint[] = [
  { month: 0, monthLabel: 'Birth', medianWeight: 3.3, p3Weight: 2.5, p97Weight: 4.4, patientWeight: 3.2, medianHeight: 49.9, p3Height: 46.1, p97Height: 53.7, patientHeight: 50 },
  { month: 2, monthLabel: '3m', medianWeight: 5.6, p3Weight: 4.3, p97Weight: 7.1, patientWeight: 5.3, medianHeight: 58.4, p3Height: 54.4, p97Height: 62.4, patientHeight: 57 },
  { month: 4, monthLabel: '6m', medianWeight: 7.0, p3Weight: 5.5, p97Weight: 8.8, patientWeight: 6.8, medianHeight: 63.8, p3Height: 59.6, p97Height: 68.0, patientHeight: 63 },
  { month: 6, monthLabel: '9m', medianWeight: 7.9, p3Weight: 6.3, p97Weight: 9.9, patientWeight: 7.7, medianHeight: 67.6, p3Height: 63.2, p97Height: 72.0, patientHeight: 67 },
  { month: 8, monthLabel: '12m', medianWeight: 8.6, p3Weight: 6.9, p97Weight: 10.7, patientWeight: 8.4, medianHeight: 70.6, p3Height: 66.1, p97Height: 75.1, patientHeight: 71 },
  { month: 10, monthLabel: '15m', medianWeight: 9.2, p3Weight: 7.4, p97Weight: 11.5, patientWeight: undefined, medianHeight: 73.3, p3Height: 68.6, p97Height: 78.0, patientHeight: undefined },
  { month: 12, monthLabel: '18m', medianWeight: 9.6, p3Weight: 7.8, p97Weight: 12.0, patientWeight: undefined, medianHeight: 75.7, p3Height: 70.9, p97Height: 80.5, patientHeight: undefined }
];

export const LEO_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Sitting without support', achievedAge: '6.5 months', expectedAge: '6-7 months', status: 'achieved' },
  { id: 'm2', title: 'Transfers objects between hands', achievedAge: '7.2 months', expectedAge: '7-8 months', status: 'achieved' },
  { id: 'm3', title: 'Crawling', expectedAge: '8-10 months', status: 'pending' },
  { id: 'm4', title: 'First words', expectedAge: '10-12 months', status: 'pending' }
];

export const SAMPLE_NUTRITION_PLAN: NutritionPlan = {
  patientId: '',
  targetCalories: 0,
  targetProtein: 0,
  targetIron: 0,
  targetAchievementPercent: 0,
  focusText: '',
  focusImage: '',
  meals: []
};

export const INITIAL_NOTES: MedicalNote[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
