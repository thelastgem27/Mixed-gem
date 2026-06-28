

const exams = [
  {
    exam: "Mid Exam",
    completion: 92
  },
  {
    exam: "Final Exam",
    completion: 84
  },
  {
    exam: "Quiz Assessment",
    completion: 97
  },
  {
    exam: "Project Assessment",
    completion: 88
  }
];

export function ExamMonitoring() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Exam Monitoring
      </h2>

      <div className="space-y-6">
        {exams.map((exam) => (
          <div key={exam.exam}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{exam.exam}</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">{exam.completion}%</span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
              <div
                className="bg-green-600 dark:bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${exam.completion}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
