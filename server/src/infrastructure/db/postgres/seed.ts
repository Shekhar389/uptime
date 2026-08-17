import { db, disconnectPostgres } from './client.js';
import { createComponentLogger } from '../../logger/index.js';

const log = createComponentLogger('seed');

async function seed() {
  log.info('Seeding PostgreSQL database...');
  try {
    await db.teams.upsert({
      where: { slug: 'acme-corp' },
      update: {},
      create: { name: 'Acme Corp', slug: 'acme-corp' },
    });
    log.info('Seeding completed successfully.');
  } catch (err) {
    log.error({ err }, 'Seeding failed');
  } finally {
    await disconnectPostgres();
  }
}

seed();

