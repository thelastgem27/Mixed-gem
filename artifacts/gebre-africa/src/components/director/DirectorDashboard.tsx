import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { DashboardKPICards } from '@/components/analytics/DashboardKPICards';
import { DashboardCharts } from '@/components/analytics/DashboardCharts';
import { apiGet } from '@/lib/api';
import { Users, School, Megaphone, BarChart3, ChevronRight } from 'lucide-react';

interface Stats {
  students: number;
  teachers: number;
  staff: number;
  attendance: number;
  revenue: number;
}

interface SchoolInfo {
  name: string;
  code: string;
  type: string | null;
  educationalLevels: string[];
  regionName: string | null;
  zoneName: string | null;
  woredaName: string | null;
}

const QUICK_ACTIONS = [
  { href: '/director/staff', icon: Users, label: 'Manage Staff', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { href: '/director/school', icon: School, label: 'School Info', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { href: '/director/announcements', icon: Megaphone, label: 'Announcements', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { href: '/director/reports', icon: BarChart3, label: 'Reports', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
];

export function DirectorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<Stats>('/api/director/stats').catch(() => ({ students: 0, teachers: 0, staff: 0, attendance: 0, revenue: 0 })),
      apiGet<SchoolInfo>('/api/director/school').catch(() => null),
    ]).then(([s, sc]) => {
      setStats(s);
      setSchool(sc);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {school ? school.name : 'Director Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {school
            ? [school.woredaName, school.zoneName, school.regionName].filter(Boolean).join(' · ') || 'School overview'
            : 'School overview and key metrics'}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />)}
        </div>
      ) : stats ? (
        <DashboardKPICards data={stats} />
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2.5 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`p-2.5 rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {label} <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {!loading && <DashboardCharts />}

      {school && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">School Details</h2>
            <Link href="/director/school" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Code</p>
              <p className="font-mono text-gray-700 dark:text-gray-300">{school.code}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Type</p>
              <p className="text-gray-700 dark:text-gray-300 capitalize">{school.type?.toLowerCase().replace(/_/g, ' ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Levels</p>
              <p className="text-gray-700 dark:text-gray-300">{school.educationalLevels.map(l => l.charAt(0) + l.slice(1).toLowerCase()).join(', ') || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
