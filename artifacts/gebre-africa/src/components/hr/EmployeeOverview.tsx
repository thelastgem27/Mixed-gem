

const employees = [
  {
    name: "Abebe Kebede",
    department: "Mathematics",
    role: "Teacher",
    status: "Active"
  },
  {
    name: "Martha Alemu",
    department: "Administration",
    role: "Officer",
    status: "Active"
  },
  {
    name: "Samuel Bekele",
    department: "Science",
    role: "Teacher",
    status: "On Leave"
  }
];

export function EmployeeOverview() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Employee Overview
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Employee</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Department</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Role</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {employees.map(employee => (
              <tr key={employee.name} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{employee.name}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{employee.department}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{employee.role}</td>
                <td className="p-3 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    {employee.status}
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
