// components/ministry/MinistryDashboard.tsx


import { NationalKPICards } from "./NationalKPICards";
import { DashboardFilters } from "./DashboardFilters";
import { EnrollmentAnalytics } from "./EnrollmentAnalytics";
import { AttendanceAnalytics } from "./AttendanceAnalytics";
import { PerformanceAnalytics } from "./PerformanceAnalytics";
import { TeacherAnalytics } from "./TeacherAnalytics";
import { SchoolAnalytics } from "./SchoolAnalytics";
import { GenderAnalytics } from "./GenderAnalytics";
import { NationalMetrics } from "@/lib/ministry/types";

interface Props {
  metrics?: NationalMetrics | null;
}

export function MinistryDashboard({ metrics }: Props) {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">National Education Overview</h1>
      <DashboardFilters />
      <NationalKPICards data={metrics ?? undefined} />
      
      <SchoolAnalytics />
      <TeacherAnalytics />

      <div className="grid md:grid-cols-2 gap-6">
        <EnrollmentAnalytics />
        <AttendanceAnalytics />
        <PerformanceAnalytics />
        <GenderAnalytics />
      </div>
    </div>
  );
}
