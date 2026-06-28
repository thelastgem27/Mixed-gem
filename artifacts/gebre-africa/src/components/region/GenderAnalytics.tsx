

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";
import { useLanguage } from "@/lib/i18n/context";
import { useMemo } from "react";

const COLORS = ['#3b82f6', '#ec4899'];

export function GenderAnalytics() {
  const { t } = useLanguage();

  const data = useMemo(() => [
    { name: t("male"), value: 52 },
    { name: t("female"), value: 48 }
  ], [t]);

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {t("genderDistribution")}
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
