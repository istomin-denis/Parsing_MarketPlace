# HTTP API

Все маршруты имеют префикс `/api`. Для авторизованных маршрутов браузер должен передавать cookie (`credentials: include`). Тела запросов — JSON.

## Health

### `GET /health`

Проверяет доступность API и PostgreSQL.

Ответ: `{ "status": "ok", "database": "ok", "mode": "demo" }`.

## Authentication

### `GET /auth/me`

Возвращает текущего пользователя или `{ "user": null }`.

### `POST /auth/register`

```json
{ "email": "user@example.com", "password": "at-least-10-characters" }
```

Создаёт аккаунт, начинает серверную сессию. Email приводится к нижнему регистру. Минимальная длина пароля — 10 символов.

### `POST /auth/login`

```json
{ "email": "user@example.com", "password": "your-password" }
```

### `POST /auth/logout`

Завершает серверную сессию. Ответ `204 No Content`.

## Products

### `POST /products/search`

Требует авторизации. Фильтры передаются в JSON-теле запроса:

| Параметр | Допустимые значения | По умолчанию |
|---|---|---|
| `q` | строка до 100 символов | пустая строка |
| `marketplace` | `all`, `Wildberries`, `Ozon`, `Yandex Market` | `all` |
| `minPrice` | число от 0 до 10 000 000 | не задано |
| `maxPrice` | число от 0 до 10 000 000 | не задано |
| `inStock` | boolean `true` / `false` | `false` |
| `sort` | `relevance`, `price_asc`, `price_desc`, `rating_desc` | `relevance` |
| `page` | целое 1–1000 | `1` |
| `limit` | целое 1–50 | `24` |

Каждый поиск сохраняется в истории текущего пользователя. Ответ содержит `items`, `total`, `page`, `limit`, `totalPages` и `source`.

## History

Все маршруты требуют авторизации.

- `GET /history` — последние 50 запросов текущего пользователя.
- `DELETE /history/:id` — удаляет одну запись, только если она принадлежит текущему пользователю.
- `DELETE /history` — очищает историю текущего пользователя.

## Ошибки

Ошибки возвращаются в формате:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Проверьте переданные параметры."
  }
}
```

Основные статусы: `400` — ошибка валидации, `401` — нет авторизации, `404` — ресурс не найден, `409` — email уже зарегистрирован, `429` — превышен лимит запросов, `500` — внутренняя ошибка.
