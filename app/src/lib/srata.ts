/**
 * SRATA Academy types, constants, and a deterministic in-memory seed used until
 * the Supabase tables fill with real data. The seed is replaced by live rows
 * once submissions land — see `useSrataData`.
 */

export type SrataTraceWindow = "exit" | "3m" | "6m" | "12m" | "24m";

export const SRATA_TRACE_WINDOWS: { value: SrataTraceWindow; label: string; days: number }[] = [
  { value: "exit", label: "Graduation exit survey", days: 0 },
  { value: "3m", label: "3-month follow-up", days: 90 },
  { value: "6m", label: "6-month tracer", days: 180 },
  { value: "12m", label: "12-month tracer", days: 365 },
  { value: "24m", label: "24-month impact", days: 730 },
];

export const SRATA_PATHWAYS = [
  "Housekeeping",
  "Culinary Arts",
  "Front Office",
  "Tour Guiding",
  "Food & Beverage Service",
  "Assistant Management",
] as const;

export const SRATA_EDUCATION_LEVELS = [
  "No formal education",
  "Primary",
  "Some secondary",
  "Form IV",
  "Form VI",
  "Certificate / Diploma",
  "Degree",
] as const;

export const SRATA_EMPLOYMENT_STATUSES = [
  "Unemployed",
  "Casual / piece work",
  "Self-employed",
  "Formally employed",
  "Student",
] as const;

export const SRATA_ASSESSMENT_KINDS = ["english", "computer", "practical", "internal"] as const;
export type SrataAssessmentKind = (typeof SRATA_ASSESSMENT_KINDS)[number];

export const SRATA_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export interface SrataCohort {
  id: number;
  name: string;
  startDate: string;
  endDate?: string | null;
  intakeSize: number;
  status: "in_training" | "internship" | "graduated" | "closed";
}

export interface SrataStudent {
  id: number;
  cohortId: number;
  cohortName: string;
  fullName: string;
  sex: "male" | "female";
  district: string;
  region: string;
  phone?: string;
  educationLevel: string;
  employmentStatusBefore: string;
  monthlyIncomeBeforeTSh?: number | null;
  englishLevelBefore: string;
  computerLevelBefore: string;
  hospitalityExperience: boolean;
  careerGoal?: string;
  preferredPathway: string;
  enrolledAt: string;
  graduatedAt?: string | null;
  status: "enrolled" | "in_training" | "graduated" | "withdrawn";
}

export const seedCohorts: SrataCohort[] = [
  {
    id: 1,
    name: "Cohort 1 (2024 – Q3)",
    startDate: "2024-09-02",
    endDate: "2025-06-30",
    intakeSize: 30,
    status: "graduated",
  },
  {
    id: 2,
    name: "Cohort 2 (2025 – Q3)",
    startDate: "2025-09-15",
    endDate: null,
    intakeSize: 32,
    status: "in_training",
  },
];

export const seedStudents: SrataStudent[] = [
  // Cohort 1 graduates (sample)
  { id: 101, cohortId: 1, cohortName: "Cohort 1", fullName: "Asha Mwakanjuki", sex: "female", district: "Ifakara TC", region: "Morogoro", phone: "+255 712 345 121", educationLevel: "Form IV", employmentStatusBefore: "Unemployed", monthlyIncomeBeforeTSh: 0, englishLevelBefore: "Beginner", computerLevelBefore: "Beginner", hospitalityExperience: false, preferredPathway: "Housekeeping", enrolledAt: "2024-09-02", graduatedAt: "2025-06-30", status: "graduated" },
  { id: 102, cohortId: 1, cohortName: "Cohort 1", fullName: "John Mwaipopo", sex: "male", district: "Mbarali", region: "Mbeya", phone: "+255 765 110 998", educationLevel: "Form IV", employmentStatusBefore: "Casual / piece work", monthlyIncomeBeforeTSh: 60000, englishLevelBefore: "Beginner", computerLevelBefore: "Beginner", hospitalityExperience: false, preferredPathway: "Culinary Arts", enrolledAt: "2024-09-02", graduatedAt: "2025-06-30", status: "graduated" },
  { id: 103, cohortId: 1, cohortName: "Cohort 1", fullName: "Mariam Ngendo", sex: "female", district: "Ifakara TC", region: "Morogoro", phone: "+255 744 556 011", educationLevel: "Some secondary", employmentStatusBefore: "Unemployed", monthlyIncomeBeforeTSh: 0, englishLevelBefore: "Beginner", computerLevelBefore: "Beginner", hospitalityExperience: false, preferredPathway: "Front Office", enrolledAt: "2024-09-02", graduatedAt: "2025-06-30", status: "graduated" },
  { id: 104, cohortId: 1, cohortName: "Cohort 1", fullName: "Peter Mhagama", sex: "male", district: "Mbarali", region: "Mbeya", phone: "+255 712 887 442", educationLevel: "Form IV", employmentStatusBefore: "Unemployed", monthlyIncomeBeforeTSh: 0, englishLevelBefore: "Intermediate", computerLevelBefore: "Beginner", hospitalityExperience: false, preferredPathway: "Food & Beverage Service", enrolledAt: "2024-09-02", graduatedAt: "2025-06-30", status: "graduated" },
  // Cohort 2 in training
  { id: 201, cohortId: 2, cohortName: "Cohort 2", fullName: "Fatma Lweno", sex: "female", district: "Ifakara TC", region: "Morogoro", phone: "+255 712 111 222", educationLevel: "Form IV", employmentStatusBefore: "Unemployed", monthlyIncomeBeforeTSh: 0, englishLevelBefore: "Beginner", computerLevelBefore: "Beginner", hospitalityExperience: false, preferredPathway: "Housekeeping", enrolledAt: "2025-09-15", graduatedAt: null, status: "in_training" },
  { id: 202, cohortId: 2, cohortName: "Cohort 2", fullName: "Daniel Komba", sex: "male", district: "Mbarali", region: "Mbeya", phone: "+255 765 333 444", educationLevel: "Form IV", employmentStatusBefore: "Casual / piece work", monthlyIncomeBeforeTSh: 50000, englishLevelBefore: "Beginner", computerLevelBefore: "Beginner", hospitalityExperience: false, preferredPathway: "Culinary Arts", enrolledAt: "2025-09-15", graduatedAt: null, status: "in_training" },
];

export interface SrataGraduateTrace {
  studentId: number;
  traceWindow: SrataTraceWindow;
  traceDate: string;
  employed: boolean;
  employer?: string;
  jobTitle?: string;
  sector?: string;
  hospitalityRelated?: boolean;
  monthlyIncomeTSh?: number;
  jobRetention?: boolean;
  selfEmployed?: boolean;
  notes?: string;
}

export const seedTraces: SrataGraduateTrace[] = [
  { studentId: 101, traceWindow: "3m", traceDate: "2025-09-30", employed: true, employer: "Hondo Hondo Lodge", jobTitle: "Housekeeper", sector: "Hospitality", hospitalityRelated: true, monthlyIncomeTSh: 280000, jobRetention: true, notes: "Doing well — supervisor pleased." },
  { studentId: 102, traceWindow: "3m", traceDate: "2025-09-30", employed: true, employer: "Mama Mwendapole Restaurant", jobTitle: "Line cook", sector: "Hospitality", hospitalityRelated: true, monthlyIncomeTSh: 220000, jobRetention: true },
  { studentId: 103, traceWindow: "3m", traceDate: "2025-09-30", employed: false, notes: "Still looking — referred to two leads." },
  { studentId: 104, traceWindow: "3m", traceDate: "2025-09-30", employed: true, employer: "Hippo Pool Camp", jobTitle: "Waiter", sector: "Hospitality", hospitalityRelated: true, monthlyIncomeTSh: 240000, jobRetention: true },
];

export function nextTraceWindow(graduatedAt: string): { window: SrataTraceWindow; dueDate: string } | null {
  const now = Date.now();
  const grad = new Date(graduatedAt).getTime();
  for (const w of SRATA_TRACE_WINDOWS) {
    if (w.value === "exit") continue;
    const due = grad + w.days * 86_400_000;
    if (due > now) {
      return { window: w.value, dueDate: new Date(due).toISOString().slice(0, 10) };
    }
  }
  return null;
}
