import DashboardLayout from '@/components/layout/DashboardLayout';
import { FeeTable } from '@/components/fees/FeeTable';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function CashierFeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/fees')
      .then(data => { setFees(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fee Management</h1>
        {loading ? (
          <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
        ) : (
          <FeeTable fees={fees} />
        )}
      </div>
    </DashboardLayout>
  );
}
