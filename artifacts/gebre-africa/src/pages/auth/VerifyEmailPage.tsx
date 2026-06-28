import { useLocation, Link } from 'wouter';
import { Mail } from 'lucide-react';
import { AuthShell, AuthCard } from '@/components/auth/AuthShell';

export default function VerifyEmailPage() {
  const email = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('email') || '';
  return (
    <AuthShell>
      <AuthCard>
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h1>
          {email && <p className="text-sm text-gray-500 mt-2">We sent a verification link to <strong>{email}</strong></p>}
          <p className="text-sm text-gray-500 mt-4">Check your inbox and click the link to confirm your account.</p>
          <Link href="/login" className="mt-6 text-blue-600 font-medium hover:underline text-sm">Back to login</Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}
