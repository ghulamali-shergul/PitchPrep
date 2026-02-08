"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockCompanies } from "@/lib/mockData";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import CareerFairCard from "@/components/domain/CareerFairCard";

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const company = mockCompanies.find((c) => c.slug === slug);

  if (!company) {
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
    <Container className="py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/app" className="text-sm text-primary hover:underline flex items-center gap-1">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
            <p className="text-sm text-muted mt-1">{company.location} · {company.url}</p>
          </div>
          <div className="flex gap-2">
            {company.hiringNow && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Hiring Now
              </span>
            )}
          </div>
        </div>
        {company.aboutInfo && (
          <p className="mt-3 text-sm text-muted leading-relaxed">{company.aboutInfo}</p>
        )}
      </div>

      <CareerFairCard company={company} />
    </Container>
  );
}
