import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Safe handling without hard DB dependency for serverless edge
    console.log("New contact message received:", validated);

    return NextResponse.json(
      { success: true, data: { id: "msg_" + Date.now() } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: error.errors[0].message } },
        { status: 400 }
      );
    }
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to send message" } },
      { status: 500 }
    );
  }
}
