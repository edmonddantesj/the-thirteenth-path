"use client";
// DATA_MODEL §1-C 언어 전환 — 현재 회차 자리 보존, 대상 언어에 없으면 정직 안내.
// 언어=스킨: 바꿔도 무드(척추) 그대로. 진도 표시는 가짜 0 금지.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABEL, type Locale } from "../lib/i18n";

export default function LangSwitcher({
  active,
  progressByLocale,
  hrefFor,
}: {
  active: Locale;
  progressByLocale: Record<Locale, number>; // 각 언어 max published ep (-1 = 미개시)
  hrefFor: (loc: Locale) => string | null; // 그 언어에 현재 회차가 있으면 경로, 없으면 null
}) {
  const router = useRouter();
  return (
    <nav aria-label="언어" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {LOCALES.map((loc) => {
        const max = progressByLocale[loc];
        const label = LOCALE_LABEL[loc];
        const href = hrefFor(loc);
        const onPick = () => {
          document.cookie = `pref_locale=${loc}; path=/; max-age=31536000`;
          if (href) router.push(href);
        };
        return (
          <button
            key={loc}
            onClick={onPick}
            aria-current={loc === active ? "true" : "false"}
            title={max >= 0 ? `${label.name} ${max}화까지` : `${label.name} 아직`}
            style={{
              minHeight: 44, minWidth: 56, padding: "6px 10px", cursor: "pointer",
              borderRadius: 10, font: "inherit",
              border: `1px solid ${loc === active ? "var(--accent)" : "var(--line)"}`,
              background: loc === active ? "var(--bg2)" : "transparent",
              color: "var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}
          >
            <span style={{ fontFamily: "var(--serif)" }}>{label.chip}</span>
            <span style={{ fontSize: 10.5, color: max >= 0 ? "var(--ink-dim)" : "#4a4d54", fontVariantNumeric: "tabular-nums" }}>
              {max >= 0 ? `${max}화` : "—"}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
