import { postgresPool } from './client.js';
import { createComponentLogger } from '../../logger/index.js';

const log = createComponentLogger('seed');

async function seed() {
  log.info('Seeding PostgreSQL database...');
  try {
    await postgresPool.query(`
      INSERT INTO teams (name, slug) VALUES ('Acme Corp', 'acme-corp')
      ON CONFLICT (slug) DO NOTHING;
    `);
    log.info('Seeding completed successfully.');
  } catch (err) {
    log.error({ err }, 'Seeding failed');
  } finally {
    await postgresPool.end();
  }
}

seed();
