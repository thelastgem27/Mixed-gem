

const leaveRequests = [
  {
    employee: "Abebe Kebede",
    type: "Annual Leave",
    days: 15,
    status: "Approved"
  },
  {
    employee: "Martha Alemu",
    type: "Sick Leave",
    days: 5,
    status: "Pending"
  },
  {
    employee: "Samuel Bekele",
    type: "Emergency Leave",
    days: 3,
    status: "Approved"
  }
];

export function LeaveManagement() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Leave Tracking
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Employee</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Leave Type</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Days</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {leaveRequests.map((leave) => (
              <tr key={leave.employee} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{leave.employee}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{leave.type}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{leave.days}</td>
                <td className="p-3 text-sm">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    leave.status === 'Approved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
