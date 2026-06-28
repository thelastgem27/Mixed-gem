import { useLocation } from 'wouter';
import { createClient } from '@/lib/supabase/client';
import { Bell, LogOut } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/context';

interface HeaderProps {
  userEmail: string;
  userName: string;
}

export function Header({ userEmail, userName }: HeaderProps) {
  const [, navigate] = useLocation();
  const supabase = createClient();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">GEMSIS</h2>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            title={t('common.logout')}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
