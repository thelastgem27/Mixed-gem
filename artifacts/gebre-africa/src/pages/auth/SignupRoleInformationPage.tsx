import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOnboardingStore } from '@/lib/store/onboarding';
import {
  directorOnboardingSchema, lookupSchema,
  DirectorOnboardingInput, LookupInput,
  SCHOOL_TYPE_LABELS, EDUCATIONAL_LEVEL_LABELS,
  EducationalLevel,
} from '@/lib/validations/auth';
import {
  getCountries, getRegionsByCountry, getZonesByRegion,
  getWoredasByZone, completeDirectorOnboarding, completeLookupOnboarding,
} from '@/lib/actions/onboarding';
import { AuthShell, AuthCard, FormField, Input, PrimaryButton } from '@/components/auth/AuthShell';

const SELECT_CLS =
  'w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 ' +
  'bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const DISABLED_SELECT_CLS = `${SELECT_CLS} opacity-50 cursor-not-allowed`;

export default function SignupRoleInformationPage() {
  const [, navigate] = useLocation();
  const { role, firstName, middleName, lastName, email, authUserId, reset } = useOnboardingStore();
  const [error, setError] = useState('');

  const isDirector = role === 'DIRECTOR';

  const directorForm = useForm<DirectorOnboardingInput>({
    resolver: zodResolver(directorOnboardingSchema),
    defaultValues: { levels: [] },
  });
  const lookupForm = useForm<LookupInput>({
    resolver: zodResolver(lookupSchema),
    defaultValues: { firstName, middleName, lastName, schoolCode: '', idCode: '' },
  });

  // Geo state
  const [countries, setCountries]   = useState<any[]>([]);
  const [regions, setRegions]       = useState<any[]>([]);
  const [zones, setZones]           = useState<any[]>([]);
  const [woredas, setWoredas]       = useState<any[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);

  const { watch: watchDir, setValue: setDirValue, control } = directorForm;
  const countryId = watchDir('countryId');
  const regionId  = watchDir('regionId');
  const zoneId    = watchDir('zoneId');
  const levels    = watchDir('levels') ?? [];

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!countryId) { setRegions([]); return; }
    setGeoLoading(true);
    setDirValue('regionId', '' as any);
    setDirValue('zoneId',   '' as any);
    setDirValue('woredaId', '' as any);
    setRegions([]); setZones([]); setWoredas([]);
    getRegionsByCountry(countryId)
      .then(setRegions)
      .finally(() => setGeoLoading(false));
  }, [countryId]);

  useEffect(() => {
    if (!regionId) { setZones([]); return; }
    setGeoLoading(true);
    setDirValue('zoneId',   '' as any);
    setDirValue('woredaId', '' as any);
    setZones([]); setWoredas([]);
    getZonesByRegion(regionId)
      .then(setZones)
      .finally(() => setGeoLoading(false));
  }, [regionId]);

  useEffect(() => {
    if (!zoneId) { setWoredas([]); return; }
    setGeoLoading(true);
    setDirValue('woredaId', '' as any);
    setWoredas([]);
    getWoredasByZone(zoneId)
      .then(setWoredas)
      .finally(() => setGeoLoading(false));
  }, [zoneId]);

  const toggleLevel = (level: EducationalLevel) => {
    const current = levels as EducationalLevel[];
    const next = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    setDirValue('levels', next, { shouldValidate: true });
  };

  const handleDirectorSubmit = async (data: DirectorOnboardingInput) => {
    setError('');
    const result = await completeDirectorOnboarding({ ...data, firstName, middleName, lastName, authUserId, email });
    if (result.error) { setError(result.error); return; }
    reset();
    navigate('/director/dashboard');
  };

  const handleLookupSubmit = async (data: LookupInput) => {
    setError('');
    const result = await completeLookupOnboarding({ ...data, role, authUserId, email });
    if (result.error) { setError(result.error); return; }
    reset();
    navigate(result.redirectTo ? `/${result.redirectTo}` : '/');
  };

  if (!role) return (
    <AuthShell currentStep={5}>
      <AuthCard>
        <p className="text-center text-gray-500">
          No role selected.{' '}
          <Link href="/signup/role-selection" className="text-blue-600">Go back</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );

  /* ── Director: School Registration Form ────────────────────────────────── */
  if (isDirector) return (
    <AuthShell currentStep={5}>
      <AuthCard>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Information</h1>
          <p className="text-sm text-gray-500 mt-1">Register your school on GEMSIS</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={directorForm.handleSubmit(handleDirectorSubmit)} className="flex flex-col gap-5">

          {/* School Name */}
          <FormField label="School Name" error={directorForm.formState.errors.schoolName?.message}>
            <Input placeholder="e.g. Addis Ababa Primary School" {...directorForm.register('schoolName')} />
          </FormField>

          {/* School Type */}
          <FormField label="School Type" error={directorForm.formState.errors.schoolType?.message}>
            <select {...directorForm.register('schoolType')} className={SELECT_CLS}>
              <option value="">Select type…</option>
              {(Object.entries(SCHOOL_TYPE_LABELS) as [string, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </FormField>

          {/* Educational Level */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Educational Level <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-col gap-2">
              {(Object.entries(EDUCATIONAL_LEVEL_LABELS) as [EducationalLevel, string][]).map(([val, label]) => {
                const checked = (levels as EducationalLevel[]).includes(val);
                return (
                  <label
                    key={val}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors
                      ${checked
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLevel(val)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
                  </label>
                );
              })}
            </div>
            {directorForm.formState.errors.levels && (
              <p className="mt-1 text-xs text-red-500">{directorForm.formState.errors.levels.message}</p>
            )}
          </div>

          {/* ── Geography ──────────────────────────────────────────────── */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              School Location
            </p>

            {/* Country */}
            <div className="flex flex-col gap-4">
              <FormField label="Country" error={directorForm.formState.errors.countryId?.message}>
                <select {...directorForm.register('countryId')} className={SELECT_CLS}>
                  <option value="">Select country…</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>

              {/* Region */}
              <FormField label="Region" error={directorForm.formState.errors.regionId?.message}>
                <select
                  {...directorForm.register('regionId')}
                  disabled={!countryId || geoLoading}
                  className={!countryId || geoLoading ? DISABLED_SELECT_CLS : SELECT_CLS}
                >
                  <option value="">{countryId ? 'Select region…' : 'Select country first'}</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </FormField>

              {/* Zone */}
              <FormField label="Zone" error={directorForm.formState.errors.zoneId?.message}>
                <select
                  {...directorForm.register('zoneId')}
                  disabled={!regionId || geoLoading}
                  className={!regionId || geoLoading ? DISABLED_SELECT_CLS : SELECT_CLS}
                >
                  <option value="">{regionId ? 'Select zone…' : 'Select region first'}</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </FormField>

              {/* Woreda */}
              <FormField label="Woreda" error={directorForm.formState.errors.woredaId?.message}>
                <select
                  {...directorForm.register('woredaId')}
                  disabled={!zoneId || geoLoading}
                  className={!zoneId || geoLoading ? DISABLED_SELECT_CLS : SELECT_CLS}
                >
                  <option value="">{zoneId ? 'Select woreda…' : 'Select zone first'}</option>
                  {woredas.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>

          {/* Address & Phone */}
          <FormField label="Address" error={directorForm.formState.errors.address?.message}>
            <Input placeholder="Full street address" {...directorForm.register('address')} />
          </FormField>

          <FormField label="Phone Number" error={directorForm.formState.errors.phone?.message}>
            <Input type="tel" placeholder="+251 911 000 000" {...directorForm.register('phone')} />
          </FormField>

          <PrimaryButton type="submit" loading={directorForm.formState.isSubmitting}>
            Create School & Finish
          </PrimaryButton>
        </form>
      </AuthCard>
    </AuthShell>
  );

  /* ── Other roles: look up by school/staff code + confirm name ──────────── */
  return (
    <AuthShell currentStep={5}>
      <AuthCard>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Confirm your name and enter your school codes</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>
        )}
        <form onSubmit={lookupForm.handleSubmit(handleLookupSubmit)} className="flex flex-col gap-4">

          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Name</p>
            <div className="flex flex-col gap-3">
              <FormField label="First Name" error={lookupForm.formState.errors.firstName?.message}>
                <Input placeholder="Abebe" {...lookupForm.register('firstName')} />
              </FormField>
              <FormField label="Middle Name (Father's Name)" error={lookupForm.formState.errors.middleName?.message}>
                <Input placeholder="Kebede" {...lookupForm.register('middleName')} />
              </FormField>
              <FormField label="Last Name" error={lookupForm.formState.errors.lastName?.message}>
                <Input placeholder="Girma" {...lookupForm.register('lastName')} />
              </FormField>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Verify Identity</p>
            <div className="flex flex-col gap-3">
              <FormField label="School Code" error={lookupForm.formState.errors.schoolCode?.message}>
                <Input placeholder="SCH-GEB-0001" {...lookupForm.register('schoolCode')} />
              </FormField>
              <FormField
                label={role === 'STUDENT' || role === 'PARENT' ? 'Student ID Code' : 'Staff ID Code'}
                error={lookupForm.formState.errors.idCode?.message}
              >
                <Input placeholder="Enter your ID code" {...lookupForm.register('idCode')} />
              </FormField>
            </div>
          </div>

          <PrimaryButton type="submit" loading={lookupForm.formState.isSubmitting}>
            Complete Registration
          </PrimaryButton>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
