import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/lib/i18n/context';
import { apiFetch, apiGet } from '@/lib/api';

const bulkScoreSchema = z.object({
  sectionId: z.string().min(1),
  subject: z.string().min(1),
  examType: z.string().min(1),
  academicYear: z.string().min(1),
  term: z.string().min(1),
  scores: z.array(z.object({
    studentId: z.string(),
    score: z.number().min(0).max(100),
  })),
});

type BulkScoreForm = z.infer<typeof bulkScoreSchema>;

export default function ScoresClient({ sections }: { sections: any[] }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<BulkScoreForm>({
    resolver: zodResolver(bulkScoreSchema),
    defaultValues: { scores: [] },
  });

  const { fields, replace } = useFieldArray({ control, name: 'scores' });
  const selectedSectionId = watch('sectionId');

  useEffect(() => {
    if (selectedSectionId) {
      const loadStudents = async () => {
        setStudentsLoading(true);
        try {
          const data = await apiGet(`/api/sections/${selectedSectionId}/students`);
          setStudents(data);
          replace(data.map((s: any) => ({ studentId: s.id, score: 0 })));
        } catch (e: any) {
          console.error(e.message);
        } finally {
          setStudentsLoading(false);
        }
      };
      loadStudents();
    }
  }, [selectedSectionId, replace]);

  const onSubmit = async (data: BulkScoreForm) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/scores/bulk', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save scores');
      alert(t('common.success'));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('academic.enterScores')}</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.section')}</label>
            <select {...register('sectionId')} className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="">{t('academic.selectSection')}</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.grade.name} - {t('academic.section')} {s.name}</option>
              ))}
            </select>
            {errors.sectionId && <p className="text-red-500 text-xs">{errors.sectionId.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.subject')}</label>
            <input {...register('subject')} placeholder={t('academic.subject')} className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.examType')}</label>
            <select {...register('examType')} className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="">{t('academic.examType')}</option>
              <option value="test">{t('academic.test')}</option>
              <option value="midterm">{t('academic.midterm')}</option>
              <option value="final">{t('academic.final')}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.academicYear')}</label>
            <input {...register('academicYear')} placeholder="2025/26" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase">{t('academic.term')}</label>
            <input {...register('term')} placeholder="Term 1" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>

        {selectedSectionId && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {studentsLoading ? (
              <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('academic.student')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('academic.score')} (0-100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {fields.map((field, index) => (
                    <tr key={field.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {students[index]?.user.firstName} {students[index]?.user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          {...register(`scores.${index}.score`, { valueAsNumber: true })}
                          className="w-24 px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          min="0" max="100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="p-4 flex justify-end">
              <button disabled={loading} type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium">
                {loading ? t('common.loading') : t('academic.saveAllScores')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
