import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { useId } from "react";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { name, userId: bodyUserId, parentId = null } = body;

    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    // folder name check
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "folder name is required" },
        { status: 400 }
      );
    }
    // folder validation
    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.userId, useId),
            eq(files.isFolder, true)
          )
        );
      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 401 }
        );
      }
    }
    // create a folder in db
    const folderData = {
      id: uuidv4(),
      path: `/folders/${userId}/${uuidv4()}`,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: null,
      userId,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrashed: false,
    };

    const [newFolder] = await db.insert(files).values(folderData).returning();

    return NextResponse.json({
      success: true,
      message: "Folder cerated successfully",
      folder: newFolder,
    });
  } catch (error) {}
}
