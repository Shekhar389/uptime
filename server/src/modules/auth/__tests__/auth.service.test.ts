import { AuthService } from '../internal/service.js';
import { DbClient } from '../../../infrastructure/db/postgres/client.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { hashPassword, verifyJwt } from '../internal/utils/crypto.js';
import { env } from '../../../config/env.js';

describe('AuthService', () => {
  let mockDbClient: any;
  let authService: AuthService;

  beforeEach(() => {
    mockDbClient = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      organisation: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(mockDbClient)),
    };
    authService = new AuthService(mockDbClient as unknown as DbClient);
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

      mockDbClient.user.findUnique.mockResolvedValue(null);
      mockDbClient.organisation.findUnique.mockResolvedValue(mockOrg);
      mockDbClient.user.create.mockResolvedValue(mockUser);

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
      mockDbClient.user.findUnique.mockResolvedValue({
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
      mockDbClient.user.findUnique.mockResolvedValue(null);
      mockDbClient.organisation.findUnique.mockResolvedValue(null);

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
      mockDbClient.user.findUnique.mockResolvedValue(null);
      mockDbClient.organisation.findUnique.mockResolvedValue({
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

      mockDbClient.user.findUnique.mockResolvedValue(null);
      mockDbClient.organisation.create.mockResolvedValue(mockOrg);
      mockDbClient.user.create.mockResolvedValue(mockUser);

      const result = await authService.signup(input);

      expect(result.user.email).toBe('founder@startup.com');
      expect(result.organisation.name).toBe('Startup Inc');
      expect(result.token).toBeDefined();

      expect(mockDbClient.organisation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Startup Inc',
            logo: 'https://startup.com/logo.png',
            description: 'A brand new startup',
          }),
        })
      );
      expect(mockDbClient.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'founder@startup.com',
            name: 'Alice Founder',
            organisation_id: 'new-org-uuid',
          }),
        })
      );
    });
  });

  describe('login', () => {
    it('should successfully authenticate user with valid credentials and active organisation', async () => {
      const password = 'mysecretpassword123';
      const passwordHash = hashPassword(password);

      const mockUser = {
        id: 'user-uuid-10',
        email: 'member@acme.com',
        name: 'Jane Member',
        password: passwordHash,
        organisation_id: 'org-uuid-10',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockOrg = {
        id: 'org-uuid-10',
        name: 'Acme Corp',
        logo: null,
        description: null,
        oid: 'acme-10',
        status: 'active' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDbClient.user.findUnique.mockResolvedValue(mockUser);
      mockDbClient.organisation.findUnique.mockResolvedValue(mockOrg);

      const result = await authService.login({
        email: 'member@acme.com',
        password,
      });

      expect(result.user.email).toBe('member@acme.com');
      expect(result.organisation.id).toBe('org-uuid-10');
      expect(result.token).toBeDefined();

      const decoded = verifyJwt(result.token, env.JWT_SECRET);
      expect(decoded).toMatchObject({
        userId: 'user-uuid-10',
        organisationId: 'org-uuid-10',
      });
    });

    it('should throw 401 error if user email does not exist', async () => {
      mockDbClient.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@acme.com',
          password: 'anypassword',
        })
      ).rejects.toThrow(new AppError('Invalid email or password', 401));
    });

    it('should throw 401 error if password is incorrect', async () => {
      const passwordHash = hashPassword('correctpassword');

      mockDbClient.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@acme.com',
        name: 'User',
        password: passwordHash,
        organisation_id: 'org-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.login({
          email: 'user@acme.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(new AppError('Invalid email or password', 401));
    });

    it('should throw 403 error if user organisation is inactive', async () => {
      const password = 'validpassword';
      const passwordHash = hashPassword(password);

      mockDbClient.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@inactive.com',
        name: 'User',
        password: passwordHash,
        organisation_id: 'org-inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockDbClient.organisation.findUnique.mockResolvedValue({
        id: 'org-inactive',
        name: 'Inactive Corp',
        logo: null,
        description: null,
        oid: 'inactive-1',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.login({
          email: 'user@inactive.com',
          password,
        })
      ).rejects.toThrow(new AppError('Organisation is inactive.', 403));
    });
  });
});
