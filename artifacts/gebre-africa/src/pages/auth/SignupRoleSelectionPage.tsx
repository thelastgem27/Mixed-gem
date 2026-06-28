import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { useOnboardingStore } from '@/lib/store/onboarding';
import type { Role } from '@/lib/types';
import { AuthShell, AuthCard, PrimaryButton } from '@/components/auth/AuthShell';
import { cn } from '@/lib/utils';

const ROLE_OPTIONS: { role: Role; label: string; description: string; emoji: string; group: string }[] = [
  { role: 'DIRECTOR', label: 'Director', description: 'Creates and manages the school', emoji: '🏫', group: 'school' },
  { role: 'VICE_ACADEMIC', label: 'Vice Director (Academic)', description: 'Oversees academic programs', emoji: '📚', group: 'school' },
  { role: 'VICE_ADMIN', label: 'Vice Director (Admin)', description: 'Manages school administration', emoji: '🗂️', group: 'school' },
  { role: 'RECORD_OFFICE', label: 'Record Office', description: 'Manages student records', emoji: '🗃️', group: 'school' },
  { role: 'HR', label: 'Human Resources', description: 'Staff management and payroll', emoji: '👥', group: 'school' },
  { role: 'CASHIER', label: 'Cashier', description: 'Handles fee collection', emoji: '💳', group: 'school' },
  { role: 'TEACHER', label: 'Teacher', description: 'Marks attendance and grades', emoji: '👩‍🏫', group: 'school' },
  { role: 'PARENT', label: 'Parent / Guardian', description: 'Monitors child progress', emoji: '👨‍👩‍👦', group: 'learner' },
  { role: 'STUDENT', label: 'Student', description: 'Access exams and results', emoji: '🎓', group: 'learner' },
  { role: 'WOREDA_ADMIN', label: 'Woreda Admin', description: 'Supervises woreda schools', emoji: '🏛️', group: 'government' },
  { role: 'ZONE_ADMIN', label: 'Zone Admin', description: 'Oversees zone statistics', emoji: '🗺️', group: 'government' },
  { role: 'REGION_ADMIN', label: 'Region Admin', description: 'Monitors regional performance', emoji: '🌍', group: 'government' },
  { role: 'MINISTRY_ADMIN', label: 'Ministry Admin', description: 'National-level oversight', emoji: '🏟️', group: 'government' },
  { role: 'EXAM_OFFICER', label: 'Exam Officer', description: 'Creates and manages exams', emoji: '📝', group: 'school' },
];

const GROUP_LABELS: Record<string, string> = { school: 'School Staff', learner: 'Students & Parents', government: 'Government Officials' };

export default function SignupRoleSelectionPage() {
  const [, navigate] = useLocation();
  const setRole = useOnboardingStore(s => s.setRole);
  const [selected, setSelected] = useState<Role | null>(null);

  const groups = ['school', 'learner', 'government'];

  const handleContinue = () => {
    if (!selected) return;
    setRole(selected);
    navigate('/signup/role-information');
  };

  return (
    <AuthShell currentStep={4}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Choose your role</h1>
        <p className="text-sm text-gray-500 mt-1">Select how you will use GEMSIS</p>
      </div>
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{GROUP_LABELS[group]}</p>
            <div className="grid grid-cols-1 gap-2">
              {ROLE_OPTIONS.filter(r => r.group === group).map(opt => (
                <button
                  key={opt.role}
                  onClick={() => setSelected(opt.role)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                    selected === opt.role
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</p>
                    <p className="text-xs text-gray-500 truncate">{opt.description}</p>
                  </div>
                  {selected === opt.role && <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <PrimaryButton disabled={!selected} onClick={handleContinue}>
          Continue <ChevronRight className="inline h-4 w-4 ml-1" />
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}
