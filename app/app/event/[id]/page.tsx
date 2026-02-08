"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useCompanyStore } from "@/lib/CompanyStoreContext";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge, { CategoryBadge } from "@/components/ui/Badge";

export default function UserEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { getEventById, getEventCompanies } = useCompanyStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hiringCount = companies.filter((c) => c.hiringNow).length;
  const categoryCounts = companies.reduce((acc, c) => {
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
          <p className="text-2xl font-bold text-primary">{companies.length}</p>
          <p className="text-xs text-muted mt-1">Employers</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{hiringCount}</p>
          <p className="text-xs text-muted mt-1">Hiring Now</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-amber-600">{Object.keys(categoryCounts).length}</p>
          <p className="text-xs text-muted mt-1">Industries</p>
        </Card>
      </div>

      {/* Company Table (read-only) */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Company</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Top Roles</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted">
                    No employers have been added to this event yet.
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border last:border-0 hover:bg-card-hover transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{company.name}</p>
                        <a
                          href={company.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate block max-w-[200px]"
                        >
                          {company.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={company.category} />
                    </td>
                    <td className="px-4 py-3 text-muted">{company.location}</td>
                    <td className="px-4 py-3">
                      {company.hiringNow ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Hiring
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          Not Hiring
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

      {/* About section for companies with descriptions */}
      {companies.filter((c) => c.aboutInfo).length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">About the Employers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {companies
              .filter((c) => c.aboutInfo)
              .map((company) => (
                <Card key={company.id}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <CategoryBadge category={company.category} />
                  </div>
                  <p className="text-sm text-muted">{company.aboutInfo}</p>
                  {company.hiringNow && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {company.topRoles.map((role) => (
                        <Badge key={role} variant="default">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </Container>
  );
}
