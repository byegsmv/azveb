import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import { generateMetadata as genMeta } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return genMeta(t("title"), t("subtitle"));
}

export default function ServicesPage() {
  return (
    <>
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-display-lg font-bold mb-6">Hizmetlerimiz</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Markanızın dijital dünyada başarılı olması için ihtiyaç duyduğu tüm hizmetler tek çatı altında.
          </p>
        </div>
      </div>
      <Services />
      <Process />
    </>
  );
}
