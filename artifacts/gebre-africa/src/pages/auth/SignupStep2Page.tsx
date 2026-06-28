import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { step2Schema, Step2Input } from '@/lib/validations/auth';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { signUpWithEmail } from '@/lib/actions/onboarding';
import { AuthShell, AuthCard, FormField, Input, PasswordInput, PrimaryButton } from '@/components/auth/AuthShell';

const RULES = [
  { test: (p: string) => p.length >= 8,           label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p),         label: 'One uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p),         label: 'One lowercase letter' },
  { test: (p: string) => /[0-9]/.test(p),         label: 'One number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character' },
];

export default function SignupStep2Page() {
  const [, navigate] = useLocation();
  const { firstName, middleName, lastName, setAccountInfo } = useOnboardingStore();
  const [serverError, setServerError] = useState('');
  const [password, setPassword] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
  });

  const onSubmit = async (data: Step2Input) => {
    setServerError('');
    const result = await signUpWithEmail(data.email, data.password, firstName, middleName, lastName);
    if (result.error) { setServerError(result.error); return; }
    setAccountInfo({ email: data.email, authUserId: result.authUserId! });
    navigate(`/signup/verify?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <AuthShell currentStep={2}>
      <Link href="/signup/step-1" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
      <AuthCard>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set up your login credentials</p>
        </div>
        {serverError && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Email Address" error={errors.email?.message}>
            <Input type="email" placeholder="you@school.edu.et" {...register('email')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <PasswordInput placeholder="••••••••" {...register('password', { onChange: e => setPassword(e.target.value) })} />
          </FormField>
          {password && (
            <div className="grid grid-cols-2 gap-1.5">
              {RULES.map(r => (
                <div key={r.label} className="flex items-center gap-1.5 text-xs">
                  {r.test(password)
                    ? <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    : <XCircle className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />}
                  <span className={r.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>{r.label}</span>
                </div>
              ))}
            </div>
          )}
          <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
            <PasswordInput placeholder="••••••••" {...register('confirmPassword')} />
          </FormField>
          <PrimaryButton type="submit" loading={isSubmitting}>Continue</PrimaryButton>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
