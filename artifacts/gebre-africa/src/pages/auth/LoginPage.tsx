import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { AuthShell, AuthCard, FormField, Input, PasswordInput, PrimaryButton } from '@/components/auth/AuthShell';

const supabase = createClient();

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
    if (authError) { setError(authError.message); return; }
    navigate('/');
  };

  return (
    <AuthShell>
      <AuthCard>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to GEMSIS</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ethiopian School Management System</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Email address" error={errors.email?.message}>
            <Input type="email" placeholder="you@school.edu.et" {...register('email')} />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <PasswordInput placeholder="••••••••" {...register('password')} />
          </FormField>
          <PrimaryButton type="submit" loading={isSubmitting}>Sign in</PrimaryButton>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup/step-1" className="text-blue-600 font-medium hover:underline">Create one</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
