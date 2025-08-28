import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChartConfigSchema, insertWebsiteVersionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chart configuration routes
  app.get("/api/charts", async (req, res) => {
    try {
      const charts = await storage.getAllChartConfigs();
      res.json(charts);
    } catch (error) {
      console.error("Error fetching charts:", error);
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  app.get("/api/charts/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const charts = await storage.getChartConfigsByType(type);
      res.json(charts);
    } catch (error) {
      console.error("Error fetching charts by type:", error);
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  app.post("/api/charts", async (req, res) => {
    try {
      const validatedData = insertChartConfigSchema.parse(req.body);
      const chart = await storage.createChartConfig(validatedData);
      res.status(201).json(chart);
    } catch (error) {
      console.error("Error creating chart:", error);
      res.status(400).json({ message: "Invalid chart data" });
    }
  });

  app.put("/api/charts/:id", async (req, res) => {
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

  app.delete("/api/charts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteChartConfig(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting chart:", error);
      res.status(500).json({ message: "Failed to delete chart" });
    }
  });

  // Content data routes
  app.get("/api/content/:sectionKey?", async (req, res) => {
    try {
      const { sectionKey } = req.params;
      const contentData = await storage.getContentData(sectionKey);
      res.json(contentData);
    } catch (error) {
      console.error("Error fetching content data:", error);
      res.status(500).json({ message: "Failed to fetch content data" });
    }
  });

  app.put("/api/content/:sectionKey", async (req, res) => {
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

  // Website version routes
  app.get("/api/versions", async (req, res) => {
    try {
      const versions = await storage.getAllWebsiteVersions();
      res.json(versions);
    } catch (error) {
      console.error("Error fetching versions:", error);
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });

  app.get("/api/versions/active", async (req, res) => {
    try {
      const version = await storage.getActiveWebsiteVersion();
      res.json(version);
    } catch (error) {
      console.error("Error fetching active version:", error);
      res.status(500).json({ message: "Failed to fetch active version" });
    }
  });

  app.post("/api/versions", async (req, res) => {
    try {
      const validatedData = insertWebsiteVersionSchema.parse(req.body);
      const version = await storage.createWebsiteVersion(validatedData);
      res.status(201).json(version);
    } catch (error) {
      console.error("Error creating version:", error);
      res.status(400).json({ message: "Invalid version data" });
    }
  });

  app.put("/api/versions/:id/activate", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.setActiveWebsiteVersion(id);
      res.status(200).json({ message: "Version activated" });
    } catch (error) {
      console.error("Error activating version:", error);
      res.status(500).json({ message: "Failed to activate version" });
    }
  });

  app.delete("/api/versions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteWebsiteVersion(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting version:", error);
      res.status(500).json({ message: "Failed to delete version" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
