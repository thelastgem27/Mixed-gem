

const subjects = [
  {
    subject: "Mathematics",
    completed: 84
  },
  {
    subject: "Physics",
    completed: 79
  },
  {
    subject: "Biology",
    completed: 91
  },
  {
    subject: "Chemistry",
    completed: 73
  }
];

export function SubjectPortionTracker() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Subject Portion Tracking
      </h2>

      <div className="space-y-6">
        {subjects.map(item => (
          <div key={item.subject}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.subject}</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{item.completed}%</span>
            </div>

            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                style={{
                  width: `${item.completed}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
