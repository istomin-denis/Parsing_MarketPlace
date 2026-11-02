# Parsing MarketPlace

Full-stack учебный проект для поиска и сравнения товарных предложений. В репозитории находятся **обе части приложения**: React frontend (`Front/`) и Node.js/Express backend (`Back/`), а также PostgreSQL, Docker Compose, тесты и техническая документация.

> **Текущий режим — DEMO.** Приложение использует локальный синтетический каталог. Оно не отправляет запросы на Wildberries, Ozon или Яндекс Маркет и не получает актуальные цены. Названия площадок используются для демонстрации форматов данных и архитектуры адаптеров. Не представляйте демонстрационные результаты как живой парсинг.

## Что реализовано

### Frontend — `Front/`
- React 18 + Vite.
- Экран регистрации и входа.
- Поиск по каталогу с фильтрами по площадке, цене и наличию.
- Сортировка по релевантности, цене и рейтингу.
- Карточки товаров с ценой, скидкой, рейтингом и наличием.
- История запросов: повтор, удаление одной записи и очистка истории.
- Адаптивный интерфейс для узких экранов.
- Запросы к API с cookie-сессией.

### Backend — `Back/`
- Node.js 22 + Express.
- PostgreSQL и SQL-схема.
- Регистрация, вход и выход с серверными сессиями.
- Хеширование паролей через bcrypt.
- Валидация входных данных через Zod.
- Поиск, фильтрация, сортировка и пагинация каталога.
- Сохранение истории поиска, изолированной по пользователю.
- DEMO-адаптеры для трёх форматов входных данных.
- Ограничение частоты запросов, security headers, проверка Origin и параметризованные SQL-запросы.
- Автоматические unit-тесты для логики демо-парсинга и валидации.

### Инфраструктура и документация
- PostgreSQL 16.
- Docker Compose для запуска всего приложения.
- GitHub Actions для проверок Backend и сборки Frontend.
- Документы по архитектуре, API, источникам данных, тестированию и безопасности.

## Быстрый запуск (рекомендуется)

Требуется Docker Desktop или Docker Engine с Compose Plugin.

1. В корне проекта скопируйте файл настроек:

   **Windows PowerShell**
   ```powershell
   Copy-Item .env.example .env
   ```

   **Linux / macOS**
   ```bash
   cp .env.example .env
   ```

2. Для локального запуска можно оставить значения из `.env.example`. Для любого внешнего размещения обязательно задайте собственный сложный `POSTGRES_PASSWORD`, соответствующий ему `DATABASE_URL`, уникальный `SESSION_SECRET` длиной не менее 32 символов, `NODE_ENV=production`, `COOKIE_SECURE=true` и HTTPS.

3. Из корневой папки выполните:

   ```bash
   docker compose up --build
   ```

4. Откройте [http://localhost:8080](http://localhost:8080), зарегистрируйте пользователя и попробуйте поиск.

Остановка:

```bash
docker compose down
```

Сброс локальной базы (удаляет все локальные аккаунты и историю):

```bash
docker compose down -v
```

## Запуск без Docker

Требуются Node.js 20+ и PostgreSQL. Откройте два терминала.

**Терминал 1 — Backend:**

```bash
cd Back
npm install
```

Скопируйте `../.env.example` в `Back/.env`, затем замените `DATABASE_URL` на локальный адрес PostgreSQL и задайте `FRONTEND_ORIGIN=http://localhost:5173`.

```bash
npm run dev
```

**Терминал 2 — Frontend:**

```bash
cd Front
npm install
npm run dev
```

Vite доступен по адресу [http://localhost:5173](http://localhost:5173) и проксирует `/api` на `http://localhost:3001`.

## Команды из корня проекта

В корне можно установить зависимости обоих workspace-пакетов одной командой:

```bash
npm install
```

Затем доступны команды:

```bash
npm run dev:back
npm run dev:front
npm run build
npm test
npm run check
```

## Структура проекта

```text
Parsing_MarketPlace/
├── Front/                 # React + Vite: весь интерфейс
│   ├── src/
│   │   ├── components/    # AuthScreen, ProductCard, HistoryPanel
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── Back/                  # Node.js + Express API
│   ├── src/
│   │   ├── db/            # PostgreSQL pool и SQL-схема
│   │   ├── middleware/    # авторизация и обработка ошибок
│   │   ├── providers/     # демо-каталог и нормализаторы
│   │   ├── routes/        # auth, products, history
│   │   ├── services/
│   │   └── utils/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── docs/                  # техническая документация
├── .github/workflows/     # CI
├── docker-compose.yml
├── package.json           # npm workspaces для Front и Back
├── .env.example
├── README.md
└── SECURITY.md
```

## Проверки

Backend unit-тесты и проверка синтаксиса:

```bash
cd Back
npm install
npm test
npm run check
```

Сборка Frontend:

```bash
cd Front
npm install
npm run build
```

В CI выполняются backend tests, backend syntax checks и frontend production build. Локальная проверка без установки зависимостей не подтверждает полноценную сборку UI.

## DEMO-парсер и реальные источники

Сейчас `Back/src/providers/simulatedParser.js` нормализует три **локальных тестовых формата** в единую модель товара. `demoMarketplaceProvider.js` выполняет поиск по синтетическому каталогу. Сетевых запросов к маркетплейсам нет.

Это сделано намеренно: архитектура показывает, как отделить адаптеры источников от бизнес-логики. Для подключения реальных данных потребуется отдельный адаптер с официальным API или иным разрешённым источником, учёт лимитов и условий использования площадки, обработка ошибок и тесты контрактов.

## Безопасность

- Не коммитьте `.env`, токены, пароли, cookies, дампы БД и персональные данные.
- Перед публикацией проверьте не только текущие файлы, но и всю Git-историю на ранее добавленные секреты.
- Значения в `.env.example` предназначены только для локальной разработки.
- Этот проект — учебный прототип, а не результат независимого аудита безопасности.

## Документация

- [Архитектура](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Адаптеры источников](docs/PROVIDERS.md)
- [Тестирование](docs/TESTING.md)
- [Безопасность](docs/SECURITY.md)
- [Политика безопасности в корне](SECURITY.md)
