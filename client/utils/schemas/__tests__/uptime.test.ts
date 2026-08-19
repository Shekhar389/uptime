import { describe, it, expect } from 'vitest';
import { createMonitorSchema } from '../uptime';

describe('Zod Monitor Validation Schema', () => {
  it('validates a valid monitor payload', () => {
    const validData = {
      name: 'Production Gateway',
      url: 'https://api.acme.com/health',
      intervalSeconds: 180,
      type: 'http' as const,
    };

    const result = createMonitorSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails when URL is invalid', () => {
    const invalidData = {
      name: 'Bad Monitor',
      url: 'not-a-valid-url',
      intervalSeconds: 180,
      type: 'http' as const,
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
      intervalSeconds: 60,
      type: 'http' as const,
    };

    const result = createMonitorSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Minimum check interval is 180 seconds (3 minutes)');
    }
  });
});
