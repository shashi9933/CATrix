# CATrix Migration: Supabase → PostgreSQL + Express Backend

## Overview

Successfully migrated from Supabase to a custom PostgreSQL + Express.js backend architecture for better control, scalability, and interview readiness.

## Architecture

```
Frontend (React + Redux)
        ↓
Backend (Node.js + Express)
        ↓
PostgreSQL (via Prisma ORM)
```

## What Changed

### Removed
- ✅ `@supabase/supabase-js` dependency
- ✅ Supabase client initialization
- ✅ Supabase authentication
- ✅ Direct database queries via Supabase SDK

### Added
- ✅ Express.js backend server
- ✅ Prisma ORM for database access
- ✅ JWT-based authentication
- ✅ RESTful API endpoints
- ✅ PostgreSQL database schema

## Migration Steps

### 1. Backend Setup

```bash
cd backend
npm install
npx prisma generate
```

### 2. Database Configuration

Create `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/catrix"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### 3. Database Migrations

```bash
# Create tables
npx prisma db push

# Run migrations
npx prisma migrate dev --name init
```

### 4. Start Backend Server

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 5. Frontend Configuration

Frontend `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Install Frontend Dependencies

```bash
npm install
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Tests
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test by ID with questions
- `POST /api/tests` - Create new test (admin)

### Test Attempts
- `POST /api/test-attempts` - Start test attempt
- `GET /api/test-attempts/:id` - Get test attempt details
- `PATCH /api/test-attempts/:id` - Submit test attempt
- `GET /api/test-attempts/user/attempts` - Get user's test attempts

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile

### Analytics
- `GET /api/analytics` - Get user analytics
- `GET /api/analytics/recent-tests` - Get recent tests
- `POST /api/analytics/update` - Update analytics after test

### Colleges
- `GET /api/colleges` - Get all colleges
- `GET /api/colleges/:id` - Get college by ID

### Study Materials
- `GET /api/study-materials` - Get all study materials
- `GET /api/study-materials/section/:section` - Get by section
- `GET /api/study-materials/:id` - Get by ID

## Frontend Changes

### AuthContext
- Replaced Supabase Auth with JWT-based auth
- Token stored in `localStorage`
- Automatic token verification on app load

### API Client (`src/utils/api.ts`)
- Centralized axios instance
- Automatic token injection in headers
- Response interceptors for error handling

### Database Queries
- All Supabase queries converted to REST API calls
- Functions in `src/utils/supabaseApi.ts` now use the new API client
- Backward compatibility maintained

## Database Schema

### Core Tables

```sql
-- Users
users (id, email, password, name, role, createdAt, updatedAt)

-- Tests
tests (id, title, section, difficulty, duration, totalMarks, createdAt, updatedAt)

-- Questions
questions (id, testId, questionText, options, correctAnswer, marks, explanation)

-- Test Attempts
test_attempts (id, userId, testId, score, timeTaken, status, startedAt, completedAt)

-- Question Attempts
question_attempts (id, testAttemptId, questionId, selectedAnswer, isCorrect, timeTaken)

-- Analytics
analytics (id, userId, totalTests, totalScore, averageScore, totalTimeSpent, accuracy)

-- Colleges
colleges (id, name, location, cutoff, tier)

-- Study Materials
study_materials (id, title, section, content, fileUrl)
```

## Authentication Flow

1. User registers/logs in
2. Backend validates credentials
3. JWT token generated
4. Token stored in localStorage
5. Token sent in Authorization header for all requests
6. Backend verifies token and serves data

## Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd CATrix
npm run dev
```

## File Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts
│   │   │   ├── tests.ts
│   │   │   ├── testAttempts.ts
│   │   │   ├── users.ts
│   │   │   ├── analytics.ts
│   │   │   ├── colleges.ts
│   │   │   └── studyMaterials.ts
│   │   └── middleware/
│   │       └── auth.ts           # JWT middleware
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── CATrix/                        # Frontend
│   ├── src/
│   │   ├── utils/
│   │   │   ├── api.ts            # Axios client & API functions
│   │   │   └── supabaseApi.ts    # Wrapper functions
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx   # JWT auth context
│   │   └── ...
│   ├── package.json
│   └── .env.local
```

## Common Issues & Solutions

### Connection refused on http://localhost:5000
- Ensure backend is running: `npm run dev` in backend folder
- Check port 5000 is not in use

### 401 Unauthorized errors
- Ensure token is being sent in headers
- Check JWT_SECRET matches between frontend and backend
- Verify token hasn't expired (7 days by default)

### Database connection errors
- Verify DATABASE_URL is correct
- Ensure PostgreSQL service is running
- Run `npx prisma db push` to sync schema

### CORS errors
- Check FRONTEND_URL in backend .env
- Ensure frontend URL matches CORS origin

## Next Steps

1. **Database Provider**: Choose PostgreSQL provider:
   - Neon (recommended)
   - Render
   - Railway
   - Self-hosted

2. **Deployment**:
   - Deploy backend to Heroku, Railway, or Render
   - Deploy frontend to Vercel or Netlify
   - Update API URLs in production

3. **Authentication Enhancements**:
   - Add OAuth (Google, GitHub)
   - Implement refresh tokens
   - Add email verification

4. **Security**:
   - Use HTTPS in production
   - Implement rate limiting
   - Add input validation
   - Use environment variables

5. **Testing**:
   - Add unit tests for routes
   - Add integration tests
   - Load testing

## Support

For issues or questions, refer to:
- Express.js: https://expressjs.com
- Prisma: https://www.prisma.io/docs
- JWT: https://jwt.io
- PostgreSQL: https://www.postgresql.org/docs
