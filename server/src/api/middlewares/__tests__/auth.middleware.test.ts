import { authMiddleware } from '../auth.middleware.js';
import { signJwt } from '../../../modules/auth/index.js';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/app-error.js';

describe('authMiddleware', () => {
  it('should throw 401 AppError when Authorization header is missing', async () => {
    const mockRequest = {
      headers: {},
    } as any;

    await expect(authMiddleware(mockRequest, {} as any)).rejects.toThrow(
      new AppError('Missing or malformed authorization header', 401)
    );
  });

  it('should throw 401 AppError when Authorization header does not start with Bearer', async () => {
    const mockRequest = {
      headers: { authorization: 'Basic 12345' },
    } as any;

    await expect(authMiddleware(mockRequest, {} as any)).rejects.toThrow(
      new AppError('Missing or malformed authorization header', 401)
    );
  });

  it('should throw 401 AppError when JWT token is invalid or corrupted', async () => {
    const mockRequest = {
      headers: { authorization: 'Bearer invalid.jwt.token' },
    } as any;

    await expect(authMiddleware(mockRequest, {} as any)).rejects.toThrow(
      new AppError('Invalid or expired authentication token', 401)
    );
  });

  it('should successfully verify valid JWT token and attach user, organisationId, and teamId to request', async () => {
    const token = signJwt(
      { userId: 'usr-123', organisationId: 'org-456' },
      env.JWT_SECRET
    );

    const mockRequest = {
      headers: { authorization: `Bearer ${token}` },
    } as any;

    await authMiddleware(mockRequest, {} as any);

    expect(mockRequest.user).toEqual({
      id: 'usr-123',
      organisationId: 'org-456',
    });
    expect(mockRequest.organisationId).toBe('org-456');
    expect(mockRequest.teamId).toBe('org-456');
  });
});
