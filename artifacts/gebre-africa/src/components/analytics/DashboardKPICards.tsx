

import { Users, GraduationCap, CalendarCheck, DollarSign } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface Props {
  data: {
    students: number;
    teachers: number;
    attendance: number;
    revenue: number;
  };
  labels?: {
    students: string;
    teachers: string;
    schools: string;
    attendance: string;
  };
}

export function DashboardKPICards({ data, labels }: Props) {
  const { t } = useLanguage();
  const cards = [
    { label: labels?.students || t('dashboard.kpis.students'), value: data.students, icon: GraduationCap, color: 'text-blue-600' },
    { label: labels?.teachers || t('dashboard.kpis.teachers'), value: data.teachers, icon: Users, color: 'text-emerald-600' },
    { label: labels?.attendance || t('dashboard.kpis.attendance'), value: `${data.attendance}%`, icon: CalendarCheck, color: 'text-amber-600' },
    { label: t('dashboard.kpis.revenue'), value: `${data.revenue.toLocaleString()} ETB`, icon: DollarSign, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
