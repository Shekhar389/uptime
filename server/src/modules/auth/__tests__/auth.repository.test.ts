import { PrismaAuthRepository } from '../internal/repository.js';
import { prisma } from '../../../infrastructure/db/postgres/client.js';

describe('PrismaAuthRepository', () => {
  const repo = new PrismaAuthRepository();

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({ where: { email: { contains: 'repro-' } } });
    await prisma.organisation.deleteMany({ where: { oid: { contains: 'repro-' } } });
    await prisma.$disconnect();
  });

  it('should create an organisation and user when logo and description are null', async () => {
    const testOid = `repro-${Date.now().toString().slice(-6)}`;
    const testEmail = `repro-${Date.now()}@example.com`;

    const result = await repo.createOrgAndUser(
      {
        name: 'Repro Org',
        oid: testOid,
        logo: null,
        description: null,
      },
      {
        email: testEmail,
        name: 'Repro User',
        passwordHash: 'hashedpassword',
      }
    );

    expect(result.organisation).toBeDefined();
    expect(result.organisation.oid).toBe(testOid);
    expect(result.organisation.logo).toBeNull();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
  });
});
