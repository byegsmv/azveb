import { z } from "zod";

export const storeCreateSchema = z.object({
  name: z.string().min(2, "Mağaza adı en az 2 karakter olmalıdır"),
  description: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  
  // Admin / Super Admin için eklenti alanlar:
  targetUserId: z.string().cuid("Geçersiz kullanıcı ID formatı").optional().nullable(),
  ownerId: z.string().cuid("Geçersiz kullanıcı ID formatı").optional().nullable(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});
