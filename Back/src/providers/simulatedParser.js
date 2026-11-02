import { marketplaceFixtures } from './catalog.js';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct({ id, marketplace, title, brand, price, oldPrice, rating, reviewCount, inStock, category, description }) {
  return {
    id: `demo-${marketplace.toLowerCase().replaceAll(' ', '-')}-${id}`,
    marketplace,
    title: String(title || 'Без названия'),
    brand: String(brand || 'Неизвестный бренд'),
    price: Math.max(0, Math.round(toNumber(price))),
    oldPrice: Math.max(0, Math.round(toNumber(oldPrice))),
    rating: Math.min(5, Math.max(0, toNumber(rating))),
    reviewCount: Math.max(0, Math.round(toNumber(reviewCount))),
    inStock: Boolean(inStock),
    category: String(category || 'Другое'),
    description: String(description || '')
  };
}

// Wildberries-like fixture: prices are represented in kopecks in this demo shape.
export function parseWildberriesFixture(item) {
  return normalizeProduct({
    id: item.nmId,
    marketplace: 'Wildberries',
    title: item.name,
    brand: item.brandName,
    price: toNumber(item.salePriceU) / 100,
    oldPrice: toNumber(item.priceU) / 100,
    rating: item.reviewRating,
    reviewCount: item.feedbacks,
    inStock: toNumber(item.quantity) > 0,
    category: item.subjectName,
    description: item.description
  });
}

// Ozon-like fixture: price and rating values arrive as strings in this demo shape.
export function parseOzonFixture(item) {
  return normalizeProduct({
    id: item.sku,
    marketplace: 'Ozon',
    title: item.name,
    brand: item.brand,
    price: item.marketingPrice,
    oldPrice: item.oldPrice,
    rating: item.rating,
    reviewCount: item.reviewsCount,
    inStock: toNumber(item.stock) > 0,
    category: item.category,
    description: item.description
  });
}

// Yandex Market-like fixture: prices are nested in value objects.
export function parseYandexMarketFixture(item) {
  return normalizeProduct({
    id: item.offerId,
    marketplace: 'Yandex Market',
    title: item.offerName,
    brand: item.vendor,
    price: item.price?.value,
    oldPrice: item.oldPrice?.value,
    rating: item.shopRating,
    reviewCount: item.reviewsCount,
    inStock: item.available,
    category: item.category,
    description: item.description
  });
}

export function parseDemoCatalog(fixtures = marketplaceFixtures) {
  return [
    ...fixtures.wildberries.map(parseWildberriesFixture),
    ...fixtures.ozon.map(parseOzonFixture),
    ...fixtures.yandexMarket.map(parseYandexMarketFixture)
  ];
}
