import pg from 'pg';
import { env } from '../../../config/env.js';
import { createComponentLogger } from '../../logger/index.js';

const log = createComponentLogger('postgres');

const { Pool } = pg;

export const postgresPool = new Pool({
  connectionString: env.POSTGRES_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

postgresPool.on('error', (err) => {
  log.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

export const checkPostgresHealth = async (): Promise<boolean> => {
  try {
    const client = await postgresPool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    log.error({ err }, 'PostgreSQL health check failed');
    return false;
  }
};
