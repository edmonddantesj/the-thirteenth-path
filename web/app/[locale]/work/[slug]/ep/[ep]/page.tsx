import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, LOCALE_LABEL, isLocale, type Locale } from "../../../../../../lib/i18n";
import { allEpisodes, getEpisodeBody, maxPublishedEp } from "../../../../../../lib/content";
import { moodVars } from "../../../../../../lib/mood";
import seed from "../../../../../../data/seed.json";

export const revalidate = 300;

export function generateStaticParams() {
  const params: { locale: string; slug: string; ep: string }[] = [];
  for (const e of allEpisodes()) {
    for (const loc of LOCALES) {
      if (e.byLocale[loc].status === "published") {
        params.push({ locale: loc, slug: seed.work.slug, ep: String(e.epNo) });
      }
    }
  }
  return params;
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; ep: string }>;
}) {
  const { locale, ep } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const epNo = parseInt(ep, 10);
  if (Number.isNaN(epNo)) notFound();

  const episode = allEpisodes().find((e) => e.epNo === epNo);
  if (!episode) notFound();

  const arc = episode.arc;
  const style = moodVars(arc) as React.CSSProperties; // 아크 무드 = 척추
  const content = getEpisodeBody(loc, epNo);

  const progress = Object.fromEntries(LOCALES.map((l) => [l, maxPublishedEp(l)])) as Record<Locale, number>;
  const slug = seed.work.slug;

  // 언어 전환 경로 — 그 언어에 이 회차 있으면 같은 회차, 없으면 그 언어 홈(정직)
  const hrefFor = (l: Locale) =>
    episode.byLocale[l].status === "published" ? `/${l}/work/${slug}/ep/${epNo}` : `/${l}`;

  return (
    <main className="wrap" style={style}>
      <header style={{ padding: "20px 0 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href={`/${loc}`} style={{ fontSize: 13, color: "var(--ink-dim)" }}>← 목록</Link>
        <nav aria-label="언어" style={{ display: "flex", gap: 6 }}>
          {LOCALES.map((l) => (
            <Link key={l} href={hrefFor(l)} aria-current={l === loc ? "true" : "false"}
              title={progress[l] >= 0 ? `${LOCALE_LABEL[l].name} ${progress[l]}화까지` : `${LOCALE_LABEL[l].name} 아직`}
              style={{
                fontFamily: "var(--serif)", fontSize: 14, minWidth: 34, minHeight: 34,
                display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 8,
                border: `1px solid ${l === loc ? "var(--accent)" : "var(--line)"}`,
                color: l === loc ? "var(--accent)" : "var(--ink-dim)",
              }}>
              {LOCALE_LABEL[l].chip}
            </Link>
          ))}
        </nav>
      </header>

      {content ? (
        <article className="prose" style={{ marginTop: 16 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 600, fontSize: 22, lineHeight: 1.35 }}>
            {content.title}
          </h1>
          {/* 골격: 본문은 마크다운 텍스트 그대로(렌더러는 다음 단계 — remark 등). 회차 본문=적묘/번역 영역, 여기선 표시만. */}
          <div style={{ marginTop: 18, whiteSpace: "pre-wrap" }}>{content.body}</div>
        </article>
      ) : (
        // 정직 안내 — 이 언어에 이 회차 없음
        <section style={{ marginTop: 28, padding: 16, borderRadius: 12, background: "var(--bg2)", border: "1px solid var(--line)" }}>
          <p style={{ margin: 0, fontSize: 15 }}>
            <b style={{ color: "var(--accent)" }}>{LOCALE_LABEL[loc].name}</b>는{" "}
            <b>{progress[loc] >= 0 ? `${progress[loc]}화` : "아직 시작 전"}</b>까지 —{" "}
            <b>{epNo}화</b>는 아직.
          </p>
          <p style={{ marginTop: 8, fontSize: 13, color: "var(--ink-dim)" }}>없는 걸 있는 척하지 않아. 닿은 언어로 먼저 볼 수 있어:</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {LOCALES.filter((l) => episode.byLocale[l].status === "published").map((l) => (
              <Link key={l} href={`/${l}/work/${slug}/ep/${epNo}`}
                style={{ fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "1px solid var(--line)" }}>
                {LOCALE_LABEL[l].name} {epNo}화 ✓
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 회차 이동 — 무효과(회차 전환은 연출 없음, DATA_MODEL 3단 차등) */}
      <nav style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
        {epNo > 0 && episode.byLocale[loc].status === "published" ? (
          <Link href={`/${loc}/work/${slug}/ep/${epNo - 1}`} style={{ color: "var(--ink-dim)" }}>← 이전 화</Link>
        ) : <span />}
        {episode.byLocale[loc].status === "published" && epNo < maxPublishedEp(loc) ? (
          <Link href={`/${loc}/work/${slug}/ep/${epNo + 1}`} style={{ color: "var(--accent)" }}>다음 화 →</Link>
        ) : <span />}
      </nav>
    </main>
  );
}
