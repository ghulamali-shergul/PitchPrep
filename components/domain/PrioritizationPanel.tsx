"use client";

import React from "react";
import Link from "next/link";
import { Company } from "@/lib/types";
import Card from "@/components/ui/Card";
import { CategoryBadge, ScoreBadge } from "@/components/ui/Badge";

interface PrioritizationPanelProps {
  companies: Company[];
  activeCategory: string;
}

export default function PrioritizationPanel({ companies, activeCategory }: PrioritizationPanelProps) {
  const sorted = [...companies]
    .filter((c) => activeCategory === "All" || c.category === activeCategory)
    .sort((a, b) => b.matchScore - a.matchScore);

  const top5 = sorted.slice(0, 5);
  const rest = sorted.slice(5);

  return (
    <div className="space-y-6 fade-in">
      {/* Top 5 Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <h3 className="text-base font-semibold text-foreground">Top 5 — Visit First</h3>
        </div>
        <div className="space-y-3">
          {top5.map((company, index) => (
            <Card key={company.id} hover className="slide-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/company/${company.slug}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                      {company.name}
                    </Link>
                    <CategoryBadge category={company.category} />
                    <ScoreBadge score={company.matchScore} />
                    {company.hiringNow && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Hiring Now
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{company.matchReasoning}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {company.topRoles.map((role) => (
                      <span key={role} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative h-12 w-12">
                    <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className={company.matchScore >= 85 ? "text-success" : company.matchScore >= 70 ? "text-warning" : "text-muted"}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${company.matchScore}, 100`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {company.matchScore}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Rest */}
      {rest.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-semibold text-foreground">Other Companies</h3>
          <div className="space-y-2">
            {rest.map((company, index) => (
              <Card key={company.id} hover className="slide-in">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted w-6">#{top5.length + index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/company/${company.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                        {company.name}
                      </Link>
                      <CategoryBadge category={company.category} />
                      <ScoreBadge score={company.matchScore} />
                    </div>
                    <p className="mt-1 text-xs text-muted line-clamp-1">{company.matchReasoning}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
