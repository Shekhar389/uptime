import { z } from 'zod';

export const createIncidentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  severity: z.enum(['critical', 'major', 'minor']),
  status: z.enum(['investigating', 'identified', 'monitoring', 'resolved']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
