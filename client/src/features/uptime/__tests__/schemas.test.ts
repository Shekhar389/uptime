import { describe, it, expect } from 'vitest';
import { createMonitorSchema } from '../schemas';

describe('Zod Monitor Validation Schema', () => {
  it('validates a valid monitor payload', () => {
    const validData = {
      name: 'Production Gateway',
      url: 'https://api.acme.com/health',
      intervalSeconds: 30,
      status: 'up' as const,
    };

    const result = createMonitorSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails when URL is invalid', () => {
    const invalidData = {
      name: 'Bad Monitor',
      url: 'not-a-valid-url',
      intervalSeconds: 60,
    };

    const result = createMonitorSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Must be a valid HTTP or HTTPS URL');
    }
  });

  it('fails when intervalSeconds is below minimum', () => {
    const invalidData = {
      name: 'Fast Monitor',
      url: 'https://api.acme.com',
      intervalSeconds: 2,
    };

    const result = createMonitorSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Minimum check interval is 10 seconds');
    }
  });
});
