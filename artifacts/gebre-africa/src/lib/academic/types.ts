export interface AcademicStats {
  subjects: number;
  teachers: number;
  classes: number;
  examCompletion: number;
}

export interface SubjectPortion {
  subject: string;
  completed: number;
}

export interface TeacherMetric {
  name: string;
  subject: string;
  attendance: number;
  portionCoverage: number;
}
