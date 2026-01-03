import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fallbackLang, resources, supportedLangs, type SupportedLang } from "./resources";

// 시스템 언어 감지
function detectSystemLanguage(): SupportedLang {
  const locales = Localization.getLocales();
  const raw = locales?.[0]?.languageTag || locales?.[0]?.languageCode || "";
  const base = raw.split("-")[0].toLowerCase(); // 'ko', 'en'

  if (supportedLangs.includes(base as SupportedLang)) return base as SupportedLang;
  return fallbackLang;
}

const initialLang = detectSystemLanguage();

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    // 추가 옵션
  });

export default i18n;
