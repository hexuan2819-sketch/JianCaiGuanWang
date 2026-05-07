export const localeNames = {
  zh: '简体中文',
  en: 'English',
  ar: 'العربية',
  ru: 'Русский',
  tr: 'Türkçe',
  fa: 'فارسی',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  hi: 'हिन्दी',
} as const;

export type SupportedLocale = keyof typeof localeNames;

export const locales = Object.keys(localeNames) as SupportedLocale[];
export const defaultLocale: SupportedLocale = 'zh';
export const rtlLocales: SupportedLocale[] = ['ar', 'fa'];

export function isSupportedLocale(value: string): value is SupportedLocale {
  return locales.includes(value as SupportedLocale);
}

export function normalizeLocale(value: string | undefined): SupportedLocale {
  if (!value) return defaultLocale;
  return isSupportedLocale(value) ? value : defaultLocale;
}

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as SupportedLocale);
}

export function getLocaleLabel(locale: SupportedLocale): string {
  return localeNames[locale];
}

export const secondaryLocales = locales.filter((locale) => locale !== defaultLocale);
