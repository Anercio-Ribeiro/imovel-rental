// ============================================================
// src/app/api/upload/route.ts
// POST multipart/form-data → upload to Azure Blob Storage
// Returns { url: string } with the public Azure blob URL
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToAzure } from "@/lib/azure-storage";

// Max 10 MB per image
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES  = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export const runtime = "nodejs"; // Azure SDK needs Node runtime (not edge)

export async function POST(req: NextRequest) {
  try {
    // Auth — only logged-in owners/admins can upload
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json({ message: "Only owners can upload images" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP` },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { message: `File too large (max 10 MB)` },
        { status: 400 }
      );
    }

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Azure
    const url = await uploadToAzure({
      buffer,
      filename:    file.name,
      contentType: file.type,
      folder:      `properties/${session.user.id}`,
    });

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

// DELETE /api/upload — remove a blob by URL
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json() as { url?: string };
    if (!url) {
      return NextResponse.json({ message: "url is required" }, { status: 400 });
    }

    const { deleteFromAzure } = await import("@/lib/azure-storage");
    await deleteFromAzure(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/upload]", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
