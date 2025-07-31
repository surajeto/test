import express from 'express';
import jwt from 'jsonwebtoken';
import { getExams, appendSubmission } from '../services/sheets.js';
import { generateFeedback } from '../services/ai.js';
import { authMiddleware } from '../services/auth.js';

const router = express.Router();

router.get('/exams', async (req, res) => {
  const exams = await getExams();
  res.json(exams);
});

router.post('/exams/:id/submit', authMiddleware, async (req, res) => {
  const examId = req.params.id;
  const { score, strength, weakness } = req.body;
  const tokenData = req.user;
  try {
    const feedback = await generateFeedback(score, strength, weakness);
    await appendSubmission({
      date: new Date().toISOString(),
      studentId: tokenData.studentId,
      examId,
      score,
      strength,
      weakness,
      feedback
    });
    res.json({ feedback });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit' });
  }
});

export default router;
