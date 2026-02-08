"use client";

import React from "react";
import { Company, FilterState } from "@/lib/types";
import CompanyCardRow from "./CompanyCardRow";
import CompanyFilters from "./CompanyFilters";

interface CompanyListProps {
  companies: Company[];
  selectedId: string | null;
  onSelect: (company: Company) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function CompanyList({ companies, selectedId, onSelect, filters, onFilterChange }: CompanyListProps) {
  const filtered = companies
    .filter((c) => {
      if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.industry !== "All" && c.category !== filters.industry) return false;
      if (c.matchScore < filters.matchScoreMin || c.matchScore > filters.matchScoreMax) return false;
      if (filters.location && filters.location !== "All" && c.location !== filters.location) return false;
      if (filters.hiringNow === true && !c.hiringNow) return false;
      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Companies ({filtered.length})
        </h3>
        <CompanyFilters filters={filters} onFilterChange={onFilterChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted text-center py-8">No companies match your filters.</p>
        ) : (
          filtered.map((company) => (
            <CompanyCardRow
              key={company.id}
              company={company}
              isSelected={company.id === selectedId}
              onClick={() => onSelect(company)}
            />
          ))
        )}
      </div>
    </div>
  );
}
