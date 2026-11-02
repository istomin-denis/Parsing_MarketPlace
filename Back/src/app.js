import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { HttpError } from './utils/httpError.js';
import { pool } from './db/pool.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import historyRoutes from './routes/history.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PgSession = connectPgSimple(session);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use((req, _res, next) => {
  const origin = req.get('origin');
  const changesState = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  if (changesState && origin && !config.frontendOrigins.includes(origin)) {
    return next(new HttpError(403, 'Источник запроса не разрешён.', 'ORIGIN_NOT_ALLOWED'));
  }
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.frontendOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '32kb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

app.use(session({
  name: 'mp.sid',
  store: new PgSession({ pool, tableName: 'user_sessions', createTableIfMissing: false }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.sessionCookieSecure,
    sameSite: 'lax',
    maxAge: config.sessionMaxAgeMs
  }
}));

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'ok', mode: config.demoMode ? 'demo' : 'disabled' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/history', historyRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
