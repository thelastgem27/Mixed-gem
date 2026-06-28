import { createClient } from '@/lib/supabase/client';
import { apiFetch } from '@/lib/api';

const supabase = createClient();

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  middleName: string,
  lastName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, middleName, lastName, onboarding_done: false },
    },
  });
  if (error) return { error: error.message };
  return { success: true, authUserId: data.user?.id };
}

export async function verifyEmailOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
  if (error) return { error: error.message };
  // Supabase returns a session on successful OTP verification.
  // The client stores it automatically; we just confirm it was provided.
  if (!data.session) {
    // Some Supabase configurations require a password-based login after email confirm.
    // Try setting the session explicitly if it was returned.
    return { success: true, requiresLogin: true };
  }
  return { success: true };
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function resendOTP(email: string) {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) return { error: error.message };
  return { success: true };
}

export async function getCountries() {
  const res = await fetch('/api/geo/countries');
  if (!res.ok) return [];
  return res.json();
}

export async function getRegionsByCountry(countryId: string) {
  const res = await fetch(`/api/geo/regions?countryId=${countryId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getZonesByRegion(regionId: string) {
  const res = await fetch(`/api/geo/zones?regionId=${regionId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getWoredasByZone(zoneId: string) {
  const res = await fetch(`/api/geo/woredas?zoneId=${zoneId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function lookupEntity(schoolCode: string, idCode: string, role: string) {
  const res = await apiFetch('/api/lookup', {
    method: 'POST',
    body: JSON.stringify({ schoolCode, idCode, role }),
  });
  return res.json();
}

export async function completeDirectorOnboarding(data: any) {
  const res = await apiFetch('/api/onboarding/director', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    return { error: body.error ?? 'Onboarding failed' };
  }
  return res.json();
}

export async function completeLookupOnboarding(data: any) {
  const res = await apiFetch('/api/onboarding/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    return { error: body.error ?? 'Onboarding failed' };
  }
  return res.json();
}
