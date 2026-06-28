

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useLanguage } from "@/lib/i18n/context";

const data = [
  { year: "2021", students: 420000 },
  { year: "2022", students: 445000 },
  { year: "2023", students: 460000 },
  { year: "2024", students: 475000 },
  { year: "2025", students: 482000 }
];

export function EnrollmentAnalytics() {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {t("regionalEnrollmentTrend")}
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb', border: 'none' }}
          />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
