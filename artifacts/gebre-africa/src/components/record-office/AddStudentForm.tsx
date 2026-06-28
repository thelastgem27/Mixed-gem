import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { apiFetch } from '@/lib/api';

export function AddStudentForm() {
  const [, navigate] = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<any>();

  const onSubmit = async (data: any) => {
    setLoading(true); setError('');
    const res = await apiFetch('/api/students', { method: 'POST', body: JSON.stringify(data) });
    setLoading(false);
    if (!res.ok) { const e = await res.json(); setError(e.error || 'Failed'); return; }
    navigate('/record-office/students');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Student</h1>
      {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'firstName', label: 'First Name', required: true },
            { name: 'middleName', label: 'Middle Name', required: true },
            { name: 'lastName', label: 'Last Name', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'studentId', label: 'Student ID', required: true },
            { name: 'phone', label: 'Phone', required: false },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
              <input type={f.type || 'text'} {...register(f.name, { required: f.required ? `${f.label} is required` : false })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" />
              {errors[f.name] && <p className="text-xs text-red-500 mt-1">{String(errors[f.name]?.message || '')}</p>}
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Student'}
          </button>
          <button type="button" onClick={() => navigate('/record-office/students')} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
