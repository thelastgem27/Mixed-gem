

import {
  School,
  GraduationCap,
  Users,
  Building2
} from "lucide-react";

const cards = [
  {
    title: "Schools",
    value: "1,245",
    icon: School
  },
  {
    title: "Students",
    value: "482,000",
    icon: GraduationCap
  },
  {
    title: "Teachers",
    value: "21,300",
    icon: Users
  },
  {
    title: "Zones",
    value: "18",
    icon: Building2
  }
];

export function RegionKPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
                  {card.value}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
