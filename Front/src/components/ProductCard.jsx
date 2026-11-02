const marketplaceClass = {
  Wildberries: 'market-wb',
  Ozon: 'market-ozon',
  'Yandex Market': 'market-yandex'
};

export default function ProductCard({ product }) {
  const discount = product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="product-card">
      <div className="product-card-top">
        <span className={`marketplace-tag ${marketplaceClass[product.marketplace] || ''}`}>{product.marketplace}</span>
        <span className="demo-tag">DEMO</span>
      </div>
      <div className="product-visual"><span>{product.category === 'Электроника' ? '⌁' : product.category === 'Спорт' ? '↗' : '◇'}</span></div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3>{product.title}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-rating"><span>★</span> {product.rating.toFixed(1)} <span className="muted">· {product.reviewCount.toLocaleString('ru-RU')} оценок</span></div>
      </div>
      <div className="product-bottom">
        <div className="price-line">
          <strong>{product.price.toLocaleString('ru-RU')} ₽</strong>
          {discount > 0 && <span className="discount-pill">−{discount}%</span>}
        </div>
        {product.oldPrice > product.price && <p className="old-price">{product.oldPrice.toLocaleString('ru-RU')} ₽</p>}
        <span className={product.inStock ? 'stock in-stock' : 'stock out-stock'}>{product.inStock ? 'В наличии · демо' : 'Нет в наличии · демо'}</span>
      </div>
    </article>
  );
}
