// DATA_MODEL_AND_STACK_V0.1 §2 — 작품 구조 + 언어판을 빌드타임에 마크다운에서 인덱싱.
// 회차 본문 파일(../ko ../en ../ja/NN_slug.md)은 적묘·번역 영역 — 여기서 *읽기만* 한다.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LOCALES, SOURCED_LOCALES, type Locale } from "./i18n";

// 회차 본문 디렉토리(모노레포 루트). web/ 기준 한 칸 위.
const CONTENT_ROOT = path.join(process.cwd(), "..");

// 파일명 규칙: NN_slug.md  (00=프롤로그). 영문 slug = 언어 무관 ep 키.
const EP_FILE = /^(\d{2})_(.+)\.md$/;

// ── §2-A 작품 구조(아크 경계는 DATA_MODEL 기준: 0~30 서장 / 31~ 하즈란) ──
export type ArcId = "seojang" | "hazran";
export function arcOf(epNo: number): ArcId {
  return epNo <= 30 ? "seojang" : "hazran";
}

// ── §2-B EpisodeLocalization ──
export type TranslationStatus = "absent" | "draft" | "reviewed" | "published";

export interface EpisodeLocalization {
  epNo: number;
  locale: Locale;
  slug: string;
  title: string;
  status: TranslationStatus;
  sourcePath: string | null; // 없으면 null = 정직(가짜로 안 채움)
}

export interface Episode {
  epNo: number;
  arc: ArcId;
  isPartBoundary: boolean; // 막 경계 연출 트리거(서장=1부 끝 등). seed에서 보강.
  // 언어판 인덱스(없는 언어는 status=absent)
  byLocale: Record<Locale, EpisodeLocalization>;
}

function readTitle(raw: string, fallback: string): string {
  const body = matter(raw).content;
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : fallback;
}

// 한 언어 디렉토리에서 회차 맵 추출(빌드타임·동기 fs).
function scanLocale(locale: Locale): Map<number, EpisodeLocalization> {
  const dir = path.join(CONTENT_ROOT, locale);
  const out = new Map<number, EpisodeLocalization>();
  if (!fs.existsSync(dir)) return out; // fr/zh 등 미존재 = 정직 빈 맵
  for (const file of fs.readdirSync(dir)) {
    const m = file.match(EP_FILE);
    if (!m) continue;
    const epNo = parseInt(m[1], 10);
    const slug = m[2];
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf8");
    out.set(epNo, {
      epNo,
      locale,
      slug,
      title: readTitle(raw, slug),
      status: "published", // 이 repo에 박힌 본문 = 공개분(스케줄 publish_at는 schedule.ts에서)
      sourcePath: path.relative(CONTENT_ROOT, full),
    });
  }
  return out;
}

let _cache: Episode[] | null = null;

export function allEpisodes(): Episode[] {
  if (_cache) return _cache;
  const perLocale = new Map<Locale, Map<number, EpisodeLocalization>>();
  for (const loc of LOCALES) perLocale.set(loc, scanLocale(loc));

  // 모든 언어에서 등장한 epNo 합집합
  const epNos = new Set<number>();
  for (const map of perLocale.values()) for (const n of map.keys()) epNos.add(n);

  const episodes: Episode[] = [...epNos].sort((a, b) => a - b).map((epNo) => {
    const byLocale = {} as Record<Locale, EpisodeLocalization>;
    for (const loc of LOCALES) {
      const found = perLocale.get(loc)!.get(epNo);
      byLocale[loc] = found ?? {
        epNo,
        locale: loc,
        slug: "",
        title: "",
        status: "absent", // 없으면 absent — 가짜 0/빈 본문 금지
        sourcePath: null,
      };
    }
    return {
      epNo,
      arc: arcOf(epNo),
      isPartBoundary: epNo === 30, // 서장(1부) 끝 = 막 경계(seed로 확장 가능)
      byLocale,
    };
  });

  _cache = episodes;
  return episodes;
}

export function maxPublishedEp(locale: Locale): number {
  let max = -1;
  for (const ep of allEpisodes()) {
    if (ep.byLocale[locale].status === "published") max = Math.max(max, ep.epNo);
  }
  return max;
}

export function getEpisodeBody(locale: Locale, epNo: number): { title: string; body: string } | null {
  const ep = allEpisodes().find((e) => e.epNo === epNo);
  if (!ep) return null;
  const loc = ep.byLocale[locale];
  if (loc.status === "absent" || !loc.sourcePath) return null; // 없으면 정직히 null
  const raw = fs.readFileSync(path.join(CONTENT_ROOT, loc.sourcePath), "utf8");
  const { content } = matter(raw);
  return { title: loc.title, body: content };
}

export { SOURCED_LOCALES };
