

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const data = [
  { name: "Present", value: 92 },
  { name: "Absent", value: 4 },
  { name: "Late", value: 2 },
  { name: "Excused", value: 2 }
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

export function AttendanceAnalytics() {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        National Attendance
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
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
