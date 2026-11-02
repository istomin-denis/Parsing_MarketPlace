import { Router } from 'express';
import { config } from '../config.js';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, registerSchema } from '../utils/validation.js';
import { createUser, getPublicUser, verifyUser } from '../services/auth.service.js';

const router = Router();
const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Слишком много попыток. Попробуйте позже.' } }
});

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => error ? reject(error) : resolve());
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => error ? reject(error) : resolve());
  });
}

router.get('/me', asyncHandler(async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = await getPublicUser(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.json({ user: null });
  }
  res.json({ user: { id: user.id, email: user.email } });
}));

router.post('/register', authAttemptLimiter, asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const user = await createUser(input.email, input.password);
  await regenerateSession(req);
  req.session.userId = user.id;
  await saveSession(req);
  res.status(201).json({ user: { id: user.id, email: user.email } });
}));

router.post('/login', authAttemptLimiter, asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await verifyUser(input.email, input.password);
  await regenerateSession(req);
  req.session.userId = user.id;
  await saveSession(req);
  res.json({ user });
}));

router.post('/logout', asyncHandler(async (req, res) => {
  if (!req.session) return res.status(204).end();
  await new Promise((resolve, reject) => {
    req.session.destroy((error) => error ? reject(error) : resolve());
  });
  res.clearCookie('mp.sid', { httpOnly: true, sameSite: 'lax', secure: config.sessionCookieSecure });
  res.status(204).end();
}));

export default router;
