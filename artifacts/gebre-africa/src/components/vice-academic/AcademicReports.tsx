

import { Button } from "@/components/ui/button";
import { FileText, UserCheck, ClipboardList } from "lucide-react";

export function AcademicReports() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Academic Reports
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
          <span className="font-medium">Student Performance Report</span>
        </Button>

        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="h-6 w-6" />
          </div>
          <span className="font-medium">Teacher Performance Report</span>
        </Button>

        <Button 
          variant="outline" 
          className="h-auto py-4 px-6 flex flex-col items-center gap-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
        >
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
            <ClipboardList className="h-6 w-6" />
          </div>
          <span className="font-medium">Examination Summary Report</span>
        </Button>
      </div>
    </div>
  );
}
