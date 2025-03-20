import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function POST(request: NextRequest) {
  // Ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Generate a unique filename with userId to prevent collisions
    const userId = session.user.id;
    const timestamp = Date.now();
    const filename = `${userId}-${timestamp}-${file.name.replace(/\s+/g, "-")}`;
    const pathname = `${folder}/${filename}`;

    // Upload to Vercel Blob
    const { url } = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      cacheControlMaxAge: 31536000, // 1 year in seconds
    });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
} 