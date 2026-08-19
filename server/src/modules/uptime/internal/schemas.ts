import { z } from 'zod';
import { APP_CONSTANTS } from '../../../config/constants.js';

export const createMonitorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  type: z.enum(['http']).default('http'),
  url: z.string().url('Invalid URL format'),
  intervalSeconds: z
    .number()
    .int('Interval must be an integer')
    .min(
      APP_CONSTANTS.MIN_PING_INTERVAL_SECONDS,
      `Minimum interval allowed is ${APP_CONSTANTS.MIN_PING_INTERVAL_SECONDS} seconds (3 minutes)`
    )
    .default(APP_CONSTANTS.DEFAULT_PING_INTERVAL_SECONDS),
});

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
