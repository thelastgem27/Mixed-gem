

const cashierData = [
  {
    cashier: "Cashier A",
    collected: "2,450,000 ETB",
    receipts: 1245,
    pending: "145,000 ETB"
  },
  {
    cashier: "Cashier B",
    collected: "1,870,000 ETB",
    receipts: 980,
    pending: "88,000 ETB"
  }
];

export function CashierMonitoring() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Cashier Monitoring
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Cashier</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Collected</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Receipts</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Pending</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {cashierData.map((cashier) => (
              <tr key={cashier.cashier} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{cashier.cashier}</td>
                <td className="p-3 text-sm text-emerald-600 dark:text-emerald-400 font-bold">{cashier.collected}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{cashier.receipts}</td>
                <td className="p-3 text-sm text-amber-600 dark:text-amber-400">{cashier.pending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
