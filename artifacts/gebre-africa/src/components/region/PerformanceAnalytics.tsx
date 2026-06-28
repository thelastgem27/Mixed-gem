

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { zone: "Zone A", score: 78 },
  { zone: "Zone B", score: 72 },
  { zone: "Zone C", score: 75 },
  { zone: "Zone D", score: 68 },
  { zone: "Zone E", score: 81 }
];

export function PerformanceAnalytics() {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Zone Performance
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="zone" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', color: '#f9fafb', border: 'none' }}
          />
          <Bar dataKey="score" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
