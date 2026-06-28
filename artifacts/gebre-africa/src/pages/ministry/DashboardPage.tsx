import DashboardLayout from '@/components/layout/DashboardLayout';
import { MinistryDashboard } from '@/components/ministry/MinistryDashboard';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function MinistryDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    apiGet('/api/ministry/stats').then(setMetrics).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <MinistryDashboard metrics={metrics} />
    </DashboardLayout>
  );
}
