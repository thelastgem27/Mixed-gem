// components/students/StudentTable.tsx


import { Link } from 'wouter';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useLanguage } from '@/lib/i18n/context';

type Student = {
  id: string;
  studentId: string;
  user: { firstName: string; lastName: string; email: string };
  grade: { name: string } | null;
  section: { name: string } | null;
};

interface Props {
  students: Student[];
  labels?: {
    id: string;
    name: string;
    grade: string;
    section: string;
    actions: string;
    view: string;
    noStudents: string;
  };
}

export function StudentTable({ students, labels }: Props) {
  const { t } = useLanguage();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimated row height
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-auto max-h-[600px]"
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{labels?.id || t('student.table.id')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{labels?.name || t('student.table.name')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{labels?.grade || t('student.table.grade')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{labels?.section || t('student.table.section')}</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{labels?.actions || t('student.table.actions')}</th>
          </tr>
        </thead>
        <tbody 
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
          className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const student = students[virtualRow.index];
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
                  {student.studentId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {student.user.firstName} {student.user.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {student.grade?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {student.section?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex-1">
                  <Link href={`/record-office/students/${student.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    {labels?.view || t('student.table.view')}
                  </Link>
                </td>
              </tr>
            );
          })}
          {students.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                {labels?.noStudents || t('student.table.noStudents')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
