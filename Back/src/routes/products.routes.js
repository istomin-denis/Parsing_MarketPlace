import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { searchSchema } from '../utils/validation.js';
import { findProducts } from '../services/product.service.js';

const router = Router();

router.post('/search', requireAuth, asyncHandler(async (req, res) => {
  const filters = searchSchema.parse(req.body);
  const result = await findProducts(filters, req.session.userId);
  res.json(result);
}));

export default router;
