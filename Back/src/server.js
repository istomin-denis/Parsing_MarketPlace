import app from './app.js';
import { config } from './config.js';
import { pool } from './db/pool.js';
import { migrate } from './db/migrate.js';

await migrate();

const server = app.listen(config.port, () => {
  console.log(`Parsing MarketPlace API listening on port ${config.port} (${config.nodeEnv})`);
  console.log('Data source: synthetic demo catalog; no live marketplace scraping is enabled.');
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
