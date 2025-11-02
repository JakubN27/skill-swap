# SkillSwap Documentation 📚

> **Complete documentation hub for the SkillSwap platform - Your comprehensive context center for development, troubleshooting, and onboarding.**

Built for DurHack 2025 🚀

---

## 📖 Documentation Structure

This documentation is organized into **5 core files** for easy navigation:

### 🌟 [OVERVIEW.md](./OVERVIEW.md)
**What is SkillSwap?**
- Project summary and vision
- Key features and capabilities
- Tech stack overview
- System architecture diagram
- User workflows
- Team information

👉 **Read this first** if you're new to the project!

---

### 🛠️ [SETUP.md](./SETUP.md)
**Getting Started**
- Prerequisites and requirements
- Installation instructions
- Environment configuration
- Database setup
- Running the application
- Common setup issues and fixes

👉 **Start here** to get SkillSwap running locally!

---

### 🏛️ [ARCHITECTURE.md](./ARCHITECTURE.md)
**Technical Deep Dive**
- Database schema and relationships
- API architecture and endpoints
- Matching algorithm explained
- Chat integration with TalkJS
- AI features (Gemini integration)
- Security and authentication
- Performance optimizations
- State management
- Testing strategy

👉 **Read this** to understand how everything works!

---

### 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
**Problem Solving Guide**
- Quick diagnostics
- Common issues and solutions
- Database troubleshooting
- Chat and conversations issues
- Authentication problems
- API and backend issues
- Frontend debugging
- Development environment fixes

👉 **Check here** when something breaks!

---

### 👥 [DEVELOPMENT.md](./DEVELOPMENT.md)
**Team Workflow & Standards**
- Team structure and roles
- Development workflow
- Git and version control
- Project structure
- Development phases
- Task management
- Code standards
- Testing guidelines
- Deployment checklist

👉 **Follow this** for team coordination and best practices!

---

## � Quick Links

### For New Team Members
1. Start with [OVERVIEW.md](./OVERVIEW.md) - Understand the project
2. Follow [SETUP.md](./SETUP.md) - Get your environment running
3. Read [DEVELOPMENT.md](./DEVELOPMENT.md) - Learn the workflow
4. Bookmark [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - For when you need help

### For Developers
- **Backend work?** → [ARCHITECTURE.md](./ARCHITECTURE.md) (API section)
- **Frontend work?** → [ARCHITECTURE.md](./ARCHITECTURE.md) (Frontend section)
- **Chat issues?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (Chat section)
- **Database work?** → [ARCHITECTURE.md](./ARCHITECTURE.md) (Database section)

### For Debugging
- **Something broken?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (Start here!)
- **500 errors?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#issue-500-internal-server-error)
- **Chat not working?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#chat--conversations-issues)
- **Setup problems?** → [SETUP.md](./SETUP.md#troubleshooting-common-setup-issues)

---

## 🎯 Quick Start (TL;DR)

**Never set up before? Do this:**

```bash
# 1. Clone and install
git clone <repo-url>
cd durhack-2025
npm install

# 2. Configure environment (see SETUP.md for details)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit both .env files with your credentials

# 3. Run database migration
./scripts/setup-chat-db.sh

# 4. Start everything
npm run dev
```

**Already set up? Just run:**

```bash
npm run dev
```

See [SETUP.md](./SETUP.md) for detailed instructions.

---

## 🌟 Project Overview

**SkillSwap** is an AI-powered peer-to-peer learning platform that connects people who want to learn with those who want to teach.

### Key Features
- **🎯 Smart Matching** - Reciprocal skill-based algorithm
- **💬 Real-time Chat** - Integrated TalkJS messaging
- **🤖 AI Features** - Skill extraction & learning plans
- **📊 Match Scores** - Compatibility percentages
- **🔍 Search & Discovery** - Find learning partners

### Tech Stack
- **Frontend:** React 19 + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **Chat:** TalkJS
- **AI:** Google Gemini

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (or 20.19+)
- npm or pnpm
- Supabase account
- Gemini API key (optional)

### 1. Install Dependencies

```bash
# Install all dependencies using npm workspaces (single command!)
npm install
```

This installs all dependencies for the root, backend, and frontend in a shared `node_modules` directory.

### 2. Configure Environment

**Backend** (`backend/.env`):
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key (optional)
PORT=3000
```

**Frontend** (`frontend/.env.local`):
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3000
VITE_TALKJS_APP_ID=your_talkjs_app_id
VITE_GEMINI_API_KEY=your_gemini_key (optional)
```

> **Note**: Get your TalkJS App ID from [TalkJS Dashboard](https://talkjs.com/dashboard)

### 3. Setup Database

Run the migration in Supabase SQL Editor:
```bash
# Copy contents of supabase/migrations/20251101000000_initial_schema.sql
# Paste into Supabase SQL Editor and run
```

### 4. Seed Test Data

```bash
# From project root
npm run seed --workspace=backend

# Or
cd backend && npm run seed
```

This creates 6 test users with perfect reciprocal matches.

### 5. Start Development

```bash
# From project root
npm run dev
```

Opens:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 📖 Usage

### Test Users

Login with any of these (any password works):
- **alice@test.com** - React/JS expert ↔ wants Python/ML
- **bob@test.com** - Python/ML expert ↔ wants React
- **carol@test.com** - iOS expert ↔ wants Android/Node.js
- **david@test.com** - Node.js expert ↔ wants iOS/Android
- **emma@test.com** - Designer ↔ wants JavaScript
- **frank@test.com** - DevOps ↔ wants Python/ML

### Getting Started

1. **Sign up** or use a test account
2. **Complete your profile** - Add skills you can teach and want to learn
3. **Find matches** - Click "Find New Matches" on dashboard
4. **Browse matches** - Search for specific skills
5. **Connect** - Click "Connect & Start Chat" on a match
6. **Chat** - Start learning together in real-time!
7. **Manage conversations** - View all chats in the Conversations page

---

## � How Matching Works

The matching algorithm calculates **reciprocal scores**:

1. **Score A→B**: How well User A can teach what User B wants to learn
2. **Score B→A**: How well User B can teach what User A wants to learn  
3. **Match Score**: Average of both directions (0-100%)

**Scoring:**
- Exact skill name match: 100% weight
- Category match: 30% weight
- Partial name match: 70% weight

**Example:**
- Alice teaches React → Bob wants React ✅
- Bob teaches Python → Alice wants Python ✅
- **Match Score: 95%** 🎉

---

## 📁 Project Structure

```
durhack-2025/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── pages/        # Dashboard, Profile, Matches, etc.
│   │   ├── components/   # Reusable components
│   │   └── lib/          # Supabase client
│   └── package.json
├── backend/              # Express API
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic (matching, AI)
│   ├── config/          # Supabase & Gemini setup
│   └── scripts/         # Database seeding
├── supabase/            # Database migrations
└── docs/                # Documentation
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Delete user

### Matching
- `GET /api/matching/find/:userId?limit=10` - Find matches
- `POST /api/matching/create` - Create match
- `GET /api/matching/user/:userId` - Get user's matches
- `GET /api/matching/:matchId` - Get match details

### AI (if Gemini configured)
- `POST /api/ai/skill-extraction` - Extract skills from bio
- `POST /api/ai/learning-plan` - Generate learning plan
- `POST /api/ai/session-summary` - Session summary
- `POST /api/ai/motivational-nudge` - Get motivation

See `backend/API_DOCUMENTATION.md` for full details.

---

## �️ Development

### Available Scripts

```bash
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run install:all      # Install all dependencies
npm run build            # Build frontend for production
npm run clean            # Remove all node_modules
npm run fresh-install    # Clean reinstall
```

### Backend Scripts

```bash
# From project root:
npm run seed --workspace=backend   # Seed test data

# Or from backend directory:
cd backend
npm run seed             # Seed test data
npm run dev              # Start with hot reload
npm start                # Production mode
```

---

## 📚 Legacy Documentation

The `/docs` folder contains additional documentation files from earlier development phases. These are preserved for historical reference:

- **Setup Guides:** Various setup documentation from different phases
- **Feature Guides:** Detailed guides for chat, matching, and profile features  
- **Fix Documentation:** Detailed records of issues resolved during development
- **Team Planning:** Original team organization and task boards
- **Migration Guides:** Database migration documentation

**Note:** The 5 core documentation files above supersede these legacy files. Refer to the legacy docs only if you need historical context or specific implementation details not covered in the main documentation.

---

## 🤝 Contributing

1. Read [DEVELOPMENT.md](./DEVELOPMENT.md) for workflow and standards
2. Check [TASK_BOARD.md](./TASK_BOARD.md) for available tasks
3. Create a feature branch
4. Make your changes
5. Test thoroughly (see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md))
6. Submit pull request

---

## 🆘 Getting Help

### When Something Goes Wrong

1. **Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Most common issues are documented
2. **Check browser console** - Look for errors (F12)
3. **Check backend logs** - Terminal where `npm run dev` is running
4. **Test API directly** - Use curl or browser to test endpoints
5. **Check database** - Use Supabase dashboard to verify data

### Still Stuck?

Include this information when asking for help:
- What you were trying to do
- Steps to reproduce
- Error messages (console + backend)
- Your environment (OS, Node version, browser)
- User ID / Match ID (if applicable)

---

## 📄 License

Built for DurHack 2025

---

## 🙏 Acknowledgments

- **Supabase** - Database and authentication
- **TalkJS** - Real-time chat
- **Google Gemini** - AI features
- **DurHack 2025** - Hackathon organizers

---

**Happy Coding! 🚀**

*Last Updated: January 2025*