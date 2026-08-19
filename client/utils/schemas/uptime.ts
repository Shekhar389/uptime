import { z } from 'zod';

export const createMonitorSchema = z.object({
  name: z.string().min(2, 'Monitor name must be at least 2 characters'),
  url: z.string().url('Must be a valid HTTP or HTTPS URL'),
  intervalSeconds: z
    .number({ invalid_type_error: 'Interval must be a number' })
    .min(180, 'Minimum check interval is 180 seconds (3 minutes)')
    .max(3600, 'Maximum check interval is 3600 seconds'),
  type: z.enum(['http']).default('http'),
});

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
