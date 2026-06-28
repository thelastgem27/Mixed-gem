

const payrollData = [
  {
    department: "Mathematics",
    payroll: "420,000 ETB"
  },
  {
    department: "Science",
    payroll: "510,000 ETB"
  },
  {
    department: "Languages",
    payroll: "320,000 ETB"
  },
  {
    department: "Administration",
    payroll: "280,000 ETB"
  }
];

export function PayrollOverview() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Payroll Overview
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Department</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Monthly Payroll</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {payrollData.map((item) => (
              <tr key={item.department} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{item.department}</td>
                <td className="p-3 text-sm text-emerald-600 dark:text-emerald-400 font-bold">{item.payroll}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
