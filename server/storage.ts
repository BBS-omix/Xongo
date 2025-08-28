import { 
  users, 
  chartConfigs, 
  websiteVersions,
  type User, 
  type InsertUser,
  type ChartConfig,
  type InsertChartConfig,
  type WebsiteVersion,
  type InsertWebsiteVersion
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Chart operations
  getChartConfig(id: string): Promise<ChartConfig | undefined>;
  getChartConfigsByType(chartType: string): Promise<ChartConfig[]>;
  getAllChartConfigs(): Promise<ChartConfig[]>;
  createChartConfig(config: InsertChartConfig): Promise<ChartConfig>;
  updateChartConfig(id: string, config: Partial<InsertChartConfig>): Promise<ChartConfig>;
  deleteChartConfig(id: string): Promise<void>;
  
  // Website version operations
  getWebsiteVersion(id: string): Promise<WebsiteVersion | undefined>;
  getAllWebsiteVersions(): Promise<WebsiteVersion[]>;
  getActiveWebsiteVersion(): Promise<WebsiteVersion | undefined>;
  createWebsiteVersion(version: InsertWebsiteVersion): Promise<WebsiteVersion>;
  updateWebsiteVersion(id: string, version: Partial<InsertWebsiteVersion>): Promise<WebsiteVersion>;
  deleteWebsiteVersion(id: string): Promise<void>;
  setActiveWebsiteVersion(id: string): Promise<void>;
  
  // Content data operations
  updateContentData(sectionKey: string, data: any): Promise<void>;
  getContentData(sectionKey?: string): Promise<any>;
}

// Memory storage for development/fallback
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chartConfigs: Map<string, ChartConfig>;
  private websiteVersions: Map<string, WebsiteVersion>;

  constructor() {
    this.users = new Map();
    this.chartConfigs = new Map();
    this.websiteVersions = new Map();
    
    // Create a default website version if none exist
    this.initializeDefaultVersion();
  }

  private async initializeDefaultVersion() {
    // Only create if no versions exist
    if (this.websiteVersions.size === 0) {
      const defaultVersion: WebsiteVersion = {
        id: 'default-version',
        name: 'Default Presentation',
        description: 'Default presentation version',
        isActive: true,
        chartConfigs: [],
        contentData: {},
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.websiteVersions.set('default-version', defaultVersion);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Chart operations
  async getChartConfig(id: string): Promise<ChartConfig | undefined> {
    return this.chartConfigs.get(id);
  }

  async getChartConfigsByType(chartType: string): Promise<ChartConfig[]> {
    return Array.from(this.chartConfigs.values()).filter(config => config.chartType === chartType);
  }

  async getAllChartConfigs(): Promise<ChartConfig[]> {
    return Array.from(this.chartConfigs.values());
  }

  async createChartConfig(config: InsertChartConfig): Promise<ChartConfig> {
    const id = randomUUID();
    const now = new Date();
    const newConfig: ChartConfig = { 
      ...config,
      styling: config.styling || null,
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.chartConfigs.set(id, newConfig);
    return newConfig;
  }

  async updateChartConfig(id: string, config: Partial<InsertChartConfig>): Promise<ChartConfig> {
    const existing = this.chartConfigs.get(id);
    if (!existing) throw new Error('Chart config not found');
    
    const updated: ChartConfig = {
      ...existing,
      ...config,
      updatedAt: new Date()
    };
    this.chartConfigs.set(id, updated);
    return updated;
  }

  async deleteChartConfig(id: string): Promise<void> {
    this.chartConfigs.delete(id);
  }

  // Website version operations
  async getWebsiteVersion(id: string): Promise<WebsiteVersion | undefined> {
    return this.websiteVersions.get(id);
  }

  async getAllWebsiteVersions(): Promise<WebsiteVersion[]> {
    return Array.from(this.websiteVersions.values());
  }

  async getActiveWebsiteVersion(): Promise<WebsiteVersion | undefined> {
    return Array.from(this.websiteVersions.values()).find(v => v.isActive);
  }

  async createWebsiteVersion(version: InsertWebsiteVersion): Promise<WebsiteVersion> {
    const id = randomUUID();
    const now = new Date();
    const newVersion: WebsiteVersion = {
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

  async updateWebsiteVersion(id: string, version: Partial<InsertWebsiteVersion>): Promise<WebsiteVersion> {
    const existing = this.websiteVersions.get(id);
    if (!existing) throw new Error('Website version not found');
    
    const updated: WebsiteVersion = {
      ...existing,
      ...version,
      updatedAt: new Date()
    };
    this.websiteVersions.set(id, updated);
    return updated;
  }

  async deleteWebsiteVersion(id: string): Promise<void> {
    this.websiteVersions.delete(id);
  }

  async setActiveWebsiteVersion(id: string): Promise<void> {
    // Set all versions to inactive
    const versions = Array.from(this.websiteVersions.entries());
    for (const [versionId, version] of versions) {
      this.websiteVersions.set(versionId, { ...version, isActive: false });
    }
    
    // Set the specified version to active
    const version = this.websiteVersions.get(id);
    if (version) {
      this.websiteVersions.set(id, { 
        ...version, 
        isActive: true,
        updatedAt: new Date()
      });
    }
  }

  // Content data operations
  async updateContentData(sectionKey: string, data: any): Promise<void> {
    const activeVersion = await this.getActiveWebsiteVersion();
    if (!activeVersion) {
      throw new Error('No active website version found');
    }

    const currentContentData = activeVersion.contentData as any || {};
    currentContentData[sectionKey] = data;

    await this.updateWebsiteVersion(activeVersion.id, {
      contentData: currentContentData
    });
  }

  async getContentData(sectionKey?: string): Promise<any> {
    const activeVersion = await this.getActiveWebsiteVersion();
    if (!activeVersion) {
      return sectionKey ? null : {};
    }

    const contentData = activeVersion.contentData as any || {};
    return sectionKey ? contentData[sectionKey] : contentData;
  }
}

// Use memory storage for development
export const storage = new MemStorage();