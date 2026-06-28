import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { createClient } from '@/lib/supabase/client';
import { apiFetch } from '@/lib/api';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { Role } from '@/lib/types';

const supabase = createClient();

interface UserProfile {
  firstName: string;
  lastName: string;
  role: Role;
  email: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      try {
        const res = await apiFetch('/api/me');
        if (res.ok) {
          const p = await res.json();
          if (p?.role) { setProfile({ ...p, email: user.email || '' }); setLoading(false); return; }
        }
      } catch {}
      navigate('/role-selection');
    }
    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) return null;
  const userName = `${profile.firstName} ${profile.lastName}`.trim() || 'User';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role={profile.role} dict={{}} locale="en" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userEmail={profile.email} userName={userName} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
