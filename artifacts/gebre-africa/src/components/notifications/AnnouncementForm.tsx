import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { announcementSchema, type AnnouncementValues } from '@/lib/validations/announcement';
import { apiFetch } from '@/lib/api';

export function AnnouncementForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AnnouncementValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      targetRoles: ['TEACHER', 'STUDENT', 'PARENT'],
    }
  });

  const onSubmit = async (data: AnnouncementValues) => {
    try {
      const res = await apiFetch('/api/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to post announcement');
      reset();
      onSuccess?.();
      alert('Announcement posted!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input
          {...register('title')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="e.g. School Reopening Date"
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
        <textarea
          {...register('body')}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Write your announcement here..."
        />
        {errors.body && <p className="text-red-500 text-xs">{errors.body.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Audience</label>
        <div className="flex flex-wrap gap-4">
          {['TEACHER', 'STUDENT', 'PARENT'].map(role => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" value={role} {...register('targetRoles')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{role}</span>
            </label>
          ))}
        </div>
        {errors.targetRoles && <p className="text-red-500 text-xs">{errors.targetRoles.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isSubmitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </div>
    </form>
  );
}
