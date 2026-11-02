import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { HttpError } from '../utils/httpError.js';

export async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email, created_at',
      [randomUUID(), email, passwordHash]
    );
    return rows[0];
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'Аккаунт с таким email уже существует.', 'EMAIL_TAKEN');
    throw error;
  }
}

export async function verifyUser(email, password) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  const user = rows[0];
  const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!passwordMatches) throw new HttpError(401, 'Неверный email или пароль.', 'INVALID_CREDENTIALS');
  return { id: user.id, email: user.email };
}

export async function getPublicUser(userId) {
  const { rows } = await pool.query(
    'SELECT id, email, created_at FROM users WHERE id = $1 LIMIT 1',
    [userId]
  );
  return rows[0] ?? null;
}
