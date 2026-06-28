import { useForm } from 'react-hook-form';
import { useLocation, Link } from 'wouter';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export function TeacherForm() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<any>();

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const payload = { ...data, subjects: data.subjects?.split(',').map((s: string) => s.trim()).filter(Boolean) };
      const res = await apiFetch('/api/teachers', { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed'); }
      navigate('/record-office/teachers');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/record-office/teachers" className="text-sm text-blue-600 hover:underline">
            &larr; Back to List
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add New Teacher</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Qualification</label>
            <input 
              {...register('qualification')} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              placeholder="e.g. B.Ed in Mathematics"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subjects (comma separated)</label>
            <input
              {...register('subjects')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g. Math, Physics"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-medium"
            >
              {isSubmitting ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>
        </form>
      </>
  );
}
