import { notFound } from "next/navigation";
import { LOCALES, isLocale } from "../../lib/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  // html lang은 클라이언트에서 동기화하거나 RootLayout에서 처리.
  // 무드=척추: 페이지(home/reader)가 아크별 무드 토큰을 주입.
  return <>{children}</>;
}
