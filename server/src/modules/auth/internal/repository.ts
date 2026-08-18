import { db, User, Organisation } from '../../../infrastructure/db/postgres/client.js';

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
  organisationId: string;
}

export interface CreateOrgData {
  name: string;
  oid: string;
  logo?: string | null;
  description?: string | null;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findOrganisationByOid(oid: string): Promise<Organisation | null>;
  createUser(data: CreateUserData): Promise<User>;
  createOrgAndUser(
    orgData: CreateOrgData,
    userData: Omit<CreateUserData, 'organisationId'>
  ): Promise<{ organisation: Organisation; user: User }>;
}

export class PrismaAuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return db.users.findUnique({
      where: { email },
    });
  }

  async findOrganisationByOid(oid: string): Promise<Organisation | null> {
    return db.organisations.findUnique({
      where: { oid },
    });
  }

  async createUser(data: CreateUserData): Promise<User> {
    return db.users.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.passwordHash,
        organisation_id: data.organisationId,
      },
    });
  }

  async createOrgAndUser(
    orgData: CreateOrgData,
    userData: Omit<CreateUserData, 'organisationId'>
  ): Promise<{ organisation: Organisation; user: User }> {
    return db.$transaction(async (tx) => {
      const organisation = await tx.organisation.create({
        data: {
          name: orgData.name,
          oid: orgData.oid,
          logo: orgData.logo ?? null,
          description: orgData.description ?? null,
        },
      });

      const user = await tx.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: userData.passwordHash,
          organisation_id: organisation.id,
        },
      });

      return { organisation, user };
    });
  }
}
