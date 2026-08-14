// =================================================================
// FERMERMARKET.AZ - ADMİN BANK KARTI & M10 ÖDƏNİŞ REKVİZİTLƏRİ API
// =================================================================
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireRole } from "@/lib/auth";

const DEFAULT_ACCOUNTS = [
  {
    id: "card_kapital",
    type: "CARD",
    title: "Bank Kartı (Kapital Bank / BirBank)",
    accountNumber: "4169 7388 0000 0000",
    holderName: "FermerMarket MMC",
    bankName: "Kapital Bank",
    isActive: true,
    note: "Kartdan karta (C2C) köçürmə",
  },
  {
    id: "m10_wallet",
    type: "M10",
    title: "M10 Pul Qabı",
    accountNumber: "050 123 45 67",
    holderName: "FermerMarket",
    bankName: "M10 (PashaPay)",
    isActive: true,
    note: "M10 tətbiqindən komissiyasız köçürmə",
  },
  {
    id: "emanat_million",
    type: "TERMINAL",
    title: "MilliÖN / eManat Terminalı",
    accountNumber: "994501234567",
    holderName: "FermerMarket Hesabı",
    bankName: "MilliÖN / eManat",
    isActive: true,
    note: "Terminal vasitəsilə nağd ödəmə",
  },
];

// GET /api/admin/payment-accounts — Bütün rekvizitləri gətir
// GET /api/payment-accounts (Public) — Yalnız aktiv rekvizitləri gətir
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const isAdmin = authUser && ["ADMIN", "SUPER_ADMIN"].includes(authUser.role);

    let setting = await prisma.setting.findUnique({
      where: { key: "admin_payment_accounts" },
    });

    let accounts = DEFAULT_ACCOUNTS;
    if (setting && setting.value) {
      try {
        accounts = JSON.parse(setting.value);
      } catch {}
    }

    // Əgər adi istifadəçidirsə, yalnız aktivləri göstər
    if (!isAdmin) {
      accounts = accounts.filter((a) => a.isActive);
    }

    return Response.json({ accounts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/payment-accounts — Admin yeni rekvizit əlavə edir və ya yeniləyir
export async function POST(request) {
  const authUser = await getAuthUser(request);
  const denied = requireRole(authUser, ["ADMIN", "SUPER_ADMIN"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { accounts } = body;

    if (!Array.isArray(accounts)) {
      return Response.json({ error: "accounts massiv formatında olmalıdır" }, { status: 400 });
    }

    const updatedSetting = await prisma.setting.upsert({
      where: { key: "admin_payment_accounts" },
      create: {
        key: "admin_payment_accounts",
        value: JSON.stringify(accounts),
      },
      update: {
        value: JSON.stringify(accounts),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authUser.sub,
        action: "PAYMENT_ACCOUNTS_UPDATED",
        entity: "Setting",
        entityId: updatedSetting.id,
        metadata: { count: accounts.length },
      },
    }).catch(() => {});

    return Response.json({ success: true, accounts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
