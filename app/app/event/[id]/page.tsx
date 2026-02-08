"use client";

import React, { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useCompanyStore } from "@/lib/CompanyStoreContext";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CategoryBadge, ScoreBadge } from "@/components/ui/Badge";
import { pitchApi } from "@/lib/api-client";

export default function UserEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { getEventById, getEventCompanies, refreshCompanies } = useCompanyStore();
  const [isClearing, setIsClearing] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Refresh companies when page loads to get latest matchScore from MongoDB
  useEffect(() => {
    refreshCompanies();
  }, [refreshCompanies]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center">
        <div className="text-lg text-muted">Loading...</div>
      </Container>
    );
  }

  if (!isAuthenticated) return null;

  const event = getEventById(eventId);

  if (!event) {
    return (
      <Container className="py-20 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Event Not Found</h1>
        <p className="text-muted mb-6">This event doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push("/app")}>Back to Events</Button>
      </Container>
    );
  }

  const companies = getEventCompanies(eventId);
  // Sort companies by match score (highest first), put unscored companies at the end
  const sortedCompanies = [...companies].sort((a, b) => {
    if (!a.matchScore && !b.matchScore) return 0;
    if (!a.matchScore) return 1; // a goes to end
    if (!b.matchScore) return -1; // b goes to end
    return b.matchScore - a.matchScore; // normal descending sort
  });

  // Pagination
  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all AI-generated match data? This cannot be undone.")) {
      return;
    }
    
    setIsClearing(true);
    try {
      const token = localStorage.getItem("pitchprep_token");
      console.log("🧹 Clearing AI data, token exists:", !!token);
      
      const response = await fetch("/api/companies/clear-ai", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      console.log("🧹 Clear response:", data);
      
      if (response.ok) {
        await refreshCompanies();
        alert(`All match data cleared successfully! Modified ${data.modified} companies.`);
      } else {
        console.error("Clear failed:", data);
        alert(`Failed to clear data: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("An error occurred while clearing data.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!confirm(`Generate AI pitches and match scores for all ${companies.length} companies? This may take a few minutes.`)) {
      return;
    }
    
    setIsGeneratingAll(true);
    setGenerationStatus(`Generating 0/${companies.length}...`);
    
    let completed = 0;
    for (const company of companies) {
      try {
        setGenerationStatus(`Generating ${completed + 1}/${companies.length}: ${company.name}...`);
        await pitchApi.generate(company.name, company.id);
        completed++;
        setGenerationStatus(`Completed ${completed}/${companies.length}`);
      } catch (error) {
        console.error(`Error generating pitch for ${company.name}:`, error);
        setGenerationStatus(`Error on ${company.name}. Completed ${completed}/${companies.length}`);
      }
    }
    
    await refreshCompanies();
    setIsGeneratingAll(false);
    setGenerationStatus("");
    alert(`Successfully generated pitches for ${completed} out of ${companies.length} companies!`);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hiringCount = sortedCompanies.filter((c) => c.hiringNow).length;
  const categoryCounts = sortedCompanies.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/app")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
      >
        ← Back to Events
      </button>

      {/* Event Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">{event.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">📅 {formatDate(event.date)}</span>
          <span className="flex items-center gap-1.5">📍 {event.location}</span>
        </div>
        {event.description && (
          <p className="text-sm text-muted mt-2 max-w-2xl">{event.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-2xl font-bold text-primary">{sortedCompanies.length}</p>
          <p className="text-xs text-muted mt-1">All employers</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{hiringCount}</p>
          <p className="text-xs text-muted mt-1">Related to my interest</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-amber-600">{Object.keys(categoryCounts).length}</p>
          <p className="text-xs text-muted mt-1">Top matches</p>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          onClick={handleClearAll}
          disabled={isClearing || isGeneratingAll}
          variant="outline"
        >
          {isClearing ? "Clearing..." : "🗑️ Clear All Match Data"}
        </Button>
        <Button
          onClick={handleGenerateAll}
          disabled={isClearing || isGeneratingAll}
        >
          {isGeneratingAll ? "Generating..." : "✨ Generate All Pitches"}
        </Button>
        {generationStatus && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-light text-primary rounded-lg text-sm font-medium">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            {generationStatus}
          </div>
        )}
      </div>

      {/* Company Table (read-only) */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Company</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Match</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Top Roles</th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    No employers have been added to this event yet.
                  </td>
                </tr>
              ) : (
                paginatedCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border last:border-0 hover:bg-card-hover transition-colors cursor-pointer"
                    onClick={() => router.push(`/company/${company.slug}`)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground hover:text-primary transition-colors">{company.name}</p>
                        <a
                          href={company.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate block max-w-[200px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={company.matchScore} />
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={company.category} />
                    </td>
                    <td className="px-4 py-3 text-muted">{company.location}</td>
                    <td className="px-4 py-3">
                      {company.hiringNow ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Related to my interest
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          Not related
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[250px]">
                        {company.topRoles.map((role) => (
                          <span
                            key={role}
                            className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedCompanies.length)} of {sortedCompanies.length} companies
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              ««
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next ›
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              »»
            </Button>
          </div>
        </div>
      )}

      {/* About section removed per request */}
    </Container>
  );
}
