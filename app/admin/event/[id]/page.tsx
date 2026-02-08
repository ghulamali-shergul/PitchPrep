"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useCompanyStore } from "@/lib/CompanyStoreContext";
import { Company, Category } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card, { CardTitle } from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Badge, { CategoryBadge } from "@/components/ui/Badge";

const allCategories: Category[] = ["Tech", "Finance", "Healthcare", "Consulting", "Other"];

export default function AdminEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const {
    careerFairCompanies,
    addCareerFairCompany,
    updateCareerFairCompany,
    removeCompanyFromEvent,
    addCompanyToEvent,
    bulkAddCareerFairCompanies,
    refreshCompanies,
    getEventCompanies,
    getEventById,
  } = useCompanyStore();

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);

  // Add form
  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("Tech");
  const [formAbout, setFormAbout] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formHiring, setFormHiring] = useState(true);
  const [formRoles, setFormRoles] = useState("");

  // Bulk add
  const [bulkText, setBulkText] = useState("");

  // Search
  const [search, setSearch] = useState("");
  const [pickerSearch, setPickerSearch] = useState("");

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

  const event = getEventById(eventId);

  if (!event) {
    return (
      <Container className="py-20 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Event Not Found</h1>
        <p className="text-muted mb-6">This event doesn&apos;t exist or has been deleted.</p>
        <Button onClick={() => router.push("/admin")}>Back to Events</Button>
      </Container>
    );
  }

  const eventCompanies = getEventCompanies(eventId);

  // Companies NOT in this event (for the picker)
  const availableCompanies = careerFairCompanies.filter(
    (c) => !event.companyIds.includes(c.id)
  );

  const filteredEventCompanies = eventCompanies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAvailable = availableCompanies.filter((c) =>
    c.name.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const resetForm = () => {
    setFormName("");
    setFormUrl("");
    setFormCategory("Tech");
    setFormAbout("");
    setFormLocation("");
    setFormHiring(true);
    setFormRoles("");
  };

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setFormName(company.name);
    setFormUrl(company.url);
    setFormCategory(company.category);
    setFormAbout(company.aboutInfo);
    setFormLocation(company.location);
    setFormHiring(company.hiringNow);
    setFormRoles(company.topRoles.join(", "));
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;

    const slug = formName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const roles = formRoles
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (editingCompany) {
      updateCareerFairCompany(editingCompany.id, {
        name: formName.trim(),
        slug,
        url: formUrl.trim() || `https://${slug}.com`,
        category: formCategory,
        aboutInfo: formAbout.trim(),
        location: formLocation.trim() || "Remote",
        hiringNow: formHiring,
        topRoles: roles.length > 0 ? roles : ["General"],
      });
    } else {
      // Use the bulk API to create a single company so IDs are consistent
      try {
        const result = await fetch("/api/companies/bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("pitchprep_token")}`,
          },
          body: JSON.stringify({ names: [formName.trim()], eventId }),
        });
        const data = await result.json();

        if (result.ok && data.companies?.length) {
          // Update the company with extra details
          const newId = data.companies[0].id;
          await fetch(`/api/companies/${newId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("pitchprep_token")}`,
            },
            body: JSON.stringify({
              url: formUrl.trim() || `https://${slug}.com`,
              category: formCategory,
              aboutInfo: formAbout.trim(),
              location: formLocation.trim() || "Remote",
              hiringNow: formHiring,
              topRoles: roles.length > 0 ? roles : ["General"],
            }),
          });
          await refreshCompanies();
          window.location.reload();
        }
      } catch (error) {
        console.error("Add company error:", error);
        alert("An error occurred while adding the company.");
      }
    }

    setShowAddModal(false);
    setEditingCompany(null);
    resetForm();
  };

  const handleBulkAdd = async () => {
    const names = bulkText
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) return;

    try {
      // Save to MongoDB via API — the API generates proper IDs and links to event
      const result = await fetch("/api/companies/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("pitchprep_token")}`,
        },
        body: JSON.stringify({ names, eventId }),
      });
      const data = await result.json();

      if (result.ok && data.companies) {
        // Refresh from database so local state matches MongoDB
        await refreshCompanies();
        // Refresh events to get updated companyIds
        const eventsRes = await fetch("/api/events").then((r) => r.json()).catch(() => null);
        if (eventsRes?.events) {
          // Force page reload to get fresh event data
          window.location.reload();
        }
      } else {
        alert(`Failed to add companies: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Bulk add error:", error);
      alert("An error occurred while adding companies.");
    }

    setBulkText("");
    setShowBulkModal(false);
  };

  const handleRemoveFromEvent = (companyId: string) => {
    if (confirm("Remove this company from the event? (The company will still exist in the system.)")) {
      removeCompanyFromEvent(eventId, companyId);
    }
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

  // Stats
  const hiringCount = eventCompanies.filter((c) => c.hiringNow).length;
  const categoryCounts = eventCompanies.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
      >
        ← Back to Events
      </button>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">📅 {formatDate(event.date)}</span>
              <span className="flex items-center gap-1.5">📍 {event.location}</span>
            </div>
            {event.description && (
              <p className="text-sm text-muted mt-2 max-w-2xl">{event.description}</p>
            )}
          </div>
          <Badge variant="primary">🛡️ Admin</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-2xl font-bold text-primary">{eventCompanies.length}</p>
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
        <Card className="text-center">
          <p className="text-2xl font-bold text-foreground">{availableCompanies.length}</p>
          <p className="text-xs text-muted mt-1">Available to Add</p>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Search employers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-3 flex-wrap">
          {availableCompanies.length > 0 && (
            <Button variant="outline" onClick={() => { setPickerSearch(""); setShowPickerModal(true); }}>
              📂 Add Existing
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowBulkModal(true)}>
            📋 Bulk Add
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setEditingCompany(null);
              setShowAddModal(true);
            }}
          >
            + New Employer
          </Button>
        </div>
      </div>

      {/* Company Table */}
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
                <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEventCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    {search
                      ? "No employers match your search."
                      : "No employers added to this event yet. Click \"New Employer\" or \"Add Existing\" to get started."}
                  </td>
                </tr>
              ) : (
                filteredEventCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border last:border-0 hover:bg-card-hover transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{company.name}</p>
                        <p className="text-xs text-muted truncate max-w-[200px]">{company.url}</p>
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
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {company.topRoles.slice(0, 2).map((role) => (
                          <span
                            key={role}
                            className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground"
                          >
                            {role}
                          </span>
                        ))}
                        {company.topRoles.length > 2 && (
                          <span className="text-xs text-muted">
                            +{company.topRoles.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(company)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary-light transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveFromEvent(company.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Existing Company Picker Modal */}
      <Modal
        isOpen={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        title="Add Existing Employer to Event"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search companies..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
          />
          {filteredAvailable.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">
              {pickerSearch
                ? "No matching companies found."
                : "All companies are already in this event."}
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredAvailable.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{company.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryBadge category={company.category} />
                      <span className="text-xs text-muted">{company.location}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      addCompanyToEvent(eventId, company.id);
                    }}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setShowPickerModal(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Company Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingCompany(null);
          resetForm();
        }}
        title={editingCompany ? "Edit Employer" : "Add New Employer"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Company Name *"
              placeholder="e.g., Google"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
            <Input
              label="Company URL"
              placeholder="https://google.com"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as Category)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Location"
              placeholder="e.g., New York, NY"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
            />
          </div>
          <Textarea
            label="About / Description"
            placeholder="Brief description of the company (optional)"
            value={formAbout}
            onChange={(e) => setFormAbout(e.target.value)}
            rows={3}
          />
          <Input
            label="Top Roles (comma-separated)"
            placeholder="e.g., Software Engineer, Product Manager, Data Analyst"
            value={formRoles}
            onChange={(e) => setFormRoles(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={formHiring}
              onChange={(e) => setFormHiring(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary accent-primary"
            />
            Currently hiring / accepting applications
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setEditingCompany(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim()}>
              {editingCompany ? "Save Changes" : "Add Employer"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setBulkText("");
        }}
        title="Bulk Add Employers"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Enter company names separated by commas or new lines. They&apos;ll be added to this event
            with default settings — you can edit each one afterwards.
          </p>
          <Textarea
            label="Company Names"
            placeholder={"Amazon\nApple\nMicrosoft\nNetflix\nSalesforce"}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={6}
          />
          {bulkText.trim() && (
            <p className="text-xs text-muted">
              {bulkText
                .split(/[,\n]/)
                .map((n) => n.trim())
                .filter(Boolean).length}{" "}
              companies will be added
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowBulkModal(false);
                setBulkText("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkAdd} disabled={!bulkText.trim()}>
              Add All Employers
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
