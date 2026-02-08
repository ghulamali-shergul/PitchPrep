export type Category = "Tech" | "Finance" | "Healthcare" | "Consulting" | "Other";

export type UserRole = "admin" | "user";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  url: string;
  category: Category;
  aboutInfo: string;
  jobDescription: string;
  notes: string;
  matchScore: number;
  matchReasoning: string;
  hiringNow: boolean;
  location: string;
  topRoles: string[];
  generated: boolean;
  adminApproved: boolean;
  careerFairCard?: CareerFairCard;
}

export interface CareerFairCard {
  pitch: string;
  wowFacts: WowFact[];
  topRoles: string[];
  smartQuestions: string[];
  followUpMessage: string;
}

export interface WowFact {
  fact: string;
  source: string;
  sourceUrl: string;
}

export interface ResumeSuggestion {
  id: string;
  type: "add-metrics" | "reorder-skills" | "rewrite-bullet" | "highlight-experience";
  title: string;
  description: string;
  before?: string;
  after?: string;
  priority: "high" | "medium" | "low";
}

export interface UserProfile {
  name: string;
  email: string;
  school: string;
  major: string;
  graduationYear: string;
  preferredRoles: string[];
  preferredIndustries: Category[];
  location: string;
  visaNotes: string;
  background: string;
  resumeText: string;
}

export interface FilterState {
  search: string;
  industry: Category | "All";
  matchScoreMin: number;
  matchScoreMax: number;
  location: string;
  hiringNow: boolean | null;
}

export interface CareerFairEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  companyIds: string[];
}
