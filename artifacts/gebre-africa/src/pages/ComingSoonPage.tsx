import DashboardLayout from '@/components/layout/DashboardLayout';
import { Construction } from 'lucide-react';

export default function ComingSoonPage({ title }: { title?: string }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 text-center">
        <Construction className="h-14 w-14 text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title ?? 'Coming Soon'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          This section is under development and will be available in a future update.
        </p>
      </div>
    </DashboardLayout>
  );
}
