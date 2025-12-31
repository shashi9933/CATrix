# 📦 DETAILED DEPLOYMENT GUIDE: Database, Schema & Backend

## 🎯 The Complete Flow (What Happens)

```
Your Computer (Local)
    ↓
GitHub Repository
    ↓
Railway (Reads from GitHub)
    ├─ Creates PostgreSQL Database (empty)
    ├─ Runs your Backend Code
    ├─ Your Backend Creates Schema (automatic)
    └─ Your Backend Connects & Uses Database
    
User (Browser) → Vercel → Railroad Backend → PostgreSQL
```

---

## 🔄 Step-by-Step: Database → Schema → Backend → User

### PART 1: SETUP DATABASE ON RAILWAY (No Upload Needed!)

#### Step 1.1: Create Railway Account

```
1. Go to: https://railway.app
2. Click "Start Free"
3. Sign up with GitHub
4. Authorize Railway to access your repos
```

#### Step 1.2: Create New Project with Database

```
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Choose your "catrix" repository
4. Click "Continue"
```

#### Step 1.3: Add PostgreSQL Database

```
1. In your Railway project, click "Add"
2. Select "Database" → "PostgreSQL"
3. Click "Add PostgreSQL"

✅ Railway CREATES EMPTY DATABASE AUTOMATICALLY!
   - Database name: catrix_db (automatic)
   - User: postgres (automatic)
   - Password: (auto-generated, Railway stores it)
   - Host: (auto-generated private URL)
   - Port: 5432 (standard)
```

**What You Get Automatically:**
```
DATABASE_URL = postgresql://postgres:abc123xyz@db.railway.internal:5432/catrix_db

This is stored in Railway Variables (like .env)
Your backend code will READ this automatically!
```

#### Step 1.4: View Database Connection Info

```
In Railway Dashboard:
1. Click on "PostgreSQL" box
2. Click "Connect"
3. You see:
   - DATABASE_URL (don't share this!)
   - Host: db.railway.internal
   - Port: 5432
   - Database: catrix_db
   - User: postgres
   - Password: (hidden, but available)

Your backend WILL USE THIS AUTOMATICALLY ✅
```

---

### PART 2: DEPLOY BACKEND CODE TO RAILWAY

#### Step 2.1: Add Environment Variables

```
In Railway Project Dashboard:

1. Click on "Backend" service (or your app name)
2. Click "Variables"
3. Add these variables:

   DATABASE_URL = postgresql://postgres:auto@db.railway.internal:5432/catrix_db
   (Copy from PostgreSQL connection info)
   
   JWT_SECRET = your-super-secret-key-12345
   (Can be anything - keep it secret!)
   
   NODE_ENV = production
   
   PORT = 3000
```

#### Step 2.2: Deploy Code

```bash
# In your local terminal:

# 1. Make sure all code is committed
git status
# Should show: "On branch main, nothing to commit"

# 2. If not committed, commit it:
git add .
git commit -m "Ready for deployment"

# 3. Push to GitHub
git push origin main

# 4. Railway AUTOMATICALLY:
#    ✅ Detects changes
#    ✅ Pulls latest code
#    ✅ Installs dependencies (npm install)
#    ✅ Builds project (npm run build)
#    ✅ Starts backend (npm start)
```

**Watch in Railway Dashboard:**
```
Deployments tab:
- Status: "Building..." → "Deploying..." → "Running" ✅
- Logs show: "npm install" → "npm start"
- Your backend is NOW ONLINE!
```

---

### PART 3: SCHEMA DEPLOYMENT (Automatic!)

#### Step 3.1: How Schema Gets Created

**YOUR BACKEND AUTOMATICALLY CREATES THE SCHEMA:**

```
When your backend starts:

backend/src/index.ts:
┌─────────────────────────────────────────┐
│ const { PrismaClient } = require(...)   │
│ const prisma = new PrismaClient()       │
│                                         │
│ ✅ Connects to DATABASE_URL (Railway)   │
│ ✅ Checks if schema exists              │
│ ✅ Creates schema if missing            │
│ ✅ Ready to handle requests             │
└─────────────────────────────────────────┘
```

#### Step 3.2: Verify Schema Created

```bash
# In Railway Dashboard:

1. Click on PostgreSQL box
2. Click "Connect" tab
3. Click "Open in Adminer" or "View Logs"

# In terminal (if using pgAdmin):
psql postgresql://postgres:password@host:5432/catrix_db

# Then:
\dt              # Shows all tables
\d users         # Shows users table structure
SELECT * FROM users;  # See if empty
```

**After backend starts, you should see:**
```
           List of relations
 Schema |      Name      | Type  | Owner
────────┼────────────────┼───────┼──────
 public | users          | table | postgres
 public | tests          | table | postgres
 public | questions      | table | postgres
 public | test_attempts  | table | postgres
 ... (all tables created!)
```

---

### PART 4: BACKEND & DATABASE WORK TOGETHER

#### Step 4.1: Backend Starts

```
When Railway starts your backend:

1. Node.js loads backend/src/index.ts
2. Prisma connects to DATABASE_URL
3. Reads Prisma schema from backend/prisma/schema.prisma
4. Creates all tables automatically
5. Server starts on port 3000
6. Railway assigns public URL: https://catrix-api-prod.railway.app
```

#### Step 4.2: User Makes Request

```
User in Browser:
1. Clicks "Login"
2. Frontend (Vercel) sends POST to:
   https://catrix-api-prod.railway.app/api/auth/login
   
Backend (Railway):
3. Receives request
4. Uses Prisma to query PostgreSQL database:
   SELECT * FROM users WHERE email = ?
   
PostgreSQL (Railway Database):
5. Returns data from database
   
Backend:
6. Processes response, returns to frontend
   
Frontend:
7. Shows login result to user
```

---

## 📋 File Structure & What Gets Deployed

```
Your Local Repository:
catrix/
├── backend/
│   ├── src/
│   │   ├── index.ts          ← Entry point (starts server)
│   │   ├── routes/           ← API endpoints
│   │   └── middleware/       ← JWT, CORS, etc.
│   ├── prisma/
│   │   └── schema.prisma     ← ✅ DEPLOYED (schema lives here!)
│   ├── package.json          ← ✅ DEPLOYED (dependencies)
│   └── .env.production       ← DO NOT INCLUDE (Railway uses Variables)
│
├── CATrix/ (Frontend - deploys to Vercel, not Railway)
│   ├── src/
│   ├── package.json
│   └── .env.production
│
└── .git/                     ← NEEDED for Railway

What Railway Gets:
├── backend/src/index.ts      (starts your server)
├── backend/prisma/           (schema lives here!)
├── backend/package.json      (installs dependencies)
└── backend/.gitignore        (protects secrets)

Railway IGNORES:
✗ .env files (Railway uses Variables instead)
✗ node_modules/ (Railway runs npm install)
✗ build/ output (Railway builds fresh)
✗ .git history (Railway only needs latest code)
```

---

## 🔑 Critical: Environment Variables

### On Your Local Computer:

```
backend/.env (NEVER commit to Git!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE_URL=postgresql://user:pass@localhost:5432/catrix_dev
JWT_SECRET=local-dev-secret-key
NODE_ENV=development
PORT=3000
```

### On Railway:

```
Railway Variables (NOT a file - stored in Railway)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE_URL=postgresql://postgres:auto123@db.railway.internal:5432/catrix_db
JWT_SECRET=your-production-secret-key
NODE_ENV=production
PORT=3000

How Railway Uses Them:
- When backend starts, Railway sets these as environment variables
- Your code reads: process.env.DATABASE_URL
- Connects to production PostgreSQL automatically
```

---

## 🎬 Complete Deployment Process (Visual)

### Timeline: What Happens Step-by-Step

```
MINUTE 0: You Push Code
└─ git push origin main
   └─ Code goes to GitHub

MINUTE 1: Railway Detects Change
└─ Webhook: "New commit detected"
   └─ Railway fetches latest code

MINUTE 2-3: Railway Builds
└─ cd backend && npm install
   └─ Downloads all dependencies from npm

MINUTE 4: Railway Starts Backend
└─ node src/index.ts
   └─ Loads Prisma client

MINUTE 5: Prisma Creates Schema
└─ Reads backend/prisma/schema.prisma
   └─ Checks PostgreSQL database
   └─ Creates all missing tables
   └─ Server ready on port 3000

MINUTE 6: Railway Makes It Public
└─ Assigns URL: https://catrix-api-prod.railway.app
   └─ Backend is ONLINE! ✅

MINUTE 7: Frontend Deploys (Vercel)
└─ Updates VITE_API_URL to Railway URL
   └─ Frontend points to backend
   └─ App is FULLY ONLINE! ✅
```

---

## 🗄️ Database Files Explained

### backend/prisma/schema.prisma (Critical!)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ← Reads from Railway Variables!
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String
  // ... more fields
}

// When Prisma loads:
// 1. Reads DATABASE_URL from Railway environment
// 2. Connects to Railway PostgreSQL
// 3. Creates table "User" as "users" in database
// 4. Your code can now use: prisma.user.findMany()
```

### backend/prisma/migrations/

```
migrations/
├── 20240315000000_initial_schema/
│   └── migration.sql  ← Schema SQL code
└── migration_lock.toml

When backend starts:
1. Prisma checks which migrations ran
2. Runs any NEW migrations automatically
3. Updates database schema
4. Stores history in _prisma_migrations table
```

---

## 🔗 How Data Flows

### Scenario: User Takes a Test

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER IN BROWSER (Vercel Frontend)                    │
│    Clicks "Start Test"                                  │
│    Frontend code: POST /api/tests/1/attempt              │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS Request
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. RAILWAY BACKEND (Your Node.js Server)                │
│    Receives POST /api/tests/1/attempt                    │
│    Backend code reads request body                       │
│                                                          │
│    const attempt = await prisma.testAttempt.create({    │
│      data: {                                             │
│        userId: 123,                                      │
│        testId: 1,                                        │
│        ...                                               │
│      }                                                   │
│    })                                                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ SQL Query
                         │ INSERT INTO test_attempts ...
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. RAILWAY POSTGRESQL DATABASE (Your Data)              │
│    Receives INSERT query                                │
│    Creates new row in test_attempts table               │
│    Returns: { id: 5, userId: 123, testId: 1, ... }     │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ Response with data
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. RAILWAY BACKEND                                      │
│    Receives response: { id: 5, ... }                    │
│    Sends HTTP response to frontend                      │
│    { success: true, attemptId: 5 }                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTPS Response
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. FRONTEND (Vercel)                                    │
│    Receives response                                    │
│    Shows test questions to user                         │
│    ✅ DONE!                                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Checklist

### Before Deploying to Railway

```
☐ Your local code is working
  npm start (backend) → starts without errors
  npm run dev (frontend) → shows app

☐ Code is committed to Git
  git status → "nothing to commit"
  git log → shows your commits

☐ .env files are NOT committed
  git ls-files | grep .env → should be empty
  (If .env shows, run: git rm --cached .env)

☐ backend/prisma/schema.prisma exists
  Should have User, Test, Question models

☐ backend/package.json has correct scripts
  "start": "node src/index.ts"
  "build": "tsc" (if using TypeScript)
```

### On Railway

```
☐ Project created
☐ PostgreSQL database added
☐ Environment variables set:
  - DATABASE_URL (from PostgreSQL connection)
  - JWT_SECRET
  - NODE_ENV = production

☐ Backend deployed (shows "Running")
☐ Check logs: no errors

☐ Database has tables
  Open in Adminer: see users, tests, questions tables
```

### On Vercel

```
☐ Frontend deployed
☐ Environment variable set:
  VITE_API_URL = https://your-railway-url.railway.app

☐ Frontend shows no errors
```

### Testing

```
☐ Visit: https://your-frontend.vercel.app
☐ Click "Signup" → creates user in Railway PostgreSQL
☐ Click "Login" → reads user from Railway PostgreSQL
☐ Click "Test" → queries tests & questions from database
✅ Everything works!
```

---

## 🆘 Troubleshooting

### Problem: "Cannot connect to database"

**Cause**: Backend can't read DATABASE_URL

**Solution**:
```bash
# 1. Check Railway Variables:
#    Settings → Variables
#    Should show: DATABASE_URL=postgresql://...

# 2. Check Railway Logs:
#    Deployments → Latest → Logs
#    Look for: "Connected to database" or error

# 3. If error, manually add DATABASE_URL:
#    Copy from PostgreSQL → Connect tab
#    Paste in Railway Variables
```

### Problem: "Table does not exist"

**Cause**: Schema not created, Prisma migration didn't run

**Solution**:
```bash
# 1. In Railway logs, look for Prisma errors
# 2. Check if migration ran:
#    SELECT * FROM _prisma_migrations;

# 3. Force re-deploy:
#    Make small change to backend code
#    git add . && git commit -m "trigger redeploy"
#    git push

# 4. If still fails, SSH into Railway and run manually:
#    npx prisma db push
```

### Problem: "Frontend can't reach backend"

**Cause**: Wrong API URL in frontend

**Solution**:
```bash
# 1. In Vercel, check environment variable:
#    Settings → Environment Variables
#    VITE_API_URL = https://your-backend.railway.app (NO trailing slash)

# 2. Redeploy frontend:
#    Make change to any file
#    git push (Vercel auto-deploys)

# 3. Check frontend logs:
#    Deployments → Runtime → Logs
#    Should show successful API calls
```

### Problem: "Data disappears after restart"

**Cause**: Not using persistent database, or data wasn't saved

**Solution**:
```bash
# 1. Verify data actually saved:
#    In Railway Adminer: SELECT * FROM users;
#    Should show created users

# 2. If empty, backend not connecting properly
#    Check DATABASE_URL in Railway Variables

# 3. If data exists but not showing, frontend issue
#    Check frontend API URL
```

---

## 📊 Summary: What Lives Where

| Component | Location | Provider | Cost |
|-----------|----------|----------|------|
| **PostgreSQL Database** | Railway | Railway Free Tier | $0/month |
| **Backend (Node.js)** | Railway | Railway Free Tier | $0/month |
| **Frontend (React)** | Vercel | Vercel Free Tier | $0/month |
| **Schema (Prisma)** | Backend code | Part of backend | $0/month |
| **Domain (optional)** | Registrar | Namecheap, GoDaddy | $1-15/year |
| **Total** | All cloud | Free tier | **$0/month** |

---

## 🔄 Complete Workflow Summary

### LOCAL (Your Computer)
```
1. Write code in VS Code
2. Run locally: npm start (backend) + npm run dev (frontend)
3. Test everything works
4. git add . && git commit -m "message"
5. git push origin main
```

### GITHUB
```
6. Code sits in GitHub repository
7. Railway & Vercel watch this repo
```

### RAILWAY (Backend + Database)
```
8. Detects new code pushed
9. Runs: npm install → npm start
10. Prisma connects to PostgreSQL
11. Prisma creates/updates schema
12. Backend is online on public URL
```

### VERCEL (Frontend)
```
13. Detects new code pushed
14. Builds frontend: npm run build
15. Deploys to CDN
16. Frontend is online on public URL
```

### USER
```
17. Opens https://your-app.vercel.app in browser
18. Frontend loads from Vercel
19. Clicks login
20. Frontend sends request to https://railway-backend.railway.app
21. Backend queries Railway PostgreSQL
22. User sees their data ✅
```

---

## ✅ You're Ready!

**You now understand:**
- ✅ Database automatically created on Railway (no upload needed)
- ✅ Schema automatically created by Prisma when backend starts
- ✅ How environment variables connect everything
- ✅ How data flows from user → frontend → backend → database
- ✅ What gets deployed where
- ✅ How to troubleshoot common issues

**Next Step**: Follow the 5-phase deployment process from DEPLOYMENT-SIMPLE-GUIDE.md

🚀 **Your app will be online in ~70 minutes!**
