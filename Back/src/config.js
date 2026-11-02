import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';
const developmentSecret = 'local-development-secret-change-before-deployment-32';
const sessionSecret = process.env.SESSION_SECRET || developmentSecret;
const sessionCookieSecure = (process.env.COOKIE_SECURE || 'false').toLowerCase() === 'true';

if (isProduction && (!process.env.SESSION_SECRET || sessionSecret.length < 32 || sessionSecret === developmentSecret || sessionSecret.toLowerCase().includes('replace-with'))) {
  throw new Error('Set a unique SESSION_SECRET of at least 32 characters in production.');
}
if (isProduction && !sessionCookieSecure) {
  throw new Error('Set COOKIE_SECURE=true when NODE_ENV=production.');
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://marketplace:marketplace@localhost:5432/marketplace',
  sessionSecret,
  sessionCookieSecure,
  frontendOrigins: (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  demoMode: (process.env.DEMO_MODE || 'true').toLowerCase() === 'true',
  sessionMaxAgeMs: 8 * 60 * 60 * 1000
};
