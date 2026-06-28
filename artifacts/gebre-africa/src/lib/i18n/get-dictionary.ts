import type { Locale } from '@/lib/types';

export type { Locale };
export const locales: Locale[] = ['en', 'am'];

const modules: Record<string, Record<Locale, () => Promise<any>>> = {
  common: {
    en: () => import('@/localization/en/common.json').then((m) => m.default),
    am: () => import('@/localization/am/common.json').then((m) => m.default),
  },
  auth: {
    en: () => import('@/localization/en/auth.json').then((m) => m.default),
    am: () => import('@/localization/am/auth.json').then((m) => m.default),
  },
  dashboard: {
    en: () => import('@/localization/en/dashboard.json').then((m) => m.default),
    am: () => import('@/localization/am/dashboard.json').then((m) => m.default),
  },
  student: {
    en: () => import('@/localization/en/student.json').then((m) => m.default),
    am: () => import('@/localization/am/student.json').then((m) => m.default),
  },
  navigation: {
    en: () => import('@/localization/en/navigation.json').then((m) => m.default),
    am: () => import('@/localization/am/navigation.json').then((m) => m.default),
  },
  academic: {
    en: () => import('@/localization/en/academic.json').then((m) => m.default),
    am: () => import('@/localization/am/academic.json').then((m) => m.default),
  },
  hr: {
    en: () => import('@/localization/en/hr.json').then((m) => m.default),
    am: () => import('@/localization/am/hr.json').then((m) => m.default),
  },
  cashier: {
    en: () => import('@/localization/en/cashier.json').then((m) => m.default),
    am: () => import('@/localization/am/cashier.json').then((m) => m.default),
  },
  finance: {
    en: () => import('@/localization/en/finance.json').then((m) => m.default),
    am: () => import('@/localization/am/finance.json').then((m) => m.default),
  },
  cbt: {
    en: () => import('@/localization/en/cbt.json').then((m) => m.default),
    am: () => import('@/localization/am/cbt.json').then((m) => m.default),
  },
  government: {
    en: () => import('@/localization/en/government.json').then((m) => m.default),
    am: () => import('@/localization/am/government.json').then((m) => m.default),
  },
  reports: {
    en: () => import('@/localization/en/reports.json').then((m) => m.default),
    am: () => import('@/localization/am/reports.json').then((m) => m.default),
  },
};

export type DictionaryModule = keyof typeof modules;

export const getDictionary = async (locale: string, module: DictionaryModule = 'common'): Promise<any> => {
  const targetLocale = (locales.includes(locale as Locale) ? locale : 'en') as Locale;
  return modules[module][targetLocale]();
};

export const getFullDictionary = async (locale: string): Promise<Record<string, any>> => {
  const targetLocale = (locales.includes(locale as Locale) ? locale : 'en') as Locale;
  const keys = Object.keys(modules) as DictionaryModule[];
  const dictionaries = await Promise.all(keys.map((k) => modules[k][targetLocale]()));
  return keys.reduce((acc, key, index) => {
    acc[key] = dictionaries[index];
    return acc;
  }, {} as Record<string, any>);
};
