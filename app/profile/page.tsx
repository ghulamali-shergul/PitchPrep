"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, Category } from "@/lib/types";
import { defaultProfile } from "@/lib/mockData";
import { useAuth } from "@/lib/AuthContext";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const allCategories: Category[] = ["Tech", "Finance", "Healthcare", "Consulting", "Other"];
const allRoles = ["Software Engineer", "Product Manager", "Data Scientist", "Business Analyst", "Consultant", "Designer", "Quantitative Analyst", "Research Scientist"];

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [newRole, setNewRole] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleIndustry = (cat: Category) => {
    setProfile((p) => ({
      ...p,
      preferredIndustries: p.preferredIndustries.includes(cat)
        ? p.preferredIndustries.filter((c) => c !== cat)
        : [...p.preferredIndustries, cat],
    }));
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
          <CardTitle className="mb-4">Resume Text</CardTitle>
          <Textarea
            label="Paste your resume"
            placeholder="Paste your resume text here for analysis..."
            value={profile.resumeText}
            onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
            rows={10}
            className="font-mono text-xs"
          />
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pb-8">
          {saved && <span className="text-sm text-success font-medium">✓ Profile saved!</span>}
          <Button onClick={handleSave} size="lg">
            Save Profile
          </Button>
        </div>
      </div>
    </Container>
  );
}
