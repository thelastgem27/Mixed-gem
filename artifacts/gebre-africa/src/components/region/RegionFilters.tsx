

import { useLanguage } from "@/lib/i18n/context";

export function RegionFilters() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-4 border-gray-200 dark:border-gray-700">
      <div className="grid md:grid-cols-4 gap-4">
        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option>{t("academicYear")}</option>
        </select>

        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option>{t("zone")}</option>
        </select>

        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option>{t("schoolType")}</option>
        </select>

        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <option>{t("gender")}</option>
        </select>
      </div>
    </div>
  );
}
