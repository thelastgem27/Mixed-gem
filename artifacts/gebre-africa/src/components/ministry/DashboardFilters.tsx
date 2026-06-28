// components/ministry/DashboardFilters.tsx


import { useLanguage } from '@/lib/i18n/context';

export function DashboardFilters() {
  const { t } = useLanguage();
  
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="grid md:grid-cols-4 gap-4">
        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <option>{t('common.academicYear')}</option>
        </select>
        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <option>{t('common.region')}</option>
        </select>
        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <option>{t('common.zone')}</option>
        </select>
        <select className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <option>{t('common.woreda')}</option>
        </select>
      </div>
    </div>
  );
}
