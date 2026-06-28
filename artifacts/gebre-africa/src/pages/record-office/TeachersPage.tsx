import DashboardLayout from '@/components/layout/DashboardLayout';
import { TeacherTable } from '@/components/record-office/TeacherTable';

export default function RecordOfficeTeachersPage() {
  return (
    <DashboardLayout>
      <TeacherTable />
    </DashboardLayout>
  );
}
