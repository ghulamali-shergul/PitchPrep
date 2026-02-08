/**
 * Database seed script — run with: npx tsx lib/db/seed.ts
 * Populates MongoDB with the same mock data the frontend uses.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { MongoClient } from "mongodb";
import { mockCompanies, mockEvents, defaultProfile, mockResumeSuggestions } from "../mockData";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  if (!MONGODB_URI) {
    console.error("Set MONGODB_URI in .env.local before running seed");
    process.exit(1);
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db("pitchprep");

  console.log("Connected to MongoDB. Seeding...");

  // --- Users ---
  const usersCol = db.collection("users");
  await usersCol.deleteMany({});

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash("12345", 10);

  await usersCol.insertMany([
    {
      email: "admin@pitchprep.com",
      name: "Admin User",
      role: "admin",
      passwordHash: adminPasswordHash,
      profile: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "user@gmail.com",
      name: "Alex Chen",
      role: "user",
      passwordHash: userPasswordHash,
      profile: {
        school: defaultProfile.school,
        major: defaultProfile.major,
        graduationYear: defaultProfile.graduationYear,
        preferredRoles: defaultProfile.preferredRoles,
        preferredIndustries: defaultProfile.preferredIndustries,
        location: defaultProfile.location,
        visaNotes: defaultProfile.visaNotes,
        background: defaultProfile.background,
        resumeText: defaultProfile.resumeText,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log("✓ Users seeded");

  // --- Companies ---
  const companiesCol = db.collection("companies");
  await companiesCol.deleteMany({});

  const companyDocs = mockCompanies.map((c) => ({
    ...c,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await companiesCol.insertMany(companyDocs);
  console.log(`✓ ${companyDocs.length} companies seeded`);

  // --- Events ---
  const eventsCol = db.collection("events");
  await eventsCol.deleteMany({});

  const eventDocs = mockEvents.map((e) => ({
    ...e,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await eventsCol.insertMany(eventDocs);
  console.log(`✓ ${eventDocs.length} events seeded`);

  // --- Employer Contexts (cache) ---
  const contextsCol = db.collection("employer_contexts");
  await contextsCol.deleteMany({});
  // Will be populated on first API call per employer
  console.log("✓ Employer contexts collection ready (empty cache)");

  // --- Create indexes ---
  await usersCol.createIndex({ email: 1 }, { unique: true });
  await companiesCol.createIndex({ slug: 1 }, { unique: true });
  await contextsCol.createIndex({ companyName: 1 }, { unique: true });
  await contextsCol.createIndex({ updatedAt: 1 });
  console.log("✓ Indexes created");

  await client.close();
  console.log("\nSeed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
