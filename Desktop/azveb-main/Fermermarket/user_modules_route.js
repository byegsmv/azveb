// =================================================================
// FERMERMARKET.AZ - ROL VƏ İSTİFADƏÇİ MODULLARI İDARƏETMƏSİ
// (INSTALLMENTS / BirKart & TamKart Hissəli Ödəniş Dəstəkli)
// =================================================================
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireRole } from "@/lib/auth";

export const VALID_MODULES = [
  "WALLET",
  "BLOG",
  "BUNDLES",
  "CORPORATE_LISTINGS",
  "AI_AGRONOM",
  "ANALYTICS",
  "CAMPAIGNS",
  "BULK_CSV",
  "DELIVERY",
  "LEADERBOARD",
  "INSTALLMENTS", // BirKart, TamKart, Bolkart ilə hissəli ödəniş modulu (Default: Deaktiv)
];

// GET /api/admin/user-modules — İstifadəçinin modullarını siyahıla
export async function GET(request) {
  const authUser = await getAuthUser(request);
  if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || authUser.sub;

  // Əgər başqa istifadəçini yoxlayırsa, yalnız Admin baxa bilər
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(authUser.role);
  if (userId !== authUser.sub && !isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const modules = await prisma.userModule.findMany({
      where: { userId },
      select: { module: true, createdAt: true },
    });

    const activeModuleKeys = modules.map((m) => m.module);

    return Response.json({
      userId,
      activeModules: activeModuleKeys,
      allAvailableModules: VALID_MODULES,
      hasInstallments: activeModuleKeys.includes("INSTALLMENTS"),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/user-modules — Admin tərəfindən modulu Aktiv/Deaktiv et
export async function POST(request) {
  const authUser = await getAuthUser(request);
  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { userId, module, enabled } = body;

    if (!userId || !module) {
      return Response.json({ error: "userId və module tələb olunur" }, { status: 400 });
    }

    if (!VALID_MODULES.includes(module)) {
      return Response.json({ error: `Yanlış modul adı. İcazə verilənlər: ${VALID_MODULES.join(", ")}` }, { status: 422 });
    }

    if (enabled) {
      // Modulu Aktivləşdir
      await prisma.userModule.upsert({
        where: { userId_module: { userId, module } },
        create: { userId, module },
        update: {},
      });

      // Əgər INSTALLMENTS modulu aktiv edilirsə, mağazasında da qeyd et
      if (module === "INSTALLMENTS") {
        await prisma.store.updateMany({
          where: { ownerId: userId },
          data: { installmentEnabled: true },
        }).catch(() => {});
      }
    } else {
      // Modulu Deaktiv et
      await prisma.userModule.deleteMany({
        where: { userId, module },
      });

      if (module === "INSTALLMENTS") {
        await prisma.store.updateMany({
          where: { ownerId: userId },
          data: { installmentEnabled: false },
        }).catch(() => {});
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: authUser.sub,
        action: enabled ? "USER_MODULE_ENABLED" : "USER_MODULE_DISABLED",
        entity: "UserModule",
        entityId: `${userId}_${module}`,
        metadata: { targetUserId: userId, module, enabled },
      },
    }).catch(() => {});

    return Response.json({ success: true, userId, module, enabled });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
