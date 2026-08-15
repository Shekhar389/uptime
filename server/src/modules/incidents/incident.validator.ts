import { z } from 'zod';

export const createIncidentSchema = z.object({
  monitorId: z.string().uuid(),
  title: z.string().min(3).max(500),
});
