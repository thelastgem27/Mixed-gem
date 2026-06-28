

import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useLanguage } from '@/lib/i18n/context';

interface Student {
  studentId: string;
  user: { firstName: string; lastName: string };
  createdAt: Date;
}

interface RecentActivityProps {
  students: Student[];
  title?: string;
  viewAllLabel?: string;
}

export function RecentActivity({ students, title, viewAllLabel }: RecentActivityProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title || t('dashboard.recentActivity')}
        </h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/record-office/students">
            {viewAllLabel || t('dashboard.viewAll')}
          </Link>
        </Button>
      </div>
      <ul className="space-y-4">
        {students.map((s) => (
          <li key={s.studentId} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                {s.user.firstName[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {s.user.firstName} {s.user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('student.table.id')}: {s.studentId}</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
            </span>
          </li>
        ))}
        {students.length === 0 && (
          <li className="text-center py-6 text-sm text-gray-500">
            {t('common.noData')}
          </li>
        )}
      </ul>
    </div>
  );
}
