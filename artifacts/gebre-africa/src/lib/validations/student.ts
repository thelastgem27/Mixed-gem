import { z } from 'zod';

const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);

export const studentFormSchema = z.object({
  userId: z.string().min(1, 'User account required'),
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email().optional().or(z.literal('')),
  gradeId: z.string().min(1, 'Grade required'),
  sectionId: z.string().optional(),
  dob: z.string().optional(),
  gender: GenderEnum.optional(),
  parentId: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
