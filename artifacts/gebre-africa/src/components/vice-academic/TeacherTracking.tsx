

const teachers = [
  {
    name: "Abebe Kebede",
    subject: "Mathematics",
    attendance: 96,
    portionCoverage: 84
  },
  {
    name: "Martha Alemu",
    subject: "Physics",
    attendance: 93,
    portionCoverage: 79
  },
  {
    name: "Samuel Bekele",
    subject: "Biology",
    attendance: 98,
    portionCoverage: 91
  }
];

export function TeacherTracking() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Teacher Tracking
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Teacher</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Subject</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Attendance</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {teachers.map((teacher) => (
              <tr key={teacher.name} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <td className="p-3 text-sm text-gray-900 dark:text-gray-100 font-medium">{teacher.name}</td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{teacher.subject}</td>
                <td className="p-3 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {teacher.attendance}%
                  </span>
                </td>
                <td className="p-3 text-sm">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {teacher.portionCoverage}%
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
