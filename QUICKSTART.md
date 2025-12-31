# Quick Start Guide - CATrix with PostgreSQL Backend

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- Git
- npm or yarn

## Step 1: Clone & Install Dependencies

### Frontend
```bash
cd CATrix
npm install
```

### Backend
```bash
cd ../backend
npm install
```

## Step 2: Configure Environment Variables

### Backend (backend/.env)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/catrix"
JWT_SECRET="your-secret-key-change-in-production"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (CATrix/.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Setup Database

```bash
cd backend

# Create database (if using local PostgreSQL)
createdb catrix

# Run Prisma migrations
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed
```

## Step 4: Start Services

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend Development
```bash
cd CATrix
npm run dev
# Frontend runs on http://localhost:5173
```

## Step 5: Test the Application

1. Open browser: http://localhost:5173
2. Click "Sign Up" to create an account
3. Login with your credentials
4. Start exploring tests and analytics

## API Testing

Use Postman or curl to test API endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all tests
curl http://localhost:5000/api/tests
```

## Available Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev                    # Start with hot reload
npm run build                  # Build TypeScript
npm run start                  # Start production server
npx prisma generate           # Generate Prisma client
npx prisma migrate dev         # Create new migration
npx prisma db push            # Sync schema to database
npx prisma studio            # Open Prisma Studio GUI
```

## Database Schema

Key tables:
- `users` - User accounts and authentication
- `tests` - Test series and mock exams
- `questions` - Test questions with options
- `test_attempts` - User test submissions
- `question_attempts` - Answer tracking
- `analytics` - Performance metrics
- `colleges` - College database
- `study_materials` - Study resources

## Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│ (TypeScript)    │
└────────┬────────┘
         │ HTTP/JSON
         ↓
┌─────────────────┐
│ Express Backend │ (Port 5000)
│ (Node.js/TS)    │
└────────┬────────┘
         │ SQL Queries
         ↓
┌─────────────────┐
│  PostgreSQL DB  │ (Port 5432)
│   (Prisma ORM)  │
└─────────────────┘
```

## Authentication

- JWT tokens used for authentication
- Tokens stored in localStorage
- Automatically sent in request headers
- 7-day expiration by default
- Token verified on each protected route

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is available
netstat -tuln | grep 5000

# Kill process if needed (macOS/Linux)
lsof -ti :5000 | xargs kill -9
```

### Database connection error
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env
# Format: postgresql://user:password@host:port/dbname
```

### Frontend can't reach backend
- Verify backend is running on http://localhost:5000
- Check VITE_API_URL in .env.local
- Look for CORS errors in browser console

### Prisma schema out of sync
```bash
# Reset and resync
npx prisma migrate reset
npx prisma db push
```

## Production Deployment

See [MIGRATION_GUIDE.md](../MIGRATION_GUIDE.md) for production deployment instructions.

## File Structure

```
catrix/
├── backend/                    # Express backend
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── routes/            # API routes
│   │   └── middleware/        # Express middleware
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
├── CATrix/                     # React frontend
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Shared components
│   │   ├── contexts/          # React contexts
│   │   ├── utils/             # Utilities
│   │   └── App.tsx            # Main component
│   └── package.json
└── MIGRATION_GUIDE.md         # Migration documentation
```

## Next Steps

1. **Add Sample Data**: Create seed file for tests and questions
2. **Implement More Features**: Add admin panel, consultations, etc.
3. **Setup Deployment**: Use Railway, Render, or similar
4. **Add Tests**: Unit and integration tests
5. **Optimize**: Performance optimization and caching

## Documentation

- [Migration Guide](../MIGRATION_GUIDE.md) - Detailed migration steps
- [Express Docs](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)

## Support

For issues:
1. Check console logs (browser and terminal)
2. Verify environment variables
3. Check database connection
4. Review API responses in Network tab
5. Consult documentation links above
