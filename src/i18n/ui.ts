import { ar } from './locales/ar';
import { en } from './locales/en';
import { zh, type UIDictionary } from './locales/zh';
import { defaultLocale, locales, normalizeLocale, type SupportedLocale } from './config';

const dictionaries: Record<SupportedLocale, UIDictionary> = {
  zh,
  en,
  ar,
  ru: en,
  tr: en,
  fa: ar,
  es: en,
  fr: en,
  de: en,
  it: en,
  ja: en,
  ko: en,
  th: en,
  vi: en,
  hi: en,
};

type DotPath<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}` | `${K}.${DotPath<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = DotPath<UIDictionary>;

function getValueByPath(object: UIDictionary, path: TranslationKey): string {
  return path.split('.').reduce<unknown>((accumulator, segment) => {
    if (accumulator && typeof accumulator === 'object' && segment in accumulator) {
      return (accumulator as Record<string, unknown>)[segment];
    }
    return undefined;
  }, object) as string;
}

export function getDictionary(locale: string | undefined): UIDictionary {
  const safeLocale = normalizeLocale(locale);
  return dictionaries[safeLocale] ?? dictionaries[defaultLocale];
}

export function useTranslations(locale: string | undefined) {
  const safeLocale = normalizeLocale(locale);
  const dictionary = getDictionary(safeLocale);
  const fallback = dictionaries[defaultLocale];

  return (key: TranslationKey): string => {
    return getValueByPath(dictionary, key) ?? getValueByPath(fallback, key) ?? key;
  };
}

export function stripLocaleFromPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';

  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      return '/';
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }

  return pathname;
}

export function getLocalizedPathname(locale: SupportedLocale, pathname: string): string {
  const normalizedPath = stripLocaleFromPath(pathname);
  const cleanPath = normalizedPath === '' ? '/' : normalizedPath;

  if (locale === defaultLocale) {
    return cleanPath;
  }

  if (cleanPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${cleanPath}`;
}
