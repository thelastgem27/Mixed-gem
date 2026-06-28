import DashboardLayout from '@/components/layout/DashboardLayout';
import AttendanceClient from '@/components/attendance/AttendanceClient';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

export default function TeacherAttendancePage() {
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    apiGet('/api/teacher/sections')
      .then(d => setSections(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <AttendanceClient sections={sections} />
    </DashboardLayout>
  );
}
