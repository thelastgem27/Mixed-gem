import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiGet, apiPost, apiFetch } from '@/lib/api';
import { Plus, Trash2, X, UserCheck, UserX } from 'lucide-react';

const STAFF_ROLES = [
  { value: 'VICE_ACADEMIC', label: 'Vice Principal (Academic)' },
  { value: 'VICE_ADMIN', label: 'Vice Principal (Admin)' },
  { value: 'RECORD_OFFICE', label: 'Record Office' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'CASHIER', label: 'Cashier' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'EXAM_OFFICER', label: 'Exam Officer' },
];

const ROLE_BADGE: Record<string, string> = {
  DIRECTOR: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  VICE_ACADEMIC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  VICE_ADMIN: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  RECORD_OFFICE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  HR: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  CASHIER: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  TEACHER: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  EXAM_OFFICER: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

interface StaffMember {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  staffCode?: string;
  qualification?: string;
  subjects?: string[];
  createdAt: string;
}

const emptyForm = {
  firstName: '', middleName: '', lastName: '',
  email: '', phone: '', role: 'TEACHER',
  qualification: '', subjects: '',
};

export default function DirectorStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    apiGet<StaffMember[]>('/api/director/staff')
      .then(d => { setStaff(d); setLoading(false); })
      .catch(() => { setStaff([]); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      };
      await apiPost('/api/director/staff', payload);
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to add staff');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Deactivate this staff member?')) return;
    setDeletingId(userId);
    try {
      await apiFetch(`/api/director/staff/${userId}`, { method: 'DELETE' });
      load();
    } catch {}
    setDeletingId(null);
  };

  const field = (key: keyof typeof emptyForm, label: string, opts?: { type?: string; required?: boolean; as?: 'select' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}{opts?.required && ' *'}</label>
      {opts?.as === 'select' ? (
        <select
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          {STAFF_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      ) : (
        <input
          type={opts?.type || 'text'}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          required={opts?.required}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        />
      )}
    </div>
  );

  const active = staff.filter(s => s.isActive);
  const inactive = staff.filter(s => !s.isActive);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{active.length} active staff members</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="h-4 w-4" /> Add Staff
          </button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[0,1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />)}
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No staff added yet. Click "Add Staff" to get started.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Staff ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {[...active, ...inactive].map(member => (
                  <tr key={member.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${!member.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {member.firstName} {member.middleName ? member.middleName + ' ' : ''}{member.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[member.role] || 'bg-gray-100 text-gray-600'}`}>
                        {STAFF_ROLES.find(r => r.value === member.role)?.label || member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {member.staffCode || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{member.email}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell">{member.phone || '—'}</td>
                    <td className="px-4 py-3">
                      {member.isActive
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600"><UserCheck className="h-3.5 w-3.5" /> Active</span>
                        : <span className="flex items-center gap-1 text-xs text-gray-400"><UserX className="h-3.5 w-3.5" /> Inactive</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      {member.role !== 'DIRECTOR' && member.isActive && (
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={deletingId === member.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Staff Member</h2>
              <button onClick={() => { setShowModal(false); setError(''); setForm(emptyForm); }} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}
              <div className="grid grid-cols-2 gap-3">
                {field('firstName', 'First Name', { required: true })}
                {field('middleName', 'Middle Name')}
                {field('lastName', 'Last Name', { required: true })}
                {field('email', 'Email', { type: 'email', required: true })}
                {field('phone', 'Phone')}
                {field('role', 'Role', { as: 'select', required: true })}
              </div>
              {form.role === 'TEACHER' && (
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teacher Details</p>
                  {field('qualification', 'Qualification')}
                  {field('subjects', 'Subjects (comma-separated)')}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
                  {saving ? 'Adding…' : 'Add Staff Member'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setError(''); setForm(emptyForm); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
