// DATA_MODEL_AND_STACK_V0.1 §3 — 공개 스케줄러. 공개 = 오직 시각(publish_at <= now).
// 행동 조건(공유·초대) 잠금은 스키마 자체를 안 만든다(§0 다크패턴 거부).
import seed from "../data/seed.json";
import { maxPublishedEp } from "./content";
import type { Locale } from "./i18n";

export type ScheduleMode = "daily_1" | "daily_2" | "backlog_then_catching_up" | "caught_up";

export interface Schedule {
  locale: Locale;
  mode: ScheduleMode;
  slots_kst: string[];
  catch_up_target_locale: Locale | null;
  state: string;
  ext_epub?: boolean;
}

export function scheduleFor(locale: Locale): Schedule {
  return (seed.schedules as Schedule[]).find((s) => s.locale === locale)!;
}

// 다음 슬롯까지 남은 ms (KST = UTC+9). 카운트다운 = 기다림의 안내일 뿐.
export function msUntilNextSlot(slotsKst: string[], now = new Date()): number {
  const kstNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000);
  let best = Infinity;
  for (const slot of slotsKst) {
    const [h, m] = slot.split(":").map(Number);
    const t = new Date(kstNow);
    t.setHours(h, m, 0, 0);
    if (t <= kstNow) t.setDate(t.getDate() + 1);
    best = Math.min(best, t.getTime() - kstNow.getTime());
  }
  return best === Infinity ? 0 : best;
}

// 가속 합류 판정: 후발 진도가 선두 진도에 닿으면 daily_1 합류(숨기지 않고 정직 표기).
export function caughtUp(locale: Locale): boolean {
  const s = scheduleFor(locale);
  if (!s.catch_up_target_locale) return false;
  return maxPublishedEp(locale) >= maxPublishedEp(s.catch_up_target_locale);
}

// 회차 공개 여부 — 시각만. (이 repo 본문=공개분. publish_at 모델은 운영시 슬롯에서 박힘.)
export function isPublished(epStatus: string, publishAt?: number): boolean {
  if (epStatus !== "published") return false;
  if (publishAt == null) return true;
  return publishAt <= Date.now();
}
