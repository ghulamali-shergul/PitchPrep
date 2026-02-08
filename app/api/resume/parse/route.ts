import { NextRequest, NextResponse } from "next/server";
import { getDb, Collections } from "@/lib/db/mongodb";
import { getAuthUser } from "@/lib/services/auth";
import { ObjectId } from "mongodb";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * POST /api/resume/parse
 *
 * Reads the authenticated user's stored resumeText, calls OpenAI ONCE to
 * extract structured profile fields (skills, school, major, graduationYear,
 * background summary, etc.), and persists them to the user document.
 *
 * Rate-limiting note: In production, add per-user rate limiting (e.g. 5 calls/hour)
 * using a simple timestamp check or a library like `rate-limiter-flexible`.
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const user = await db
      .collection(Collections.USERS)
      .findOne({ _id: new ObjectId(authUser.userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resumeText: string =
      user.profile?.resumeText || user.resumeText || "";

    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "No resume text found. Please upload a resume first." },
        { status: 400 },
      );
    }

    // Call OpenAI once to extract structured fields
    const response = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a resume-parsing assistant. Given raw resume text, extract the following fields and return ONLY valid JSON:
{
  "name": "string or empty",
  "email": "string or empty",
  "school": "string or empty",
  "major": "string or empty",
  "graduationYear": "string (4-digit year) or empty",
  "location": "string or empty",
  "skills": ["string"],
  "preferredRoles": ["string — inferred from experience"],
  "preferredIndustries": ["string — inferred from experience"],
  "background": "string — 2-3 sentence professional summary"
}
Be conservative: only include information clearly stated in the resume. Do not fabricate.`,
        },
        {
          role: "user",
          content: resumeText.slice(0, 4000), // cap tokens
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(content) as {
      name?: string;
      email?: string;
      school?: string;
      major?: string;
      graduationYear?: string;
      location?: string;
      skills?: string[];
      preferredRoles?: string[];
      preferredIndustries?: string[];
      background?: string;
    };

    // Build $set payload — only overwrite non-empty values
    const setFields: Record<string, unknown> = { updatedAt: new Date() };

    if (parsed.school) setFields["profile.school"] = parsed.school;
    if (parsed.major) setFields["profile.major"] = parsed.major;
    if (parsed.graduationYear) setFields["profile.graduationYear"] = parsed.graduationYear;
    if (parsed.location) setFields["profile.location"] = parsed.location;
    if (parsed.background) setFields["profile.background"] = parsed.background;
    if (parsed.skills && parsed.skills.length > 0) setFields["profile.skills"] = parsed.skills;
    if (parsed.preferredRoles && parsed.preferredRoles.length > 0) setFields["profile.preferredRoles"] = parsed.preferredRoles;
    if (parsed.preferredIndustries && parsed.preferredIndustries.length > 0) setFields["profile.preferredIndustries"] = parsed.preferredIndustries;
    if (parsed.name) setFields["name"] = parsed.name;
    if (parsed.email) setFields["email"] = parsed.email;

    await db.collection(Collections.USERS).updateOne(
      { _id: new ObjectId(authUser.userId) },
      { $set: setFields },
    );

    return NextResponse.json({
      success: true,
      message: "Profile fields extracted and saved.",
      extracted: parsed,
    });
  } catch (error) {
    console.error("Resume parse error:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
