import { PrismaClient } from '@prisma/client';
import { createComponentLogger } from '../../logger/index.js';

const log = createComponentLogger('postgres');

export const prisma = new PrismaClient();

// Common DB pool & setup area to avoid invoking raw Prisma boilerplate in every line
export const db = {
  organisations: prisma.organisation,
  users: prisma.user,
  monitors: (prisma as any).monitor,
  teams: (prisma as any).team,
  incidents: (prisma as any).incident,
  $transaction: prisma.$transaction.bind(prisma),
  $queryRaw: prisma.$queryRaw.bind(prisma),
  $executeRaw: prisma.$executeRaw.bind(prisma),
};

export const checkPostgresHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    log.error({ err }, 'PostgreSQL health check failed');
    return false;
  }
};

export const disconnectPostgres = async (): Promise<void> => {
  await prisma.$disconnect();
};

export type { User, Organisation } from '@prisma/client';

