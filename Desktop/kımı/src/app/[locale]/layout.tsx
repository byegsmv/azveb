import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import CustomCursor from "@/components/effects/CustomCursor";
import PageLoader from "@/components/effects/PageLoader";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`@/messages/az.json`)).default;
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider>
        <PageLoader />
        <CustomCursor />
        <main className="w-full h-full min-h-screen overflow-hidden">{children}</main>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
