"use client";

import React, { useState } from "react";
import { CareerFairCard as CareerFairCardType, Company } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CategoryBadge, ScoreBadge } from "@/components/ui/Badge";
import { PitchSkeleton } from "@/components/ui/Skeleton";

interface CareerFairCardProps {
  company: Company;
  onGenerate?: () => void;
  loading?: boolean;
}

export default function CareerFairCard({ company, onGenerate, loading }: CareerFairCardProps) {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedFollowUp, setCopiedFollowUp] = useState(false);

  const card = company.careerFairCard;

  const copyToClipboard = async (text: string, type: "pitch" | "followup") => {
    await navigator.clipboard.writeText(text);
    if (type === "pitch") {
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    } else {
      setCopiedFollowUp(true);
      setTimeout(() => setCopiedFollowUp(false), 2000);
    }
  };

  if (loading) {
    return <PitchSkeleton />;
  }

  if (!card) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Generate Career Fair Card</h3>
        <p className="text-sm text-muted mb-4 max-w-md mx-auto">
          Click below to generate a personalized pitch, talking points, and follow-up message for {company.name}.
        </p>
        <Button onClick={onGenerate} size="lg">
          ✨ Generate Card
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-foreground">{company.name}</h2>
        <CategoryBadge category={company.category} />
        <ScoreBadge score={company.matchScore} />
      </div>

      {/* Pitch */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            🎤 Your 30-Second Pitch
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(card.pitch, "pitch")}
          >
            {copiedPitch ? "✓ Copied!" : "📋 Copy"}
          </Button>
        </div>
        <p className="text-sm text-foreground leading-relaxed bg-primary-light rounded-lg p-4 border border-primary/10">
          {card.pitch}
        </p>
      </Card>

      {/* Wow Facts */}
      <Card>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          🌟 Key Talking Points
        </h3>
        <ul className="space-y-3">
          {card.wowFacts.map((fact, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
                {index + 1}
              </span>
              <div>
                <p className="text-foreground">{fact.fact}</p>
                <a href={fact.sourceUrl} className="text-xs text-primary hover:underline mt-0.5 inline-block">
                  Source: {fact.source} →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Top Roles */}
      <Card>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          💼 Top Roles to Ask About
        </h3>
        <div className="flex flex-wrap gap-2">
          {card.topRoles.map((role) => (
            <span key={role} className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground">
              {role}
            </span>
          ))}
        </div>
      </Card>

      {/* Smart Questions */}
      <Card>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          ❓ Smart Questions to Ask
        </h3>
        <ol className="space-y-2">
          {card.smartQuestions.map((q, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                {index + 1}
              </span>
              <p className="text-foreground">{q}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Follow-Up Message */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            ✉️ Follow-Up Message
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(card.followUpMessage, "followup")}
          >
            {copiedFollowUp ? "✓ Copied!" : "📋 Copy"}
          </Button>
        </div>
        <p className="text-sm text-foreground leading-relaxed bg-emerald-50 rounded-lg p-4 border border-emerald-100">
          {card.followUpMessage}
        </p>
      </Card>
    </div>
  );
}
