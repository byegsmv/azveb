const rateLimitMap = new Map();

export function rateLimit(request, { limit = 10, windowMs = 60_000, keyPrefix = "default" }) {
  const ip = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  if (rateLimitMap.size > 5000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) rateLimitMap.delete(k);
    }
  }

  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(key, record);

  if (record.count > limit) {
    return Response.json(
      { error: "Çox az vaxtda həddindən artıq sorğu göndərildi. Zəhmət olmasa bir qədər gözləyin." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)) } }
    );
  }

  return null;
}
