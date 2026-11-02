import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { pool } from './pool.js';

const currentDir = dirname(fileURLToPath(import.meta.url));

export async function migrate() {
  const schema = await readFile(resolve(currentDir, 'schema.sql'), 'utf8');
  await pool.query(schema);
}
