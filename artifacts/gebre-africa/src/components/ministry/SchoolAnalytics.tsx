

const schools = [
  {
    label: "Government Schools",
    value: "10,320"
  },
  {
    label: "Private Schools",
    value: "2,130"
  },
  {
    label: "New Schools",
    value: "220"
  },
  {
    label: "Inactive Schools",
    value: "31"
  }
];

export function SchoolAnalytics() {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        School Analytics
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        {schools.map(item => (
          <div
            key={item.label}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <p className="text-gray-500 dark:text-gray-400">{item.label}</p>

            <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
