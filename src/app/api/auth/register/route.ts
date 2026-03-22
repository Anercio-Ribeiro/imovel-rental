// ============================================================
// src/app/api/auth/register/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (!["tenant", "owner"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existing) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      phone: phone ?? null,
      role,
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
