import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all study materials
router.get('/', async (req, res) => {
  try {
    const materials = await prisma.studyMaterial.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ error: 'Failed to fetch study materials' });
  }
});

// Get study materials by section
router.get('/section/:section', async (req, res) => {
  try {
    const { section } = req.params;

    const materials = await prisma.studyMaterial.findMany({
      where: { section },
      orderBy: { createdAt: 'desc' }
    });

    res.json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ error: 'Failed to fetch study materials' });
  }
});

// Get study material by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const material = await prisma.studyMaterial.findUnique({
      where: { id }
    });

    if (!material) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    res.json(material);
  } catch (error) {
    console.error('Error fetching study material:', error);
    res.status(500).json({ error: 'Failed to fetch study material' });
  }
});

// Create study material (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, section, content, fileUrl } = req.body;

    const material = await prisma.studyMaterial.create({
      data: {
        title,
        section,
        content,
        fileUrl
      }
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Error creating study material:', error);
    res.status(500).json({ error: 'Failed to create study material' });
  }
});

export default router;
