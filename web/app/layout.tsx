import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Thirteenth Path · 열세 번째 길",
  description: "공식 연재 — 5개 언어. 무번으로 흘려보내지 않는다.",
};

// 루트 레이아웃: html/body. lang는 [locale] 레이아웃에서 세분(여기선 기본).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
