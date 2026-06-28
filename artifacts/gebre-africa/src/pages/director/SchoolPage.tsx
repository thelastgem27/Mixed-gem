import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiGet, apiFetch } from '@/lib/api';
import { School, MapPin, Phone, Hash, BookOpen, Building2, Pencil, Check, X } from 'lucide-react';

interface SchoolData {
  id: string;
  name: string;
  code: string;
  type: string | null;
  educationalLevels: string[];
  address: string | null;
  phone: string | null;
  regionName: string | null;
  zoneName: string | null;
  woredaName: string | null;
  createdAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  GOVERNMENT: 'Government',
  PRIVATE: 'Private',
  COMMUNITY_FAITH_BASED: 'Community / Faith-Based',
};

const LEVEL_LABEL: Record<string, string> = {
  KINDERGARTEN: 'Kindergarten',
  PRIMARY: 'Primary',
  SECONDARY: 'Secondary',
};

export default function DirectorSchoolPage() {
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    apiGet<SchoolData>('/api/director/school')
      .then(d => { setSchool(d); setForm({ name: d.name, address: d.address || '', phone: d.phone || '' }); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const res = await apiFetch('/api/director/school', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to save'); }
      const updated = await res.json();
      setSchool(s => s ? { ...s, ...updated } : s);
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          {[0,1,2].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />)}
        </div>
      </DashboardLayout>
    );
  }

  if (!school) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 text-gray-400">
          <School className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>School information not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">School Information</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your school's profile and details</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(false); setError(''); setForm({ name: school.name, address: school.address || '', phone: school.phone || '' }); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
          <div className="p-5 flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <School className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">School Name</p>
              {editing ? (
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-semibold"
                />
              ) : (
                <p className="font-semibold text-gray-900 dark:text-gray-100">{school.name}</p>
              )}
            </div>
          </div>

          <div className="p-5 flex items-start gap-4">
            <div className="p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Hash className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">School Code</p>
              <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{school.code}</p>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">School Type</p>
              <p className="text-gray-700 dark:text-gray-300">{school.type ? TYPE_LABEL[school.type] || school.type : '—'}</p>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Educational Levels</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {school.educationalLevels.length > 0
                  ? school.educationalLevels.map(l => (
                      <span key={l} className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
                        {LEVEL_LABEL[l] || l}
                      </span>
                    ))
                  : <span className="text-gray-400 text-sm">—</span>
                }
              </div>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <MapPin className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Location</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {[school.woredaName, school.zoneName, school.regionName].filter(Boolean).join(', ') || '—'}
              </p>
              {editing ? (
                <input
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Detailed address"
                  className="mt-2 w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
              ) : school.address ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{school.address}</p>
              ) : null}
            </div>
          </div>

          <div className="p-5 flex items-start gap-4">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
              <Phone className="h-5 w-5 text-sky-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-1">Phone</p>
              {editing ? (
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+251..."
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{school.phone || '—'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            School registered on {new Date(school.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
