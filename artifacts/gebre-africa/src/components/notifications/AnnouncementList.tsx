// components/notifications/AnnouncementList.tsx
import { formatDistanceToNow } from 'date-fns';

export function AnnouncementList({ announcements }: { announcements: any[] }) {
  return (
    <div className="space-y-4">
      {announcements.map(a => (
        <div key={a.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{a.title}</h3>
            <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full uppercase">
              {a.targetRoles.join(', ')}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{a.body}</p>
          <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-medium">
            <span>By {a.author.firstName} {a.author.lastName}</span>
            <span>{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      ))}
      {announcements.length === 0 && (
        <div className="text-center py-10 text-gray-500 italic">No announcements yet.</div>
      )}
    </div>
  );
}
