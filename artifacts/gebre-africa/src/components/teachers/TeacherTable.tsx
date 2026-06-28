import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

type TeacherWithUser = {
  id: string;
  staffCode: string;
  subjects: string[];
  user: { firstName: string; lastName: string; email: string };
};

export function TeacherTable({ teachers }: { teachers: TeacherWithUser[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: teachers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-auto max-h-[600px]"
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
          <tr className="flex w-full">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">Staff Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1">Subjects</th>
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
            const t = teachers[virtualRow.index];
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">{t.staffCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">{t.user.firstName} {t.user.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">{t.user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">{t.subjects.join(', ') || '-'}</td>
              </tr>
            );
          })}
          {teachers.length === 0 && (
            <tr className="w-full">
              <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 w-full block">
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
