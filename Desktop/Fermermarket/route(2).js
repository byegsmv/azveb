import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { geminiGenerate, isModuleActive } from "@/lib/gemini";

// POST /api/ai/agronomist — AI disease detection + product recommendation via Gemini
export async function POST(request) {
  const rl = rateLimit(request, { limit: 10, windowMs: 60_000, keyPrefix: "ai_agronomist" });
  if (rl) return rl;

  try {
    if (!(await isModuleActive("agronomist"))) {
      return Response.json({ error: "Bu modul deaktiv edilib" }, { status: 403 });
    }

    let text = "";
    let imageBase64 = null;
    let imageMimeType = "image/jpeg";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await request.formData();
        text = formData.get("text") || "";
        const image = formData.get("image");

        if (image && image !== "null" && typeof image === "object" && typeof image.arrayBuffer === "function") {
          const buffer = Buffer.from(await image.arrayBuffer());
          imageBase64 = buffer.toString("base64");
          imageMimeType = image.type || "image/jpeg";
        } else if (typeof image === "string" && image.startsWith("data:")) {
          const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
          if (match) {
            imageMimeType = match[1];
            imageBase64 = match[2];
          }
        }
      } catch (e) {
        console.warn("FormData parse error:", e.message);
      }
    } else {
      try {
        const body = await request.json();
        text = body.text || body.prompt || "";
        if (body.image && typeof body.image === "string") {
          const match = body.image.match(/^data:(image\/\w+);base64,(.+)$/);
          if (match) {
            imageMimeType = match[1];
            imageBase64 = match[2];
          } else {
            imageBase64 = body.image;
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    const isImage = !!imageBase64;

    let prompt = `Sən peşəkar aqronomsan. Azərbaycan dilində cavab ver.\n`;
    prompt += `İstifadəçinin təsviri: "${text || "Təsvir verilməyib"}"\n`;
    prompt += `Şəkil yüklənib: ${isImage ? "Bəli" : "Xeyr"}\n`;
    prompt += `\nJSON formatında cavab ver:\n`;
    prompt += `{\n  "diagnosis": "Xəstəlik/zərərverici adı Azərbaycanca",\n`;
    prompt += `  "confidencePercent": 85,\n`;
    prompt += `  "causes": ["Səbəb 1", "Səbəb 2"],\n`;
    prompt += `  "treatment": ["Müalicə 1", "Müalicə 2"],\n`;
    prompt += `  "recommendedProducts": ["Məhsul adı 1", "Məhsul adı 2"],\n`;
    prompt += `  "needsExpertConsult": false,\n`;
    prompt += `  "summary": "Qısa tövsiyə Azərbaycanca"\n}\n`;
    prompt += `Yalnız JSON cavab ver, başqa mətn yazma.`;

    const aiResponse = (await geminiGenerate({
      prompt,
      imageBase64,
      imageMimeType,
      maxOutputTokens: 1024,
    })) || "";

    let diagnosis = null;
    try {
      const cleanedText = aiResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diagnosis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn("AI JSON parse error:", e.message);
    }

    let products = [];
    if (diagnosis && Array.isArray(diagnosis.recommendedProducts) && diagnosis.recommendedProducts.length > 0) {
      try {
        const productNames = diagnosis.recommendedProducts.map(p => String(p).toLowerCase());
        const orConditions = productNames.flatMap(name => [
          { titleAz: { contains: name, mode: "insensitive" } },
          { titleEn: { contains: name, mode: "insensitive" } },
          { descriptionAz: { contains: name, mode: "insensitive" } },
        ]);

        if (orConditions.length > 0) {
          products = await prisma.product.findMany({
            where: {
              status: "ACTIVE",
              stock: { gt: 0 },
              OR: orConditions,
            },
            take: 4,
            orderBy: { viewCount: "desc" },
            include: {
              images: { take: 1, orderBy: { sortOrder: "asc" } },
              store: { select: { name: true, slug: true } },
            },
          });
        }
      } catch (dbErr) {
        console.warn("Products search DB error:", dbErr.message);
      }
    }

    if (products.length === 0 && diagnosis) {
      try {
        const diagText = (diagnosis.diagnosis || "").toLowerCase();
        let categoryFilter = {};
        if (diagText.includes("göbələk") || diagText.includes("fung")) {
          categoryFilter = { OR: [{ category: { nameAz: { contains: "Fungisid" } } }, { titleAz: { contains: "fungisid", mode: "insensitive" } }] };
        } else if (diagText.includes("böcək") || diagText.includes("zərər") || diagText.includes("insekt")) {
          categoryFilter = { OR: [{ category: { nameAz: { contains: "İnsektisid" } } }, { titleAz: { contains: "insektisid", mode: "insensitive" } }] };
        } else if (diagText.includes("qida") || diagText.includes("çatış") || diagText.includes("gübrə")) {
          categoryFilter = { OR: [{ category: { nameAz: { contains: "gübrə" } } }, { category: { nameAz: { contains: "Maye" } } }, { titleAz: { contains: "NPK", mode: "insensitive" } }] };
        }

        if (Object.keys(categoryFilter).length > 0) {
          products = await prisma.product.findMany({
            where: { status: "ACTIVE", stock: { gt: 0 }, ...categoryFilter },
            take: 4,
            orderBy: { viewCount: "desc" },
            include: {
              images: { take: 1, orderBy: { sortOrder: "asc" } },
              store: { select: { name: true, slug: true } },
            },
          });
        }
      } catch (catErr) {
        console.warn("Category fallback DB error:", catErr.message);
      }
    }

    if (products.length === 0) {
      try {
        products = await prisma.product.findMany({
          where: { status: "ACTIVE", stock: { gt: 0 } },
          take: 4,
          orderBy: { viewCount: "desc" },
          include: {
            images: { take: 1, orderBy: { sortOrder: "asc" } },
            store: { select: { name: true, slug: true } },
          },
        });
      } catch (popErr) {
        console.warn("Popular products DB error:", popErr.message);
      }
    }

    const now = new Date();
    const hour = now.getHours();
    let sprayTime = "Səhər tezdən (06:00-08:00) və ya axşam üzeri (18:00-20:00)";
    if (hour >= 6 && hour < 10) sprayTime = "İndi çiləmə üçün əlverişli vaxtdır (səhər)";
    else if (hour >= 18 && hour < 21) sprayTime = "İndi çiləmə üçün əlverişli vaxtdır (axşam)";
    else if (hour >= 10 && hour < 18) sprayTime = "Çiləmə üçün əlverişsiz vaxt — günəş yanığı riski. Axşam 18:00-dan sonra çiləyin.";
    else sprayTime = "Gecə çiləmək tövsiyə olunmur. Səhər 06:00-08:00 çiləyin.";

    return Response.json({
      disease: diagnosis?.diagnosis || "Bitki Analizi Tamamlandı",
      confidence: diagnosis?.confidencePercent ? `${diagnosis.confidencePercent}%` : "80%",
      recommendation: diagnosis?.summary || (Array.isArray(diagnosis?.treatment) ? diagnosis.treatment.join(". ") : aiResponse.slice(0, 300)),
      causes: diagnosis?.causes || [],
      treatment: diagnosis?.treatment || [],
      sprayTime,
      needsExpertConsult: diagnosis?.needsExpertConsult || false,
      rawAiResponse: aiResponse.slice(0, 500),
      products: products.map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.titleAz,
        price: Number(p.price),
        currency: p.currency || "AZN",
        coverImage: p.images?.[0]?.url || null,
        store: p.store?.name || null,
        manufacturer: p.manufacturer || null,
        preparativeForm: p.preparativeForm || null,
        useNorm: p.useNorm || null,
      })),
    });
  } catch (error) {
    console.error("AI Aqronom API Error:", error);
    return Response.json({ error: error.message || "Daxili server xətası baş verdi" }, { status: 500 });
  }
}
