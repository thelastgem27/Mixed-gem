import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Plus } from 'lucide-react';
import { apiGet } from '@/lib/api';

export function TeacherTable() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/teachers')
      .then(d => { setTeachers(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Teachers</h1>
        <Link href="/record-office/teachers/add" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="h-4 w-4" /> Add Teacher
        </Link>
      </div>
      {loading ? (
        <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {['Staff Code', 'Name', 'Email', 'Subjects'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100">{t.staffCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{t.user?.firstName} {t.user?.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{t.user?.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{Array.isArray(t.subjects) ? t.subjects.join(', ') : '-'}</td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">No teachers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
