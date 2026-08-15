import { z } from 'zod';
import { APP_CONSTANTS } from '../../config/constants.js';

export const createMonitorSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
  intervalSeconds: z.number().int().min(APP_CONSTANTS.MIN_PING_INTERVAL_SECONDS).default(APP_CONSTANTS.DEFAULT_PING_INTERVAL_SECONDS),
});
