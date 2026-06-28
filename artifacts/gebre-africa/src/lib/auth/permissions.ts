import type { Role } from '@/lib/types';

export const PERMISSIONS: Record<string, Role[]> = {
  'attendance.mark': ['TEACHER', 'RECORD_OFFICE'],
  'score.create': ['TEACHER'],
  'fee.recordPayment': ['CASHIER', 'DIRECTOR'],
  'announcement.create': ['DIRECTOR', 'VICE_ADMIN'],
  'exam.create': ['EXAM_OFFICER', 'DIRECTOR'],
  'student.create': ['RECORD_OFFICE', 'DIRECTOR'],
  'teacher.create': ['RECORD_OFFICE', 'DIRECTOR'],
  'question.create': ['EXAM_OFFICER', 'DIRECTOR'],
  'promotion.run': ['DIRECTOR'],
  'export.students': ['DIRECTOR', 'RECORD_OFFICE'],
};

export function canPerform(action: string, role: Role): boolean {
  return PERMISSIONS[action]?.includes(role) ?? false;
}
