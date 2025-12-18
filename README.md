# SkillSwap (DurHack 2025)

SkillSwap is a peer-to-peer learning platform built at DurHack 2025. Users create a profile with what they can teach and what they want to learn, then the app recommends potential matches for 1:1 skill swaps. The project is split into a lightweight React frontend and a Node/Express REST API backend.

This repository was built as a hackathon project (fast iteration, small team). My main contribution was the backend: API design, endpoints, matching logic, Supabase integration, and database migrations.

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express (REST API)
- Database: Supabase (Postgres) + migrations in `supabase/migrations`
- AI (optional): Google Gemini for structured skill extraction and optional match ranking signals
- Chat (optional): TalkJS integration + DB support for conversations/unread counts

## Repo structure

- `backend/` Express API (routes, services, config)
- `src/` React app source
- `supabase/migrations/` Postgres schema + functions/triggers

## Running locally

### Prerequisites

- Node.js (recommended: Node 18+)
- A Supabase project (for `SUPABASE_URL` + keys)
- Optional: Gemini API key (to enable AI endpoints / AI-enhanced matching)
- Optional: TalkJS App ID + Secret (to enable TalkJS auth signature endpoint)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Do not commit secrets. Create local env files from the examples:

- Frontend (Vite): copy `.env.example` → `.env.local` (recommended)
- Backend (Express): copy `backend/.env.example` → `backend/.env`

Backend env vars used:

- `SUPABASE_URL` (required)
- `SUPABASE_SERVICE_KEY` (required for backend server-side operations)
- `GEMINI_API_KEY` (optional)
- `TALKJS_APP_ID` (optional)
- `TALKJS_SECRET_KEY` (optional)
- `PORT` (optional, defaults to 3000)

### 3) Run the app

Run both frontend + backend:

```bash
npm run dev
```

Or run just the backend:

```bash
npm run dev:backend
```

Backend health check:

- `GET http://localhost:3000/health`

## What’s interesting in the code

- Matching logic (reciprocal skills + simple compatibility, AI optional): `backend/services/matchingService.js`
- Skill extraction + learning plan generation (Gemini): `backend/services/aiService.js`
- Chat endpoints + TalkJS signature generation: `backend/routes/chat.js`
- Database schema, triggers, and helper RPC functions (unread counts, last message previews): `supabase/migrations/`

## Testing

There is a small smoke test suite (API health + basic routing):

```bash
npm test
```

## Notes / security

- This repo includes example env files only. Real API keys should never be committed.
- The backend uses a Supabase service role key for server-side operations; treat it like a secret.
