# TechNeeds 2.0: AI-Powered Multi-Role Mentorship Platform

Next.js 15 (frontend) + Express 5 / MongoDB (backend) + JWT roles + Gemini for the AI Profile.

## Run locally
```bash
# 1. backend
cd backend
cp .env.example .env        # fill MONGO_URI, JWT_SECRET, LLM_API_KEY (optional)
npm install
npm run seed                # wipes the DB and loads demo data (prints credentials)
npm run dev                 # http://localhost:5000
npm test                    # points / ranking / badge / AI-fallback tests

# 2. frontend (new terminal)
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm install
npm run dev                 # http://localhost:3000
```
`npm run seed` deletes every collection first. Never run it against real data.

## Demo logins
| Role | Login | Password |
|---|---|---|
| Admin | admin@techneeds.in | Admin@2026 |
| Mentor | priya.sharma@techneeds.in | Mentor@001 |
| Mentor | ankit.verma@techneeds.in | Mentor@002 |
| Mentee | TN26-0001 (Aarav, Web Dev) | Pass@1234 |
| Mentee | TN26-0002 (Diya, Web Dev) | Pass@1234 |
| Mentee | TN26-0003 ... TN26-0010 | Pass@1234 (forced password change on first login) |


## Points (rule-based, in `backend/utils/points.js`)
Quiz `round(score/max*100)` + 10 on-time bonus per quiz, +5 per completed video, up to 100 per verified project.
Ties: earliest last activity wins. AI never decides ranks, points or badges. It only writes the summary and suggestions, and falls back to a template if the key is missing or the call fails.

## API summary
- `POST /api/auth/login`, `POST /api/auth/change-password`, `POST /api/mentor-requests`
- Public: `GET /api/public/cohorts`, `GET /api/public/leaderboard/:cohortId`
- Admin (`/api/admin`): stats, mentor-requests (+approve/reject), cohorts CRUD, assign/remove mentor, analytics, mentors
- Mentor (`/api/mentor`): me, cohorts, cohorts/:id/overview, mentees/bulk, videos, quizzes, mentees/:id/profile
- Mentee (`/api/m`): dashboard, cohorts/:id, resources/:id/complete, resources/:id/quiz (+/submit), profile (+/refresh), avatar
All non-public routes are role-checked on the server (`middleware/requireRole.js`).

## Not built (future scope)
AI auto-labelling of uploads, mentor support alerts, mentor handover, adaptive practice, reminders/notifications, per-video discussion, mentor ratings, project submissions UI (backend model fields kept).
