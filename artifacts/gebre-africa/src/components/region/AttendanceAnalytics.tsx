

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useLanguage } from "@/lib/i18n/context";
import { useMemo } from "react";

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

export function AttendanceAnalytics() {
  const { t } = useLanguage();

  const data = useMemo(() => [
    { name: t("present"), value: 90 },
    { name: t("absent"), value: 5 },
    { name: t("late"), value: 3 },
    { name: t("excused"), value: 2 }
  ], [t]);

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {t("regionalAttendance")}
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb', border: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
