import { prisma } from "@/lib/prisma";
import { geminiGenerate } from "@/lib/gemini";
import { rateLimit } from "@/lib/rateLimit";

// POST /api/ai/translate — Dynamic AI Translation Agent for listings, texts & info
export async function POST(request) {
  const rl = rateLimit(request, { limit: 30, windowMs: 60_000, keyPrefix: "ai_translate" });
  if (rl) return rl;

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
    }

    const { text, texts, targetLang = "en", sourceLang = "az", entityType, entityId, field } = body;

    const validLangs = ["az", "en", "ru", "tr"];
    const target = (targetLang || "en").toLowerCase();
    if (!validLangs.includes(target)) {
      return Response.json({ error: "Desteklenmeyen hedef dil" }, { status: 400 });
    }

    // 1. Veritabanı önbellek kontrolü (Cache check)
    if (entityType && entityId && field) {
      try {
        const cached = await prisma.translation.findUnique({
          where: {
            entityType_entityId_field_locale: {
              entityType,
              entityId,
              field,
              locale: target,
            },
          },
        });
        if (cached && cached.value) {
          return Response.json({ translatedText: cached.value, cached: true });
        }
      } catch (cacheErr) {
        console.warn("Translation cache check skipped:", cacheErr.message);
      }
    }

    // 2. Çoklu Metin Dizi Tarafı veya Tekil Metin
    const inputTexts = Array.isArray(texts) ? texts : text ? [text] : [];
    if (inputTexts.length === 0) {
      return Response.json({ error: "Tərcümə üçün metin daxil edilməlidir" }, { status: 422 });
    }

    const langNames = {
      az: "Azərbaycan dili",
      en: "İngilis dili (English)",
      ru: "Rus dili (Русский)",
      tr: "Türkçe",
    };

    const targetLangName = langNames[target] || target;
    const sourceLangName = langNames[sourceLang] || sourceLang;

    // 3. Gemini AI Translation Prompt
    const prompt = `Sən kənd təsərrüfatı e-ticarət platforması üçün peşəkar tərcüməçi AI Ajanısan.
Mətni ${sourceLangName} dilindən ${targetLangName} dilinə təbii, dəqiq və terminologiyaya uyğun tərcümə et.

Mətnlər:
${JSON.stringify(inputTexts)}

JSON formatında cavab ver:
{
  "translations": ["Tərcümə olunmuş mətn 1", "Tərcümə olunmuş mətn 2"]
}
Yalnız JSON qaytar.`;

    const aiResponse = await geminiGenerate({ prompt, maxOutputTokens: 2048 });

    let translations = [];
    try {
      const cleanJson = aiResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      const match = cleanJson.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        translations = parsed.translations || [];
      }
    } catch (parseErr) {
      console.warn("AI translate JSON parse fallback:", parseErr.message);
      translations = [aiResponse.trim()];
    }

    const resultText = translations[0] || inputTexts[0];

    // 4. Otomatik Önbelleğe Kaydetme (Database Caching)
    if (entityType && entityId && field && resultText) {
      try {
        await prisma.translation.upsert({
          where: {
            entityType_entityId_field_locale: {
              entityType,
              entityId,
              field,
              locale: target,
            },
          },
          update: { value: resultText },
          create: { entityType, entityId, field, locale: target, value: resultText },
        });
      } catch (saveErr) {
        console.warn("Translation save error:", saveErr.message);
      }
    }

    return Response.json({
      translatedText: resultText,
      translations: Array.isArray(texts) ? translations : undefined,
      targetLang: target,
      cached: false,
    });
  } catch (error) {
    console.error("AI Translation Error:", error);
    return Response.json({ error: error.message || "Tərcümə xətası baş verdi" }, { status: 500 });
  }
}
