import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Chart configurations table
export const chartConfigs = pgTable("chart_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  chartType: text("chart_type").notNull(), // 'revenue', 'funds', 'market', etc.
  data: jsonb("data").notNull(),
  styling: jsonb("styling"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Website versions table
export const websiteVersions = pgTable("website_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(false),
  chartConfigs: jsonb("chart_configs").notNull(), // Array of chart config IDs
  contentData: jsonb("content_data").notNull().default('{}'), // All content sections data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertChartConfigSchema = createInsertSchema(chartConfigs).pick({
  name: true,
  chartType: true,
  data: true,
  styling: true,
});

export const insertWebsiteVersionSchema = createInsertSchema(websiteVersions).pick({
  name: true,
  description: true,
  isActive: true,
  chartConfigs: true,
  contentData: true,
});

export type InsertChartConfig = z.infer<typeof insertChartConfigSchema>;
export type ChartConfig = typeof chartConfigs.$inferSelect;
export type InsertWebsiteVersion = z.infer<typeof insertWebsiteVersionSchema>;
export type WebsiteVersion = typeof websiteVersions.$inferSelect;
