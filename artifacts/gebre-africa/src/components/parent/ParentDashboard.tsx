import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export function ParentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/parent/dashboard')
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Parent Dashboard</h1>
      <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
    </div>
  );

  const children = data?.children || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Parent Dashboard</h1>
      {children.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center text-gray-500 border border-gray-200 dark:border-gray-700">
          No children linked to your account yet.
        </div>
      ) : (
        children.map((child: any) => (
          <div key={child.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b dark:border-gray-700">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-lg">
                {child.user?.firstName?.[0]}{child.user?.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{child.user?.firstName} {child.user?.lastName}</h2>
                <p className="text-xs text-gray-500">Student ID: {child.studentId} · Grade: {child.grade?.name || '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Attendance</h3>
                {(child.attendance || []).length === 0 ? (
                  <p className="text-sm text-gray-400">No attendance records</p>
                ) : (
                  <ul className="space-y-1">
                    {child.attendance.map((a: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{a.date}</span>
                        <span className={a.status === 'PRESENT' ? 'text-green-600' : a.status === 'ABSENT' ? 'text-red-600' : 'text-amber-500'}>{a.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Scores</h3>
                {(child.scores || []).length === 0 ? (
                  <p className="text-sm text-gray-400">No score records</p>
                ) : (
                  <ul className="space-y-1">
                    {child.scores.map((s: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{s.subject}</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{s.score}/{s.maxScore}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
