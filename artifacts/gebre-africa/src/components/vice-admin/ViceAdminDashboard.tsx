

import { AdminKPICards } from "./AdminKPICards";
import { AdminFilters } from "./AdminFilters";
import { HRMonitoring } from "./HRMonitoring";
import { CashierMonitoring } from "./CashierMonitoring";
import { AttendanceMonitoring } from "./AttendanceMonitoring";
import { OperationalReports } from "./OperationalReports";
import { AdministrativeAnalytics } from "./AdministrativeAnalytics";

export function ViceAdminDashboard() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Administrative Overview
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor staff performance, financial operations, and administrative efficiency.
        </p>
      </div>

      <AdminFilters />

      <AdminKPICards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HRMonitoring />
        <AttendanceMonitoring />
      </div>

      <CashierMonitoring />

      <AdministrativeAnalytics />

      <OperationalReports />
    </div>
  );
}
