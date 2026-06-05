import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, LOCALE_LABEL, isLocale, type Locale } from "../../lib/i18n";
import { allEpisodes, maxPublishedEp } from "../../lib/content";
import { moodVars } from "../../lib/mood";
import seed from "../../data/seed.json";

export const revalidate = 300; // 공개(publish_at) 반영 — 시각만

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;

  const episodes = allEpisodes();
  const progress = Object.fromEntries(LOCALES.map((l) => [l, maxPublishedEp(l)])) as Record<Locale, number>;
  const title = (seed.work.title_i18n as Record<string, string>)[loc] ?? seed.work.title_i18n.en;

  // 홈 무드 = 서장(첫 아크) 척추
  const style = moodVars("seojang") as React.CSSProperties;

  // 이 언어에서 공개된 회차만(정직). 없으면 빈 목록 + 안내.
  const published = episodes.filter((e) => e.byLocale[loc].status === "published");

  return (
    <main className="wrap" style={style}>
      <header style={{ padding: "30px 0 12px" }}>
        <div style={{ fontSize: 12, letterSpacing: ".18em", color: "var(--accent)", textTransform: "uppercase" }}>
          공식 연재 · 5개 언어
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 26, margin: "8px 0 6px" }}>{title}</h1>
        <p style={{ color: "var(--ink-dim)", fontSize: 13.5, margin: 0 }}>
          무번으로 흘려보내지 않는다. 없는 건 없다고 말한다.
        </p>
      </header>

      <section style={{ marginTop: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: ".12em", color: "var(--ink-dim)", textTransform: "uppercase", marginBottom: 10 }}>
          언어 — 각자 어디까지
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {LOCALES.map((l) => {
            const max = progress[l];
            return (
              <Link key={l} href={`/${l}`} aria-current={l === loc ? "true" : "false"}
                style={{
                  minHeight: 52, minWidth: 60, padding: "8px 10px", borderRadius: 10,
                  border: `1px solid ${l === loc ? "var(--accent)" : "var(--line)"}`,
                  background: l === loc ? "var(--bg2)" : "transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 16 }}>{LOCALE_LABEL[l].chip}</span>
                <span style={{ fontSize: 10.5, color: max >= 0 ? "var(--ink-dim)" : "#4a4d54", fontVariantNumeric: "tabular-nums" }}>
                  {max >= 0 ? `${max}화` : "—"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 26 }}>
        <div style={{ fontSize: 12, letterSpacing: ".12em", color: "var(--ink-dim)", textTransform: "uppercase", marginBottom: 10 }}>
          회차 — {LOCALE_LABEL[loc].name}
        </div>
        {published.length === 0 ? (
          <p style={{ color: "var(--ink-dim)", fontSize: 14 }}>
            이 언어는 아직 준비 중이야. 가짜로 채우지 않을게 — 다른 언어로 먼저 읽을 수 있어.
          </p>
        ) : (
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {published.map((e) => (
              <li key={e.epNo} style={{ borderBottom: "1px solid var(--line)" }}>
                <Link href={`/${loc}/work/${seed.work.slug}/ep/${e.epNo}`}
                  style={{ display: "flex", gap: 12, padding: "12px 2px", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--accent)", minWidth: 34, fontVariantNumeric: "tabular-nums" }}>
                    {e.epNo === 0 ? "序" : e.epNo}
                  </span>
                  <span style={{ fontSize: 15 }}>{e.byLocale[loc].title}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
