import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const newOrgSchema = z.object({
  name: z.string().max(255).optional(),
  logo: z.string().max(255).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, 'User name is required').max(255),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    mode: z.enum(['new', 'existing']).default('new'),
    oid: z.string().trim().optional(),
    org: newOrgSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'existing') {
      if (!data.oid || data.oid.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Organisation identifier (oid) is required when joining an existing organisation',
          path: ['oid'],
        });
      }
    } else {
      if (!data.org?.name || data.org.name.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Organisation name is required when creating a new organisation',
          path: ['org', 'name'],
        });
      }
    }
  });

export type SignupInput = z.infer<typeof signupSchema>;
