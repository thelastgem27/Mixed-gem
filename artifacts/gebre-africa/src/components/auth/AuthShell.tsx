

// components/auth/AuthShell.tsx
// Shared visual shell for all registration/onboarding pages.
// Renders the GEMSIS brand mark, step progress bar, language switcher, and dark-mode toggle.

import React from 'react';
import { Link } from 'wouter';
import { School, Moon, Sun, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  label: string;
  labelAm: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Your Name',     labelAm: 'ስምዎ' },
  { number: 2, label: 'Account',       labelAm: 'መለያ' },
  { number: 3, label: 'Verify',        labelAm: 'አረጋግጥ' },
  { number: 4, label: 'Role',          labelAm: 'ሚና' },
  { number: 5, label: 'Details',       labelAm: 'ዝርዝር' },
];

interface AuthShellProps {
  children: React.ReactNode;
  currentStep?: number; // 1–5; undefined = no step indicator (login)
  locale?: string;
  isDark?: boolean;
  onToggleDark?: () => void;
  onToggleLocale?: () => void;
}

export function AuthShell({
  children,
  currentStep,
  locale = 'en',
  isDark = false,
  onToggleDark,
  onToggleLocale,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col bg-gradient-to-br',
        isDark
          ? 'from-gray-950 via-gray-900 to-slate-900'
          : 'from-slate-50 via-blue-50/30 to-indigo-50/40'
      )}
    >
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4">
        {/* Brand */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shadow-md group-hover:bg-blue-700 transition-colors">
            <School className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase">
              GEMSIS
            </span>
            <span className="block text-[10px] text-gray-500 dark:text-gray-400 tracking-wide">
              School Management
            </span>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLocale}
            title="Switch language"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Languages className="h-3.5 w-3.5" />
            {locale === 'en' ? 'አማ' : 'EN'}
          </button>
          <button
            onClick={onToggleDark}
            title="Toggle dark mode"
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ── Step Progress Bar ── */}
      {currentStep !== undefined && (
        <div className="px-4 sm:px-8 pb-2">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((step, idx) => {
                const isCompleted = step.number < currentStep;
                const isActive = step.number === currentStep;
                const label = locale === 'am' ? step.labelAm : step.label;

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                          isCompleted
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : isActive
                            ? 'bg-white dark:bg-gray-800 border-blue-600 text-blue-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                        )}
                      >
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.number
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-[9px] sm:text-[10px] font-medium hidden sm:block',
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500'
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={cn(
                          'flex-1 h-0.5 mx-1 transition-all duration-500',
                          step.number < currentStep
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-4 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} GemSIS · Ethiopian School Management System
      </footer>
    </div>
  );
}

// ── Card wrapper used inside pages ───────────────────────────────────────────
export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-blue-950/5 dark:shadow-black/40',
        'border border-gray-100 dark:border-gray-800',
        'p-6 sm:p-8',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── Reusable form field ───────────────────────────────────────────────────────
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-lg border text-sm',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
        'border-gray-300 dark:border-gray-600',
        'placeholder-gray-400 dark:placeholder-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors',
        props.className
      )}
    />
  );
}

// ── Password Input with show/hide ────────────────────────────────────────────
export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className="pr-10" />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-medium"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}

// ── Primary Button ────────────────────────────────────────────────────────────
export function PrimaryButton({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        'w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200',
        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-md hover:shadow-lg',
        props.className
      )}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
