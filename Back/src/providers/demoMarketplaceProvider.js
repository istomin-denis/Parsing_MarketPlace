import { parseDemoCatalog } from './simulatedParser.js';

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('ru-RU');

/**
 * Predictable demo provider. It parses local synthetic fixtures only:
 * no requests are sent to marketplace websites from this adapter.
 */
export class DemoMarketplaceProvider {
  constructor(catalog = parseDemoCatalog()) {
    this.catalog = catalog;
    this.name = 'demo';
  }

  async search(filters = {}) {
    const query = normalize(filters.q);
    let items = this.catalog.filter((product) => {
      const matchesQuery = !query || normalize(`${product.title} ${product.brand} ${product.category}`).includes(query);
      const matchesMarketplace = !filters.marketplace || filters.marketplace === 'all' || product.marketplace === filters.marketplace;
      const matchesMin = filters.minPrice === undefined || product.price >= filters.minPrice;
      const matchesMax = filters.maxPrice === undefined || product.price <= filters.maxPrice;
      const matchesStock = filters.inStock !== true || product.inStock;
      return matchesQuery && matchesMarketplace && matchesMin && matchesMax && matchesStock;
    });

    switch (filters.sort) {
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        items.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Stable catalog order is used as the demo relevance order.
        break;
    }

    const total = items.length;
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 24;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items: items.map((product) => ({ ...product, source: 'synthetic-demo' })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      source: 'synthetic-demo'
    };
  }
}
