import { apiRequest } from "@/lib/queryClient";
import type { ChartConfig, InsertChartConfig, WebsiteVersion, InsertWebsiteVersion } from "@shared/schema";

// Chart configuration API functions
export const chartAPI = {
  getAll: async (): Promise<ChartConfig[]> => {
    const response = await fetch("/api/charts");
    return await response.json();
  },

  getByType: async (type: string): Promise<ChartConfig[]> => {
    const response = await fetch(`/api/charts/${type}`);
    return await response.json();
  },

  create: async (config: InsertChartConfig): Promise<ChartConfig> => {
    const response = await fetch("/api/charts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return await response.json();
  },

  update: async (id: string, config: Partial<InsertChartConfig>): Promise<ChartConfig> => {
    const response = await fetch(`/api/charts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    return await response.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`/api/charts/${id}`, {
      method: "DELETE",
    });
  },
};

// Content data API functions
export const contentAPI = {
  get: async (sectionKey?: string): Promise<any> => {
    const url = sectionKey ? `/api/content/${sectionKey}` : "/api/content";
    const response = await fetch(url);
    if (!response.ok) return sectionKey ? null : {};
    return await response.json();
  },

  update: async (sectionKey: string, data: any): Promise<void> => {
    await fetch(`/api/content/${sectionKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
};

// Website version API functions
export const versionAPI = {
  getAll: async (): Promise<WebsiteVersion[]> => {
    const response = await fetch("/api/versions");
    return await response.json();
  },

  getActive: async (): Promise<WebsiteVersion | null> => {
    const response = await fetch("/api/versions/active");
    if (!response.ok) return null;
    return await response.json();
  },

  create: async (version: InsertWebsiteVersion): Promise<WebsiteVersion> => {
    const response = await fetch("/api/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(version),
    });
    return await response.json();
  },

  activate: async (id: string): Promise<void> => {
    await fetch(`/api/versions/${id}/activate`, {
      method: "PUT",
    });
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`/api/versions/${id}`, {
      method: "DELETE",
    });
  },
};

// Chart data type definitions
export interface ChartDataPoint {
  [key: string]: string | number | undefined;
}

// Default chart data - Full comprehensive presentation data
export const defaultChartData = {
  revenue: [
    { month: 'Sep-25', Revenue: 0, 'Burn Rate': 312.5, Cumulative: -312.5 },
    { month: 'Oct-25', Revenue: 0, 'Burn Rate': 322.5, Cumulative: -635 },
    { month: 'Nov-25', Revenue: 0, 'Burn Rate': 358, Cumulative: -993 },
    { month: 'Dec-25', Revenue: 0, 'Burn Rate': 393.5, Cumulative: -1386.5 },
    { month: 'Jan-26', Revenue: 0, 'Burn Rate': 429, Cumulative: -1815.5 },
    { month: 'Feb-26', Revenue: 0, 'Burn Rate': 464.5, Cumulative: -2280 },
    { month: 'Mar-26', Revenue: 0, 'Burn Rate': 500, Cumulative: -2780 },
    { month: 'Apr-26', Revenue: 0, 'Burn Rate': 535.5, Cumulative: -3315.5 },
    { month: 'May-26', Revenue: 22, 'Burn Rate': 571, Cumulative: -3864.5 },
    { month: 'Jun-26', Revenue: 22, 'Burn Rate': 606.5, Cumulative: -4449 },
    { month: 'Jul-26', Revenue: 22, 'Burn Rate': 642, Cumulative: -5069 },
    { month: 'Aug-26', Revenue: 22, 'Burn Rate': 677.5, Cumulative: -5724.5 },
    { month: 'Sep-26', Revenue: 52, 'Burn Rate': 713, Cumulative: -6445.5 },
    { month: 'Oct-26', Revenue: 82, 'Burn Rate': 748.5, Cumulative: -7112 },
    { month: 'Nov-26', Revenue: 112, 'Burn Rate': 784, Cumulative: -7784 },
    { month: 'Dec-26', Revenue: 142, 'Burn Rate': 819.5, Cumulative: -8461.5 },
    { month: 'Jan-27', Revenue: 172, 'Burn Rate': 855, Cumulative: -9144.5 },
    { month: 'Feb-27', Revenue: 202, 'Burn Rate': 890.5, Cumulative: -9833 },
    { month: 'Mar-27', Revenue: 232, 'Burn Rate': 926, Cumulative: -10527 },
    { month: 'Apr-27', Revenue: 262, 'Burn Rate': 961.5, Cumulative: -11226.5 },
    { month: 'May-27', Revenue: 292, 'Burn Rate': 997, Cumulative: -11931.5 },
    { month: 'Jun-27', Revenue: 322, 'Burn Rate': 1032.5, Cumulative: -12642 },
    { month: 'Jul-27', Revenue: 352, 'Burn Rate': 1068, Cumulative: -13358 },
    { month: 'Aug-27', Revenue: 382, 'Burn Rate': 1103.5, Cumulative: -14079.5 }
  ],
  funds: [
    { name: 'Hardware & Infrastructure', value: 44, amount: 300000, description: 'GPU clusters, cloud infrastructure, data storage' },
    { name: 'Team (AI/ML Engineers)', value: 48, amount: 321000, description: 'Core development team, AI specialists, ML engineers' },
    { name: 'Operations & Sales', value: 8, amount: 54000, description: 'Business operations, customer success, marketing' }
  ],
  market: [
    //{ segment: 'Artificial Intelligence', '2024': 279.22, '2030': 1811.75, cagr: '35.9%', description: 'Artificial Intelligence' },
    { segment: 'Intelligent Document Processing (IDP)', '2024': 2.30, '2030': 12.35, cagr: '33.1%', description: 'Document automation' },

    { segment: 'Intelligent Process Automation (IPA)', '2024': 14.55, '2030': 44.74, cagr: '22.6%', description: 'Core automation market' },
    { segment: 'Computer Vision', '2024': 19.82, '2030': 58.29, cagr: '19.8%', description: 'Image and video processing' },
    { segment: 'AI Orchestration Platforms', '2024': 12.91, '2030': 39.04, cagr: '20.3%', description: 'Workflow automation' },
    { segment: 'MLOps Platforms', '2024': 2.19, '2030': 16.61, cagr: '40.1%', description: 'ML pipeline management' },
    { segment: 'Knowledge Graphs', '2024': 1.07, '2030': 6.94, cagr: '36.7%', description: 'Data relationship mapping' },
    { segment: 'Vector Databases', '2024': 1.66, '2030': 7.34, cagr: '28.5%', description: 'AI-powered data storage' }
  ],
  unitEconomics: [
    { 
      name: 'SMB (Basic)', 
      value: 42, 
      acv: '$24K', 
      salesCycle: '4-8 weeks',
      cacPayback: '6-12 months',
      description: 'Small businesses, 1-2 agents'
    },
    { 
      name: 'Mid-Market (Pro)', 
      value: 33, 
      acv: '$96K', 
      salesCycle: '8-12 weeks',
      cacPayback: '9-15 months',
      description: 'Medium businesses, up to 5 agents'
    },
    { 
      name: 'Enterprise', 
      value: 25, 
      acv: '$144K', 
      salesCycle: '9-15 months',
      cacPayback: '12-18 months',
      description: '1000+ employees, unlimited agents'
    }
  ],
  // Turkish Financial Charts Data
  turkishInvestment: [
    { name: 'Hardware & Infrastructure', value: 44.4, amount: 300, description: 'GPU clusters, cloud infrastructure, data storage' },
    { name: 'Personnel (AI/ML Team)', value: 47.6, amount: 322, description: 'Core development team, AI specialists, ML engineers' },
    { name: 'Operations & Other', value: 8, amount: 54, description: 'Business operations, customer success, marketing' }
  ],
  turkishRevenue: [
    { month: '2026 Mayıs', revenue: 22000, expense: 571000, pilots: 3 },
    { month: '2026 Haziran', revenue: 44000, expense: 606500, pilots: 3 },
    { month: '2026 Temmuz', revenue: 44000, expense: 642000, pilots: 3 },
    { month: '2026 Ağustos', revenue: 44000, expense: 677500, pilots: 3 },
    { month: '2026 Eylül', revenue: 52000, expense: 719000, pilots: 3 },
    { month: '2026 Ekim', revenue: 82000, expense: 760500, pilots: 4 },
    { month: '2026 Kasım', revenue: 112000, expense: 802000, pilots: 5 },
    { month: '2026 Aralık', revenue: 142000, expense: 843500, pilots: 6 },
    { month: '2027 Ocak', revenue: 172000, expense: 885000, pilots: 7 },
    { month: '2027 Şubat', revenue: 202000, expense: 926500, pilots: 8 },
    { month: '2027 Mart', revenue: 232000, expense: 968000, pilots: 9 },
    { month: '2027 Nisan', revenue: 262000, expense: 1009500, pilots: 10 },
    { month: '2027 Mayıs', revenue: 292000, expense: 1051000, pilots: 11 }
  ],
  treemap: [
    { 
      name: 'Enterprise',
      value: 60,
      acv: '$120K-250K+',
      color: '#60A5FA',
      description: 'Large enterprises with complex workflows'
    },
    { 
      name: 'Mid-Market',
      value: 30,
      acv: '$40K-96K',
      color: '#34D399',
      highlighted: true,
      description: 'Growing businesses with structured processes'
    },
    { 
      name: 'SMB',
      value: 10,
      acv: '$8K-24K',
      color: '#A78BFA',
      description: 'Small businesses starting automation journey'
    }
  ]
};

// Chart styling options
export const chartStyling = {
  colors: {
    primary: 'hsl(217, 91%, 60%)',
    success: 'hsl(142, 76%, 36%)',
    warning: 'hsl(43, 96%, 56%)',
    danger: 'hsl(0, 84%, 60%)',
    info: 'hsl(200, 100%, 70%)',
    purple: 'hsl(271, 81%, 56%)',
  },
  pieColors: [
    'hsl(217, 91%, 60%)', 
    'hsl(142, 76%, 36%)', 
    'hsl(43, 96%, 56%)',
    'hsl(0, 84%, 60%)',
    'hsl(271, 81%, 56%)',
    'hsl(200, 100%, 70%)'
  ]
};