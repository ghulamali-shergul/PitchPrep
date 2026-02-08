"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/lib/types";
import { defaultProfile } from "@/lib/mockData";
import { useAuth } from "@/lib/AuthContext";
import { userApi } from "@/lib/api-client";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { resumeApi } from "@/lib/api-client";

const allCategories = [
  "Tech", "Finance", "Healthcare", "Consulting", "Energy", "Education",
  "Government", "Retail", "Manufacturing", "Media & Entertainment",
  "Real Estate", "Transportation", "Nonprofit", "Legal", "Agriculture",
];
const allRoles = ["Software Engineer", "Product Manager", "Data Scientist", "Business Analyst", "Consultant", "Designer", "Quantitative Analyst", "Research Scientist"];

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load profile from backend
  useEffect(() => {
    async function loadProfile() {
      if (isAuthenticated) {
        try {
          const { profile: loadedProfile } = await userApi.getProfile();
          setProfile({ ...defaultProfile, ...loadedProfile, skills: loadedProfile.skills ?? [] });
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      }
    }
    loadProfile();
  }, [isAuthenticated]);

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [uploadStatus, setUploadStatus] = useState<{
    uploading: boolean;
    error: string | null;
    success: string | null;
    preview: string | null;
  }>({ uploading: false, error: null, success: null, preview: null });
  const [newSkill, setNewSkill] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadStatus({ uploading: false, error: "Please upload a PDF or DOCX file.", success: null, preview: null });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus({ uploading: false, error: "File exceeds 5 MB limit.", success: null, preview: null });
      return;
    }

    setUploadStatus({ uploading: true, error: null, success: null, preview: null });

    try {
      const result = await resumeApi.uploadResume(file);
      // Update local profile state with the extracted text preview
      if (result.preview) {
        setProfile((prev) => ({ ...prev, resumeText: result.preview }));
      }
      setUploadStatus({
        uploading: false,
        error: null,
        success: `Uploaded ${file.name} — extracted ${result.textLength.toLocaleString()} characters.`,
        preview: result.preview?.slice(0, 500) || null,
      });
    } catch (err: any) {
      setUploadStatus({ uploading: false, error: err.message || "Upload failed.", success: null, preview: null });
    } finally {
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userApi.updateProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      if (error?.status === 404 || error?.status === 401) {
        alert("Your session has expired. Please log out and log back in.");
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAutoPopulate = async () => {
    console.log("Auto-populate clicked");
    console.log("Resume text length:", profile.resumeText?.length);
    
    if (!profile.resumeText || profile.resumeText.trim().length < 50) {
      alert("Please enter your resume text first (at least 50 characters).");
      return;
    }

    setAnalyzingResume(true);

    try {
      console.log("Calling analyzeResume API...");
      const { analysis } = await userApi.analyzeResume(profile.resumeText);
      console.log("Analysis result:", analysis);
      
      // Populate profile fields with analyzed data
      setProfile((prev) => ({
        ...prev,
        name: analysis.name || prev.name,
        email: analysis.email || prev.email,
        school: analysis.school || prev.school,
        major: analysis.major || prev.major,
        graduationYear: analysis.graduationYear || prev.graduationYear,
        location: analysis.location || prev.location,
        preferredRoles: analysis.preferredRoles.length > 0 ? analysis.preferredRoles : prev.preferredRoles,
        preferredIndustries: analysis.preferredIndustries.length > 0 
          ? analysis.preferredIndustries as string[] 
          : prev.preferredIndustries,
        skills: analysis.skills?.length > 0 ? analysis.skills : prev.skills,
        background: analysis.background || prev.background,
      }));

      alert("✅ Profile auto-populated successfully! Review the fields above and click Save Profile when ready.");
    } catch (error: any) {
      console.error("Resume analysis error:", error);
      alert(error.message || "Failed to analyze resume.");
    } finally {
      setAnalyzingResume(false);
    }
  };

  const toggleIndustry = (cat: string) => {
    setProfile((p) => ({
      ...p,
      preferredIndustries: p.preferredIndustries.includes(cat)
        ? p.preferredIndustries.filter((c) => c !== cat)
        : [...p.preferredIndustries, cat],
    }));
  };

  const addCustomIndustry = () => {
    const trimmed = newIndustry.trim();
    if (trimmed && !profile.preferredIndustries.includes(trimmed)) {
      setProfile((p) => ({ ...p, preferredIndustries: [...p.preferredIndustries, trimmed] }));
      setNewIndustry("");
    }
  };

  const toggleRole = (role: string) => {
    setProfile((p) => ({
      ...p,
      preferredRoles: p.preferredRoles.includes(role)
        ? p.preferredRoles.filter((r) => r !== role)
        : [...p.preferredRoles, role],
    }));
  };

  const addCustomRole = () => {
    if (newRole.trim() && !profile.preferredRoles.includes(newRole.trim())) {
      setProfile((p) => ({ ...p, preferredRoles: [...p.preferredRoles, newRole.trim()] }));
      setNewRole("");
    }
  };

  const toggleSkill = (skill: string) => {
    setProfile((p) => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter((s) => s !== skill)
        : [...p.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  return (
    <Container className="py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Your Profile</h1>
        <p className="text-sm text-muted mt-1">Set your goals, preferences, and background to personalize recommendations.</p>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardTitle className="mb-4">Basic Information</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <Input label="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <Input label="School" value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} />
            <Input label="Major" value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} />
            <Input label="Graduation Year" value={profile.graduationYear} onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })} />
            <Input label="Location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          </div>
        </Card>

        {/* Work Eligibility */}
        <Card>
          <CardTitle className="mb-4">Visa / Work Eligibility</CardTitle>
          <Input
            label="Eligibility Notes"
            placeholder="e.g., US Citizen, F-1 OPT eligible, need H-1B sponsorship"
            value={profile.visaNotes}
            onChange={(e) => setProfile({ ...profile, visaNotes: e.target.value })}
          />
        </Card>

        {/* Preferred Industries */}
        <Card>
          <CardTitle className="mb-4">Preferred Industries</CardTitle>
          <p className="text-sm text-muted mb-3">Select industries you&apos;re most interested in. This influences company recommendations.</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleIndustry(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  profile.preferredIndustries.includes(cat)
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary text-muted hover:bg-gray-200 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Custom industries added by user */}
          {profile.preferredIndustries.filter((i) => !allCategories.includes(i)).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.preferredIndustries
                .filter((i) => !allCategories.includes(i))
                .map((industry) => (
                  <Badge key={industry} variant="primary">
                    {industry}
                    <button onClick={() => toggleIndustry(industry)} className="ml-1.5 text-primary hover:text-primary-hover">×</button>
                  </Badge>
                ))}
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <Input
              placeholder="Add a custom industry..."
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomIndustry()}
            />
            <Button variant="outline" onClick={addCustomIndustry} disabled={!newIndustry.trim()}>
              Add
            </Button>
          </div>
        </Card>

        {/* Preferred Roles */}
        <Card>
          <CardTitle className="mb-4">Preferred Roles</CardTitle>
          <p className="text-sm text-muted mb-3">Select or add roles you&apos;re targeting.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {allRoles.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  profile.preferredRoles.includes(role)
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary text-muted hover:bg-gray-200 hover:text-foreground"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          {/* Custom roles */}
          {profile.preferredRoles.filter((r) => !allRoles.includes(r)).length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {profile.preferredRoles
                .filter((r) => !allRoles.includes(r))
                .map((role) => (
                  <Badge key={role} variant="primary">
                    {role}
                    <button onClick={() => toggleRole(role)} className="ml-1.5 text-primary hover:text-primary-hover">×</button>
                  </Badge>
                ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Add a custom role..."
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomRole()}
            />
            <Button variant="outline" onClick={addCustomRole} disabled={!newRole.trim()}>
              Add
            </Button>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <CardTitle className="mb-4">Skills</CardTitle>
          <p className="text-sm text-muted mb-3">Add your technical and soft skills.</p>
          {profile.skills.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="primary">
                  {skill}
                  <button onClick={() => toggleSkill(skill)} className="ml-1.5 text-primary hover:text-primary-hover">×</button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
            />
            <Button variant="outline" onClick={addCustomSkill} disabled={!newSkill.trim()}>
              Add
            </Button>
          </div>
        </Card>

        {/* Background */}
        <Card>
          <CardTitle className="mb-4">Your Background</CardTitle>
          <Textarea
            label="Tell us about your experience"
            placeholder="E.g., I interned in finance at a mid-size bank, studied CS, interested in AI..."
            value={profile.background}
            onChange={(e) => setProfile({ ...profile, background: e.target.value })}
            rows={4}
          />
        </Card>

        {/* Resume */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Resume</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoPopulate}
              loading={analyzingResume}
              disabled={!profile.resumeText || analyzingResume}
            >
              ✨ Auto-Fill Profile
            </Button>
          </div>

          {/* File upload */}
          <div className="mb-4">
            <p className="text-sm text-muted mb-2">
              Upload a PDF or DOCX resume (max 5 MB) to extract text automatically.
            </p>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-hover file:cursor-pointer"
                disabled={uploadStatus.uploading}
              />
              {uploadStatus.uploading && (
                <span className="text-sm text-muted animate-pulse">Uploading…</span>
              )}
            </div>
            {uploadStatus.error && (
              <p className="mt-2 text-sm text-danger">{uploadStatus.error}</p>
            )}
            {uploadStatus.success && (
              <p className="mt-2 text-sm text-success">{uploadStatus.success}</p>
            )}
            {uploadStatus.preview && (
              <details className="mt-2">
                <summary className="text-xs text-muted cursor-pointer">Show extracted preview</summary>
                <pre className="mt-1 text-xs bg-secondary p-2 rounded max-h-32 overflow-auto whitespace-pre-wrap">
                  {uploadStatus.preview}
                </pre>
              </details>
            )}
          </div>

          <p className="text-sm text-muted mb-3">
            Or paste your resume text below and click &quot;Auto-Fill Profile&quot; to automatically populate your profile fields.
          </p>

          <Textarea
            label="Resume Text"
            placeholder="Paste your resume text here..."
            value={profile.resumeText}
            onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
            rows={10}
            className="font-mono text-xs"
          />
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pb-8">
          {saved && <span className="text-sm text-success font-medium">✓ Profile saved!</span>}
          <Button onClick={handleSave} size="lg" loading={saving} disabled={saving}>
            Save Profile
          </Button>
        </div>
      </div>
    </Container>
  );
}
