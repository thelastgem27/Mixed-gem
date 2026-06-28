import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export function ExamResults() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/exams/results')
      .then(d => { setResults(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exam Results</h1>
      {loading ? (
        <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
      ) : results.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center text-gray-500 border border-gray-200 dark:border-gray-700">
          No exam results available yet.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {['Exam', 'Subject', 'Student', 'Score', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.exam?.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.exam?.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.student?.user?.firstName} {r.student?.user?.lastName}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{r.score}/{r.maxScore}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.passed ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
