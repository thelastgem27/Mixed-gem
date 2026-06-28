import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { createClient } from '@/lib/supabase/client';
import { apiFetch } from '@/lib/api';

const supabase = createClient();

export default function IndexRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { navigate('/login'); return; }
      const res = await apiFetch('/api/me');
      if (res.status === 401 || res.status === 403) {
        navigate('/login');
        return;
      }
      if (!res.ok) {
        navigate('/role-selection');
        return;
      }
      const profile = await res.json();
      if (!profile || !profile.role) { navigate('/role-selection'); return; }
      if (!profile.onboardingDone) {
        if (profile.role === 'DIRECTOR') { navigate('/onboarding/director'); return; }
        navigate('/signup/role-information');
        return;
      }
      const roleMap: Record<string, string> = {
        DIRECTOR: '/director/dashboard',
        VICE_ACADEMIC: '/vice-academic/dashboard',
        VICE_ADMIN: '/vice-admin/dashboard',
        RECORD_OFFICE: '/record-office/students',
        HR: '/hr/dashboard',
        CASHIER: '/cashier/fees',
        TEACHER: '/teacher/attendance',
        PARENT: '/parent/dashboard',
        WOREDA_ADMIN: '/woreda/dashboard',
        ZONE_ADMIN: '/zone/dashboard',
        REGION_ADMIN: '/zone/dashboard',
        MINISTRY_ADMIN: '/ministry/dashboard',
        EXAM_OFFICER: '/exam/question-bank',
        STUDENT: '/exam/question-bank',
      };
      navigate(roleMap[profile.role] || '/login');
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );
}
