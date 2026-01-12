import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import type { CorsOptions } from 'cors';

import testRoutes from './routes/tests';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import analyticsRoutes from './routes/analytics';
import collegeRoutes from './routes/colleges';
import studyMaterialRoutes from './routes/studyMaterials';
import testAttemptRoutes from './routes/testAttempts';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ✅ CORS Configuration
const allowedOrigins: string[] = [
  'http://localhost:5173',      // Local dev
  'http://localhost:3000',      // Alternative local
  'https://vercel.app',         // Vercel preview deployments
  'https://ca-trix.vercel.app', // Production Vercel
  'https://catrix.vercel.app',  // Alternative Vercel
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])  // Production frontend URL from env
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check exact match or substring match
    const isAllowed = allowedOrigins.some(allowed => 
      origin === allowed || origin.endsWith(allowed)
    );
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked from origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-attempts', testAttemptRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/study-materials', studyMaterialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Global error handler — MOVED TO BOTTOM
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n📴 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
