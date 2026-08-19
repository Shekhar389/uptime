import { z } from 'zod';

export const newOrgSchema = z.object({
  name: z.string().min(1, 'Organisation name is required').max(255),
  logo: z.string().max(255).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
});

export const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'User name is required').max(255),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    oid: z.string().trim().min(1).optional(),
    org: newOrgSchema.optional(),
  })
  .refine(
    (data) => Boolean(data.oid) || Boolean(data.org?.name),
    {
      message: 'Either an existing organisation oid or new org details must be provided.',
      path: ['oid'],
    }
  );

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
