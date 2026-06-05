// DATA_MODEL_AND_STACK_V0.1 §1 — i18n 경로 기반(서브패스). 무드=척추·언어=스킨.
export const LOCALES = ["ko", "en", "ja", "fr", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

// 빌드 소스(마크다운 디렉토리)가 실제로 존재하는 언어. fr/zh는 아직 이 repo에 본문 없음 → 정직.
export const SOURCED_LOCALES: Locale[] = ["ko", "en", "ja"];

export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_LABEL: Record<Locale, { chip: string; name: string; htmlLang: string }> = {
  ko: { chip: "한", name: "한국어", htmlLang: "ko" },
  en: { chip: "EN", name: "English", htmlLang: "en" },
  ja: { chip: "日", name: "日本語", htmlLang: "ja" },
  fr: { chip: "FR", name: "Français", htmlLang: "fr" },
  zh: { chip: "中", name: "简体中文", htmlLang: "zh-Hans" },
};

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}
