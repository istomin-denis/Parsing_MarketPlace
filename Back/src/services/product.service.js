import { randomUUID } from 'node:crypto';
import { pool } from '../db/pool.js';
import { searchProducts } from '../providers/providerRegistry.js';

export async function findProducts(filters, userId) {
  const result = await searchProducts(filters);
  const historyFilters = {
    marketplace: filters.marketplace,
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    inStock: filters.inStock,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit
  };

  await pool.query(
    `INSERT INTO search_history (id, user_id, query, filters, result_count)
     VALUES ($1, $2, $3, $4::jsonb, $5)`,
    [randomUUID(), userId, filters.q, JSON.stringify(historyFilters), result.total]
  );

  return result;
}
