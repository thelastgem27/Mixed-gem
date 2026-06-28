import { useEffect, useState } from 'react';
import { AnnouncementList } from '@/components/notifications/AnnouncementList';
import { AnnouncementForm } from '@/components/notifications/AnnouncementForm';
import { apiGet } from '@/lib/api';

export function AnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = () => {
    apiGet('/api/announcements')
      .then(d => { setAnnouncements(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Announcements</h1>
      <AnnouncementForm onSuccess={fetchAnnouncements} />
      {loading ? (
        <div className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
      ) : (
        <AnnouncementList announcements={announcements} />
      )}
    </div>
  );
}
