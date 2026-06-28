

import { AcademicKPICards } from "./AcademicKPICards";
import { AcademicFilters } from "./AcademicFilters";
import { SubjectPortionTracker } from "./SubjectPortionTracker";
import { TeacherTracking } from "./TeacherTracking";
import { ScoreMonitoring } from "./ScoreMonitoring";
import { ExamMonitoring } from "./ExamMonitoring";
import { AcademicReports } from "./AcademicReports";
import { PerformanceAnalytics } from "./PerformanceAnalytics";

export function ViceAcademicDashboard() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Academic Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor curriculum progress, teacher performance, and student outcomes.
        </p>
      </div>

      <AcademicFilters />

      <AcademicKPICards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SubjectPortionTracker />
        <ExamMonitoring />
      </div>

      <TeacherTracking />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScoreMonitoring />
        <PerformanceAnalytics />
      </div>

      <AcademicReports />
    </div>
  );
}
