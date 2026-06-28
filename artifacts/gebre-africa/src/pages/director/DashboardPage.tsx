import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DirectorDashboard } from '@/components/director/DirectorDashboard';

export default function DirectorDashboardPage() {
  return (
    <DashboardLayout>
      <DirectorDashboard />
    </DashboardLayout>
  );
}
