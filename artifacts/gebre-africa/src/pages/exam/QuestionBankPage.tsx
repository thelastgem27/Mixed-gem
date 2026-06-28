import DashboardLayout from '@/components/layout/DashboardLayout';
import { QuestionBank } from '@/components/exam/QuestionBank';

export default function ExamQuestionBankPage() {
  return (
    <DashboardLayout>
      <QuestionBank />
    </DashboardLayout>
  );
}
