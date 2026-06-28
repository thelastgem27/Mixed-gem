

import { RegionKPICards } from "./RegionKPICards";
import { RegionFilters } from "./RegionFilters";
import { EnrollmentAnalytics } from "./EnrollmentAnalytics";
import { AttendanceAnalytics } from "./AttendanceAnalytics";
import { PerformanceAnalytics } from "./PerformanceAnalytics";
import { ZoneComparison } from "./ZoneComparison";
import { TeacherAnalytics } from "./TeacherAnalytics";
import { SchoolAnalytics } from "./SchoolAnalytics";
import { GenderAnalytics } from "./GenderAnalytics";

export function RegionDashboard() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Regional Overview</h1>
      <RegionFilters />
      <RegionKPICards />
      
      <SchoolAnalytics />
      <TeacherAnalytics />

      <div className="grid md:grid-cols-2 gap-6">
        <EnrollmentAnalytics />
        <AttendanceAnalytics />
        <PerformanceAnalytics />
        <ZoneComparison />
        <GenderAnalytics />
      </div>
    </div>
  );
}
