// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  chartConfigs;
  websiteVersions;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.chartConfigs = /* @__PURE__ */ new Map();
    this.websiteVersions = /* @__PURE__ */ new Map();
    this.initializeDefaultVersion();
  }
  async initializeDefaultVersion() {
    if (this.websiteVersions.size === 0) {
      const defaultVersion = {
        id: "default-version",
        name: "Default Presentation",
        description: "Default presentation version",
        isActive: true,
        chartConfigs: [],
        contentData: {},
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      this.websiteVersions.set("default-version", defaultVersion);
    }
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Chart operations
  async getChartConfig(id) {
    return this.chartConfigs.get(id);
  }
  async getChartConfigsByType(chartType) {
    return Array.from(this.chartConfigs.values()).filter((config) => config.chartType === chartType);
  }
  async getAllChartConfigs() {
    return Array.from(this.chartConfigs.values());
  }
  async createChartConfig(config) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const newConfig = {
      ...config,
      styling: config.styling || null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.chartConfigs.set(id, newConfig);
    return newConfig;
  }
  async updateChartConfig(id, config) {
    const existing = this.chartConfigs.get(id);
    if (!existing) throw new Error("Chart config not found");
    const updated = {
      ...existing,
      ...config,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.chartConfigs.set(id, updated);
    return updated;
  }
  async deleteChartConfig(id) {
    this.chartConfigs.delete(id);
  }
  // Website version operations
  async getWebsiteVersion(id) {
    return this.websiteVersions.get(id);
  }
  async getAllWebsiteVersions() {
    return Array.from(this.websiteVersions.values());
  }
  async getActiveWebsiteVersion() {
    return Array.from(this.websiteVersions.values()).find((v) => v.isActive);
  }
  async createWebsiteVersion(version) {
    const id = randomUUID();
    const now = /* @__PURE__ */ new Date();
    const newVersion = {
      ...version,
      description: version.description || null,
      isActive: version.isActive || false,
      contentData: version.contentData || {},
      id,
      createdAt: now,
      updatedAt: now
    };
    this.websiteVersions.set(id, newVersion);
    return newVersion;
  }
  async updateWebsiteVersion(id, version) {
    const existing = this.websiteVersions.get(id);
    if (!existing) throw new Error("Website version not found");
    const updated = {
      ...existing,
      ...version,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.websiteVersions.set(id, updated);
    return updated;
  }
  async deleteWebsiteVersion(id) {
    this.websiteVersions.delete(id);
  }
  async setActiveWebsiteVersion(id) {
    const versions = Array.from(this.websiteVersions.entries());
    for (const [versionId, version2] of versions) {
      this.websiteVersions.set(versionId, { ...version2, isActive: false });
    }
    const version = this.websiteVersions.get(id);
    if (version) {
      this.websiteVersions.set(id, {
        ...version,
        isActive: true,
        updatedAt: /* @__PURE__ */ new Date()
      });
    }
  }
  // Content data operations
  async updateContentData(sectionKey, data) {
    const activeVersion = await this.getActiveWebsiteVersion();
    if (!activeVersion) {
      throw new Error("No active website version found");
    }
    const currentContentData = activeVersion.contentData || {};
    currentContentData[sectionKey] = data;
    await this.updateWebsiteVersion(activeVersion.id, {
      contentData: currentContentData
    });
  }
  async getContentData(sectionKey) {
    const activeVersion = await this.getActiveWebsiteVersion();
    if (!activeVersion) {
      return sectionKey ? null : {};
    }
    const contentData = activeVersion.contentData || {};
    return sectionKey ? contentData[sectionKey] : contentData;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var chartConfigs = pgTable("chart_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  chartType: text("chart_type").notNull(),
  // 'revenue', 'funds', 'market', etc.
  data: jsonb("data").notNull(),
  styling: jsonb("styling"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var websiteVersions = pgTable("website_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(false),
  chartConfigs: jsonb("chart_configs").notNull(),
  // Array of chart config IDs
  contentData: jsonb("content_data").notNull().default("{}"),
  // All content sections data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertChartConfigSchema = createInsertSchema(chartConfigs).pick({
  name: true,
  chartType: true,
  data: true,
  styling: true
});
var insertWebsiteVersionSchema = createInsertSchema(websiteVersions).pick({
  name: true,
  description: true,
  isActive: true,
  chartConfigs: true,
  contentData: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/charts", async (req, res) => {
    try {
      const charts = await storage.getAllChartConfigs();
      res.json(charts);
    } catch (error) {
      console.error("Error fetching charts:", error);
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });
  app2.get("/api/charts/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const charts = await storage.getChartConfigsByType(type);
      res.json(charts);
    } catch (error) {
      console.error("Error fetching charts by type:", error);
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });
  app2.post("/api/charts", async (req, res) => {
    try {
      const validatedData = insertChartConfigSchema.parse(req.body);
      const chart = await storage.createChartConfig(validatedData);
      res.status(201).json(chart);
    } catch (error) {
      console.error("Error creating chart:", error);
      res.status(400).json({ message: "Invalid chart data" });
    }
  });
  app2.put("/api/charts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertChartConfigSchema.partial().parse(req.body);
      const chart = await storage.updateChartConfig(id, validatedData);
      res.json(chart);
    } catch (error) {
      console.error("Error updating chart:", error);
      res.status(400).json({ message: "Failed to update chart" });
    }
  });
  app2.delete("/api/charts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteChartConfig(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting chart:", error);
      res.status(500).json({ message: "Failed to delete chart" });
    }
  });
  app2.get("/api/content/:sectionKey?", async (req, res) => {
    try {
      const { sectionKey } = req.params;
      const contentData = await storage.getContentData(sectionKey);
      res.json(contentData);
    } catch (error) {
      console.error("Error fetching content data:", error);
      res.status(500).json({ message: "Failed to fetch content data" });
    }
  });
  app2.put("/api/content/:sectionKey", async (req, res) => {
    try {
      const { sectionKey } = req.params;
      const data = req.body;
      await storage.updateContentData(sectionKey, data);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating content data:", error);
      res.status(500).json({ message: "Failed to update content data" });
    }
  });
  app2.get("/api/versions", async (req, res) => {
    try {
      const versions = await storage.getAllWebsiteVersions();
      res.json(versions);
    } catch (error) {
      console.error("Error fetching versions:", error);
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });
  app2.get("/api/versions/active", async (req, res) => {
    try {
      const version = await storage.getActiveWebsiteVersion();
      res.json(version);
    } catch (error) {
      console.error("Error fetching active version:", error);
      res.status(500).json({ message: "Failed to fetch active version" });
    }
  });
  app2.post("/api/versions", async (req, res) => {
    try {
      const validatedData = insertWebsiteVersionSchema.parse(req.body);
      const version = await storage.createWebsiteVersion(validatedData);
      res.status(201).json(version);
    } catch (error) {
      console.error("Error creating version:", error);
      res.status(400).json({ message: "Invalid version data" });
    }
  });
  app2.put("/api/versions/:id/activate", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.setActiveWebsiteVersion(id);
      res.status(200).json({ message: "Version activated" });
    } catch (error) {
      console.error("Error activating version:", error);
      res.status(500).json({ message: "Failed to activate version" });
    }
  });
  app2.delete("/api/versions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteWebsiteVersion(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting version:", error);
      res.status(500).json({ message: "Failed to delete version" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
