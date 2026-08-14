// =================================================================
// FERMERMARKET.AZ - DİNAMİK REKLAM VƏ ELAN QİYMƏTLƏRİ API
// =================================================================
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireRole } from "@/lib/auth";

export const DEFAULT_PRICING = {
  // Elan Paketləri
  ad_1d_price: 0,
  ad_15d_price: 7,
  ad_30d_price: 10,

  // Məhsulu Önə Çıxarma (Product Boost)
  boost_7d_price: 5,
  boost_15d_price: 10,
  boost_30d_price: 15,

  // Mağazanı Önə Çıxarma (Store Promotion - Top 3 Vitrin)
  store_promo_15d_price: 20,
  store_promo_30d_price: 35,

  // Məhsulu Premium Etmə
  premium_badge_30d_price: 10,
};

// GET /api/pricing (Public) — Cari aktiv qiymətləri gətir
export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "system_service_pricing" },
    });

    let pricing = DEFAULT_PRICING;
    if (setting && setting.value) {
      try {
        pricing = { ...DEFAULT_PRICING, ...JSON.parse(setting.value) };
      } catch {}
    }

    return Response.json({ pricing });
  } catch (error) {
    return Response.json({ pricing: DEFAULT_PRICING, error: error.message });
  }
}

// POST /api/admin/pricing (Admin Only) — Qiymətləri dəyiş və yadda saxla
export async function POST(request) {
  const authUser = await getAuthUser(request);
  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { pricing } = body;

    if (!pricing || typeof pricing !== "object") {
      return Response.json({ error: "Yanlış pricing formatı" }, { status: 400 });
    }

    const updated = {
      ...DEFAULT_PRICING,
      ...pricing,
    };

    const setting = await prisma.setting.upsert({
      where: { key: "system_service_pricing" },
      create: {
        key: "system_service_pricing",
        value: JSON.stringify(updated),
      },
      update: {
        value: JSON.stringify(updated),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authUser.sub,
        action: "SERVICE_PRICING_UPDATED",
        entity: "Setting",
        entityId: setting.id,
        metadata: { newPricing: updated },
      },
    }).catch(() => {});

    return Response.json({ success: true, pricing: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
