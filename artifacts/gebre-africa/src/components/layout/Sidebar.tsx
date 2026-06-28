
import { useLocation, Link } from 'wouter';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import {
  LayoutDashboard, School, Users, GraduationCap, CalendarCheck,
  BarChart3, Settings, Megaphone, BookOpen, CreditCard, ClipboardList,
  Map, Landmark, Building2, CalendarRange
} from 'lucide-react';

interface SidebarProps {
  role: string;
  dict: any;
  locale: string;
}

export function Sidebar({ role, dict, locale }: SidebarProps) {
  const [pathname] = useLocation();
  const { t } = useLanguage();
  const navigation: Record<string, { href: string; label: string; icon: React.ElementType }[]> = {
    DIRECTOR: [
      { href: '/director/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/director/school', label: t('navigation.sidebar.school'), icon: School },
      { href: '/director/staff', label: t('navigation.sidebar.staff'), icon: Users },
      { href: '/director/announcements', label: t('navigation.sidebar.announcements'), icon: Megaphone },
      { href: '/director/attendance', label: t('navigation.sidebar.attendance'), icon: CalendarCheck },
      { href: '/director/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
      { href: '/director/settings', label: t('navigation.sidebar.settings'), icon: Settings },
    ],
    VICE_ACADEMIC: [
      { href: '/vice-academic/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/vice-academic/academic', label: t('navigation.sidebar.academic'), icon: BookOpen },
      { href: '/vice-academic/teachers', label: t('navigation.sidebar.teachers'), icon: Users },
      { href: '/vice-academic/scores', label: t('navigation.sidebar.scores'), icon: ClipboardList },
      { href: '/vice-academic/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    VICE_ADMIN: [
      { href: '/vice-admin/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/vice-admin/administration', label: t('navigation.sidebar.administration'), icon: Landmark },
      { href: '/vice-admin/staff', label: t('navigation.sidebar.staff'), icon: Users },
      { href: '/vice-admin/finance', label: t('navigation.sidebar.fees'), icon: CreditCard },
      { href: '/vice-admin/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    HR: [
      { href: '/hr/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/hr/staff', label: t('navigation.sidebar.staff'), icon: Users },
      { href: '/hr/departments', label: t('navigation.sidebar.departments'), icon: Building2 },
      { href: '/hr/attendance', label: t('navigation.sidebar.attendance'), icon: CalendarCheck },
      { href: '/hr/leave', label: t('navigation.sidebar.leave'), icon: CalendarRange },
      { href: '/hr/payroll', label: t('navigation.sidebar.payroll'), icon: CreditCard },
      { href: '/hr/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    RECORD_OFFICE: [
      { href: '/record-office/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/record-office/students', label: t('navigation.sidebar.students'), icon: GraduationCap },
      { href: '/record-office/teachers', label: t('navigation.sidebar.teachers'), icon: Users },
      { href: '/record-office/scores', label: t('navigation.sidebar.scores'), icon: BookOpen },
      { href: '/record-office/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    TEACHER: [
      { href: '/teacher/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/teacher/my-classes', label: t('navigation.sidebar.myClasses'), icon: Building2 },
      { href: '/teacher/attendance', label: t('navigation.sidebar.attendance'), icon: CalendarCheck },
      { href: '/teacher/scores', label: t('navigation.sidebar.scores'), icon: ClipboardList },
    ],
    CASHIER: [
      { href: '/cashier/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/cashier/fees', label: t('navigation.sidebar.fees'), icon: CreditCard },
      { href: '/cashier/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    WOREDA_ADMIN: [
      { href: '/woreda/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/woreda/schools', label: t('navigation.sidebar.school'), icon: School },
      { href: '/woreda/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    ZONE_ADMIN: [
      { href: '/zone/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/zone/woredas', label: t('navigation.sidebar.woredas'), icon: Map },
      { href: '/zone/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
    REGION_ADMIN: [
      { href: '/region/dashboard', label: t('navigation.sidebar.dashboard'), icon: LayoutDashboard },
      { href: '/region/zones', label: t('navigation.sidebar.zones'), icon: Landmark },
      { href: '/region/reports', label: t('navigation.sidebar.reports'), icon: BarChart3 },
    ],
  };

  const links = navigation[role] || [];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <School className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">GEMSIS</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
