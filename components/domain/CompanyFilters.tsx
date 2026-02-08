"use client";

import React from "react";
import { FilterState, Category } from "@/lib/types";
import Input from "@/components/ui/Input";

interface CompanyFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const categories: (Category | "All")[] = ["All", "Tech", "Finance", "Healthcare", "Consulting", "Other"];
const locations = ["All", "New York, NY", "San Francisco, CA", "Mountain View, CA", "Menlo Park, CA", "Chicago, IL", "Minneapolis, MN", "Washington, DC"];

export default function CompanyFilters({ filters, onFilterChange }: CompanyFiltersProps) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Search companies..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        className="text-xs"
      />

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">Top matches</label>
        <select
          value={filters.industry}
          onChange={(e) => onFilterChange({ ...filters, industry: e.target.value as Category | "All" })}
          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">Location</label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc === "All" ? "All Locations" : loc}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Match Score: {filters.matchScoreMin}–{filters.matchScoreMax}%
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            value={filters.matchScoreMin}
            onChange={(e) => onFilterChange({ ...filters, matchScoreMin: Number(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={filters.matchScoreMax}
            onChange={(e) => onFilterChange({ ...filters, matchScoreMax: Number(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={filters.hiringNow === true}
          onChange={(e) => onFilterChange({ ...filters, hiringNow: e.target.checked ? true : null })}
          className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
        />
        Related to my interest
      </label>
    </div>
  );
}
