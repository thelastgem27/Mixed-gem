

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useLanguage } from "@/lib/i18n/context";

const data = [
  { zone: "Zone A", performance: 88 },
  { zone: "Zone B", performance: 75 },
  { zone: "Zone C", performance: 92 },
  { zone: "Zone D", performance: 65 },
  { zone: "Zone E", performance: 80 }
];

export function ZoneComparison() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {t("zonePerformanceComparison")}
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="zone" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb', border: 'none' }}
          />
          <Bar dataKey="performance" fill="#fbbf24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
