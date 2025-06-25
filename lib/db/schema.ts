import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table (Clerk user ID)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  profileImageUrl: text("profile_image_url"),
  storageUsed: integer("storage_used").notNull().default(0), // in bytes
  createdAt: timestamp("created_at").defaultNow(),
});

// Folders
export const folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  parentId: uuid("parent_id"),
  userId: text("user_id").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  isTrashed: boolean("is_trashed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assets (files)
export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  folderId: uuid("folder_id"),
  userId: text("user_id").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  isTrashed: boolean("is_trashed").default(false),
  fileId: text("file_id"), // Added for ImageKit
  createdAt: timestamp("created_at").defaultNow(),
});

// Shared Access
export const sharedAccess = pgTable("shared_access", {
  id: uuid("id").defaultRandom().primaryKey(),
  sharedBy: text("shared_by").notNull(), // Owner userId
  sharedWith: text("shared_with").notNull(), // Target userId
  type: text("type").notNull(), // 'folder' | 'asset'
  itemId: uuid("item_id").notNull(), // folderId or assetId
  createdAt: timestamp("created_at").defaultNow(),
});


// Relations
// Folders → can have many Assets and many nested Folders
export const foldersRelations = relations(folders, ({ many, one }) => ({
  assets: many(assets),
  children: many(folders, { relationName: "folder_children" }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: "folder_children"
  }),
  user: one(users, {
    fields: [folders.userId],
    references: [users.id]
  }),
  sharedUsers: many(sharedAccess)
}));

// Assets → belong to a folder and user
export const assetsRelations = relations(assets, ({ one, many }) => ({
  folder: one(folders, {
    fields: [assets.folderId],
    references: [folders.id]
  }),
  user: one(users, {
    fields: [assets.userId],
    references: [users.id]
  }),
  sharedUsers: many(sharedAccess)
}));

// Users → own assets and folders
export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  assets: many(assets),
  shared: many(sharedAccess)
}));

// Shared Access (many-to-many between assets/folders and users)
export const sharedAccessRelations = relations(sharedAccess, ({ one }) => ({
  sharedByUser: one(users, {
    fields: [sharedAccess.sharedBy],
    references: [users.id],
    relationName: "shared_by_user",
  }),
  sharedWithUser: one(users, {
    fields: [sharedAccess.sharedWith],
    references: [users.id],
    relationName: "shared_with_user",
  }),
}));

// Type Inference
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectFolder = typeof folders.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;

export type SelectAsset = typeof assets.$inferSelect;
export type InsertAsset = typeof assets.$inferInsert;

export type SelectSharedAccess = typeof sharedAccess.$inferSelect;
export type InsertSharedAccess = typeof sharedAccess.$inferInsert;