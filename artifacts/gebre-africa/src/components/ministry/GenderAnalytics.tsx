

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";

const data = [
  {
    name: "Male",
    value: 51
  },
  {
    name: "Female",
    value: 49
  }
];

const COLORS = ['#3b82f6', '#ec4899'];

export function GenderAnalytics() {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Gender Distribution
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
