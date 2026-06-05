// DATA_MODEL_AND_STACK_V0.1 §1-B — locale 라우팅.
// 자동 강제 리다이렉트 금지(주소 안정성·다크패턴). 루트만 기본 locale로,
// 언어 추정은 *제안*까지(배너는 클라이언트). URL의 명시 locale이 항상 최우선.
import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "./lib/i18n";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 이미 /{locale}/... 면 그대로(명시 locale 최우선).
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) return NextResponse.next();

  // 정적/내부 경로 패스
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 루트·언어 없는 경로 → 저장된 선호 or 기본(ko). *강제 아님*: 사용자가 직접 고른 값 우선.
  const pref = req.cookies.get("pref_locale")?.value;
  const target = pref && isLocale(pref) ? pref : DEFAULT_LOCALE;
  const url = req.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|assets|favicon.ico).*)"],
};

export { LOCALES };
