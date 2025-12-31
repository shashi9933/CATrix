import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get test by ID with questions
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            marks: true,
            explanation: true
            // Note: we don't select correctAnswer here for security
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// Create test (admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, section, difficulty, duration, totalMarks, questions } = req.body;

    const test = await prisma.test.create({
      data: {
        title,
        section,
        difficulty,
        duration,
        totalMarks,
        questions: {
          create: questions.map((q: any) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            marks: q.marks
          }))
        }
      }
    });

    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
});

export default router;
