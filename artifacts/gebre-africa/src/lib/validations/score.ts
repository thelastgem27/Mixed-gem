// lib/validations/score.ts
import { z } from 'zod';

export const scoreEntrySchema = z.object({
  studentId: z.string(),
  subject: z.string().min(1),
  score: z.number().min(0).max(100),
  examType: z.string(),
  academicYear: z.string(),
  term: z.string(),
});

export type ScoreEntryValues = z.infer<typeof scoreEntrySchema>;
