import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function WoredaDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiGet('/api/ministry/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Woreda Dashboard</h1>
        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Schools', value: stats.totalSchools ?? 0 },
              { label: 'Students', value: stats.totalStudents ?? 0 },
              { label: 'Teachers', value: stats.totalTeachers ?? 0 },
              { label: 'Users', value: stats.totalUsers ?? 0 },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0,1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
