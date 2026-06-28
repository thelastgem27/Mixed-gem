import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronLeft, Mail, AlertTriangle } from 'lucide-react';
import { verifyEmailOTP, resendOTP } from '@/lib/actions/onboarding';
import { useOnboardingStore } from '@/lib/store/onboarding';
import { AuthShell, AuthCard, PrimaryButton } from '@/components/auth/AuthShell';
import { OTPInput } from '@/components/auth/OTPInput';

const RESEND_COOLDOWN = 60;
const MAX_ATTEMPTS = 5;

export default function SignupVerifyPage() {
  const [location, navigate] = useLocation();
  const storeEmail = useOnboardingStore(s => s.email);
  const email = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('email') || storeEmail;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);

  const locked = attempts >= MAX_ATTEMPTS;

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleVerify = useCallback(async () => {
    if (code.length !== 8 || locked) return;
    setLoading(true); setError('');
    const result = await verifyEmailOTP(email, code);
    setLoading(false);
    if (result.error) { setAttempts(a => a + 1); setCode(''); setError(result.error!); return; }
    navigate('/signup/role-selection');
  }, [code, email, locked, navigate]);

  useEffect(() => { if (code.length === 8 && !locked) handleVerify(); }, [code]);

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false); setCountdown(RESEND_COOLDOWN);
    await resendOTP(email);
  };

  return (
    <AuthShell currentStep={3}>
      <Link href="/signup/step-2" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
      <AuthCard>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h1>
          <p className="text-sm text-gray-500 mt-2">We sent an 8-digit code to <strong className="text-gray-700 dark:text-gray-300">{email}</strong></p>
        </div>
        {locked && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" /> Too many attempts. Please request a new code.
          </div>
        )}
        {error && !locked && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600">{error}</div>}
        <OTPInput length={8} value={code} onChange={setCode} disabled={loading || locked} hasError={!!error} />
        <PrimaryButton className="mt-4" loading={loading} disabled={code.length !== 8 || locked} onClick={handleVerify}>
          Verify Email
        </PrimaryButton>
        <div className="mt-4 text-center text-sm text-gray-500">
          {canResend
            ? <button onClick={handleResend} className="text-blue-600 font-medium hover:underline">Resend code</button>
            : <span>Resend in <strong>{countdown}s</strong></span>}
        </div>
      </AuthCard>
    </AuthShell>
  );
}
