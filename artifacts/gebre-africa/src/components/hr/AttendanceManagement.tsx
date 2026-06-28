

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend
} from "recharts";

const attendanceData = [
  {
    name: "Present",
    value: 95
  },
  {
    name: "Absent",
    value: 2
  },
  {
    name: "Late",
    value: 2
  },
  {
    name: "Excused",
    value: 1
  }
];

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

export function AttendanceManagement() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Staff Attendance Analytics
      </h2>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={attendanceData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {attendanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
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
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
