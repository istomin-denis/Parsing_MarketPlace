import { DemoMarketplaceProvider } from './demoMarketplaceProvider.js';
import { config } from '../config.js';
import { HttpError } from '../utils/httpError.js';

const demoProvider = new DemoMarketplaceProvider();

/** Selects the configured data source. Real marketplace adapters are not enabled yet. */
export async function searchProducts(filters) {
  if (!config.demoMode) {
    throw new HttpError(503, 'Источники данных не настроены. Включите DEMO_MODE или подключите разрешённый адаптер.', 'PROVIDER_NOT_CONFIGURED');
  }
  return demoProvider.search(filters);
}
