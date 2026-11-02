import test from 'node:test';
import assert from 'node:assert/strict';
import { DemoMarketplaceProvider } from '../src/providers/demoMarketplaceProvider.js';

const provider = new DemoMarketplaceProvider();

test('returns a demo catalogue and marks every item as synthetic', async () => {
  const result = await provider.search({});
  assert.ok(result.total >= 10);
  assert.ok(result.items.every((item) => item.source === 'synthetic-demo'));
});

test('filters by marketplace and case-insensitive query', async () => {
  const result = await provider.search({ q: 'НАУШНИКИ', marketplace: 'Wildberries' });
  assert.equal(result.total, 1);
  assert.equal(result.items[0].id, 'demo-wildberries-1001');
});

test('applies price range and in-stock filter', async () => {
  const result = await provider.search({ minPrice: 1000, maxPrice: 3000, inStock: true });
  assert.ok(result.items.every((item) => item.price >= 1000 && item.price <= 3000 && item.inStock));
});

test('sorts by ascending price and paginates', async () => {
  const result = await provider.search({ sort: 'price_asc', page: 1, limit: 3 });
  assert.equal(result.items.length, 3);
  assert.deepEqual(result.items.map((item) => item.price), [...result.items].map((item) => item.price).sort((a, b) => a - b));
  assert.ok(result.totalPages >= 2);
});
