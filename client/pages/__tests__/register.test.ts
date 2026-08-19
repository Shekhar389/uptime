import { describe, it, expect } from 'vitest';
import { signupSchema } from '~/utils/schemas/auth';

describe('Register Page Form Schema Integration', () => {
  it('validates new organisation submission schema', () => {
    const payload = {
      name: 'Alice Dev',
      email: 'alice@company.com',
      password: 'securepassword123',
      mode: 'new',
      org: {
        name: 'New Startup',
        description: 'Building cool tech',
      },
    };

    const parsed = signupSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe('Alice Dev');
      expect(parsed.data.org?.name).toBe('New Startup');
    }
  });

  it('validates join existing organisation submission schema', () => {
    const payload = {
      name: 'Bob Dev',
      email: 'bob@company.com',
      password: 'securepassword123',
      mode: 'existing',
      oid: 'acme-x9k2p',
    };

    const parsed = signupSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.oid).toBe('acme-x9k2p');
    }
  });
});
