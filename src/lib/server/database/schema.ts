import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    discordId: text("discord_id").notNull(),
    createdAt: integer("created_at").notNull(),
    createdIp: text("created_ip").notNull(),
  },
  (table) => ({
    discordIdx: index("discord_idx").on(table.discordId),
  }),
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const images = sqliteTable(
  "images",
  {
    id: text("id").primaryKey(),
    type: text("type"),
    verified: integer("verified").default(0),
    name: text("name"),
    uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
  },
  (table) => ({
    typeIdx: index("type_idx").on(table.type),
  }),
);

export const imageReports = sqliteTable("image_reports", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  createdIp: text("created_ip").notNull(),
  imageId: text("image_id").references(() => images.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});

export const imageLikes = sqliteTable("image_likes", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  createdIp: text("created_ip").notNull(),
  imageId: text("image_id").references(() => images.id, { onDelete: "cascade" }),
});

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  path: text("path").notNull(),
  served: integer("served").default(0),
  createdAt: integer("created_at").notNull(),
});
