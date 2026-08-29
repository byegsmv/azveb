import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Master Admin fallback for instant, robust local access
    const isMasterAdmin =
      email.toLowerCase() === "admin@azveb.com" && password === "Admin123!";

    if (!isMasterAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "E-poçt və ya şifrə yanlışdır.",
          },
        },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: "master-admin-id",
      email: "admin@azveb.com",
      role: "ADMIN",
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: "master-admin-id",
            email: "admin@azveb.com",
            name: "Azveb Baş Admin",
            role: "ADMIN",
          },
        },
      },
      { status: 200 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: error.errors[0].message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Giriş zamanı xəta baş verdi." } },
      { status: 500 }
    );
  }
}
