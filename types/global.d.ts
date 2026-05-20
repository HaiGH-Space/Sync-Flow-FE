import { routing } from "@/i18n/routing";
import en from "@/i18n/en";
import { ApiRequestError } from "@/lib/api/api";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiRequestError;
  }
}
