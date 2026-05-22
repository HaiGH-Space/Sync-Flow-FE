import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = typeof import("./en").default;

const localeMessageLoaders: Record<
  (typeof routing.locales)[number],
  () => Promise<Messages>
> = {
  en: async () => (await import("./en")).default,
  vi: async () => (await import("./vi")).default as unknown as Messages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  const messages = await localeMessageLoaders[locale]();

  return {
    locale,
    messages,
  };
});
