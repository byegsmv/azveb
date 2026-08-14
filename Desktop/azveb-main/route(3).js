import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { storeCreateSchema } from "@/lib/validators";
import slugify from "slugify";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const ownerId = searchParams.get("ownerId");

  const where = {
    isActive: true,
    ...(ownerId ? { ownerId } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
  };

  const stores = await prisma.store.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { fullName: true } } },
  });

  return Response.json({ stores });
}

export async function POST(request) {
  const authUser = await getAuthUser(request);
  if (!authUser) {
    return Response.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const isAdmin = authUser && ["ADMIN", "SUPER_ADMIN"].includes(authUser.role);

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Yanlış JSON formatı" }, { status: 400 });
  }

  const parsed = storeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validasiya xətası", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { targetUserId, ownerId: bodyOwnerId, isActive: customIsActive, isVerified: customIsVerified, ...data } = parsed.data;

  let finalOwnerId = authUser.sub;

  const requestedTargetId = targetUserId || bodyOwnerId;
  if (requestedTargetId) {
    if (!isAdmin) {
      return Response.json(
        { error: "Başka bir üye adına mağaza oluşturma yetkiniz bulunmamaktadır." },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: requestedTargetId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return Response.json({ error: "Belirtilen hedef kullanıcı bulunamadı." }, { status: 404 });
    }

    finalOwnerId = targetUser.id;
  }

  const baseSlug = slugify(data.name, { lower: true, strict: true }) || `magaza-${Date.now().toString(36)}`;
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.store.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  let isActiveState = false;
  let isVerifiedState = false;

  if (isAdmin) {
    isActiveState = customIsActive !== undefined ? customIsActive : true;
    isVerifiedState = customIsVerified !== undefined ? customIsVerified : true;
  } else {
    const activeStoresCount = await prisma.store.count({
      where: { ownerId: finalOwnerId, isActive: true },
    });
    isActiveState = activeStoresCount === 0;
  }

  const store = await prisma.store.create({
    data: {
      ...data,
      slug,
      ownerId: finalOwnerId,
      isActive: isActiveState,
      isVerified: isVerifiedState,
    },
    include: {
      owner: { select: { id: true, fullName: true, email: true, phone: true } },
    },
  });

  return Response.json(
    {
      store,
      message: isAdmin
        ? "Mağaza admin yetkisiyle sınırsız ve aktif olarak oluşturuldu."
        : isActiveState
        ? "Mağaza uğurla yaradıldı və aktivləşdirildi!"
        : "Mağaza yaradıldı, lakin deaktivdir. Aktivləşdirmək üçün adminlə əlaqə saxlayın.",
    },
    { status: 201 }
  );
}
