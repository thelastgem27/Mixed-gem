

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const analyticsData = [
  {
    month: "Jan",
    efficiency: 72
  },
  {
    month: "Feb",
    efficiency: 75
  },
  {
    month: "Mar",
    efficiency: 77
  },
  {
    month: "Apr",
    efficiency: 81
  },
  {
    month: "May",
    efficiency: 86
  }
];

export function AdministrativeAnalytics() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Administrative Performance Trend
      </h2>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.1} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backgroundColor: '#1F2937',
                color: '#F9FAFB'
              }}
              itemStyle={{ color: '#F9FAFB' }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
