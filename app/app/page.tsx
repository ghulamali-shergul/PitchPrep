"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useCompanyStore } from "@/lib/CompanyStoreContext";
import Container from "@/components/ui/Container";
import Card, { CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function UserDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  const { events, getEventCompanies } = useCompanyStore();

  // Auth guard
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = events.filter((e) => e.date >= today);
  const pastEvents = events.filter((e) => e.date < today);

  const renderEventCard = (event: typeof events[0], isPast: boolean) => {
    const companies = getEventCompanies(event.id);
    return (
      <Card
        key={event.id}
        className={`cursor-pointer hover:shadow-md transition-all group ${isPast ? "opacity-70" : ""}`}
        onClick={() => router.push(`/app/event/${event.id}`)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="group-hover:text-primary transition-colors truncate">
              {event.name}
            </CardTitle>
          </div>
          <Badge variant={isPast ? "default" : "success"}>{isPast ? "Past" : "Upcoming"}</Badge>
        </div>

        <div className="space-y-2 text-sm text-muted mb-4">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏢</span>
            <span>
              {companies.length} {companies.length === 1 ? "employer" : "employers"} attending
            </span>
          </div>
        </div>

        {event.description && (
          <p className="text-xs text-muted line-clamp-2 mb-4">{event.description}</p>
        )}

        {companies.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {companies.slice(0, 5).map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground"
              >
                {c.name}
              </span>
            ))}
            {companies.length > 5 && (
              <span className="text-xs text-muted">+{companies.length - 5} more</span>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border">
          <span className="text-xs font-medium text-primary group-hover:underline">
            View employers →
          </span>
        </div>
      </Card>
    );
  };

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-sm text-muted">
          Browse upcoming career fair events and see which employers are attending.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-2xl font-bold text-primary">{events.length}</p>
          <p className="text-xs text-muted mt-1">Total Events</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{upcomingEvents.length}</p>
          <p className="text-xs text-muted mt-1">Upcoming</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-amber-600">
            {events.reduce((sum, e) => sum + getEventCompanies(e.id).length, 0)}
          </p>
          <p className="text-xs text-muted mt-1">Total Employers</p>
        </Card>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => renderEventCard(event, false))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-muted mb-4">Past Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <Card className="py-16 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-foreground font-medium mb-1">No events yet</p>
          <p className="text-sm text-muted mb-4">
            Your admin hasn&apos;t created any career fair events yet. Check back soon!
          </p>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Card>
      )}
    </Container>
  );
}
