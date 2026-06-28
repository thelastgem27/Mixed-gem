import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, Link } from 'wouter';
import { step1Schema, Step1Input } from '@/lib/validations/auth';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { AuthShell, AuthCard, FormField, Input, PrimaryButton } from '@/components/auth/AuthShell';

export default function SignupStep1Page() {
  const [, navigate] = useLocation();
  const { firstName, middleName, lastName, setNameInfo } = useOnboardingStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: { firstName, middleName, lastName },
  });

  const onSubmit = (data: Step1Input) => {
    setNameInfo(data);
    navigate('/signup/step-2');
  };

  return (
    <AuthShell currentStep={1}>
      <AuthCard>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Name</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter your full legal name</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="First Name" error={errors.firstName?.message}>
            <Input placeholder="Abebe" {...register('firstName')} />
          </FormField>
          <FormField label="Middle Name (Father's Name)" error={errors.middleName?.message}>
            <Input placeholder="Kebede" {...register('middleName')} />
          </FormField>
          <FormField label="Last Name" error={errors.lastName?.message}>
            <Input placeholder="Girma" {...register('lastName')} />
          </FormField>
          <PrimaryButton type="submit" loading={isSubmitting}>Continue</PrimaryButton>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
