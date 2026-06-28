// lib/validations/teacher.ts
import { z } from 'zod';

export const teacherFormSchema = z.object({
  userId: z.string().min(1, 'User account required'),
  qualification: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;
