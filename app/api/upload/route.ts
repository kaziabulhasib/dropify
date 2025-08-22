import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const userId = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    // parse request body
    const body = await request.json();
    const { imagekit, userId: bodyUserId } = body;
    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!imagekit || !imagekit.url) {
      return NextResponse.json(
        { error: "invalid file upload data" },
        { status: 401 }
      );
    }
    // Extract file information from ImageKit response
    const fileData = {
      name: imagekit.name || "Untitled",
      path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId,
      parentId: null, // Root level by default
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };
    const [newfile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json(newfile);
  } catch (error) {
    return NextResponse.json({
      error: "Failed t save info to database ",
    });
  }
}
