/**
 * API client for PitchPrep backend.
 * Wraps all fetch calls with auth token handling.
 */

const API_BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pitchprep_token");
}

function setToken(token: string): void {
  localStorage.setItem("pitchprep_token", token);
}

function clearToken(): void {
  localStorage.removeItem("pitchprep_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || "Request failed");
  }

  return res.json();
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------- Auth ----------

export interface LoginResponse {
  token: string;
  user: { email: string; name: string; role: string };
}

export const authApi = {
  async login(email: string, password: string, role: string): Promise<LoginResponse> {
    const data = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
    setToken(data.token);
    return data;
  },

  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    const data = await apiFetch<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    setToken(data.token);
    return data;
  },

  async me(): Promise<{ user: { email: string; name: string; role: string } }> {
    return apiFetch("/auth/me");
  },

  async logout(): Promise<void> {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearToken();
  },
};

// ---------- Resume ----------

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  textLength: number;
  preview: string;
  fileName?: string;
  fileType?: "pdf" | "docx";
}

export const resumeApi = {
  async uploadResume(file: File): Promise<ResumeUploadResponse> {
    const formData = new FormData();
    formData.append("resume", file);
    
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(res.status, body.error || "Upload failed");
    }

    return res.json();
  },

  async getSuggestions(
    resumeText: string,
    jobDescription: string
  ): Promise<{ suggestions: ResumeSuggestion[] }> {
    return apiFetch("/resume/suggestions", {
      method: "POST",
      body: JSON.stringify({ resumeText, jobDescription }),
    });
  },

  async parseResume(): Promise<{ success: boolean; message: string; extracted: Record<string, unknown> }> {
    return apiFetch("/resume/parse", { method: "POST" });
  },
};

// ---------- User Profile ----------

import type { UserProfile } from "@/lib/types";

export interface ResumeAnalysis {
  name: string;
  email: string;
  school: string;
  major: string;
  graduationYear: string;
  location: string;
  preferredRoles: string[];
  preferredIndustries: string[];
  background: string;
  skills: string[];
}

export const userApi = {
  async getProfile(): Promise<{ profile: UserProfile }> {
    return apiFetch("/users/profile");
  },

  async updateProfile(data: Partial<UserProfile>): Promise<void> {
    await apiFetch("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async analyzeResume(resumeText: string): Promise<{ analysis: ResumeAnalysis }> {
    return apiFetch("/users/resume/analyze", {
      method: "POST",
      body: JSON.stringify({ resumeText }),
    });
  },
};

// ---------- Companies ----------

import type { Company } from "@/lib/types";

export const companyApi = {
  async list(): Promise<{ companies: Company[] }> {
    return apiFetch("/companies");
  },

  async get(id: string): Promise<{ company: Company }> {
    return apiFetch(`/companies/${id}`);
  },

  async create(data: Partial<Company>): Promise<{ company: Company }> {
    return apiFetch("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Company>): Promise<{ company: Company }> {
    return apiFetch(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await apiFetch(`/companies/${id}`, { method: "DELETE" });
  },

  async bulkAdd(names: string[], eventId?: string): Promise<{ companies: Company[]; count: number }> {
    return apiFetch("/companies/bulk", {
      method: "POST",
      body: JSON.stringify({ names, eventId }),
    });
  },
};

// ---------- Events ----------

import type { CareerFairEvent } from "@/lib/types";

export const eventApi = {
  async list(): Promise<{ events: CareerFairEvent[] }> {
    return apiFetch("/events");
  },

  async get(id: string): Promise<{ event: CareerFairEvent; companies: Company[] }> {
    return apiFetch(`/events/${id}`);
  },

  async create(data: Partial<CareerFairEvent>): Promise<{ event: CareerFairEvent }> {
    return apiFetch("/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CareerFairEvent>): Promise<{ event: CareerFairEvent }> {
    return apiFetch(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await apiFetch(`/events/${id}`, { method: "DELETE" });
  },

  async addCompany(eventId: string, companyId: string): Promise<void> {
    await apiFetch(`/events/${eventId}/companies`, {
      method: "POST",
      body: JSON.stringify({ companyId }),
    });
  },

  async removeCompany(eventId: string, companyId: string): Promise<void> {
    await apiFetch(`/events/${eventId}/companies?companyId=${companyId}`, {
      method: "DELETE",
    });
  },
};

// ---------- Employer Research ----------

import type { EmployerContext } from "@/lib/services/openai";

export const employerApi = {
  async research(companyNames: string[]): Promise<{ results: Record<string, EmployerContext> }> {
    return apiFetch("/employers/research", {
      method: "POST",
      body: JSON.stringify({ companyNames }),
    });
  },

  async getCachedContext(companyName: string): Promise<{ context: EmployerContext; cachedAt: string }> {
    return apiFetch(`/employers/research?company=${encodeURIComponent(companyName)}`);
  },
};

// ---------- Pitch Generation ----------

import type { CareerFairCard } from "@/lib/types";

export interface PitchGenerateResponse {
  careerFairCard: CareerFairCard;
  matchScore: number;
  matchReasoning: string;
  scoreBreakdown?: {
    location: { score: number; reason: string };
    workAuthorization: { score: number; reason: string };
    major: { score: number; reason: string };
    jobType: { score: number; reason: string };
    skills: { score: number; reason: string };
    resume: { score: number; reason: string };
  };
}

export const pitchApi = {
  async generate(companyName: string, companyId?: string): Promise<PitchGenerateResponse> {
    return apiFetch("/pitch/generate", {
      method: "POST",
      body: JSON.stringify({ companyName, companyId }),
    });
  },
};

// ---------- Resume Suggestions ----------

import type { ResumeSuggestion } from "@/lib/types";
