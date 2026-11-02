import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, query, filters, result_count, created_at
     FROM search_history WHERE user_id = $1
     ORDER BY created_at DESC LIMIT 50`,
    [req.session.userId]
  );
  res.json({ items: rows });
}));

router.delete('/', asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM search_history WHERE user_id = $1', [req.session.userId]);
  res.status(204).end();
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  const { rowCount } = await pool.query(
    'DELETE FROM search_history WHERE id = $1 AND user_id = $2',
    [id, req.session.userId]
  );
  if (rowCount === 0) throw new HttpError(404, 'Запись истории не найдена.', 'HISTORY_NOT_FOUND');
  res.status(204).end();
}));

export default router;
