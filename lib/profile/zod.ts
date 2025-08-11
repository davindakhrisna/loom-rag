
import { object, string } from 'zod';

{/* Form Validator */ }
export const userSchema = object({
  name: string()
    .min(4, 'Name is required')
    .max(16, 'Name should be at most 16 characters long'),
})

export const punchSchema = object({
  username: string()
    .min(32, 'Punchcard is required'),
})
