import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { appendUser, findUserById } from '../services/sheets.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'secret';

router.post('/register', async (req, res) => {
  const { name, studentId, year, major, faculty, password } = req.body;
  if (!name || !studentId || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    await appendUser({ name, studentId, year, major, faculty, password: hash, role: 'student' });
    const token = jwt.sign({ studentId, role: 'student' }, SECRET);
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;
  const user = await findUserById(studentId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Incorrect password' });
  const token = jwt.sign({ studentId, role: user.role }, SECRET);
  res.json({ token });
});

export default router;
