import { apiFetch } from '@/lib/api';

type FeeWithStudent = any;

export function FeeTable({ fees, onPaymentRecorded }: { fees: FeeWithStudent[]; onPaymentRecorded?: () => void }) {
  const handlePayment = async (feeId: string) => {
    const amt = prompt('Enter amount paid (ETB):');
    if (amt && !isNaN(+amt)) {
      try {
        const res = await apiFetch(`/api/fees/${feeId}/payment`, {
          method: 'POST',
          body: JSON.stringify({ amount: +amt }),
        });
        if (!res.ok) throw new Error('Failed to record payment');
        alert('Payment recorded!');
        onPaymentRecorded?.();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {fees.map((fee: any) => (
            <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {fee.student?.user?.firstName} {fee.student?.user?.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{fee.amount} ETB</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{fee.paidAmount} ETB</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{new Date(fee.dueDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  fee.status === 'PAID' ? 'bg-green-100 text-green-700' :
                  fee.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {fee.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {fee.status !== 'PAID' && (
                  <button onClick={() => handlePayment(fee.id)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    Record Payment
                  </button>
                )}
              </td>
            </tr>
          ))}
          {fees.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                No fee records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
