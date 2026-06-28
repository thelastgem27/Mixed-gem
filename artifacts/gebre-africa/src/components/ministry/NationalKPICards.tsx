// components/ministry/NationalKPICards.tsx


import { School, GraduationCap, Users, UserCheck } from "lucide-react";
import { useLanguage } from '@/lib/i18n/context';
import { NationalMetrics } from '@/lib/ministry/types';

interface Props {
  data?: NationalMetrics | null;
}

export function NationalKPICards({ data }: Props) {
  const { t } = useLanguage();

  const safe = {
    totalSchools: data?.totalSchools ?? 0,
    totalStudents: data?.totalStudents ?? 0,
    totalTeachers: data?.totalTeachers ?? 0,
    totalStaff: data?.totalStaff ?? 0,
  };

  const cards = [
    { title: t('government.totalSchools'), value: safe.totalSchools.toLocaleString(), icon: School, color: 'text-blue-600' },
    { title: t('government.totalStudents'), value: safe.totalStudents.toLocaleString(), icon: GraduationCap, color: 'text-emerald-600' },
    { title: t('government.totalTeachers'), value: safe.totalTeachers.toLocaleString(), icon: Users, color: 'text-amber-600' },
    { title: t('government.totalStaff'), value: safe.totalStaff.toLocaleString(), icon: UserCheck, color: 'text-purple-600' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{card.value}</h2>
              </div>
              <Icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
