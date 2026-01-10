#**Launch Here "https://ca-trix.vercel.app/login"**
# CATrix - CAT Preparation Platform

A full-stack web application for CAT (Common Admission Test) preparation.

## Project Structure

```
CATrix/
├── frontend/          # React + TypeScript frontend (Vite)
│   └── src/
├── backend/           # Node.js + Express backend (Prisma + PostgreSQL)
│   └── src/
├── docs/              # Documentation
└── README.md
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Deployment

- **Frontend**: Deployed to Render (auto-deploys from `/frontend` directory)
- **Backend**: Deployed to Render (auto-deploys from `/backend` directory)
- **Database**: PostgreSQL on Render

## Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Material-UI
- Redux Toolkit

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Features

- User authentication (signup/login)
- Full CAT mock tests (VARC, DILR, QA sections)
- Personalized analytics and performance tracking
- Study materials and resources
- PDF test uploads (admin)
- College cutoff predictions
- Real-time test attempts tracking

---

For detailed documentation, see [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
