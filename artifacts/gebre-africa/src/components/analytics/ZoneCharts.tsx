

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type WoredaData = {
  name: string;
  schools: { _count: { students: number; teachers: number } }[];
};

export function ZoneCharts({ woredas }: { woredas: WoredaData[] }) {
  const data = woredas.map(w => ({
    name: w.name,
    students: w.schools.reduce((sum, s) => sum + s._count.students, 0),
    teachers: w.schools.reduce((sum, s) => sum + s._count.teachers, 0),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold mb-6 text-gray-900 dark:text-white">Woreda Comparison</h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
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
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Students" barSize={30} />
            <Bar dataKey="teachers" fill="#10B981" radius={[4, 4, 0, 0]} name="Teachers" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
