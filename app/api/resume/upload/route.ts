import { NextRequest, NextResponse } from "next/server";
import { getDb, Collections } from "@/lib/db/mongodb";
import { getAuthUser } from "@/lib/services/auth";
import { ObjectId } from "mongodb";
//import pdf from "pdf-parse";
import { PDFParse } from 'pdf-parse';
import mammoth from "mammoth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES: Record<string, "pdf" | "docx"> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/** Normalise whitespace: collapse runs of spaces/newlines, trim */
function cleanText(raw: string): string {
  return raw.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * POST /api/resume/upload
 *
 * Accepts multipart/form-data with field "resume" (PDF or DOCX, ≤5 MB).
 * Extracts plain text, saves to authenticated user's profile in MongoDB,
 * and returns a short preview (first 2000 chars).
 */
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded. Send a field named 'resume'." }, { status: 400 });
    }

    // Validate MIME type
    const fileType = ALLOWED_TYPES[file.type];
    if (!fileType) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or DOCX file." },
        { status: 400 },
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5 MB limit." },
        { status: 400 },
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text
    let rawText: string;
    if (fileType === "pdf") {
      const parser = new PDFParse(buffer);
      const parsed = await parser.getText();
      rawText = parsed.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    const resumeText = cleanText(rawText);
    console.log(`Extracted resume text length: ${resumeText.length} characters`);
    console.log(`Extracted: ${resumeText}`);
    if (resumeText.length < 50) {
      return NextResponse.json(
        { error: "Could not extract enough text from the file. Please try a different file or paste your resume manually." },
        { status: 422 },
      );
    }

    // Persist to MongoDB
    const db = await getDb();
    await db.collection(Collections.USERS).updateOne(
      { _id: new ObjectId(authUser.userId) },
      {
        $set: {
          "profile.resumeText": resumeText,
          "profile.resumeUpdatedAt": new Date(),
          "profile.resumeFileName": file.name,
          "profile.resumeFileType": fileType,
          updatedAt: new Date(),
        },
      },
    );

    // Return a short preview — never return the full text
    const preview = resumeText.slice(0, 2000);

    return NextResponse.json({
      success: true,
      message: "Resume uploaded and text extracted successfully.",
      textLength: resumeText.length,
      preview,
      fileName: file.name,
      fileType,
    });
  } catch (error) {
    // Never log the resume text itself
    console.error("Resume upload error:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}