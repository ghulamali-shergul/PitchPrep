# PitchPrep

**AI-powered career fair preparation platform that helps students research companies, generate personalized elevator pitches, and prioritize employer visits.**

> Walk in prepared. Walk out hired.

🌐 **Live Demo:** [https://pitch-prep.vercel.app/](https://pitch-prep.vercel.app/)

**Admin credentials**
username: admin@pitchprep.com
password: admin123

**User Credentials**
username: user@gmail.com
password: 12345

---

## Demo Video

[![PitchPrep Demo](https://img.shields.io/badge/▶%20Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=Ejo_T2jquYQ)

<!-- Replace the link above with your actual YouTube URL -->

---

## The Problem

Students walk into career fairs unprepared. They give generic pitches, waste time at irrelevant booths, and leave without meaningful connections. Career services teams manage employer lists manually with no smart tooling.

## The Solution

PitchPrep uses **OpenAI GPT-4o-mini** to generate personalized career fair prep materials for each student-company combination. It scores how well a student matches each employer and provides everything they need to make a strong impression.

---

## Features

### For Students
- **AI Match Scoring** — Each company gets a 0–100% match score based on 6 categories (location, work authorization, major, job type, skills, resume fit)
- **Personalized Elevator Pitches** — AI-generated 30-second pitches tailored to the student's background and the specific company
- **Career Fair Cards** — Wow facts with sources, smart questions to ask recruiters, top roles to target, and follow-up email templates
- **Event Dashboard** — Browse upcoming career fairs, see attending companies sorted by match score
- **Batch Generation** — Generate pitches for all companies in one click, or one at a time
- **Resume Upload** — PDF/DOCX parsing for automatic profile enrichment
- **Pagination** — Clean navigation through large employer lists (5 per page)

### For Admins (Career Services)
- **Event Management** — Create career fair events with date, location, and description
- **Company Management** — Add companies individually or bulk import via comma-separated names
- **Employer Assignment** — Link companies to specific events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | MongoDB Atlas |
| **AI** | OpenAI GPT-4o-mini |
| **Auth** | JWT with bcrypt password hashing |
| **Fonts** | Geist Sans & Geist Mono |

---

## Architecture

```
Browser
  │
  ├─► Next.js Frontend (React 19 + Tailwind CSS)
  │       │
  │       ▼
  ├─► API Routes (/api/*)
  │       │
  │       ├─► MongoDB Atlas
  │       │     ├── users (profiles, credentials)
  │       │     ├── companies (employer data + AI cards)
  │       │     ├── events (career fairs)
  │       │     ├── pitches (per-user per-company)
  │       │     └── employer_contexts (AI research cache)
  │       │
  │       └─► OpenAI API
  │             ├── Employer research (company context)
  │             └── Pitch generation (personalized content)
  │
  └─► JWT Auth (localStorage token)
```

---

## Match Score Algorithm

Each company is scored across 6 categories (0–20 points each, total 0–120, displayed as 0–100%):

| Category | What It Measures |
|----------|-----------------|
| **Location** | Student location vs. company HQ proximity |
| **Work Auth** | Visa/sponsorship compatibility |
| **Major** | Degree alignment with company needs |
| **Job Type** | Role preference match |
| **Skills** | Technical skills overlap |
| **Resume** | Overall resume relevance |

Score colors: 🟢 85%+ (strong match) · 🟡 70–84% (moderate) · ⚪ below 70%

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account ([free tier](https://www.mongodb.com/cloud/atlas))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))

### 1. Clone & Install

```bash
git clone https://github.com/Wahid-Haidari/PitchPrep.git
cd PitchPrep
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_random_secret_string
OPENAI_MODEL=gpt-4o-mini
```

> Generate a JWT secret: `openssl rand -hex 32`

### 3. Seed the Database

```bash
npm run seed
```

This populates the database with sample users, companies, and events.

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `user@gmail.com` | `12345` |
| Admin | `admin@pitchprep.com` | `admin123` |

---

## Project Structure

```
app/
  ├── page.tsx              # Landing page
  ├── login/                # Authentication
  ├── profile/              # Student profile & resume upload
  ├── app/                  # Student dashboard
  │   └── event/[id]/       # Event detail with company table
  ├── company/[slug]/       # Company detail with AI pitch
  ├── admin/                # Admin dashboard
  │   └── event/[id]/       # Admin event & company management
  └── api/
      ├── auth/             # Login, register, logout, me
      ├── companies/        # CRUD, bulk add, clear AI data
      ├── events/           # CRUD, company assignment
      ├── pitch/generate/   # AI pitch generation
      ├── resume/           # Resume suggestions
      └── users/profile/    # Profile management

components/
  ├── domain/               # Business components (cards, filters, panels)
  ├── layout/               # Navbar, Footer
  └── ui/                   # Reusable UI (Button, Card, Badge, Modal, etc.)

lib/
  ├── api-client.ts         # Frontend API wrapper
  ├── AuthContext.tsx        # Auth state management
  ├── CompanyStoreContext.tsx # Company/event state management
  ├── types.ts              # TypeScript interfaces
  ├── db/
  │   ├── mongodb.ts        # Database connection
  │   └── seed.ts           # Database seeder
  └── services/
      ├── auth.ts           # JWT utilities
      └── openai.ts         # AI prompt engineering
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add the 4 environment variables
4. Deploy — done in under 5 minutes

> Make sure MongoDB Atlas Network Access allows `0.0.0.0/0` for Vercel's serverless functions.

---

## Built By
  - **Ghulam Ali Doulat**
  - **Lkhanaajav Mijiddorj**
  - **Rajeev Kumar**
  - **Wahid Haidari** — [GitHub](https://github.com/Wahid-Haidari)
