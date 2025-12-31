import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Create test attempt
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { testId } = req.body;
    const userId = req.userId;

    if (!testId) {
      return res.status(400).json({ error: 'testId is required' });
    }

    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: userId!,
        testId,
        status: 'in_progress'
      }
    });

    res.status(201).json(testAttempt);
  } catch (error) {
    console.error('Error creating test attempt:', error);
    res.status(500).json({ error: 'Failed to create test attempt' });
  }
});

// Get test attempt by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id },
      include: {
        questionAttempts: true,
        test: true
      }
    });

    if (!testAttempt) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }

    // Check authorization
    if (testAttempt.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(testAttempt);
  } catch (error) {
    console.error('Error fetching test attempt:', error);
    res.status(500).json({ error: 'Failed to fetch test attempt' });
  }
});

// Update test attempt (submit answers)
router.patch('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { questionAttempts, status, score, timeTaken } = req.body;
    const userId = req.userId;

    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id }
    });

    if (!testAttempt) {
      return res.status(404).json({ error: 'Test attempt not found' });
    }

    if (testAttempt.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (score !== undefined) updateData.score = score;
    if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
    if (status === 'completed') updateData.completedAt = new Date();

    const updated = await prisma.testAttempt.update({
      where: { id },
      data: updateData
    });

    // Save question attempts if provided
    if (questionAttempts && Array.isArray(questionAttempts)) {
      for (const qa of questionAttempts) {
        await prisma.questionAttempt.upsert({
          where: { 
            id: qa.id || 'new'
          },
          create: {
            testAttemptId: id,
            questionId: qa.questionId,
            selectedAnswer: qa.selectedAnswer,
            isCorrect: qa.isCorrect,
            timeTaken: qa.timeTaken
          },
          update: {
            selectedAnswer: qa.selectedAnswer,
            isCorrect: qa.isCorrect,
            timeTaken: qa.timeTaken
          }
        });
      }
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating test attempt:', error);
    res.status(500).json({ error: 'Failed to update test attempt' });
  }
});

// Get user's test attempts
router.get('/user/attempts', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    const attempts = await prisma.testAttempt.findMany({
      where: { userId: userId! },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            section: true,
            duration: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ error: 'Failed to fetch user attempts' });
  }
});

export default router;
