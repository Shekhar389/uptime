import { AuthService } from '../internal/service.js';
import { IAuthRepository } from '../internal/repository.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { verifyJwt } from '../internal/utils/crypto.js';
import { env } from '../../../config/env.js';

describe('AuthService', () => {
  let mockRepo: jest.Mocked<IAuthRepository>;
  let authService: AuthService;

  beforeEach(() => {
    mockRepo = {
      findUserByEmail: jest.fn(),
      findOrganisationByOid: jest.fn(),
      createUser: jest.fn(),
      createOrgAndUser: jest.fn(),
    };
    authService = new AuthService(mockRepo);
  });

  describe('signup - Scenario 1: Existing Organisation', () => {
    it('should successfully create a user under an existing active organisation', async () => {
      const input = {
        email: 'user@existing.com',
        name: 'John Doe',
        password: 'securepassword123',
        oid: 'org-active-123',
      };

      const mockOrg = {
        id: 'org-uuid-1',
        name: 'Active Org',
        logo: 'https://example.com/logo.png',
        description: 'An active org',
        oid: 'org-active-123',
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUser = {
        id: 'user-uuid-1',
        email: input.email,
        name: input.name,
        password: 'hashedpassword',
        organisation_id: mockOrg.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepo.findUserByEmail.mockResolvedValue(null);
      mockRepo.findOrganisationByOid.mockResolvedValue(mockOrg);
      mockRepo.createUser.mockResolvedValue(mockUser);

      const result = await authService.signup(input);

      expect(result.user.email).toBe('user@existing.com');
      expect(result.user.organisationId).toBe('org-uuid-1');
      expect(result.organisation.oid).toBe('org-active-123');
      expect(result.token).toBeDefined();

      const decoded = verifyJwt(result.token, env.JWT_SECRET);
      expect(decoded).toMatchObject({
        userId: 'user-uuid-1',
        organisationId: 'org-uuid-1',
      });
    });

    it('should throw 409 error if email already exists', async () => {
      mockRepo.findUserByEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'user@existing.com',
        name: 'Existing',
        password: 'hash',
        organisation_id: 'org-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.signup({
          email: 'user@existing.com',
          name: 'Jane Doe',
          password: 'password123',
          oid: 'org-123',
        })
      ).rejects.toThrow(new AppError('User with this email already exists.', 409));
    });

    it('should throw 404 error if target organisation oid does not exist', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      mockRepo.findOrganisationByOid.mockResolvedValue(null);

      await expect(
        authService.signup({
          email: 'newuser@test.com',
          name: 'New User',
          password: 'password123',
          oid: 'non-existent-oid',
        })
      ).rejects.toThrow(new AppError('Organisation with given oid not found.', 404));
    });

    it('should throw 403 error if target organisation status is inactive', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      mockRepo.findOrganisationByOid.mockResolvedValue({
        id: 'org-uuid-2',
        name: 'Inactive Org',
        logo: null,
        description: null,
        oid: 'inactive-oid',
        status: 'inactive' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.signup({
          email: 'newuser@test.com',
          name: 'New User',
          password: 'password123',
          oid: 'inactive-oid',
        })
      ).rejects.toThrow(new AppError('Organisation is inactive.', 403));
    });
  });

  describe('signup - Scenario 2: New Organisation', () => {
    it('should create both a new organisation and user when org payload is provided', async () => {
      const input = {
        email: 'founder@startup.com',
        name: 'Alice Founder',
        password: 'founderpassword123',
        org: {
          name: 'Startup Inc',
          logo: 'https://startup.com/logo.png',
          description: 'A brand new startup',
        },
      };

      const mockOrg = {
        id: 'new-org-uuid',
        name: 'Startup Inc',
        logo: 'https://startup.com/logo.png',
        description: 'A brand new startup',
        oid: 'startupinc-x1y2z',
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUser = {
        id: 'founder-user-uuid',
        email: input.email,
        name: input.name,
        password: 'hashedpassword',
        organisation_id: mockOrg.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepo.findUserByEmail.mockResolvedValue(null);
      mockRepo.createOrgAndUser.mockResolvedValue({
        organisation: mockOrg,
        user: mockUser,
      });

      const result = await authService.signup(input);

      expect(result.user.email).toBe('founder@startup.com');
      expect(result.organisation.name).toBe('Startup Inc');
      expect(result.organisation.oid).toBe('startupinc-x1y2z');
      expect(result.token).toBeDefined();

      expect(mockRepo.createOrgAndUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Startup Inc',
          logo: 'https://startup.com/logo.png',
          description: 'A brand new startup',
        }),
        expect.objectContaining({
          email: 'founder@startup.com',
          name: 'Alice Founder',
        })
      );
    });
  });
});
