

import { useLanguage } from "@/lib/i18n/context";
import { useMemo } from "react";

export function TeacherAnalytics() {
  const { t } = useLanguage();

  const teacherStats = useMemo(() => [
    { title: t("totalTeachers"), value: "21,300" },
    { title: t("retentionRate"), value: "91%" },
    { title: t("turnover"), value: "9%" },
    { title: t("avgAttendance"), value: "94%" }
  ], [t]);

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {t("teacherAnalytics")}
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        {teacherStats.map(stat => (
          <div
            key={stat.title}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="text-gray-500 dark:text-gray-400">
              {stat.title}
            </div>

            <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
