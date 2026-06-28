import type { Role } from '@/lib/types';

export type { Role };

export const ROLE_HIERARCHY: Record<Role, number> = {
  DIRECTOR: 10,
  VICE_ACADEMIC: 9,
  VICE_ADMIN: 9,
  RECORD_OFFICE: 8,
  HR: 8,
  CASHIER: 8,
  TEACHER: 5,
  STUDENT: 1,
  PARENT: 1,
  WOREDA_ADMIN: 15,
  ZONE_ADMIN: 20,
  REGION_ADMIN: 25,
  MINISTRY_ADMIN: 30,
  EXAM_OFFICER: 12,
};

export const IS_SCHOOL_STAFF = (role: Role) => 
  ['DIRECTOR', 'VICE_ACADEMIC', 'VICE_ADMIN', 'RECORD_OFFICE', 'HR', 'CASHIER'].includes(role);

export const IS_GOVERNMENT_ADMIN = (role: Role) =>
  ['WOREDA_ADMIN', 'ZONE_ADMIN', 'REGION_ADMIN', 'MINISTRY_ADMIN'].includes(role);
