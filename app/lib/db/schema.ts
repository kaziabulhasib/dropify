import { integer, pgTable, serial, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const files=pgTable("files", {
    id : uuid("id").primaryKey().defaultRandom(),
    // basic file/folder info
    name:text("name").notNull(),
    path:text("path").notNull(), // folder/folder/file.txt
    size:integer("size").notNull(),
    type:text("type").notNull(), // "folder"

    // storage info
    fileUrl:text("file_url").notNull(), // s3 url
    thumbnailUrl:text("thumbnail_url"), // s3 ur

    // ownership info

    userId:text("user_id").notNull(),
    parentId:text("parent_id"), // null for root

    // file folder flag 
    isFolder:boolean("is_folder").notNull().default(false),
    isStarred:boolean("is_starred").notNull().default(false),
    isTrashed:boolean("is_trashed").notNull().default(false),

    // isPinned:boolean("is_pinned").notNull().default(false), ---> to do later

    // timestamps
    createdAt:timestamp("created_at").notNull().defaultNow(),
    updatedAt:timestamp("updated_at").notNull().defaultNow(),

  

})