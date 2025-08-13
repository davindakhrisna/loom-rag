
import { object, string } from 'zod';

{/* Form Validator */ }
export const profileSchema = object({
  name: string()
    .min(4, 'Name is should not be less than 4 characters')
    .max(16, 'Name should be at most 16 characters long'),
  punchcard: string()
    .min(32, 'Punchcard is required atleast 32 characters'),
  username: string()
    .min(4, 'Username is required')
    .max(12, 'Username should be at most 12 characters long')
    .refine((val) => !/\s/.test(val), {
      message: 'Username should not contain spaces',
    }),
})
