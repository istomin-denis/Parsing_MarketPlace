export default function HistoryPanel({ items, onRepeat, onDelete, onClear, busy }) {
  if (!items.length) {
    return <div className="empty-state"><div className="empty-icon">◷</div><h2>История пока пуста</h2><p>Ваши поисковые запросы появятся здесь.</p></div>;
  }

  return (
    <section className="history-panel">
      <div className="section-heading">
        <div><p className="eyebrow">ВАША АКТИВНОСТЬ</p><h2>История поиска</h2></div>
        <button className="subtle-button danger-text" onClick={onClear} disabled={busy}>Очистить историю</button>
      </div>
      <div className="history-list">
        {items.map((item) => (
          <article className="history-row" key={item.id}>
            <div className="history-query"><span className="history-search-icon">⌕</span><div><strong>{item.query || 'Все товары'}</strong><p>{new Date(item.created_at).toLocaleString('ru-RU')} · {item.result_count} результатов</p></div></div>
            <div className="history-actions">
              <button className="subtle-button" onClick={() => onRepeat(item)} disabled={busy}>Повторить</button>
              <button className="icon-button danger-text" onClick={() => onDelete(item.id)} aria-label="Удалить запись" disabled={busy}>×</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
