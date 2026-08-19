import { db, disconnectPostgres } from './client.js';
import { createComponentLogger } from '../../logger/index.js';

const log = createComponentLogger('seed');

async function seed() {
  log.info('Seeding PostgreSQL database...');
  try {
    const org = await db.organisation.upsert({
      where: { oid: 'org-acme-corp' },
      update: {},
      create: {
        name: 'Acme Corp',
        oid: 'org-acme-corp',
        description: 'Acme Corporation Primary Workspace',
      },
    });

    await db.user.upsert({
      where: { email: 'dev@example.com' },
      update: {},
      create: {
        name: 'Dev Engineer',
        email: 'dev@example.com',
        password: 'password123',
        organisation_id: org.id,
      },
    });
    log.info('Seeding completed successfully.');
  } catch (err) {
    log.error({ err }, 'Seeding failed');
  } finally {
    await disconnectPostgres();
  }
}

seed();
