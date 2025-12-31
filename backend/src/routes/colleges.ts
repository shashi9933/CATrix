import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

// Get college by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const college = await prisma.college.findUnique({
      where: { id }
    });

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ error: 'Failed to fetch college' });
  }
});

// Create college (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, location, cutoff, tier } = req.body;

    const college = await prisma.college.create({
      data: {
        name,
        location,
        cutoff,
        tier
      }
    });

    res.status(201).json(college);
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ error: 'Failed to create college' });
  }
});

export default router;
