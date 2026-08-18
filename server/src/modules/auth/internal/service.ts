import { AppError } from '../../../shared/errors/app-error.js';
import { env } from '../../../config/env.js';
import { IAuthRepository, PrismaAuthRepository } from './repository.js';
import { SignupInput } from './schemas.js';
import { SignupResponseDTO } from './dto.js';
import { hashPassword, signJwt } from './utils/crypto.js';
import { generateOid } from './utils/oid-generator.js';

export type UserResponse = SignupResponseDTO['user'];
export type OrganisationResponse = SignupResponseDTO['organisation'];
export type SignupResult = SignupResponseDTO;

export class AuthService {
  constructor(private readonly repo: IAuthRepository = new PrismaAuthRepository()) {}

  async signup(input: SignupInput): Promise<SignupResponseDTO> {
    // 1. Check if user email is already registered
    const existingUser = await this.repo.findUserByEmail(input.email);
    if (existingUser) {
      throw new AppError('User with this email already exists.', 409);
    }

    const passwordHash = hashPassword(input.password);

    // Scenario 1: Joining an existing organisation via oid
    if (input.oid) {
      const org = await this.repo.findOrganisationByOid(input.oid);
      if (!org) {
        throw new AppError('Organisation with given oid not found.', 404);
      }
      if (org.status === 'inactive') {
        throw new AppError('Organisation is inactive.', 403);
      }

      const user = await this.repo.createUser({
        email: input.email,
        name: input.name,
        passwordHash,
        organisationId: org.id,
      });

      const token = signJwt(
        { userId: user.id, organisationId: org.id },
        env.JWT_SECRET
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          organisationId: user.organisation_id,
          createdAt: user.createdAt,
        },
        organisation: {
          id: org.id,
          name: org.name,
          logo: org.logo,
          description: org.description,
          oid: org.oid,
          status: org.status,
        },
        token,
      };
    }

    // Scenario 2: First-time signup with new organisation creation
    if (!input.org) {
      throw new AppError('Organisation creation details are required for new org signup.', 400);
    }

    let retries = 3;
    let createdResult: { organisation: any; user: any } | null = null;
    let lastError: unknown = null;

    while (retries > 0 && !createdResult) {
      const generatedOid = generateOid(input.org.name);
      try {
        createdResult = await this.repo.createOrgAndUser(
          {
            name: input.org.name,
            oid: generatedOid,
            logo: input.org.logo,
            description: input.org.description,
          },
          {
            email: input.email,
            name: input.name,
            passwordHash,
          }
        );
      } catch (err: any) {
        lastError = err;
        // If unique constraint failed on oid collision, retry
        if (err?.code === 'P2002' && err?.meta?.target?.includes('oid')) {
          retries--;
          continue;
        }
        throw err;
      }
    }

    if (!createdResult) {
      throw lastError || new AppError('Failed to generate unique organisation oid.', 500);
    }

    const { organisation: org, user } = createdResult;
    const token = signJwt(
      { userId: user.id, organisationId: org.id },
      env.JWT_SECRET
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organisationId: user.organisation_id,
        createdAt: user.createdAt,
      },
      organisation: {
        id: org.id,
        name: org.name,
        logo: org.logo,
        description: org.description,
        oid: org.oid,
        status: org.status,
      },
      token,
    };
  }
}
