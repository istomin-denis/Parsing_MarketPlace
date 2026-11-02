# Архитектура

## Общая схема

```text
Browser
  │ same-origin HTTP
  ▼
Nginx (Front container)
  ├── /        → React static build
  └── /api/*   → Express API
                    ├── Authentication routes
                    ├── Product search route
                    ├── Search history routes
                    ├── Provider registry → DemoMarketplaceProvider → synthetic catalogue
                    └── PostgreSQL (users, search_history, sessions)
```

## Frontend

- React 18 + Vite.
- `src/api.js` централизует запросы, передачу cookie и обработку ошибок.
- `App.jsx` управляет состоянием авторизации, поиском и историей.
- Компоненты авторизации, карточки товара и истории вынесены отдельно.
- В Docker production build отдаётся Nginx; `/api/` проксируется на API.

## Backend

- Node.js 20+ и Express.
- Маршруты разделены по назначению: `auth`, `products`, `history`.
- Валидация входных данных выполняется Zod-схемами.
- Бизнес-логика поиска находится в `services/product.service.js`.
- Источник данных подключается через `providers/providerRegistry.js`.
- SQL-запросы параметризованы; пользовательский `userId` берётся только из серверной сессии.

## Данные

`users` хранит email и bcrypt-хеш пароля. `search_history` связывает запросы с пользователем через внешний ключ. История возвращается только владельцу. Сессии хранятся в PostgreSQL через `connect-pg-simple`.

## Режим источников

Сейчас активен только `DemoMarketplaceProvider`. Он читает локальные синтетические fixtures и не делает сетевых запросов к маркетплейсам. Реальный адаптер должен реализовать тот же контракт `search(filters)` и быть включён через реестр после проверки условий использования источника.
