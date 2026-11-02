import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from './api.js';
import AuthScreen from './components/AuthScreen.jsx';
import ProductCard from './components/ProductCard.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';

const initialFilters = {
  q: '', marketplace: 'all', minPrice: '', maxPrice: '', inStock: false, sort: 'relevance'
};

export default function App() {
  const [user, setUser] = useState(undefined);
  const [page, setPage] = useState('search');
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [resultMeta, setResultMeta] = useState({ total: 0, source: 'synthetic-demo' });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    apiRequest('/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => setUser(null));
    apiRequest('/health')
      .then(() => setHealth('online'))
      .catch(() => setHealth('offline'));
  }, []);

  const loadProducts = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const result = await apiRequest('/products/search', {
        method: 'POST',
        body: JSON.stringify({
          ...nextFilters,
          inStock: nextFilters.inStock
        })
      });
      setProducts(result.items);
      setResultMeta(result);
      setFilters(nextFilters);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadHistory = useCallback(async () => {
    try {
      const result = await apiRequest('/history');
      setHistory(result.items);
    } catch (requestError) {
      setError(requestError.message);
    }
  }, []);

  useEffect(() => {
    if (user) loadProducts(initialFilters);
  }, [user]);

  useEffect(() => {
    if (user && page === 'history') loadHistory();
  }, [user, page, loadHistory]);

  async function handleLogout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      setUser(null);
      setProducts([]);
      setHistory([]);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteHistoryItem(id) {
    setError('');
    try {
      await apiRequest(`/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await loadHistory();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function clearHistory() {
    if (!window.confirm('Удалить всю историю поиска?')) return;
    setError('');
    try {
      await apiRequest('/history', { method: 'DELETE' });
      setHistory([]);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function repeatSearch(item) {
    const saved = item.filters || {};
    const nextFilters = {
      ...initialFilters,
      ...saved,
      q: item.query || '',
      minPrice: saved.minPrice ?? '',
      maxPrice: saved.maxPrice ?? '',
      inStock: saved.inStock === true
    };
    setPage('search');
    loadProducts(nextFilters);
  }

  if (user === undefined) return <div className="loading-screen">Загружаем приложение…</div>;
  if (!user) return <AuthScreen onAuthenticated={setUser} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark small-mark">M</div><div><strong>MarketPlace</strong><span>PRICE DISCOVERY</span></div></div>
        <p className="nav-caption">РАБОЧЕЕ ПРОСТРАНСТВО</p>
        <nav className="side-nav">
          <button className={page === 'search' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('search')}><span>⌕</span> Поиск товаров</button>
          <button className={page === 'history' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('history')}><span>◷</span> История поиска</button>
        </nav>
        <div className="sidebar-note"><span className="status-dot"/> Демонстрационный режим<p>Используются синтетические данные, не актуальные предложения площадок.</p></div>
        <div className="user-block"><div className="avatar">{user.email.slice(0, 1).toUpperCase()}</div><div className="user-details"><strong>{user.email}</strong><span>Личный аккаунт</span></div><button className="logout-button" onClick={handleLogout} title="Выйти">↗</button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">PRICE DISCOVERY WORKSPACE</p><h1>{page === 'search' ? 'Поиск товаров' : 'История поиска'}</h1></div><div className="topbar-status"><span className={health === 'online' ? 'status-dot' : 'status-dot offline'}/>{health === 'online' ? 'Сервис доступен' : health === 'offline' ? 'API недоступен' : 'Проверка API'}</div></header>

        {error && <div className="alert-error" role="alert">{error}<button onClick={() => setError('')} aria-label="Закрыть">×</button></div>}

        {page === 'search' ? (
          <>
            <section className="search-panel">
              <form className="search-form" onSubmit={(event) => { event.preventDefault(); loadProducts(filters); }}>
                <span className="search-symbol">⌕</span>
                <input aria-label="Поиск товаров" value={filters.q} onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))} placeholder="Например, беспроводные наушники" maxLength="100" />
                <button className="primary-button" disabled={loading}>{loading ? 'Ищем…' : 'Найти товары'}</button>
              </form>
              <div className="filters-grid">
                <label>Маркетплейс<select value={filters.marketplace} onChange={(event) => setFilters((current) => ({ ...current, marketplace: event.target.value }))}><option value="all">Все площадки</option><option value="Wildberries">Wildberries</option><option value="Ozon">Ozon</option><option value="Yandex Market">Яндекс Маркет</option></select></label>
                <label>Цена от<input type="number" min="0" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))} placeholder="0 ₽" /></label>
                <label>Цена до<input type="number" min="0" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))} placeholder="Без лимита" /></label>
                <label>Сортировка<select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}><option value="relevance">По релевантности</option><option value="price_asc">Сначала дешевле</option><option value="price_desc">Сначала дороже</option><option value="rating_desc">По рейтингу</option></select></label>
                <label className="checkbox-filter"><input type="checkbox" checked={filters.inStock} onChange={(event) => setFilters((current) => ({ ...current, inStock: event.target.checked }))} /> Только в наличии</label>
                <button className="subtle-button apply-button" onClick={() => loadProducts(filters)} disabled={loading}>Применить фильтры</button>
              </div>
            </section>

            <div className="results-heading"><div><p className="eyebrow">КАТАЛОГ ПРЕДЛОЖЕНИЙ</p><h2>Найденные товары <span>{resultMeta.total}</span></h2></div><span className="demo-notice">Демонстрационные данные</span></div>
            {loading ? <div className="empty-state">Подбираем предложения…</div> : products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><div className="empty-icon">⌕</div><h2>Ничего не найдено</h2><p>Измените поисковый запрос или параметры фильтрации.</p></div>}
            <p className="data-disclaimer">Цены, рейтинги и карточки в этом режиме сгенерированы для демонстрации интерфейса. Они не являются актуальными предложениями маркетплейсов.</p>
          </>
        ) : (
          <HistoryPanel items={history} onRepeat={repeatSearch} onDelete={deleteHistoryItem} onClear={clearHistory} busy={loading} />
        )}
      </main>
    </div>
  );
}
