// src/app/api/hero-slides/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { heroSlides } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const slides = await db.query.heroSlides.findMany({
      orderBy: [asc(heroSlides.order)],
    });
    return NextResponse.json(slides);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const [slide] = await db.insert(heroSlides).values(body).returning();
  return NextResponse.json(slide, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = await req.json() as { id: string } & Record<string, unknown>;
  const { id, ...data } = body;
  const [slide] = await db.update(heroSlides).set(data).where(eq(heroSlides.id, id)).returning();
  return NextResponse.json(slide);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { id } = await req.json() as { id: string };
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  return NextResponse.json({ success: true });
}
