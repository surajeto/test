import jwt from 'jsonwebtoken';
import { findUserById } from './sheets.js';

const SECRET = process.env.JWT_SECRET || 'secret';

export async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const user = await findUserById(payload.studentId);
    if (!user) throw new Error('user not found');
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
}
