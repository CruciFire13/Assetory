import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  boolean,
  text,
  integer,
} from "drizzle-orm/pg-core";

// Folder table
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  parentId: uuid("parent_id"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  isFavorite: boolean("is_favorite").default(false),
  isTrashed: boolean("is_trashed").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

// Asset table
export const assets = pgTable("assets", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  folderId: uuid("folder_id"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  isFavorite: boolean("is_favorite").default(false),
  isTrashed: boolean("is_trashed").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});
