"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { companyApi } from "@/lib/api-client";
import { Company } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { CategoryBadge, ScoreBadge } from "@/components/ui/Badge";
import CareerFairCard from "@/components/domain/CareerFairCard";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        setLoading(true);
        setError(null);
        const response = await companyApi.get(slug);
        setCompany(response.company);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Company not found");
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchCompany();
    }
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20 text-center">
        <div className="text-lg text-muted">Loading company details...</div>
      </Container>
    );
  }

  if (error || !company) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Company Not Found</h1>
        <p className="text-muted mb-6">We couldn&apos;t find a company with that URL.</p>
        <Link href="/app">
          <Button>← Back to Dashboard</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/app" className="text-sm text-primary hover:underline flex items-center gap-1">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Company Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-foreground mb-2">{company.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                📍 {company.location}
              </span>
              <span>•</span>
              <a 
                href={company.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                🌐 Visit website
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <CategoryBadge category={company.category} />
            <ScoreBadge score={company.matchScore} />
            {company.hiringNow && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Related to my interest
              </span>
            )}
          </div>
        </div>

        {/* About Section */}
        {company.aboutInfo && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              🏢 About {company.name}
            </h2>
            <p className="text-sm text-foreground leading-relaxed">{company.aboutInfo}</p>
          </Card>
        )}
      </div>

      {/* Key Information Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Job Description */}
        {company.jobDescription && (
          <Card>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              💼 Target Role
            </h3>
            <p className="text-sm text-foreground font-medium bg-secondary rounded-lg px-3 py-2">
              {company.jobDescription}
            </p>
          </Card>
        )}

        {/* Top Roles */}
        {company.topRoles && company.topRoles.length > 0 && (
          <Card>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              🎯 Available Positions
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.topRoles.map((role, idx) => (
                <span 
                  key={idx}
                  className="text-xs font-medium bg-secondary text-foreground rounded-full px-3 py-1.5"
                >
                  {role}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Match Analysis */}
      {company.matchReasoning && (
        <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-lg font-bold">
              {company.matchScore}%
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Why This Is a Great Match for You
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {company.matchReasoning}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Personal Notes */}
      {company.notes && company.notes.trim() !== "" && (
        <Card className="mb-8 bg-amber-50 border-amber-100">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            📝 Your Notes
          </h3>
          <p className="text-sm text-foreground italic">
            &quot;{company.notes}&quot;
          </p>
        </Card>
      )}

      {/* Career Fair Card Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          🎯 Career Fair Preparation
        </h2>
        <CareerFairCard company={company} />
      </div>
    </Container>
  );
}
