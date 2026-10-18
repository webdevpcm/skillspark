# SkillSpark

> **"From Skills to Opportunities"**

SkillSpark is an end-to-end full-stack web platform connecting job seekers, early-stage entrepreneurs, startups, mentors, and recruiters in a unified ecosystem. The platform powers skill-first discovery: match with high-precision jobs and internships, join early-stage startup projects, find co-founders and founding teams, connect with industry mentors, and bridge skill gaps with direct learning resources.

---

## 🌟 Key Features

1. **Skill Profiles & Multi-Factor Smart Matching Engine**
   - 70/20/10 scoring engine (`server/services/matching.js`):
     - **70 points:** matched required skills / total required skills
     - **20 points:** matched nice-to-have skills / total nice-to-have
     - **10 points:** experience level alignment (`Student`, `Fresher`, `Junior`, `Mid`)
   - Returns score (0–100%), matched skills, missing skills, and plain-language match reasons.
   - Dropped scores below 30% to maintain high signal-to-noise ratio.
2. **Jobs, Internships & Project Opportunities**
   - Filter by type (`job`, `internship`, `project`), seniority level, remote preference, and keywords.
   - Recruiters, startups, and entrepreneurs can post, edit, and close opportunities.
   - Seekers apply with customized cover notes with guaranteed duplicate prevention via compound indexing.
3. **Skill-Gap Tips & Direct Learning Links**
   - When viewing an opportunity, seekers receive real-time analysis of missing skills.
   - Missing skills are linked directly to curated public resources (e.g. MDN Web Docs, freeCodeCamp, official guides, Coursera).
4. **Startup Project & Idea Board**
   - Founders and seekers can pitch startup concepts across `Idea`, `Building`, and `Launched` stages.
   - One-click interest signalling with live community counters.
5. **Co-Founder & Team Finder**
   - Rank prospective team members and seekers against a startup idea's exact `skillsNeeded` stack.
   - Send role-specific team invitations and manage accept/decline responses.
6. **Mentor Connect**
   - Browse mentors by technical and business expertise (e.g. `React`, `Python`, `Fundraising`, `UI/UX`, `Machine Learning`).
   - Submit mentorship inquiries and manage active mentee connections.
7. **Recruiter Talent Search & Shortlist**
   - Score candidates against specific job openings using the matching engine.
   - Filter candidates by skills or seniority level and maintain candidate shortlists.
8. **Role-Aware Progress Dashboard**
   - Real-time profile completion calculation (0–100%).
   - Metrics, recent applications, applicants, and recommended opportunities per role.
9. **AI Job Description Parser (with Regex Keyword Fallback)**
   - Backend endpoint `POST /api/opportunities/parse` analyzes pasted job text to extract role title, required skills, bonus skills, and experience level.
   - Configurable via `AI_PARSE_ENABLED` and `LLM_API_KEY`. If disabled or offline, smoothly falls back to keyword matching against the 60+ seeded skills.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router v6 + Axios + Lucide React
- **Backend:** Node.js + Express.js (REST API, consistent ES modules)
- **Database:** MongoDB with Mongoose (with automated fallback to embedded `mongodb-memory-server` when no local or Atlas MongoDB is running)
- **Authentication & Security:** JWT + bcryptjs, role-based middleware, express-validator, cors, express-rate-limit

---

## 📁 Project Structure

```text
skillspark/
├── package.json              # Root npm scripts: dev, seed, test
├── README.md                 # Documentation and demo accounts
├── server/
│   ├── package.json          # Backend dependencies and scripts
│   ├── server.js             # Express entry point, health check, auto-seed
│   ├── config.js             # APP_NAME and APP_TAGLINE constants
│   ├── .env.example          # Server environment template
│   ├── config/
│   │   └── db.js             # MongoDB connection with memory-server fallback
│   ├── models/
│   │   ├── User.js           # User schema with 4 role-specific profiles
│   │   ├── Skill.js          # 60+ skills with learning links and aliases
│   │   ├── Opportunity.js    # Jobs, internships, projects with requiredSkills
│   │   ├── Application.js    # Unique compound index on (opportunity, applicant)
│   │   ├── Idea.js           # Startup concepts & interested users
│   │   ├── TeamRequest.js    # Team collaboration invitations
│   │   ├── MentorRequest.js  # Mentorship inquiries
│   │   └── Shortlist.js      # Recruiter candidate shortlist
│   ├── middleware/
│   │   ├── auth.js           # JWT verification & role authorization
│   │   ├── validation.js     # express-validator error handler
│   │   ├── rateLimiter.js    # Auth and API rate limiters
│   │   └── errorHandler.js   # Centralized error handler
│   ├── services/
│   │   ├── matching.js       # 70/20/10 Smart matching engine
│   │   └── aiParser.js       # LLM job parser with keyword fallback
│   ├── controllers/          # Business logic for all 11 domains
│   ├── routes/               # Express REST route definitions
│   ├── seed/
│   │   ├── skillsData.js     # 60 common skills with learning URLs
│   │   ├── seedData.js       # Demo users, opportunities, and ideas
│   │   └── seed.js           # Database reset & seed runner
│   └── tests/
│       ├── matching.test.js  # Unit tests for matching engine (worked examples)
│       └── e2e.test.js       # End-to-end API integration tests
└── client/
    ├── package.json          # Frontend dependencies
    ├── vite.config.js        # Vite build & dev server setup
    ├── tailwind.config.js    # Custom teal & amber palette
    ├── postcss.config.js
    ├── index.html
    ├── .env.example          # Frontend environment template
    └── src/
        ├── config.js         # Client constants (APP_NAME, APP_TAGLINE)
        ├── main.jsx          # React DOM entry with AuthProvider
        ├── App.jsx           # Role-aware routes & protection
        ├── index.css         # Tailwind directives & typography
        ├── api/client.js     # Axios client with JWT interceptor
        ├── context/          # Auth context state & session storage
        ├── components/       # StatusChip, MatchBadge, SkillTag, Navbar, Footer
        └── pages/            # 14 responsive pages
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18 (Tested on Node.js v24)
- npm >= 9

> **Note on MongoDB:** SkillSpark includes an embedded MongoDB memory engine fallback. If you do not have a local MongoDB daemon running, the app automatically boots an embedded MongoDB instance seamlessly.

### 1. Install Dependencies
Run in the root directory:
```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 2. Configure Environment Files
Default `.env` files are already provided for instant development:

**`server/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/skillspark
JWT_SECRET=skillspark-super-secret-jwt-key-2026-production
CLIENT_URL=http://localhost:5173
AI_PARSE_ENABLED=false
LLM_ENDPOINT=https://api.groq.com/openai/v1/chat/completions
LLM_MODEL=llama-3.3-70b-versatile
LLM_API_KEY=
```
*(Leave `AI_PARSE_ENABLED=false` to use the free built-in local keyword parser, or set to `true` with a free Groq, Gemini, or OpenRouter key)*.

**`client/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database
Populate the database with 59 skills, 20 users across all roles, 15 opportunities, 6 ideas, applications, team requests, and mentor requests:
```bash
npm run seed
```

### 4. Run Automated Tests
Execute all unit tests and end-to-end API verification tests:
```bash
npm test
```

### 5. Start Development Servers
Start both backend (port 5000) and frontend (port 5173) concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 👥 Demo Accounts

All demo accounts share the password: **`Password123!`**
*(You can also use the one-click demo autofill buttons on the Login page and Landing page hero)*.

| Role | Name | Email | Focus / Persona |
| :--- | :--- | :--- | :--- |
| **Seeker** | Alex Rivera | `alex.rivera@example.com` | Frontend (React, JS, HTML, CSS, Git) — scores 100% on Frontend Intern |
| **Seeker** | Maya Patel | `maya.patel@example.com` | Backend (Python, Django, PostgreSQL, Docker, AWS) |
| **Seeker** | Liam Chen | `liam.chen@example.com` | UI/UX Designer (Figma, Adobe XD, Wireframing, CSS) |
| **Seeker** | Sophia Zhang | `sophia.zhang@example.com` | Data Analyst (Python, SQL, Data Analysis, Pandas, Tableau) |
| **Seeker** | David Kim | `david.kim@example.com` | Full Stack (React, Node.js, Express, MongoDB, TypeScript) |
| **Entrepreneur** | Maya Lin | `maya.lin@ecopack.io` | EcoPack Innovations (Circular CleanTech bio-packaging) |
| **Entrepreneur** | Kavita Rao | `kavita.rao@finlearn.io` | FinLearn AI (Gamified conversational financial literacy for teens) |
| **Startup** | Sarah Connor | `founder@nexushealth.io` | Nexus Health (HealthTech AI diagnostics) |
| **Startup** | Carlos Mendez | `carlos@ecotrack.co` | EcoTrack (ClimateTech SaaS) |
| **Startup** | Aisha Al-Mansoor | `aisha@codesprint.edu` | CodeSprint (EdTech gaming) |
| **Mentor** | Marcus Vance | `marcus.vance@mentor.com` | 2x Venture Founder & Angel Investor (Fundraising, GTM) |
| **Mentor** | Elena Rostova | `elena.rostova@mentor.com` | Staff Product Designer (UI/UX, Design Systems) |
| **Mentor** | Dr. Anil Mehta | `anil.mehta@mentor.com` | Principal AI Scientist (Machine Learning, Python) |
| **Mentor** | Sarah Jenkins | `sarah.jenkins@mentor.com` | VP of Engineering (Web Architecture, Career Growth) |
| **Recruiter**| Samantha Grey | `sgrey@apextalent.com` | Apex Talent Partners (Senior Tech Recruiter) |
| **Recruiter**| Jordan Blake | `jordan@horizonventures.com` | Horizon Ventures Portfolio Talent |
| **Recruiter**| Priya Sharma | `priya@bytewave.io` | ByteWave Labs Tech Talent |

---

## 🧮 Matching Formula & Worked Examples

The matching score is computed in `server/services/matching.js` as follows:
$$\text{Score} = \text{round}\left( \left(\frac{|\text{Matched Required}|}{|\text{Total Required}|} \times 70\right) + \left(\frac{|\text{Matched Nice-to-Have}|}{|\text{Total Nice-to-Have}|} \times 20\right) + \text{Level Bonus (10 or 0)} \right)$$

### Worked Verification Examples:
- **Alex Rivera** (Skills: `React`, `JavaScript`, `HTML`, `CSS`, `Git`; Level: `Fresher`):
  - **"Frontend Intern"** (Required: `React`, `JavaScript`, `HTML`, `CSS`; Nice-to-have: `Git`; Levels: `Fresher`, `Student`):
    - Required: $4/4 \times 70 = 70$
    - Nice-to-have: $1/1 \times 20 = 20$
    - Level: $10$
    - **Total: 100% Match**
  - **"Junior UI/UX Designer"** (Required: `Figma`, `Adobe XD`, `CSS`; Nice-to-have: `HTML`; Levels: `Fresher`):
    - Required: $1/3 \times 70 = 23.33$ (`CSS` matches; missing: `Figma`, `Adobe XD`)
    - Nice-to-have: $1/1 \times 20 = 20$ (`HTML` matches)
    - Level: $10$
    - **Total: round(53.33) = 53% Match**
  - **"Backend Developer"** (Required: `Node.js`, `MongoDB`, `Express`; Levels: `Junior`):
    - Required skill overlap: 0. Does not appear in `/api/matches` (score below 30 threshold).

---

## 💡 Engineering Assumptions & Decisions

1. **Embedded MongoDB Fallback:** To ensure zero-friction local development on any developer machine (even without a pre-installed `mongod` service), the backend attempts a standard MongoDB connection with a 3-second timeout, falling back automatically to an embedded `mongodb-memory-server`.
2. **Auto-Seed on Startup:** If the database contains zero skills on server boot, `server.js` automatically runs `runSeed()` so that demo accounts, opportunities, and ideas are populated immediately out-of-the-box.
3. **Skill Normalization:** Skills are normalized (trimmed and case-insensitive) and alias-aware, allowing e.g. "ReactJS" or "React.js" to reliably match "React".
4. **AI Job Parsing:** When `AI_PARSE_ENABLED=true` and `LLM_API_KEY` is provided, the backend queries an OpenAI-compatible completion API. When disabled or if the API call fails, the robust regex keyword parser matches text against the canonical Skill collection with zero downtime.
5. **Security:** Passwords hashed with bcrypt (cost factor 10), JWT tokens signed with expiration, auth endpoints rate-limited, and strict role/ownership authorization enforced on all mutative routes.
