import DashboardLayout from '@/components/layout/DashboardLayout';
import { StudentTable } from '@/components/record-office/StudentTable';

export default function RecordOfficeStudentsPage() {
  return (
    <DashboardLayout>
      <StudentTable />
    </DashboardLayout>
  );
}
