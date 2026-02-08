"use client";

import React, { useState } from "react";
import { ResumeSuggestion } from "@/lib/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface ResumeSuggestionsPanelProps {
  suggestions: ResumeSuggestion[];
  loading?: boolean;
  onGenerate?: () => void;
  resumeText: string;
  jobDescription: string;
  onResumeChange: (text: string) => void;
  onJobDescriptionChange: (text: string) => void;
}

const typeLabels: Record<ResumeSuggestion["type"], string> = {
  "add-metrics": "📊 Add Metrics",
  "reorder-skills": "🔄 Reorder Skills",
  "rewrite-bullet": "✏️ Rewrite Bullet",
  "highlight-experience": "⭐ Highlight Experience",
};

const priorityVariants: Record<ResumeSuggestion["priority"], "danger" | "warning" | "default"> = {
  high: "danger",
  medium: "warning",
  low: "default",
};

export default function ResumeSuggestionsPanel({
  suggestions,
  loading,
  onGenerate,
  resumeText,
  jobDescription,
  onResumeChange,
  onJobDescriptionChange,
}: ResumeSuggestionsPanelProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Input Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label="Your Resume Text"
          placeholder="Paste your resume text here..."
          value={resumeText}
          onChange={(e) => onResumeChange(e.target.value)}
          rows={6}
        />
        <Textarea
          label="Target Job Description"
          placeholder="Paste the job description you're targeting..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          rows={6}
        />
      </div>

      <Button onClick={onGenerate} loading={loading} size="lg" className="w-full sm:w-auto">
        ✨ Analyze & Suggest Improvements
      </Button>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Suggestions */}
      {!loading && suggestions.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-foreground mb-4">
            💡 {suggestions.length} Suggestions Found
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="slide-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {typeLabels[suggestion.type]}
                      </span>
                      <Badge variant={priorityVariants[suggestion.priority]}>
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    <h4 className="text-sm font-medium text-foreground">{suggestion.title}</h4>
                    <p className="mt-1 text-sm text-muted">{suggestion.description}</p>
                  </div>
                  {suggestion.before && suggestion.after && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(suggestion.id)}
                    >
                      {expandedIds.has(suggestion.id) ? "Hide" : "Show"} Preview
                    </Button>
                  )}
                </div>

                {/* Before/After Preview */}
                {suggestion.before && suggestion.after && expandedIds.has(suggestion.id) && (
                  <div className="mt-4 grid gap-3 md:grid-cols-2 fade-in">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                      <p className="mb-1.5 text-xs font-semibold text-red-600 uppercase tracking-wide">Before</p>
                      <p className="text-sm text-red-900 leading-relaxed">{suggestion.before}</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="mb-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide">After</p>
                      <p className="text-sm text-emerald-900 leading-relaxed">{suggestion.after}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
