import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get user analytics
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    let analytics = await prisma.analytics.findFirst({
      where: { userId: userId! }
    });

    if (!analytics) {
      // Create new analytics record if doesn't exist
      analytics = await prisma.analytics.create({
        data: { userId: userId! }
      });
    }

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get recent tests
router.get('/recent-tests', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    const recentTests = await prisma.testAttempt.findMany({
      where: { userId: userId! },
      include: {
        test: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json(recentTests);
  } catch (error) {
    console.error('Error fetching recent tests:', error);
    res.status(500).json({ error: 'Failed to fetch recent tests' });
  }
});

// Update analytics (call after test completion)
router.post('/update', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { testId, score, totalMarks, timeTaken } = req.body;

    // Get or create analytics
    let analytics = await prisma.analytics.findFirst({
      where: { userId: userId! }
    });

    if (!analytics) {
      analytics = await prisma.analytics.create({
        data: { userId: userId! }
      });
    }

    // Update analytics using id
    const updatedAnalytics = await prisma.analytics.update({
      where: { id: analytics.id },
      data: {
        totalTests: analytics.totalTests + 1,
        totalScore: analytics.totalScore + (score || 0),
        totalTimeSpent: analytics.totalTimeSpent + (timeTaken || 0),
        accuracy: totalMarks ? ((analytics.totalScore + (score || 0)) / ((analytics.totalTests + 1) * totalMarks)) * 100 : analytics.accuracy,
        averageScore: totalMarks ? (analytics.totalScore + (score || 0)) / (analytics.totalTests + 1) : analytics.averageScore
      }
    });

    res.json(updatedAnalytics);
  } catch (error) {
    console.error('Error updating analytics:', error);
    res.status(500).json({ error: 'Failed to update analytics' });
  }
});

export default router;
