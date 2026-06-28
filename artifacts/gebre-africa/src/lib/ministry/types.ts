export interface NationalMetrics {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
}

export interface MinistryStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalUsers: number;
}

export function toNationalMetrics(stats: MinistryStats | null | undefined): NationalMetrics {
  return {
    totalSchools: stats?.totalSchools ?? 0,
    totalStudents: stats?.totalStudents ?? 0,
    totalTeachers: stats?.totalTeachers ?? 0,
    totalStaff: stats?.totalUsers ?? 0,
  };
}
