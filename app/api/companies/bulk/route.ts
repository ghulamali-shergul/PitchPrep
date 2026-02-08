import { NextRequest, NextResponse } from "next/server";
import { getDb, Collections } from "@/lib/db/mongodb";
import { getAuthUser } from "@/lib/services/auth";
import type { Category } from "@/lib/types";

/** POST /api/companies/bulk — bulk add companies */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { names, eventId } = await req.json();

    if (!names || !Array.isArray(names) || names.length === 0) {
      return NextResponse.json({ error: "names array is required" }, { status: 400 });
    }

    const companies = names.map((name: string, i: number) => {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      return {
        id: String(Date.now() + i),
        slug,
        name: name.trim(),
        url: `https://${slug}.com`,
        category: "Other" as Category,
        aboutInfo: "",
        jobDescription: "",
        notes: "",
        hiringNow: true,
        location: "On-site",
        topRoles: ["General"],
        generated: false,
        adminApproved: authUser.role === "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const db = await getDb();
    await db.collection(Collections.COMPANIES).insertMany(companies);

    // Add to event if specified
    if (eventId) {
      const companyIds = companies.map((c: { id: string }) => c.id);
      await db.collection(Collections.EVENTS).updateOne(
        { id: eventId },
        { $addToSet: { companyIds: { $each: companyIds } } }
      );
    }

    return NextResponse.json({ companies, count: companies.length }, { status: 201 });
  } catch (error) {
    console.error("Bulk add error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
