import { object, string } from 'zod';

{/* Form Validator */ }
export const userSchema = object({
  name: string()
    .min(4, 'Name is required'),
  username: string()
    .min(4, 'Username is required')
    .max(12, 'Username should be at most 12 characters long')
    .refine((val) => !/\s/.test(val), {
      message: 'Username should not contain spaces',
    }),
  password: string()
    .min(6, 'Password must be at least 6 characters long')
    .max(12, 'Confirm Password must be at most 12 characters long')
    .refine((val) => !/\s/.test(val), {
      message: 'Password should not contain spaces',
    }),
  confirmPassword: string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

export const loginSchema = object({
  username: string()
    .min(4, 'Username is required'),
  password: string()
    .min(8, 'Password is required')
    .refine((val) => !/\s/.test(val), {
      message: 'Password should not contain spaces',
    }),
})
