

import { BookOpen, Users, Layout, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export function AcademicKPICards() {
  const { t } = useLanguage();
  
  const cards = [
    {
      title: "Subjects",
      value: "48",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Teachers",
      value: "126",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    {
      title: "Classes",
      value: "84",
      icon: Layout,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Exam Completion",
      value: "92%",
      icon: CheckCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${card.bgColor} ${card.color}`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </div>
              <div className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {card.value}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
