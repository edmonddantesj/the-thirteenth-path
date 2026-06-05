/** @type {import('next').NextConfig} */
// i18n은 App Router의 [locale] 세그먼트 + middleware로 처리(레거시 i18n 라우터 X).
// 회차 본문은 빌드타임에 ../{locale} 마크다운에서 읽음 → 정적 생성(ISR).
const nextConfig = {
  reactStrictMode: true,
  // 회차 공개(publish_at) 도달 시 재생성 — 시각 외 조건 없음(DATA_MODEL §3).
  // 페이지별 export const revalidate 로 세분.
  experimental: {
    // 모노레포: web/ 밖(../ko 등)을 추적 루트에 포함
    outputFileTracingRoot: new URL("..", import.meta.url).pathname,
  },
};
export default nextConfig;
