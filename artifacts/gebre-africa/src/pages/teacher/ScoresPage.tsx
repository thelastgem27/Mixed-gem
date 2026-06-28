import DashboardLayout from '@/components/layout/DashboardLayout';
import ScoresClient from '@/components/scores/ScoresClient';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function TeacherScoresPage() {
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    apiGet('/api/teacher/sections')
      .then(d => setSections(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <ScoresClient sections={sections} />
    </DashboardLayout>
  );
}
