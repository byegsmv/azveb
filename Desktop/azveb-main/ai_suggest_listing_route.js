// =================================================================
// FERMERMARKET.AZ - AI AVTOMATİK ELAN DOLDURMA API (Vision & Text)
// =================================================================
import { prisma } from "@/lib/prisma";
import { geminiGenerate } from "@/lib/gemini";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request) {
  const rl = rateLimit(request, { limit: 20, windowMs: 60_000, keyPrefix: "ai_autofill" });
  if (rl) return rl;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
    }

    const { image, text, productName, categoryHint } = body;

    // 1. Aktiv Kateqoriya və Brendləri gətir
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, select: { id: true, nameAz: true, slug: true } }),
      prisma.brand.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true } }),
    ]);

    const categoryNames = categories.map((c) => c.nameAz).join(", ");
    const brandNames = brands.map((b) => b.name).join(", ");

    // 2. Gemini AI Promptu
    const prompt = `Sən kənd təsərrüfatı marketplace platformasında (FermerMarket.az) elanları avtomatik və peşəkar şəkildə dolduran AI Aqronomusan.
İstifadəçinin təqdim etdiyi şəkilə və ya məhsul adına/ilkin təsvirinə əsasən elan üçün bütün xanaları tam, dolğun və cəlbedici doldur.

Mövcud Kateqoriyalar: [${categoryNames}]
Mövcud Brendlər: [${brandNames}]

İstifadəçi Qeydi / Məhsul Adı: "${productName || text || ""}"
Kateqoriya İpucu: "${categoryHint || ""}"

Aşağıdakı JSON formatında və Azərbaycan dilində cavab ver:
{
  "titleAz": "Cəlbedici və dəqiq elan başlığı (max 70 simvol)",
  "matchedCategoryName": "Yuxarıdakı kateqoriyalardan ən uyğun olanının dəqiq adı",
  "matchedBrandName": "Əgər məhsulda/şəkildə brend varsa adı, yoxdursa null",
  "suggestedPrice": 45.00,
  "originalPrice": 55.00,
  "unit": "ədəd",
  "descriptionAz": "Məhsulun keyfiyyəti, mənşəyi, istifadə qaydası, saxlanma şəraiti və fermer üçün faydası haqqında 2-3 cümləlik peşəkar təsvir",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
Yalnız JSON qaytar, başqa mətn yazma.`;

    let imageBase64 = null;
    let imageMimeType = "image/jpeg";

    if (image && typeof image === "string") {
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        imageMimeType = match[1];
        imageBase64 = match[2];
      } else if (!image.startsWith("http")) {
        imageBase64 = image;
      }
    }

    const aiResponse = await geminiGenerate({
      prompt,
      imageBase64,
      imageMimeType,
      maxOutputTokens: 1024,
    });

    let result = null;
    try {
      const cleanJson = (aiResponse || "").replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = cleanJson.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn("AI autofill JSON parse fallback:", e.message);
    }

    if (!result) {
      return Response.json({
        titleAz: productName || "Kənd Təsərrüfatı Məhsulu",
        categoryId: categories[0]?.id || "",
        brandId: "",
        price: "25.00",
        originalPrice: "30.00",
        unit: "ədəd",
        descriptionAz: "Yüksək keyfiyyətli, ekoloji təmiz kənd təsərrüfatı məhsulu.",
        tags: ["kənd", "təsərrüfatı", "fermer", "təbii"],
      });
    }

    // 3. Kateqoriya ID-sini uyğunlaşdır
    let categoryId = "";
    if (result.matchedCategoryName) {
      const foundCat = categories.find(
        (c) =>
          c.nameAz.toLowerCase().includes(result.matchedCategoryName.toLowerCase()) ||
          result.matchedCategoryName.toLowerCase().includes(c.nameAz.toLowerCase())
      );
      if (foundCat) categoryId = foundCat.id;
    }

    // 4. Brend ID-sini uyğunlaşdır
    let brandId = "";
    if (result.matchedBrandName) {
      const foundBrand = brands.find(
        (b) =>
          b.name.toLowerCase().includes(result.matchedBrandName.toLowerCase()) ||
          result.matchedBrandName.toLowerCase().includes(b.name.toLowerCase())
      );
      if (foundBrand) brandId = foundBrand.id;
    }

    return Response.json({
      titleAz: result.titleAz || productName || "",
      categoryId: categoryId || categories[0]?.id || "",
      brandId: brandId || "",
      price: result.suggestedPrice ? String(result.suggestedPrice) : "",
      originalPrice: result.originalPrice ? String(result.originalPrice) : "",
      unit: result.unit || "ədəd",
      descriptionAz: result.descriptionAz || "",
      tags: result.tags || [],
    });
  } catch (error) {
    console.error("AI Autofill Listing API Error:", error);
    return Response.json({ error: error.message || "AI xətası baş verdi" }, { status: 500 });
  }
}
