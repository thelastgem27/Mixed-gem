import { useEffect, useState } from 'react';
import { QuestionBankTable } from './QuestionBankTable';
import { apiGet } from '@/lib/api';

export function QuestionBank() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    apiGet('/api/exam/questions')
      .then(d => { setQuestions(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Question Bank</h1>
      {loading ? (
        <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
      ) : (
        <QuestionBankTable
          questions={questions}
          onApprove={() => load()}
          onDelete={() => load()}
        />
      )}
    </div>
  );
}
