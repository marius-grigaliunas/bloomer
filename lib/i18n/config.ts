import { I18n, TranslateOptions } from "i18n-js";
import * as Localization from "expo-localization";

import en from "@/locales/en.json";
import lt from "@/locales/lt.json";
import ro from "@/locales/ro.json";

export const supportedLanguages = ["en", "lt", "ro"] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

const i18n = new I18n({
  en,
  lt,
  ro,
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";

const detectedLocale =
  Localization.getLocales()?.[0]?.languageTag?.split("-")[0]?.toLowerCase() ?? "en";

i18n.locale = supportedLanguages.includes(detectedLocale as SupportedLanguage)
  ? (detectedLocale as SupportedLanguage)
  : "en";

export const translate = (key: string, options?: TranslateOptions) => i18n.t(key, options);

export const setLocale = (locale: SupportedLanguage) => {
  if (!supportedLanguages.includes(locale)) {
    return;
  }

  i18n.locale = locale;
};

export const getCurrentLocale = (): SupportedLanguage =>
  (i18n.locale as SupportedLanguage) ?? "en";

export default i18n;

