const LOCALE_MAP: Record<string, string> = {
  vi: "vi-VN",
  en: "en-US",
};

export type DateInput = string | number | Date;

const DateTimeFormat = Intl.DateTimeFormat;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function normalizeLocale(locale: string): string {
  return LOCALE_MAP[locale] ?? locale;
}

export function createDateFormatter(
  locale: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const cacheKey = `${normalizeLocale(locale)}:${JSON.stringify(options ?? {})}`;
  let formatter = formatterCache.get(cacheKey);

  if (!formatter) {
    formatter = new DateTimeFormat(normalizeLocale(locale), {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options,
    });

    formatterCache.set(cacheKey, formatter);
  }

  return (value: DateInput) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return formatter.format(date);
  };
}
