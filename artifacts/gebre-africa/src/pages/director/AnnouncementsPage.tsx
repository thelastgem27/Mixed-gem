import DashboardLayout from '@/components/layout/DashboardLayout';
import { AnnouncementsClient } from '@/components/announcements/AnnouncementsClient';

export default function DirectorAnnouncementsPage() {
  return (
    <DashboardLayout>
      <AnnouncementsClient />
    </DashboardLayout>
  );
}
