

import { HRKPICards } from "./HRKPICards";
import { HRFilters } from "./HRFilters";
import { EmployeeOverview } from "./EmployeeOverview";
import { DepartmentManagement } from "./DepartmentManagement";
import { AttendanceManagement } from "./AttendanceManagement";
import { LeaveManagement } from "./LeaveManagement";
import { PayrollOverview } from "./PayrollOverview";
import { HRReports } from "./HRReports";

export function HRDashboard() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          HR Management Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor staff overview, departments, attendance, and payroll.
        </p>
      </div>

      <HRFilters />

      <HRKPICards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmployeeOverview />
        <AttendanceManagement />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DepartmentManagement />
        <LeaveManagement />
      </div>

      <PayrollOverview />

      <HRReports />
    </div>
  );
}
