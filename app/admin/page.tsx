"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useCompanyStore } from "@/lib/CompanyStoreContext";
import { CareerFairEvent } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card, { CardTitle } from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { events, addEvent, updateEvent, removeEvent, getEventCompanies } = useCompanyStore();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CareerFairEvent | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Auth guard
  if (isLoading) {
    return (
      <Container className="py-20 text-center">
        <div className="text-lg text-muted">Loading...</div>
      </Container>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Container className="py-20 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h1>
        <p className="text-muted mb-6">You need to sign in as an admin to access this page.</p>
        <Button onClick={() => router.push("/login")}>Sign In</Button>
      </Container>
    );
  }

  const resetForm = () => {
    setFormName("");
    setFormDate("");
    setFormLocation("");
    setFormDescription("");
  };

  const openEditModal = (event: CareerFairEvent) => {
    setEditingEvent(event);
    setFormName(event.name);
    setFormDate(event.date);
    setFormLocation(event.location);
    setFormDescription(event.description);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formDate.trim()) return;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        name: formName.trim(),
        date: formDate.trim(),
        location: formLocation.trim(),
        description: formDescription.trim(),
      });
    } else {
      const newEvent: CareerFairEvent = {
        id: `evt-${Date.now()}`,
        name: formName.trim(),
        date: formDate.trim(),
        location: formLocation.trim() || "TBD",
        description: formDescription.trim(),
        companyIds: [],
      };
      addEvent(newEvent);
    }

    setShowModal(false);
    setEditingEvent(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event? All company associations will be lost.")) {
      removeEvent(id);
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

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
  const upcomingEvents = filteredEvents.filter((e) => e.date >= today);
  const pastEvents = filteredEvents.filter((e) => e.date < today);

  const renderEventCard = (event: CareerFairEvent, isPast: boolean) => {
    const companies = getEventCompanies(event.id);
    return (
      <Card
        key={event.id}
        className={`cursor-pointer hover:shadow-md transition-shadow group ${isPast ? "opacity-70" : ""}`}
        onClick={() => router.push(`/admin/event/${event.id}`)}
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
              {companies.length} {companies.length === 1 ? "employer" : "employers"} registered
            </span>
          </div>
        </div>

        {event.description && (
          <p className="text-xs text-muted line-clamp-2 mb-4">{event.description}</p>
        )}

        {companies.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {companies.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground"
              >
                {c.name}
              </span>
            ))}
            {companies.length > 4 && (
              <span className="text-xs text-muted">+{companies.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(event);
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Edit Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(event.id);
            }}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </Card>
    );
  };

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Badge variant="primary">🛡️ Admin</Badge>
        </div>
        <p className="text-sm text-muted">
          Manage career fair events. Click on an event to view and manage attending employers.
        </p>
      </div>

      {/* Stats */}
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
            {events.reduce((sum, e) => sum + e.companyIds.length, 0)}
          </p>
          <p className="text-xs text-muted mt-1">Total Registrations</p>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            resetForm();
            setEditingEvent(null);
            setShowModal(true);
          }}
        >
          + Create Event
        </Button>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => renderEventCard(event, false))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-muted mb-4">Past Events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="py-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-foreground font-medium mb-1">
            {search ? "No events match your search" : "No events yet"}
          </p>
          <p className="text-sm text-muted mb-4">
            {search
              ? "Try a different search term."
              : "Create your first career fair event to get started."}
          </p>
          {!search && (
            <Button
              onClick={() => {
                resetForm();
                setEditingEvent(null);
                setShowModal(true);
              }}
            >
              + Create Event
            </Button>
          )}
        </Card>
      )}

      {/* Add/Edit Event Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingEvent(null);
          resetForm();
        }}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Event Name *"
            placeholder="e.g., Spring 2026 Tech Career Fair"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Date *</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Input
              label="Location"
              placeholder="e.g., University Student Center"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
            />
          </div>
          <Textarea
            label="Description"
            placeholder="Brief description of the event (optional)"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setEditingEvent(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim() || !formDate.trim()}>
              {editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
