import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDemoCatalog, parseWildberriesFixture, parseOzonFixture, parseYandexMarketFixture } from '../src/providers/simulatedParser.js';

test('normalizes different provider payload shapes into one product model', () => {
  const catalog = parseDemoCatalog();
  assert.equal(catalog.length, 18);
  assert.deepEqual(new Set(catalog.map((item) => item.marketplace)), new Set(['Wildberries', 'Ozon', 'Yandex Market']));
  assert.ok(catalog.every((item) => Number.isFinite(item.price) && typeof item.inStock === 'boolean'));
});

test('converts Wildberries-like kopecks to rubles', () => {
  const product = parseWildberriesFixture({ nmId: 'x', name: 'Test', salePriceU: 123400, priceU: 150000, quantity: 1 });
  assert.equal(product.price, 1234);
  assert.equal(product.oldPrice, 1500);
});

test('converts string prices from Ozon-like fixture', () => {
  const product = parseOzonFixture({ sku: 'x', name: 'Test', marketingPrice: '900', oldPrice: '1100', stock: 2 });
  assert.equal(product.price, 900);
  assert.equal(product.inStock, true);
});

test('reads nested price values from Yandex Market-like fixture', () => {
  const product = parseYandexMarketFixture({ offerId: 'x', offerName: 'Test', price: { value: 700 }, oldPrice: { value: 800 }, available: false });
  assert.equal(product.price, 700);
  assert.equal(product.inStock, false);
});
