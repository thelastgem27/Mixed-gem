import { apiFetch } from '@/lib/api';

type Question = {
  id: string;
  subject: string;
  question: string;
  type: string;
  approved: boolean;
  createdBy: { firstName: string; lastName: string };
};

export function QuestionBankTable({ questions, onApprove, onDelete }: {
  questions: Question[];
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const handleApprove = async (id: string) => {
    try {
      const res = await apiFetch(`/api/exam/questions/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve question');
      onApprove?.(id);
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete question?')) {
      try {
        const res = await apiFetch(`/api/exam/questions/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete question');
        onDelete?.(id);
      } catch (e: any) { alert(e.message); }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {questions.map(q => (
            <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 text-sm">{q.subject}</td>
              <td className="px-4 py-3 text-sm max-w-xs truncate">{q.question}</td>
              <td className="px-4 py-3 text-sm">{q.type}</td>
              <td className="px-4 py-3 text-sm">
                {q.approved ? <span className="text-green-600">Yes</span> : <span className="text-red-500">No</span>}
              </td>
              <td className="px-4 py-3 text-right text-sm space-x-2">
                {!q.approved && (
                  <button onClick={() => handleApprove(q.id)} className="text-blue-600 hover:underline">Approve</button>
                )}
                <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
