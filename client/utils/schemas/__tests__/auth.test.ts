import { describe, it, expect } from 'vitest';
import { signupSchema } from '../auth';

describe('signupSchema Zod Validation', () => {
  it('validates a valid payload for creating a new organisation', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      mode: 'new',
      org: {
        name: 'Acme Corp',
        description: 'Testing team',
      },
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates a valid payload for joining an existing organisation via oid', () => {
    const validData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      mode: 'existing',
      oid: 'acme-x9k2p',
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails if password is shorter than 8 characters', () => {
    const invalidData = {
      name: 'Short Pass',
      email: 'short@example.com',
      password: 'short',
      mode: 'new',
      org: { name: 'Acme' },
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails if mode is new but organisation name is missing', () => {
    const invalidData = {
      name: 'No Org Name',
      email: 'noorg@example.com',
      password: 'password123',
      mode: 'new',
      org: { name: '' },
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('passes when mode is existing even if org object has empty name in state', () => {
    const validData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      mode: 'existing',
      oid: 'acme-x9k2p',
      org: { name: '', description: '' },
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
