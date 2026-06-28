import { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useLanguage } from '@/lib/i18n/context';
import { apiFetch, apiGet } from '@/lib/api';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export default function AttendanceClient({ sections }: { sections: any[] }) {
  const { t } = useLanguage();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<{ id: string; studentId: string; name: string; status: AttendanceStatus | null }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  const loadStudents = async (sectionId: string, d: string) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiGet(`/api/attendance/section/${sectionId}?date=${d}`);
      setStudents(data as any);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (sectionId: string, d: string) => {
    setSelectedSection(sectionId);
    setDate(d);
    loadStudents(sectionId, d);
  };

  const handleStatusChange = async (studentId: string, status: AttendanceStatus) => {
    try {
      const res = await apiFetch('/api/attendance', {
        method: 'POST',
        body: JSON.stringify({ studentId, date, status }),
      });
      if (!res.ok) throw new Error('Failed to mark attendance');
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('academic.markAttendance')}</h1>
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      
      <div className="flex flex-wrap gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.section')}</label>
          <select
            className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedSection || ''}
            onChange={e => handleFilterChange(e.target.value, date)}
          >
            <option value="">{t('academic.selectSection')}</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>{s.grade.name} - {t('academic.section')} {s.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.date')}</label>
          <input
            type="date"
            className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={date}
            onChange={e => handleFilterChange(selectedSection || '', e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">{t('common.loading')}</div>
      ) : selectedSection && (
        <div 
          ref={parentRef}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-auto max-h-[600px]"
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <tr className="flex w-full">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">{t('academic.studentId')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">{t('student.table.name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">{t('academic.status')}</th>
              </tr>
            </thead>
            <tbody 
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
              className="divide-y divide-gray-200 dark:divide-gray-700 block"
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const s = students[virtualRow.index];
                return (
                  <tr 
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: '100%',
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 flex w-full"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex-1">{s.studentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex-1">
                      <select
                        className="px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        value={s.status || ''}
                        onChange={e => handleStatusChange(s.id, e.target.value as AttendanceStatus)}
                      >
                        <option value="">{t('academic.selectStatus')}</option>
                        <option value="PRESENT">{t('academic.present')}</option>
                        <option value="ABSENT">{t('academic.absent')}</option>
                        <option value="LATE">{t('academic.late')}</option>
                        <option value="EXCUSED">{t('academic.excused')}</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
