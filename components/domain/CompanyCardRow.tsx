"use client";

import React from "react";
import Link from "next/link";
import { Company, FilterState } from "@/lib/types";
import { CategoryBadge, ScoreBadge } from "@/components/ui/Badge";

interface CompanyCardRowProps {
  company: Company;
  isSelected: boolean;
  onClick: () => void;
}

export default function CompanyCardRow({ company, isSelected, onClick }: CompanyCardRowProps) {
  return (
    <Link 
      href={`/company/${company.slug}`}
      className={`block w-full text-left rounded-lg border p-3 transition-all ${
        isSelected
          ? "border-primary bg-primary-light shadow-sm"
          : "border-border bg-card hover:border-primary/30 hover:bg-card-hover hover:shadow-md"
      }`}
      onClick={(e) => {
        // Still call onClick for any state management (like selection tracking)
        onClick();
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate">{company.name}</h4>
          <p className="text-xs text-muted truncate mt-0.5">{company.location}</p>
        </div>
        <ScoreBadge score={company.matchScore} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <CategoryBadge category={company.category} />
        {company.hiringNow && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Related to my interest
          </span>
        )}
        {company.topRoles[0] && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted">
            {company.topRoles[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
