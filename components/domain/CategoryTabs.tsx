"use client";

import React from "react";
import { Category } from "@/lib/types";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category | "All";
  onCategoryChange: (category: Category | "All") => void;
  counts: Record<Category | "All", number>;
}

const categoryIcons: Record<Category | "All", string> = {
  All: "🏢",
  Tech: "💻",
  Finance: "💰",
  Healthcare: "🏥",
  Consulting: "📊",
  Other: "📋",
};

export default function CategoryTabs({ categories, activeCategory, onCategoryChange, counts }: CategoryTabsProps) {
  const allCategories: (Category | "All")[] = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeCategory === cat
              ? "bg-primary text-white shadow-sm"
              : "bg-secondary text-muted hover:text-foreground hover:bg-gray-200"
          }`}
        >
          <span>{categoryIcons[cat]}</span>
          {cat}
          <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
            activeCategory === cat ? "bg-white/20" : "bg-card"
          }`}>
            {counts[cat] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
