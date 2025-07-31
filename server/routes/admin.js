import express from 'express';
import { authMiddleware, adminOnly } from '../services/auth.js';
import { createExam, getSubmissions } from '../services/sheets.js';

const router = express.Router();

router.post('/exams', authMiddleware, adminOnly, async (req, res) => {
  const { name, openDate, closeDate } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing exam name' });
  try {
    await createExam({ name, openDate, closeDate });
    res.json({ message: 'Exam created' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

router.get('/reports', authMiddleware, adminOnly, async (req, res) => {
  const { examId, year } = req.query;
  const data = await getSubmissions({ examId, year });
  res.json(data);
});

export default router;
