import { NextRequest, NextResponse } from "next/server";
import { getDb, Collections } from "@/lib/db/mongodb";
import { getAuthUser } from "@/lib/services/auth";
import { generatePitch } from "@/lib/services/openai";
import type { UserProfileData } from "@/lib/services/openai";
import { ObjectId } from "mongodb";

/**
 * POST /api/pitch/generate
 *
 * Input: { companyName: string }
 * Uses the authenticated user's profile + employer context to generate a pitch.
 * Returns a full CareerFairCard-compatible response.
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyName, companyId } = await req.json();
    console.log(`📤 POST /api/pitch/generate — companyName: ${companyName}, companyId: ${companyId}, userId: ${authUser.userId}`);

    if (!companyName) {
      return NextResponse.json({ error: "companyName is required" }, { status: 400 });
    }

    const db = await getDb();

    // 1. Get the user's profile
    const user = await db
      .collection(Collections.USERS)
      .findOne({ _id: new ObjectId(authUser.userId) });

    console.log(`👤 User found: ${!!user}, Has profile: ${!!user?.profile}`);
    if (user?.profile) {
      console.log(`   Profile fields: school=${!!user.profile.school}, major=${!!user.profile.major}, skills=${user.profile.skills?.length || 0}`);
    }

    if (!user || !user.profile) {
      console.error(`❌ Profile validation failed - user: ${!!user}, profile: ${!!user?.profile}`);
      return NextResponse.json(
        { error: "Please complete your profile before generating a pitch" },
        { status: 400 }
      );
    }

    // Map MongoDB document to UserProfileData for OpenAI prompt
    const p = user.profile || {};
    const userProfile: UserProfileData = {
      name: user.name,
      email: user.email,
      school: p.school || "",
      major: p.major || "",
      graduationYear: p.graduationYear || "",
      preferredRoles: p.preferredRoles || [],
      preferredIndustries: p.preferredIndustries || [],
      location: p.location || "",
      workAuthorization: p.workAuthorization || p.visaNotes || "",
      jobTypePreference: p.jobTypePreference || "any",
      skills: p.skills || [],
      background: p.background || "",
      resumeText: p.resumeText || user.resumeText || "",
    };

    // 2. Fetch employer context (company research) using OpenAI
    console.log(`📚 Fetching employer context for ${companyName}...`);
    const { fetchEmployerContext } = await import("@/lib/services/openai");
    const employerContext = await fetchEmployerContext(companyName);
    console.log(`✅ Employer context fetched:`, employerContext);
    console.log(`-------------------------------------------`);
    console.log(`userProfile.resumeText:`, userProfile.resumeText);

    // 3. Generate the pitch using consolidated prompt with employer context
    const pitchResult = await generatePitch(userProfile, companyName, employerContext);

    // 3. Build a CareerFairCard response matching the frontend type
    const careerFairCard = {
      pitch: pitchResult.elevatorPitch30s,
      wowFacts: pitchResult.interestingFacts.map((fact) => ({
        fact,
        source: "AI Generated",
        sourceUrl: "#"
      })),
      topRoles: pitchResult.topMatchedRoles,
      smartQuestions: pitchResult.smartQuestions,
      followUpMessage: `Hi [Name], it was great meeting you at the career fair! I really enjoyed learning about ${companyName}. I'd love to continue our conversation — would you be open to a brief virtual coffee chat? I've attached my resume for reference. Best, ${user.name}`,
    };

    // Create detailed match reasoning from scoreBreakdown
    const matchReasoning = [
      `Location: ${pitchResult.scoreBreakdown.location.score}/20 - ${pitchResult.scoreBreakdown.location.reason}`,
      `Work Auth: ${pitchResult.scoreBreakdown.workAuthorization.score}/20 - ${pitchResult.scoreBreakdown.workAuthorization.reason}`,
      `Major: ${pitchResult.scoreBreakdown.major.score}/20 - ${pitchResult.scoreBreakdown.major.reason}`,
      `Job Type: ${pitchResult.scoreBreakdown.jobType.score}/20 - ${pitchResult.scoreBreakdown.jobType.reason}`,
      `Skills: ${pitchResult.scoreBreakdown.skills.score}/20 - ${pitchResult.scoreBreakdown.skills.reason}`,
      `Resume: ${pitchResult.scoreBreakdown.resume.score}/20 - ${pitchResult.scoreBreakdown.resume.reason}`
    ].join(" | ");

    // 4. If companyId was provided, update the company record
    if (companyId) {
      console.log(`🔄 Updating company ${companyId} in MongoDB...`);
      const updateResult = await db.collection(Collections.COMPANIES).updateOne(
        { id: companyId },
        {
          $set: {
            careerFairCard,
            matchScore: pitchResult.matchScore,
            matchReasoning,
            generated: true,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`✅ Company update result: matched=${updateResult.matchedCount}, modified=${updateResult.modifiedCount}`);
    }

    // 5. Save/update pitch record for history (one per user-company combination)
    console.log(`💾 Upserting pitch record for user ${authUser.userId} + company ${companyId || companyName}`);
    const pitchUpsertResult = await db.collection(Collections.PITCHES).updateOne(
      { 
        userId: authUser.userId,
        companyId: companyId || companyName // Use companyId if available, otherwise companyName
      },
      {
        $set: {
          userId: authUser.userId,
          companyName,
          companyId: companyId || null,
          pitchResult,
          careerFairCard,
          matchScore: pitchResult.matchScore,
          matchReasoning,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true } // Create if doesn't exist, update if exists
    );
    console.log(`✅ Pitch record ${pitchUpsertResult.upsertedId ? 'created' : 'updated'} successfully`);

    return NextResponse.json({
      careerFairCard,
      matchScore: pitchResult.matchScore,
      matchReasoning,
      scoreBreakdown: pitchResult.scoreBreakdown,
    });
  } catch (error) {
    console.error("Pitch generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
