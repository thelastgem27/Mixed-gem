

import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, FileText, Wallet } from "lucide-react";

export function HRReports() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        HR Reports
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <span className="font-medium">Employee Report</span>
        </Button>

        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <span className="font-medium">Attendance Report</span>
        </Button>

        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
            <FileText className="h-6 w-6" />
          </div>
          <span className="font-medium">Leave Report</span>
        </Button>

        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="font-medium">Payroll Report</span>
        </Button>
      </div>
    </div>
  );
}
