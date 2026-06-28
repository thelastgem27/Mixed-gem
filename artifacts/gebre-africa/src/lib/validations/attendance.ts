import { z } from 'zod';

const AttendanceStatusEnum = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

export const attendanceMarkSchema = z.object({
  studentId: z.string(),
  date: z.string(),
  status: AttendanceStatusEnum,
  remarks: z.string().optional(),
});

export type AttendanceMarkValues = z.infer<typeof attendanceMarkSchema>;
