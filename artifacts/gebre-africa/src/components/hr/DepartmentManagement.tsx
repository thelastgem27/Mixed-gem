

const departments = [
  {
    name: "Mathematics",
    employees: 18,
    head: "Abebe Kebede"
  },
  {
    name: "Science",
    employees: 24,
    head: "Martha Alemu"
  },
  {
    name: "Languages",
    employees: 15,
    head: "Samuel Bekele"
  },
  {
    name: "Administration",
    employees: 12,
    head: "Tigist Assefa"
  }
];

export function DepartmentManagement() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Department Management
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Department</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Employees</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Department Head</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {departments.map((department) => (
              <tr key={department.name} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{department.name}</td>
                <td className="p-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {department.employees} Staff
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{department.head}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
