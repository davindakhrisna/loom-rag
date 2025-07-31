import { object, string } from 'zod';

export const userSchema = object({
  username: string()
    .min(4, 'Name is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters long')
    .max(12, `Confirm Password must be at most 12 characters long`),
  confirmPassword: string()
    .min(6, 'Confirm Password must be at least 6 characters long')
    .max(12, `Confirm Password must be at most 12 characters long`),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})
